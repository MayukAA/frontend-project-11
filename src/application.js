import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import render from './view.js';
import ru from './locales/ru.js';

yup.setLocale({
  mixed: {
    notOneOf: 'errors.oneOf',
  },
  string: {
    url: 'errors.valid',
  },
});

const validate = (url, feeds) => {
  const schema = yup.string().required().url().notOneOf(feeds);
  return schema.validate(url);
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
    };

    const initialState = {
      processState: 'filling',
      feeds: [],
      error: {},
    };

    const state = onChange(initialState, render(elements, initialState, i18nInstance));

    // controller
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url').trim();

      validate(url, state.feeds)
        .then(() => {
          state.processState = 'successful';
          state.feeds.push(url);
          state.processState = 'filling';
        })
        .catch((err) => {
          state.error = err.errors;
          state.processState = 'failed';
          state.processState = 'filling';
        });
    });
  });
};
