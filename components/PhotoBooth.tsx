import { useEffect, useState, type SyntheticEvent } from 'react';
import { useDeviceTier } from '../src/hooks/useDeviceTier';

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
  const { isLowPower } = useDeviceTier();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  /* ------------------------------
     Detect dark mode
  ------------------------------ */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
      setActiveId(null);
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  /* ------------------------------
     Cloudinary helpers
  ------------------------------ */
  const buildCloudinarySrc = (src: string, width: number) => {
    if (!src.includes('/upload/')) return src;
    if (src.includes('w_')) return src.replace(/w_\d+/, `w_${width}`);
    return src.replace('/upload/', `/upload/w_${width},`);
  };

  const buildSrcSet = (src: string) =>
    [480, 720, 960, 1200, 1600]
      .map((w) => `${buildCloudinarySrc(src, w)} ${w}w`)
      .join(', ');

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.setAttribute('data-loaded', 'true');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* HANGING RAIL */}
      <div className="relative mb-20 hidden lg:block">
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-neutral-900/20 dark:bg-white/15" />
      </div>

      {/* WALL PERSPECTIVE */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-x-6
          gap-y-24
          lg:gap-x-20
          lg:gap-y-40
          [perspective:1800px]
        "
      >
        {images.map((img, index) => {
          const isActive = activeId === img.id;

          /* ------------------------------
             GRAYSCALE LOGIC (UNCHANGED)
          ------------------------------ */
          const imageClass = isDarkMode
            ? isActive
              ? 'grayscale-0'
              : 'grayscale'
            : isActive
            ? 'grayscale'
            : 'grayscale-0';

          /* ------------------------------
             STRONG MUSEUM TILT
          ------------------------------ */
          const tilt =
            isLowPower
              ? ''
              : index % 3 === 0
              ? 'lg:rotate-y-[-10deg] lg:rotate-x-[2deg]'
              : index % 3 === 2
              ? 'lg:rotate-y-[10deg] lg:rotate-x-[2deg]'
              : 'lg:rotate-y-[0deg] lg:rotate-x-[1deg]';

          return (
            <article
              key={img.id}
              className={`
                flex flex-col items-center
                ${index % 3 === 1 ? 'lg:mt-28' : ''}
                ${index % 3 === 2 ? 'lg:mt-16' : ''}
              `}
            >
              {/* HANGING STRING */}
              <div className="hidden lg:block relative h-10 w-px bg-neutral-900/30 dark:bg-white/20 mb-1" />

              {/* FRAME */}
              <figure
                onClick={() => setActiveId(isActive ? null : img.id)}
                className={`
                  relative
                  w-full
                  aspect-[3/4]
                  cursor-pointer
                  bg-black
                  dark:bg-[#4a2a12]
                  p-[4px]
                  sm:p-[5px]
                  shadow-[0_22px_50px_rgba(0,0,0,0.4)]
                  dark:shadow-[0_28px_70px_rgba(0,0,0,0.7)]
                  transform-gpu
                  ${tilt}
                `}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* INNER MAT */}
                <div
                  className="relative w-full h-full bg-white sm:p-[8px] p-0"
                  style={{
                    transform: 'translateZ(18px)',
                  }}
                >
                  <img
                    src={buildCloudinarySrc(img.src, 1200)}
                    srcSet={buildSrcSet(img.src)}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    alt={img.title || ''}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={index < 2 ? 'high' : 'auto'}
                    onLoad={handleLoad}
                    className={`
                      w-full
                      h-full
                      object-cover
                      ${imageClass}
                    `}
                  />
                </div>
              </figure>

              {/* CAPTION */}
              {(img.title || img.caption) && (
                <figcaption className="mt-6 max-w-xs text-center text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
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
                </figcaption>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default PhotoBooth;