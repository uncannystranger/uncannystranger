import { supabasePublicFetch } from './supabaseRest.js';

type CachedPhoto = {
  id: string;
  unsplash_id: string;
  title: string;
  description: string | null;
  alt_text: string | null;
  category: string | null;
  color: string | null;
  width: number | null;
  height: number | null;
  tags: string[] | null;
  photographer_name: string | null;
  location_name: string | null;
  created_at_unsplash: string | null;
};

type CachedFrame = {
  photo_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  story: string;
  excerpt: string | null;
  category: string | null;
  read_time: string | null;
};

type FramePayload = {
  unsplash_id: string;
  slug: string;
  title: string;
  subtitle: string;
  story: string;
  excerpt: string;
  category: string;
  read_time: string;
};

const CACHE_PAGE_SIZE = 1000;

export type FrameSyncReport = {
  scanned: number;
  written: number;
  curated_written: number;
  generated_written: number;
  preserved: number;
  duplicate_repaired: number;
  repeated_text_repaired: number;
  emoji_sanitized: number;
  categories_updated: number;
  completed_at: string;
};

const LEGACY_STORY_MARKERS = [
  'The photograph holds its silence long enough for a story to surface.',
  'The city lingers in the frame through light, distance, and memory.',
  'The archive begins where the moment refuses to vanish.',
  'A photograph can hold more than it explains.',
  'Memory often arrives as a fragment.',
];

const GENERATED_STORY_MARKERS = [
  'keeps a private weather that belongs to this image alone.',
  'sets the visual temperature of this',
  'letting its proportion, colour, and recorded detail become an editorial memory.',
  'stays with the light recorded in',
  'shaped by pale-lit light and the measured patience of the camera.',
  'shaped by warm-toned light and the measured patience of the camera.',
  'shaped by low-toned light and the measured patience of the camera.',
  'stays close to the moment it preserves',
  'this image remains in the',
  'close to the moment it preserves',
];

const EMOJI_PATTERN = /[\p{Extended_Pictographic}\u2600-\u27BF\uFE0F\u200D]/gu;
const HAS_EMOJI_PATTERN = /[\p{Extended_Pictographic}\u2600-\u27BF\uFE0F\u200D]/u;

