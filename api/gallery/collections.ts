import { backendErrorResponse } from '../../src/server/supabaseRest.js';
import { galleryGroups } from '../../src/server/galleryData.js';
import { PUBLIC_GALLERY_CACHE, sendJson } from '../../src/server/galleryHttp.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed', code: 'method-not-allowed' });
  try {
    const [collections, moments] = await Promise.all([
      galleryGroups('collection_name'),
      galleryGroups('moment_group'),
    ]);
    return sendJson(res, 200, { collections, moments }, PUBLIC_GALLERY_CACHE);
  } catch (error) {
    const failure = backendErrorResponse(error, 'Collections request failed.');
    return sendJson(res, failure.status, failure.body);
  }
}
