import { useState } from 'react';

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
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <section className="max-w-6xl mx-auto flex flex-col gap-32">
      {images.map((img, index) => {
        const isActive = activeId === img.id;
        const isSpread = index % 3 === 0; // editorial rhythm

        return (
          <article
            key={img.id}
            className={`
              grid
              grid-cols-1
              md:grid-cols-2
              gap-12
              items-center
              ${isSpread ? 'md:col-span-2' : ''}
            `}
          >
            {/* IMAGE */}
            <figure
              onClick={() =>
                setActiveId(isActive ? null : img.id)
              }
              className={`
                cursor-pointer
                transition-[filter] duration-300
                ${
                  isActive
                    ? 'dark:grayscale-0 grayscale'
                    : 'grayscale-0 dark:grayscale'
                }
                ${isSpread ? 'md:col-span-2' : ''}
              `}
            >
              <img
                src={img.src}
                alt={img.title || ''}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover"
              />
            </figure>

            {/* OPTIONAL TEXT BLOCK (MAGAZINE STYLE) */}
            {(img.title || img.caption) && (
              <div className="max-w-md text-sm leading-relaxed opacity-70">
                {img.title && (
                  <h4 className="font-serif italic mb-3">
                    {img.title}
                  </h4>
                )}
                {img.caption && <p>{img.caption}</p>}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
};

export default PhotoBooth;