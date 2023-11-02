/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/indent */
import { getNews } from "../actions/news";
import NewsFactory from "../lib/NewsFactory";
import { scrapeWeb } from "../utils/utils";

const NEWS_LIMIT = 3;
export async function generateNews() {
	const news = await getNews();
	let filteredNews = news.filter((item, index) => index < NEWS_LIMIT);
	const factory = new NewsFactory(process.env.OPENAI_KEY);
	let json:string | null = "";
	const scrapeNews = filteredNews.map(async (item) => {
		const { link, pubDate, isoDate } = item;
		// console.log("item kyun ", item);
		const model = "gpt-3.5-turbo";
		const newsDetail = await scrapeWeb(link);
		const { content, thumbnail } = newsDetail;
		const prompt = `Mohon tulis ulang konten dibawah ini:\n${content}, it should in HTML format, and use an informative tone. Hilangkan kata "CNBC" atau "CNBC Indonesia"`;
		// return openAI.generateText(prompt, model, 800);
		const gen = await factory.generateText(prompt, model, 800);
		const x = gen?.content;
		json = x;
		if(!x) return;
		try {
			const parsed = JSON.parse(x);
			return {
				...parsed,
				thumbnail,
				source: "cnbc",
				originalLink: link,
				date: isoDate,
			};
		} catch (err) {
			console.error("[!] Failed to parse JSON");
			console.log(`json:\n`);
			return null;
		}
	});
	const scrapeNewsReady = await Promise.all(scrapeNews);
	return scrapeNewsReady;
}