export default (feedsList, elements, i18next) => {
  const divElement = document.createElement('div');
  divElement.classList.add('list-group', 'border-0', 'rounded-0');

  feedsList.forEach((feed) => {
    const liElement = document.createElement('li');
    liElement.classList.add('list-group-item', 'border-0', 'border-end-0', 'bg-light');

    const header = document.createElement('h3');
    header.classList.add('h6', 'm-0');
    header.textContent = feed.title;

    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = feed.description;

    liElement.prepend(description);
    liElement.prepend(header);

    divElement.prepend(liElement);
  });

  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4', 'bg-light');
  title.textContent = i18next.t('renderFeeds.header');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body', 'bg-light');
  cardBody.prepend(title);

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  card.prepend(cardBody);
  card.append(divElement);

  const { feeds } = elements;
  feeds.replaceChildren(card);
};
