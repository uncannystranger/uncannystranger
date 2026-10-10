# Security and publishing boundary

The public portfolio is built from `Antonio/` into `dist/` by an asset-reference allowlist. Only `dist/` is served as static content; Vercel separately packages the retained serverless APIs. Never set the output directory to the repository root. Private originals, RAW files, backups, credentials, maps and development documents must not be added to `dist/`.

Public photographs are resized, metadata-stripped display derivatives. They remain downloadable and screenshot-able. The original uploaded files remain outside this repository. Public GitHub history cannot be hidden by website headers. Keep sensitive future projects and original archives in private repositories/storage.

CSP permits self-hosted scripts and local fonts/images, with inline styles retained for GSAP's animations. Frame embedding is restricted to the existing video/art destinations. Production HTTPS uses HSTS for this hostname; subdomain/preload expansion requires separate verification. `Cross-Origin-Resource-Policy: same-origin` limits browser hotlink embedding, not direct downloads.

Vercel custom firewall rule `Portfolio delivery quota`: `/images/` OR `/api/`, 180 requests per IP per 60-second fixed window, response 429 when exceeded. Counters are regional, shared networks share a quota, distributed scraping can evade IP limits. Review traffic before tightening. Do not challenge all visitors or block search engines indiscriminately.

No visitor authentication, private gallery or file-upload feature exists in the active portfolio. Do not add frontend-only access checks for future private collections. Use private object storage plus server authorization and short-lived delivery URLs when introducing restricted work.

The legacy Supabase API remains for compatibility. Engagement mutations require JSON POST with bounded payloads and validated identifiers; browser writes are restricted to the site's origins. Anonymous session IDs are not authenticated identities. Existing database RPC grants may allow direct access that bypasses this website's CDN quota. Database-side quotas and least-privilege grants require a separately reviewed migration; none was applied in this release. Gallery sync requires the existing server-side cron secret. No service keys are included in the static output.

Checks: `npm run build`, `npm run lint`, `node --import tsx --test tests/security.test.ts`, `node scripts/security-check.mjs`, `npm audit --omit=dev`. CI runs these checks on pushes, pull requests and weekly. The pattern scanner is a lightweight safeguard, not a replacement for GitHub's secret-scanning service. Enable repository push protection where the account plan permits it; confirm MFA and deployment access in the hosting dashboard.

The unused Tailwind 3 development dependency chain still reports high-severity braces-related advisories; the registry's current braces release has no compatible patched version. These packages are not shipped to the browser or used by the static production build. Remove the archived frontend in a separately scoped cleanup or upgrade it deliberately; do not use `npm audit fix --force` as an unreviewed migration.
