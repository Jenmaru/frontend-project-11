export default (state, listGroup, elements, i18next) => {
  const ulElement = document.createElement('ul');
  ulElement.classList.add('list-group', 'border-0', 'rounded-0');

  const getElementClass = (a, id) => (state.visitedPosts.includes(id) ? a.classList.add('fw-normal') : a.classList.add('fw-bold'));

  listGroup.forEach((post) => {
    const liElement = document.createElement('li');
    liElement.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'bg-light',
    );

    const aElement = document.createElement('a');
    aElement.textContent = post.title;
    getElementClass(aElement, post.id);
    aElement.setAttribute('href', post.link);
    aElement.setAttribute('data-id', post.id);
    aElement.setAttribute('target', '_blank');

    const button = document.createElement('button');
    button.textContent = i18next.t('renderPosts.button');
    button.classList.add('btn', 'btn-dark', 'btn-gradient', 'bg-gradient', 'h-100', 'px-sm-5', 'text-info');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');

    liElement.append(aElement);
    liElement.append(button);

    ulElement.append(liElement);
  });

  const divCard = document.createElement('div');
  divCard.classList.add('card', 'border-0', 'bg-light');

  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');

  const headerCardTitle = document.createElement('h2');
  headerCardTitle.textContent = i18next.t('renderPosts.header');
  headerCardTitle.classList.add('card-title', 'h4');

  divCardBody.prepend(headerCardTitle);

  divCard.prepend(divCardBody);

  divCard.append(ulElement);

  elements.posts.replaceChildren(divCard);
};
