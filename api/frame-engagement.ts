import { backendErrorResponse, supabasePublicFetch } from '../src/server/supabaseRest.js';

const json = (res: any, status: number, body: unknown) => {
  res.status(status).setHeader('content-type', 'application/json');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
};

const safeId = (value: unknown) =>
  typeof value === 'string' && /^[A-Za-z0-9_-]{4,80}$/.test(value);

const safeSession = (value: unknown) =>
  typeof value === 'string' && /^[A-Za-z0-9_-]{8,128}$/.test(value);

const readJsonBody = async (req: any) => {
  if (typeof req.body === 'object' && req.body !== null) return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  return {};
};

const engagementRpc = async (fn: string, unsplashId: string, sessionId: string) => {
  const response = await supabasePublicFetch(`/rpc/${fn}`, {
    method: 'POST',
    body: JSON.stringify({ p_unsplash_id: unsplashId, p_session_id: sessionId }),
  }, fn);
  const [result] = await response.json();
  return result || null;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST' && req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  if (req.method === 'POST') {
    const origin = req.headers?.origin;
    if (origin && !['https://uncannystranger.com', 'https://www.uncannystranger.com'].includes(origin)) return json(res, 403, { error: 'Origin not allowed.' });
    if (!(req.headers?.['content-type'] || '').toLowerCase().startsWith('application/json')) return json(res, 415, { error: 'Expected JSON.' });
    if (Number(req.headers?.['content-length'] || 0) > 4096 || Buffer.byteLength(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})) > 4096) return json(res, 413, { error: 'Request too large.' });
  }
  let payload: any;
  try { payload = req.method === 'GET' ? req.query || {} : await readJsonBody(req); }
  catch { return json(res, 400, { error: 'Invalid JSON.' }); }
  if (!payload || Array.isArray(payload) || typeof payload !== 'object') return json(res, 400, { error: 'Invalid payload.' });
  if (req.method === 'GET' && payload.action && payload.action !== 'summary') return json(res, 405, { error: 'Use POST for changes.' });
  try {
    const { action = 'summary', unsplashId, sessionId } = payload;
    if ((action !== 'view' && action !== 'toggle-like') || !safeId(unsplashId) || !safeSession(sessionId)) {
      if (action !== 'summary') return json(res, 400, { error: 'Invalid engagement payload.' });
    }

    if (action === 'summary' && (!safeId(unsplashId) || !safeSession(sessionId))) {
      return json(res, 400, { error: 'Invalid engagement payload.' });
    }

    const rpc =
      action === 'summary'
        ? 'frame_engagement_summary'
        : action === 'view'
          ? 'frame_record_view'
          : 'frame_toggle_like';
    const result = await engagementRpc(rpc, unsplashId, sessionId);
    return result ? json(res, 200, result) : json(res, 404, { error: 'Frame not found.' });
  } catch (error) {
    const failure = backendErrorResponse(error, 'Engagement failed.');
    return json(res, failure.status, failure.body);
  }
}
