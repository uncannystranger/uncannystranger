import type { UnsplashPhoto } from '../services/unsplash';
import { getFrameStorySummary } from './frameStoryIndex';
import type { FrameArticleText } from './frameStoryBodies';

const fallbackArticle = (photo: UnsplashPhoto): FrameArticleText => {
  const summary = getFrameStorySummary(photo.rawId);
  const title = summary?.title || photo.title;
  const excerpt = summary?.excerpt || photo.description || photo.intro;
  const place = photo.location || 'the archive';

  return {
    quote: 'A photograph can hold more than it explains.',
    opening: `${title} begins as a quiet fragment from ${place}.`,
    story: `${excerpt} The frame lets light, posture, and distance carry the story without forcing the moment into spectacle.`,
    observation:
      'Its strongest detail is restraint: enough context to feel specific, enough silence to remain open.',
    meaning:
      'As a Frame, it works less like a caption and more like a small editorial memory.',
    closing: 'The image stays after the page moves on.',
  };
};

export const loadFrameArticleText = async (
  photo: UnsplashPhoto
): Promise<FrameArticleText> => {
  const { FRAME_STORY_BODIES } = await import('./frameStoryBodies');
  return (
    FRAME_STORY_BODIES[photo.rawId as keyof typeof FRAME_STORY_BODIES] ||
    fallbackArticle(photo)
  );
};
