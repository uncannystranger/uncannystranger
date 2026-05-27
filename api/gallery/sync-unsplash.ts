import { backendErrorResponse } from '../../src/server/supabaseRest.js';
import { authorizedCronRequest, sendJson } from '../../src/server/galleryHttp.js';
import { syncFrameStories } from '../../src/server/frameStorySync.js';
import { syncUnsplashGallery, UnsplashRequestError } from '../../src/server/gallerySync.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed', code: 'method-not-allowed' });
  }
  if (!process.env.CRON_SECRET) {
    return sendJson(res, 503, { error: 'Sync service is not configured.', code: 'missing-config' });
  }
  if (!authorizedCronRequest(req)) {
    return sendJson(res, 401, { error: 'Unauthorized', code: 'unauthorized' });
  }
  if (req.method === 'POST' && req.query?.scope === 'frames') {
    try {
      return sendJson(res, 200, await syncFrameStories());
    } catch (error) {
      const failure = backendErrorResponse(error, 'Frame sync failed.');
      return sendJson(res, failure.status, failure.body);
    }
  }
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    return sendJson(res, 503, { error: 'Photo service is not configured.', code: 'missing-config' });
  }

  try {
    return sendJson(res, 200, await syncUnsplashGallery());
  } catch (error) {
    if (error instanceof UnsplashRequestError) {
      const rateLimited = error.status === 429;
      return sendJson(res, rateLimited ? 429 : 502, {
        error: rateLimited ? 'Photo service rate limit reached.' : 'Photo service request failed.',
        code: rateLimited ? 'rate-limited' : 'upstream-error',
      });
    }
    const failure = backendErrorResponse(error, 'Sync failed.');
    return sendJson(res, failure.status, failure.body);
  }
}
