import { getFrameStorySummary } from '../data/frameStoryIndex';
import { UnsplashApiPhoto, UnsplashCategory, UnsplashPhoto } from '../services/unsplash';

const CATEGORY_KEYWORDS: Array<[UnsplashCategory, string[]]> = [
  ['Mogadishu', ['mogadishu', 'somalia', 'somali', 'xamar']],
  ['Women', ['woman', 'women', 'lady', 'girl', 'mother', 'female']],
  ['Portrait', ['portrait', 'face', 'person', 'smile', 'glasses', 'head']],
  ['Black & White', ['black and white', 'monochrome', 'bw', 'grayscale']],
  ['Street', ['street', 'city', 'urban', 'road', 'harbor', 'market']],
  ['Light', ['light', 'sun', 'shadow', 'glow', 'golden']],
  ['Everyday', ['tea', 'food', 'cup', 'home', 'daily', 'everyday']],
];

const TITLE_BANK = [
  'Rooftop Weather',
  'Threshold In Passing',
  'Street Note At Dusk',
  'Small Room, Wide Air',
  'Gesture Near Home',
  'Harbor Line Study',
  'Portrait Without Noise',
  'Wall Shadow, Briefly',
];

const makeIntro = (description: string) => description;

const makeReadingTime = (description: string) => {
  const words = description.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} min read`;
};

const unsplashSizedUrl = (
  url: string,
  width: number,
  quality = 75,
  fit: 'crop' | 'max' = 'max'
) => {
  if (!url || !url.includes('images.unsplash.com')) return url;
  const parsed = new URL(url);
  if (fit !== 'crop') parsed.searchParams.delete('crop');
  parsed.searchParams.set('auto', 'format');
  parsed.searchParams.set('fit', fit);
  parsed.searchParams.set('w', String(width));
  parsed.searchParams.set('q', String(quality));
  return parsed.toString();
};

const unsplashSrcSet = (
  url: string,
  widths: number[],
  quality = 75,
  fit: 'crop' | 'max' = 'max'
) =>
  widths
    .map((width) => `${unsplashSizedUrl(url, width, quality, fit)} ${width}w`)
    .join(', ');

export function formatUnsplashPhoto(photo: UnsplashApiPhoto): UnsplashPhoto {
  const story = getFrameStorySummary(photo.id);
  const title = photo.frame_story?.title || story?.title || generatePoeticTitle(photo);
  const category = (photo.frame_story?.category || story?.category || photo.category || generateCategory(photo)) as UnsplashCategory;
  const description =
    photo.frame_story?.excerpt ||
    story?.excerpt ||
    photo.description ||
    photo.alt_description ||
    'A quiet archive of faces, light, and unfinished moments.';

  const created = photo.created_at || new Date().toISOString();
  const width = photo.width || 4;
  const height = photo.height || 5;

  return {
    id: `unsplash-${photo.id}`,
    rawId: photo.id,
    source: 'unsplash',
    title,
    description,
    intro: photo.frame_story?.excerpt || story?.excerpt || makeIntro(description),
    image: unsplashSizedUrl(photo.urls.raw || photo.urls.regular, 1600, 75, 'max'),
    imageSmall: unsplashSizedUrl(photo.urls.raw || photo.urls.small, 640, 72, 'max'),
    imageSrcSet: unsplashSrcSet(photo.urls.raw || photo.urls.regular, [960, 1280, 1600, 2000], 75, 'max'),
    imageSmallSrcSet: unsplashSrcSet(photo.urls.raw || photo.urls.small, [360, 540, 720, 960], 72, 'max'),
    alt: photo.alt_description || photo.description || title,
    category,
    date: formatDate(created),
    year: String(new Date(created).getFullYear()),
    sortTimestamp: new Date(created).getTime(),
    readingTime: photo.frame_story?.read_time || story?.readTime || makeReadingTime(description),
    location: formatLocation(photo),
    width,
    height,
    aspectRatio: width / height,
    color: photo.color || '#111111',
    likes: typeof photo.likes === 'number' ? photo.likes : null,
    views: typeof photo.views === 'number' ? photo.views : null,
    downloads: typeof photo.downloads === 'number' ? photo.downloads : null,
    exif: photo.exif || null,
    tags: (photo.tags || []).map((tag) => tag.title).filter(Boolean).slice(0, 12),
    unsplashUrl: photo.links.html,
    downloadLocation: photo.links.download_location,
    photographer: photo.user?.name || 'Abdullahi Mohamud',
    frameStory: photo.frame_story || null,
  };
}

export function mergePhotoDetails(photo: UnsplashPhoto, details: UnsplashApiPhoto): UnsplashPhoto {
  const formatted = formatUnsplashPhoto(details);
  return {
    ...photo,
    ...formatted,
    id: photo.id,
    rawId: photo.rawId,
    imageSmall: photo.imageSmall,
  };
}

export function generatePoeticTitle(photo: UnsplashApiPhoto) {
  const source = photo.description || photo.alt_description || '';
  const clean = source
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean) {
    return clean
      .split(' ')
      .slice(0, 7)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const index = photo.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return TITLE_BANK[index % TITLE_BANK.length];
}

export function generateCategory(photo: UnsplashApiPhoto): UnsplashCategory {
  const text = [
    photo.description,
    photo.alt_description,
    photo.location?.name,
    photo.location?.city,
    photo.location?.country,
    ...(photo.tags || []).map((tag) => tag.title),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  for (const [category, keywords] of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => text.includes(keyword))) return category;
  }

  return 'Memory';
}

export function formatDate(value?: string) {
  if (!value) return 'Undated';
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatStats(value?: number | null) {
  if (typeof value !== 'number') return '—';
  return new Intl.NumberFormat('en', {
    notation: value >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatLocation(photo: UnsplashApiPhoto) {
  const exact = photo.location?.name;
  const parts = [photo.location?.city, photo.location?.country].filter(Boolean);
  if (exact) return exact;
  if (parts.length) return parts.join(', ');
  return 'Somalia';
}

export function cameraLabel(photo: UnsplashPhoto) {
  const make = photo.exif?.make;
  const model = photo.exif?.model;
  if (make && model) return `${make}, ${model}`;
  return photo.exif?.name || 'Camera details unavailable';
}
