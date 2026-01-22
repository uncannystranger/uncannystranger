import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Section } from '../types';
import ScrambleText from './ScrambleText';
import { useScrollDirection } from '../src/hooks/useScrollDirection';
import { IMAGES } from '../src/assets/images/imageRegistry';
import PhotoBooth from './PhotoBooth';
import { LightingWrapper } from './LightingWrapper';

const LIQUID_SPRING = {
  type: 'spring',
  stiffness: 120,
  damping: 24,
  mass: 1.2
};

interface HomeProps {
  setSection: (section: Section) => void;
}

const HERO_IMAGE =
  "https://res.cloudinary.com/duwhuzkib/image/upload/v1768417940/_DSC9555.ARW_fm87ao.png";

const Home = ({ setSection }: HomeProps) => {
  const shouldReduceMotion = useReducedMotion();
  const direction = useScrollDirection();

  const getDirectionalY = (baseValue = 30) => {
    if (direction === 'down') return baseValue;
    if (direction === 'up') return -baseValue;
    return baseValue;
  };
  return (
    <>
    <app>
  <title>Abdullahi Maxamed | Photographer & Visual Artist</title>
  <meta
    name="description"
    content="Official portfolio of Abdullahi Maxamed (Uncanny Stranger), a Somali photographer and visual artist exploring memory, motion, and stillness through cinematic imagery."
  />
  <link rel="canonical" href="https://uncannystranger.com/" />
</app>
      {/* ================= HERO ================= */}
      <section
        className="relative min-h-[110vh] flex items-center justify-center px-6 overflow-hidden"
      >
        {/* PARALLAX BACKGROUND */}
        <motion.div
          className="absolute inset-0 z-0 will-change-transform"
          initial={{ scale: 1.1 }}
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: '0%',
          }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          role="img"
          aria-label="Artist Hero Background"
        />
        {/* CINEMATIC TONE */}
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
        <div className="relative z-10 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="
              absolute
              inset-x-[-14%]
              top-[42%]
              h-[28%]
              bg-white/60 dark:bg-black/40
              pointer-events-none
            "
          />

          <h1
            className="
              relative
              text-7xl md:text-[10rem]
              font-serif
              tracking-tighter
              leading-[0.85]
              mb-8
              text-black dark:text-bone-primary
              mix-blend-difference
              invert dark:invert-0
            "
          >
            <ScrambleText text="Abdullahi M." />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...LIQUID_SPRING, delay: 1.2 }}
            className="
              relative
              font-sans
              text-[10px] md:text-xs
              tracking-[0.5em]
              uppercase
              text-orange-600 dark:text-orange-500
              font-medium
            "
          >
            Seen once. Remembered longer.
          </motion.p>
        </div>
      </section>

      {/* ================= SECTION SEPARATOR ================= */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.5 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        viewport={{ once: false }}
        transition={LIQUID_SPRING}
        className="w-full flex justify-center py-24"
      >
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-neutral-900/20 dark:via-white/20 to-transparent" />
      </motion.div>

      {/* ================= CURRENT EXHIBITION ================= */}
      <section className="py-32 px-6 text-center max-w-4xl mx-auto">
        <LightingWrapper className="py-12 px-8 rounded-lg">
          <motion.span
            initial={{ opacity: 0, y: getDirectionalY(10) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={LIQUID_SPRING}
            className="text-[10px] tracking-[0.6em] uppercase text-accent font-semibold"
          >
            Current Exhibition
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: getDirectionalY(20) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={{ ...LIQUID_SPRING, delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif italic mt-6 mb-8"
          >
            The Pause Between
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false }}
            transition={{ ...LIQUID_SPRING, delay: 0.2 }}
            className="w-24 h-px bg-accent mx-auto mb-10 opacity-60"
          />

          <motion.p
            initial={{ opacity: 0, y: getDirectionalY(15) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={{ ...LIQUID_SPRING, delay: 0.3 }}
            className="text-sm md:text-base opacity-70 leading-relaxed font-serif max-w-2xl mx-auto"
          >
            A study of stillness, memory, and the quiet tension between motion and pause. Captured through the lens of Mogadishu's shifting landscapes.
          </motion.p>

          <motion.button
            onClick={() => setSection('projects:exhibition')}
            whileHover={{ letterSpacing: '0.6em', scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-12 text-[10px] tracking-[0.4em] uppercase border-b border-accent pb-2 hover:text-accent transition-all duration-500"
            data-cursor="Explore"
          >
            Explore Exhibition
          </motion.button>
        </LightingWrapper>
      </section>
      {/* ================= SECTION SEPARATOR ================= */}
      <div className="w-full flex justify-center py-16">
        <div className="w-24 h-px bg-neutral-900/10 dark:bg-white/10" />
      </div>
      {/* ================= VIDEO ================= */}
      <section
        className="relative h-[100svh] w-full overflow-hidden cursor-pointer"
        data-cursor="Play"
      >
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <video
            src="https://res.cloudinary.com/duwhuzkib/video/upload/v1768131908/Reshoot_stationary_up_1080p_20260111140_oxixev.mp4"
            poster="https://res.cloudinary.com/duwhuzkib/video/upload/v1768131908/Reshoot_stationary_up_1080p_20260111140_oxixev.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover dark:grayscale contrast-125"
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />

        {/* Bottom Text */}
        <div className="absolute bottom-0 left-0 w-full z-10 px-12 pb-20">
          <motion.p
            initial={{ opacity: 0, x: -20, y: getDirectionalY(10) }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, margin: "-5%" }}
            transition={LIQUID_SPRING}
            className="text-white text-xs md:text-sm tracking-[0.4em] uppercase opacity-70 mb-4"
          >
            Mogadishu · Motion · Atmosphere
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: getDirectionalY(20) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-5%" }}
            transition={{ ...LIQUID_SPRING, delay: 0.2 }}
            className="text-white text-4xl md:text-7xl font-serif italic leading-tight max-w-4xl"
          >
            Visual stories in constant motion
          </motion.h2>
        </div>
      </section>
      {/* ================= SECTION SEPARATOR ================= */}
      <div className="w-full flex justify-center py-16">
        <div className="w-24 h-px bg-neutral-900/10 dark:bg-white/10" />
      </div>
      {/* ================= PHOTO BOOTH ================= */}
      {/* ================= PHOTO BOOTH ================= */}
      <section className="py-24 px-6">
        <PhotoBooth images={IMAGES.home.flipbook} />
      </section>
      {/* ================= SECTION SEPARATOR ================= */}
      <div className="w-full flex justify-center py-16">
        <div className="w-24 h-px bg-neutral-900/10 dark:bg-white/10" />
      </div>

      {/* ================= NEXT TO PROJECTS ================= */}
      <section className="relative w-full flex flex-col items-center py-16">
        <motion.button
          onClick={() => setSection('projects')}
          whileHover={{ letterSpacing: '0.7em', color: '#FF4D00' }}
          whileTap={{ scale: 0.98 }}
          data-cursor="Projects"
          className="
            text-xs tracking-[0.5em] uppercase
            text-ink-secondary dark:text-bone-secondary
            border-b border-transparent
            hover:border-accent
            transition-all duration-500 py-1
          "
        >
          Next to Projects
        </motion.button>
      </section>
    </>

  );
};

export default React.memo(Home);