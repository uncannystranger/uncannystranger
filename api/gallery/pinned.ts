import { PINNED_PHOTO_IDS } from '../../src/gallery/constants.js';
import { backendErrorResponse } from '../../src/server/supabaseRest.js';
import { listGalleryPhotos, safeInteger } from '../../src/server/galleryData.js';
import { PUBLIC_GALLERY_CACHE, sendJson } from '../../src/server/galleryHttp.js';
import { fallbackPinnedPhotos } from '../../src/server/unsplashReadFallback.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed', code: 'method-not-allowed' });
  try {
    const limit = safeInteger(req.query?.limit, 10, 1, 30);
    const result = await listGalleryPhotos({ pinned: 'true', page: '1', limit: String(limit) });
    const byId = new Map(result.photos.map((photo) => [photo.unsplash_id, photo]));
    result.photos = PINNED_PHOTO_IDS.flatMap((id) => {
      const photo = byId.get(id);
      return photo ? [photo] : [];
    });
    result.pagination.total = result.photos.length;
    result.pagination.has_more = false;
    if (!result.photos.length) {
      result.photos = (await fallbackPinnedPhotos()).slice(0, limit);
      result.pagination.total = result.photos.length;
    }
    return sendJson(res, 200, result, PUBLIC_GALLERY_CACHE);
  } catch (error) {
    const failure = backendErrorResponse(error, 'Pinned gallery request failed.');
    return sendJson(res, failure.status, failure.body);
  }
}
