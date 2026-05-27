import { PINNED_PHOTO_ID_SET, PINNED_PHOTO_IDS } from '../gallery/constants.js';
import { syncFrameStories, type FrameSyncReport } from './frameStorySync.js';
import { supabasePublicFetch } from './supabaseRest.js';

const PER_PAGE = 30;
const DETAIL_REFRESH_LIMIT = 20;

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
  likes?: number | null;
  downloads?: number | null;
  views?: number | null;
  statistics?: {
    likes?: { total?: number | null } | null;
    downloads?: { total?: number | null } | null;
    views?: { total?: number | null } | null;
  } | null;
  exif?: Record<string, unknown> | null;
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
  unsplash_exif: Record<string, unknown> | null;
};

export type GallerySyncReport = {
  username: string;
  pages_fetched: number;
  scanned: number;
  inserted: number;
  updated: number;
  unchanged: number;
  statistics_written: number;
  frames_written: number;
  frame_report?: FrameSyncReport;
  pinned_reconciled: number;
  stopped_incrementally: boolean;
  completed_at: string;
};

const CATEGORY_RULES: Array<[string, string[]]> = [
  ['Mogadishu', ['mogadishu', 'xamar']],
  ['Women', ['woman', 'women', 'lady', 'girl', 'mother', 'female']],
  ['Black & White', ['black and white', 'monochrome', 'grayscale']],
  ['Portrait', ['portrait', 'person', 'face', 'man', 'people']],
  ['Street', ['street', 'road', 'market', 'cafe', 'harbor', 'urban', 'city', 'traffic', 'downtown', 'architecture', 'building']],
  ['Light', ['light', 'sun', 'shadow', 'glow', 'golden', 'nature', 'ocean', 'sea', 'tree', 'flower', 'landscape', 'beach']],
  ['Everyday', ['tea', 'food', 'cup', 'home', 'daily', 'everyday']],
];

const cleanText = (value?: string | null) => (value || '').replace(/\s+/g, ' ').trim();

const countValue = (value?: number | null) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.round(value)) : null;

const photoStatistics = (summary: RemotePhoto, detail?: RemotePhoto) => ({
  unsplash_id: summary.id,
  unsplash_likes_count:
    countValue(summary.statistics?.likes?.total) ??
    countValue(detail?.likes) ??
    countValue(summary.likes),
  unsplash_downloads_count:
    countValue(summary.statistics?.downloads?.total) ??
    countValue(detail?.downloads) ??
    countValue(summary.downloads),
  unsplash_views_count:
    countValue(summary.statistics?.views?.total) ??
    countValue(detail?.views) ??
    countValue(summary.views),
  unsplash_exif: detail?.exif || null,
});

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
  const category = CATEGORY_RULES.find(([, words]) => words.some((word) => text.includes(word)))?.[0] || 'Memory';
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
        : category === 'Memory' ? 'Library' : category;
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
  const rows: ExistingPhoto[] = [];
  for (let offset = 0; ; offset += 1000) {
    const response = await supabasePublicFetch(
      `/photos?source=eq.unsplash&select=id,unsplash_id,updated_at_unsplash,is_pinned,is_featured,is_favorite,unsplash_exif&limit=1000&offset=${offset}`,
      {},
      'sync existing photos'
    );
    const page = (await response.json()) as ExistingPhoto[];
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
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

const upsertPhotoStatistics = async (rows: ReturnType<typeof photoStatistics>[]) => {
  if (!rows.length) return 0;
  const token = process.env.CRON_SECRET;
  if (!token) throw new Error('CRON_SECRET is not configured.');
  const response = await supabasePublicFetch('/rpc/sync_gallery_statistics', {
    method: 'POST',
    body: JSON.stringify({ p_token: token, p_rows: rows }),
  }, 'gallery statistic sync');
  return Number(await response.json()) || 0;
};

export async function syncUnsplashGallery() {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  const username = process.env.UNSPLASH_USERNAME || 'uncannystranger';
  if (!key) throw new Error('UNSPLASH_ACCESS_KEY is not configured.');

  const existingRows = await getExisting();
  const existing = new Map(existingRows.map((row) => [row.unsplash_id, row]));
  const candidates = new Map<string, RemotePhoto>();
  let pagesFetched = 0;

  for (let page = 1; ; page += 1) {
    const photos = await fetchRemote('/users/:username/photos', key, username, {
      page: String(page),
      per_page: String(PER_PAGE),
      order_by: 'latest',
      stats: 'true',
      resolution: 'days',
      quantity: '1',
    }) as RemotePhoto[];
    pagesFetched = page;
    for (const photo of photos) candidates.set(photo.id, photo);
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
  const statisticsRows: ReturnType<typeof photoStatistics>[] = [];
  const detailRefreshIds = new Set<string>(PINNED_PHOTO_IDS);
  for (const photo of candidates.values()) {
    if (detailRefreshIds.size >= DETAIL_REFRESH_LIMIT) break;
    if (!existing.get(photo.id)?.unsplash_exif) detailRefreshIds.add(photo.id);
  }
  let unchanged = 0;
  let pinnedReconciled = 0;
  let detailFetches = 0;
  let detailsUnavailable = false;

  for (const candidate of candidates.values()) {
    const current = existing.get(candidate.id);
    const pinnedChanged = Boolean(current) && current!.is_pinned !== PINNED_PHOTO_ID_SET.has(candidate.id);
    const changed = !current || !sameTimestamp(current.updated_at_unsplash, candidate.updated_at || candidate.created_at || null) || pinnedChanged;
    let detail: RemotePhoto | undefined;
    const needsDetail = !detailsUnavailable && detailFetches < DETAIL_REFRESH_LIMIT && (detailRefreshIds.has(candidate.id) || !current);
    if (needsDetail) {
      detailFetches += 1;
      try {
        detail = await fetchRemote(`/photos/${encodeURIComponent(candidate.id)}`, key, username) as RemotePhoto;
      } catch (error) {
        if (!(error instanceof UnsplashRequestError) || (error.status !== 403 && error.status !== 429)) throw error;
        detailsUnavailable = true;
      }
    }
    statisticsRows.push(photoStatistics(candidate, detail));
    if (!changed) {
      unchanged += 1;
      continue;
    }
    if (!detail && current && !pinnedChanged) {
      unchanged += 1;
      continue;
    }
    const payload = metadataFor(detail || candidate, username, current);
    if (pinnedChanged || (!current && PINNED_PHOTO_ID_SET.has(candidate.id))) pinnedReconciled += 1;
    (current ? updateRows : insertRows).push(payload);
  }

  const report: GallerySyncReport = {
    username,
    pages_fetched: pagesFetched,
    scanned: candidates.size,
    inserted: insertRows.length,
    updated: updateRows.length,
    unchanged,
    statistics_written: 0,
    frames_written: insertRows.length + updateRows.length,
    pinned_reconciled: pinnedReconciled,
    stopped_incrementally: false,
    completed_at: new Date().toISOString(),
  };

  await upsertPhotos([...insertRows, ...updateRows], report);
  report.statistics_written = await upsertPhotoStatistics(statisticsRows);
  const frameReport = await syncFrameStories();
  report.frames_written = frameReport.written;
  report.frame_report = frameReport;

  return report;
}

export { UnsplashRequestError };
