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
     Detect dark mode (correctly)
  ------------------------------ */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
      setActiveId(null); // reset selection when theme changes
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
     Cloudinary helpers (fast)
  ------------------------------ */
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

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.setAttribute('data-loaded', 'true');
  };

  return (
    <section className="max-w-7xl mx-auto py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-32">
        {images.map((img, index) => {
          const isActive = activeId === img.id;

          /* ------------------------------
             GRAYSCALE LOGIC (CORRECT)
             Dark mode:
               - default = grayscale
               - clicked = color
             Light mode:
               - default = color
               - clicked = grayscale
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
                flex flex-col items-center
                ${index % 3 === 1 ? 'lg:mt-24' : ''}
                ${index % 3 === 2 ? 'lg:mt-12' : ''}
              `}
            >
              {/* IMAGE FRAME */}
              <figure
                onClick={() =>
                  setActiveId(isActive ? null : img.id)
                }
                className="
                  relative
                  w-full
                  aspect-[3/4]
                  cursor-pointer
                  bg-black
                  dark:bg-[#4a2a12]
                  p-[5px]
                  shadow-[0_18px_40px_rgba(0,0,0,0.35)]
                  dark:shadow-[0_18px_40px_rgba(0,0,0,0.65)]
                "
              >
                <div className="relative w-full h-full bg-white md:p-[10px] p-0">
                  <img
                    src={buildCloudinarySrc(img.src, 1200)}
                    srcSet={buildSrcSet(img.src)}
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
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