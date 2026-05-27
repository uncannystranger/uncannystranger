import { PINNED_PHOTO_IDS } from '../gallery/constants';

export { PINNED_PHOTO_IDS } from '../gallery/constants';

const UNSPLASH_USERNAME = 'uncannystranger';

export type UnsplashCategory =
  | 'Portrait'
  | 'Street'
  | 'Women'
  | 'Mogadishu'
  | 'Black & White'
  | 'Memory'
  | 'Light'
  | 'Everyday'
  | 'Architecture'
  | 'Nature'
  | 'Portraits'
  | 'Urban Life'
  | 'Textures'
  | 'Travel'
  | 'Documentary'
  | 'Uncategorized';

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
  category?: UnsplashCategory;
  album_name?: string | null;
  collection_name?: string | null;
  moment_group?: string | null;
  is_pinned?: boolean;
  is_featured?: boolean;
  is_favorite?: boolean;
  frame_story?: GalleryFrameStory | null;
  user?: {
    name?: string;
    username?: string;
  };
}

export type GalleryFrameStory = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  story?: string | null;
  excerpt: string | null;
  category: string | null;
  read_time: string | null;
  views_count: number;
  likes_count: number;
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
  frameStory?: GalleryFrameStory | null;
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
  source: 'cache';
  error?: string;
  pagesFetched: number;
}

type FetchUserPhotoArchiveOptions = {
  forceRefresh?: boolean;
  onCached?: (result: UnsplashArchiveResult) => void;
  onProgress?: (progress: UnsplashArchiveProgress) => void;
};

let pinnedPhotosPromise: Promise<UnsplashApiPhoto[]> | null = null;

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

type GalleryApiPhoto = {
  unsplash_id: string;
  unsplash_url: string;
  title: string;
  description: string | null;
  alt_description: string | null;
  category: UnsplashCategory;
  album_name: string | null;
  collection_name: string | null;
  moment_group: string | null;
  location_name: string | null;
  created_at_unsplash: string | null;
  image_url_small: string;
  image_url_regular: string;
  image_url_thumb: string;
  width: number | null;
  height: number | null;
  blur_hash: string | null;
  color: string | null;
  is_pinned: boolean;
  is_featured: boolean;
  is_favorite: boolean;
  photographer_name: string | null;
  photographer_url: string | null;
  tags: string[];
  likes: number | null;
  downloads: number | null;
  views: number | null;
  exif: UnsplashExif | null;
  frame?: GalleryFrameStory | null;
};

type GalleryPage = {
  photos: GalleryApiPhoto[];
  pagination: { page: number; limit: number; total: number; has_more: boolean };
};

export type GalleryPhotoPage = {
  photos: UnsplashApiPhoto[];
  page: number;
  total: number;
  hasMore: boolean;
};

const galleryPhotoToUnsplash = (photo: GalleryApiPhoto): UnsplashApiPhoto => ({
  id: photo.unsplash_id,
  alt_description: photo.alt_description || photo.description || photo.title,
  description: photo.description || photo.alt_description || photo.title,
  created_at: photo.created_at_unsplash || undefined,
  updated_at: photo.created_at_unsplash || undefined,
  width: photo.width || undefined,
  height: photo.height || undefined,
  color: photo.color,
  category: photo.category,
  album_name: photo.album_name,
  collection_name: photo.collection_name,
  moment_group: photo.moment_group,
  is_pinned: photo.is_pinned,
  is_featured: photo.is_featured,
  is_favorite: photo.is_favorite,
  likes: photo.likes ?? undefined,
  downloads: photo.downloads ?? undefined,
  views: photo.views ?? undefined,
  exif: photo.exif,
  frame_story: photo.frame || null,
  links: {
    html: photo.unsplash_url,
  },
  urls: {
    raw: photo.image_url_regular,
    full: photo.image_url_regular,
    regular: photo.image_url_regular,
    small: photo.image_url_small,
    thumb: photo.image_url_thumb,
  },
  location: {
    name: photo.location_name,
    city: photo.location_name?.includes(',') ? photo.location_name.split(',')[0]?.trim() : photo.location_name,
    country: photo.location_name?.includes(',') ? photo.location_name.split(',').slice(1).join(',').trim() : null,
  },
  tags: (photo.tags || []).map((title) => ({ title })),
  user: {
    name: photo.photographer_name || 'Abdullahi Maxamed',
    username: UNSPLASH_USERNAME,
  },
});

async function requestGallery<T>(path: string, params?: Record<string, string | number>) {
  const url = new URL(path, window.location.origin);
  for (const [key, value] of Object.entries(params || {})) url.searchParams.set(key, String(value));
  const response = await fetch(url.toString(), { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`Gallery request failed with status ${response.status}.`);
  return response.json() as Promise<T>;
}

export async function fetchUserPhotoPage(page = 1, perPage = 24, category?: string): Promise<GalleryPhotoPage> {
  try {
    const result = await requestGallery<GalleryPage>('/api/gallery', {
      page,
      limit: perPage,
      ...(category ? { category } : {}),
    });
    if (page === 1 && !result.photos.length) {
      return {
        photos: category ? [] : fallbackPhotos.slice(0, perPage),
        page,
        total: category ? 0 : fallbackPhotos.length,
        hasMore: false,
      };
    }
    return {
      photos: result.photos.map(galleryPhotoToUnsplash),
      page: result.pagination.page,
      total: result.pagination.total,
      hasMore: result.pagination.has_more,
    };
  } catch {
    const from = Math.max(0, (page - 1) * perPage);
    return {
      photos: page === 1 ? fallbackPhotos.slice(from, from + perPage) : [],
      page,
      total: page === 1 ? fallbackPhotos.length : 0,
      hasMore: false,
    };
  }
}

export async function fetchUserPhotos(page = 1, perPage = 12, category?: string) {
  return (await fetchUserPhotoPage(page, perPage, category)).photos;
}

export async function fetchLatestPhotos(limit = 8) {
  try {
    const result = await requestGallery<GalleryPage>('/api/gallery/latest', { limit });
    return result.photos.map(galleryPhotoToUnsplash);
  } catch {
    return fallbackPhotos.slice(0, limit);
  }
}

export async function fetchPhotoDetails(photoId: string) {
  try {
    const result = await requestGallery<{ photo: GalleryApiPhoto }>('/api/gallery/photo', { unsplashId: photoId });
    return galleryPhotoToUnsplash(result.photo);
  } catch {
    const fallback = fallbackPhotos.find((photo) => photo.id === photoId);
    if (fallback) return fallback;
    throw new Error('Photo details are unavailable.');
  }
}

export async function fetchPinnedPhotos() {
  if (!pinnedPhotosPromise) {
    pinnedPhotosPromise = requestGallery<GalleryPage>('/api/gallery/pinned', { limit: PINNED_PHOTO_IDS.length })
      .then((result) => result.photos.map(galleryPhotoToUnsplash))
      .catch(() => fallbackPhotos.filter((photo) => PINNED_PHOTO_IDS.includes(photo.id as typeof PINNED_PHOTO_IDS[number])));
  }

  return pinnedPhotosPromise;
}
