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

yup.setLocale({
  mixed: {
    notOneOf: 'errors.oneOf',
  },
  string: {
    url: 'errors.valid',
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

const addId = (feedData, postsData) => {
  const feed = { ...feedData };
  const posts = [...postsData];

  const feedId = _.uniqueId();
  feed.id = feedId;

  posts.forEach((post) => {
    // eslint-disable-next-line no-param-reassign
    post.feedId = feedId;
    // eslint-disable-next-line no-param-reassign
    post.id = _.uniqueId();
  });

  return { feed, posts };
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
    };

    const initialState = {
      processState: 'filling',
      userLinks: [],
      feedsData: [],
      postsData: [],
      error: {},
    };

    const state = onChange(initialState, render(elements, initialState, i18nInstance));

    // controller
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
          const { feed, posts } = addId(feedData, postsData);
          state.feedsData.push(feed);
          state.postsData.push(posts);
          state.userLinks.push(url);
          state.processState = 'successful';
        })

        // .then(() => {
        //   state.processState = 'successful';
        //   state.feeds.push(url);
        //   state.processState = 'filling';
        // })
        .catch((err) => {
          // state.error = err.message;
          state.error = err.message === 'Network Error' ? 'errors.network' : err.message;
          state.processState = 'failed';
          state.processState = 'filling';
        });
    });
  });
};
