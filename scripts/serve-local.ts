import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import contactHandler from '../api/contact.ts';

const root = path.resolve('dist');
const hosting = JSON.parse(await fs.readFile('vercel.json','utf8'));
const types: Record<string,string> = { '.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.xml':'application/xml','.txt':'text/plain' };
const server = http.createServer(async (req, res) => {
  for (const header of hosting.headers[0].headers) {
    // Local HTTP review cannot enforce HTTPS upgrades; all other deployed policies are tested unchanged.
    res.setHeader(header.key,header.key==='Content-Security-Policy'?header.value.replace('; upgrade-insecure-requests',''):header.value);
  }
  res.setHeader('X-Robots-Tag','noindex, nofollow');
  res.setHeader('Cache-Control','no-store');
  const url = new URL(req.url || '/', 'http://127.0.0.1:4192');
  if (url.pathname === '/api/contact') {
    const adapted: any = res;
    adapted.status = (code: number) => { res.statusCode=code; return adapted; };
    return contactHandler(req, adapted);
  }
  if (!['GET','HEAD'].includes(req.method || '')) {res.writeHead(405);res.end();return;}
  try {
    const relative = decodeURIComponent(url.pathname).slice(1) || 'index.html';
    if (relative.split('/').some(p => p.startsWith('.'))) throw Error();
    const file = await fs.realpath(path.resolve(root, relative));
    if (!file.startsWith(root+path.sep) || !types[path.extname(file)]) throw Error();
    const data = await fs.readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]}); res.end(req.method==='HEAD'?undefined:data);
  } catch {res.writeHead(404);res.end('Not found');}
});
server.requestTimeout=20000;
server.headersTimeout=15000;
server.listen(4192,'127.0.0.1',()=>console.log('Enhanced site: http://127.0.0.1:4192/ (local review, noindex)'));
