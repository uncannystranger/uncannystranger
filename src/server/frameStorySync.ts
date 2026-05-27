import { FRAME_STORY_BODIES } from '../data/frameStoryBodies.js';
import { getFrameStorySummary } from '../data/frameStoryIndex.js';
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

export type FrameSyncReport = {
  scanned: number;
  written: number;
  curated_written: number;
  generated_written: number;
  preserved: number;
  duplicate_repaired: number;
  emoji_sanitized: number;
  categories_updated: number;
  completed_at: string;
};

const LEGACY_STORY_MARKERS = [
  'The photograph holds its silence long enough for a story to surface.',
  'The city lingers in the frame through light, distance, and memory.',
];

const QUOTES = [
  'Every frame carries a private weather.',
  'A small silence can still become a record.',
  'Light leaves its evidence in ordinary places.',
  'A photograph begins where explanation becomes quiet.',
  'The image holds what the hour nearly lost.',
  'Distance can make a moment more intimate.',
  'Stillness is another form of witness.',
  'The archive remembers through fragments.',
];

const CLOSINGS = [
  'The moment remains, quiet but unmistakable.',
  'What passed briefly now has a place to stay.',
  'The frame closes, but the light continues.',
  'The archive keeps this particular breath of time.',
  'The scene departs slowly, leaving its temperature behind.',
  'The image returns the day as memory.',
  'Its silence is now part of the record.',
  'The photograph lets the moment remain unfinished.',
];

const cleanLine = (value?: string | null) =>
  (value || '')
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

const cleanParagraphs = (value?: string | null) =>
  (value || '')
    .split(/\n\s*\n/)
    .map(cleanLine)
    .filter(Boolean)
    .join('\n\n');

const seedFor = (id: string) =>
  [...id].reduce((seed, char) => (seed * 31 + char.charCodeAt(0)) >>> 0, 7);

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

const monthFor = (value: string | null) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
    : 'an unmarked hour';
};

const generatedFrame = (photo: CachedPhoto, variation = 0): FramePayload => {
  const seed = seedFor(photo.unsplash_id) + variation;
  const orientation = orientationFor(photo);
  const tone = toneFor(photo.color);
  const category = categoryFor(photo);
  const source = sourceText(photo);
  const dimensions = photo.width && photo.height ? `${photo.width} by ${photo.height}` : 'unmeasured';
  const month = monthFor(photo.created_at_unsplash);
  const photographer = cleanLine(photo.photographer_name) || 'the photographer';
  const title = source
    ? source.split(' ').slice(0, 6).join(' ')
    : `${tone.charAt(0).toUpperCase()}${tone.slice(1)} ${orientation.charAt(0).toUpperCase()}${orientation.slice(1)} Study`;
  const scene = source
    ? `${source.replace(/[.!?]$/, '')}. The ${orientation} composition lets the moment unfold without forcing it.`
    : `Without a written caption, a ${tone} ${orientation} photograph gathers light across its field.`;
  const quote = QUOTES[seed % QUOTES.length];
  const observation = `Recorded at ${dimensions} pixels in ${month}, its ${tone} palette gives this ${category.toLowerCase()} frame a precise visual temperature.`;
  const meaning = `${photographer} leaves the image open enough for attention to settle; this particular arrangement of proportion and colour belongs only to this frame.`;
  const closing = `${CLOSINGS[(seed * 3) % CLOSINGS.length]} ${month} remains in its edges.`;

  return {
    unsplash_id: photo.unsplash_id,
    slug: slugFor(title, photo.unsplash_id),
    title: cleanLine(title),
    subtitle: cleanLine(
      `A ${orientation} study from ${category}, shaped by ${tone} light and the measured patience of the camera.`
    ),
    story: [quote, scene, observation, meaning].map(cleanLine).join('\n\n'),
    excerpt: cleanLine(closing),
    category,
    read_time: '2 min read',
  };
};

const curatedFrame = (photo: CachedPhoto): FramePayload | null => {
  const summary = getFrameStorySummary(photo.unsplash_id);
  const body = FRAME_STORY_BODIES[photo.unsplash_id as keyof typeof FRAME_STORY_BODIES];
  if (!summary || !body) return null;
  return {
    unsplash_id: photo.unsplash_id,
    slug: slugFor(summary.title, photo.unsplash_id),
    title: cleanLine(summary.title),
    subtitle: cleanLine(body.opening),
    story: [body.quote, body.story, body.observation, body.meaning].map(cleanLine).join('\n\n'),
    excerpt: cleanLine(body.closing),
    category: summary.category,
    read_time: summary.readTime,
  };
};

