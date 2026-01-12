import React, { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';
import { ProjectView, GalleryCategory } from '../types';
import { PHOTOS, EXHIBITIONS } from '../constants';

/* ────────────────────────────────
   Types
──────────────────────────────── */

interface ProjectsProps {
  initialView?: ProjectView;
}

interface GalleryItemProps {
  photo: any;
  index: number;
  onOpen: (items: any[], index: number) => void;
}

interface ExhibitionItemProps {
  photo: any;
  index: number;
  onOpen: (items: any[], index: number) => void;
  autoFocus?: boolean;
}

/* ────────────────────────────────
   Projects
──────────────────────────────── */

const Projects: React.FC<ProjectsProps> = ({
  initialView = 'gallery',
}) => {
  const [view, setView] = useState<ProjectView>(initialView);
  const [category, setCategory] = useState<GalleryCategory>('albums');

  /* Shared ImageView state */
  const [ivOpen, setIvOpen] = useState(false);
  const [ivItems, setIvItems] = useState<any[]>([]);
  const [ivIndex, setIvIndex] = useState(0);

  /* Deep-link: /projects#exhibition */
  useEffect(() => {
    if (window.location.hash === '#exhibition') {
      setView('exhibition');
    }
  }, []);

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  const filteredPhotos = PHOTOS.filter(
    (p) => p.category === category
  );

  const openImage = (items: any[], index: number) => {
    setIvItems(items);
    setIvIndex(index);
    setIvOpen(true);
  };

  return (
    <section className="min-h-screen pt-32 pb-48 px-6 md:px-12">
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
                className={`text-xs tracking-widest uppercase transition-opacity ${
                  view === v
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
                  className={`text-[10px] md:text-xs tracking-widest uppercase whitespace-nowrap px-4 py-2 border rounded-full transition-all ${
                    category === cat
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
                onOpen={(items, index) =>
                  openImage(items, index)
                }
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
            {EXHIBITIONS.map((ex) => (
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
                      autoFocus={i === 0}
                      onOpen={(items, index) =>
                        openImage(items, index)
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ImageView Modal */}
      <AnimatePresence>
        {ivOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIvOpen(false)}
          >
            <motion.img
              src={ivItems[ivIndex]?.url}
              alt=""
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ────────────────────────────────
   Gallery Item
──────────────────────────────── */

const GalleryItem: React.FC<GalleryItemProps> = ({
  photo,
  index,
  onOpen,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className={`relative group aspect-[3/4] cursor-pointer ${
        index % 3 === 1 ? 'md:mt-24' : ''
      }`}
      onClick={() => onOpen([photo], 0)}
    >
      <img
        src={photo.url}
        alt={photo.title}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
      />
    </motion.div>
  );
};

/* ────────────────────────────────
   Exhibition Item
──────────────────────────────── */

const ExhibitionItem: React.FC<ExhibitionItemProps> = ({
  photo,
  index,
  autoFocus,
  onOpen,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex flex-col gap-6 ${
        index % 2 === 0 ? 'items-start' : 'items-end'
      }`}
    >
      <div
        onClick={() => onOpen([photo], 0)}
        className={`cursor-pointer w-full md:w-[80%] aspect-[16/10] overflow-hidden p-4 bg-white dark:bg-neutral-900 shadow-2xl ${
          autoFocus
            ? 'ring-1 ring-neutral-300 dark:ring-neutral-700'
            : ''
        }`}
      >
        <img
          src={photo.url}
          alt={photo.title}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
        />
      </div>

      <div className="max-w-xs px-4">
        <h4 className="text-xl font-serif italic mb-2">
          {photo.title}
        </h4>
        <p className="text-xs opacity-60 leading-relaxed">
          {photo.description}
        </p>
      </div>
    </motion.div>
  );
};

export default Projects;