const cleanLine = (value?: string | null) =>
  (value || '')
    .replace(EMOJI_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim();

const cleanParagraphs = (value?: string | null) =>
  (value || '')
    .split(/\n\s*\n/)
    .map(cleanLine)
    .filter(Boolean)
    .join('\n\n');

const slugFor = (title: string, id: string) =>
  `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 54) || 'frame'}-${id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`;

const sourceText = (photo: CachedPhoto) => {
  const description = cleanLine(photo.description);
  if (description && description.toLowerCase() !== 'untitled photo') return description;
  const alt = cleanLine(photo.alt_text);
  return alt && alt.toLowerCase() !== 'untitled photo' ? alt : '';
};

const categoryFor = (photo: CachedPhoto) => {
  const text = [photo.description, photo.alt_text, ...(photo.tags || [])].map(cleanLine).join(' ').toLowerCase();
  if (/(mogadishu|somalia|somali|xamar)/.test(text)) return 'Mogadishu';
  if (/(woman|women|lady|girl|mother|female)/.test(text)) return 'Women';
  if (/(black and white|monochrome|grayscale)/.test(text)) return 'Black & White';
  if (/(portrait|person|face|self-portrait)/.test(text)) return 'Portrait';
  if (/(street|city|urban|road|harbor|market|building|architecture)/.test(text)) return 'Street';
  if (/(light|sun|shadow|glow|golden|tree|ocean|sea|flower|beach)/.test(text)) return 'Light';
  if (/(tea|food|cup|home|daily|everyday)/.test(text)) return 'Everyday';
  return 'Memory';
};

const orientationFor = (photo: CachedPhoto) => {
  if (!photo.width || !photo.height) return 'quiet';
  if (photo.width > photo.height) return 'wide';
  if (photo.width < photo.height) return 'vertical';
  return 'square';
};

const toneFor = (color: string | null) => {
  const match = cleanLine(color).match(/^#?([0-9a-f]{6})$/i);
  if (!match) return 'muted';
  const value = match[1];
  const luminance =
    (Number.parseInt(value.slice(0, 2), 16) * 299 +
      Number.parseInt(value.slice(2, 4), 16) * 587 +
      Number.parseInt(value.slice(4, 6), 16) * 114) /
    1000;
  return luminance < 70 ? 'low-toned' : luminance > 190 ? 'pale-lit' : 'warm-toned';
};

const lightFor = (tone: string) => {
  if (tone === 'low-toned') return 'shadowed';
  if (tone === 'pale-lit') return 'soft, pale';
  if (tone === 'warm-toned') return 'warm';
  return 'muted';
};

const monthFor = (value: string | null) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
    : 'an unmarked hour';
};

const capitalized = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const titledSource = (source: string) => {
  const phrase = source.split(/\s*(?:\u2014|--|;)\s*/)[0].replace(/[,.!?]+$/, '').trim();
  if (phrase && phrase.length <= 82 && phrase.split(/\s+/).length <= 12) return capitalized(phrase);
  return '';
};

const punctuated = (value: string) => (/[.!?]$/.test(value) ? value : `${value}.`);

const styleFor = (id: string) =>
  [...id].reduce((value, character) => value + character.charCodeAt(0), 0) % 4;

const normalizedUnit = (value: string) =>
  cleanLine(value).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();

const storyUnits = (story: string) => {
  const paragraphs = story.split(/\n\s*\n/).map(normalizedUnit).filter(Boolean);
  const sentences = story
    .split(/(?<=[.!?])\s+/)
    .map(normalizedUnit)
    .filter(Boolean);
  return [...new Set([...paragraphs, ...sentences])];
};

const payloadUnits = (frame: Pick<FramePayload, 'title' | 'subtitle' | 'story' | 'excerpt'>) =>
  [...new Set([frame.title, frame.subtitle, frame.excerpt, ...storyUnits(frame.story)]
    .map(normalizedUnit)
    .filter(Boolean))];

const generatedFrame = (photo: CachedPhoto, variation = 0): FramePayload => {
  const orientation = orientationFor(photo);
  const tone = toneFor(photo.color);
  const light = lightFor(tone);
  const category = categoryFor(photo);
  const source = sourceText(photo);
  const dimensions = photo.width && photo.height ? `${photo.width} by ${photo.height}` : 'unmeasured';
  const month = monthFor(photo.created_at_unsplash);
  const photographer = cleanLine(photo.photographer_name) || 'The photographer';
  const location = cleanLine(photo.location_name);
  const reference = photo.unsplash_id.replace(/[^A-Za-z0-9]/g, '').slice(-8) || 'frame';
  const baseTitle =
    titledSource(source) ||
    `${capitalized(light)} Light, ${capitalized(orientation)} ${category}`;
  const title =
    variation === 0
      ? baseTitle
      : variation === 1
        ? `${baseTitle}, ${capitalized(light)} Light`
        : variation === 2
          ? `${baseTitle}, ${month}`
          : `${baseTitle}, Study ${reference}${variation > 3 ? ` ${variation - 2}` : ''}`;
  const place = location ? ` in ${location}` : '';
  const archive = category === 'Black & White' ? 'black-and-white archive' : `${category} archive`;
  const setting =
    category === 'Mogadishu'
      ? `from Mogadishu${location && !/mogadishu/i.test(location) ? `, made in ${location}` : ''}`
      : `from the ${archive}${location ? `, made in ${location}` : ''}`;
  const style = styleFor(photo.unsplash_id);
  const scene = source
    ? variation
      ? `In frame ${reference}, ${punctuated(source).charAt(0).toLowerCase()}${punctuated(source).slice(1)}`
      : punctuated(source)
    : `Without a supplied caption, "${title}" holds ${light} light in a ${orientation} photograph${place}, indexed as frame ${reference}.`;
  const observations = [
    `${photographer} made "${title}" as a ${orientation} composition${place}, allowing its ${light} light and detail to remain unforced.`,
    `In "${title}", ${photographer} lets a ${orientation} composition${place} carry the mood of its ${light} light.`,
    `For "${title}", ${photographer} holds the ${orientation} frame${place} with patience, leaving its ${light} detail intact.`,
    `Through a ${orientation} composition${place}, ${photographer} draws ${light} light into "${title}" without crowding the scene.`,
  ];
  const meanings = [
    `Recorded in ${month} at ${dimensions} pixels, "${title}" enters the ${archive} as an intimate record of the scene${variation > 2 ? `, filed as ${reference}` : ''}.`,
    `Sized at ${dimensions} pixels and dated ${month}, "${title}" belongs to the ${archive} with its atmosphere still intact${variation > 2 ? `, under reference ${reference}` : ''}.`,
    `The ${dimensions}-pixel frame was recorded in ${month}; within the ${archive}, "${title}" keeps the feeling of its original moment${variation > 2 ? `, indexed as ${reference}` : ''}.`,
    `With proportions of ${dimensions} pixels from ${month}, "${title}" is kept in the ${archive} for the detail it allows to linger${variation > 2 ? `, as reference ${reference}` : ''}.`,
  ];
  const subtitles = [
    `"${title}" is a ${orientation} photograph ${setting}, held in ${light} light.`,
    `A ${orientation} frame ${setting} in ${light} light: "${title}".`,
    `"${title}", a ${orientation} image ${setting}, carries ${light} light.`,
    `In this ${orientation} photograph ${setting}, "${title}" gathers ${light} light.`,
  ];
  const closings = [
    `The ${light} detail of "${title}", held in the ${archive} since ${month}.`,
    `"${title}" preserves a ${light} moment from ${month} in the ${archive}.`,
    `From ${month}, "${title}" keeps its ${light} detail in the ${archive}.`,
    `The ${archive} holds "${title}" from ${month}, quiet in ${light} light.`,
  ];

  return {
    unsplash_id: photo.unsplash_id,
    slug: slugFor(title, photo.unsplash_id),
    title: cleanLine(title),
    subtitle: cleanLine(subtitles[style]),
    story: [scene, observations[style], meanings[style]].map(cleanLine).join('\n\n'),
    excerpt: cleanLine(closings[style]),
    category,
    read_time: '2 min read',
  };
};

const invalidStory = (
  frame: CachedFrame | undefined,
  copies: Map<string, number>,
  unitCopies: Map<string, number>
) =>
  !frame ||
  !cleanLine(frame.story) ||
  copies.get(frame.story) !== 1 ||
  storyUnits(frame.story).some((unit) => (unitCopies.get(unit) || 0) > 1) ||
  HAS_EMOJI_PATTERN.test(
    `${frame.title} ${frame.subtitle || ''} ${frame.story} ${frame.excerpt || ''}`
  ) ||
  LEGACY_STORY_MARKERS.some((marker) => frame.story.includes(marker)) ||
  GENERATED_STORY_MARKERS.some((marker) =>
    `${frame.subtitle || ''} ${frame.story} ${frame.excerpt || ''}`.includes(marker)
  );

const unchanged = (left: CachedFrame, right: FramePayload) =>
  left.title === right.title &&
  (left.subtitle || '') === right.subtitle &&
  left.story === right.story &&
  (left.excerpt || '') === right.excerpt &&
  (left.category || '') === right.category &&
  (left.read_time || '') === right.read_time;

const loadPaged = async <T>(path: string, operation: string) => {
  const rows: T[] = [];
  for (let offset = 0; ; offset += CACHE_PAGE_SIZE) {
    const response = await supabasePublicFetch(
      `${path}&limit=${CACHE_PAGE_SIZE}&offset=${offset}`,
      {},
      operation
    );
    const page = (await response.json()) as T[];
    rows.push(...page);
    if (page.length < CACHE_PAGE_SIZE) return rows;
  }
};

const loadCache = async () => {
  return {
    photos: await loadPaged<CachedPhoto>(
      '/photos?source=eq.unsplash&select=id,unsplash_id,title,description,alt_text,category,color,width,height,tags,photographer_name,location_name,created_at_unsplash&order=created_at_unsplash.desc.nullslast',
      'frame sync photos'
    ),
    frames: await loadPaged<CachedFrame>(
      '/frames?select=photo_id,slug,title,subtitle,story,excerpt,category,read_time&is_published=eq.true',
      'frame sync frames'
    ),
  };
};

const persistFrames = async (rows: FramePayload[], report: FrameSyncReport) => {
  const token = process.env.CRON_SECRET;
  if (!token) throw new Error('CRON_SECRET is not configured.');
  await supabasePublicFetch(
    '/rpc/repair_frame_cache',
    {
      method: 'POST',
      headers: { prefer: 'return=minimal' },
      body: JSON.stringify({ p_token: token, p_rows: rows, p_report: report }),
    },
    'frame story repair'
  );
};

export async function syncFrameStories() {
  const { photos, frames } = await loadCache();
  const currentByPhoto = new Map(frames.map((frame) => [frame.photo_id, frame]));
  const storyCopies = new Map<string, number>();
  for (const frame of frames) storyCopies.set(frame.story, (storyCopies.get(frame.story) || 0) + 1);
  const unitCopies = new Map<string, number>();
  for (const frame of frames) {
    for (const unit of storyUnits(frame.story)) unitCopies.set(unit, (unitCopies.get(unit) || 0) + 1);
  }

  const usedUnits = new Set<string>();
  for (const frame of frames) {
    if (!invalidStory(frame, storyCopies, unitCopies)) {
      for (const unit of payloadUnits({
        title: frame.title,
        subtitle: frame.subtitle || '',
        story: frame.story,
        excerpt: frame.excerpt || '',
      })) usedUnits.add(unit);
    }
  }
  const updates: FramePayload[] = [];
  let curatedWritten = 0;
  let generatedWritten = 0;
  let preserved = 0;
  let duplicateRepaired = 0;
  let repeatedTextRepaired = 0;
  let emojiSanitized = 0;
  let categoriesUpdated = 0;

  for (const photo of photos) {
    const current = currentByPhoto.get(photo.id);
    const invalid = invalidStory(current, storyCopies, unitCopies);

    if (current && storyCopies.get(current.story)! > 1) duplicateRepaired += 1;
    if (current && storyUnits(current.story).some((unit) => (unitCopies.get(unit) || 0) > 1)) repeatedTextRepaired += 1;
    if (
      current &&
      HAS_EMOJI_PATTERN.test(
        `${current.title} ${current.subtitle || ''} ${current.story} ${current.excerpt || ''}`
      )
    ) {
      emojiSanitized += 1;
    }

    if (!invalid && current) {
      preserved += 1;
      continue;
    }
    let desired = generatedFrame(photo);
    for (let variation = 1; payloadUnits(desired).some((unit) => usedUnits.has(unit)); variation += 1) {
      desired = generatedFrame(photo, variation);
    }
    for (const unit of payloadUnits(desired)) usedUnits.add(unit);
    if ((photo.category || '') !== desired.category) categoriesUpdated += 1;
    if (current && unchanged(current, desired)) {
      preserved += 1;
      continue;
    }
    updates.push(desired);
    generatedWritten += 1;
  }

  const report: FrameSyncReport = {
    scanned: photos.length,
    written: updates.length,
    curated_written: curatedWritten,
    generated_written: generatedWritten,
    preserved,
    duplicate_repaired: duplicateRepaired,
    repeated_text_repaired: repeatedTextRepaired,
    emoji_sanitized: emojiSanitized,
    categories_updated: categoriesUpdated,
    completed_at: new Date().toISOString(),
  };

  if (updates.length) await persistFrames(updates, report);
  return report;
}
