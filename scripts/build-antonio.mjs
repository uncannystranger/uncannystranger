import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'Antonio');
const target = path.join(root, 'dist');
const pages = (await fs.readdir(source)).filter(name => /^(index(?:-portfolio|-playground|-highlights)?|about|contact|resources|multimedia|shortcodes|project0[1-9])\.html$/.test(name));
const pending = [...pages, 'robots.txt', 'sitemap.xml', 'favicon.ico'];
const included = new Set();
const allowed = /\.(?:html|css|js|jpe?g|png|webp|svg|gif|ico|woff2?|ttf|eot|xml|txt)$/i;
await fs.rm(target, {recursive:true, force:true});
await fs.mkdir(target, {recursive:true});
while (pending.length) {
  const relative = pending.pop();
  if (included.has(relative)) continue;
  if (!allowed.test(relative) || relative.split('/').some(p => p.startsWith('.')) || relative.startsWith('_external/')) throw new Error(`Disallowed production asset: ${relative}`);
  const file = path.resolve(source, relative);
  if (!file.startsWith(source + path.sep)) throw new Error('Asset path escaped site root');
  const data = await fs.readFile(file);
  included.add(relative);
  await fs.mkdir(path.dirname(path.join(target,relative)), {recursive:true});
  // Do not advertise production source maps.
  const output = /\.(css|js)$/.test(relative) ? data.toString().replace(/\/\/[#@]\s*sourceMappingURL=[^\r\n]*/g,'').replace(/\/\*[#@]\s*sourceMappingURL=.*?\*\//g,'') : data;
  await fs.writeFile(path.join(target,relative),output);
  if (!/\.(html|css|js)$/.test(relative)) continue;
  const text = data.toString();
  const refs = [...text.matchAll(/(?:src|href|data-bg-image)=["']([^"']+)["']/g)].map(m=>m[1]);
  for (const m of text.matchAll(/url\(\s*["']?([^\s)'"?]+)[^)]*\)/g)) refs.push(m[1]);
  for (const m of text.matchAll(/srcset="([^"]+)"/g)) refs.push(...m[1].split(',').map(s=>s.trim().split(/\s/)[0]));
  for (const m of text.matchAll(/["'](images\/[^"']+\.(?:png|jpg|webp|svg))["']/g)) refs.push('/'+m[1]);
  for (let ref of refs) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(ref)) continue;
    ref = ref.split(/[?#]/)[0];
    if (!ref || !allowed.test(ref)) continue;
    const resolved = path.posix.normalize(ref.startsWith('/') ? ref.slice(1) : path.posix.join(relative.endsWith('.js') ? '' : path.posix.dirname(relative), ref));
    pending.push(resolved);
  }
}
// Inventory stays outside the served output.
await fs.writeFile(path.join(root, 'production-assets.json'),JSON.stringify([...included].sort(),null,2));
console.log(`Built ${pages.length} pages and ${included.size-pages.length} referenced assets. No repository/configuration files are served.`);
