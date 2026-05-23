import { isSupabaseConfigured, supabase } from '../lib/supabase';

const UNSPLASH_USERNAME = 'uncannystranger';
const UNSPLASH_PER_PAGE = 30;
const UNSPLASH_MAX_PAGES = 50;

export const PINNED_PHOTO_IDS = [
  'F_lc9t1GwGU',
  'iJKXnMSZ_qI',
  'D8wCJg9hEg8',
  'pyQKxWBvpEM',
  'jqkZ5P-CHuc',
] as const;

export type UnsplashCategory =
  | 'Portrait'
  | 'Street'
  | 'Women'
  | 'Mogadishu'
  | 'Black & White'
  | 'Memory'
  | 'Light'
  | 'Everyday';

export interface UnsplashExif {
  make?: string | null;
  model?: string | null;
  name?: string | null;
  exposure_time?: string | null;
  aperture?: string | null;
  focal_length?: string | null;
  iso?: number | null;
}

export interface UnsplashTag {
  title: string;
}

export interface UnsplashApiPhoto {
  id: string;
  alt_description: string | null;
  description: string | null;
  created_at?: string;
  updated_at?: string;
  width?: number;
  height?: number;
  color?: string | null;
  likes?: number;
  views?: number;
  downloads?: number;
  links: {
    html: string;
    download_location?: string;
  };
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  location?: {
    name?: string | null;
    city?: string | null;
    country?: string | null;
  };
  exif?: UnsplashExif | null;
  tags?: UnsplashTag[];
  user?: {
    name?: string;
    username?: string;
  };
}

type CachedPhotoRow = {
  unsplash_id: string;
  unsplash_url: string;
  image_url_small: string;
  image_url_regular: string;
  image_url_full: string | null;
  title: string;
  caption: string;
  description: string;
  alt_text: string;
  category: string;
  location: string | null;
  author_name: string | null;
  author_username: string | null;
  created_at_unsplash: string | null;
  updated_at_unsplash: string | null;
  width: number | null;
  height: number | null;
  color: string | null;
  blur_hash: string | null;
  tags: string[] | null;
};

const fallbackPhotoBases = {
  hero: 'https://images.unsplash.com/photo-1760008780659-6ac16a68e012',
  dusk: 'https://images.unsplash.com/photo-1723151684036-d014403c33b2',
  street: 'https://images.unsplash.com/photo-1737742462464-b26eb948dfeb',
  night: 'https://images.unsplash.com/photo-1744477825395-e43544c2e2cc',
  window: 'https://images.unsplash.com/photo-1759429638334-e98f8e9f3da0',
};

const fallbackImage = (base: string, width: number, quality = 80) =>
  `${base}?auto=format&fit=crop&w=${width}&q=${quality}`;

