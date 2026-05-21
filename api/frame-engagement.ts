const SUPABASE_REST_PATH = '/rest/v1';
const VIEW_WINDOW_HOURS = 12;

const json = (res: any, status: number, body: unknown) => {
  res.status(status).setHeader('content-type', 'application/json');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
};

const supabaseFetch = async (path: string, init: RequestInit = {}) => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase server environment.');
  return fetch(`${url}${SUPABASE_REST_PATH}${path}`, {
    ...init,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      prefer: 'return=representation',
      ...(init.headers || {}),
    },
  });
};

const safeId = (value: unknown) =>
  typeof value === 'string' && /^[A-Za-z0-9_-]{4,80}$/.test(value);

const safeSession = (value: unknown) =>
  typeof value === 'string' && value.length >= 8 && value.length <= 128;

const readJsonBody = async (req: any) => {
  if (typeof req.body === 'object' && req.body !== null) return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  return {};
};

const fetchFrame = async (unsplashId: string) => {
  const photoResponse = await supabaseFetch(
    `/photos?unsplash_id=eq.${encodeURIComponent(unsplashId)}&select=id`
  );
  if (!photoResponse.ok) throw new Error(`Photo lookup failed: ${await photoResponse.text()}`);
  const [photo] = await photoResponse.json();
  if (!photo?.id) return null;

  const frameResponse = await supabaseFetch(
    `/frames?photo_id=eq.${encodeURIComponent(photo.id)}&select=id,views_count,likes_count`
  );
  if (!frameResponse.ok) throw new Error(`Frame lookup failed: ${await frameResponse.text()}`);
  const [frame] = await frameResponse.json();
  return frame || null;
};

const engagementPayload = async (frameId: string, liked: boolean) => {
  const frameResponse = await supabaseFetch(
    `/frames?id=eq.${encodeURIComponent(frameId)}&select=views_count,likes_count`
  );
  if (!frameResponse.ok) throw new Error(`Frame refresh failed: ${await frameResponse.text()}`);
  const [frame] = await frameResponse.json();
  return {
    views: Number(frame?.views_count || 0),
    likes: Number(frame?.likes_count || 0),
    liked,
  };
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST' && req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  try {
    const payload = req.method === 'GET' ? req.query || {} : await readJsonBody(req);
    const { action = 'summary', unsplashId, sessionId } = payload;
    if ((action !== 'view' && action !== 'toggle-like') || !safeId(unsplashId) || !safeSession(sessionId)) {
      if (action !== 'summary') return json(res, 400, { error: 'Invalid engagement payload.' });
    }

    if (action === 'summary' && (!safeId(unsplashId) || !safeSession(sessionId))) {
      return json(res, 400, { error: 'Invalid engagement payload.' });
    }

    const frame = await fetchFrame(unsplashId);
    if (!frame?.id) return json(res, 404, { error: 'Frame not found.' });

    if (action === 'summary') {
      const liked = await hasLike(frame.id, sessionId);
      return json(res, 200, await engagementPayload(frame.id, liked));
    }

    if (action === 'view') {
      const since = new Date(Date.now() - VIEW_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
      const existingView = await supabaseFetch(
        `/frame_views?frame_id=eq.${encodeURIComponent(frame.id)}&session_id=eq.${encodeURIComponent(sessionId)}&created_at=gte.${encodeURIComponent(since)}&select=id`
      );
      if (!existingView.ok) throw new Error(`View lookup failed: ${await existingView.text()}`);
      const views = await existingView.json();
      if (!views.length) {
        const insertView = await supabaseFetch('/frame_views', {
          method: 'POST',
          headers: { prefer: 'return=minimal' },
          body: JSON.stringify({ frame_id: frame.id, session_id: sessionId }),
        });
        if (!insertView.ok) throw new Error(`View insert failed: ${await insertView.text()}`);
      }
      const liked = await hasLike(frame.id, sessionId);
      return json(res, 200, await engagementPayload(frame.id, liked));
    }

    const existingLike = await supabaseFetch(
      `/frame_likes?frame_id=eq.${encodeURIComponent(frame.id)}&anonymous_user_id=eq.${encodeURIComponent(sessionId)}&select=id`
    );
    if (!existingLike.ok) throw new Error(`Like lookup failed: ${await existingLike.text()}`);
    const [like] = await existingLike.json();
    if (like?.id) {
      const unlike = await supabaseFetch(`/frame_likes?id=eq.${encodeURIComponent(like.id)}`, {
        method: 'DELETE',
        headers: { prefer: 'return=minimal' },
      });
      if (!unlike.ok) throw new Error(`Unlike failed: ${await unlike.text()}`);
      return json(res, 200, await engagementPayload(frame.id, false));
    }

    const insertLike = await supabaseFetch('/frame_likes', {
      method: 'POST',
      headers: { prefer: 'return=minimal' },
      body: JSON.stringify({ frame_id: frame.id, anonymous_user_id: sessionId }),
    });
    if (!insertLike.ok) throw new Error(`Like insert failed: ${await insertLike.text()}`);
    return json(res, 200, await engagementPayload(frame.id, true));
  } catch {
    return json(res, 500, { error: 'Engagement failed.' });
  }
}

const hasLike = async (frameId: string, sessionId: string) => {
  const response = await supabaseFetch(
    `/frame_likes?frame_id=eq.${encodeURIComponent(frameId)}&anonymous_user_id=eq.${encodeURIComponent(sessionId)}&select=id`
  );
  if (!response.ok) throw new Error(`Like state failed: ${await response.text()}`);
  const rows = await response.json();
  return rows.length > 0;
};
