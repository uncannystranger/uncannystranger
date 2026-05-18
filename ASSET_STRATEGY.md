# Public Asset Strategy

## Chosen model: Option A

The public website remains discoverable and SEO-friendly while serving **optimized public derivatives only**.

### Public website may use

- transformed Cloudinary image derivatives only
- responsive display widths appropriate to the layout
- SEO-friendly alt text, captions, and image sitemap entries
- social-preview images sized for sharing

### Public website must not ship

- original RAW files
- original full-resolution exports
- editing masters
- private image folders
- unreviewed backup files

### Width presets used in code

- thumbnail: `600`
- gallery: `800`
- exhibition: `1200`
- feature: `1600`
- hero: `2000`

These live in [`src/utils/cloudinary.ts`](./src/utils/cloudinary.ts) so future additions follow the same public-derivative convention.

## Storage policy

- Originals stay offline, in private storage, or in Cloudinary assets configured for private/authenticated delivery.
- Public pages should reference only transformed derivatives suitable for web display.
- Future image uploads should prefer opaque/public-safe IDs instead of meaningful original filenames when practical.
- If watermarking becomes desirable later, create a dedicated public derivative preset rather than changing originals.

## Cloudinary settings to configure outside code

For stronger protection while preserving public SEO:

1. keep public web derivatives available for crawl/indexing
2. keep original/source assets private
3. enable strict transformations
4. restrict unsigned transformations where appropriate
5. use signed/private delivery only for assets that should never be public
6. consider watermark transformations for selected public derivatives if the artistic tradeoff is acceptable

## Why this is the best fit

This keeps Google Search and Google Images working while reducing accidental exposure of originals. It does **not** make public images impossible to copy; it makes the public version intentional, optimized, and lower-risk.
