import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const base = 'https://uncannystranger.com/';
const sitemap = await fs.readFile(path.join(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const photos = JSON.parse(await fs.readFile(path.join(root, 'Antonio/photographs.json'), 'utf8'));
const titles = new Set();
const links = new Set();
for (const url of urls) {
  const name = new URL(url).pathname.slice(1) || 'index.html';
  const html = await fs.readFile(path.join(dist, name), 'utf8');
  const canonical = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
  assert.equal(canonical.length, 1, `${name}: one canonical required`);
  assert.equal(canonical[0][1], url, `${name}: canonical must match sitemap`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${name}: one page heading required`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert(title && !titles.has(title), `${name}: unique title required`);
  titles.add(title);
  assert(/<meta name="description" content="[^"]+"/.test(html), `${name}: description required`);
  assert(/<meta name="robots" content="index, follow, max-image-preview:large"/.test(html), `${name}: crawl/preview policy`);
  const graph = JSON.parse(html.match(/id="site-structured-data">([^]*?)<\/script>/)[1])['@graph'];
  assert(graph.some(n => n['@type'] === 'Person' && n.alternateName.includes('uncannystranger')), `${name}: photographer identity`);
  for (const match of html.matchAll(/href="([^"]+)"/g)) links.add(new URL(match[1], url).href.split('#')[0]);
  for (const match of html.matchAll(/<img\b[^>]*data-photo="[^"]+"[^>]*>/g)) {
    assert(/\bsrc="[^"]+"/.test(match[0]) && /\balt="[^"]+"/.test(match[0]), `${name}: crawlable photo src and alt`);
  }
}
for (const photo of photos) {
  assert(links.has(base + photo.page), `${photo.slug}: crawlable story link`);
  assert(sitemap.includes(`${base}images/photographs/${photo.slug}-1280.webp`), `${photo.slug}: image sitemap`);
  const html = await fs.readFile(path.join(dist, photo.page), 'utf8');
  const graph = JSON.parse(html.match(/id="site-structured-data">([^]*?)<\/script>/)[1])['@graph'];
  const image = graph.find(n => n['@type'] === 'ImageObject');
  assert(image?.creator && image.creditText && image.license && image.acquireLicensePage, `${photo.slug}: image rights metadata`);
  await fs.access(path.join(dist, new URL(image.contentUrl).pathname.slice(1)));
}
const highlights = await fs.readFile(path.join(dist, 'index-highlights.html'), 'utf8');
const featured = new Set([...highlights.matchAll(/data-photo="([^"]+)"/g)].map(m => m[1]));
const entry = sitemap.match(/<url>\s*<loc>https:\/\/uncannystranger.com\/index-highlights.html<\/loc>([^]*?)<\/url>/)[1];
for (const slug of featured) assert(entry.includes(`${slug}-1280.webp`), `${slug}: Highlights sitemap coverage`);
console.log(`SEO checks passed: ${urls.length} indexable pages, ${photos.length} photograph stories, ${featured.size} Highlights images.`);
