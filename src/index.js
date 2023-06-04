import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import render from './view.js';

const validate = (url, feeds) => {
  const schema = yup.string().required().url().notOneOf(feeds);
  return schema.validate(url);
};

const app = () => {
  // model
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    submitButton: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  const initialState = {
    processState: 'filling',
    feeds: [],
    error: [],
  };

  const state = onChange(initialState, render(elements, initialState));

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
        state.error.push(err);
        state.processState = 'failed';
        state.processState = 'filling';
      });
  });
};

app();
