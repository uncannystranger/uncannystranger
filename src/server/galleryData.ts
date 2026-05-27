import { supabasePublicFetch } from './supabaseRest.js';

const GALLERY_PHOTO_FIELDS = [
  'id',
  'unsplash_id',
  'source',
  'title',
  'description',
  'alt_text',
  'category',
  'album_name',
  'collection_name',
  'moment_group',
  'location_name',
  'year',
  'month',
  'created_at_unsplash',
  'image_url_small',
  'image_url_regular',
  'image_url_thumb',
  'width',
  'height',
  'aspect_ratio',
  'blur_hash',
  'color',
  'is_pinned',
  'is_featured',
  'is_favorite',
  'unsplash_url',
  'photographer_name',
  'photographer_url',
  'tags',
];

export const GALLERY_SELECT = GALLERY_PHOTO_FIELDS.join(',');
const GALLERY_WITH_FRAME_SUMMARY_SELECT = [
  ...GALLERY_PHOTO_FIELDS,
  'frame:frames(id,slug,title,subtitle,excerpt,category,read_time,views_count,likes_count)',
].join(',');
const GALLERY_WITH_FRAME_DETAIL_SELECT = [
  ...GALLERY_PHOTO_FIELDS,
  'frame:frames(id,slug,title,subtitle,story,excerpt,category,read_time,views_count,likes_count)',
].join(',');

export type GalleryPhotoRow = {
  id: string;
  unsplash_id: string;
  source: string;
  title: string;
  description: string | null;
  alt_text: string | null;
  category: string | null;
  album_name: string | null;
  collection_name: string | null;
  moment_group: string | null;
  location_name: string | null;
  year: number | null;
  month: number | null;
  created_at_unsplash: string | null;
  image_url_small: string;
  image_url_regular: string;
  image_url_thumb: string | null;
  width: number | null;
  height: number | null;
  aspect_ratio: number | string | null;
  blur_hash: string | null;
  color: string | null;
  is_pinned: boolean;
  is_featured: boolean;
  is_favorite: boolean;
  unsplash_url: string;
  photographer_name: string | null;
  photographer_url: string | null;
  tags?: string[] | null;
  frame?: GalleryFrameRow | GalleryFrameRow[] | null;
};

export type GalleryFrameRow = {
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

const publicFrame = (photo: GalleryPhotoRow) =>
  Array.isArray(photo.frame) ? photo.frame[0] || null : photo.frame || null;

export const publicPhoto = (photo: GalleryPhotoRow) => ({
  id: photo.id,
  unsplash_id: photo.unsplash_id,
  photo_source: photo.source,
  title: photo.title,
  description: photo.description,
  alt_description: photo.alt_text || photo.description || photo.title,
  category: photo.category || 'Uncategorized',
  album_name: photo.album_name || 'Uncategorized',
  collection_name: photo.collection_name || 'Library',
  moment_group: photo.moment_group,
  location_name: photo.location_name,
  year: photo.year,
  month: photo.month,
  created_at_unsplash: photo.created_at_unsplash,
  image_url_small: photo.image_url_small,
  image_url_regular: photo.image_url_regular,
  image_url_thumb: photo.image_url_thumb || photo.image_url_small,
  width: photo.width,
  height: photo.height,
  aspect_ratio: Number(photo.aspect_ratio) || (photo.width && photo.height ? photo.width / photo.height : null),
  blur_hash: photo.blur_hash,
  color: photo.color,
  is_pinned: photo.is_pinned,
  is_featured: photo.is_featured,
  is_favorite: photo.is_favorite,
  unsplash_url: photo.unsplash_url,
  photographer_name: photo.photographer_name,
  photographer_url: photo.photographer_url,
  tags: photo.tags || [],
  frame: publicFrame(photo),
});

export const safeInteger = (value: unknown, fallback: number, min: number, max: number) => {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
};

const stringParam = (value: unknown) => (typeof value === 'string' ? value.trim().slice(0, 100) : '');

export async function listGalleryPhotos(query: Record<string, unknown>) {
  const page = safeInteger(query.page, 1, 1, 10000);
  const limit = safeInteger(query.limit, 24, 1, 30);
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    select: GALLERY_WITH_FRAME_SUMMARY_SELECT,
    source: 'eq.unsplash',
    is_visible: 'eq.true',
    order: 'created_at_unsplash.desc.nullslast',
    offset: String(offset),
    limit: String(limit),
  });

  for (const [input, column] of [
    ['category', 'category'],
    ['album', 'album_name'],
    ['collection', 'collection_name'],
    ['moment', 'moment_group'],
  ] as const) {
    const value = stringParam(query[input]);
    if (value) params.set(column, `eq.${value}`);
  }

  const year = safeInteger(query.year, 0, 0, 9999);
  const month = safeInteger(query.month, 0, 0, 12);
  if (year) params.set('year', `eq.${year}`);
  if (month) params.set('month', `eq.${month}`);
  if (String(query.pinned) === 'true') params.set('is_pinned', 'eq.true');
  if (String(query.featured) === 'true') params.set('is_featured', 'eq.true');

  const search = stringParam(query.q).replace(/[%(),]/g, ' ').replace(/\s+/g, ' ').trim();
  if (search) {
    const term = `*${search}*`;
    params.set('or', `(title.ilike.${term},description.ilike.${term},search_text.ilike.${term})`);
  }

  const response = await supabasePublicFetch(`/photos?${params.toString()}`, {
    headers: { prefer: 'count=exact' },
  }, 'gallery list');
  const photos = (await response.json()) as GalleryPhotoRow[];
  const contentRange = response.headers.get('content-range') || '';
  const totalValue = contentRange.split('/')[1];
  const total = totalValue && totalValue !== '*' ? Number(totalValue) : offset + photos.length;

  return {
    photos: photos.map(publicPhoto),
    pagination: {
      page,
      limit,
      total,
      has_more: offset + photos.length < total,
    },
  };
}

export async function getGalleryPhoto(unsplashId: string) {
  const params = new URLSearchParams({
    select: GALLERY_WITH_FRAME_DETAIL_SELECT,
    source: 'eq.unsplash',
    is_visible: 'eq.true',
    unsplash_id: `eq.${unsplashId}`,
    limit: '1',
  });
  const response = await supabasePublicFetch(`/photos?${params.toString()}`, {}, 'gallery detail');
  const [photo] = (await response.json()) as GalleryPhotoRow[];
  if (!photo) return null;
  return publicPhoto(photo);
}

export async function galleryGroups(column: 'album_name' | 'category' | 'collection_name' | 'moment_group') {
  const params = new URLSearchParams({
    select: GALLERY_SELECT,
    source: 'eq.unsplash',
    is_visible: 'eq.true',
    order: 'created_at_unsplash.desc.nullslast',
    limit: '1000',
  });
  const response = await supabasePublicFetch(`/photos?${params.toString()}`, {}, `gallery ${column} groups`);
  const rows = (await response.json()) as GalleryPhotoRow[];
  const groups = new Map<string, { count: number; cover: ReturnType<typeof publicPhoto>; latest_at: string | null }>();

  for (const row of rows) {
    const name = row[column] || 'Uncategorized';
    const existing = groups.get(name);
    if (existing) {
      existing.count += 1;
    } else {
      groups.set(name, { count: 1, cover: publicPhoto(row), latest_at: row.created_at_unsplash });
    }
  }

  return [...groups.entries()].map(([name, group]) => ({ name, ...group }));
}