const fallbackPhotos: UnsplashApiPhoto[] = [
  {
    id: '7PdUGlHwmh8',
    alt_description: 'Person holding a camera and taking a picture.',
    description: 'A camera raised into warm silence, where looking becomes a self-portrait.',
    created_at: '2026-01-12T09:00:00Z',
    updated_at: '2026-01-12T09:00:00Z',
    width: 1400,
    height: 1750,
    color: '#1c1917',
    links: { html: 'https://unsplash.com/photos/person-holding-a-camera-and-taking-a-picture-7PdUGlHwmh8' },
    urls: {
      raw: fallbackPhotoBases.hero,
      full: fallbackImage(fallbackPhotoBases.hero, 2000, 84),
      regular: fallbackImage(fallbackPhotoBases.hero, 1400, 82),
      small: fallbackImage(fallbackPhotoBases.hero, 900, 78),
      thumb: fallbackImage(fallbackPhotoBases.hero, 480, 76),
    },
    location: { name: 'Mogadishu, Somalia', city: 'Mogadishu', country: 'Somalia' },
    tags: [{ title: 'portrait' }, { title: 'camera' }, { title: 'editorial' }],
    user: { name: 'Abdullahi Maxamed', username: UNSPLASH_USERNAME },
  },
  {
    id: 'XzWkVZKqU0M',
    alt_description: 'A view of a city with tall buildings.',
    description: 'Mogadishu exhales into evening, soft with rooftops, blue air, and the last warmth of day.',
    created_at: '2026-01-10T18:20:00Z',
    updated_at: '2026-01-10T18:20:00Z',
    width: 1600,
    height: 1200,
    color: '#334155',
    links: { html: 'https://unsplash.com/photos/a-view-of-a-city-with-tall-buildings-XzWkVZKqU0M' },
    urls: {
      raw: fallbackPhotoBases.dusk,
      full: fallbackImage(fallbackPhotoBases.dusk, 2000, 84),
      regular: fallbackImage(fallbackPhotoBases.dusk, 1600, 82),
      small: fallbackImage(fallbackPhotoBases.dusk, 900, 78),
      thumb: fallbackImage(fallbackPhotoBases.dusk, 480, 76),
    },
    location: { name: 'Mogadishu, Somalia', city: 'Mogadishu', country: 'Somalia' },
    tags: [{ title: 'Mogadishu' }, { title: 'city' }, { title: 'dusk' }],
    user: { name: 'Abdullahi Maxamed', username: UNSPLASH_USERNAME },
  },
  {
    id: 'iJKXnMSZ_qI',
    alt_description: 'A group of men standing next to each other.',
    description: 'A circle of friends turns a public street into something close and bright.',
    created_at: '2026-01-08T14:15:00Z',
    updated_at: '2026-01-08T14:15:00Z',
    width: 1400,
    height: 1100,
    color: '#57534e',
    links: { html: 'https://unsplash.com/photos/a-group-of-men-standing-next-to-each-other-iJKXnMSZ_qI' },
    urls: {
      raw: fallbackPhotoBases.street,
      full: fallbackImage(fallbackPhotoBases.street, 1800, 82),
      regular: fallbackImage(fallbackPhotoBases.street, 1300, 80),
      small: fallbackImage(fallbackPhotoBases.street, 900, 78),
      thumb: fallbackImage(fallbackPhotoBases.street, 480, 76),
    },
    location: { name: 'Somalia', country: 'Somalia' },
    tags: [{ title: 'street' }, { title: 'friends' }, { title: 'documentary' }],
    user: { name: 'Abdullahi Maxamed', username: UNSPLASH_USERNAME },
  },
  {
    id: 'xmEupVYRQqw',
    alt_description: 'A neon-lit city street at night.',
    description: 'A narrow night street glows through windows, headlights, and magenta signs.',
    created_at: '2026-01-06T22:30:00Z',
    updated_at: '2026-01-06T22:30:00Z',
    width: 1200,
    height: 1500,
    color: '#18181b',
    links: { html: 'https://unsplash.com/photos/a-neon-lit-city-street-at-night-xmEupVYRQqw' },
    urls: {
      raw: fallbackPhotoBases.night,
      full: fallbackImage(fallbackPhotoBases.night, 1700, 82),
      regular: fallbackImage(fallbackPhotoBases.night, 1200, 80),
      small: fallbackImage(fallbackPhotoBases.night, 850, 78),
      thumb: fallbackImage(fallbackPhotoBases.night, 480, 76),
    },
    location: { name: 'Somalia', country: 'Somalia' },
    tags: [{ title: 'night' }, { title: 'street' }, { title: 'light' }],
    user: { name: 'Abdullahi Maxamed', username: UNSPLASH_USERNAME },
  },
  {
    id: '_2OdbG4q4Wc',
    alt_description: 'Sunlight streams through a window, casting shadows.',
    description: 'A quiet room is shaped by blue glass and the warm geometry of afternoon.',
    created_at: '2026-01-04T16:45:00Z',
    updated_at: '2026-01-04T16:45:00Z',
    width: 1200,
    height: 1500,
    color: '#0f172a',
    links: { html: 'https://unsplash.com/photos/sunlight-streams-through-a-window-casting-shadows-_2OdbG4q4Wc' },
    urls: {
      raw: fallbackPhotoBases.window,
      full: fallbackImage(fallbackPhotoBases.window, 1700, 82),
      regular: fallbackImage(fallbackPhotoBases.window, 1200, 80),
      small: fallbackImage(fallbackPhotoBases.window, 850, 78),
      thumb: fallbackImage(fallbackPhotoBases.window, 480, 76),
    },
    location: { name: 'Somalia', country: 'Somalia' },
    tags: [{ title: 'interior' }, { title: 'window' }, { title: 'memory' }],
    user: { name: 'Abdullahi Maxamed', username: UNSPLASH_USERNAME },
  },
];

export interface UnsplashPhoto {
  id: string;
  rawId: string;
  source: 'unsplash';
  title: string;
  description: string;
  intro: string;
  image: string;
  imageSmall: string;
  imageSrcSet?: string;
  imageSmallSrcSet?: string;
  alt: string;
  category: UnsplashCategory;
  date: string;
  year: string;
  sortTimestamp: number;
  readingTime: string;
  location: string;
  width: number;
  height: number;
  aspectRatio: number;
  color: string;
  likes: number | null;
  views: number | null;
  downloads: number | null;
  exif: UnsplashExif | null;
  tags: string[];
  unsplashUrl: string;
  downloadLocation?: string;
  photographer: string;
}

