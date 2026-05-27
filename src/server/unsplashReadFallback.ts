import { PINNED_PHOTO_IDS } from '../gallery/constants.js';

type UnsplashPhoto = {
  id: string;
  created_at?: string | null;
  width?: number | null;
  height?: number | null;
  color?: string | null;
  blur_hash?: string | null;
  description?: string | null;
  alt_description?: string | null;
  urls: { raw: string; regular: string; small: string; thumb: string };
  links: { html: string };
  user?: { name?: string | null; links?: { html?: string | null } };
};

const request = async (path: string, params: Record<string, string> = {}) => {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  const username = process.env.UNSPLASH_USERNAME || 'uncannystranger';
  if (!key) return null;
  const url = new URL(`https://api.unsplash.com${path.replace(':username', encodeURIComponent(username))}`);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  const response = await fetch(url, {
    headers: { authorization: `Client-ID ${key}`, accept: 'application/json' },
  }).catch(() => null);
  return response?.ok ? response.json() : null;
};

const fallbackPhoto = (photo: UnsplashPhoto) => ({
  id: photo.id,
  unsplash_id: photo.id,
  photo_source: 'unsplash',
  title: photo.description || photo.alt_description || 'Untitled Photo',
  description: photo.description || null,
  alt_description: photo.alt_description || photo.description || 'Photograph from Unsplash',
  category: 'Uncategorized',
  album_name: 'Uncategorized',
  collection_name: PINNED_PHOTO_IDS.includes(photo.id as typeof PINNED_PHOTO_IDS[number]) ? 'Pinned' : 'Library',
  moment_group: photo.created_at ? photo.created_at.slice(0, 7) : null,
  location_name: null,
  year: photo.created_at ? Number(photo.created_at.slice(0, 4)) : null,
  month: photo.created_at ? Number(photo.created_at.slice(5, 7)) : null,
  created_at_unsplash: photo.created_at || null,
  image_url_small: photo.urls.small,
  image_url_regular: photo.urls.regular,
  image_url_thumb: photo.urls.thumb,
  width: photo.width || null,
  height: photo.height || null,
  aspect_ratio: photo.width && photo.height ? photo.width / photo.height : null,
  blur_hash: photo.blur_hash || null,
  color: photo.color || null,
  is_pinned: PINNED_PHOTO_IDS.includes(photo.id as typeof PINNED_PHOTO_IDS[number]),
  is_featured: false,
  is_favorite: false,
  unsplash_url: photo.links.html,
  photographer_name: photo.user?.name || null,
  photographer_url: photo.user?.links?.html || null,
  tags: [],
});

export async function fallbackGalleryPage(page: number, limit: number) {
  const photos = await request('/users/:username/photos', {
    page: String(page),
    per_page: String(limit),
    order_by: 'latest',
  }) as UnsplashPhoto[] | null;
  if (!photos) return null;
  return {
    photos: photos.map(fallbackPhoto),
    pagination: {
      page,
      limit,
      total: (page - 1) * limit + photos.length + (photos.length === limit ? 1 : 0),
      has_more: photos.length === limit,
    },
    source: 'unsplash-fallback',
  };
}

export async function fallbackPinnedPhotos() {
  const photos = await Promise.all(PINNED_PHOTO_IDS.map((id) => request(`/photos/${encodeURIComponent(id)}`)));
  return photos.filter(Boolean).map((photo) => fallbackPhoto(photo as UnsplashPhoto));
}

export async function fallbackPhotoDetail(id: string) {
  const photo = await request(`/photos/${encodeURIComponent(id)}`) as UnsplashPhoto | null;
  return photo ? fallbackPhoto(photo) : null;
}
