export default (state, postId) => {
  const currentPost = state.posts.find((p) => p.id === postId);
  const {
    id, title, description, link,
  } = currentPost;

  const modal = document.querySelector('.modal');
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalLink = document.querySelector('.full-article');

  modal.setAttribute('data-id', id);
  modal.classList.add('container-fluid');
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLink.setAttribute('href', link);
};
