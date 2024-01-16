import onChange from 'on-change';
import renderPosts from './renderPosts.js';
import renderFeeds from './renderFeeds.js';
import renderModal from './renderModal.js';

const resetHTML = (elements) => {
  elements.feedback.classList.remove('text-danger', 'text-warning', 'text-success');
  elements.input.classList.remove('is-invalid');
  elements.input.disabled = false;
  elements.button.disabled = false;
};

const error = (elements, value, i18n) => {
  elements.feedback.textContent = i18n.t(`errors.${value}`);
};

const formStatus = async (state, elements, i18next) => {
  resetHTML(elements);

  const switchStatus = {
    loading: () => {
      elements.feedback.classList.add('text-warning');
      elements.feedback.textContent = i18next.t(`status.${state.form.status}`);
      elements.input.setAttribute('disabled', 'disabled');
      elements.button.setAttribute('disabled', 'disabled');
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
  };
  return switchStatus[state.form.status]();
};

const renderVisitedPosts = (visitedPosts) => {
  visitedPosts.forEach((id) => {
    const link = document.querySelector(`a[data-id="${id}"]`);
    link.classList.remove('fw-bold', 'text-info');
    link.classList.add('fw-normal', 'link-secondary');
  });
};

const watchedChange = (state, elements, i18n) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.status':
      formStatus(state, elements, i18n);
      break;
    case 'form.error':
      error(elements, value, i18n);
      break;
    case 'posts':
      renderPosts(state, value, elements, i18n);
      break;
    case 'feeds':
      renderFeeds(value, elements, i18n);
      break;
    case 'visitedPosts':
      renderVisitedPosts(value);
      break;
    case 'currentPost':
      renderModal(state, value);
      break;
    default:
      break;
  }
});

export default watchedChange;
