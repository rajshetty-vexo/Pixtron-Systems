
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const COUNTER_KEY = 'pixtron:visitor_count';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed',
    });
  }

  try {
    const isNewVisit = req.query.hit === 'true';

    let count: number;

    if (isNewVisit) {
      count = await redis.incr(COUNTER_KEY);
    } else {
      count = (await redis.get<number>(COUNTER_KEY)) ?? 0;
    }

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Redis counter error:', error);

    return res.status(500).json({
      success: false,
      message: 'Visitor counter unavailable',
    });
  }
}
