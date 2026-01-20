/**
 * IMAGE REGISTRY (CMS-READY)
 */

import { cld } from '../../utils/cloudinary';

export const IMAGES = {
  home: {
    flipbook: [
      {
        id: 1,
        src: cld('IMG_2166_copy_uwf1w2', 1600),
        title: 'A quiet moment between her and the morning tide',
        caption: 'She stands at the edge of the waking shore, wrapped in the hush of early light. The sea rolls in slowly, like it doesn’t want to break the spell, and the sun reaches her first before it reaches the day. Its warmth brushes her cheek, turning the air golden, turning the moment into something she’ll carry long after the tide pulls back. For a breath of time, it’s just her, the water, and the soft promise of what’s about to begin.'
      },
      {
        id: 2,
        src: cld('18_hbconn', 1600),
        title: 'Frame Two',
        caption: 'Light finding its way through memory.'
      },
      {
        id: 3,
        src: cld('21_ianwgj', 1600),
        title: 'Frame Three',
        caption: 'Where motion pauses long enough to speak.'
      },
      {
        id: 4,
        src: cld('2023-02-02_170135_1_dy77md', 1600),
        title: 'Frame Four',
        caption: 'A step forward, framed by wind and color.'
      }
    ]
  },

  artist: {
    profile: {
      src: cld('profile_vq16nd', 600),
      alt: 'Portrait of the artist'
    }
  }
};

export default IMAGES;
