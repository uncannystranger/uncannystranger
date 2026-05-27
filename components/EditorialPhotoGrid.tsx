import React from 'react';
import { UnsplashPhoto } from '../src/services/unsplash';

interface EditorialPhotoGridProps {
  photos: UnsplashPhoto[];
  onOpen: (photo: UnsplashPhoto, index: number) => void;
}

export const EditorialPhotoGrid = ({ photos, onOpen }: EditorialPhotoGridProps) => {
  return (
    <div className="editorial-masonry-grid">
      {photos.map((photo, index) => (
        <figure
          key={photo.id}
          onClick={() => onOpen(photo, index)}
          className="editorial-masonry-item group relative w-full cursor-pointer"
          data-cursor="Open"
        >
          <div
            className="editorial-image-mask relative w-full overflow-hidden bg-ink-primary/[0.035] shadow-[0_18px_55px_rgba(28,25,23,0.07)] dark:bg-bone-primary/[0.045] dark:shadow-[0_20px_65px_rgba(0,0,0,0.28)]"
          >
            <img
              src={photo.imageSmall}
              srcSet={photo.imageSmallSrcSet}
              sizes="(max-width: 768px) 92vw, (max-width: 1024px) 46vw, (max-width: 1280px) 31vw, 23vw"
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              width={photo.width}
              height={photo.height}
              style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
              className="h-auto max-h-[72vh] w-full object-contain grayscale transition-[filter,opacity] duration-200 group-hover:grayscale-0 group-hover:brightness-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <div className="absolute bottom-5 left-5 right-5 translate-y-2 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="text-[9px] uppercase tracking-[0.34em] text-bone-primary/68">
                Unsplash / {photo.category}
              </p>
              <p className="mt-2 max-w-sm font-serif text-xl leading-[0.95] tracking-[-0.035em] text-bone-primary">
                {photo.title}
              </p>
            </div>
          </div>

          <figcaption className="mt-4 border-t border-ink-primary/12 pt-4 dark:border-bone-primary/12">
            <div className="mb-3 flex flex-wrap gap-3 text-[9px] uppercase tracking-[0.3em] text-ink-primary/42 dark:text-bone-primary/42">
              <span>Unsplash</span>
              <span>{photo.category}</span>
              <span>{photo.date}</span>
            </div>
            <h3 className="break-words font-serif text-[clamp(1.55rem,2.4vw,2.45rem)] leading-[0.98] tracking-[-0.045em] text-ink-primary dark:text-bone-primary">
              {photo.title}
            </h3>
            <p className="mt-4 max-w-sm font-serif text-xs leading-relaxed text-ink-primary/58 dark:text-bone-primary/58">
              {photo.intro}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

export default EditorialPhotoGrid;
