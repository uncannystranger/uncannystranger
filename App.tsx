import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Navigation from './components/Navigation';
import Home from './components/Home';
import { Section } from './types';
import { ScrollIndicator } from './components/ScrollIndicator';
import { ScrollProgress } from './components/ScrollProgress';
import { SectionLabel } from './components/SectionLabel';
import { BackToTop } from './components/BackToTop';
import { useDeviceTier } from './src/hooks/useDeviceTier';

const Projects = lazy(() => import('./components/Projects'));
const Artist = lazy(() => import('./components/Artist'));

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
  const { isLowPower } = useDeviceTier();

  const [section, setSection] = useState<Section>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeOverride, setThemeOverride] = useState<'system' | 'dark' | 'light'>('system');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [recActive, setRecActive] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const gradeRafRef = useRef<number | null>(null);
  const leakRafRef = useRef<number | null>(null);
  const meterRafRef = useRef<number | null>(null);
  const meterLevelRef = useRef(0);
  const lastSectionRef = useRef('');
  const recTimeoutRef = useRef<number | null>(null);

  const SEO = {
    home: {
      title: 'Abdullahi Maxamed',
      description:
        "Official portfolio of Abdullahi Maxamed (Uncanny Stranger). A study of stillness, memory, and visual storytelling through the lens of Mogadishu's shifting landscapes.",
      canonical: 'https://uncannystranger.com',
    },
    projects: {
      title: 'Projects | Abdullahi Maxamed',
      description:
        'Photography projects and exhibitions by Abdullahi Maxamed (Uncanny Stranger), including curated galleries, visual journals, and cinematic exhibitions.',
      canonical: 'https://uncannystranger.com/projects',
    },
    artist: {
      title: 'Artist | Abdullahi Maxamed',
      description:
        'About Abdullahi Maxamed, known as Uncanny Stranger. A Somali photographer documenting quiet moments, light, movement, and personal visual stories.',
      canonical: 'https://uncannystranger.com/artist',
    },
  } as const;

  /* ================= URL → SECTION (ON LOAD & REFRESH) ================= */
  useEffect(() => {
    if (location.pathname === '/projects') setSection('projects');
    else if (location.pathname === '/artist') setSection('artist');
    else setSection('home');
  }, [location.pathname]);

  /* ================= SEO HEAD INJECTION ================= */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const resolvedSection =
      section === 'projects:exhibition' ? 'projects' : section;
    const data = SEO[resolvedSection];
    if (!data) return;

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
    setCanonical(data.canonical);
    setMetaProperty('og:title', data.title);
    setMetaProperty('og:description', data.description);
    setMetaProperty('og:url', data.canonical);
    setMetaProperty('twitter:title', data.title);
    setMetaProperty('twitter:description', data.description);
    setMetaProperty('twitter:url', data.canonical);
  }, [section]);

  /* ================= SCROLL RESET (ORIGINAL BEHAVIOR) ================= */
  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto', // important: no smooth scrolling
  });
}, [location.pathname]);

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

    const applyFromMode = (mode: 'system' | 'dark' | 'light', matches: boolean) => {
      const nextIsDark = mode === 'system' ? matches : mode === 'dark';
      setIsDarkMode(nextIsDark);
      applyTheme(nextIsDark);
    };

    applyFromMode(themeOverride, mq.matches);

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

  const toggleTheme = () => {
    setThemeOverride((prev) => {
      if (prev === 'system') {
        return isDarkMode ? 'light' : 'dark';
      }
      if (prev === 'dark') return 'light';
      return 'system';
    });
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const playTap = useCallback((soundType: string) => {
    if (!soundEnabled) return;
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioRef.current) {
      audioRef.current = new AudioContextClass();
    }

    const ctx = audioRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const createNoiseBuffer = (duration: number) => {
      const length = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / length);
      }
      return buffer;
    };

    if (soundType === 'shutter') {
      const duration = 0.08;
      const buffer = createNoiseBuffer(duration);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      filter.Q.value = 0.6;
      const gain = ctx.createGain();
      gain.gain.value = 0.18;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration + 0.02);

      const thump = ctx.createOscillator();
      const thumpGain = ctx.createGain();
      thump.type = 'sine';
      thump.frequency.setValueAtTime(180, ctx.currentTime);
      thump.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.06);
      thumpGain.gain.value = 0.06;
      thumpGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
      thump.connect(thumpGain);
      thumpGain.connect(ctx.destination);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      source.stop(ctx.currentTime + duration);
      thump.start();
      thump.stop(ctx.currentTime + 0.1);
      return;
    }

    if (soundType === 'tone') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 420;
      gain.gain.value = 0.08;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const texture = ctx.createBufferSource();
    texture.buffer = createNoiseBuffer(0.06);
    const textureFilter = ctx.createBiquadFilter();
    textureFilter.type = 'lowpass';
    textureFilter.frequency.value = 1200;
    const textureGain = ctx.createGain();
    textureGain.gain.value = 0.04;
    textureGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.type = 'triangle';
    osc.frequency.value = 150;
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
    texture.connect(textureFilter);
    textureFilter.connect(textureGain);
    textureGain.connect(ctx.destination);
    texture.start();
    texture.stop(ctx.currentTime + 0.08);
  }, [soundEnabled]);

  /* ================= SECTION → URL (SEO) ================= */
  useEffect(() => {
    if (section === 'home') navigate('/', { replace: false });
    if (section === 'projects') navigate('/projects', { replace: false });
    if (section === 'projects:exhibition') navigate('/projects', { replace: false });
    if (section === 'artist') navigate('/artist', { replace: false });
  }, [section, navigate]);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      if (!soundEnabled) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'a, button, [role="button"], .cursor-pointer'
      );
      if (!interactive) return;
      if (interactive.getAttribute('data-sound-off') === 'true') return;
      const soundType = interactive.getAttribute('data-sound') || 'reel';
      playTap(soundType);
    };

    window.addEventListener('pointerdown', handlePointer);
    return () => window.removeEventListener('pointerdown', handlePointer);
  }, [soundEnabled, playTap]);

  useEffect(() => {
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
  }, [isLowPower]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    const tick = () => {
      meterLevelRef.current *= 0.92;
      root.style.setProperty('--meter-level', meterLevelRef.current.toFixed(3));
      meterRafRef.current = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastY);
      const dt = Math.max(16, now - lastTime);
      const velocity = dy / dt;
      const level = Math.min(1, velocity * 0.9);
      if (level > meterLevelRef.current) {
        meterLevelRef.current = level;
      }
      lastY = window.scrollY;
      lastTime = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    meterRafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (meterRafRef.current !== null) cancelAnimationFrame(meterRafRef.current);
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen selection:bg-accent selection:text-white transition-colors duration-500 flex flex-col relative overflow-hidden">
        <div className="grade-overlay" />
        <div className="light-leak-overlay" />
        <div className="vignette-overlay" />
        <div className="film-edge-overlay" />
        <div className="grain-overlay" />
        <div className={`rec-indicator ${recActive ? 'is-active' : ''}`}>
          REC <span className="rec-dot" />
        </div>
        <div className="meter-strip">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="meter-bar"
              style={{ ['--bar-mult' as any]: 0.4 + index * 0.08 }}
            />
          ))}
        </div>
        <CustomCursor />
        <ScrollProgress />
        <SectionLabel currentSection={section} />
        <BackToTop />

        <Navigation
          currentSection={section}
          setSection={setSection}
          isDarkMode={isDarkMode}
          themeMode={themeOverride}
          toggleTheme={toggleTheme}
          isSoundEnabled={soundEnabled}
          toggleSound={toggleSound}
        />

        <ScrollIndicator />

        <main className="relative z-10 flex-grow">
          {section === 'home' && <Home setSection={setSection} />}
          {(section === 'projects' || section === 'projects:exhibition') && (
            <Suspense fallback={null}>
              <Projects
                initialView={
                  section === 'projects:exhibition'
                    ? 'exhibition'
                    : 'gallery'
                }
              />
            </Suspense>
          )}
          {section === 'artist' && (
            <Suspense fallback={null}>
              <Artist />
            </Suspense>
          )}
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
