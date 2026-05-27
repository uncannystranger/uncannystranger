import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ProjectView } from '../types';
import {
  fetchPinnedPhotos,
  fetchUserPhotoPage,
  PINNED_PHOTO_IDS,
  UnsplashApiPhoto,
  UnsplashArchiveStatus,
  UnsplashPhoto,
} from '../src/services/unsplash';
import { formatUnsplashPhoto } from '../src/utils/photoFormatters';
import EditorialPhotoGrid from './EditorialPhotoGrid';
import PhotoDetail from './PhotoDetail';
import FrameCard from './FrameCard';

interface ProjectsProps {
  initialView?: ProjectView;
}

type GalleryFilter =
  | 'All'
  | 'Portrait'
  | 'Street'
  | 'Women'
  | 'Mogadishu'
  | 'Black & White'
  | 'Memory'
  | 'Light'
  | 'Frames';

const FILTERS: GalleryFilter[] = [
  'All',
  'Portrait',
  'Street',
  'Women',
  'Mogadishu',
  'Black & White',
  'Memory',
  'Light',
  'Frames',
];

const VIEW_LABELS: Array<{ id: ProjectView; label: string }> = [
  { id: 'gallery', label: 'Gallery' },
  { id: 'exhibition', label: 'Exhibition' },
  { id: 'frames', label: 'Frames' },
];

const newestFirst = (items: UnsplashPhoto[]) =>
  [...items].sort((a, b) => b.sortTimestamp - a.sortTimestamp);

const uniqueByRawId = (items: UnsplashPhoto[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.rawId)) return false;
    seen.add(item.rawId);
    return true;
  });
};

const PINNED_PHOTO_ID_SET = new Set<string>(PINNED_PHOTO_IDS);

const orderPinnedFirst = (items: UnsplashPhoto[]) => {
  const unique = uniqueByRawId(items);
  const byId = new Map(unique.map((item) => [item.rawId, item]));
  const pinned = PINNED_PHOTO_IDS.flatMap((id) => {
    const photo = byId.get(id);
    return photo ? [photo] : [];
  });
  const rest = newestFirst(unique.filter((item) => !PINNED_PHOTO_ID_SET.has(item.rawId)));
  return [...pinned, ...rest];
};

const formatAndOrderPhotos = (photos: UnsplashApiPhoto[]) =>
  orderPinnedFirst(photos.map(formatUnsplashPhoto));

const INITIAL_RENDER_LIMIT = 24;
const RENDER_BATCH_SIZE = 24;

const archiveErrorMessage = (status: UnsplashArchiveStatus, error?: string) => {
  if (status === 'missing-config') return 'Photo service is not configured.';
  if (status === 'rate-limited') return 'Unsplash is resting for a moment. Try again later.';
  if (status === 'empty') return 'No photos found.';
  return error || 'Failed to load archive.';
};

