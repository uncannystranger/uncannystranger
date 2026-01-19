/**
 * IMAGE REGISTRY (CMS-READY)
 */

import { cld } from '../../utils/cloudinary';

export const IMAGES = {
  home: {
    flipbook: [
      {
        id: 1,
        src: cld('21_ianwgj', 1600),
        title: 'Frame One',
        caption: 'A moment before the shutter settles.'
      },
      {
        id: 2,
        src: cld('18_hbconn', 1600),
        title: 'Frame Two',
        caption: 'Light finding its way through memory.'
      },
      {
        id: 3,
        src: cld('15_dvbg7z', 1600),
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