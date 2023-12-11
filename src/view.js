import onChange from 'on-change';
import renderPosts from './renderPosts.js';
import renderFeeds from './renderFeeds.js';
import renderModal from './renderModal.js';

const getResetHTML = (elements) => {
  elements.feedback.classList.remove('text-danger', 'text-warning', 'text-success');
  elements.input.classList.remove('is-invalid');
  elements.input.disabled = false;
  elements.button.disabled = false;
};

const formStatus = async (state, elements, i18next, errorMessage = undefined) => {
  getResetHTML(elements);

  const switchStatus = {
    loading: () => {
      elements.feedback.classList.add('text-warning');
      elements.feedback.textContent = i18next.t(`status.${state.form.status}`);
      elements.input.disabled = true;
      elements.button.disabled = true;
    },
    success: () => {
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18next.t(`status.${state.form.status}`);
      elements.form.reset();
      elements.input.focus();
    },
    failed: () => {
      elements.feedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      elements.feedback.textContent = i18next.t(`errors.${[state.form.error]}`);
    },
    error: () => {
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = i18next.t(`errors.${errorMessage}`);
    },
  };
  return errorMessage === undefined ? switchStatus[state.form.status]() : switchStatus.error();
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
