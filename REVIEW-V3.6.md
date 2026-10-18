# V3.6 enhancement — review candidate

Updated 18 October 2026 from production-source commit `0bf300c353f8ad52816382d4eb218021c583e1cc` on `codex/enhanced-v3-6`. Production/main has not been changed. The branch disables its automatic Vercel deployment through `git.deploymentEnabled`; publishing requires a separate approval and provider setup.

## What changed

The original Antonio page structure, Poppins/Playfair typography, neutral backgrounds, magnetic button treatments, GSAP and smooth-scrollbar remain. Orange is limited to interaction details, focus states, framing and labels. The homepage now includes a five-photograph composition around **A Pause Above (IMG_8127)**: full-frame entry, controlled scroll zoom, return to the frame and real story destinations. Short landscape and reduced-motion conditions get a static field. Four existing hero subjects also appear as linked mobile prints. Existing photograph files are unchanged.

The social footer now uses automatic height and responsive grid flow instead of fixed width/height, floats and translated text. Phones have two columns of social links, separate rights/copyright and back-to-top rows, safe-area padding and 44px link heights. Original immersive archive/highlight footer controls are preserved separately. Contact is discoverable from the ordinary footer.

The original mobile menu now has a native button, expanded state, focus containment, Escape closing, focus restoration and content/scroll locking. Archive controls support keyboard activation. Full-area photograph links support pointer and keyboard navigation without depending on the legacy WebGL callback. Artificial 5–20-second loading delays were removed; the introduction, menu, gallery and AJAX transitions are shorter. Generic photograph links now reveal their destination titles correctly; AJAX errors fall back to normal navigation.

## Photograph discovery and SEO

All 41 photographs have their matching story pages and a complete archive link. Gallery image links now cover their photograph and use native navigation, avoiding the old zero-size anchors and pointer-only, two-click preview path; archive movement and Grid/List controls remain. All four essays, biographies, social identities and original URLs remain. The build retains 53 indexable pages, unique titles/descriptions/canonicals, Person/WebSite/ImageObject and applicable article/collection data, sitemap and image sitemap. Public image derivatives remain crawlable; masters are not added to public output. Corrected 302 responsive-image width descriptors to the actual intrinsic derivative widths. New image interactions use actual HTML links and images. AJAX navigation preserves title/canonical/social/schema updates.

Local review responses deliberately use `X-Robots-Tag: noindex, nofollow`; production HTML keeps its original indexing directives. The two retained demonstration pages remain noindex. Google rankings/indexing are not guaranteed. No Search Console access or confirmed Google crawl was available. Submit/inspect the sitemap in the owner's verified Search Console after an approved release.

## Contact: implemented and tested locally; public activation gated

`POST /api/contact` delivers plain-text enquiries only to **abdallahmadm@gmail.com**, from `Uncanny Stranger <contact@uncannystranger.com>`, with validated visitor Reply-To. The browser no longer submits a mailto form. It displays sending, provider-accepted and failure states, preserving text on failure. It never claims inbox delivery.

The endpoint enforces explicit origins, JSON, a 24KB body limit, bounded fields, no recipient overrides, safe errors, provider timeouts, honeypot, server-side Turnstile hostname/action verification and stable provider idempotency keys. Server credentials never enter the static build. No message database, persistent browser draft or message-content logging is introduced. A bounded, hashed-IP per-instance quota supplements a required hosting rule; it is not a distributed rate limiter.

**Provider setup and remaining release gates:**

1. Resend confirms `uncannystranger.com` verified. Its DNS records match Vercel and public DNS; existing Google MX routing was preserved. A domain-scoped sending key is stored privately for localhost and as a Vercel Secret limited to Preview branch `codex/enhanced-v3-6`.
2. A real Managed Turnstile widget was created with owner approval for `uncannystranger.com`, `localhost` and `127.0.0.1`, with no pre-clearance/security-rule bypass. Both keys are configured locally and in that branch's Preview environment. No production credentials were changed.
3. The controlled localhost form test passed real Turnstile validation and Resend accepted the message. Resend reports delivery to Gmail's mail server, with the configured sender, fixed recipient and visitor Reply-To. The UI displayed its acceptance confirmation and cleared the form. This does not establish inbox placement, reading or an actual reply from Gmail.
4. Public activation still requires the contact-specific hosting quota: five requests per IP per ten minutes. Vercel shows the Hobby plan; its existing rate-limit slot is occupied by the retained portfolio rule. Resolve rule capacity or an approved distributed alternative before setting `CONTACT_RATE_LIMIT_READY=true`. No paid upgrade or existing-rule replacement was made.
5. `CONTACT_ENABLED=false` and `CONTACT_RATE_LIMIT_READY=false` remain on Vercel Preview. Local testing uses `CONTACT_LOCAL_TEST=true` only on the loopback-bound single-process server; the exception is rejected in production and all Vercel environments. Real Turnstile, validation, Resend and the five-request local quota remain enforced. Never use this mode on a public development server.
6. Any future public preview origin must be explicitly authorized in both configuration and Turnstile. Production release requires the owner's separate approval and the remaining release checks.

