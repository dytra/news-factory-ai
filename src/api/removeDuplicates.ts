// SELECT *
// FROM your_table
// WHERE column_name IN (
//     SELECT column_name
//     FROM your_table
//     GROUP BY column_name
//     HAVING COUNT(*) > 1
// );

import { NewsItem } from "../app";
import { TOTAL_LIMIT_DUPLICATE_NEWS_ITEM } from "../config";
import db from "../db";

import express from 'express';

const router = express.Router();

// type EmojiResponse = string[];

router.get('/', async (req, res) => {
	const duplicates = await removeDuplicates();
	// console.log("response kyun ", duplicates);
	const hasDuplicates = !duplicates ? false : duplicates?.length > 0 ? true : false;
	res.json({
		status: "OK", //@ts-ignore
		message: hasDuplicates ? `Duplicates Removed` : `No Duplicates`,
		totalDuplicates: duplicates?.length,
		duplicates:duplicates
	});
});

export async function removeDuplicates() {
	const news = await getLatestNews();
	const duplicates = getDuplicates(news);
	doRemoveDuplicates(duplicates);
	return duplicates;
}

async function getLatestNews(): Promise<NewsItem[] | null> {
	const { data, error } = await db.from('news')
		.select()
		.limit(TOTAL_LIMIT_DUPLICATE_NEWS_ITEM)
		.order('id', { ascending: false });
	if (error) {
		console.error("[!] Error fetching duplicates ", error);
	}
	// return {haha:"true"};
	return data;

}
async function doRemoveDuplicates(news: NewsItem[] | null | undefined) {
	if (!news) return;
	if(news?.length === 0 ) return;
	for (const item of news) {
		if(!item?.id) continue;
		const { error } = await db
			.from('news')
			.delete()
			.eq('id', item.id)
		if (error) {
			console.error(`[!] Error deleting news of id ${item.id} `)
		}
	}
}
export function getDuplicates(news: NewsItem[] | null):NewsItem[] | null | undefined {
	if (!news) return;
	const originalLinkCountMap: { [key: string]: number } = {};
	const duplicates: NewsItem[] = [];

	for (const item of news) {
		const originalLink = item.original_link;

		if (originalLinkCountMap[originalLink] === undefined) {
			originalLinkCountMap[originalLink] = 1;
		} else {
			originalLinkCountMap[originalLink]++;
		}
	}

	for (const item of news) {
		const originalLink = item.original_link;

		if (originalLinkCountMap[originalLink] > 1) {
			duplicates.push(item);
			originalLinkCountMap[originalLink] = 0; // To avoid duplicate duplicates in the result
		}
	}

	return duplicates;
}

export default router;