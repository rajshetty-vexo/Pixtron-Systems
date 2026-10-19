import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const COUNTER_KEY = 'pixtron:visitor_count';
const BASE_COUNT = 900; // Starting baseline count

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const isNewVisit = req.query.hit === 'true';

    let count: number;
    if (isNewVisit) {
     
      count = await redis.incr(COUNTER_KEY);
    } else {
   
      const current = await redis.get<number>(COUNTER_KEY);
      count = current ?? 0;
    }

    return res.status(200).json({
      success: true,
      count: BASE_COUNT + count,
    });
  } catch (error) {
    console.error('Redis counter error:', error);
    return res.status(500).json({
      success: false,
      count: BASE_COUNT,
    });
  }
}