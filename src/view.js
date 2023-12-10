import onChange from 'on-change';
import renderPosts from './renderPosts.js';
import renderFeeds from './renderFeeds.js';
import renderModal from './renderModal.js';

const getDefaultHTML = (elements) => {
  const { input, feedback, button } = elements;
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-warning');
  feedback.classList.remove('text-success');
  input.classList.remove('is-invalid');
  input.disabled = false;
  button.disabled = true;
};

const formStatus = async (state, elements, i18next, errorMessage = undefined) => {
  const {
    input, feedback, form, button,
  } = elements;
  const { status } = state.form;
  getDefaultHTML(elements);

  const switchStatus = {
    loading: () => {
      feedback.classList.add('text-warning');
      feedback.textContent = i18next.t(`status.${status}`);
      input.disabled = true;
      button.disabled = true;
    },
    success: () => {
      feedback.classList.add('text-success');
      feedback.textContent = i18next.t(`status.${status}`);
      form.reset();
      input.focus();
    },
    failed: () => {
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      feedback.textContent = i18next.t(`errors.${[state.form.error]}`);
    },
    error: () => {
      feedback.classList.add('text-danger');
      feedback.textContent = i18next.t(`errors.${errorMessage}`);
    },
  };
  return errorMessage === undefined ? switchStatus[status]() : switchStatus.error();
};

const renderVisitedPosts = (visitedPosts) => {
  visitedPosts.forEach((id) => {
    const link = document.querySelector(`a[data-id="${id}"]`);
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal', 'link-secondary');
  });
};

const watchedChange = (state, elements, i18n) => onChange(state, (path, value) => {
  const watchedSwitch = {
    'form.status': () => {
      formStatus(state, elements, i18n);
    },
    'form.error': () => {
      formStatus(state, elements, i18n, value);
    },
    posts: () => {
      renderPosts(state, value, elements, i18n);
    },
    feeds: () => {
      renderFeeds(value, elements, i18n);
    },
    visitedPosts: () => {
      renderVisitedPosts(value);
    },
    currentPost: () => {
      renderModal(state, value);
    },
  };
  return watchedSwitch[path]();
});

export default watchedChange;
