import { PINNED_PHOTO_ID_SET, PINNED_PHOTO_IDS } from '../gallery/constants.js';
import { supabasePublicFetch } from './supabaseRest.js';

const PER_PAGE = 30;
const MAX_PAGES = 50;

type RemotePhoto = {
  id: string;
  created_at?: string | null;
  updated_at?: string | null;
  width?: number | null;
  height?: number | null;
  color?: string | null;
  blur_hash?: string | null;
  description?: string | null;
  alt_description?: string | null;
  urls: { raw: string; regular: string; small: string; thumb: string };
  links: { html: string };
  tags?: Array<{ title?: string | null }>;
  topic_submissions?: Record<string, unknown>;
  location?: { name?: string | null; city?: string | null; country?: string | null } | null;
  user?: { name?: string | null; username?: string | null; links?: { html?: string | null } };
};

type ExistingPhoto = {
  id: string;
  unsplash_id: string;
  updated_at_unsplash: string | null;
  is_pinned: boolean;
  is_featured: boolean;
  is_favorite: boolean;
};

export type GallerySyncReport = {
  username: string;
  pages_fetched: number;
  scanned: number;
  inserted: number;
  updated: number;
  unchanged: number;
  pinned_reconciled: number;
  stopped_incrementally: boolean;
  completed_at: string;
};

const CATEGORY_RULES: Array<[string, string[]]> = [
  ['Mogadishu', ['mogadishu', 'xamar']],
  ['Black & White', ['black and white', 'monochrome', 'grayscale']],
  ['Architecture', ['architecture', 'building', 'structure', 'mosque']],
  ['Nature', ['nature', 'ocean', 'sea', 'tree', 'flower', 'landscape', 'beach']],
  ['Portraits', ['portrait', 'person', 'face', 'woman', 'man', 'people']],
  ['Street', ['street', 'road', 'market', 'cafe', 'harbor']],
  ['Urban Life', ['urban', 'city', 'traffic', 'downtown']],
  ['Textures', ['texture', 'pattern', 'wall']],
  ['Travel', ['travel', 'journey', 'airport']],
  ['Documentary', ['documentary', 'community', 'daily']],
];

const cleanText = (value?: string | null) => (value || '').replace(/\s+/g, ' ').trim();

const sameTimestamp = (left?: string | null, right?: string | null) => {
  if (!left || !right) return left === right;
  const leftTime = new Date(left).getTime();
  const rightTime = new Date(right).getTime();
  return Number.isNaN(leftTime) || Number.isNaN(rightTime) ? left === right : leftTime === rightTime;
};

const sizedUrl = (raw: string, width: number, quality: number) => {
  const url = new URL(raw);
  url.searchParams.delete('crop');
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality));
  return url.toString();
};

const metadataFor = (photo: RemotePhoto, username: string, existing?: ExistingPhoto) => {
  const tags = (photo.tags || []).map((tag) => cleanText(tag.title)).filter(Boolean);
  const topics = Object.keys(photo.topic_submissions || {});
  const locationName =
    cleanText(photo.location?.name) ||
    [cleanText(photo.location?.city), cleanText(photo.location?.country)].filter(Boolean).join(', ') ||
    null;
  const text = [
    photo.description,
    photo.alt_description,
    locationName,
    ...tags,
    ...topics,
  ].filter(Boolean).join(' ').toLowerCase();
  const category = CATEGORY_RULES.find(([, words]) => words.some((word) => text.includes(word)))?.[0] || 'Uncategorized';
  const date = photo.created_at ? new Date(photo.created_at) : null;
  const year = date && !Number.isNaN(date.getTime()) ? date.getUTCFullYear() : null;
  const month = date && !Number.isNaN(date.getTime()) ? date.getUTCMonth() + 1 : null;
  const monthLabel = date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
    : 'Undated';
  const title = cleanText(photo.description) || cleanText(photo.alt_description) || 'Untitled Photo';
  const isPinned = PINNED_PHOTO_ID_SET.has(photo.id);
  const albumName = category;
  const collectionName = isPinned
    ? 'Pinned'
    : existing?.is_featured
      ? 'Featured'
      : locationName?.toLowerCase().includes('mogadishu')
        ? 'Mogadishu'
        : category === 'Uncategorized' ? 'Library' : category;
  const momentGroup = locationName ? `${monthLabel} - ${locationName}` : monthLabel;
  const width = photo.width || null;
  const height = photo.height || null;
  const rawUrl = photo.urls.raw || photo.urls.regular;

  return {
    unsplash_id: photo.id,
    unsplash_url: photo.links.html,
    image_url_raw: rawUrl,
    image_url_thumb: sizedUrl(rawUrl, 240, 68),
    image_url_small: sizedUrl(rawUrl, 640, 72),
    image_url_regular: sizedUrl(rawUrl, 1600, 76),
    image_url_full: photo.urls.regular,
    title,
    caption: cleanText(photo.description) || cleanText(photo.alt_description) || null,
    description: cleanText(photo.description) || null,
    alt_text: cleanText(photo.alt_description) || cleanText(photo.description) || title,
    category,
    album_name: albumName,
    collection_name: collectionName,
    moment_group: momentGroup,
    location: locationName,
    location_name: locationName,
    year,
    month,
    source: 'unsplash',
    author_name: photo.user?.name || username,
    author_username: photo.user?.username || username,
    photographer_name: photo.user?.name || username,
    photographer_url: photo.user?.links?.html || `https://unsplash.com/@${username}`,
    created_at_unsplash: photo.created_at || null,
    updated_at_unsplash: photo.updated_at || photo.created_at || null,
    synced_at: new Date().toISOString(),
    width,
    height,
    aspect_ratio: width && height ? Number((width / height).toFixed(6)) : null,
    color: photo.color || null,
    blur_hash: photo.blur_hash || null,
    tags: [...new Set([...tags, ...topics])].slice(0, 20),
    is_pinned: isPinned,
    is_featured: existing?.is_featured || false,
    is_favorite: existing?.is_favorite || false,
    is_visible: true,
    search_text: [title, photo.description, photo.alt_description, category, albumName, collectionName, momentGroup, locationName, ...tags, ...topics]
      .filter(Boolean).join(' '),
  };
};

