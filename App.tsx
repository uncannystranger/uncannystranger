import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Link, useLocation } from 'react-router-dom';

import Navigation from './components/Navigation';
import { Section } from './types';
import { useDeviceTier } from './src/hooks/useDeviceTier';

import { canonicalFor, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, pageSeo } from './src/seo/siteSeo';
import { useContentProtection } from './src/hooks/useContentProtection';

const THEME_STORAGE_KEY = 'uncanny-theme-mode';
const THEME_MANUAL_STORAGE_KEY = 'uncanny-theme-manual';
type ThemeMode = 'system' | 'dark' | 'light';
const Home = React.lazy(() => import('./components/Home'));
const Projects = React.lazy(() => import('./components/Projects'));
const Artist = React.lazy(() => import('./components/Artist'));
const FrameArticle = React.lazy(() => import('./components/FrameArticle'));

const readInitialThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  const hasManualTheme = window.localStorage.getItem(THEME_MANUAL_STORAGE_KEY) === 'true';
  return hasManualTheme && (stored === 'dark' || stored === 'light') ? stored : 'system';
};

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

const sectionForPath = (pathname: string): Section => {
  if (pathname === '/projects' || pathname === '/gallery') return 'projects';
  if (pathname === '/frames' || /^\/frames\/[^/]+$/.test(pathname)) return 'projects:frames';
  if (pathname === '/artist') return 'artist';
  return 'home';
};

