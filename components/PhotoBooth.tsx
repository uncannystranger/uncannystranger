import { useEffect, useState, type SyntheticEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useScrollDirection } from '../src/hooks/useScrollDirection';
import { useDeviceTier } from '../src/hooks/useDeviceTier';

const LIQUID_SPRING = {
  type: 'spring',
  stiffness: 220,
  damping: 18,
  mass: 0.85,
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
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const direction = useScrollDirection();
  const { isLowPower } = useDeviceTier();
  const reduceMotion = shouldReduceMotion || isSmallScreen || isLowPower;
  const motionScale = reduceMotion ? 0.55 : 1;

  const isDarkMode =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');

  const getDirectionalY = (baseValue = 28) => {
    const scaled = baseValue * motionScale;
    if (direction === 'down') return scaled;
    if (direction === 'up') return -scaled;
    return scaled;
  };

  const handleFocusLoad = (
  event: SyntheticEvent<HTMLImageElement>
) => {
    event.currentTarget.setAttribute('data-loaded', 'true');
  };

  const buildCloudinarySrc = (src: string, width: number) => {
    if (!src.includes('/upload/')) return src;
    if (src.includes('w_')) {
      return src.replace(/w_\d+/, `w_${width}`);
    }
    return src.replace('/upload/', `/upload/w_${width},`);
  };

  const buildSrcSet = (src: string) =>
    [480, 720, 960, 1200, 1600]
      .map((w) => `${buildCloudinarySrc(src, w)} ${w}w`)
      .join(', ');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsSmallScreen(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

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
              initial={{ opacity: 0.4, y: getDirectionalY() }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '40% 0px' }}
              transition={LIQUID_SPRING}
              className={`
                flex flex-col items-center
                ${index % 3 === 1 ? 'lg:mt-24' : ''}
                ${index % 3 === 2 ? 'lg:mt-12' : ''}
              `}
            >
              <motion.figure
                onClick={() => setActiveId(isActive ? null : img.id)}
                whileHover={{ y: reduceMotion ? 0 : -4 }}
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
                    src={buildCloudinarySrc(img.src, 1200)}
                    srcSet={buildSrcSet(img.src)}
                    sizes="(max-width: 768px) 86vw, (max-width: 1200px) 45vw, 30vw"
                    alt={img.title || ''}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={index < 2 ? 'high' : 'auto'}
                    data-loaded="false"
                    onLoad={handleFocusLoad}
                    layoutId={`img-${img.id}`}
                    className={`
                      max-w-full
                      max-h-[75vh]
                      object-contain
                      transition-all
                      duration-400
                      focus-reveal
                      ${imageClass}
                    `}
                  />
                </div>
              </motion.figure>

              {(img.title || img.caption) && (
                <motion.figcaption
                  initial={{ opacity: 0, y: reduceMotion ? 6 : 12 }}
                  whileInView={{ opacity: 0.75, y: 0 }}
                  transition={{ ...LIQUID_SPRING, delay: 0.1 }}
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
  <div className="font-serif italic text-sm mb-1 text-orange-600">
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
