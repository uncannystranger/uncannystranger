import { useEffect, useState, type SyntheticEvent } from 'react';
import { useDeviceTier } from '../src/hooks/useDeviceTier';

interface BoothImage {
  id: number;
  src: string;
  title?: string;
  alt?: string;
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
    <section data-protected="true" className="protected-content mx-auto max-w-[1440px] px-0 py-16 md:py-24">
      <div
        className="
          relative
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-12
          gap-x-8
          gap-y-20
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

          return (
            <article
              key={img.id}
              className={`
                group
                ${index % 6 === 0 ? 'lg:col-span-4 lg:col-start-1' : ''}
                ${index % 6 === 1 ? 'lg:col-span-3 lg:col-start-6 lg:mt-28' : ''}
                ${index % 6 === 2 ? 'lg:col-span-4 lg:col-start-9 lg:mt-8' : ''}
                ${index % 6 === 3 ? 'lg:col-span-5 lg:col-start-2 lg:mt-20' : ''}
                ${index % 6 === 4 ? 'lg:col-span-3 lg:col-start-8' : ''}
                ${index % 6 === 5 ? 'lg:col-span-4 lg:col-start-10 lg:mt-24' : ''}
              `}
            >
              <figure
                onClick={() => setActiveId(isActive ? null : img.id)}
                className={`
                  editorial-image-mask
                  relative
                  w-full
                  aspect-[3/4]
                  cursor-pointer
                  overflow-hidden
                  border
                  border-ink-primary/10
                  bg-ink-primary/[0.035]
                  dark:border-bone-primary/10
                  dark:bg-bone-primary/[0.045]
                `}
              >
                <div className="relative h-full w-full">
                  <img
                    src={buildCloudinarySrc(img.src, 1200)}
                    srcSet={buildSrcSet(img.src)}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    alt={img.alt || img.title || 'Photograph from the Uncanny Stranger portfolio'}
                    draggable={false}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={index < 2 ? 'high' : 'auto'}
                    onLoad={handleLoad}
                    className={`
                      w-full
                      h-full
                      object-cover
                      transition-transform
                      duration-[1400ms]
                      ease-out
                      group-hover:scale-[1.035]
                      ${imageClass}
                    `}
                  />
                  <div className="media-protection-overlay" aria-hidden="true" />
                </div>
              </figure>

              {(img.title || img.caption) && (
                <figcaption className="mt-5 border-t border-ink-primary/12 pt-4 text-left font-serif text-xs leading-relaxed text-ink-primary/62 dark:border-bone-primary/12 dark:text-bone-primary/62">
                  {img.title && (
                    <div className="mb-2 text-base leading-none tracking-[-0.03em] text-ink-primary dark:text-bone-primary">
                      {img.title}
                    </div>
                  )}
                  {img.caption && (
                    <div>
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
