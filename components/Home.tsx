import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Section } from '../types';
import ScrambleText from './ScrambleText';
import { useScrollDirection } from '../src/hooks/useScrollDirection';
import { IMAGES } from '../src/assets/images/imageRegistry';
import { LightingWrapper } from './LightingWrapper';
import { Intertitle } from './Intertitle';
import { useDeviceTier } from '../src/hooks/useDeviceTier';
import { cld } from '../src/utils/cloudinary';

const LazyPhotoBooth = lazy(() => import('./PhotoBooth'));

const LIQUID_SPRING = {
  type: 'spring',
  stiffness: 120,
  damping: 24,
  mass: 1.2
};

interface HomeProps {
  setSection: (section: Section) => void;
}

const HERO_PUBLIC_ID = '_DSC9555.ARW_fm87ao';
const heroImage = (width: number) => cld(HERO_PUBLIC_ID, width);
const HERO_IMAGE = heroImage(2000);
const HERO_IMAGE_SET = [
  `${heroImage(800)} 800w`,
  `${heroImage(1200)} 1200w`,
  `${heroImage(1600)} 1600w`,
  `${heroImage(2000)} 2000w`,
].join(', ');
const EXHIBITION_POSTER = IMAGES.home?.flipbook?.[0]?.src ?? HERO_IMAGE;

