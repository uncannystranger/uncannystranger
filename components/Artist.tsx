import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IMAGES } from '../src/assets/images/imageRegistry';
import { useScrollDirection } from '../src/hooks/useScrollDirection';
import { useDeviceTier } from '../src/hooks/useDeviceTier';

const LIQUID_SPRING = {
  type: 'spring',
  stiffness: 230,
  damping: 20,
  mass: 0.85
};

const Artist: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isPortraitActive, setIsPortraitActive] = useState(false);
  const direction = useScrollDirection();
  const { isLowPower } = useDeviceTier();
  const reduceMotion = shouldReduceMotion || isSmallScreen || isLowPower;
  const revealImmediately = reduceMotion;
  const motionScale = reduceMotion ? 0.5 : 1;
  const isDarkMode =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');
  const getDirectionalY = (baseValue = 30) => {
    const scaled = baseValue * motionScale;
    if (direction === 'down') return scaled;
    if (direction === 'up') return -scaled;
    return scaled;
  };

  const handleFocusLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.setAttribute('data-loaded', 'true');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsSmallScreen(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);
  return (
    <section data-protected="true" data-chapter="Artist" className="protected-content editorial-safe-top relative min-h-screen px-5 pb-32 sm:px-8 md:px-12 lg:px-16">
      <div className="editorial-grid-lines absolute inset-0 pointer-events-none opacity-70" />
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-12 md:grid-cols-12 md:gap-x-8">
        <div className="border-b border-ink-primary/10 pb-10 dark:border-bone-primary/10 md:col-span-7 md:col-start-1">
          <span className="mb-7 block text-[10px] uppercase tracking-[0.5em] text-accent">
            The Artist
          </span>
          <motion.h2
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={LIQUID_SPRING}
            className="max-w-[9ch] break-words font-serif text-[clamp(3.8rem,10vw,9.5rem)] uppercase leading-[0.86] tracking-[-0.075em] text-ink-primary dark:text-bone-primary"
          >
            Abdullahi Maxamed
          </motion.h2>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={LIQUID_SPRING}
          className="editorial-image-mask relative mx-auto aspect-[4/5] w-full cursor-pointer overflow-hidden border border-ink-primary/10 bg-ink-primary/[0.035] dark:border-bone-primary/10 dark:bg-bone-primary/[0.045] md:col-span-4 md:col-start-9 md:row-span-2 md:row-start-1 md:max-h-[78vh]"
          data-cursor="Artist"
          onClick={() => setIsPortraitActive(!isPortraitActive)}
        >
          <img
            src={IMAGES.artist.profile.src}
            alt={IMAGES.artist.profile.alt}
            draggable={false}
            data-loaded="false"
            onLoad={handleFocusLoad}
            className={`w-full h-full object-cover transition-all duration-1000 ease-in-out focus-reveal ${
              isDarkMode
                ? isPortraitActive
                  ? 'grayscale-0'
                  : 'grayscale'
                : isPortraitActive
                ? 'grayscale'
                : 'grayscale-0'
            }`}
          />
          <div className="media-protection-overlay" aria-hidden="true" />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
        </motion.div>

        <div className="flex flex-col gap-12 md:col-span-6 md:col-start-3">
          <motion.div
            initial={revealImmediately ? false : { opacity: 0, y: getDirectionalY(30) }}
            animate={revealImmediately ? { opacity: 1, y: 0 } : undefined}
            whileInView={revealImmediately ? undefined : { opacity: 1, y: 0 }}
            viewport={revealImmediately ? undefined : { once: false, margin: "-10%" }}
            transition={{ ...LIQUID_SPRING, delay: 0.1 }}
          >
            <div className="max-w-2xl space-y-8 font-serif text-base leading-[2.05] text-ink-primary/78 dark:text-bone-primary/78 md:text-lg">
              <p>
                Photography is something I come back to out of love, not obligation. It started as curiosity and slowly became a habit. A way to notice light, movement, and small details that usually pass without attention.
              </p>
              <p>
                I photograph what feels natural to me. Quiet streets, shifting skies, worn spaces, and moments that don’t ask to be dramatic. I’m not chasing perfection or meaning. I’m just documenting what catches my eye and what feels worth remembering.
              </p>
              <p>
                Under the name <span className="text-accent italic">Uncanny Stranger</span>, this space is a personal archive. A place where photography stays simple, honest, and personal.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={revealImmediately ? false : { opacity: 0 }}
            animate={revealImmediately ? { opacity: 1 } : undefined}
            whileInView={revealImmediately ? undefined : { opacity: 1 }}
            viewport={revealImmediately ? undefined : { once: true }}
            transition={reduceMotion ? { delay: 0.2, duration: 0.6 } : { delay: 0.8, duration: 1 }}
            className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-ink-primary/12 pt-8 dark:border-bone-primary/12 sm:grid-cols-3"
          >
            {[
              { label: "Instagram", href: "https://www.instagram.com/uncannystranger" },
  { label: "Pexels", href: "https://www.pexels.com/@uncannystranger" },
  { label: "Unsplash", href: "https://unsplash.com/@uncannystranger" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/uncannystranger/" },
  { label: "Pinterest", href: "https://www.pinterest.com/uncannystranger/" },
  { label: "Facebook", href: "https://www.facebook.com/uncannystranger" },
  { label: "TikTok", href: "https://www.tiktok.com/@uncannystranger" },
  { label: "GitHub", href: "https://github.com/uncannystranger" },
  { label: "Medium", href: "https://uncannystranger.medium.com/abdullahi-maxamed-uncannystranger-c0d61a149d75" },
  { label: "Email", href: "mailto:abdallahmadm@gmail.com" },
            { label: "X", href: "https://x.com/uncannystranger" },
            { label: "Glass.Photo", href: "https://glass.photo/uncannystranger" }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="inline-block border-b border-transparent pb-2 text-[10px] uppercase tracking-[0.32em] text-ink-secondary transition-all duration-500 hover:translate-x-1 hover:border-accent hover:text-accent dark:text-bone-secondary dark:hover:text-accent"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Follow"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Artist;