class UnsplashRequestError extends Error {
  status?: number;
  constructor(status?: number) {
    super('Unsplash request failed.');
    this.status = status;
  }
}

const fetchRemote = async (path: string, key: string, username: string, params: Record<string, string> = {}) => {
  const url = new URL(`https://api.unsplash.com${path.replace(':username', encodeURIComponent(username))}`);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  const response = await fetch(url, {
    headers: { authorization: `Client-ID ${key}`, accept: 'application/json' },
  }).catch(() => null);
  if (!response?.ok) throw new UnsplashRequestError(response?.status);
  return response.json();
};

const getExisting = async () => {
  const response = await supabasePublicFetch(
    '/photos?source=eq.unsplash&select=id,unsplash_id,updated_at_unsplash,is_pinned,is_featured,is_favorite&limit=1000',
    {},
    'sync existing photos'
  );
  return (await response.json()) as ExistingPhoto[];
};

const upsertPhotos = async (rows: Record<string, unknown>[], report: GallerySyncReport) => {
  const token = process.env.CRON_SECRET;
  if (!token) throw new Error('CRON_SECRET is not configured.');
  await supabasePublicFetch('/rpc/sync_gallery_cache', {
    method: 'POST',
    headers: { prefer: 'return=minimal' },
    body: JSON.stringify({ p_token: token, p_rows: rows, p_report: report }),
  }, 'gallery cache sync');
};

export async function syncUnsplashGallery() {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  const username = process.env.UNSPLASH_USERNAME || 'uncannystranger';
  if (!key) throw new Error('UNSPLASH_ACCESS_KEY is not configured.');

  const existingRows = await getExisting();
  const existing = new Map(existingRows.map((row) => [row.unsplash_id, row]));
  const initialBackfill = existing.size === 0;
  const candidates = new Map<string, RemotePhoto>();
  let pagesFetched = 0;
  let stoppedIncrementally = false;

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const photos = await fetchRemote('/users/:username/photos', key, username, {
      page: String(page),
      per_page: String(PER_PAGE),
      order_by: 'latest',
    }) as RemotePhoto[];
    pagesFetched = page;
    for (const photo of photos) candidates.set(photo.id, photo);

    const settledPage = photos.length > 0 && photos.every((photo) => {
      const row = existing.get(photo.id);
      return row && sameTimestamp(row.updated_at_unsplash, photo.updated_at || photo.created_at || null) &&
        row.is_pinned === PINNED_PHOTO_ID_SET.has(photo.id);
    });
    if (!initialBackfill && settledPage) {
      stoppedIncrementally = true;
      break;
    }
    if (photos.length < PER_PAGE) break;
  }

  for (const id of PINNED_PHOTO_IDS) {
    if (!candidates.has(id) && (!existing.has(id) || !existing.get(id)?.is_pinned)) {
      const photo = await fetchRemote(`/photos/${encodeURIComponent(id)}`, key, username) as RemotePhoto;
      candidates.set(id, photo);
    }
  }

  const insertRows: Record<string, unknown>[] = [];
  const updateRows: Record<string, unknown>[] = [];
  let unchanged = 0;
  let pinnedReconciled = 0;

  for (const candidate of candidates.values()) {
    const current = existing.get(candidate.id);
    let photo = candidate;
    const pinnedChanged = Boolean(current) && current!.is_pinned !== PINNED_PHOTO_ID_SET.has(photo.id);
    const changed = !current || !sameTimestamp(current.updated_at_unsplash, photo.updated_at || photo.created_at || null) || pinnedChanged;
    if (!changed) {
      unchanged += 1;
      continue;
    }
    if (!initialBackfill) {
      photo = await fetchRemote(`/photos/${encodeURIComponent(photo.id)}`, key, username) as RemotePhoto;
    }
    const payload = metadataFor(photo, username, current);
    if (pinnedChanged || (!current && PINNED_PHOTO_ID_SET.has(photo.id))) pinnedReconciled += 1;
    (current ? updateRows : insertRows).push(payload);
  }

  const report: GallerySyncReport = {
    username,
    pages_fetched: pagesFetched,
    scanned: candidates.size,
    inserted: insertRows.length,
    updated: updateRows.length,
    unchanged,
    pinned_reconciled: pinnedReconciled,
    stopped_incrementally: stoppedIncrementally,
    completed_at: new Date().toISOString(),
  };

  await upsertPhotos([...insertRows, ...updateRows], report);

  return report;
}

export { UnsplashRequestError };
