/**
 * IMAGE REGISTRY (CMS-READY)
 */

import { cld, PUBLIC_IMAGE_WIDTHS } from '../../utils/cloudinary';

export const IMAGES = {
  home: {
    flipbook: [
      {
        id: 1,
        src: cld('IMG_1629_copy_rdvybq', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'A Mother’s Joy — I',
        alt: 'Mother and child sharing a joyful moment in Somalia, photographed by Uncanny Stranger.',
        caption: 'A mother and her child share a moment of spontaneous laughter, looking upward together as joy unfolds naturally. This image captures the lightness of their bond — a reminder that love often reveals itself through simple, unguarded expressions. Photographed in Somalia, where warmth and resilience live side by side.'
      },
      {
        id: 2,
        src: cld('IMG_1633_copy_uknev3', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'A Mother’s Joy — II',
        alt: 'Tender mother and child portrait from the Uncanny Stranger photography portfolio.',
        caption: 'Moments later, the same mother draws her child close, shifting from laughter to quiet presence. Their faces meet in calm connection, expressing protection, tenderness, and trust. Together, these images tell a single story — one of love that moves between joy and stillness, without ever breaking.'
      },
      {
        id: 3,
        src: cld('IMG_2166_copy_uwf1w2', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'A quiet moment between her and the morning tide',
        alt: 'Cinematic shoreline portrait in Somalia by Abdullahi Maxamed.',
        caption: 'She stands at the edge of the waking shore, wrapped in the hush of early light. The sea rolls in slowly, like it doesn’t want to break the spell, and the sun reaches her first before it reaches the day. Its warmth brushes her cheek, turning the air golden, turning the moment into something she’ll carry long after the tide pulls back. For a breath of time, it’s just her, the water, and the soft promise of what’s about to begin.'
      },
      {
        id: 4,
        src: cld('abdullahi-maxamed-oY_sXKTsFCw-unsplash_1_lkrahb', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'Silver of Belonging',
        alt: 'Somali flag necklace portrait photographed by Uncanny Stranger.',
        caption: 'A quiet declaration rests against the chest. The Somali Flag in silver reflects not just light, but lineage, memory, and the unspoken weight of home carried close to the heart.'
      },
      {
        id: 5,
        src: cld('21_ianwgj', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'The Shoreline’s Keepers',
        alt: 'Fishing boats along the Somali shoreline photographed by Abdullahi Maxamed.',
        caption: 'Lined along the water, the boats form a quiet procession. They speak of endurance, routine, and lives shaped by tides rather than clocks.'
      },
      {
        id: 6,
        src: cld('18_hbconn', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'Silent Architecture',
        alt: 'Night architectural photograph from Mogadishu by Uncanny Stranger.',
        caption: 'Where sound once carried across open space, only the night remains. The cathedral endures as a pause in the city’s long and unfolding story.'
      },
      {
        id: 7,
        src: cld('2025-08-14_6_lblngg', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'Measured Descent',
        alt: 'Urban architectural photograph with a lone figure by Uncanny Stranger.',
        caption: 'Layers of railings and walls guide the eye inward. A single figure below turns architecture into a map of distance, scale, and quiet human presence.'
      },
      {
        id: 8,
        src: cld('2023-04-05_151130_jd6w2i', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'Watching the Work of the Sea',
        alt: 'Children watching ships along the water in Somalia, photographed by Abdullahi Maxamed.',
        caption: 'Three figures sit at the edge of land and water, facing ships and cranes in the distance. Childhood meets industry, and the future unfolds across the waterline.'
      }
    ]
  },

  artist: {
    profile: {
      src: cld('profile_vq16nd', PUBLIC_IMAGE_WIDTHS.thumbnail),
      alt: 'Portrait of Abdullahi Maxamed, the photographer known as Uncanny Stranger.'
    }
  }
};

export default IMAGES;
