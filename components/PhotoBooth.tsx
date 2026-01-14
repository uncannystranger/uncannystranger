import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useScrollDirection } from '../src/hooks/useScrollDirection';

const LIQUID_SPRING = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 1
};

interface BoothImage {
  id: number;
  src: string;
  title?: string;
  caption?: string;
}

interface PhotoBoothProps {
  images: BoothImage[];
}

const PhotoBooth = ({ images }: PhotoBoothProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<number | null>(null);
  const direction = useScrollDirection();

  const getDirectionalY = (baseValue = 40) => {
    if (direction === 'down') return baseValue;
    if (direction === 'up') return -baseValue;
    return baseValue;
  };

  return (
    <section className="max-w-6xl mx-auto flex flex-col gap-40">
      {images.map((img, index) => {
        const isActive = activeId === img.id;
        const isSpread = index % 3 === 0;

        return (
          <motion.article
            key={img.id}
            initial={{ opacity: 0, y: getDirectionalY() }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={LIQUID_SPRING}
            className={`
              grid
              grid-cols-1
              md:grid-cols-2
              gap-16
              items-center
            `}
          >
            {/* IMAGE */}
            <motion.figure
              onClick={() => setActiveId(isActive ? null : img.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={LIQUID_SPRING}
              className={`
                relative
                cursor-pointer
                overflow-hidden
                will-change-transform
                ${isActive
                  ? 'dark:grayscale-0 grayscale scale-[1.01]'
                  : 'grayscale-0 dark:grayscale'
                }
                ${isSpread ? 'md:col-span-2' : ''}
              `}
            >
              <motion.img
                src={img.src}
                alt={img.title || ''}
                loading="lazy"
                decoding="async"
                layoutId={`img-${img.id}`}
                className="
                  w-full
                  h-auto
                  md:max-h-[80vh]
                  object-cover
                  mx-auto
                "
              />

              {/* SOFT DEPTH */}
              <div
                className="
                  pointer-events-none
                  absolute inset-0
                  shadow-[inset_0_-40px_80px_rgba(0,0,0,0.15)]
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-700
                "
              />
            </motion.figure>

            {/* OPTIONAL TEXT BLOCK */}
            {(img.title || img.caption) && (
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 0.75, x: 0 }}
                transition={{ ...LIQUID_SPRING, delay: 0.2 }}
                className="max-w-md text-sm leading-relaxed"
              >
                {img.title && (
                  <h4 className="font-serif italic mb-4 text-base">
                    {img.title}
                  </h4>
                )}
                {img.caption && (
                  <p className="leading-loose">{img.caption}</p>
                )}
              </motion.div>
            )}
          </motion.article>
        );
      })}
    </section>
  );
};

export default PhotoBooth;