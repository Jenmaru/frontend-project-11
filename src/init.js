import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import watchedChange from './view.js';
import ru from './locales/ru.js';
import parser from './parser.js';

const DELAY = 5000;

const getProxiedUrl = (url) => {
  const resultUrl = new URL('https://allorigins.hexlet.app/get');
  resultUrl.searchParams.set('url', url);
  resultUrl.searchParams.set('disableCache', true);
  return resultUrl;
};

const getUpdatePosts = (state) => {
  const urls = state.feeds.map((feed) => feed.url);
  const promises = urls.map((url) => axios.get(getProxiedUrl(url))
    .then((response) => {
      const data = parser(response.data.contents);

      const getCompareValue = (arrayValue, value) => arrayValue.title === value.title;
      const addedPost = _.differenceWith(data.items, state.posts, getCompareValue);

      if (addedPost.length === 0) {
        return;
      }
      state.posts = addedPost.concat(...state.posts);
    })
    .catch((err) => {
      console.error(err);
    }));

  Promise.all(promises)
    .finally(() => setTimeout(() => getUpdatePosts(state), DELAY));
};

const validateUrl = (url, urls) => yup
  .string()
  .url('invalidUrl')
  .notOneOf(urls, 'alreadyLoaded')
  .required('required')
  .validate(url);

const app = (i18n) => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type=submit]'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      status: 'filling',
      error: null,
    },
    feeds: [],
    posts: [],
    currentPost: null,
    visitedPosts: new Set(),
  };

  const watchedState = watchedChange(state, elements, i18n);

  const handleLink = (currentUrl, urls) => {
    validateUrl(currentUrl, urls)
      .then((url) => axios.get(getProxiedUrl(url)))
      .then((response) => {
        const data = parser(response.data.contents);
        const feed = {
          title: data.title,
          description: data.description,
          id: _.uniqueId(),
          url: currentUrl,
        };
        const itemsWithId = Array.from(data.items).map((item) => {
          item.id = _.uniqueId();
          return item;
        });
        data.items = itemsWithId;
        watchedState.feeds.push(feed);
        watchedState.posts.unshift(...data.items);
        watchedState.form.status = 'success';
      })
      .catch((err) => {
        watchedState.form.status = 'failed';
        if (err.name === 'AxiosError') {
          watchedState.form.error = 'network';
          return;
        }
        watchedState.form.error = err.message;
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    watchedState.form.status = 'loading';
    const currentUrl = formData.get('url');
    const urls = state.feeds.map((feed) => feed.url);
    handleLink(currentUrl, urls);
  });

  elements.posts.addEventListener('click', ({ target }) => {
    if (target.dataset.id !== undefined) {
      const { id } = target.dataset;
      watchedState.currentPost = id;
      watchedState.visitedPosts.add(id);
    }
  });

  getUpdatePosts(watchedState);
};

const init = async () => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then(() => app(i18n));
};

export default init;
