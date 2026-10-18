/*! Copyright (c) 2026 Abdullahi Mohamud / Uncanny Stranger. Original photography, writing and custom enhancements reserved. Third-party components retain their respective licenses. */
/* Direct contact delivery; credentials and recipient policy live exclusively on the server. */
let contactCleanup;
let turnstileLoader;
function loadContactChallenge() {
  if (window.turnstile) return Promise.resolve();
  if (!turnstileLoader) turnstileLoader = new Promise((resolve, reject) => {
    window.contactChallengeReady = resolve;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=contactChallengeReady';
    script.async = true; script.onerror = reject; document.head.appendChild(script);
  }).catch(error => { turnstileLoader = undefined; throw error; });
  return turnstileLoader;
}
function ContactForm() {
  if (contactCleanup) contactCleanup();
  const form = document.getElementById('contactform');
  if (!form) return;
  const status = document.getElementById('message');
  const availability = document.getElementById('contact-availability');
  const button = form.querySelector('[type="submit"]');
  const lifecycle = new AbortController();
  let widget, token = '', pending = false, ready = false, submissionId;
  button.disabled = true;
  contactCleanup = () => { lifecycle.abort(); if (widget !== undefined && window.turnstile) turnstile.remove(widget); };
  const resize = () => { const area = document.getElementById('content-scroll'); if (window.Scrollbar && area) Scrollbar.get(area)?.update(); window.ScrollTrigger?.refresh(); };
  const unavailable = () => {
    ready = false; button.disabled = true;
    availability.textContent = 'Direct messaging is awaiting service setup. Please email abdallahmadm@gmail.com for now.';
    resize();
  };
  fetch('/api/contact', { signal: AbortSignal.any([lifecycle.signal,AbortSignal.timeout(7000)]), cache: 'no-store' }).then(r => {
    if (!r.ok) throw Error(); return r.json();
  }).then(async config => {
    if (!config.ready || typeof config.siteKey !== 'string') return unavailable();
    await loadContactChallenge();
    if (lifecycle.signal.aborted) return;
    ready = true;
    availability.textContent = 'Your note is sent securely to Abdullahi. Your email is used so he can reply.';
    widget = turnstile.render(form.querySelector('.contact-challenge'), {
      sitekey: config.siteKey, action: 'contact', theme: 'dark', size: 'flexible',
      callback: value => { token = value; if (!pending) button.disabled = false; },
      'expired-callback': () => { token = ''; button.disabled = true; status.textContent = 'Please complete the spam check again.'; },
      'error-callback': () => { token = ''; button.disabled = true; status.textContent = 'The spam check could not load. Please try again or email directly.'; }
    });
    resize();
  }).catch(() => { if (!lifecycle.signal.aborted) unavailable(); });
  form.addEventListener('input', event => { if (!pending && ['name','email','comments'].includes(event.target.name)) submissionId = undefined; }, { signal: lifecycle.signal });
  form.onsubmit = async function (event) {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    if (!ready || !token) { status.textContent = 'Please complete the spam check before sending.'; return; }
    const name = form.elements.name.value.trim(), email = form.elements.email.value.trim(), message = form.elements.comments.value.trim();
    if (!name || !message) { status.textContent = 'Please enter your name and message.'; return; }
    pending = true; submissionId ||= crypto.randomUUID();
    [form.elements.name,form.elements.email,form.elements.comments].forEach(field=>{field.readOnly=true;});
    button.disabled = true; button.value = 'Sending…'; form.setAttribute('aria-busy', 'true');
    status.textContent = 'Submitting your message…';
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, submissionId, token, website: form.elements.website.value }),
        signal: AbortSignal.any([lifecycle.signal, AbortSignal.timeout(15000)]) });
      const result = await response.json();
      if (lifecycle.signal.aborted) return;
      status.textContent = typeof result.message === 'string' ? result.message : 'The service could not accept your message. Please try again.';
      if (response.ok) { form.reset(); submissionId = undefined; }
    } catch { if (!lifecycle.signal.aborted) status.textContent = 'The connection was interrupted. Your text is still here. Please try again.'; }
    finally {
      pending = false; [form.elements.name,form.elements.email,form.elements.comments].forEach(field=>{field.readOnly=false;}); button.value = 'Send message'; form.removeAttribute('aria-busy'); token = '';
      if (!lifecycle.signal.aborted && widget !== undefined) turnstile.reset(widget);
      resize();
    }
  };
}
function ContactMap() { return false; }
