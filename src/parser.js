export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    const e = new Error();
    e.name = errorNode.textContent;
    e.message = 'invalidRss';
    throw e;
  }

  try {
    const itemsElement = doc.querySelectorAll('item');

    const items = Array.from(itemsElement).map((item) => {
      const title = item.querySelector('title').textContent;
      const description = item.querySelector('description').textContent;
      const link = item.querySelector('link').textContent;

      return { title, description, link };
    });
    return {
      title: doc.querySelector('title').textContent,
      description: doc.querySelector('description').textContent,
      items,
    };
  } catch (e) {
    e.message = 'unableToParseData';
    throw e;
  }
};
