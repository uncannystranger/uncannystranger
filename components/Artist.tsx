
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IMAGES } from '../src/assets/images/imageRegistry';
import { useScrollDirection } from '../src/hooks/useScrollDirection';

const LIQUID_SPRING = {
  type: 'spring',
  stiffness: 120,
  damping: 24,
  mass: 1.2
};

const Artist: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const direction = useScrollDirection();
  const getDirectionalY = (baseValue = 30) => {
    if (direction === 'down') return baseValue;
    if (direction === 'up') return -baseValue;
    return baseValue;
  };
  return (
    <section className="min-h-screen py-32 px-6 md:px-12 flex items-center justify-center">
      <app>
  <title>Artist | Abdullahi Maxamed</title>
  <meta
    name="description"
    content="About Abdullahi Maxamed, known as Uncanny Stranger. A Somali photographer documenting quiet moments, light, movement, and personal visual stories."
  />
  <link
    rel="canonical"
    href="https://uncannystranger.com/artist"
  />
</app>
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50, y: getDirectionalY(20) }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false, margin: "-10%" }}
          transition={LIQUID_SPRING}
          className="aspect-[4/5] md:max-h-[75vh] md:w-auto mx-auto bg-neutral-200 dark:bg-neutral-900 overflow-hidden shadow-2xl relative group cursor-pointer"
          data-cursor="Artist"
        >
          <img
            src={IMAGES.artist.profile.src}
            alt={IMAGES.artist.profile.alt}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
        </motion.div>

        <div className="flex flex-col gap-12">
          <motion.div
            initial={{ opacity: 0, y: getDirectionalY(30) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={{ ...LIQUID_SPRING, delay: 0.1 }}
          >
            <span className="text-[10px] tracking-[0.5em] uppercase text-accent font-semibold mb-6 block">
              The Artist
            </span>

            <h2 className="text-5xl md:text-8xl font-serif italic mb-12 text-ink-primary dark:text-bone-primary leading-tight">
              Abdullahi Maxamed
            </h2>

            <div className="space-y-8 text-lg md:text-xl leading-relaxed font-serif text-ink-primary/80 dark:text-bone-primary/80 max-w-xl">
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-wrap gap-x-12 gap-y-6 pt-8 border-t border-neutral-200 dark:border-neutral-800"
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
            { label: "X", href: "https://x.com/uncannystranger" }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs tracking-[0.3em] uppercase text-ink-secondary dark:text-bone-secondary hover:text-accent dark:hover:text-accent transition-all hover:translate-x-1 inline-block"
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
