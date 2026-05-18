/**
 * Gallery Registry
 * Structured exactly like CMS data
 */

import { cld, PUBLIC_IMAGE_WIDTHS } from '../../../utils/cloudinary';

export const GALLERY_IMAGES = [
  {
    id: 'g1',
    src: cld('abdullahi-maxamed-F_lc9t1GwGU-unsplash_vfakxq', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'A quiet smile, held with grace.',
    category: 'albums',
    alt: 'Cinematic portrait photograph from the Uncanny Stranger portfolio in Mogadishu.',
    description: 'A quiet portrait from the Uncanny Stranger photography portfolio.'
  },
  {
    id: 'g2',
    src: cld('IMG_2166_copy_uwf1w2', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'Light, shadow, and a quiet exchange.',
    category: 'albums',
    alt: 'Editorial coastal portrait photograph by Abdullahi Maxamed in Somalia.',
    description: 'A soft shoreline scene from the Uncanny Stranger portfolio.'
  },
  {
    id: 'g3',
    src: cld('2025-08-14_1_tm1ak4', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'A desk waiting for ideas.',
    category: 'albums',
    alt: 'Still-life desk photograph with natural light from the Uncanny Stranger portfolio.',
    description: 'An observational still-life study in daylight.'
  },
  {
    id: 'g4',
    src: cld('4_pfkuzt', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'Peace',
    category: 'collections',
    alt: 'Documentary photograph of a person within urban architecture by Uncanny Stranger.',
    description: 'A quiet urban composition from the collections series.'
  },
  {
    id: 'g5',
    src: cld('10_lpotua', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'Golden Hour',
    category: 'journal',
    alt: 'Golden-hour documentary photograph by Abdullahi Maxamed.',
    description: 'Warm evening light in the journal series.'
  },
  {
    id: 'g6',
    src: cld('9_hfewhk', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'Peace',
    category: 'albums',
    alt: 'Cinematic urban photograph from the Uncanny Stranger albums series.',
    description: 'An urban scene shaped by light and distance.'
  },
  {
    id: 'g7',
    src: cld('17_dj4jm0', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'A smile left behind for strangers.',
    category: 'albums',
    alt: 'Street portrait photograph from the Uncanny Stranger albums series.',
    description: 'A candid portrait with a quiet editorial tone.'
  },
  {
    id: 'g8',
    src: cld('2024-04-02_152441_dakfec', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'A smile left behind for strangers.',
    category: 'albums',
    alt: 'Documentary street photograph by Abdullahi Maxamed.',
    description: 'A lived-in urban moment from the albums series.'
  },
  {
    id: 'g9',
    src: cld('2023-01-04_000932_hfljnx', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'A smile left behind for strangers.',
    category: 'albums',
    alt: 'Travel photography scene from the Uncanny Stranger portfolio.',
    description: 'A travel-oriented visual note from the albums series.'
  },
  {
    id: 'g10',
    src: cld('2023-12-06_155715_3_t9f0wh', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'A smile left behind for strangers.',
    category: 'albums',
    alt: 'Editorial photography scene by Uncanny Stranger.',
    description: 'A restrained visual study from the albums series.'
  },
  {
    id: 'g11',
    src: cld('2022-12-24_124012_1_ggkjsy', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'A smile left behind for strangers.',
    category: 'albums',
    alt: 'Urban documentary photograph from the Uncanny Stranger portfolio.',
    description: 'A city detail photographed with an editorial eye.'
  },
  {
    id: 'g12',
    src: cld('2023-02-02_170135_1_jeucfg', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'A smile left behind for strangers.',
    category: 'albums',
    alt: 'Cinematic photography study by Abdullahi Maxamed.',
    description: 'A quiet sequence image from the albums series.'
  },
  {
    id: 'g13',
    src: cld('2024-09-08_180737_tdihjq', PUBLIC_IMAGE_WIDTHS.gallery),
    title: 'A smile left behind for strangers.',
    category: 'collections',
    alt: 'Nature and urban photography composition from the Uncanny Stranger portfolio.',
    description: 'A collections image balancing environment and structure.'
  }

];

export default GALLERY_IMAGES;
