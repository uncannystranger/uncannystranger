import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const photos=JSON.parse(await fs.readFile('Antonio/photographs.json','utf8'));
const pages=(await fs.readdir(root)).filter(n=>n.endsWith('.html'));
let localLinks=0;
for(const page of pages){
 const html=await fs.readFile(path.join(root,page),'utf8');
 assert(!/motion-preview|OriginalMotionPreview|preview-email-note/.test(html),`${page}: preview artifacts`);
 assert(/<button[^>]+id="burger-wrapper"/.test(html),`${page}: semantic menu control`);
 assert(html.includes('https://www.instagram.com/uncannystranger/'),`${page}: Instagram`);
 for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  const url=m[1];if(/^(?:[a-z]+:|\/\/|#)/i.test(url)||url.startsWith('/api/'))continue;
  const file=url.split(/[?#]/)[0];if(!file)continue;
  assert(path.resolve(root,file).startsWith(root+path.sep),`${page}: unsafe local link`);
  await fs.access(path.join(root,file));localLinks++;
 }
}
const archive=await fs.readFile(path.join(root,'index-playground.html'),'utf8');
for(const p of photos){
 const html=await fs.readFile(path.join(root,p.page),'utf8');
 assert(html.includes(`data-photo="${p.slug}"`),`${p.page}: correct photograph`);
 assert(html.includes('photo-description'),`${p.page}: story description`);
 assert(archive.includes(`href="${p.page}"`),`${p.slug}: complete archive story link`);
}
console.log(`Site integrity passed: ${pages.length} pages, ${photos.length} matching photo stories, ${localLinks} local resources/links.`);