/* ================= APP ================= */
const App: React.FC = () => {
  const location = useLocation();
  const { isLowPower } = useDeviceTier();
  useContentProtection();

  const [section, setSection] = useState<Section>(() =>
    typeof window !== 'undefined' ? sectionForPath(window.location.pathname) : 'home'
  );
  const [isDarkMode, setIsDarkMode] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false
  );
  const [themeOverride, setThemeOverride] = useState<ThemeMode>(readInitialThemeMode);
  const [recActive, setRecActive] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const gradeRafRef = useRef<number | null>(null);
  const leakRafRef = useRef<number | null>(null);
  const lastSectionRef = useRef('');
  const recTimeoutRef = useRef<number | null>(null);
  const isPerfLow = true;

  const isFrameArticlePath = /^\/frames\/[^/]+$/.test(location.pathname);
  const isKnownPath = ['/', '/projects', '/gallery', '/frames', '/artist'].includes(location.pathname) || isFrameArticlePath;

  /* ================= URL → SECTION (ON LOAD & REFRESH) ================= */
  useEffect(() => {
    setSection(sectionForPath(location.pathname));
  }, [isFrameArticlePath, location.pathname]);

  /* ================= SEO HEAD INJECTION ================= */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const resolvedSection =
      section === 'projects:frames'
        ? 'frames'
        : section === 'projects:exhibition'
          ? 'projects'
          : section;
    const data = isKnownPath ? pageSeo[resolvedSection] : pageSeo.notFound;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setMetaProperty = (property: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setCanonical = (href: string) => {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    document.title = data.title;
    setMeta('description', data.description);
    setMeta('keywords', data.keywords);
    const canonicalPath = isFrameArticlePath ? location.pathname : data.path;
    setCanonical(isKnownPath ? canonicalFor(canonicalPath) : canonicalFor('/'));
    setMetaProperty('og:title', data.title);
    setMetaProperty('og:description', data.description);
    setMetaProperty('og:url', isKnownPath ? canonicalFor(canonicalPath) : canonicalFor('/'));
    setMetaProperty('og:image', DEFAULT_OG_IMAGE);
    setMetaProperty('og:image:alt', DEFAULT_OG_IMAGE_ALT);
    setMeta('twitter:title', data.title);
    setMeta('twitter:description', data.description);
    setMeta('twitter:url', isKnownPath ? canonicalFor(canonicalPath) : canonicalFor('/'));
    setMeta('twitter:image', DEFAULT_OG_IMAGE);
    setMeta('twitter:image:alt', DEFAULT_OG_IMAGE_ALT);
    setMeta('robots', isKnownPath ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : 'noindex, follow');
  }, [isFrameArticlePath, isKnownPath, location.pathname, section]);

  /* ================= SCROLL RESET (ORIGINAL BEHAVIOR) ================= */
  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto', // important: no smooth scrolling
  });
}, [location.pathname]);

  /* ================= THEME ================= */
  const applyTheme = (dark: boolean) => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');

    const applyFromMode = (mode: ThemeMode, matches: boolean) => {
      const nextIsDark = mode === 'system' ? matches : mode === 'dark';
      setIsDarkMode(nextIsDark);
      applyTheme(nextIsDark);
    };

    applyFromMode(themeOverride, mq?.matches ?? false);
    window.localStorage.setItem(THEME_STORAGE_KEY, themeOverride);
    if (themeOverride === 'system') {
      window.localStorage.removeItem(THEME_MANUAL_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_MANUAL_STORAGE_KEY, 'true');
    }

    if (!mq) return;

    const onChange = (e: MediaQueryListEvent) => {
      if (themeOverride !== 'system') return;
      applyFromMode('system', e.matches);
    };

    mq.addEventListener?.('change', onChange);
    mq.addListener?.(onChange);

    return () => {
      mq.removeEventListener?.('change', onChange);
      mq.removeListener?.(onChange);
    };
  }, [themeOverride]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const screenMq = window.matchMedia('(max-width: 768px)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateScreen = () => setIsSmallScreen(screenMq.matches);
    const updateMotion = () => setPrefersReducedMotion(motionMq.matches);

    updateScreen();
    updateMotion();

    screenMq.addEventListener?.('change', updateScreen);
    screenMq.addListener?.(updateScreen);
    motionMq.addEventListener?.('change', updateMotion);
    motionMq.addListener?.(updateMotion);

    return () => {
      screenMq.removeEventListener?.('change', updateScreen);
      screenMq.removeListener?.(updateScreen);
      motionMq.removeEventListener?.('change', updateMotion);
      motionMq.removeListener?.(updateMotion);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-perf', isPerfLow ? 'low' : 'high');
  }, [isPerfLow]);

  const toggleTheme = () => {
    setThemeOverride((prev) => {
      if (prev === 'system') {
        return isDarkMode ? 'light' : 'dark';
      }
      if (prev === 'dark') return 'light';
      return 'system';
    });
  };

  useEffect(() => {
    if (isPerfLow) return;
    const root = document.documentElement;
    const gradeMap: Record<string, { warm: number; cool: number; opacity: number }> = {
      Introduction: { warm: 0.14, cool: 0.08, opacity: 0.16 },
      Exhibition: { warm: 0.18, cool: 0.06, opacity: 0.18 },
      Motion: { warm: 0.08, cool: 0.16, opacity: 0.16 },
      'Photo Booth': { warm: 0.12, cool: 0.1, opacity: 0.15 },
      Projects: { warm: 0.1, cool: 0.12, opacity: 0.15 },
      Artist: { warm: 0.16, cool: 0.07, opacity: 0.17 },
    };

    const animateGrade = (target: { warm: number; cool: number; opacity: number }) => {
      if (gradeRafRef.current !== null) {
        cancelAnimationFrame(gradeRafRef.current);
      }
      const startWarm = parseFloat(getComputedStyle(root).getPropertyValue('--grade-warm')) || 0.12;
      const startCool = parseFloat(getComputedStyle(root).getPropertyValue('--grade-cool')) || 0.1;
      const startOpacity = parseFloat(getComputedStyle(root).getPropertyValue('--grade-opacity')) || 0.16;
      const duration = isLowPower ? 320 : 560;
      const startTime = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const ease = t * (2 - t);
        const warm = startWarm + (target.warm - startWarm) * ease;
        const cool = startCool + (target.cool - startCool) * ease;
        const opacity = startOpacity + (target.opacity - startOpacity) * ease;
        root.style.setProperty('--grade-warm', warm.toFixed(3));
        root.style.setProperty('--grade-cool', cool.toFixed(3));
        root.style.setProperty('--grade-opacity', opacity.toFixed(3));
        if (t < 1) {
          gradeRafRef.current = requestAnimationFrame(step);
        } else {
          gradeRafRef.current = null;
        }
      };

      gradeRafRef.current = requestAnimationFrame(step);
    };

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const label = entry.target.getAttribute('data-chapter') || 'Introduction';
          const target = gradeMap[label] || gradeMap.Introduction;
          animateGrade(target);
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));
    const initialLabel = sections[0]?.getAttribute('data-chapter') || 'Introduction';
    animateGrade(gradeMap[initialLabel] || gradeMap.Introduction);
    return () => {
      observer.disconnect();
      if (gradeRafRef.current !== null) {
        cancelAnimationFrame(gradeRafRef.current);
      }
    };
  }, [isLowPower, isPerfLow]);

  useEffect(() => {
    if (isPerfLow) {
      const root = document.documentElement;
      root.style.setProperty('--leak-x', '62%');
      root.style.setProperty('--leak-y', '30%');
      return;
    }
    const root = document.documentElement;
    const mq = window.matchMedia('(pointer: fine)');

    const setStaticLeak = () => {
      root.style.setProperty('--leak-x', '62%');
      root.style.setProperty('--leak-y', '30%');
    };

    if (!mq.matches) {
      setStaticLeak();
      return;
    }

    const handlePointer = (event: PointerEvent) => {
      if (leakRafRef.current !== null) return;
      const { clientX, clientY } = event;
      leakRafRef.current = requestAnimationFrame(() => {
        leakRafRef.current = null;
        const x = (clientX / window.innerWidth) * 100;
        const y = (clientY / window.innerHeight) * 100;
        root.style.setProperty('--leak-x', `${x.toFixed(2)}%`);
        root.style.setProperty('--leak-y', `${y.toFixed(2)}%`);
      });
    };

    window.addEventListener('pointermove', handlePointer);
    return () => {
      window.removeEventListener('pointermove', handlePointer);
      if (leakRafRef.current !== null) {
        cancelAnimationFrame(leakRafRef.current);
      }
    };
  }, [isPerfLow]);

  useEffect(() => {
    if (isPerfLow) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
    if (!sections.length) return;
    const sectionMeta = sections.map((section) => ({
      section,
      label: section.dataset.chapter || 'Scene',
    }));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const meta = sectionMeta.find((item) => item.section === entry.target);
          if (!meta) return;
          if (meta.label === lastSectionRef.current) return;
          lastSectionRef.current = meta.label;
          setRecActive(true);
          if (recTimeoutRef.current) window.clearTimeout(recTimeoutRef.current);
          recTimeoutRef.current = window.setTimeout(() => setRecActive(false), 900);
        });
      },
      { threshold: 0.6 }
    );

    sectionMeta.forEach((item) => observer.observe(item.section));
    return () => {
      observer.disconnect();
      if (recTimeoutRef.current) window.clearTimeout(recTimeoutRef.current);
    };
  }, [isPerfLow]);

  return (
    <ErrorBoundary>
      <div className="app-shell min-h-screen selection:bg-accent selection:text-white flex flex-col relative overflow-x-hidden">
        <div className="grid-overlay" />

        <Navigation
          currentSection={section}
          setSection={setSection}
          isDarkMode={isDarkMode}
          themeMode={themeOverride}
          toggleTheme={toggleTheme}
        />

        <main className="relative z-10 flex-grow">
            <div>
              {!isKnownPath && (
                <section className="min-h-screen px-6 py-40 flex items-center justify-center text-center">
                  <div className="max-w-xl">
                    <p className="text-[10px] tracking-[0.5em] uppercase text-accent mb-6">404</p>
                    <h1 className="text-4xl md:text-6xl font-serif italic mb-6">Page not found</h1>
                    <p className="text-ink-secondary dark:text-bone-secondary mb-10">
                      This page does not exist. Return to the official Uncanny Stranger portfolio.
                    </p>
                    <Link to="/" className="text-xs tracking-[0.4em] uppercase border-b border-accent pb-2">
                      Back home
                    </Link>
                  </div>
                </section>
              )}
              <Suspense fallback={null}>
                {isKnownPath && !isFrameArticlePath && section === 'home' && <Home setSection={setSection} />}
                {isKnownPath && !isFrameArticlePath && (section === 'projects' || section === 'projects:exhibition' || section === 'projects:frames') && (
                  <Projects
                    initialView={
                      section === 'projects:exhibition'
                        ? 'exhibition'
                        : section === 'projects:frames'
                        ? 'frames'
                        : 'gallery'
                    }
                  />
                )}
                {isKnownPath && isFrameArticlePath && <FrameArticle />}
                {isKnownPath && !isFrameArticlePath && section === 'artist' && <Artist />}
              </Suspense>
            </div>
        </main>
        {/* Conditionally rendered footer restricted to Home and Artist sections */}
        {isKnownPath && (section === 'home' || section === 'artist') && (
          <footer className="relative z-10 w-full pt-10 pb-28 md:pb-12 text-center select-none flex flex-col items-center gap-6">
            {section === 'home' && (
              <div className="opacity-100 text-orange-500">
                <a
                  href="https://instagram.com/uncannystranger"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-50"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.282.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                  </svg>
                </a>
              </div>
            )}
            <span className="text-ink-secondary dark:text-bone-secondary text-[10px] tracking-[0.4em] uppercase opacity-50">
              Made with 🧡 by{' '}
              <span className="text-accent opacity-100">
                Uncanny Stranger
              </span>.
            </span>
            <a
              href="/copyright.html"
              className="text-[10px] tracking-[0.35em] uppercase text-ink-secondary/70 dark:text-bone-secondary/70 hover:text-accent transition-colors"
            >
              Copyright notice
            </a>

          </footer>
        )}

        <Analytics />
        <SpeedInsights />
      </div>
    </ErrorBoundary>
  );
};

export default App;