Official setup references: [Resend](https://resend.com/docs/api-reference/emails/send-email), [Turnstile server verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [Vercel rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).

## Security and audit findings

| Finding | Severity / scope | Treatment |
| --- | --- | --- |
| Public form did not deliver email | Functional high | New protected endpoint; service activation still required. |
| Missing keyboard menu semantics/closing | Usability high | Native button, focus management and Escape added. |
| Mobile footer clipping/overlap | Usability high | Fixed sizing/float conflicts replaced with document-flow grid. |
| AJAX photograph story title could remain transparent | Usability medium | Normal-title entrance fallback added. |
| Responsive image descriptors differed from file dimensions | Performance medium | Corrected descriptors; files/colors preserved. |
| Five inherited high development dependency findings | Build-tooling risk | Tailwind 3/braces chain remains; a major migration is outside this repair. Production dependency audit has zero findings. |
| Legacy gallery/engagement API database failures | Separate legacy scope | No database recovery, credential rotation or migration performed. New contact service is independent. |

Existing CSP, HSTS, nosniff, framing, referrer, permissions, COOP and CORP policies remain. Only Cloudflare's challenge origin was added to script/frame sources. The build serves only an explicit asset allowlist, excluding `.env`, `.git`, backend source, maps, archives, configuration and private masters. No authentication/private-gallery/upload feature was added. Browser-required HTML/CSS/JS and public photo derivatives remain inspectable/downloadable. No absolute anti-scraping or security guarantee is made.

The active firewall was read on 18 October: its existing rule limits /images/ and /api/ to 180 requests per IP per 60 seconds. The stricter contact rule is not active. DNS was inspected without changes; Resend now confirms the apex domain is verified.

## Executed verification

- TypeScript: `npm run lint` passed.
- `npm test`: 22 passed (15 contact tests with mocked provider transports; seven retained security tests).
- Production build: 55 HTML pages, 252 referenced assets, 307 public files.
- SEO validation: 53 indexable pages, 41 photograph stories, 12 Highlights images.
- Site integrity: 55 pages and 2,768 local resources/links resolved; all 41 archive-to-story identities matched.
- Production dependency audit: zero vulnerabilities. Full audit: five high findings in the inherited development chain.
- Preservation: 164 photograph derivative hashes match the starting version; 41-photo manifest and four essays preserved.
- Local HTTP: all 55 pages returned 200 with server-rendered headings. `.env`, `.git/config`, server source, package configuration, original-image path and source-map probes returned 404. Local production-equivalent headers were present (HTTPS upgrade intentionally omitted for HTTP localhost).
- Contact HTTP checks: foreign origin 403, malformed JSON 400, actual oversized payload 413. Unit tests cover invalid fields, recipient/header injection, unavailable configuration, challenge failure/hostname/action, provider failure/timeout, duplicate keys and per-instance rate-limit expiry.
- Actual in-app Chromium checks: homepage widths 320/360/375/390/414/430/768/1024/1440/1920 showed zero horizontal overflow and zero footer links outside their container, with minimum 44px social link heights. Eight mobile page templates also passed bounds checks. 844x390 landscape selects a static photograph field without horizontal overflow.
- Mobile zoom/return, menu Escape/focus restoration, mobile story opening and desktop keyboard hero-to-story navigation were exercised. The destination showed the correct visible title and canonical; browser Back returned to the homepage.

**Not verified:** Gmail inbox placement or an actual reply (provider delivery is verified); actual distributed hosting rate limits; Safari/Firefox/Edge or physical devices; OS reduced-motion execution and JavaScript-disabled browser rendering; slow-device/network performance; Lighthouse or real-user LCP/INP/CLS; Google indexing. Source-level reduced-motion/static fallbacks are included but are not proof of device behavior. Remaining checks are release gates, not silently reported passes.

## Files changed and purpose

- `Antonio/*.html`: shared semantic menu/footer/contact links, correct responsive-image dimensions and enhancement assets; homepage composition and real photo links; four journal essays retained.
- `Antonio/css/enhancements.css`, `visual-field.css`, `no-script.css`: original-style orange details, responsive repairs, photographic composition and static fallback.
- `Antonio/js/common.js`, `scripts.js`, `enhancements.js`: shorter original animation timings, robust navigation, responsive field lifecycle and keyboard controls.
- `Antonio/js/contact.js`, `api/contact.ts`, `src/server/contact.ts`: accessible form and protected direct-message delivery.
- `scripts/serve-local.ts`, `verify-site.mjs`, `tests/contact.test.ts`: local production-build preview, resource/story validation and contact security tests.
- `.env.example`, `vercel.json`, `.github/workflows/security.yml`, package files: documented private setup, narrow CSP update, review-branch deployment block and test commands. No new package dependency was introduced.
- README, RELEASES, SECURITY and this report: corrected active architecture and review/setup limits.

## Review, release and rollback

Run `npm ci --ignore-scripts`, then `npm run dev:site`; open http://127.0.0.1:4192/. Only localhost is bound. The source ZIP requires these commands; the public static output alone cannot deliver messages or apply hosting headers.

Review this candidate before authorizing a production release. Main remains at the existing production source. If later approved, complete external email setup and the remaining browser/performance checks before merging/deploying. Preserve `0bf300c` as the rollback source and the existing V3.5 release; no destructive changes are required.

Priority next steps: (1) owner visual review; (2) hosted contact quota and Gmail inbox/reply confirmation; (3) Safari/Android/Firefox/Edge and measured mobile performance; (4) separately recover legacy database APIs and migrate or remove archived frontend dependencies. A framework rewrite is not necessary for these repairs.

## 18 October identity and delivery update

Resend dashboard confirms uncannystranger.com Verified in eu-west-1. Vercel and public DNS agree on resend._domainkey TXT, send CNAME and rsend CNAME. No unrelated DNS records were modified; Google MX remains intact. No Resend or Turnstile credentials were present at initial inspection; both are now stored as Secrets for the development branch Preview only.

Sender policy now accepts only Uncanny Stranger <contact@uncannystranger.com>. Turnstile verification gets a fresh request identity when a browser retries with a refreshed token; Resend deduplication remains stable. Local callers cannot spoof Vercel forwarded IP headers.

All page Person entities now use the existing self-portrait and stable About profile identity; About sharing metadata uses that self-portrait rather than a photograph of another subject. Non-visible copyright comments and metadata identify original work and explicitly preserve vendor ownership. These are attribution, not copy prevention.

Google indexing and a Knowledge Panel are external outcomes. ProfilePage/Person markup, consistent public profiles, crawlable photo pages and image sitemap improve discoverability but cannot create or guarantee a public figure panel. After approved deployment, use the owner verified Search Console to submit sitemap.xml and inspect the About page and representative photograph URLs. The existing googleconsole-subdomain TXT record alone does not establish verified Search Console ownership of the apex domain. Do not change verification DNS without the exact token Google provides.

All 41 live public 1280px WebP derivatives returned HTTP 200 on 18 October without X-Robots-Tag exclusion. This is an accessibility-to-crawlers check, not proof of Google indexing. Preview-only CONTACT_FROM and disabled activation flags are configured for the development branch; production environment variables remain unchanged. Source is available in draft PR #7.

## Final 18 October contact verification

- Real form-generated email: `01a14df1-674c-71d6-8915-1741c3975e34`; Resend status Delivered, 18 October. Earlier provider-only test also delivered. No message content or credentials are committed.
- Contact/footer browser checks repeated at 320, 360, 375, 390, 414, 430, 768, 1024, 1440 and 1920px: no horizontal page overflow, no footer link outside its container, minimum 44px link height and 16px form inputs. This run uses in-app Chromium, not physical devices or other engines.
- At 390px, menu Escape closed it and returned focus to the trigger. Footer link opacity increased from the inherited 0.3 to 0.8 for readable neutral text while preserving orange hover/focus states.
- Local private environment file is ignored by Git and mode 0600. Downloadable source is built using `git archive`, which excludes it. Public hosting activation stays disabled until the distributed quota is resolved.
