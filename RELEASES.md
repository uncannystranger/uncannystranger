# Website versions

## V3.6.0-rc.1 — Latest review version

The dedicated `codex/enhanced-v3-6` branch refines the existing Antonio portfolio. Orange accents, a scroll-controlled photographic composition, mobile photograph links, an automatic-height social footer and accessible menu controls preserve the original structure and typography. All 41 photograph stories and four essays remain.

The repository tag `v3.6.0-rc.1` provides a downloadable source ZIP. This candidate is not deployed to production. Direct email delivery code is included but remains disabled until provider/domain, Turnstile and distributed rate-limit setup is completed. See [REVIEW-V3.6.md](REVIEW-V3.6.md).

## V3.5 — Previous production version

The current cinematic portfolio brings together 32 earlier photographs and nine new photographs, with 41 individual photo stories, four illustrated journal essays, the artist biography and six social profiles. Existing routes and gallery animations are preserved.

Search metadata identifies both **Uncanny Stranger** and **uncannystranger**. The 53 indexable pages have unique titles, descriptions and canonical URLs. All 41 photographs appear in the image sitemap and have descriptive HTML image alternatives, dedicated landing pages and creator/licensing metadata. Highlights now has an accessible page heading and complete sitemap coverage for its twelve featured images.

Build with `npm ci --ignore-scripts` and `npm run build`. Check with `npm run lint`, `node --import tsx --test tests/security.test.ts`, `node scripts/security-check.mjs`, `node scripts/verify-seo.mjs` and `npm audit --omit=dev`.

The **Antonio-V3.5.zip** release asset contains only the public production website under `dist/`, plus its inventory and readme. It excludes original uploads, private configuration, server source and source maps. The GitHub tag provides the complete repository source separately. The static archive is for preservation/preview; production APIs and HTTP security headers require the repository's existing Vercel deployment configuration. Photography ownership and platform-specific licensing remain unchanged; see the site's rights page.

Google decides whether and when to index pages and images. The owner should verify the domain in Google Search Console, submit `https://uncannystranger.com/sitemap.xml`, inspect key URLs and monitor image-search crawling. A successful anonymous fetch is not proof of actual Google indexing.

GitHub Actions could not start during the release audit; the listed checks were executed locally. See the private delivery report for the account-level blocker. No billing, repository-access or database policy was changed.

Previous versions remain available in [GitHub Releases](https://github.com/uncannystranger/uncannystranger/releases).