const invalidStory = (frame: CachedFrame | undefined, copies: Map<string, number>) =>
  !frame ||
  !cleanLine(frame.story) ||
  copies.get(frame.story) !== 1 ||
  /[\p{Extended_Pictographic}\uFE0F\u200D]/u.test(
    `${frame.title} ${frame.subtitle || ''} ${frame.story} ${frame.excerpt || ''}`
  ) ||
  LEGACY_STORY_MARKERS.some((marker) => frame.story.includes(marker));

const unchanged = (left: CachedFrame, right: FramePayload) =>
  left.title === right.title &&
  (left.subtitle || '') === right.subtitle &&
  left.story === right.story &&
  (left.excerpt || '') === right.excerpt &&
  (left.category || '') === right.category &&
  (left.read_time || '') === right.read_time;

const loadCache = async () => {
  const photoResponse = await supabasePublicFetch(
    '/photos?source=eq.unsplash&select=id,unsplash_id,title,description,alt_text,category,color,width,height,tags,photographer_name,created_at_unsplash&order=created_at_unsplash.desc.nullslast&limit=1000',
    {},
    'frame sync photos'
  );
  const frameResponse = await supabasePublicFetch(
    '/frames?select=photo_id,slug,title,subtitle,story,excerpt,category,read_time&is_published=eq.true&limit=1000',
    {},
    'frame sync frames'
  );
  return {
    photos: (await photoResponse.json()) as CachedPhoto[],
    frames: (await frameResponse.json()) as CachedFrame[],
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

  const usedStories = new Set<string>();
  const updates: FramePayload[] = [];
  let curatedWritten = 0;
  let generatedWritten = 0;
  let preserved = 0;
  let duplicateRepaired = 0;
  let emojiSanitized = 0;
  let categoriesUpdated = 0;

  for (const photo of photos) {
    const current = currentByPhoto.get(photo.id);
    const invalid = invalidStory(current, storyCopies);
    const curated = curatedFrame(photo);
    let desired = curated || generatedFrame(photo);

    const categoryChanged = (photo.category || '') !== desired.category;
    if (categoryChanged) categoriesUpdated += 1;
    if (current && storyCopies.get(current.story)! > 1) duplicateRepaired += 1;
    if (
      current &&
      /[\p{Extended_Pictographic}\uFE0F\u200D]/u.test(
        `${current.title} ${current.subtitle || ''} ${current.story} ${current.excerpt || ''}`
      )
    ) {
      emojiSanitized += 1;
    }

    if (!invalid && current && !categoryChanged) {
      usedStories.add(current.story);
      preserved += 1;
      continue;
    }
    if (!invalid && current && categoryChanged) {
      desired = {
        ...desired,
        slug: current.slug,
        title: current.title,
        subtitle: current.subtitle || desired.subtitle,
        story: current.story,
        excerpt: current.excerpt || desired.excerpt,
        read_time: current.read_time || desired.read_time,
      };
    }
    for (let variation = 1; usedStories.has(desired.story) && variation < 16; variation += 1) {
      desired = curated || generatedFrame(photo, variation);
    }
    if (usedStories.has(desired.story)) {
      desired.story = `${desired.story}\n\nThis frame is held under archive notation ${photo.unsplash_id}.`;
    }
    usedStories.add(desired.story);
    if (current && unchanged(current, desired) && !categoryChanged) {
      preserved += 1;
      continue;
    }
    updates.push(desired);
    if (curated) curatedWritten += 1;
    else generatedWritten += 1;
  }

  const report: FrameSyncReport = {
    scanned: photos.length,
    written: updates.length,
    curated_written: curatedWritten,
    generated_written: generatedWritten,
    preserved,
    duplicate_repaired: duplicateRepaired,
    emoji_sanitized: emojiSanitized,
    categories_updated: categoriesUpdated,
    completed_at: new Date().toISOString(),
  };

  if (updates.length) await persistFrames(updates, report);
  return report;
}
