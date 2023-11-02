export async function getNews() {
  // eslint-disable-next-line import/no-extraneous-dependencies
  let Parser = require('rss-parser');
  let parser = new Parser();
  let feed = await parser.parseURL('https://www.cnbcindonesia.com/market/rss/');
  // console.log(feed.title);

  // feed.items.forEach((item) => {
  //   console.log("huy",item);
  // });
  return feed.items;
}