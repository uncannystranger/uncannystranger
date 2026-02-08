import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Section } from '../types';

interface NavigationProps {
  currentSection: Section;
  setSection: (section: Section) => void;
  isDarkMode: boolean;
  themeMode: 'system' | 'dark' | 'light';
  toggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  setSection,
  isDarkMode,
  toggleTheme,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== 'undefined' && !!document.fullscreenElement
  );

  /* ------------------------------
     FULLSCREEN TOGGLE (ORIGINAL & FAST)
  ------------------------------ */
  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const navItems: { label: string; id: Section }[] = [
    { label: 'Home', id: 'home' },
    { label: 'Projects', id: 'projects' },
    { label: 'Artist', id: 'artist' },
  ];

  /* ------------------------------
     NAV LINK (NO SECTION ANIMATION)
  ------------------------------ */
  const NavLink = ({ item }: { item: { label: string; id: Section } }) => (
    <motion.button
      onClick={() => {
        setSection(item.id);
        if (item.id === 'home') navigate('/');
        if (item.id === 'projects') navigate('/projects');
        if (item.id === 'artist') navigate('/artist');
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      data-cursor={item.label}
      className="relative group py-1.5 px-1 focus:outline-none"
    >
      <span
        className={`text-sm md:text-base tracking-[0.12em] capitalize font-serif ${
          currentSection === item.id
            ? 'opacity-100 font-semibold'
            : 'opacity-60 md:text-orange-500/80 dark:md:text-white/40'
        }`}
      >
        {item.label}
      </span>

      {/* INSTANT ORANGE UNDERLINE (NO ANIMATION) */}
      {currentSection === item.id && (
        <div className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-orange-500" />
      )}
    </motion.button>
  );

  const IconButton = ({
    onClick,
    label,
    children,
  }: {
    onClick: () => void;
    label: string;
    children: React.ReactNode;
  }) => (
    <motion.button
      onClick={onClick}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
      data-cursor={label}
      aria-label={label}
      className="relative p-2 opacity-70 hover:opacity-100 transition-all duration-200 hover:text-orange-500 md:text-neutral-900 md:dark:text-white"
    >
      {children}
    </motion.button>
  );

  /* ------------------------------
     THEME TOGGLE (UNCHANGED)
  ------------------------------ */
  const ThemeToggle = () => (
    <IconButton onClick={toggleTheme} label="Theme">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDarkMode ? 'dark' : 'light'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {isDarkMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
            </svg>
          )}
        </motion.div>
      </AnimatePresence>
    </IconButton>
  );

  const FullscreenToggle = () => (
    <IconButton onClick={toggleFullscreen} label="Fullscreen">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        {isFullscreen ? (
          <path d="M9 14H5v5h5M15 10h4V5h-5" />
        ) : (
          <path d="M9 3H5v4M15 21h4v-4M5 21v-4M19 3v4" />
        )}
      </svg>
    </IconButton>
  );

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-24 px-12 items-center justify-between">
        <div className="relative flex gap-16">
          {navItems.map((item) => (
            <React.Fragment key={item.id}>
              <NavLink item={item} />
            </React.Fragment>
          ))}
        </div>

        <div className="relative flex items-center gap-6">
          <FullscreenToggle />
          <ThemeToggle />
          <div className="text-[10px] tracking-[0.5em] uppercase md:text-neutral-700 md:dark:text-white/50">
            Mogadishu, SO
          </div>
        </div>
      </nav>

      {/* ================= MOBILE ================= */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
        <div className="bg-white/25 dark:bg-black/40 backdrop-blur-xl border border-white/15 dark:border-white/10 rounded-[2rem] px-6 py-3 flex items-center justify-between shadow-[0_16px_32px_rgba(0,0,0,0.25)]">
          {navItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <NavLink item={item} />
              {index < navItems.length - 1 && (
                <div className="w-px h-4 bg-orange-500/50 mx-1" />
              )}
            </React.Fragment>
          ))}
          <div className="w-px h-4 bg-orange-500/50 mx-1" />
          <FullscreenToggle />
          <ThemeToggle />
        </div>
      </nav>
    </>
  );
};

export default Navigation;