const Home = ({ setSection }: HomeProps) => {
  const shouldReduceMotion = useReducedMotion();
  const direction = useScrollDirection();
  const { isLowPower } = useDeviceTier();
  const isDarkMode =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');
  const videoSectionRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const photoBoothRef = useRef<HTMLElement | null>(null);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const behanceRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadBehance, setShouldLoadBehance] = useState(false);
  const [shouldLoadPhotoBooth, setShouldLoadPhotoBooth] = useState(false);
  const motionScale = isLowPower ? 0.7 : 1;
  const liquidSpring = isLowPower
    ? { ...LIQUID_SPRING, stiffness: 100, damping: 26 }
    : LIQUID_SPRING;
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const gridY = useTransform(
    heroProgress,
    [0, 1],
    [0, isLowPower ? -10 : -30]
  );

  const handleFocusLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.setAttribute('data-loaded', 'true');
  };

  const getDirectionalY = (baseValue = 30) => {
    const scaled = baseValue * motionScale;
    if (direction === 'down') return scaled;
    if (direction === 'up') return -scaled;
    return scaled;
  };

  useEffect(() => {
    if (!videoSectionRef.current) return;
    const section = videoSectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVideoActive(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.25,
        rootMargin: '200px 0px',
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isVideoActive) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [isVideoActive]);

  useEffect(() => {
    if (shouldLoadBehance || !behanceRef.current) return;
    const section = behanceRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadBehance(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.2,
        rootMargin: '200px 0px',
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldLoadBehance]);

  useEffect(() => {
    if (shouldLoadPhotoBooth || !photoBoothRef.current) return;
    const section = photoBoothRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadPhotoBooth(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.2,
        rootMargin: '200px 0px',
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldLoadPhotoBooth]);

  const photoBoothFallback = (
    <div className="max-w-7xl mx-auto animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-24 gap-y-40">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-neutral-200/80 dark:bg-neutral-800/80 rounded-sm"
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* ================= HERO ================= */}
      <section
        ref={heroRef}
        data-chapter="Introduction"
        className="relative min-h-[100svh] md:min-h-[110vh] flex items-center justify-center px-6 overflow-hidden"
      >
        {/* PARALLAX BACKGROUND */}
        <motion.img
          src={HERO_IMAGE}
          srcSet={HERO_IMAGE_SET}
          sizes="100vw"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          alt="Artist Hero Background"
          className="absolute inset-0 z-0 w-full h-full object-cover will-change-transform"
          initial={{ scale: isLowPower ? 1.05 : 1.1 }}
          style={{ y: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: isLowPower ? 1.4 : 2, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* CINEMATIC TONE */}
        <div className="absolute inset-0 bg-black/25 dark:bg-black/45" />

        {/* EDITORIAL GRID */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: gridY }}
        >
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
        </motion.div>

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
            transition={{ ...liquidSpring, delay: isLowPower ? 0.8 : 1.2 }}
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
        transition={liquidSpring}
        className="w-full flex justify-center py-24"
      >
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-neutral-900/20 dark:via-white/20 to-transparent" />
      </motion.div>

      <Intertitle
        text="The Frame"
        subtext="A quiet opening sequence"
        className="py-6 md:py-12"
      />

      {/* ================= CURRENT EXHIBITION ================= */}
      <section data-chapter="Exhibition" className="py-32 px-6 text-center max-w-4xl mx-auto">
        <LightingWrapper className="py-12 px-8 rounded-lg">
          <motion.span
            initial={{ opacity: 0, y: getDirectionalY(10) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={liquidSpring}
            className="text-[10px] tracking-[0.6em] uppercase text-accent font-semibold"
          >
            Current Exhibition
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: getDirectionalY(20) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={{ ...liquidSpring, delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif italic mt-6 mb-8"
          >
            The Pause Between
          </motion.h2>
          <div className="placard-meta justify-center">
            <span>Series</span>
            <span>Exhibition</span>
            <span>Ongoing</span>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false }}
            transition={{ ...liquidSpring, delay: 0.2 }}
            className="w-24 h-px bg-accent mx-auto mb-10 opacity-60"
          />

          <motion.p
            initial={{ opacity: 0, y: getDirectionalY(15) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={{ ...liquidSpring, delay: 0.3 }}
            className="text-sm md:text-base opacity-70 leading-relaxed font-serif max-w-2xl mx-auto"
          >
            A study of stillness, memory, and the quiet tension between motion and pause. Captured through the lens of Mogadishu's shifting landscapes.
          </motion.p>
          {/* === Exhibition Preview (Behance Embed) === */}
<motion.div
  ref={behanceRef}
  initial={{ opacity: 0, y: getDirectionalY(20) }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: false, margin: "-10%" }}
  transition={{ ...liquidSpring, delay: 0.4 }}
  className="relative w-full max-w-3xl mx-auto my-14"
>
  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-neutral-900/10 dark:border-white/10 shadow-xl">
    {shouldLoadBehance ? (
      <iframe
        src="https://www.behance.net/embed/project/242731413?ilo0=1"
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        loading="lazy"
        frameBorder="0"
        allow="clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
        title="The Pause Between – Behance Preview"
      />
    ) : (
      <button
        type="button"
        onClick={() => setShouldLoadBehance(true)}
        aria-label="Load exhibition preview"
        data-sound="shutter"
        className="absolute inset-0 group"
      >
        <img
          src={EXHIBITION_POSTER}
          alt="The Pause Between exhibition preview"
          loading="lazy"
          decoding="async"
          data-loaded="false"
          onLoad={handleFocusLoad}
          className={`absolute inset-0 w-full h-full object-cover focus-reveal ${
            isDarkMode ? 'grayscale' : 'grayscale-0'
          }`}
        />
        <div className="absolute inset-0 bg-black/30 dark:bg-black/45" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-5 py-3 border border-white/40 dark:border-white/20 bg-black/40 dark:bg-black/50 backdrop-blur-md text-[10px] tracking-[0.4em] uppercase text-white/90">
            Tap to Enter Exhibition
          </div>
        </div>
      </button>
    )}
  </div>
</motion.div>

          <motion.button
  onClick={() => {
    window.location.hash = 'exhibition';
    setSection('projects:exhibition');
  }}
  whileHover={shouldReduceMotion ? undefined : { letterSpacing: '0.6em', scale: 1.05 }}
  whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
  className="mt-12 text-[10px] tracking-[0.4em] uppercase border-b border-accent pb-2 hover:text-accent transition-all duration-500"
  data-cursor="Explore"
  data-sound="shutter"
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
        ref={videoSectionRef}
        data-chapter="Motion"
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
            ref={videoRef}
            src="https://res.cloudinary.com/duwhuzkib/video/upload/v1768131908/Reshoot_stationary_up_1080p_20260111140_oxixev.mp4"
            poster="https://res.cloudinary.com/duwhuzkib/video/upload/v1768131908/Reshoot_stationary_up_1080p_20260111140_oxixev.jpg"
            autoPlay={isVideoActive}
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
            transition={liquidSpring}
            className="text-white text-xs md:text-sm tracking-[0.4em] uppercase opacity-70 mb-4"
          >
            Mogadishu · Motion · Atmosphere
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: getDirectionalY(20) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-5%" }}
            transition={{ ...liquidSpring, delay: 0.2 }}
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
      <Intertitle
        text="Still Light"
        subtext="Light, gesture, repetition"
        className="py-6 md:py-10"
      />
      {/* ================= PHOTO BOOTH ================= */}
      <section
        ref={photoBoothRef}
        data-chapter="Photo Booth"
        className="py-24 px-6"
      >
        {shouldLoadPhotoBooth ? (
          <Suspense fallback={photoBoothFallback}>
            <LazyPhotoBooth images={IMAGES.home.flipbook} />
          </Suspense>
        ) : (
          photoBoothFallback
        )}
      </section>
      {/* ================= SECTION SEPARATOR ================= */}
      <div className="w-full flex justify-center py-16">
        <div className="w-24 h-px bg-neutral-900/10 dark:bg-white/10" />
      </div>

      {/* ================= NEXT TO PROJECTS ================= */}
      <section data-chapter="Projects" className="relative w-full flex flex-col items-center py-16">
        <motion.button
          onClick={() => setSection('projects')}
          whileHover={shouldReduceMotion ? undefined : { letterSpacing: '0.7em', color: '#FF4D00' }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          data-cursor="Projects"
          data-sound="reel"
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
