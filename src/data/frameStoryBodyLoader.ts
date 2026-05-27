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
  if (photo.frameStory?.story) {
    const stored = photo.frameStory.story.split(/\n\s*\n/).filter(Boolean);
    return {
      quote: stored[0] || 'A photograph can hold more than it explains.',
      opening: photo.frameStory.subtitle || photo.intro,
      story: stored[1] || photo.frameStory.story,
      observation: stored[2] || 'Light, gesture, and distance give this moment its editorial shape.',
      meaning: stored[3] || 'Held as a Frame, the image becomes a small record of place and memory.',
      closing: photo.frameStory.excerpt || 'The image stays after the page moves on.',
    };
  }
  const { FRAME_STORY_BODIES } = await import('./frameStoryBodies');
  return (
    FRAME_STORY_BODIES[photo.rawId as keyof typeof FRAME_STORY_BODIES] ||
    fallbackArticle(photo)
  );
};
