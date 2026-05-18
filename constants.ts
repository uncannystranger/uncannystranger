import { Photo, Exhibition } from './types';
import GALLERY_IMAGES from './src/assets/images/gallery/galleryRegistry';
import { EXHIBITION_IMAGES } from './src/assets/images/exhibitions/exhibitionManifest';

/* ======================
   GALLERY
   ====================== */

export const PHOTOS: Photo[] = GALLERY_IMAGES.map((img) => ({
  id: String(img.id),            // ✅ string as required
  url: img.src,
  title: img.title,
  alt: img.alt,
  description: img.description,
  category: img.category as Photo['category'],
}));

/* ======================
   EXHIBITIONS
   ====================== */

export const EXHIBITIONS: Exhibition[] = EXHIBITION_IMAGES.map((ex) => ({
  id: String(ex.id),
  title: ex.title,
  photos: ex.photos.map((img) => ({
    id: String(img.id),
    url: img.src,
    title: img.title,
    alt: img.alt,
    description: img.description,
    category: 'exhibition' as Photo['category'],
  })),
}));
