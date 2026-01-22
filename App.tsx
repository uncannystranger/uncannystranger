import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Navigation from './components/Navigation';
import Home from './components/Home';
import Projects from './components/Projects';
import Artist from './components/Artist';
import { Section } from './types';
import { ScrollIndicator } from './components/ScrollIndicator';
import { ScrollProgress } from './components/ScrollProgress';
import { SectionLabel } from './components/SectionLabel';
import { BackToTop } from './components/BackToTop';

/* ================= SAFETY: ERROR BOUNDARY ================= */
type ErrorBoundaryProps = {
  children?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  declare props: ErrorBoundaryProps;

  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/* ================= CUSTOM CURSOR (UNCHANGED) ================= */
const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) =>
      setPosition({ x: e.clientX, y: e.clientY });

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [role="button"], .cursor-pointer'
      );

      if (interactive) {
        setIsHovering(true);
        setCursorLabel(interactive.getAttribute('data-cursor'));
      } else {
        setIsHovering(false);
        setCursorLabel(null);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-3 h-3 rounded-full bg-accent z-[10000] pointer-events-none md:block hidden mix-blend-difference"
      animate={{
        x: position.x - 6,
        y: position.y - 6,
        scale: isClicking ? 0.8 : isHovering ? 4 : 1,
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.6,
      }}
    />
  );
};

/* ================= APP ================= */
const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [section, setSection] = useState<Section>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  /* ================= URL → SECTION (ON LOAD & REFRESH) ================= */
  useEffect(() => {
    if (location.pathname === '/projects') setSection('projects');
    else if (location.pathname === '/artist') setSection('artist');
    else setSection('home');
  }, [location.pathname]);

  /* ================= SCROLL RESET (ORIGINAL BEHAVIOR) ================= */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [section]);

  /* ================= THEME (ORIGINAL LOGIC, UNCHANGED) ================= */
  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (!window.matchMedia) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mq.matches);
    applyTheme(mq.matches);

    const onChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      applyTheme(e.matches);
    };

    mq.addEventListener?.('change', onChange);
    mq.addListener?.(onChange);

    return () => {
      mq.removeEventListener?.('change', onChange);
      mq.removeListener?.(onChange);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      applyTheme(next);
      return next;
    });
  };

  /* ================= SECTION → URL (SEO) ================= */
  useEffect(() => {
    if (section === 'home') navigate('/', { replace: false });
    if (section === 'projects') navigate('/projects', { replace: false });
    if (section === 'artist') navigate('/artist', { replace: false });
  }, [section, navigate]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen selection:bg-accent selection:text-white transition-colors duration-500 flex flex-col relative overflow-hidden">
        <div className="grain-overlay" />
        <CustomCursor />
        <ScrollProgress />
        <SectionLabel currentSection={section} />
        <BackToTop />

        <Navigation
          currentSection={section}
          setSection={setSection}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        <ScrollIndicator />

        <main className="relative z-10 flex-grow">
          {section === 'home' && <Home setSection={setSection} />}
          {(section === 'projects' || section === 'projects:exhibition') && (
            <Projects
              initialView={
                section === 'projects:exhibition'
                  ? 'exhibition'
                  : 'gallery'
              }
            />
          )}
          {section === 'artist' && <Artist />}
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
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.282.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
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

        <Analytics />
        <SpeedInsights />
      </div>
    </ErrorBoundary>
  );
};

export default App;