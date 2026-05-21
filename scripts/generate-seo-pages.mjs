import fs from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://uncannystranger.com';
const siteName = 'Uncanny Stranger';
const personName = 'Abdullahi Maxamed';
const ogImage = `${siteUrl}/og-image.jpg`;
const ogImageAlt = 'Uncanny Stranger cinematic photography portfolio preview image.';
const publicProfileImage =
  'https://res.cloudinary.com/duwhuzkib/image/upload/f_auto,q_auto,dpr_auto,c_fill,w_600/WhatsApp_Image_2025-09-16_at_12.10.24_qkle3u';

const routes = [
  {
    key: 'home',
    outDir: '',
    path: '/',
    title: 'Uncanny Stranger — Cinematic Photography & Visual Storytelling',
    description:
      'Official portfolio of Uncanny Stranger, featuring cinematic photography, editorial visuals, Somali travel photography, documentary-style scenes, and creative visual storytelling.',
    keywords:
      'Uncanny Stranger, Abdullahi Maxamed, Somali photographer, Mogadishu photography, photography portfolio, cinematic photography, documentary photography, editorial photography',
    fallback: `
      <main>
        <h1>Uncanny Stranger</h1>
        <p>Official portfolio of Uncanny Stranger, featuring cinematic photography, editorial visuals, Somali travel photography, documentary-style scenes, and creative visual storytelling.</p>
        <nav aria-label="Primary">
          <a href="/projects">Photography projects</a>
          <a href="/artist">About the artist</a>
        </nav>
      </main>`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: 'Uncanny Stranger — Cinematic Photography & Visual Storytelling',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#person` },
        primaryImageOfPage: { '@id': `${siteUrl}/#primaryimage` },
      },
    ],
  },
  {
    key: 'projects',
    outDir: 'projects',
    path: '/projects',
    title: 'Photography Projects | Uncanny Stranger',
    description:
      'Explore photography projects, albums, collections, and exhibitions by Abdullahi Maxamed, the Somali photographer known as Uncanny Stranger.',
    keywords:
      'Uncanny Stranger projects, Abdullahi Maxamed photography, Somali photography portfolio, editorial photography, travel photography, documentary photography',
    fallback: `
      <main>
        <h1>Photography Projects by Uncanny Stranger</h1>
        <p>Albums, collections, and exhibitions by Abdullahi Maxamed, including cinematic, editorial, documentary, and travel photography.</p>
        <nav aria-label="Primary">
          <a href="/">Home</a>
          <a href="/artist">About the artist</a>
        </nav>
      </main>`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/projects#webpage`,
        url: `${siteUrl}/projects`,
        name: 'Photography Projects | Uncanny Stranger',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#person` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: `${siteUrl}/projects`,
          },
        ],
      },
    ],
  },
  {
    key: 'frames',
    outDir: 'frames',
    path: '/frames',
    title: 'Frames | Uncanny Stranger Editorial Photo Stories',
    description:
      'Read poetic editorial Frames by Uncanny Stranger, where Mogadishu-rooted photography becomes short visual essays, image notes, and cinematic archive stories.',
    keywords:
      'Uncanny Stranger Frames, Somali photo stories, Mogadishu visual essays, editorial photography stories, Abdullahi Maxamed photography',
    fallback: `
      <main>
        <h1>Frames by Uncanny Stranger</h1>
        <p>Editorial photography stories, visual essays, and cinematic archive notes by Abdullahi Maxamed.</p>
        <nav aria-label="Primary">
          <a href="/">Home</a>
          <a href="/projects">Photography projects</a>
          <a href="/artist">About the artist</a>
        </nav>
      </main>`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/frames#webpage`,
        url: `${siteUrl}/frames`,
        name: 'Frames | Uncanny Stranger Editorial Photo Stories',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#person` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        '@id': `${siteUrl}/frames#blog`,
        url: `${siteUrl}/frames`,
        name: 'Frames',
        creator: { '@id': `${siteUrl}/#person` },
        description:
          'Poetic editorial photo stories, image notes, and cinematic archive essays.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Frames',
            item: `${siteUrl}/frames`,
          },
        ],
      },
    ],
  },
  {
    key: 'artist',
    outDir: 'artist',
    path: '/artist',
    title: 'About Abdullahi Maxamed | Uncanny Stranger',
    description:
      'Learn about Abdullahi Maxamed, the Somali photographer behind Uncanny Stranger, and his approach to visual storytelling, light, memory, and urban photography.',
    keywords:
      'Abdullahi Maxamed, Uncanny Stranger, Somali photographer, Mogadishu photographer, visual storytelling, artist biography',
    fallback: `
      <main>
        <h1>About Abdullahi Maxamed</h1>
        <p>Abdullahi Maxamed is the Somali photographer behind Uncanny Stranger, a personal archive of visual storytelling, light, memory, and urban photography.</p>
        <nav aria-label="Primary">
          <a href="/">Home</a>
          <a href="/projects">Photography projects</a>
        </nav>
      </main>`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        '@id': `${siteUrl}/artist#webpage`,
        url: `${siteUrl}/artist`,
        name: 'About Abdullahi Maxamed | Uncanny Stranger',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#person` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Artist',
            item: `${siteUrl}/artist`,
          },
        ],
      },
    ],
  },
];

