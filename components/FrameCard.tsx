import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { UnsplashPhoto } from '../src/services/unsplash';
import { getFrameEngagement } from '../src/utils/frameEngagement';

type FrameCardProps = {
  photo: UnsplashPhoto;
  index: number;
};

export const FrameCard: React.FC<FrameCardProps> = ({
  photo,
  index,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const engagement = getFrameEngagement(photo.rawId);

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.025 }}
      className={`group ${index % 4 === 0 ? 'md:col-span-7' : index % 4 === 1 ? 'md:col-span-5 md:mt-12' : index % 4 === 2 ? 'md:col-span-5' : 'md:col-span-7 md:mt-10'}`}
    >
      <Link to={`/frames/${photo.rawId}`} data-cursor="Read" className="block">
        <div className="editorial-image-mask overflow-hidden bg-ink-primary/[0.035] dark:bg-bone-primary/[0.045]">
          <img
            src={photo.imageSmall}
            srcSet={photo.imageSmallSrcSet}
            sizes="(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 44vw"
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            width={photo.width}
            height={photo.height}
            className="h-auto max-h-[70vh] w-full object-contain grayscale transition-[filter,transform,opacity] duration-200 group-hover:scale-[1.012] group-hover:grayscale-0"
          />
        </div>
        <div className="mt-6 border-t border-ink-primary/12 pt-5 dark:border-bone-primary/12">
          <div className="mb-4 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.32em] text-accent">
            <span>{photo.category}</span>
            <span>{engagement.views} story views</span>
            <span>{engagement.likes} story likes</span>
            <span>{photo.readingTime}</span>
            <span>{photo.date}</span>
          </div>
          <h3 className="max-w-[12ch] break-words font-serif text-[clamp(2.35rem,5.3vw,5.8rem)] uppercase leading-[0.88] tracking-[-0.065em] text-ink-primary transition-colors duration-200 group-hover:text-accent dark:text-bone-primary">
            {photo.title}
          </h3>
          <p className="mt-5 max-w-md font-serif text-sm leading-[2] text-ink-primary/64 dark:text-bone-primary/64">
            {photo.intro}
          </p>
          <span className="mt-7 inline-block border-b border-ink-primary/45 pb-2 font-serif text-sm transition-colors duration-200 group-hover:border-accent group-hover:text-accent dark:border-bone-primary/45">
            Read frame
          </span>
        </div>
      </Link>
    </motion.article>
  );
};

export default FrameCard;
