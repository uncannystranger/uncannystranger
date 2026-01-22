import React, { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion
} from 'framer-motion';
import { ProjectView, GalleryCategory } from '../types';
import { PHOTOS, EXHIBITIONS } from '../constants';
import { useScrollDirection } from '../src/hooks/useScrollDirection';
import { LightingWrapper } from './LightingWrapper';

const LIQUID_SPRING = {
  type: 'spring',
  stiffness: 120,
  damping: 24,
  mass: 1.2
};

/* ────────────────────────────────
   Types
──────────────────────────────── */

interface ProjectsProps {
  initialView?: ProjectView;
}

interface GalleryItemProps {
  photo: any;
  index: number;
  setIsDimmed: (val: boolean) => void;
}

interface ExhibitionItemProps {
  photo: any;
  index: number;
  autoFocus?: boolean;
  setIsDimmed: (val: boolean) => void;
}

/* ────────────────────────────────
   Projects
──────────────────────────────── */

const Projects: React.FC<ProjectsProps> = ({
  initialView = 'gallery',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const direction = useScrollDirection();
  const getDirectionalY = (baseValue = 30) => {
    if (direction === 'down') return baseValue;
    if (direction === 'up') return -baseValue;
    return baseValue;
  };

  const [view, setView] = useState<ProjectView>(initialView);
  const [category, setCategory] = useState<GalleryCategory>('albums');

  /* Lighting & Dimming state */
  const [isDimmed, setIsDimmed] = useState(false);

  /* Deep-link: /projects#exhibition */
  useEffect(() => {
    if (window.location.hash === '#exhibition') {
      setView('exhibition');
    }
  }, []);

  const filteredPhotos = PHOTOS.filter(
    (p) => p.category === category
  );

  return (
    <section className="min-h-screen pt-32 pb-48 px-6 md:px-12">
      <app>
  <title>Projects | Abdullahi Maxamed</title>
  <meta
    name="description"
    content="Photography projects and exhibitions by Abdullahi Maxamed (Uncanny Stranger), including curated galleries, visual journals, and cinematic exhibitions."
  />
  <link rel="canonical" href="https://uncannystranger.com/projects" />
</app>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.215, 0.61, 0.355, 1] }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-24 max-w-7xl mx-auto"
      >
        <div>
          <h2 className="text-4xl md:text-6xl font-serif italic mb-4">
            Projects
          </h2>

          <div className="flex gap-6">
            {(['gallery', 'exhibition'] as ProjectView[]).map((v) => (
              <button
                key={v}
                onClick={() => {
                  setView(v);
                  window.history.replaceState(
                    null,
                    '',
                    v === 'exhibition'
                      ? '#exhibition'
                      : '#'
                  );
                }}
                className={`text-xs tracking-widest uppercase transition-opacity ${view === v
                  ? 'opacity-100 underline underline-offset-8'
                  : 'opacity-40 hover:opacity-100'
                  }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === 'gallery' && (
          <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            {(['albums', 'collections', 'journal'] as GalleryCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-[10px] md:text-xs tracking-widest uppercase whitespace-nowrap px-4 py-2 border rounded-full transition-all ${category === cat
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent'
                    : 'border-neutral-200 dark:border-neutral-800 opacity-60'
                    }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        )}
      </motion.div>

      {/* Environmental Dimming Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 z-0 pointer-events-none mix-blend-multiply transition-opacity duration-1000"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDimmed ? 1 : 0 }}
      />

      {/* Content */}
      <AnimatePresence mode="wait">
        {view === 'gallery' ? (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto"
          >
            {filteredPhotos.map((photo, i) => (
              <GalleryItem
                key={photo.id}
                photo={photo}
                index={i}
                setIsDimmed={setIsDimmed}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="exhibition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col gap-32 max-w-4xl mx-auto"
          >
            {EXHIBITIONS.map((ex, exIndex) => (
              <div key={ex.id}>
                <h3 className="text-3xl md:text-5xl font-serif italic mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  {ex.title}
                </h3>

                <div className="flex flex-col gap-24">
                  {ex.photos.map((p, i) => (
  <ExhibitionItem
    key={p.id}
    photo={p}
    index={i}
    exhibitionIndex={exIndex}
    autoFocus={i === 0}
    setIsDimmed={setIsDimmed}
  />
))}
                </div>
              </div>
            ))}

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ────────────────────────────────
   Gallery Item
──────────────────────────────── */

interface GalleryItemProps {
  photo: any;
  index: number;
  setIsDimmed: (val: boolean) => void;
}


const GalleryItem: React.FC<GalleryItemProps> = ({
  photo,
  index,
  setIsDimmed,
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
       
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-10%" }}
      onMouseEnter={() => setIsDimmed(true)}
      onMouseLeave={() => setIsDimmed(false)}
      transition={{
        ...LIQUID_SPRING,
        delay: (index % 3) * 0.1
      }}
      className={`relative group aspect-[3/4] cursor-pointer md:max-h-[70vh] md:w-auto mx-auto ${index % 3 === 1 ? 'md:mt-32' : ''}`}
      onClick={() => setIsActive(!isActive)}
    >
      <LightingWrapper className="w-full h-full rounded-sm">
        <div className="w-full h-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <motion.img
            src={photo.url}
            alt={photo.title}
            decoding="async"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full h-full object-cover transition-all duration-1000 will-change-transform ${isActive ? 'grayscale-0 brightness-100' : 'grayscale brightness-90 group-hover:grayscale-[0.5] group-hover:brightness-95'}`}
          />
        </div>
      </LightingWrapper>
    </motion.div>
  );
};
/* ────────────────────────────────
   Exhibition Item
──────────────────────────────── */

interface ExhibitionItemProps {
  photo: any;
  index: number;
  exhibitionIndex: number;
  autoFocus?: boolean;
  setIsDimmed: (val: boolean) => void;
}

const ExhibitionItem: React.FC<ExhibitionItemProps> = ({
  photo,
  index,
  exhibitionIndex,
  autoFocus,
  setIsDimmed,
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-10%" }}
      onMouseEnter={() => setIsDimmed(true)}
      onMouseLeave={() => setIsDimmed(false)}
      transition={LIQUID_SPRING}
      className={`flex flex-col gap-10 ${index % 2 === 0 ? 'items-start' : 'items-end'
        }`}
    >
      <motion.div
        onClick={() => setIsActive(!isActive)}
        whileHover={{ y: -10 }}
        className={`cursor-pointer w-full md:w-[85%] aspect-[16/10] md:max-h-[75vh] mx-auto bg-white dark:bg-[#1a1918] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] group halo-glow ${autoFocus
          ? 'ring-1 ring-accent/20'
          : ''
          }`}
      >
        <LightingWrapper className="w-full h-full p-6">
          {exhibitionIndex === 0 && index === 0 && (
  <a
    href="https://www.behance.net/gallery/233362335/Between-Shadows-and-Glow"
    target="_blank"
    rel="noopener noreferrer"
    className="absolute inset-6 z-20 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-black/60 backdrop-blur-md transition hover:bg-white/90 dark:hover:bg-black/80"
  >
    <div className="text-center">
      <p className="text-xs uppercase tracking-widest opacity-60 mb-2">
        Continue Exhibition
      </p>
      <p className="text-lg md:text-xl font-serif italic">
        Between Shadows and Glow
      </p>
    </div>
  </a>
)}
          <div className="w-full h-full overflow-hidden relative">
            <motion.img
              src={photo.url}
              alt={photo.title}
              decoding="async"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full h-full object-cover transition-all duration-1000 will-change-transform ${isActive ? 'grayscale-0 brightness-100' : 'grayscale brightness-90 group-hover:grayscale-[0.5] group-hover:brightness-95'}`}
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none" />
          </div>
        </LightingWrapper>
      </motion.div>

      <div className={`max-w-md px-4 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
        <motion.h4
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-serif italic mb-4 text-ink-primary dark:text-bone-primary"
        >
          {photo.title}
        </motion.h4>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs md:text-sm opacity-60 leading-relaxed font-serif"
        >
          {photo.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Projects;