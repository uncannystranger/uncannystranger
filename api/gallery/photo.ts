import { backendErrorResponse } from '../../src/server/supabaseRest.js';
import { getGalleryPhoto } from '../../src/server/galleryData.js';
import { PUBLIC_GALLERY_CACHE, safeUnsplashId, sendJson } from '../../src/server/galleryHttp.js';
import { fallbackPhotoDetail } from '../../src/server/unsplashReadFallback.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed', code: 'method-not-allowed' });
  const id = Array.isArray(req.query?.unsplashId) ? req.query.unsplashId[0] : req.query?.unsplashId;
  if (!safeUnsplashId(id)) return sendJson(res, 400, { error: 'Invalid photo ID.', code: 'invalid-request' });
  try {
    const photo = await getGalleryPhoto(id) || await fallbackPhotoDetail(id);
    return photo
      ? sendJson(res, 200, { photo }, PUBLIC_GALLERY_CACHE)
      : sendJson(res, 404, { error: 'Photo not found.', code: 'not-found' }, PUBLIC_GALLERY_CACHE);
  } catch (error) {
    const failure = backendErrorResponse(error, 'Photo request failed.');
    return sendJson(res, failure.status, failure.body);
  }
}
