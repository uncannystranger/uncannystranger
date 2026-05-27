import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../types';
import GradualBlur from './GradualBlur';
import PhotoDetail from './PhotoDetail';
import { fetchLatestPhotos, UnsplashPhoto } from '../src/services/unsplash';
import { formatUnsplashPhoto } from '../src/utils/photoFormatters';

interface HomeProps {
  setSection: (section: Section) => void;
}

type HomePhoto = {
  id: string;
  title: string;
  meta: string;
  caption: string;
  src: string;
  srcSet?: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  role: 'hero' | 'feature' | 'frames' | 'gallery';
};

const unsplashImage = (base: string, width: number, quality = 75) =>
  `${base}?auto=format&fit=crop&w=${width}&q=${quality}`;

const responsiveSet = (base: string) =>
  [640, 960, 1200, 1600, 2000]
    .map((width) => `${unsplashImage(base, width, width > 1400 ? 75 : 72)} ${width}w`)
    .join(', ');

const photoBases = {
  hero: 'https://images.unsplash.com/photo-1760008780659-6ac16a68e012',
  trending: 'https://images.unsplash.com/photo-1723151684036-d014403c33b2',
  street: 'https://images.unsplash.com/photo-1737742462464-b26eb948dfeb',
  night: 'https://images.unsplash.com/photo-1744477825395-e43544c2e2cc',
  window: 'https://images.unsplash.com/photo-1759429638334-e98f8e9f3da0',
};

const HOME_PHOTOS: HomePhoto[] = [
  {
    id: '7PdUGlHwmh8',
    title: 'Abdullahi M.',
    meta: 'Portfolio',
    caption: 'A camera raised into warm silence, where looking becomes a self-portrait.',
    src: unsplashImage(photoBases.hero, 1400, 75),
    srcSet: responsiveSet(photoBases.hero),
    url: 'https://unsplash.com/photos/person-holding-a-camera-and-taking-a-picture-7PdUGlHwmh8',
    alt: 'Person holding a camera and taking a picture.',
    width: 1400,
    height: 1750,
    role: 'hero',
  },
  {
    id: 'XzWkVZKqU0M',
    title: 'Good Night Sun',
    meta: 'Feature',
    caption: 'Mogadishu exhales into evening, soft with rooftops, blue air, and the last warmth of day.',
    src: unsplashImage(photoBases.trending, 1600, 75),
    srcSet: responsiveSet(photoBases.trending),
    url: 'https://unsplash.com/photos/a-view-of-a-city-with-tall-buildings-XzWkVZKqU0M',
    alt: 'A view of a city with tall buildings.',
    width: 1600,
    height: 1200,
    role: 'feature',
  },
  {
    id: 'iJKXnMSZ_qI',
    title: 'Street Circle',
    meta: 'Frames',
    caption: 'A circle of friends turns a public street into something close and bright.',
    src: unsplashImage(photoBases.street, 1100, 72),
    srcSet: responsiveSet(photoBases.street),
    url: 'https://unsplash.com/photos/a-group-of-men-standing-next-to-each-other-iJKXnMSZ_qI',
    alt: 'A group of men standing next to each other.',
    width: 1400,
    height: 1100,
    role: 'frames',
  },
  {
    id: 'xmEupVYRQqw',
    title: 'Neon After Dark',
    meta: 'Gallery',
    caption: 'A narrow night street glows through windows, headlights, and magenta signs.',
    src: unsplashImage(photoBases.night, 1100, 72),
    srcSet: responsiveSet(photoBases.night),
    url: 'https://unsplash.com/photos/a-neon-lit-city-street-at-night-xmEupVYRQqw',
    alt: 'A neon-lit city street at night.',
    width: 1200,
    height: 1500,
    role: 'gallery',
  },
  {
    id: '_2OdbG4q4Wc',
    title: 'Room With Blue Window',
    meta: 'Gallery',
    caption: 'A quiet room is shaped by blue glass and the warm geometry of afternoon.',
    src: unsplashImage(photoBases.window, 1100, 72),
    srcSet: responsiveSet(photoBases.window),
    url: 'https://unsplash.com/photos/sunlight-streams-through-a-window-casting-shadows-_2OdbG4q4Wc',
    alt: 'Sunlight streams through a window, casting shadows.',
    width: 1200,
    height: 1500,
    role: 'gallery',
  },
];

