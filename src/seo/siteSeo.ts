export const SITE_URL = 'https://uncannystranger.com';
export const SITE_NAME = 'Uncanny Stranger';
export const PERSON_NAME = 'Abdullahi Maxamed';
export const DEFAULT_OG_IMAGE =
  'https://uncannystranger.com/og-image.jpg';
export const DEFAULT_OG_IMAGE_ALT =
  'Uncanny Stranger cinematic photography portfolio preview image.';
export const PUBLIC_PROFILE_IMAGE =
  'https://res.cloudinary.com/duwhuzkib/image/upload/f_auto,q_auto,dpr_auto,c_fill,w_600/WhatsApp_Image_2025-09-16_at_12.10.24_qkle3u';

export const pageSeo = {
  home: {
    path: '/',
    title: 'Uncanny Stranger — Cinematic Photography & Visual Storytelling',
    description:
      'Official portfolio of Uncanny Stranger, featuring cinematic photography, editorial visuals, Somali travel photography, documentary-style scenes, and creative visual storytelling.',
    keywords:
      'Uncanny Stranger, Abdullahi Maxamed, Somali photographer, Mogadishu photography, photography portfolio, cinematic photography, documentary photography, editorial photography',
  },
  projects: {
    path: '/projects',
    title: 'Photography Projects | Uncanny Stranger',
    description:
      'Explore photography projects, albums, collections, and exhibitions by Abdullahi Maxamed, the Somali photographer known as Uncanny Stranger.',
    keywords:
      'Uncanny Stranger projects, Abdullahi Maxamed photography, Somali photography portfolio, editorial photography, travel photography, documentary photography',
  },
  artist: {
    path: '/artist',
    title: 'About Abdullahi Maxamed | Uncanny Stranger',
    description:
      'Learn about Abdullahi Maxamed, the Somali photographer behind Uncanny Stranger, and his approach to visual storytelling, light, memory, and urban photography.',
    keywords:
      'Abdullahi Maxamed, Uncanny Stranger, Somali photographer, Mogadishu photographer, visual storytelling, artist biography',
  },
  notFound: {
    path: '',
    title: 'Page Not Found | Uncanny Stranger',
    description: 'The requested page could not be found.',
    keywords: 'Uncanny Stranger',
  },
} as const;

export type SeoPageKey = keyof typeof pageSeo;

export const canonicalFor = (path: string) =>
  path === '/' ? SITE_URL : `${SITE_URL}${path}`;
