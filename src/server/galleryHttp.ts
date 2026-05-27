import { timingSafeEqual } from 'node:crypto';

export const PUBLIC_GALLERY_CACHE = 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400';

export const sendJson = (res: any, status: number, body: unknown, cache = 'no-store') => {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', cache);
  res.end(JSON.stringify(body));
};

export const authorizedCronRequest = (req: any) => {
  const secret = process.env.CRON_SECRET;
  const authorization = typeof req.headers?.authorization === 'string' ? req.headers.authorization : '';
  const expected = secret ? `Bearer ${secret}` : '';
  if (!secret || !authorization) return false;
  const provided = Buffer.from(authorization);
  const required = Buffer.from(expected);
  return provided.length === required.length && timingSafeEqual(provided, required);
};

export const safeUnsplashId = (value: unknown) =>
  typeof value === 'string' && /^[A-Za-z0-9_-]{4,80}$/.test(value);