export type UnsplashArchiveStatus =
  | 'complete'
  | 'partial'
  | 'empty'
  | 'rate-limited'
  | 'network-error'
  | 'missing-config';

export interface UnsplashArchiveProgress {
  page: number;
  loaded: number;
}

export interface UnsplashArchiveResult {
  photos: UnsplashApiPhoto[];
  status: UnsplashArchiveStatus;
  source: 'live' | 'cache';
  error?: string;
  pagesFetched: number;
}

type FetchUserPhotoArchiveOptions = {
  forceRefresh?: boolean;
  onCached?: (result: UnsplashArchiveResult) => void;
  onProgress?: (progress: UnsplashArchiveProgress) => void;
};

let liveArchivePromise: Promise<UnsplashArchiveResult> | null = null;
let liveArchiveResult: UnsplashArchiveResult | null = null;
let pinnedPhotosPromise: Promise<UnsplashApiPhoto[]> | null = null;

class UnsplashRequestError extends Error {
  status: number;
  code: UnsplashArchiveStatus;

  constructor(status: number, code: UnsplashArchiveStatus, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const sortNewestFirst = (photos: UnsplashApiPhoto[]) =>
  [...photos].sort((a, b) => {
    const next = new Date(b.created_at || b.updated_at || 0).getTime();
    const current = new Date(a.created_at || a.updated_at || 0).getTime();
    return next - current;
  });

const uniqueByUnsplashId = (photos: UnsplashApiPhoto[]) => {
  const seen = new Set<string>();
  return photos.filter((photo) => {
    if (!photo.id || seen.has(photo.id)) return false;
    seen.add(photo.id);
    return true;
  });
};

const normalizeArchive = (photos: UnsplashApiPhoto[]) => sortNewestFirst(uniqueByUnsplashId(photos));

const classifyStatus = (status: number, code?: string): UnsplashArchiveStatus => {
  if (status === 429) return 'rate-limited';
  if (code === 'missing-config') return 'missing-config';
  return 'network-error';
};

async function requestUnsplash<T>(path: string, params?: Record<string, string | number | boolean>) {
  const url = new URL('/api/unsplash', window.location.origin);
  url.searchParams.set('path', path);
  Object.entries(params || {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString(), { headers: { accept: 'application/json' } });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const code = typeof payload?.code === 'string' ? payload.code : undefined;
    if (code === 'missing-config' && !import.meta.env.VITE_UNSPLASH_ACCESS_KEY) {
      console.warn('Missing VITE_UNSPLASH_ACCESS_KEY in frontend environment.');
    }
    throw new UnsplashRequestError(
      response.status,
      classifyStatus(response.status, code),
      typeof payload?.error === 'string' ? payload.error : `Photo request failed with status ${response.status}.`
    );
  }

  if (!payload) {
    throw new UnsplashRequestError(502, 'network-error', 'Photo service returned an unreadable response.');
  }

  return payload as T;
}

const cachedPhotoToUnsplash = (photo: CachedPhotoRow): UnsplashApiPhoto => ({
  id: photo.unsplash_id,
  alt_description: photo.alt_text || photo.caption || photo.title,
  description: photo.description || photo.caption || photo.title,
  created_at: photo.created_at_unsplash || undefined,
  updated_at: photo.updated_at_unsplash || photo.created_at_unsplash || undefined,
  width: photo.width || undefined,
  height: photo.height || undefined,
  color: photo.color,
  links: {
    html: photo.unsplash_url,
  },
  urls: {
    raw: photo.image_url_full || photo.image_url_regular,
    full: photo.image_url_full || photo.image_url_regular,
    regular: photo.image_url_regular,
    small: photo.image_url_small,
    thumb: photo.image_url_small,
  },
  location: {
    name: photo.location,
    city: photo.location?.includes(',') ? photo.location.split(',')[0]?.trim() : photo.location,
    country: photo.location?.includes(',') ? photo.location.split(',').slice(1).join(',').trim() : null,
  },
  tags: (photo.tags || []).map((title) => ({ title })),
  user: {
    name: photo.author_name || 'Abdullahi Maxamed',
    username: photo.author_username || UNSPLASH_USERNAME,
  },
});

async function fetchCachedPhotos(page = 1, perPage = 12) {
  if (!isSupabaseConfigured || !supabase) return null;
  const from = Math.max(0, (page - 1) * perPage);
  const to = from + perPage - 1;
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('is_visible', true)
    .order('created_at_unsplash', { ascending: false, nullsFirst: false })
    .range(from, to);

  if (error || !data?.length) return null;
  return (data as CachedPhotoRow[]).map(cachedPhotoToUnsplash);
}

async function fetchCachedPhotoArchive() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('is_visible', true)
    .order('created_at_unsplash', { ascending: false, nullsFirst: false })
    .limit(1000);

  if (error || !data?.length) return null;
  return normalizeArchive((data as CachedPhotoRow[]).map(cachedPhotoToUnsplash));
}

async function fetchCachedPhotoDetails(photoId: string) {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('unsplash_id', photoId)
    .eq('is_visible', true)
    .maybeSingle();

  if (error || !data) return null;
  return cachedPhotoToUnsplash(data as CachedPhotoRow);
}

async function fetchLivePhotoArchive(onProgress?: (progress: UnsplashArchiveProgress) => void): Promise<UnsplashArchiveResult> {
  const allPhotos: UnsplashApiPhoto[] = [];
  let pagesFetched = 0;

  try {
    for (let page = 1; page <= UNSPLASH_MAX_PAGES; page += 1) {
      const photos = await requestUnsplash<UnsplashApiPhoto[]>(
        `/users/${UNSPLASH_USERNAME}/photos`,
        {
          page,
          per_page: UNSPLASH_PER_PAGE,
          order_by: 'latest',
          stats: true,
        }
      );

      pagesFetched = page;
      allPhotos.push(...photos);
      onProgress?.({ page, loaded: allPhotos.length });

      if (photos.length < UNSPLASH_PER_PAGE) {
        const normalized = normalizeArchive(allPhotos);
        return {
          photos: normalized,
          status: normalized.length ? 'complete' : 'empty',
          source: 'live',
          pagesFetched,
        };
      }
    }

    return {
      photos: normalizeArchive(allPhotos),
      status: 'partial',
      source: 'live',
      error: 'The archive stopped at its safety limit.',
      pagesFetched,
    };
  } catch (error) {
    const normalized = normalizeArchive(allPhotos);
    const status = error instanceof UnsplashRequestError ? error.code : 'network-error';
    return {
      photos: normalized,
      status: normalized.length ? 'partial' : status,
      source: 'live',
      error: error instanceof Error ? error.message : 'Photo service is unavailable.',
      pagesFetched,
    };
  }
}

export async function fetchUserPhotoArchive(options: FetchUserPhotoArchiveOptions = {}): Promise<UnsplashArchiveResult> {
  const cached = await fetchCachedPhotoArchive();
  if (cached?.length) {
    options.onCached?.({
      photos: cached,
      status: 'partial',
      source: 'cache',
      error: 'Refreshing Unsplash archive.',
      pagesFetched: 0,
    });
  }

  if (liveArchiveResult && !options.forceRefresh) return liveArchiveResult;

  if (!liveArchivePromise || options.forceRefresh) {
    liveArchivePromise = fetchLivePhotoArchive(options.onProgress).then((result) => {
      if (result.status === 'complete' || result.status === 'empty') {
        liveArchiveResult = result;
      }
      if (result.status !== 'complete' && result.status !== 'empty') {
        liveArchivePromise = null;
      }
      return result;
    });
  }

  const live = await liveArchivePromise;
  if ((live.status === 'complete' || live.status === 'empty') || !cached?.length) return live;

  return {
    photos: cached,
    status: 'partial',
    source: 'cache',
    error: live.error || 'Live Unsplash refresh did not finish.',
    pagesFetched: live.pagesFetched,
  };
}

export async function fetchUserPhotos(page = 1, perPage = 12) {
  const cached = await fetchCachedPhotos(page, perPage);
  if (cached) return cached;

  try {
    const photos = await requestUnsplash<UnsplashApiPhoto[]>(
      `/users/${UNSPLASH_USERNAME}/photos`,
      {
        page,
        per_page: perPage,
        order_by: 'latest',
        stats: true,
      }
    );

    return photos;
  } catch {
    const from = Math.max(0, (page - 1) * perPage);
    return page === 1 ? fallbackPhotos.slice(from, from + perPage) : [];
  }
}

export async function fetchPhotoDetails(photoId: string) {
  const cached = await fetchCachedPhotoDetails(photoId);
  if (cached) return cached;

  try {
    return await requestUnsplash<UnsplashApiPhoto>(`/photos/${photoId}`);
  } catch {
    const fallback = fallbackPhotos.find((photo) => photo.id === photoId);
    if (fallback) return fallback;
    throw new Error('Photo details are unavailable.');
  }
}

export async function fetchPinnedPhotos() {
  if (!pinnedPhotosPromise) {
    pinnedPhotosPromise = Promise.all(
      PINNED_PHOTO_IDS.map((id) =>
        fetchPhotoDetails(id).catch(() => null)
      )
    ).then((photos) => photos.filter(Boolean) as UnsplashApiPhoto[]);
  }

  return pinnedPhotosPromise;
}
