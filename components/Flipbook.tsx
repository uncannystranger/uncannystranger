import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface Page {
  id: number;
  src: string;
  title: string;
  caption: string;
}

interface FlipbookProps {
  pages: Page[];
}

/* ================= PERFORMANCE TUNED ================= */
const transition = {
  duration: 0.22, // faster
  ease: [0.25, 1, 0.35, 1],
};

const swipeThreshold = 60; // more responsive swipe

const Flipbook: React.FC<FlipbookProps> = ({ pages }) => {
  const [index, setIndex] = useState<number | null>(null);
  const [colorPage, setColorPage] = useState<number | null>(null);
  const [coverColor, setCoverColor] = useState(false);

  /* ================= IMAGE PRELOAD ================= */
  useEffect(() => {
    if (index === null) return;
    const next = pages[index + 1];
    if (!next) return;

    const img = new Image();
    img.src = next.src;
  }, [index, pages]);

  /* ================= KEYBOARD NAV ================= */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (index === null) return;

      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') close();
    },
    [index]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  /* ================= ACTIONS ================= */
  const open = () => setIndex(0);

  const close = () => {
    setIndex(null);
    setColorPage(null);
    setCoverColor(false);
  };

  const next = () => {
    if (index === null) return;
    if (index < pages.length - 1) setIndex(i => i! + 1);
  };

  const prev = () => {
    if (index !== null && index > 0) setIndex(i => i! - 1);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -swipeThreshold) next();
    if (info.offset.x > swipeThreshold) prev();
  };

  const atEnd = index === pages.length - 1;

  return (
    <section className="relative py-20 flex justify-center">
      <div className="relative w-full max-w-5xl px-4 md:px-6">

        {/* ================= FRAME ================= */}
        <div className="relative bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-5 md:p-8">

          <AnimatePresence mode="wait">

            {/* ================= COVER ================= */}
            {index === null && (
              <motion.div
                key="cover"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={transition}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                {/* Cover Image */}
                <div
                  onClick={() => setCoverColor(true)}
                  className="w-full aspect-[4/5] overflow-hidden cursor-pointer"
                >
                  <img
                    src="https://res.cloudinary.com/duwhuzkib/image/upload/17_kwzxbv"
                    alt="Publication cover"
                    loading="eager"
                    decoding="async"
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      coverColor ? 'grayscale-0' : 'grayscale'
                    }`}
                  />
                </div>

                {/* Cover Text */}
                <div className="flex flex-col gap-5 text-center md:text-left">
                  <span className="text-[10px] tracking-[0.4em] uppercase opacity-60">
                    Publication · 2026
                  </span>

                  <h2 className="text-3xl md:text-5xl font-serif italic">
                    Crowned by Time
                  </h2>

                  <p className="text-sm opacity-70 leading-relaxed">
                    A face emerges beneath layers of leaves and paint, where nature
                    and history overlap. What is seen is not just a portrait, but
                    a quiet inheritance carried forward.
                  </p>

                  <button
                    onClick={open}
                    className="mt-2 self-center md:self-start text-xs tracking-[0.4em] uppercase text-accent border-b border-transparent hover:border-accent transition-all"
                  >
                    Open Publication
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================= PAGE ================= */}
            {index !== null && (
              <motion.figure
                key={index}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={transition}
                className="flex flex-col items-center"
              >
                <div className="w-full max-h-[75vh] aspect-[4/5] overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={pages[index].src}
                    alt={pages[index].title}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    onClick={() => setColorPage(pages[index].id)}
                    className={`w-full h-full object-contain transition-all duration-300 ${
                      colorPage === pages[index].id
                        ? 'grayscale-0'
                        : 'grayscale'
                    }`}
                  />
                </div>

                <figcaption className="mt-5 max-w-md text-center">
                  <h3 className="font-serif italic text-lg mb-1">
                    {pages[index].title}
                  </h3>
                  <p className="text-xs opacity-60 leading-relaxed">
                    {pages[index].caption}
                  </p>
                </figcaption>
              </motion.figure>
            )}
          </AnimatePresence>
        </div>

        {/* ================= CONTROLS ================= */}
        {index !== null && (
          <div className="mt-6 flex justify-between items-center text-xs tracking-[0.3em] uppercase">
            {index > 0 ? (
              <button onClick={prev} className="text-accent hover:opacity-80">
                ← Prev
              </button>
            ) : (
              <span />
            )}

            {!atEnd ? (
              <button onClick={next} className="text-accent hover:opacity-80">
                Next →
              </button>
            ) : (
              <button onClick={close} className="text-accent hover:opacity-80">
                Close Publication
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(Flipbook);