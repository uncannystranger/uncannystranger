
import React from 'react';
import { motion } from 'framer-motion';
import { IMAGES } from '../src/assets/images/imageRegistry';

const Artist: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-32 px-6">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="aspect-[4/5] bg-neutral-200 dark:bg-neutral-900 overflow-hidden"
        >
          <img
            src={IMAGES.artist.profile.src}
            alt={IMAGES.artist.profile.alt}
            className="w-full h-full object-cover grayscale contrast-125"
          />
        </motion.div>
        
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <span className="text-xs tracking-[0.5em] uppercase text-orange-500 font-medium mb-4 block text-center">
  Abdullahi Maxamed
</span>

            <h2 className="text-5xl md:text-7xl font-serif italic mb-8 text-ink-primary dark:text-bone-primary"></h2>
            <div className="space-y-6 text-base md:text-lg leading-relaxed font-serif text-ink-primary/90 dark:text-bone-primary/90">
              <p>
                Photography is something I come back to out of love, not obligation. It started as curiosity and slowly became a habit. A way to notice light, movement, and small details that usually pass without attention.
              </p>
              <p>
                I photograph what feels natural to me. Quiet streets, shifting skies, worn spaces, and moments that don’t ask to be dramatic. I’m not chasing perfection or meaning. I’m just documenting what catches my eye and what feels worth remembering.
              </p>
              <p>
                Under the name Uncanny Stranger, this space is a personal archive. A place where photography stays simple, honest, and personal.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-8 mt-4"
          >
            <a href="https://instagram.com/uncannystranger" className="text-xs tracking-widest uppercase text-ink-secondary dark:text-bone-secondary hover:text-accent dark:hover:text-accent transition-colors" target="_blank"
  rel="noopener noreferrer" >Instagram</a>
            <a href="https://unsplash.com/uncannystranger" className="text-xs tracking-widest uppercase text-ink-secondary dark:text-bone-secondary hover:text-accent dark:hover:text-accent transition-colors" target="_blank"
  rel="noopener noreferrer" >Unsplash</a>
            <a href="mailto:abdallahmadm@gmail.com" className="text-xs tracking-widest uppercase text-ink-secondary dark:text-bone-secondary hover:text-accent dark:hover:text-accent transition-colors" target="_blank"
  rel="noopener noreferrer" >Email</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Artist;
