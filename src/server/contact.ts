/*! Copyright (c) 2026 Abdullahi Mohamud / Uncanny Stranger. Original photography, writing and custom enhancements reserved. Third-party components retain their respective licenses. */
import { createHash, randomUUID } from 'node:crypto';

export const CONTACT_RECIPIENT = 'abdallahmadm@gmail.com';
export const MAX_CONTACT_BYTES = 24 * 1024;
export type ContactConfig = {
  enabled: boolean; rateLimitReady: boolean; resendKey?: string;
  turnstileSecret?: string; siteKey?: string; sender?: string; origins: string[];
};
export function contactConfig(env = process.env): ContactConfig {
  const origins = ['https://uncannystranger.com', 'https://www.uncannystranger.com'];
  // The loopback-only development server has one process, so its local quota is sufficient for a controlled test.
  // This exception cannot activate on any Vercel or production runtime.
  const localTest = env.CONTACT_LOCAL_TEST === 'true' && env.NODE_ENV !== 'production' && !env.VERCEL && !env.VERCEL_ENV;
  // Add one explicitly authorized preview; never trust a caller-supplied host.
  if (env.CONTACT_PREVIEW_ORIGIN && /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(env.CONTACT_PREVIEW_ORIGIN)) origins.push(env.CONTACT_PREVIEW_ORIGIN);
  if (env.NODE_ENV !== 'production' && !env.VERCEL_ENV) origins.push('http://127.0.0.1:4192', 'http://localhost:4192');
  return { enabled: env.CONTACT_ENABLED === 'true', rateLimitReady: env.CONTACT_RATE_LIMIT_READY === 'true' || localTest,
    resendKey: env.RESEND_API_KEY, turnstileSecret: env.TURNSTILE_SECRET_KEY,
    siteKey: env.TURNSTILE_SITE_KEY, sender: env.CONTACT_FROM, origins };
}
export function contactReady(c: ContactConfig) {
  return Boolean(c.enabled && c.rateLimitReady && c.resendKey && c.turnstileSecret && c.siteKey &&
    /^Uncanny Stranger <contact@uncannystranger\.com>$/.test(c.sender || ''));
}
const uuid = /^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
export function validateContact(payload: unknown) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const p = payload as Record<string, unknown>;
  if (Object.keys(p).some(k => !['name','email','message','submissionId','token','website'].includes(k))) return null;
  const { name, email, message, submissionId, token, website = '' } = p;
  if (typeof name !== 'string' || !name.trim() || name.length > 100 || /[\x00-\x1f\x7f]/.test(name) ||
      typeof email !== 'string' || email.length > 254 || !/^[^\s@<>\x00-\x1f]+@[^\s@<>\x00-\x1f]+\.[^\s@<>\x00-\x1f]+$/.test(email) ||
      typeof message !== 'string' || !message.trim() || message.length > 4000 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(message) ||
      typeof submissionId !== 'string' || !uuid.test(submissionId) ||
      typeof token !== 'string' || token.length > 2048 || typeof website !== 'string' || website.length > 200) return null;
  return { name: name.trim(), email, message: message.trim(), submissionId, token, website };
}
export async function deliverContact(payload: unknown, origin: string, config: ContactConfig, fetchImpl = fetch) {
  const result = (status: number, message: string) => ({ status, body: { message } });
  if (!config.origins.includes(origin)) return result(403, 'This origin is not allowed.');
  const p = validateContact(payload);
  if (!p) return result(400, 'Please check your name, email and message.');
  if (p.website) return result(400, 'The spam check could not be completed.');
  if (!contactReady(config)) return result(503, 'Message delivery is not connected yet. No message was sent; your text is still here. You can email abdallahmadm@gmail.com.');
  if (!p.token) return result(400, 'Please complete the spam check.');
  try {
    const verification = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(5000),
      body: new URLSearchParams({ secret: config.turnstileSecret!, response: p.token, idempotency_key: randomUUID() })
    });
    const verified = await verification.json();
    if (!verification.ok || verified.success !== true || verified.action !== 'contact' || verified.hostname !== new URL(origin).hostname)
      return result(400, 'The spam check expired. Please try again.');
    // Deterministic across concurrent/serverless retries, with no persistent message storage.
    const digest = createHash('sha256').update(JSON.stringify([p.name,p.email,p.message])).digest('hex');
    const response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(7000), headers: {
        Authorization: `Bearer ${config.resendKey}`, 'Content-Type': 'application/json',
        'Idempotency-Key': `contact/${p.submissionId}/${digest}`
      }, body: JSON.stringify({ from: config.sender, to: [CONTACT_RECIPIENT], reply_to: p.email,
        subject: `Photography enquiry from ${p.name}`,
        text: `Name: ${p.name}\nEmail: ${p.email}\n\n${p.message}` })
    });
    if (!response.ok) return result(502, 'The email service could not accept your message. Your text is still here. Please try again.');
    const sent = await response.json();
    if (typeof sent.id !== 'string' || !sent.id) return result(502, 'The email service did not confirm acceptance. Please try again.');
    return result(200, 'Submitted. The email service accepted your message. Thank you for writing.');
  } catch {
    return result(502, 'The email service is temporarily unavailable. Your text is still here. Please try again.');
  }
}

// Per-instance defense in depth, not a substitute for the required distributed WAF rule.
const quota = new Map<string, { count: number; reset: number }>();
const salt = randomUUID();
export function contactQuota(ip: string, now = Date.now()) {
  for (const [key, value] of quota) if (value.reset <= now) quota.delete(key);
  if (quota.size >= 5000) return { allowed: false, retryAfter: 600 };
  const key = createHash('sha256').update(salt + ip).digest('hex');
  const counter = quota.get(key) || { count: 0, reset: now + 600000 };
  counter.count++; quota.set(key, counter);
  return { allowed: counter.count <= 5, retryAfter: Math.ceil((counter.reset - now) / 1000) };
}