const distDir = path.resolve('dist');
const source = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

const sharedSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: personName,
    alternateName: [siteName, 'Abdullahi M.', 'uncannystranger'],
    url: siteUrl,
    image: publicProfileImage,
    description: 'Editorial photography portfolio and visual archive based in Mogadishu, Somalia.',
    jobTitle: ['Photographer', 'Visual Artist', 'Digital Artist', 'Creative Technologist'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mogadishu',
      addressCountry: 'SO',
    },
    knowsAbout: ['Photography', 'Visual storytelling', 'Cinematography', 'Urban documentation'],
    sameAs: [
      'https://www.instagram.com/uncannystranger',
      'https://www.pexels.com/@uncannystranger',
      'https://unsplash.com/@uncannystranger',
      'https://www.linkedin.com/in/uncannystranger/',
      'https://www.pinterest.com/uncannystranger/',
      'https://www.facebook.com/uncannystranger',
      'https://www.tiktok.com/@uncannystranger',
      'https://github.com/uncannystranger',
      'https://x.com/uncannystranger',
      'https://glass.photo/uncannystranger',
      'https://uncannystranger.medium.com/abdullahi-maxamed-uncannystranger-c0d61a149d75',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${siteUrl}/#profile`,
    url: siteUrl,
    name: `${siteName} — ${personName}`,
    description: 'Editorial photography portfolio and visual archive based in Mogadishu, Somalia.',
    mainEntity: { '@id': `${siteUrl}/#person` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    alternateName: personName,
    publisher: { '@id': `${siteUrl}/#person` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${siteUrl}/#primaryimage`,
    contentUrl: ogImage,
    url: ogImage,
    creator: { '@id': `${siteUrl}/#person` },
    creditText: personName,
    copyrightNotice: `${personName} / ${siteName}`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${siteUrl}/#portfolio`,
    name: siteName,
    url: siteUrl,
    description: 'Cinematic photography and visual storytelling portfolio.',
    creator: { '@id': `${siteUrl}/#person` },
    copyrightHolder: { '@id': `${siteUrl}/#person` },
    image: ogImage,
  },
];

function replaceMeta(html, route) {
  const canonical = route.path === '/' ? siteUrl : `${siteUrl}${route.path}`;
  const schemas = [...sharedSchemas, ...route.schema]
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join('\n  ');

  return html
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(
      /<meta name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${route.description}" />`
    )
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<link rel="alternate" hreflang="en"[^>]*>/, `<link rel="alternate" hreflang="en" href="${canonical}" />`)
    .replace(/<link rel="alternate" hreflang="so"[^>]*>/, `<link rel="alternate" hreflang="so" href="${canonical}" />`)
    .replace(/<link rel="alternate" hreflang="x-default"[^>]*>/, `<link rel="alternate" hreflang="x-default" href="${siteUrl}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:site_name"[^>]*>/, `<meta property="og:site_name" content="${siteName}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${route.title}" />`)
    .replace(
      /<meta property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${route.description}" />`
    )
    .replace(/<meta property="og:image"[\s\S]*?\/>/, `<meta property="og:image" content="${ogImage}" />`)
    .replace(/<meta property="og:image:alt"[^>]*>/, `<meta property="og:image:alt" content="${ogImageAlt}" />`)
    .replace(/<meta name="twitter:url"[^>]*>/, `<meta name="twitter:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${route.title}" />`)
    .replace(
      /<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${route.description}" />`
    )
    .replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${ogImage}" />`)
    .replace(/<meta name="twitter:image:alt"[^>]*>/, `<meta name="twitter:image:alt" content="${ogImageAlt}" />`)
    .replace(
      /<meta name="robots"[^>]*>/,
      '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />'
    )
    .replace(
      /<!-- Structured Data \(Knowledge Panel \/ Person\) -->[\s\S]*?<!-- Fonts preload \(critical for LCP\) -->/,
      `<!-- Structured Data -->\n  ${schemas}\n\n  <!-- Fonts preload (critical for LCP) -->`
    );
}

for (const route of routes) {
  const html = replaceMeta(source, route);
  const targetDir = route.outDir ? path.join(distDir, route.outDir) : distDir;
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html);
}
