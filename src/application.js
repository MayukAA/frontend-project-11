import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';

import render from './view.js';
import ru from './locales/ru.js';
import parser from './parserRss.js';

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

const validate = (url, links) => {
  const schema = yup.string().required().url().notOneOf(links);

  return schema.validate(url);
};

const getHttpResponse = (link) => {
  const allOriginsBlank = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
  const url = `${allOriginsBlank}${link}`;

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

const addNewPosts = (state) => {
  const promises = state.userLinks.map((link) => getHttpResponse(link));
  const promise = Promise.all(promises);

  return promise.then((response) => {
    if (response) {
      const [...responseData] = response;
      const parsedData = responseData.map((linkData) => {
        const { feedData, postsData } = parser(linkData.data.contents);
        return { feedData, postsData };
      });

      parsedData.forEach((data) => {
        const httpTitle = data.feedData.title;
        const httpDescription = data.feedData.description;

        let feedId;
        let requiredStatePostsData;

        state.feedsData.forEach((feed) => {
          if (feed.title === httpTitle && feed.description === httpDescription) {
            feedId = feed.id;
            requiredStatePostsData = state.postsData.filter((post) => post.feedId === feed.id)
              .flat();
          }
        });

        const requiredStateDataWithoutId = requiredStatePostsData.map((post) => {
          const { title, desc, link } = post;
          return { title, desc, link };
        });

        const newPosts = _.differenceWith(data.postsData, requiredStateDataWithoutId, _.isEqual);
        if (newPosts.length > 0) {
          const newPostsWithId = addId(newPosts, feedId);
          state.postsData.push(...newPostsWithId);
        }
      });
    }

    setTimeout(() => addNewPosts(state), timeout);
  });
};

// model
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
      form: document.querySelector('.rss-form'),
      input: document.getElementById('url-input'),
      submitButton: document.querySelector('[type="submit"]'),
      feedback: document.querySelector('.feedback'),
      containerFeeds: document.querySelector('.feeds'),
      containerPosts: document.querySelector('.posts'),
      containerModalContent: document.querySelector('.modal-content'),
    };

    const initialState = {
      processState: 'filling',
      userLinks: [],
      feedsData: [],
      postsData: [],
      error: {},
      viewedPosts: [],
    };

    const state = onChange(initialState, render(elements, initialState, i18nInstance));

    addNewPosts(state);

    // controller
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
          const { feedData, postsData } = parser(response.data.contents);

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
