export default (state, postId) => {
  const currentPost = state.posts.find((post) => post.id === postId);

  const modal = document.querySelector('.modal');
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalLink = document.querySelector('.full-article');

  modal.setAttribute('data-id', currentPost.id);
  modal.classList.add('container-fluid');
  modalTitle.textContent = currentPost.title;
  modalBody.textContent = currentPost.description;
  modalLink.setAttribute('href', currentPost.link);
};