const heroPhoto = HOME_PHOTOS[0];
const trendingPhoto = HOME_PHOTOS[1];
const framesFeaturePhoto = HOME_PHOTOS[2];
const galleryFallbackPhotos = [HOME_PHOTOS[3], HOME_PHOTOS[4], HOME_PHOTOS[1], HOME_PHOTOS[2]];

const toFallbackGalleryPhoto = (photo: HomePhoto, index: number): UnsplashPhoto => ({
  id: `home-preview-${photo.id}`,
  rawId: photo.id,
  source: 'unsplash',
  title: photo.title,
  description: photo.caption,
  intro: photo.caption,
  image: photo.src,
  imageSmall: photo.src,
  imageSrcSet: photo.srcSet,
  imageSmallSrcSet: photo.srcSet,
  alt: photo.alt,
  category: index % 2 === 0 ? 'Street' : 'Portrait',
  date: 'Selected Frame',
  year: '2026',
  sortTimestamp: Date.now() - index,
  readingTime: '2 min read',
  location: 'Somalia',
  width: photo.width,
  height: photo.height,
  aspectRatio: photo.width / photo.height,
  color: '#1c1917',
  likes: null,
  views: null,
  downloads: null,
  exif: null,
  tags: [],
  unsplashUrl: photo.url,
  photographer: 'Abdullahi Maxamed',
});

const newestFirst = (items: UnsplashPhoto[]) =>
  [...items].sort((a, b) => b.sortTimestamp - a.sortTimestamp);

const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.45" />
    <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.45" />
    <circle cx="16.8" cy="7.2" r="1" fill="currentColor" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4.75 4.75l14.5 14.5M19.25 4.75L4.75 19.25" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
  </svg>
);

const UnsplashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9.25 4h5.5v6h-5.5V4Zm-5.5 9.25h5.5V20h5.5v-6.75h5.5V20H3.75v-6.75Z" fill="currentColor" />
  </svg>
);

const HomePhotoButton = ({
  photo,
  activePhotoId,
  onSelect,
  className = '',
  sizes = '(max-width: 768px) 92vw, 42vw',
  eager = false,
}: {
  photo: HomePhoto;
  activePhotoId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  sizes?: string;
  eager?: boolean;
}) => (
  <button
    type="button"
    className={`home-photo-shell ${activePhotoId === photo.id ? 'is-active' : ''} ${className}`}
    onClick={() => onSelect(photo.id)}
    aria-pressed={activePhotoId === photo.id}
    aria-label={`Toggle color treatment for ${photo.title}`}
    data-cursor={photo.title}
  >
    <img
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={sizes}
      alt={photo.alt}
      draggable={false}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      width={photo.width}
      height={photo.height}
    />
    <span className="media-protection-overlay" aria-hidden="true" />
  </button>
);

