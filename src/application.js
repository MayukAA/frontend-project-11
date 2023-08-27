import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';

import render from './view.js';
import ru from './locales/ru.js';
import parse from './parserRss.js';

const updateHtmlTitle = (element, i18nInstance) => {
  // eslint-disable-next-line no-param-reassign
  element.textContent = i18nInstance.t('title');
};

const validate = (url, links) => {
  const schema = yup.string().required().url().notOneOf(links);

  return schema.validate(url);
};

const getUrl = (link) => {
  const allOriginsBlank = 'https://allorigins.hexlet.app/get';
  const url = new URL(allOriginsBlank);
  url.searchParams.set('disableCache', 'true');
  url.searchParams.set('url', link);

  return url;
};

const getHttpResponse = (link) => {
  const url = getUrl(link);

  return axios.get(url);
};

const addId = (postsData, feedId) => {
  const posts = [...postsData];

  posts.forEach((post) => {
    // eslint-disable-next-line no-param-reassign
    post.feedId = feedId;
    // eslint-disable-next-line no-param-reassign
    post.id = _.uniqueId();
  });

  return posts;
};

const getIdAndPostsFromState = (state, httpTitle, httpDescription) => {
  const result = {};

  state.feedsData.forEach((feed) => {
    if (feed.title === httpTitle && feed.description === httpDescription) {
      result.feedId = feed.id;
      result.requiredPosts = state.postsData.filter((post) => post.feedId === feed.id).flat();
    }
  });

  return result;
};

const addNewPosts = (state, timeout) => {
  const promises = state.userLinks.map((link) => getHttpResponse(link));
  Promise.all(promises)
    .then((responses) => {
      const parsedData = responses.map((response) => {
        const { feedData, postsData } = parse(response.data.contents);

        return { feedData, postsData };
      });

      parsedData.forEach((data) => {
        const httpTitle = data.feedData.title;
        const httpDescription = data.feedData.description;
        const { feedId, requiredPosts } = getIdAndPostsFromState(state, httpTitle, httpDescription);

        const postsWithoutIds = requiredPosts.map((post) => ({
          title: post.title,
          desc: post.desc,
          link: post.link,
        }));

        const newPosts = _.differenceWith(data.postsData, postsWithoutIds, _.isEqual);
        if (newPosts.length > 0) {
          const newPostsWithId = addId(newPosts, feedId);
          state.postsData.push(...newPostsWithId);
        }
      });
    })

    .catch((error) => {
      console.error(error);
    })

    .finally(setTimeout(() => addNewPosts(state, timeout), timeout));
};

export default () => {
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then(() => {
    const elements = {
      title: document.querySelector('title'),
      form: document.querySelector('.rss-form'),
      input: document.getElementById('url-input'),
      submitButton: document.querySelector('[type="submit"]'),
      feedback: document.querySelector('.feedback'),
      containerFeeds: document.querySelector('.feeds'),
      containerPosts: document.querySelector('.posts'),
      containerModalContent: document.querySelector('.modal-content'),
    };

    const timeout = 5000;

    yup.setLocale({
      mixed: {
        notOneOf: 'errors.oneOf',
      },
      string: {
        url: 'errors.valid',
        required: 'errors.mustNotBeEmpty',
      },
    });

    const initialState = {
      processState: 'filling',
      userLinks: [],
      feedsData: [],
      postsData: [],
      error: {},
      viewedPosts: [],
    };

    updateHtmlTitle(elements.title, i18nInstance);

    const state = onChange(initialState, render(elements, initialState, i18nInstance));

    addNewPosts(state, timeout);

    elements.form.addEventListener('input', () => {
      state.processState = 'filling';
    });

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url').trim();

      validate(url, state.userLinks)
        .then((link) => {
          state.processState = 'sending';

          return getHttpResponse(link);
        })
        .then((response) => {
          const { feedData, postsData } = parse(response.data.contents);

          const feed = { ...feedData };
          const feedId = _.uniqueId();
          feed.id = feedId;
          const posts = addId(postsData, feedId);

          state.feedsData.push(feed);
          state.postsData.push(...posts);
          state.userLinks.push(url);
          state.processState = 'successful';
        })

        .catch((err) => {
          if (err.message === 'Network Error') {
            state.error = 'errors.network';
            state.processState = 'failedNetwork';
          } else {
            state.error = err.message;
            state.processState = 'failed';
          }
        });
    });

    elements.containerPosts.addEventListener('click', (e) => {
      const postId = e.target.dataset.id;
      state.viewedPosts.push(postId);
    });
  });
};