const Projects = ({ initialView = 'gallery' }: ProjectsProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [view, setView] = useState<ProjectView>(initialView);
  const [filter, setFilter] = useState<GalleryFilter>('All');
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [archiveStatus, setArchiveStatus] = useState<UnsplashArchiveStatus | 'loading'>('loading');
  const [archiveWarning, setArchiveWarning] = useState('');
  const [renderLimit, setRenderLimit] = useState(INITIAL_RENDER_LIMIT);
  const [nextPage, setNextPage] = useState(2);
  const [hasMore, setHasMore] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');
      setArchiveWarning('');
      setArchiveStatus('loading');
      setRenderLimit(INITIAL_RENDER_LIMIT);
      setNextPage(2);
      try {
        const category = filter !== 'All' && filter !== 'Frames' ? filter : undefined;
        const [firstPage, pinnedPhotos] = await Promise.all([
          fetchUserPhotoPage(1, INITIAL_RENDER_LIMIT, category),
          filter === 'All' || filter === 'Frames' ? fetchPinnedPhotos() : Promise.resolve([]),
        ]);

        if (cancelled) return;

        const formatted = formatAndOrderPhotos([...pinnedPhotos, ...firstPage.photos]);
        setPhotos(formatted);
        setHasMore(firstPage.hasMore);
        setArchiveStatus(formatted.length ? (firstPage.hasMore ? 'partial' : 'complete') : 'empty');
      } catch {
        if (!cancelled) {
          setArchiveStatus('network-error');
          setError('Failed to load archive.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const filteredPhotos = useMemo(() => {
    if (filter === 'All') return photos;
    if (filter === 'Frames') return photos.slice(0, Math.max(6, Math.ceil(photos.length / 2)));
    return photos.filter((photo) => photo.category === filter);
  }, [filter, photos]);

  useEffect(() => {
    setRenderLimit(INITIAL_RENDER_LIMIT);
    setActiveIndex(-1);
  }, [filter, view]);

  useEffect(() => {
    if ((view !== 'gallery' && view !== 'frames') || (!hasMore && renderLimit >= filteredPhotos.length)) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry?.isIntersecting || isLoadingMore) return;
        if (renderLimit < filteredPhotos.length) {
          setRenderLimit((current) => Math.min(current + RENDER_BATCH_SIZE, filteredPhotos.length));
          return;
        }
        if (!hasMore) return;
        setIsLoadingMore(true);
        try {
          const category = filter !== 'All' && filter !== 'Frames' ? filter : undefined;
          const page = await fetchUserPhotoPage(nextPage, RENDER_BATCH_SIZE, category);
          setPhotos((current) => orderPinnedFirst([...current, ...page.photos.map(formatUnsplashPhoto)]));
          setNextPage((current) => current + 1);
          setHasMore(page.hasMore);
          setRenderLimit((current) => current + page.photos.length);
          setArchiveStatus(page.hasMore ? 'partial' : 'complete');
        } catch {
          setArchiveWarning('More photos could not be loaded.');
          setHasMore(false);
        } finally {
          setIsLoadingMore(false);
        }
      },
      { rootMargin: '900px 0px 900px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [filter, filteredPhotos.length, hasMore, isLoadingMore, nextPage, renderLimit, view]);

  const exhibitionPhotos = useMemo(() => filteredPhotos.slice(0, 9), [filteredPhotos]);
  const framePhotos = useMemo(() => filteredPhotos.slice(0, renderLimit), [filteredPhotos, renderLimit]);
  const galleryPhotos = useMemo(() => filteredPhotos.slice(0, renderLimit), [filteredPhotos, renderLimit]);
  const activePhoto = activeIndex >= 0 ? filteredPhotos[activeIndex] : null;
  const canLoadMore =
    (view === 'gallery' || view === 'frames') && (hasMore || renderLimit < filteredPhotos.length);

  const retry = async () => {
    setError('');
    setArchiveWarning('');
    setArchiveStatus('loading');
    setIsLoading(true);
    setRenderLimit(INITIAL_RENDER_LIMIT);
    try {
      const category = filter !== 'All' && filter !== 'Frames' ? filter : undefined;
      const [pinnedPhotos, result] = await Promise.all([
        filter === 'All' || filter === 'Frames' ? fetchPinnedPhotos() : Promise.resolve([]),
        fetchUserPhotoPage(1, INITIAL_RENDER_LIMIT, category),
      ]);
      const formatted = formatAndOrderPhotos([...pinnedPhotos, ...result.photos]);
      setPhotos(formatted);
      setNextPage(2);
      setHasMore(result.hasMore);
      setArchiveStatus(formatted.length ? (result.hasMore ? 'partial' : 'complete') : 'empty');
    } catch {
      setArchiveStatus('network-error');
      setError('Failed to load archive.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const setViewAndUrl = (nextView: ProjectView) => {
    setView(nextView);
    const url =
      nextView === 'frames'
        ? '/frames'
        : nextView === 'gallery'
        ? '/projects'
        : '/projects#exhibition';
    window.history.replaceState(null, '', url);
  };

  const archiveMessage = useMemo(() => {
    if (isLoading) return 'Loading archive...';
    if (isLoadingMore) return 'Loading more photos...';
    if (error) return 'Failed to load archive';
    if (filteredPhotos.length === 0 && archiveStatus === 'empty') return 'No photos found';
    if (archiveWarning) return archiveWarning;
    if (canLoadMore) return 'Scroll for more frames...';
    return archiveStatus === 'complete' ? 'Gallery loaded' : '';
  }, [archiveStatus, archiveWarning, canLoadMore, error, filteredPhotos.length, isLoading, isLoadingMore]);

  return (
    <section data-protected="true" data-chapter={view === 'frames' ? 'Frames' : 'Projects'} className="protected-content editorial-safe-top relative min-h-screen px-5 pb-32 sm:px-8 md:px-12 lg:px-16">
      <div className="editorial-grid-lines absolute inset-0 pointer-events-none opacity-70" />

      <motion.header
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto mb-10 grid max-w-[1440px] grid-cols-1 gap-8 border-b border-ink-primary/10 pb-9 dark:border-bone-primary/10 md:mb-14 md:grid-cols-12 md:gap-x-10 md:pb-11"
      >
        <div className="md:col-span-7">
          <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-accent">Unsplash Archive</p>
          <h1 className="max-w-[12ch] break-words font-serif text-[clamp(3.8rem,10vw,8.6rem)] uppercase leading-[0.88] tracking-[-0.07em] text-balance">
            {view === 'frames' ? 'Frames' : 'Projects'}
          </h1>
        </div>

        <div className="flex flex-col justify-end gap-6 md:col-span-5 md:items-end">
          <p className="max-w-md font-serif text-sm leading-[1.9] text-ink-primary/62 dark:text-bone-primary/62 md:text-right">
            {view === 'frames'
              ? 'Stories shaped by silence, light, and memory.'
              : 'Images that remember what the city forgets.'}
          </p>

          {view !== 'frames' && (
            <Link
              to="/frames"
              onClick={() => setViewAndUrl('frames')}
              className="group max-w-sm border-l border-accent/80 py-1 pl-5 text-left md:text-right md:border-l-0 md:border-r md:pl-0 md:pr-5"
            >
              <span className="block text-[10px] uppercase tracking-[0.42em] text-accent">Frames</span>
              <span className="mt-2 block font-serif text-xl leading-tight text-ink-primary transition-colors group-hover:text-accent dark:text-bone-primary">
                Where photographs become essays.
              </span>
            </Link>
          )}

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {VIEW_LABELS.map((item) => (
              <button
                key={item.id}
                onClick={() => setViewAndUrl(item.id)}
                className={`font-serif text-sm transition-all duration-200 ${
                  view === item.id
                    ? 'border-b border-accent pb-2 text-ink-primary dark:text-bone-primary'
                    : 'pb-2 text-ink-primary/45 hover:text-accent dark:text-bone-primary/45'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex max-w-full gap-x-5 gap-y-4 overflow-x-auto no-scrollbar md:flex-wrap md:justify-end md:overflow-visible">
            {FILTERS.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`whitespace-nowrap border-b pb-2 text-[10px] uppercase tracking-[0.34em] transition-all duration-200 ${
                  filter === item
                    ? 'border-accent text-accent'
                    : 'border-transparent text-ink-primary/45 hover:border-ink-primary/25 hover:text-ink-primary dark:text-bone-primary/45 dark:hover:border-bone-primary/25 dark:hover:text-bone-primary'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      <div className="relative mx-auto max-w-[1440px]">
        <div className="mb-9 flex flex-wrap gap-x-6 gap-y-3 border-b border-ink-primary/10 pb-6 text-[10px] uppercase tracking-[0.32em] text-ink-primary/45 dark:border-bone-primary/10 dark:text-bone-primary/45">
          <span>{photos.length} Unsplash Frames</span>
          <span>{filteredPhotos.length} Showing</span>
          <span>Unsplash-only Archive</span>
        </div>

        {error && (
          <div className="mb-14 border-y border-ink-primary/10 py-14 text-center dark:border-bone-primary/10">
            <p className="font-serif text-4xl uppercase leading-[0.86] tracking-[-0.055em]">
              The archive is quiet for now.
            </p>
            <p className="mx-auto mt-5 max-w-md font-serif text-sm leading-[2] text-ink-primary/62 dark:text-bone-primary/62">
              {error}
            </p>
            <button onClick={retry} className="mt-7 border-b border-accent pb-2 font-serif text-sm">
              Retry
            </button>
          </div>
        )}

        {isLoading && (
          <div>
            <p className="mb-8 font-serif text-sm text-ink-primary/45 dark:text-bone-primary/45">
              {archiveMessage}
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="editorial-skeleton-frame aspect-[4/5]">
                  <span />
                  <span />
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && !error && filteredPhotos.length === 0 && (
          <div className="border-y border-ink-primary/10 py-20 text-center dark:border-bone-primary/10">
            <p className="font-serif text-4xl uppercase leading-[0.86] tracking-[-0.055em]">No photos found.</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isLoading && !error && filteredPhotos.length > 0 && view === 'gallery' && (
            <motion.div key="gallery" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}>
              <EditorialPhotoGrid photos={galleryPhotos} onOpen={(photo) => setActiveIndex(filteredPhotos.findIndex((item) => item.rawId === photo.rawId))} />
            </motion.div>
          )}

          {!isLoading && !error && filteredPhotos.length > 0 && view === 'exhibition' && (
            <motion.div key="exhibition" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }} className="space-y-16 md:space-y-20">
              {exhibitionPhotos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setActiveIndex(filteredPhotos.findIndex((item) => item.id === photo.id))}
                  className={`group grid w-full grid-cols-1 gap-6 border-b border-ink-primary/10 pb-12 text-left dark:border-bone-primary/10 md:grid-cols-12 md:items-end ${
                    index % 2 === 0 ? '' : 'md:text-right'
                  }`}
                >
                  <div className={`editorial-image-mask overflow-hidden bg-ink-primary/[0.035] dark:bg-bone-primary/[0.045] ${index % 2 === 0 ? 'md:col-span-8' : 'md:col-span-8 md:col-start-5'}`}>
                    <img
                      src={photo.imageSmall}
                      srcSet={photo.imageSmallSrcSet}
                      sizes="(max-width: 768px) 92vw, 62vw"
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                      width={photo.width}
                      height={photo.height}
                      className="max-h-[74vh] w-full object-contain grayscale transition-[filter,transform,opacity] duration-200 group-hover:scale-[1.01] group-hover:grayscale-0"
                    />
                  </div>
                  <div className={`${index % 2 === 0 ? 'md:col-span-4' : 'md:col-span-4 md:col-start-1 md:row-start-1'}`}>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-accent">Exhibition / {String(index + 1).padStart(2, '0')}</p>
                    <h2 className="mt-5 break-words font-serif text-[clamp(2.4rem,5.4vw,5.8rem)] uppercase leading-[0.88] tracking-[-0.065em] text-balance">
                      {photo.title}
                    </h2>
                    <p className="mt-5 font-serif text-sm leading-[2] text-ink-primary/62 dark:text-bone-primary/62">
                      {photo.intro}
                    </p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {!isLoading && !error && filteredPhotos.length > 0 && view === 'frames' && (
            <motion.div key="frames" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }} className="grid grid-cols-1 gap-12 md:grid-cols-12">
              {framePhotos.map((photo, index) => (
                <FrameCard key={photo.id} photo={photo} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && !error && canLoadMore && (
          <div ref={loadMoreRef} className="h-16 w-full" aria-hidden="true" />
        )}

        {!isLoading && !error && archiveMessage && (
          <div className="mt-24 flex justify-center">
            <p className="border-b border-accent/45 pb-3 font-serif text-sm text-ink-primary/45 dark:text-bone-primary/45">
              {archiveMessage}
            </p>
          </div>
        )}
      </div>

      <PhotoDetail
        photo={activePhoto}
        photos={filteredPhotos}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(-1)}
        onNavigate={(nextIndex) => {
          if (nextIndex >= 0 && nextIndex < filteredPhotos.length) setActiveIndex(nextIndex);
        }}
      />
    </section>
  );
};

export default Projects;
