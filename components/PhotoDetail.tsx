import React, { useEffect, useState } from 'react';
import { fetchPhotoDetails, UnsplashPhoto } from '../src/services/unsplash';
import { cameraLabel, formatStats, mergePhotoDetails } from '../src/utils/photoFormatters';

interface PhotoDetailProps {
  photo: UnsplashPhoto | null;
  photos: UnsplashPhoto[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const PhotoDetail = ({
  photo,
  photos,
  activeIndex,
  onClose,
  onNavigate,
}: PhotoDetailProps) => {
  const [detail, setDetail] = useState<UnsplashPhoto | null>(photo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!photo) return;
    let cancelled = false;
    setDetail(photo);
    setError('');
    setIsLoading(true);

    fetchPhotoDetails(photo.rawId)
      .then((result) => {
        if (!cancelled) setDetail(mergePhotoDetails(photo, result));
      })
      .catch(() => {
        if (!cancelled) setError('Extra metadata is quiet for now.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [photo]);

  useEffect(() => {
    if (!photo) return;
    document.body.classList.add('photo-modal-open');
    return () => document.body.classList.remove('photo-modal-open');
  }, [photo]);

  useEffect(() => {
    if (!photo) return;
    const candidates = [photos[activeIndex - 1], photo, photos[activeIndex + 1]].filter(Boolean);
    candidates.forEach((item) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = item.image;
    });
  }, [activeIndex, photo, photos]);

  useEffect(() => {
    if (!photo) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNavigate(Math.min(photos.length - 1, activeIndex + 1));
      if (event.key === 'ArrowLeft') onNavigate(Math.max(0, activeIndex - 1));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, onClose, onNavigate, photo, photos.length]);

  if (!photo || !detail) return null;

  return (
      <div
        className="fixed inset-0 z-[10000] flex min-h-[100dvh] items-start justify-center overflow-hidden bg-ink-primary/45 px-3 py-2 backdrop-blur-[2px] dark:bg-black/72 sm:px-5 sm:py-7 md:items-center md:py-7"
        onClick={onClose}
      >
        <article
          className="photo-detail-panel relative grid max-h-[calc(100dvh-1rem)] w-full max-w-[1180px] overflow-y-auto border border-ink-primary/10 bg-beige text-ink-primary shadow-[0_36px_120px_rgba(0,0,0,0.28)] dark:border-bone-primary/12 dark:bg-[#11100f] dark:text-bone-primary md:max-h-[85vh] md:overflow-hidden lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="sticky top-3 z-30 col-span-full flex justify-end px-3 pt-3 md:absolute md:right-3 md:top-3 md:block md:p-0">
            <button
              onClick={onClose}
              aria-label="Close Frame"
              className="photo-detail-close group inline-flex min-h-[38px] items-center gap-3 rounded-full px-4 font-serif text-[11px] uppercase tracking-[0.22em] shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-[opacity,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <span>Close Frame</span>
              <span className="h-px w-6 bg-current opacity-45 transition-all duration-200 group-hover:w-8 group-hover:opacity-80" aria-hidden="true" />
            </button>
          </div>

          <div className="photo-detail-media relative flex min-h-[32vh] items-center justify-center bg-ink-primary/[0.025] p-4 pt-0 dark:bg-bone-primary/[0.035] md:min-h-[42vh] md:p-6">
              <img
                key={detail.rawId}
                src={detail.image}
                srcSet={detail.imageSrcSet}
                sizes="(max-width: 768px) 96vw, 68vw"
                alt={detail.alt}
                loading="eager"
                decoding="async"
                width={detail.width}
                height={detail.height}
                className="max-h-[70dvh] w-full object-contain md:max-h-[76vh]"
              />
            <div className="absolute inset-x-3 bottom-3 hidden justify-between md:inset-x-3 md:top-1/2 md:bottom-auto md:flex md:-translate-y-1/2">
              <button
                onClick={() => onNavigate(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="rounded-full border border-ink-primary/12 bg-beige/78 px-4 py-3 font-serif text-sm text-ink-primary backdrop-blur-sm transition hover:border-accent hover:text-accent disabled:opacity-20 dark:border-bone-primary/14 dark:bg-black/38 dark:text-bone-primary"
              >
                Prev
              </button>
              <button
                onClick={() => onNavigate(activeIndex + 1)}
                disabled={activeIndex >= photos.length - 1}
                className="rounded-full border border-ink-primary/12 bg-beige/78 px-4 py-3 font-serif text-sm text-ink-primary backdrop-blur-sm transition hover:border-accent hover:text-accent disabled:opacity-20 dark:border-bone-primary/14 dark:bg-black/38 dark:text-bone-primary"
              >
                Next
              </button>
            </div>
          </div>

          <aside className="photo-detail-copy flex max-h-none flex-col justify-between gap-8 overflow-visible p-5 pb-[calc(var(--mobile-nav-height,72px)+env(safe-area-inset-bottom)+2rem)] md:max-h-[85vh] md:overflow-y-auto md:p-8">
            <div>
              <div className="mb-6 flex items-center justify-between gap-4 md:gap-12 md:pr-12">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.34em] text-accent">Unsplash</p>
                  <p className="mt-2 font-serif text-sm">{detail.photographer}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2 md:hidden">
                  <button
                    onClick={() => onNavigate(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    className="photo-detail-inline-nav"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => onNavigate(activeIndex + 1)}
                    disabled={activeIndex >= photos.length - 1}
                    className="photo-detail-inline-nav"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="photo-detail-title-row">
                <h3 className="min-w-0 max-w-[14ch] break-words font-serif text-[clamp(1.85rem,3.25vw,3.8rem)] leading-[0.96] tracking-[-0.055em] text-balance">
                  {detail.title}
                </h3>
                <a
                  href={detail.unsplashUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="photo-detail-unsplash-button photo-detail-unsplash-button-mobile md:hidden"
                >
                  View / Download on Unsplash
                </a>
              </div>
              <p className="mt-5 font-serif text-sm leading-[1.85] text-ink-primary/66 dark:text-bone-primary/66">
                {detail.description}
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4 border-y border-ink-primary/10 py-5 dark:border-bone-primary/10">
                <Stat label="Views" value={formatStats(detail.views)} />
                <Stat label="Downloads" value={formatStats(detail.downloads)} />
                <Stat label="Likes" value={formatStats(detail.likes)} />
              </div>

              <dl className="mt-7 space-y-4 font-serif text-sm text-ink-primary/62 dark:text-bone-primary/62">
                <Meta label="Location" value={detail.location} />
                <Meta label="Published" value={detail.date} />
                <Meta label="Camera" value={cameraLabel(detail)} />
                <Meta label="Aperture" value={detail.exif?.aperture ? `f/${detail.exif.aperture}` : '—'} />
                <Meta label="Focal Length" value={detail.exif?.focal_length || '—'} />
              </dl>

              {detail.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {detail.tags.map((tag) => (
                    <span key={tag} className="bg-ink-primary/[0.06] px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-ink-primary/52 dark:bg-bone-primary/[0.08] dark:text-bone-primary/52">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {(isLoading || error) && (
                <p className="mt-6 font-serif text-xs text-ink-primary/48 dark:text-bone-primary/48">
                  {isLoading ? 'Reading Unsplash metadata...' : error}
                </p>
              )}
            </div>

            <div className="photo-detail-actions hidden flex-wrap items-center gap-4 md:static md:mx-0 md:flex md:max-w-none md:border-t md:border-x-0 md:border-b-0 md:border-ink-primary/10 md:bg-transparent md:px-0 md:pb-0 md:backdrop-blur-none dark:md:border-bone-primary/10">
              <a
                href={detail.unsplashUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="photo-detail-unsplash-button inline-flex min-h-[46px] flex-1 items-center justify-center bg-ink-primary px-5 py-3 text-center font-serif text-sm text-bone-primary transition hover:bg-accent dark:bg-bone-primary dark:text-ink-primary dark:hover:bg-accent dark:hover:text-bone-primary sm:flex-none"
              >
                View / Download on Unsplash
              </a>
            </div>
          </aside>
        </article>
      </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-[9px] uppercase tracking-[0.28em] text-ink-primary/42 dark:text-bone-primary/42">
      {label}
    </dt>
    <dd className="mt-2 font-serif text-lg">{value}</dd>
  </div>
);

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-[100px_1fr] gap-4">
    <dt className="text-[10px] uppercase tracking-[0.24em] text-ink-primary/42 dark:text-bone-primary/42">
      {label}
    </dt>
    <dd>{value}</dd>
  </div>
);

export default PhotoDetail;
