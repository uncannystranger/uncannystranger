export type FrameEngagement = {
  likes: number;
  liked: boolean;
  views: number;
};

const STORAGE_KEY = 'uncanny-frame-engagement-v1';
const ANONYMOUS_ID_KEY = 'uncanny-anonymous-id-v1';
const VIEWED_KEY = 'uncanny-frame-viewed-v1';
const VIEW_WINDOW_MS = 12 * 60 * 60 * 1000;

type Store = Record<string, FrameEngagement>;
type ViewStore = Record<string, number>;

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const readStore = (): Store => {
  if (!canUseStorage()) return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}') as Store;
  } catch {
    return {};
  }
};

const writeStore = (store: Store) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const readViewStore = (): ViewStore => {
  if (!canUseStorage()) return {};
  try {
    return JSON.parse(window.localStorage.getItem(VIEWED_KEY) || '{}') as ViewStore;
  } catch {
    return {};
  }
};

const writeViewStore = (store: ViewStore) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(VIEWED_KEY, JSON.stringify(store));
};

const baseline = (id: string): FrameEngagement => {
  const seed = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    likes: 8 + (seed % 37),
    liked: false,
    views: 42 + (seed % 180),
  };
};

const anonymousId = () => {
  if (!canUseStorage()) return 'anonymous-serverless';
  const existing = window.localStorage.getItem(ANONYMOUS_ID_KEY);
  if (existing) return existing;
  const next =
    typeof window.crypto?.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(ANONYMOUS_ID_KEY, next);
  return next;
};

const syncEngagement = async (id: string, action: 'view' | 'toggle-like') => {
  const response = await fetch('/api/frame-engagement', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      action,
      unsplashId: id,
      sessionId: anonymousId(),
    }),
  });
  if (!response.ok) {
    throw new Error(`Frame engagement failed: ${response.status}`);
  }
  const next = (await response.json()) as FrameEngagement;
  writeStore({ ...readStore(), [id]: next });
  return next;
};

export const getFrameEngagementRemote = async (id: string): Promise<FrameEngagement> => {
  const url = new URL('/api/frame-engagement', window.location.origin);
  url.searchParams.set('action', 'summary');
  url.searchParams.set('unsplashId', id);
  url.searchParams.set('sessionId', anonymousId());

  const response = await fetch(url.toString(), {
    headers: { accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Frame engagement failed: ${response.status}`);
  const next = (await response.json()) as FrameEngagement;
  writeStore({ ...readStore(), [id]: next });
  return next;
};

export const getFrameEngagement = (id: string): FrameEngagement => {
  const store = readStore();
  return store[id] || baseline(id);
};

export const incrementFrameView = (id: string): FrameEngagement => {
  const store = readStore();
  const viewStore = readViewStore();
  const current = store[id] || baseline(id);
  const lastViewedAt = viewStore[id] || 0;
  const shouldCount = Date.now() - lastViewedAt > VIEW_WINDOW_MS;
  const next = { ...current, views: shouldCount ? current.views + 1 : current.views };
  writeStore({ ...store, [id]: next });
  if (shouldCount) writeViewStore({ ...viewStore, [id]: Date.now() });
  return next;
};

export const recordFrameView = async (id: string): Promise<FrameEngagement> => {
  try {
    return await syncEngagement(id, 'view');
  } catch {
    return incrementFrameView(id);
  }
};

export const toggleFrameLike = (id: string): FrameEngagement => {
  const store = readStore();
  const current = store[id] || baseline(id);
  const nextLiked = !current.liked;
  const next = {
    ...current,
    liked: nextLiked,
    likes: Math.max(0, current.likes + (nextLiked ? 1 : -1)),
  };
  writeStore({ ...store, [id]: next });
  return next;
};

export const toggleFrameLikeRemote = async (id: string): Promise<FrameEngagement> => {
  try {
    return await syncEngagement(id, 'toggle-like');
  } catch {
    return toggleFrameLike(id);
  }
};
