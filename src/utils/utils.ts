import cheerio from "cheerio";
import fetch from "node-fetch";

// const fetch = require("node-fetch");
interface NewsDetail {
    title?: string;
    thumbnail?: string;
    content?: string;
    description?: string;
    keywords?: string;
  }
export async function scrapeWeb(url: string): Promise<NewsDetail> {
    const response = await fetch(url);
    const html = await response.text();
    const $ = await cheerio.load(html);
    const title = $('meta[name="originalTitle"]').attr("content");
    const thumbnail = $('meta[name="twitter:image:src"]').attr("content");
    const description = $('meta[name="twitter:description"]').attr("content");
    const keywords = $('meta[name="keywords"]').attr("content");
    // const description = "hoy";
    const content = $(".detail_text").html();
    // const pageTitle = $(".container > h1").text();
    // console.log("pageTitle hey ", title);
    // console.log("title ", title);
    // console.log("content kun ", content);
    // console.log("html hey ",html);
    return {
      title,
      thumbnail, //@ts-ignore
      content,
      description,
      keywords,
    };
  }