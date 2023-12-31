/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/indent */
import { getNews } from "../actions/news";
import { NewsItem } from "../app";
import { NEWS_LIMIT } from "../config";
import db from "../db";
import NewsFactory from "../lib/NewsFactory";
import { scrapeWeb } from "../utils/utils";


async function getNewsByLink(link: string) {
  const { data, error } = await db
    .from("news")
    .select()
    .eq("original_link", link);
  // console.log("data ", data);
  return data;
}
export async function generateNews() {
  const news = await getNews();
  let filteredNews = news.filter((_, index) => index < NEWS_LIMIT);
  //filter if exist in db
  let filteredNews2 = [];
  for (const item of filteredNews) {
    const newsItem = await getNewsByLink(item?.link);
    const existInFilteredNews2 = filteredNews2.find( //@ts-ignore
      (item2) => item2?.link === item?.link
    );
    // console.log("existInFilteredNews2 ",existInFilteredNews2);
    // if (!newsItem) return {};
    if (newsItem?.length === 0 && !existInFilteredNews2) {
      //@ts-ignore
      filteredNews2.push(item);
    }
  }
  console.log("[+] Filtered News2")
  console.log(filteredNews2);
  // console.log("filteredNews ",filteredNews2);
  // return filteredNews2;
  const factory = new NewsFactory(process.env.OPENAI_KEY);
  let json: string | null = "";
  const scrapeNews = filteredNews2.map(async (item) => {
    const { link, pubDate, isoDate } = item;
    // console.log("item kyun ", item);
    const model = "gpt-3.5-turbo";
    const newsDetail = await scrapeWeb(link);
    const { content, thumbnail } = newsDetail;
    const prompt = `Mohon tulis ulang konten dibawah ini:\n${content}, it should in HTML format, and use an informative tone. Hilangkan kata "CNBC" atau "CNBC Indonesia". Hilangkan kaliamt persuasif seperti "saksikan"`;
    // return openAI.generateText(prompt, model, 800);
    const gen = await factory.generateText(prompt, model, 600);
    const x = gen?.content;
    json = x;
    if (!x) return;
    try {
      const parsed: NewsItem = JSON.parse(x);
      return {
        ...parsed,
        thumbnail,
        source: "cnbc",
        original_link: link,
        pub_date: isoDate,
      };
    } catch (err) {
      console.error("[!] Failed to parse JSON");
      console.log({
        original_link: link,
      });
      console.log(`json:\n${json}`);
      return null;
    }
  });
  const scrapeNewsReady = await Promise.all(scrapeNews);
  //@ts-ignore
  const filteredEmptyNews = filterEmptyNews(scrapeNewsReady);
  if (filterEmptyNews?.length > 0) {
    publishNews(filteredEmptyNews);
  }
  return filteredEmptyNews;
}
function filterEmptyNews(data?: NewsItem[] | null | undefined) {
  return data?.filter?.((item) => {
    return item;
  });
}
async function publishNews(news?: NewsItem[]) {
  const { error } = await db.from("news").insert(news);
  if (error) {
    console.error(`[!] Failed to insert DB`);
    console.error(error);
  }
}
