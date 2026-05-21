const SUPABASE_REST_PATH = '/rest/v1';
const USERNAME = 'uncannystranger';
const UNSPLASH_PER_PAGE = 30;
const UNSPLASH_MAX_PAGES = 50;

const json = (res: any, status: number, body: unknown) => {
  res.status(status).setHeader('content-type', 'application/json');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);

const editorialText = (photo: any) => {
  const raw = `${photo.description || ''} ${photo.alt_description || ''}`.toLowerCase();
  if (raw.includes('tea') || raw.includes('cup')) {
    return {
      title: 'Two Cups Before Noon',
      caption: 'Hospitality rests in a plate, warm enough to slow the day.',
      category: 'Everyday',
      story: 'Tea, pastry, foam, and street blur gather into a small ritual of care. The image is domestic and public at once, a portable table carried through the rhythm of Mogadishu.',
    };
  }
  if (raw.includes('harbor') || raw.includes('crane') || raw.includes('ship')) {
    return {
      title: 'Harbor Breath',
      caption: 'Steel, sea, and rooftops meet where Mogadishu keeps moving.',
      category: 'Mogadishu',
      story: 'The frame watches work from a distance and lets the harbor become a horizon of labor, weather, and return.',
    };
  }
  if (raw.includes('cafe')) {
    return {
      title: 'Cafe After Dusk',
      caption: 'After dusk, the storefront becomes a small room for the street.',
      category: 'Street',
      story: 'Blue signage, brick, chairs, and hanging lights create a threshold between public dark and private comfort.',
    };
  }
  if (raw.includes('coding') || raw.includes('computer') || raw.includes('laptop')) {
    return {
      title: 'Night Work, Blue Screen',
      caption: 'Screens turn the room into a private weather of focus.',
      category: 'Everyday',
      story: 'The photograph is less about technology than concentration made visible after hours.',
    };
  }
  const fallbackTitle = photo.alt_description || photo.description || 'Untitled Frame';
  return {
    title: fallbackTitle.split(' ').slice(0, 6).join(' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
    caption: photo.description || photo.alt_description || 'A quiet frame from the archive, held for a slower look.',
    category: 'Memory',
    story: photo.description || photo.alt_description || 'The frame holds a lived moment without forcing it into explanation. It remains open, specific, and quietly attentive.',
  };
};

const supabaseFetch = async (path: string, init: RequestInit = {}) => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase server environment.');
  return fetch(`${url}${SUPABASE_REST_PATH}${path}`, {
    ...init,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      prefer: 'return=representation',
      ...(init.headers || {}),
    },
  });
};

const fetchUnsplashArchive = async (unsplashKey: string) => {
  const photos: any[] = [];

  for (let page = 1; page <= UNSPLASH_MAX_PAGES; page += 1) {
    const url = new URL(`https://api.unsplash.com/users/${USERNAME}/photos`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(UNSPLASH_PER_PAGE));
    url.searchParams.set('order_by', 'latest');
    url.searchParams.set('stats', 'true');

    const unsplash = await fetch(url.toString(), {
      headers: { authorization: `Client-ID ${unsplashKey}` },
    });
    if (!unsplash.ok) throw new Error(`Unsplash sync failed: ${unsplash.status}`);

    const pagePhotos = await unsplash.json();
    photos.push(...pagePhotos);

    if (pagePhotos.length < UNSPLASH_PER_PAGE) break;
  }

  const seen = new Set<string>();
  return photos
    .filter((photo) => {
      if (!photo?.id || seen.has(photo.id)) return false;
      seen.add(photo.id);
      return true;
    })
    .sort((a, b) => new Date(b.created_at || b.updated_at || 0).getTime() - new Date(a.created_at || a.updated_at || 0).getTime());
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const secretRequired = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  if (secretRequired && !process.env.SYNC_SECRET) {
    return json(res, 500, { error: 'Sync secret is not configured.' });
  }
  if (process.env.SYNC_SECRET && req.headers['x-sync-secret'] !== process.env.SYNC_SECRET) {
    return json(res, 401, { error: 'Unauthorized' });
  }

  try {
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!unsplashKey) throw new Error('Missing Unsplash server environment.');

    const photos = await fetchUnsplashArchive(unsplashKey);

    let synced = 0;
    for (const photo of photos) {
      const copy = editorialText(photo);
      const location = photo.location?.name || [photo.location?.city, photo.location?.country].filter(Boolean).join(', ') || 'Somalia';
      const photoPayload = {
        unsplash_id: photo.id,
        unsplash_url: photo.links.html,
        image_url_small: photo.urls.small,
        image_url_regular: photo.urls.regular,
        image_url_full: photo.urls.full,
        title: copy.title,
        caption: copy.caption,
        description: copy.caption,
        alt_text: photo.alt_description || copy.caption,
        category: copy.category,
        source: 'unsplash',
        location,
        author_name: photo.user?.name || 'Abdullahi Maxamed',
        author_username: photo.user?.username || USERNAME,
        created_at_unsplash: photo.created_at,
        updated_at_unsplash: photo.updated_at,
        width: photo.width,
        height: photo.height,
        color: photo.color,
        blur_hash: photo.blur_hash,
        tags: (photo.tags || []).map((tag: any) => tag.title).filter(Boolean),
        is_frame: true,
        is_visible: true,
      };

      const upsertPhoto = await supabaseFetch('/photos?on_conflict=unsplash_id', {
        method: 'POST',
        headers: { prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(photoPayload),
      });
      if (!upsertPhoto.ok) throw new Error(`Photo upsert failed: ${await upsertPhoto.text()}`);
      const [savedPhoto] = await upsertPhoto.json();

      const framePayload = {
        photo_id: savedPhoto.id,
        slug: slugify(`${copy.title}-${photo.id}`),
        title: copy.title,
        subtitle: copy.caption,
        excerpt: copy.caption,
        story: copy.story,
        category: copy.category,
        read_time: '2 min read',
        is_published: true,
      };
      const upsertFrame = await supabaseFetch('/frames?on_conflict=photo_id', {
        method: 'POST',
        headers: { prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(framePayload),
      });
      if (!upsertFrame.ok) throw new Error(`Frame upsert failed: ${await upsertFrame.text()}`);
      synced += 1;
    }

    await supabaseFetch('/sync_logs', {
      method: 'POST',
      body: JSON.stringify({ type: 'unsplash', status: 'success', message: `Synced ${synced} photos.` }),
    });

    return json(res, 200, { synced });
  } catch {
    return json(res, 500, { error: 'Sync failed.' });
  }
}
