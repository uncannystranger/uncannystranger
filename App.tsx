
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Projects from './components/Projects';
import Artist from './components/Artist';
import { Section } from './types';

const App: React.FC = () => {
  const [section, setSection] = useState<Section>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Smooth scroll to top on section change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [section]);

  // Apply theme changes to document and body
  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#121110'; // Deep cinematic dark
      document.body.style.color = '#FAF9F6'; // Soft bone white
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FDFCF0'; // Original beige
      document.body.style.color = '#1C1917'; // Warm ink primary
    }
  };

  // Initialize theme from system preference and listen for changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    // set initial theme
    setIsDarkMode(mq.matches);
    applyTheme(mq.matches);

    // listener to update when OS theme changes
    const onChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      applyTheme(e.matches);
    };

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange);
    } else if (typeof mq.addListener === 'function') {
      // Safari and older browsers
      // @ts-ignore - addListener exists on older MediaQueryList
      mq.addListener(onChange);
    }

    return () => {
      if (typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', onChange);
      } else if (typeof mq.removeListener === 'function') {
        // @ts-ignore - removeListener exists on older MediaQueryList
        mq.removeListener(onChange);
      }
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      applyTheme(next);
      return next;
    });
  };

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white transition-colors duration-500 flex flex-col relative">
      <Navigation 
        currentSection={section} 
        setSection={setSection} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      <main className="relative z-10 flex-grow">
  <AnimatePresence mode="sync" initial={false}>
    {section === 'home' && (
      <motion.div
        key="home"
        initial={{ opacity: 0.96 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <Home setSection={setSection} />
      </motion.div>
    )}

    {(section === 'projects' || section === 'projects:exhibition') && (
      <motion.div
        key="projects"
        initial={{ opacity: 0.96 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <Projects
          initialView={
            section === 'projects:exhibition'
              ? 'exhibition'
              : 'gallery'
          }
        />
      </motion.div>
    )}

    {section === 'artist' && (
      <motion.div
        key="artist"
        initial={{ opacity: 0.96 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <Artist />
      </motion.div>
    )}
  </AnimatePresence>
</main>

      {/* Conditionally rendered footer restricted to Home and Artist sections */}
      {(section === 'home' || section === 'artist') && (
        <footer className="w-full pt-10 pb-28 md:pb-12 text-center select-none flex flex-col items-center gap-6">
          {section === 'home' && (
            <div className="transition-opacity opacity-100 text-orange-500">
              <motion.a 
                href="https://instagram.com/uncannystranger"
                target="_blank"
  rel="noopener noreferrer"
                whileHover={{ scale: 1.1, opacity: 0.7 }}
                whileTap={{ scale: 0.95 }}
                className="transition-opacity opacity-50"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.282.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                </svg>
              </motion.a>
            </div>
          )}
          <span className="text-ink-secondary dark:text-bone-secondary text-[10px] tracking-[0.4em] uppercase opacity-50">
  Made with 🧡 by{' '}
  <span className="text-accent opacity-100">
    Uncanny Stranger
  </span>.
</span>

        </footer>
      )}
    </div>
  );
};

export default App;
