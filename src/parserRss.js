export default (data) => {
  const domParser = new DOMParser();
  // const doc = domParser.parseFromString(data, 'application/xml');
  const doc = domParser.parseFromString(data, 'text/xml');

  const hasRss = doc.querySelector('rss');
  if (!hasRss) {
    throw new Error('errors.parser');
  }

  const feedTitle = doc.querySelector('title').textContent;
  const feedDesc = doc.querySelector('description').textContent;
  const feedData = { title: feedTitle, description: feedDesc };

  const items = Array.from(doc.querySelectorAll('item'));
  const postsData = items.map((item) => {
    const title = item.querySelector('title').textContent;
    const desc = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;

    return { title, desc, link };
  });

  return { feedData, postsData };
};
