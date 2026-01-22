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
        src: cld('abdullahi-maxamed-oY_sXKTsFCw-unsplash_1_lkrahb', 1600),
        title: 'Silver of Belonging',
        caption: 'A quiet declaration rests against the chest. The Somali Flag in silver reflects not just light, but lineage, memory, and the unspoken weight of home carried close to the heart.'
      },
      {
        id: 3,
        src: cld('21_ianwgj', 1600),
        title: 'The Shoreline’s Keepers',
        caption: 'Lined along the water, the boats form a quiet procession. They speak of endurance, routine, and lives shaped by tides rather than clocks.'
      },
      {
        id: 4,
        src: cld('18_hbconn', 1600),
        title: 'Silent Architecture',
        caption: 'Where sound once carried across open space, only the night remains. The cathedral endures as a pause in the city’s long and unfolding story.'
      },
      {
        id: 5,
        src: cld('2025-02-28_074910_s7plwj', 1600),
        title: 'The Hour Before Movement',
        caption: 'A street rests under soft daylight, untouched by urgency. The space becomes a pause, where the city breathes before the day begins to shape it.'
      },
      {
        id: 6,
        src: cld('2025-08-14_6_lblngg', 1600),
        title: 'Measured Descent',
        caption: 'Layers of railings and walls guide the eye inward. A single figure below turns architecture into a map of distance, scale, and quiet human presence.'
      },
      {
        id: 7,
        src: cld('abdullahi-maxamed-QxGO4oZm67U-unsplash_zn62tv', 1600),
        title: 'Color Against the Dark',
        caption: 'Electric light cuts through shadow, turning a moment of play into a study of contrast. The figure stands between glow and silence, suspended in both.'
      },
      {
        id: 8,
        src: cld('3_nj7tqq', 1600),
        title: 'City Under Open Sky',
        caption: 'White rooftops stretch toward the horizon, framed by an endless blue. The city appears both dense and open, held gently beneath the vastness above.'
      },
      {
        id: 9,
        src: cld('2023-04-05_151130_jd6w2i', 1600),
        title: 'Watching the Work of the Sea',
        caption: 'Three figures sit at the edge of land and water, facing ships and cranes in the distance. Childhood meets industry, and the future unfolds across the waterline.'
      },
      {
        id: 10,
        src: cld('2023-02-02_170135_1_dy77md', 1600),
        title: 'Step Into the Wind',
        caption: 'Fabric lifts as the body moves forward, caught between sky and ground. The frame holds motion as a quiet declaration of direction and presence.'
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
