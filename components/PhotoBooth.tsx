import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useScrollDirection } from '../src/hooks/useScrollDirection';

const LIQUID_SPRING = {
  type: 'spring',
  stiffness: 90,
  damping: 18,
  mass: 1,
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

  const isDarkMode =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');

  const getDirectionalY = (baseValue = 40) => {
    if (direction === 'down') return baseValue;
    if (direction === 'up') return -baseValue;
    return baseValue;
  };

  return (
    <section className="max-w-7xl mx-auto flex flex-col gap-48">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-24 gap-y-40">
        {images.map((img, index) => {
          const isActive = activeId === img.id;

          const imageClass = isDarkMode
            ? isActive
              ? 'grayscale-0'
              : 'grayscale'
            : isActive
            ? 'grayscale'
            : 'grayscale-0';

          return (
            <motion.article
              key={img.id}
              initial={{ opacity: 0, y: getDirectionalY() }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-10%' }}
              transition={LIQUID_SPRING}
              className={`
                flex flex-col items-center
                ${index % 3 === 1 ? 'lg:mt-24' : ''}
                ${index % 3 === 2 ? 'lg:mt-12' : ''}
              `}
            >
              <motion.figure
                onClick={() => setActiveId(isActive ? null : img.id)}
                whileHover={{ y: shouldReduceMotion ? 0 : -4 }}
                transition={LIQUID_SPRING}
                className="
                  relative
                  cursor-pointer
                  bg-black
                  dark:bg-[#4a2a12]
                  p-[5px]
                  shadow-[0_18px_40px_rgba(0,0,0,0.35)]
                  dark:shadow-[0_18px_40px_rgba(0,0,0,0.65)]
                "
              >
                <div className="bg-white p-[10px] flex items-center justify-center">
                  <motion.img
                    src={img.src}
                    alt={img.title || ''}
                    loading="lazy"
                    decoding="async"
                    layoutId={`img-${img.id}`}
                    className={`
                      max-w-full
                      max-h-[75vh]
                      object-contain
                      transition-all
                      duration-700
                      ${imageClass}
                    `}
                  />
                </div>
              </motion.figure>

              {(img.title || img.caption) && (
                <motion.figcaption
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 0.75, y: 0 }}
                  transition={{ ...LIQUID_SPRING, delay: 0.2 }}
                  className="
                    mt-6
                    max-w-xs
                    text-center
                    text-xs
                    leading-relaxed
                    text-neutral-600
                    dark:text-neutral-400
                  "
                >
                  {img.title && (
                    <div className="font-serif italic text-sm mb-1 text-neutral-800 dark:text-neutral-200">
                      {img.title}
                    </div>
                  )}
                  {img.caption && (
                    <div className="tracking-wide">
                      {img.caption}
                    </div>
                  )}
                </motion.figcaption>
              )}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default PhotoBooth;