/*! Copyright (c) 2026 Abdullahi Mohamud / Uncanny Stranger. Original photography, writing and custom enhancements reserved. Third-party components retain their respective licenses. */
import { contactConfig, contactQuota, contactReady, deliverContact, MAX_CONTACT_BYTES } from '../src/server/contact.js';

export default async function handler(req: any, res: any) {
  const json = (status: number, data: unknown) => {
    res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(JSON.stringify(data));
  };
  const config = contactConfig();
  if (req.method === 'GET') return json(200, { ready: contactReady(config), siteKey: contactReady(config) ? config.siteKey : null });
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return json(405, { message: 'Method not allowed.' }); }
  const origin = String(req.headers?.origin || '');
  if (!config.origins.includes(origin) || req.headers?.['sec-fetch-site'] === 'cross-site') return json(403, { message: 'This origin is not allowed.' });
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers?.['content-type'] || '')) return json(415, { message: 'JSON is required.' });
  if (Number(req.headers?.['content-length'] || 0) > MAX_CONTACT_BYTES) return json(413, { message: 'This message is too large.' });
  // Vercel replaces x-vercel-forwarded-for. Never use caller-controlled x-forwarded-for for quotas.
  const forwarded = process.env.VERCEL === '1' ? req.headers?.['x-vercel-forwarded-for'] : undefined;
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') || req.socket?.remoteAddress || 'unknown';
  const quota = contactQuota(ip);
  if (!quota.allowed) { res.setHeader('Retry-After', String(quota.retryAfter)); return json(429, { message: 'Please wait a few minutes before trying again.' }); }
  let payload;
  try {
    let body = req.body;
    if (body === undefined) {
      const chunks = []; let size = 0;
      for await (const chunk of req) { size += Buffer.byteLength(chunk); if (size > MAX_CONTACT_BYTES) return json(413, { message: 'This message is too large.' }); chunks.push(chunk); }
      body = Buffer.concat(chunks).toString('utf8');
    }
    const raw = typeof body === 'string' ? body : JSON.stringify(body);
    if (Buffer.byteLength(raw || '') > MAX_CONTACT_BYTES) return json(413, { message: 'This message is too large.' });
    payload = typeof body === 'string' ? JSON.parse(body) : body;
  } catch { return json(400, { message: 'The request could not be read.' }); }
  const result = await deliverContact(payload, origin, config);
  return json(result.status, result.body);
}
