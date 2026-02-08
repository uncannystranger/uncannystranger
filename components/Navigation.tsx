import React, { useCallback, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Section } from '../types';



interface NavigationProps {
  currentSection: Section;
  setSection: (section: Section) => void;
  isDarkMode: boolean;
  themeMode: 'system' | 'dark' | 'light';
  toggleTheme: () => void;
}

const LIQUID_SPRING = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
  mass: 0.8,
};

const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  setSection,
  isDarkMode,
  toggleTheme,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  if (location.pathname === '/') setSection('home');
  if (location.pathname === '/projects') setSection('projects');
  if (location.pathname === '/artist') setSection('artist');
}, [location.pathname, setSection]);

  const fullscreenRef = useRef<HTMLDivElement | null>(null);

  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches;

  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== 'undefined' && !!document.fullscreenElement
  );

  /* ------------------------------
     FULLSCREEN TOGGLE (FIXED)
  ------------------------------ */
  const toggleFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;

    const target = isMobile
      ? fullscreenRef.current
      : document.documentElement;

    if (!target) return;

    try {
      if (!document.fullscreenElement) {
        await target.requestFullscreen();

        if (isMobile && 'orientation' in screen) {
  const orientation = screen.orientation as ScreenOrientation & {
    lock?: (orientation: 'portrait' | 'landscape') => Promise<void>;
  };

  if (typeof orientation.lock === 'function') {
    const current =
      window.innerWidth > window.innerHeight
        ? 'landscape'
        : 'portrait';

    await orientation.lock(current);
  }
}

        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();

        if (isMobile && 'orientation' in screen) {
  const orientation = screen.orientation as ScreenOrientation & {
    unlock?: () => void;
  };

  if (typeof orientation.unlock === 'function') {
    orientation.unlock();
  }
}

        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen error:', err);
    }
  }, [isMobile]);

  /* ------------------------------
     FULLSCREEN STATE SYNC
  ------------------------------ */
  useEffect(() => {
    const handleChange = () =>
      setIsFullscreen(!!document.fullscreenElement);

    document.addEventListener('fullscreenchange', handleChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const navItems: { label: string; id: Section }[] = [
    { label: 'Home', id: 'home' },
    { label: 'Projects', id: 'projects' },
    { label: 'Artist', id: 'artist' },
  ];

  const NavLink = ({ item }: { item: { label: string; id: Section } }) => (
    <motion.button
      onClick={() => {
        setSection(item.id);
        if (item.id === 'home') navigate('/');
        if (item.id === 'projects') navigate('/projects');
        if (item.id === 'artist') navigate('/artist');
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      data-cursor={item.label}
      className="relative group py-1.5 px-1 focus:outline-none"
    >
      <span
        className={`text-sm md:text-base tracking-[0.12em] capitalize transition-all duration-500 font-serif ${
          currentSection === item.id
            ? 'opacity-100 font-semibold md:text-black-500'
            : 'opacity-60 md:text-orange-500/80 md:hover:text-orange-500 dark:md:text-white/40 dark:md:hover:text-white'
        }`}
      >
        {item.label}
      </span>

      {currentSection === item.id && (
  <motion.div
    layoutId="nav-underline"
    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-orange-400"
    transition={LIQUID_SPRING}
  />
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
      whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
      data-cursor={label}
      aria-label={label}
      className="relative p-2 opacity-70 hover:opacity-100 transition-all duration-300 hover:text-orange-500 md:text-neutral-900 md:dark:text-white"
    >
      {children}
    </motion.button>
  );

  /* ------------------------------
     THEME TOGGLE
  ------------------------------ */
  const ThemeToggle = () => (
    <IconButton onClick={toggleTheme} label="Theme">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDarkMode ? 'dark' : 'light'}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={LIQUID_SPRING}
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

  /* ------------------------------
     FULLSCREEN TOGGLE ICON
  ------------------------------ */
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
    <div ref={fullscreenRef}>
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
    </div>
  );
};

export default Navigation;