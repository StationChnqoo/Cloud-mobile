export interface TWallet {
  id: string;
  userId: string;
  unionpay: string;
  wechat: string;
  alipay: string;
  eastmoney: string;
  cash: string;
  fund: string[];
  carpool: string[];
  settleOn: string;
  createAt: string;
  updateAt: string;
}

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
}

import dayjs from 'dayjs';
import {z} from 'zod';

const PicGoSrcSchema = z.object({
  id: z.string(),
  date: z.string(),
  size: z.number(),
  title: z.string(),
  url: z.string(),
});

export const PropertySchema = z.object({
  _id: z.string().default(''),
  id: z.string().default(''),
  wechat: z.string().default(''),
  alipay: z.string().default(''),
  unionpay: z.array(z.string()).default([]),
  cash: z.string().default(''),
  carpooling: z.array(z.string()).default([]),
  eastmoney: z.string().default(''),
  housefund: z.array(z.string()).default([]),
  usd: z.array(z.string()).default([]),
  createTime: z.number().default(Date.now()),
  settleDate: z.number().default(Date.now()),
  updateTime: z.number().default(Date.now()),
  total: z.string().default('0'),
  userId: z.string().default(''),
});

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
}

export const CustomServerSchema = z.object({
  host: z.string().default(''),
  status: z.boolean().default(false),
});

export const CategorySchema = z.object({
  id: z.string().default(''),
  userId: z.string().default(''),
  title: z.string().default(''),
  content: z.string().default(''),
  createAt: z.string().default(dayjs().format('YYYY-MM-DD HH:mm:ss')),
  updateAt: z.string().default(dayjs().format('YYYY-MM-DD HH:mm:ss')),
  isDeleted: z.number().int().default(0),
});

export const PostSchema = z.object({
  id: z.string().default(''),
  userId: z.string().default(''),
  categoryId: z.string().default(''),
  title: z.string().default(''),
  content: z.string().default(''),
  tags: z.array(z.string()).default([]),
  images: z.array(PicGoSrcSchema).default([]),
  isPublic: z.number().int().default(1),
  createAt: z.string().default(dayjs().format('YYYY-MM-DD HH:mm:ss')),
  updateAt: z.string().default(dayjs().format('YYYY-MM-DD HH:mm:ss')),
  isDeleted: z.number().int().default(0),
  /** extra */
  // 预处理，让categoryTitle=null也能通过safeParse ...
  categoryTitle: z.preprocess(v => v || '', z.string().default('')),
});

export const BingWallpaperSchema = z.object({
  startdate: z.string(),
  enddate: z.string(),
  url: z.string().default(''),
  urlbase: z.string(),
  copyright: z.string().default(''),
  copyrightlink: z.string(),
  title: z.string().default(''),
  quiz: z.string(),
  wp: z.boolean(),
  hsh: z.string(),
});

export const CommonOptionsSchema = z.object({
  label: z.string(),
  value: z.number(),
});

export const FootballMatchSchema = z.object({
  a: z.string().default(''),
  allAwayTeam: z.string().default(''),
  allHomeTeam: z.string().default(''),
  awayTeam: z.string().default(''),
  awayTeamId: z.number().default(0),
  bettingSingle: z.number().default(0),
  d: z.string().default(''),
  goalLine: z.string().default(''),
  h: z.string().default(''),
  homeTeam: z.string().default(''),
  homeTeamId: z.number().default(0),
  leagueBackColor: z.string().default(''),
  leagueId: z.number().default(0),
  leagueName: z.string().default(''),
  leagueNameAbbr: z.string().default(''),
  matchDate: z.string().default(''),
  matchId: z.number().default(0),
  matchNum: z.string().default(''),
  matchNumStr: z.string().default(''),
  matchResultStatus: z.string().default(''),
  poolStatus: z.string().default(''),
  resultStatus: z.string().default(''),
  sectionsNo1: z.string().default(''),
  sectionsNo999: z.string().default(''),
  winFlag: z.string().default(''),
});

export const Pailie3And5Schema = z.object({
  lotteryDrawResult: z.string().default(''),
  lotteryDrawTime: z.string().default(new Date().toISOString()),
});

export const StandardStockSchema = z.object({
  name: z.string().default(''),
  market: z.union([z.number(), z.string()]).default(0),
  code: z.string().default(''),
  currentPrice: z.union([z.number(), z.string()]).default(0),
  zdf: z.union([z.number(), z.string()]).default(0),
  updateTime: z.number().default(new Date().getTime()),
});

export type StandardStock = z.infer<typeof StandardStockSchema>;
export type Pailie3And5 = z.infer<typeof Pailie3And5Schema>;
export type FootballMatch = z.infer<typeof FootballMatchSchema>;
export type CommonOptions = z.infer<typeof CommonOptionsSchema>;
export type BingWallpaper = z.infer<typeof BingWallpaperSchema>;
export type Post = z.infer<typeof PostSchema>;
export type PicGoSrc = z.infer<typeof PicGoSrcSchema>;
export type Property = z.infer<typeof PropertySchema>;
export type Category = z.infer<typeof CategorySchema>;
export type CustomServer = z.infer<typeof CustomServerSchema>;
