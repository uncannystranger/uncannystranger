const USERNAME = 'uncannystranger';
const UNSPLASH_API_ROOT = 'https://api.unsplash.com';

const json = (res: any, status: number, body: unknown, cache = 'no-store') => {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', cache);
  res.end(JSON.stringify(body));
};

const errorBody = (error: string, code: string) => ({ error, code });

const stringParam = (value: unknown) => (typeof value === 'string' ? value : '');

const safePhotoId = (value: string) => /^[A-Za-z0-9_-]{4,80}$/.test(value);

const safeInteger = (value: string, fallback: number, min: number, max: number) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
};

const makeUnsplashUrl = (query: Record<string, unknown>) => {
  const path = stringParam(query.path);
  const url = new URL(UNSPLASH_API_ROOT);

  if (path === `/users/${USERNAME}/photos`) {
    url.pathname = path;
    url.searchParams.set('page', String(safeInteger(stringParam(query.page), 1, 1, 50)));
    url.searchParams.set('per_page', String(safeInteger(stringParam(query.per_page), 12, 1, 30)));
    url.searchParams.set('order_by', stringParam(query.order_by) === 'oldest' ? 'oldest' : 'latest');
    if (stringParam(query.stats) === 'true') url.searchParams.set('stats', 'true');
    return url;
  }

  const photoMatch = path.match(/^\/photos\/([A-Za-z0-9_-]{4,80})$/);
  if (photoMatch && safePhotoId(photoMatch[1])) {
    url.pathname = `/photos/${photoMatch[1]}`;
    return url;
  }

  return null;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return json(res, 500, errorBody('Photo service is not configured.', 'missing-config'));

  const url = makeUnsplashUrl(req.query || {});
  if (!url) return json(res, 400, errorBody('Invalid photo request.', 'invalid-request'));

  try {
    const response = await fetch(url.toString(), {
      headers: {
        authorization: `Client-ID ${key}`,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const code = response.status === 429 ? 'rate-limited' : 'upstream-error';
      return json(res, response.status >= 500 ? 502 : response.status, {
        error: 'Photo service request failed.',
        code,
      });
    }

    const payload = await response.json();
    return json(res, 200, payload, 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
  } catch {
    return json(res, 502, errorBody('Photo service is unavailable.', 'network-error'));
  }
}
