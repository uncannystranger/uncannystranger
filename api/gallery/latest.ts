import { backendErrorResponse } from '../../src/server/supabaseRest.js';
import { listGalleryPhotos, safeInteger } from '../../src/server/galleryData.js';
import { PUBLIC_GALLERY_CACHE, sendJson } from '../../src/server/galleryHttp.js';
import { fallbackGalleryPage } from '../../src/server/unsplashReadFallback.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed', code: 'method-not-allowed' });
  try {
    const result = await listGalleryPhotos({ page: '1', limit: String(safeInteger(req.query?.limit, 8, 1, 12)) });
    if (!result.photos.length && result.pagination.total === 0) {
      const fallback = await fallbackGalleryPage(1, safeInteger(req.query?.limit, 8, 1, 12));
      if (fallback) return sendJson(res, 200, fallback, PUBLIC_GALLERY_CACHE);
    }
    return sendJson(res, 200, result, PUBLIC_GALLERY_CACHE);
  } catch (error) {
    const failure = backendErrorResponse(error, 'Latest gallery request failed.');
    return sendJson(res, failure.status, failure.body);
  }
}
