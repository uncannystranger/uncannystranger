import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { fetchPhotoDetails, fetchUserPhotos, UnsplashPhoto } from '../src/services/unsplash';
import { loadFrameArticleText } from '../src/data/frameStoryBodyLoader';
import type { FrameArticleText } from '../src/data/frameStoryBodies';
import { cameraLabel, formatStats, formatUnsplashPhoto } from '../src/utils/photoFormatters';
import { FrameEngagement, getFrameEngagement, getFrameEngagementRemote, recordFrameView, toggleFrameLikeRemote } from '../src/utils/frameEngagement';
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, PERSON_NAME, SITE_NAME, SITE_URL } from '../src/seo/siteSeo';
import { isSupabaseConfigured, supabase } from '../src/lib/supabase';
import FrameCard from './FrameCard';

const LIQUID = { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const };

export const FrameArticle = () => {
  const location = useLocation();
  const photoId = location.pathname.split('/').filter(Boolean)[1];
  const shouldReduceMotion = useReducedMotion();
  const [photo, setPhoto] = useState<UnsplashPhoto | null>(null);
  const [related, setRelated] = useState<UnsplashPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [engagement, setEngagement] = useState<FrameEngagement | null>(null);
  const [article, setArticle] = useState<FrameArticleText | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!photoId) return;
      setIsLoading(true);
      setError('');
      setArticle(null);
      try {
        const [detail, list] = await Promise.all([
          fetchPhotoDetails(photoId),
          fetchUserPhotos(1, 8),
        ]);
        if (cancelled) return;
        const formatted = formatUnsplashPhoto(detail);
        setPhoto(formatted);
        setEngagement(getFrameEngagement(formatted.rawId));
        recordFrameView(formatted.rawId).then((next) => {
          if (!cancelled) setEngagement(next);
        });
        setRelated(
          list
            .filter((item) => item.id !== photoId)
            .map(formatUnsplashPhoto)
            .sort((a, b) => b.sortTimestamp - a.sortTimestamp)
            .slice(0, 3)
        );
      } catch (err) {
        if (!cancelled) setError('The frame is quiet for now. Try again later.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [photoId]);

  const storyStats = engagement || (photo ? getFrameEngagement(photo.rawId) : null);

  useEffect(() => {
    if (!photo) return;
    let cancelled = false;
    setArticle(null);
    loadFrameArticleText(photo)
      .then((next) => {
        if (!cancelled) setArticle(next);
      })
      .catch(() => {
        if (!cancelled) setArticle(null);
      });

    return () => {
      cancelled = true;
    };
  }, [photo]);

  useEffect(() => {
    if (!photo) return;
    let cancelled = false;
    const refresh = () => {
      getFrameEngagementRemote(photo.rawId)
        .then((next) => {
          if (!cancelled) setEngagement(next);
        })
        .catch(() => undefined);
    };
    const interval = window.setInterval(refresh, 20000);
    const channel =
      isSupabaseConfigured && supabase
        ? supabase
            .channel(`frame-engagement-${photo.rawId}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'frames' }, refresh)
            .subscribe()
        : null;

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      if (channel && supabase) supabase.removeChannel(channel);
    };
  }, [photo]);

  useEffect(() => {
    if (!photo || !article || typeof document === 'undefined') return;
    const url = `${SITE_URL}/frames/${photo.rawId}`;
    const title = `${photo.title} | Frames | ${SITE_NAME}`;
    const description = photo.intro || photo.description;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setMetaProperty = (property: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }

    const schema = [
      {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: photo.title,
      description,
      image: photo.image || DEFAULT_OG_IMAGE,
      datePublished: new Date(photo.sortTimestamp).toISOString(),
      dateModified: new Date(photo.sortTimestamp).toISOString(),
      author: { '@type': 'Person', name: PERSON_NAME, url: SITE_URL },
      publisher: { '@type': 'Person', name: PERSON_NAME, url: SITE_URL },
      mainEntityOfPage: url,
      articleBody: [
        article.quote,
        article.opening,
        article.story,
        article.observation,
        article.meaning,
        article.closing,
      ].join(' '),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        '@id': `${url}#image`,
        contentUrl: photo.image || DEFAULT_OG_IMAGE,
        url: photo.image || DEFAULT_OG_IMAGE,
        name: photo.title,
        caption: photo.intro || photo.description,
        description,
        creator: { '@type': 'Person', name: PERSON_NAME, url: SITE_URL },
        creditText: PERSON_NAME,
        copyrightNotice: `${PERSON_NAME} / ${SITE_NAME}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Frames', item: `${SITE_URL}/frames` },
          { '@type': 'ListItem', position: 3, name: photo.title, item: url },
        ],
      },
    ];

    let schemaEl = document.querySelector<HTMLScriptElement>('script[data-frame-schema="true"]');
    if (!schemaEl) {
      schemaEl = document.createElement('script');
      schemaEl.type = 'application/ld+json';
      schemaEl.dataset.frameSchema = 'true';
      document.head.appendChild(schemaEl);
    }

    document.title = title;
    canonical.href = url;
    setMeta('description', description);
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaProperty('og:type', 'article');
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:url', url);
    setMetaProperty('og:image', photo.image || DEFAULT_OG_IMAGE);
    setMetaProperty('og:image:alt', photo.alt || DEFAULT_OG_IMAGE_ALT);
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:url', url);
    setMeta('twitter:image', photo.image || DEFAULT_OG_IMAGE);
    setMeta('twitter:image:alt', photo.alt || DEFAULT_OG_IMAGE_ALT);
    schemaEl.textContent = JSON.stringify(schema);
  }, [article, photo]);

  if (isLoading || (photo && !article && !error)) {
    return (
      <section className="editorial-safe-top min-h-screen px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto max-w-[920px] animate-pulse">
          <div className="h-5 w-44 bg-ink-primary/10 dark:bg-bone-primary/10" />
          <div className="mt-8 h-24 w-full bg-ink-primary/10 dark:bg-bone-primary/10" />
          <div className="mt-12 aspect-[1.5] w-full bg-ink-primary/10 dark:bg-bone-primary/10" />
        </div>
      </section>
    );
  }

  if (error || !photo || !article) {
    return (
      <section className="editorial-safe-top min-h-screen px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto max-w-[720px] border-y border-ink-primary/10 py-20 text-center dark:border-bone-primary/10">
          <h1 className="font-serif text-5xl uppercase leading-[0.86] tracking-[-0.06em]">
            The archive is quiet for now.
          </h1>
          <p className="mt-6 font-serif text-sm text-ink-primary/62 dark:text-bone-primary/62">
            {error || 'No frames found yet.'}
          </p>
          <Link to="/frames" className="mt-8 inline-block border-b border-accent pb-2 font-serif text-sm">
            Back to Frames
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article data-chapter="Frames" className="editorial-safe-top relative min-h-screen px-5 pb-32 sm:px-8 md:px-12 lg:px-16">
      <div className="editorial-grid-lines absolute inset-0 pointer-events-none opacity-65" />
      <div className="relative mx-auto max-w-[1180px]">
        <Link to="/frames" className="sticky top-[calc(var(--nav-safe-offset)-34px)] z-20 mb-10 inline-block border-b border-accent bg-beige/80 pb-2 font-serif text-sm text-ink-primary backdrop-blur-sm transition hover:text-accent dark:bg-black/70 dark:text-bone-primary">
          Back to Frames
        </Link>

        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={LIQUID}
          className="grid grid-cols-1 gap-8 border-b border-ink-primary/10 pb-11 dark:border-bone-primary/10 md:grid-cols-12 md:gap-10"
        >
          <div className="md:col-span-12">
            <p className="text-[10px] uppercase tracking-[0.42em] text-accent">
              {photo.category} / Unsplash
            </p>
            <h1 className="mt-7 max-w-[12ch] break-words font-serif text-[clamp(3.7rem,10vw,9.2rem)] uppercase leading-[0.86] tracking-[-0.075em] text-balance">
              {photo.title}
            </h1>
          </div>
          <aside className="grid gap-5 self-end font-serif text-sm leading-[1.9] text-ink-primary/62 dark:text-bone-primary/62 md:col-span-12 md:grid-cols-[minmax(0,560px)_1fr] md:items-end">
            <p className="max-w-xl text-pretty">{photo.intro}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.28em] text-ink-primary/44 dark:text-bone-primary/44 md:justify-end">
              <span>Abdullahi Maxamed</span>
              <span>Story views: {formatStats(storyStats?.views)}</span>
              <span>Story likes: {formatStats(storyStats?.likes)}</span>
              <span>{photo.date}</span>
              <span>{photo.readingTime}</span>
            </div>
          </aside>
        </motion.header>

        <motion.figure
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...LIQUID, delay: 0.1 }}
          className="my-12"
        >
          <img
            src={photo.image}
            srcSet={photo.imageSrcSet}
            sizes="(max-width: 768px) 92vw, 1180px"
            alt={photo.alt}
            loading="eager"
            decoding="async"
            width={photo.width}
            height={photo.height}
            className="mx-auto max-h-[82vh] w-full object-contain"
          />
          <figcaption className="mt-4 text-[10px] uppercase tracking-[0.3em] text-ink-primary/42 dark:text-bone-primary/42">
            Source: Unsplash / {photo.location}
          </figcaption>
        </motion.figure>

        <div className="mx-auto max-w-[760px]">
          <section className="mb-10 flex flex-wrap items-center justify-between gap-4 border-y border-ink-primary/10 py-5 dark:border-bone-primary/10">
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.28em] text-ink-primary/48 dark:text-bone-primary/48">
              <span>Story views: {formatStats(storyStats?.views)}</span>
              <span>Story likes: {formatStats(storyStats?.likes)}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const current = storyStats || getFrameEngagement(photo.rawId);
                const optimistic = {
                  ...current,
                  liked: !current.liked,
                  likes: Math.max(0, current.likes + (current.liked ? -1 : 1)),
                };
                setEngagement(optimistic);
                toggleFrameLikeRemote(photo.rawId).then(setEngagement).catch(() => setEngagement(current));
              }}
              className={`frame-like-button ${storyStats?.liked ? 'is-liked' : ''}`}
              aria-pressed={Boolean(storyStats?.liked)}
            >
              <span aria-hidden="true">♡</span>
              <span>{storyStats?.liked ? 'Appreciated' : 'Appreciate'}</span>
            </button>
          </section>

          <blockquote className="border-l border-accent pl-7 font-serif text-3xl italic leading-[1.35] text-ink-primary dark:text-bone-primary md:text-4xl">
            {article.quote}
          </blockquote>

          <div className="mt-12 space-y-9 font-serif text-[19px] leading-[2.05] text-ink-primary/78 dark:text-bone-primary/78">
            <p>{article.opening}</p>
            <p>{article.story}</p>
            <p>{article.observation}</p>
            <p>{article.meaning}</p>
            <p>{article.closing}</p>
          </div>

          <section className="mt-16 border-y border-ink-primary/10 py-8 dark:border-bone-primary/10">
            <h2 className="text-[10px] uppercase tracking-[0.42em] text-accent">Image Notes</h2>
            <dl className="mt-6 grid grid-cols-1 gap-5 font-serif text-sm text-ink-primary/64 dark:text-bone-primary/64 sm:grid-cols-2">
              <Meta label="Views" value={formatStats(photo.views)} />
              <Meta label="Downloads" value={formatStats(photo.downloads)} />
              <Meta label="Likes" value={formatStats(photo.likes)} />
              <Meta label="Camera" value={cameraLabel(photo)} />
              <Meta label="Published" value={photo.date} />
              <Meta label="Location" value={photo.location} />
            </dl>
          </section>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <div className="mb-12 border-b border-ink-primary/10 pb-6 dark:border-bone-primary/10">
              <p className="text-[10px] uppercase tracking-[0.42em] text-accent">Related Frames</p>
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
              {related.map((item, index) => (
                <FrameCard key={item.id} photo={item} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-[10px] uppercase tracking-[0.28em] text-ink-primary/42 dark:text-bone-primary/42">
      {label}
    </dt>
    <dd className="mt-1">{value}</dd>
  </div>
);

export default FrameArticle;