const Home = ({ setSection }: HomeProps) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const trendingRef = useRef<HTMLElement | null>(null);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [galleryPreviewPhotos, setGalleryPreviewPhotos] = useState<UnsplashPhoto[]>(
    galleryFallbackPhotos.map(toFallbackGalleryPhoto)
  );
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(-1);

  const handlePhotoSelect = (id: string) => {
    setActivePhotoId((current) => (current === id ? null : id));
  };

  useEffect(() => {
    let cancelled = false;

    fetchLatestPhotos(6)
      .then((photos) => {
        if (cancelled) return;
        const formatted = newestFirst(photos.map(formatUnsplashPhoto)).slice(0, 4);
        if (formatted.length) setGalleryPreviewPhotos(formatted);
      })
      .catch(() => {
        if (!cancelled) setGalleryPreviewPhotos(galleryFallbackPhotos.map(toFallbackGalleryPhoto));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeGalleryPhoto = activeGalleryIndex >= 0 ? galleryPreviewPhotos[activeGalleryIndex] : null;

  return (
    <>
      <section
        data-protected="true"
        ref={heroRef}
        data-chapter="Introduction"
        className="editorial-home-hero home-reference-hero editorial-safe-top protected-content relative min-h-[100svh] overflow-hidden px-5 sm:px-8 md:px-12 lg:px-16"
      >
        <div className="absolute inset-0 bg-beige dark:bg-black" />
        <div className="editorial-grid-lines absolute inset-0 pointer-events-none opacity-100" />
        <div className="home-hero-vignette" aria-hidden="true" />
        <GradualBlur preset="footer" height="7rem" strength={1.2} divCount={5} zIndex={3} className="home-gradual-blur" />

        <div className="home-reference-layout relative z-10 mx-auto grid min-h-[calc(100svh-var(--nav-safe-offset))] max-w-[1560px] grid-cols-1 gap-8 pb-20 md:grid-cols-12 md:gap-x-8 md:pb-10">
          <aside className="home-social-rail md:col-span-1">
            <div className="flex flex-row gap-5 md:flex-col">
              <a href="https://instagram.com/uncannystranger" target="_blank" rel="noopener noreferrer" data-cursor="Instagram" aria-label="Instagram" className="home-social-icon">
                <InstagramIcon />
              </a>
              <a href="https://unsplash.com/@uncannystranger" target="_blank" rel="noopener noreferrer" data-cursor="Unsplash" aria-label="Unsplash" className="home-social-icon">
                <UnsplashIcon />
              </a>
              <a href="https://x.com/uncannystranger" target="_blank" rel="noopener noreferrer" data-cursor="X" aria-label="X" className="home-social-icon">
                <XIcon />
              </a>
            </div>
          </aside>

          <div className="home-hero-copy relative z-30 md:col-span-6 md:col-start-2 md:row-start-1">
            <div>
              <p className="home-hero-topline">Portfolio</p>
              <h1 className="editorial-hero-title home-hero-masthead font-serif text-ink-primary dark:text-bone-primary" aria-label="Abdullahi M.">
                <span className="block">Abdullahi</span>
                <span className="block">M.</span>
              </h1>
              <p className="home-hero-deck mt-7 max-w-[430px] font-serif text-[clamp(1rem,1.45vw,1.25rem)] leading-[1.75]">
                Seen once. Remembered Longer.
              </p>
            </div>

          </div>

          <div
            className="home-hero-image-wrap home-hero-collage md:col-span-10 md:col-start-2 md:row-start-1"
          >
            <figure className="home-collage-item home-collage-main">
              <HomePhotoButton
                photo={heroPhoto}
                activePhotoId={activePhotoId}
                onSelect={handlePhotoSelect}
                className="home-hero-image editorial-image-mask"
                eager
              />
            </figure>
          </div>
        </div>
      </section>

      <section data-protected="true" data-chapter="Frames" className="protected-content home-frames-intro relative px-5 py-14 sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="home-section-divider top" aria-hidden="true" />
        <div className="editorial-grid-lines absolute inset-0 pointer-events-none opacity-80" />
        <div className="home-frames-layout relative mx-auto grid max-w-[1460px] grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-8">
          <div className="md:col-span-5">
            <h2 className="font-serif text-[clamp(3.8rem,8vw,8.5rem)] uppercase leading-[0.78] tracking-[-0.075em] text-ink-primary dark:text-bone-primary">
              Frames
            </h2>
            <p className="mt-7 max-w-[10rem] font-serif text-[clamp(1.25rem,2vw,1.8rem)] leading-[1.25] text-ink-primary/72 dark:text-bone-primary/72">
              Where photographs become essays.
            </p>
            <Link to="/frames" onClick={() => setSection('projects:frames')} className="home-editorial-link mt-7" data-cursor="Frames">
              Enter Frames
            </Link>
          </div>
          <div className="home-frames-preview-strip md:col-span-7">
            {[framesFeaturePhoto, galleryFallbackPhotos[0], galleryFallbackPhotos[1]].map((photo, index) => (
              <figure className="home-frames-feature" key={photo.id}>
                <HomePhotoButton
                  photo={photo}
                  activePhotoId={activePhotoId}
                  onSelect={handlePhotoSelect}
                  className="home-frames-photo editorial-image-mask"
                  sizes="(max-width: 768px) 92vw, 26vw"
                />
                <figcaption>
                  <span>Frame {String(index + 1).padStart(2, '0')}</span>
                  <h3>{photo.title}</h3>
                  <p>{photo.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="home-section-divider bottom" aria-hidden="true" />
      </section>

      <section
        ref={trendingRef}
        data-protected="true"
        data-chapter="Good Night Sun"
        className="protected-content relative overflow-hidden px-5 py-20 sm:px-8 md:px-12 md:py-32 lg:px-16"
      >
        <div className="home-section-divider top" aria-hidden="true" />
        <div className="editorial-grid-lines absolute inset-0 pointer-events-none opacity-100" />
        <div className="relative mx-auto grid max-w-[1460px] grid-cols-1 gap-9 md:grid-cols-12 md:gap-x-8">
          <article
            className="home-trending-spread md:col-span-12"
          >
            <Link to={`/frames/${trendingPhoto.id}`} className="home-goodnight-image-link" data-cursor="Read">
              <img
                src={trendingPhoto.src}
                srcSet={trendingPhoto.srcSet}
                sizes="(max-width: 768px) 92vw, 55vw"
                alt={trendingPhoto.alt}
                draggable={false}
                loading="lazy"
                decoding="async"
                width={trendingPhoto.width}
                height={trendingPhoto.height}
                className="home-city-image"
              />
            </Link>
            <div className="home-trending-copy">
              <h2>
                {trendingPhoto.title}
              </h2>
              <p>
                {trendingPhoto.caption}
              </p>
              <Link to={`/frames/${trendingPhoto.id}`} onClick={() => setSection('projects:frames')} className="home-editorial-link home-read-frame-link mt-8" data-cursor="Read">
                Read Frame
              </Link>
            </div>
          </article>
        </div>
        <div className="home-section-divider bottom" aria-hidden="true" />
      </section>

      <section data-protected="true" data-chapter="Gallery" className="protected-content relative px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="home-section-divider top" aria-hidden="true" />
        <div className="editorial-grid-lines absolute inset-0 pointer-events-none opacity-70" />
        <div className="relative mx-auto grid max-w-[1460px] grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-4 md:pt-10">
            <span className="home-section-kicker">Short Gallery</span>
            <h2 className="mt-6 max-w-[10ch] font-serif text-[clamp(2.8rem,6vw,6.8rem)] uppercase leading-[0.82] tracking-[-0.065em] text-ink-primary dark:text-bone-primary">
              A brief edit, not the whole archive.
            </h2>
            <Link to="/projects" onClick={() => setSection('projects')} className="home-editorial-link mt-9" data-cursor="Gallery">
              Explore Gallery
            </Link>
          </div>
          <div className="home-gallery-strip home-masonry-preview md:col-span-8">
            {galleryPreviewPhotos.map((photo, index) => (
              <button
                type="button"
                key={photo.id}
                className="home-gallery-card"
                onClick={() => setActiveGalleryIndex(index)}
                data-cursor="Open"
              >
                <span className="home-gallery-image-wrap">
                  <img
                    src={photo.imageSmall}
                    srcSet={photo.imageSmallSrcSet}
                    sizes="(max-width: 768px) 92vw, 26vw"
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    width={photo.width}
                    height={photo.height}
                    style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                    className="home-gallery-photo"
                  />
                </span>
                <span>Frame {String(index + 1).padStart(2, '0')}</span>
                <h3>{photo.title}</h3>
                <p>{photo.intro}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="home-section-divider bottom" aria-hidden="true" />
        <PhotoDetail
          photo={activeGalleryPhoto}
          photos={galleryPreviewPhotos}
          activeIndex={activeGalleryIndex}
          onClose={() => setActiveGalleryIndex(-1)}
          onNavigate={(nextIndex) => {
            if (nextIndex >= 0 && nextIndex < galleryPreviewPhotos.length) setActiveGalleryIndex(nextIndex);
          }}
        />
      </section>
    </>
  );
};

export default React.memo(Home);
