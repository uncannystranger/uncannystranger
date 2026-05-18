import { cld, PUBLIC_IMAGE_WIDTHS } from '../../../utils/cloudinary';

export const EXHIBITION_IMAGES = [
  {
    id: 'ex-1',
    title: 'Between Shadows and Glow',
    photos: [
      {
        id: 'sc-1',
        src: cld('abdullahi-maxamed-l8MHcngK4Ww-unsplash_bakhyb', PUBLIC_IMAGE_WIDTHS.exhibition),
        title: 'Warm humanity → Vibrant city → Quiet dialogue → Self-reflection',
        alt: 'Exhibition photograph from Between Shadows and Glow by Uncanny Stranger.',
        description: '“Between Shadows and Glow” opens with four moments, each caught in the delicate tension of light and absence.',
      }
    ],
  },
  {
    id: 'ex-2',
    title: 'Statue against the blue sky',
    photos: [
      {
        id: 'er-1',
        src: cld('15_ad2kxb', PUBLIC_IMAGE_WIDTHS.exhibition),
        title: 'History',
        alt: 'Statue against a blue sky photographed by Abdullahi Maxamed.',
        description: 'An arm raised toward tomorrow.',
      }
    ],
  },
  {
    id: 'ex-3',
    title: 'Rooted in Memory',
    photos: [
      {
        id: 'er-3',
        src: cld('16_btfm8c', PUBLIC_IMAGE_WIDTHS.exhibition),
        title: 'Lines We Leave Behind',
        alt: 'Mogadishu skyline photograph from the Rooted in Memory exhibition.',
        description: 'A single mark crosses the sky above a resting city. Some memories do not weigh us down. They pass lightly, leaving direction rather than permanence.',
      },
      {
        id: 'er-4',
        src: cld('abdullahi-maxamed-Ya4rzj4L6Lo-unsplash_1_gqgftv', PUBLIC_IMAGE_WIDTHS.exhibition),
        title: 'What the Ground Remembers',
        alt: 'Documentary photograph of weathered stone from the Rooted in Memory series.',
        description: 'Stone stands where voices once lived. Even in collapse, the land carries traces of lives, holding memory in its cracks and shadows.',
      },
      {
        id: 'er-5',
        src: cld('17_uqqht9', PUBLIC_IMAGE_WIDTHS.exhibition),
        title: 'Crowned by Time',
        alt: 'Visual artwork photograph combining portraiture and foliage by Uncanny Stranger.',
        description: 'A face emerges beneath layers of leaves and paint, where nature and history overlap. The image speaks of identity shaped by place, memory growing like branches above the mind. What is seen is not just a portrait, but a quiet inheritance carried forward.',
      }
    ],
  }
];
