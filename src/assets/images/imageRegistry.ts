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
        title: 'Laughter Held Upward',
        alt: 'Mother and child sharing a joyful moment in Somalia, photographed by Uncanny Stranger.',
        caption: 'A mother and child look upward together, caught in a burst of laughter that feels unplanned and complete. The frame keeps joy close to the body, bright and unguarded.'
      },
      {
        id: 2,
        src: cld('IMG_1633_copy_uknev3', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'Held Close After Laughter',
        alt: 'Tender mother and child portrait from the Uncanny Stranger photography portfolio.',
        caption: 'The mood softens as the child is drawn near. What remains is not the noise of the moment, but the protection inside it.'
      },
      {
        id: 3,
        src: cld('IMG_2166_copy_uwf1w2', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'Before The Tide Speaks',
        alt: 'Cinematic shoreline portrait in Somalia by Abdullahi Mohamud.',
        caption: 'She stands at the shore before the day becomes loud. Water, air, and posture turn the portrait into a quiet beginning.'
      },
      {
        id: 4,
        src: cld('abdullahi-maxamed-oY_sXKTsFCw-unsplash_1_lkrahb', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'Silver of Belonging',
        alt: 'Somali flag necklace portrait photographed by Uncanny Stranger.',
        caption: 'A Somali flag pendant rests near the chest, small but declarative. Home appears here as metal, skin, and something carried without performance.'
      },
      {
        id: 5,
        src: cld('21_ianwgj', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'Boats Waiting With The Tide',
        alt: 'Fishing boats along the Somali shoreline photographed by Abdullahi Mohamud.',
        caption: 'Boats line the water with the patience of routine. Their stillness suggests labor paused, not finished.'
      },
      {
        id: 6,
        src: cld('18_hbconn', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'Cathedral After Sound',
        alt: 'Night architectural photograph from Mogadishu by Uncanny Stranger.',
        caption: 'The architecture stands in night like a held breath. Its silence feels historical, not empty.'
      },
      {
        id: 7,
        src: cld('2025-08-14_6_lblngg', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'Measured Descent',
        alt: 'Urban architectural photograph with a lone figure by Uncanny Stranger.',
        caption: 'Railings, walls, and stairs pull the eye downward toward one small figure. The building becomes a measure of human scale.'
      },
      {
        id: 8,
        src: cld('2023-04-05_151130_jd6w2i', PUBLIC_IMAGE_WIDTHS.feature),
        title: 'Children Facing The Harbor',
        alt: 'Children watching ships along the water in Somalia, photographed by Abdullahi Mohamud.',
        caption: 'Children sit at the edge of land and water, looking toward ships and cranes. Childhood and industry share the same horizon.'
      }
    ]
  },

  artist: {
    profile: {
      src: cld('profile_vq16nd', PUBLIC_IMAGE_WIDTHS.thumbnail),
      alt: 'Portrait of Abdullahi Mohamud, the photographer known as Uncanny Stranger.'
    }
  }
};

export default IMAGES;
