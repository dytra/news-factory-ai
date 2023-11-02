import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';
import { getNews } from './actions/news';
import { generateNews } from './endpoints/generateNews';
import db from './db';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', async (req, res) => {
  await res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});
interface News {
  news: object[]
}

export interface NewsItem {
  id: number
  title: string
  slug: string
  pub_date: string
  content: string
  thumbnail: string
  original_link: string
  source: string
}

app.get('/generateNews', async (req, res) => {
  try {
    const news = await generateNews();
    //@ts-ignore
    const totalPublishedNews = news?.length;
    await res.status(200).json({
      status: true, //@ts-ignore
      message: totalPublishedNews > 0 ? "news published ✨" : "there are currenly no news published 🙃",
      //@ts-ignore
      totalPublishedNews: news?.length,
      publishedNews:news,
    });

  } catch (err) {
    console.error(err);
    await res.status(500).send({
      status: false,
      message: "failed to publish news"
    })
  }
});

app.get('/hello', async (req, res) => {
  const { data, error } = await db
    .from("news")
    .select()
  console.log("data ", data);
  console.log("error ",error);
  res.json({test:"hello"});
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
