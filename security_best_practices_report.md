# Security Best Practices Report — uncannystranger.com

Date: 2026-05-18  
Scope: repository-wide review of the React/Vite frontend, public assets, build output, and Vercel configuration.

## Executive summary

- No hardcoded API keys, private keys, `.env` files, exposed source maps, or known npm vulnerabilities were found in the reviewed repository/build output.
- No high-confidence exploitable frontend vulnerability was identified in the current codebase.
- The most important remaining risks are **content exposure by design**:
  1. public Cloudinary delivery URLs are visible to browsers and search engines,
  2. `background.html` intentionally publishes detailed biographical information,
  3. browser-visible assets and text cannot be made impossible to copy.
- This pass added stronger practical deterrence, tighter deployment headers, build hardening, and repository hygiene without changing the site design or SEO architecture.

## Findings

### Medium priority

#### SEC-001 — Public Cloudinary assets remain directly retrievable by design

- **Location:** [`src/utils/cloudinary.ts:2-15`](./src/utils/cloudinary.ts#L2-L15), [`public/sitemap-images.xml`](./public/sitemap-images.xml)
- **Evidence:** image URLs are emitted as public Cloudinary `upload` delivery URLs and intentionally listed in the image sitemap.
- **Impact:** any image displayed in the browser can be requested directly by users who inspect the DOM or network panel. If Cloudinary transformation policy is permissive, users may also be able to request additional derived sizes from known public IDs.
- **Fix in code:** public pages now continue to serve optimized transformed derivatives only; original files are not stored in the repo or shipped from `/public`.
- **Required outside code:** configure Cloudinary access controls, strict transformations, and private/authenticated originals if the source images must remain non-public.

#### SEC-002 — Public biography page exposes detailed personal information

- **Location:** [`public/background.html:21-58`](./public/background.html#L21-L58), [`public/background.html:120-139`](./public/background.html#L120-L139)
- **Evidence:** the page publishes birth date, birthplace, languages, schools, and other biographical details.
- **Impact:** this is not a code exploit, but it increases privacy exposure and can aid unwanted profiling or impersonation.
- **Fix:** none applied automatically because the page appears intentional and supports entity/SEO goals.
- **Recommendation:** manually review whether every disclosed field is still necessary for public SEO/entity-building.

### Low priority / defense in depth

#### SEC-003 — Existing CSP still requires `unsafe-inline`

- **Location:** [`vercel.json:11-22`](./vercel.json#L11-L22)
- **Evidence:** the current CSP includes `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'`.
- **Impact:** this weakens CSP as an XSS mitigation if a script-injection bug is introduced later.
- **Why not fully removed now:** the current site uses inline bootstrap/style blocks in [`index.html`](./index.html), and removing inline allowances safely would require a more invasive nonce/hash refactor.
- **Fix applied:** additional hardening headers were added; the existing CSP was tightened where safe (`frame-ancestors 'none'`, `form-action 'self'`).
- **Recommendation:** future pass: replace inline script/style dependence with hashed or externalized assets, then remove `unsafe-inline`.

## Positive controls observed

- `npm audit --json` returned zero known vulnerabilities on 2026-05-18.
- No `.env` files or obvious secrets were present in the repository.
- No production `.map` files were emitted after build.
- No dangerous frontend sinks such as `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or unsafe `postMessage` handling were found during the scan.
- Security headers were already present before this pass and were further tightened.

## Changes implemented in this pass

- Added production-only content protection hook for:
  - image context menus,
  - image dragging,
  - protected text selection/copying,
  - common save/view-source/devtools shortcuts,
  - one-time production console copyright notice.
- Added protected-content CSS and non-interactive overlay layers above portfolio media.
- Added explicit copyright notice in the footer and a dedicated [`public/copyright.html`](./public/copyright.html) page.
- Expanded `.gitignore` to cover environment files, local Vercel files, sourcemaps, caches, and private/raw media folders.
- Explicitly disabled production sourcemaps and kept minification enabled in [`vite.config.ts`](./vite.config.ts).
- Hardened Vercel headers:
  - `frame-ancestors 'none'`
  - `X-Frame-Options: DENY`
  - `form-action 'self'`
  - `Cross-Origin-Opener-Policy`
  - `Cross-Origin-Resource-Policy`
  - `Origin-Agent-Cluster`

## Residual risk

- Frontend JavaScript cannot be truly encrypted because the browser must execute it.
- Any visible image can still be captured by screenshot, browser cache, network inspection, or advanced tooling.
- Public SEO/image-indexing goals conflict with fully private media delivery; stronger media controls may reduce indexability.
- Repository privacy still depends on GitHub settings outside this codebase.
