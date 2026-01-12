import React, { useEffect, useState } from 'react';
import { Section } from '../types';
import ScrambleText from './ScrambleText';
import Flipbook from './Flipbook';
import { IMAGES } from '../src/assets/images/imageRegistry';

interface HomeProps {
  setSection: (section: Section) => void;
}

const HERO_IMAGE =
  'https://res.cloudinary.com/duwhuzkib/image/upload/abdullahi-maxamed-Qa31NNMX9es-unsplash_yogf4o';

const Home: React.FC<HomeProps> = ({ setSection }) => {
  const [heroReady, setHeroReady] = useState(false);

  /* preload hero image ONCE */
  useEffect(() => {
    const img = new Image();
    img.src = HERO_IMAGE;
    img.onload = () => setHeroReady(true);
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* BACKGROUND IMAGE */}
        <img
          src={HERO_IMAGE}
          alt="Hero background"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="
            absolute inset-0 w-full h-full
            object-cover object-top
            transition-opacity duration-200
          "
          style={{ opacity: heroReady ? 1 : 0 }}
        />

        {/* CINEMATIC TONE (NO vignette, NO grayscale) */}
        <div className="absolute inset-0 bg-black/25 dark:bg-black/45" />

        {/* EDITORIAL GRID */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="
              h-full max-w-7xl mx-auto
              grid grid-cols-6 md:grid-cols-12
              opacity-[0.05] dark:opacity-[0.07]
            "
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="border-l border-orange-500/25 dark:border-white/10"
              />
            ))}
          </div>
        </div>

        {/* HERO CONTENT */}
        <div
          className="
            relative z-10 text-center max-w-5xl
            transition-opacity duration-200
          "
          style={{ opacity: heroReady ? 1 : 0 }}
        >
          {/* TONAL ANCHOR — editorial, not a card */}
          <div
            className="
              absolute
              inset-x-[-14%]
              top-[42%]
              h-[28%]
              bg-white/55 dark:bg-black/35
              pointer-events-none
            "
          />

          <h1
            className="
              relative
              text-6xl md:text-9xl
              font-serif
              tracking-tight
              leading-[0.95]
              mb-6
              text-black dark:text-bone-primary
            "
          >
            <ScrambleText text="Abdullahi M." delay={10} />
          </h1>

          <p
            className="
              relative
              font-semibold
              text-xs md:text-sm
              tracking-[0.35em]
              uppercase
              text-orange-600 dark:text-orange-500/95
            "
          >
            Seen once. Remembered longer.
          </p>
        </div>
      </section>

      {/* ================= SECTION SEPARATOR ================= */}
      <div className="w-full flex justify-center py-16">
        <div className="w-24 h-px bg-current opacity-20" />
      </div>

      {/* ================= CURRENT EXHIBITION ================= */}
      <section className="py-24 px-6 text-center max-w-3xl mx-auto">
        <span className="text-[10px] tracking-[0.4em] uppercase opacity-60">
          Current Exhibition
        </span>

        <h2 className="text-3xl md:text-4xl font-serif mt-4 mb-4">
          The Pause Between
        </h2>

        <div className="w-12 h-px bg-current mx-auto mb-6 opacity-40" />

        <p className="text-sm opacity-70 leading-relaxed">
          A study of stillness, memory, and the quiet tension between motion and pause.
        </p>

        <button
          onClick={() => setSection('projects:exhibition')}
          className="mt-8 text-xs tracking-[0.4em] uppercase border-b hover:border-accent transition"
        >
          Read Exhibition
        </button>
      </section>
      {/* ================= SECTION SEPARATOR ================= */}
      <div className="w-full flex justify-center py-16">
        <div className="w-24 h-px bg-current opacity-20" />
      </div>

      {/* ================= VIDEO ================= */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <video
          src="https://res.cloudinary.com/duwhuzkib/video/upload/v1768131908/Reshoot_stationary_up_1080p_20260111140_oxixev.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover dark:grayscale"
        />
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
      </section>
      {/* ================= SECTION SEPARATOR ================= */}
      <div className="w-full flex justify-center py-16">
        <div className="w-24 h-px bg-current opacity-20" />
      </div>

      {/* ================= FLIPBOOK ================= */}
      <section className="py-20 px-6">
        <Flipbook pages={IMAGES.home.flipbook} />
      </section>
      {/* ================= SECTION SEPARATOR ================= */}
      <div className="w-full flex justify-center py-16">
        <div className="w-24 h-px bg-current opacity-20" />
      </div>

      {/* ================= NEXT TO PROJECTS ================= */}
      <section className="relative w-full flex flex-col items-center py-16">
        <button
          onClick={() => setSection('projects')}
          className="
            text-xs tracking-[0.5em] uppercase
            text-ink-secondary dark:text-bone-secondary
            border-b border-transparent
            hover:border-accent
            transition-all duration-200 py-1
          "
        >
          Next to Projects
        </button>
      </section>
    </>
  );
};

export default React.memo(Home);