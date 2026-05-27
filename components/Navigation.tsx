import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
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
    { label: 'Frames', id: 'projects:frames' },
    { label: 'Artist', id: 'artist' },
  ];

  /* ------------------------------
     NAV LINK (NO SECTION ANIMATION)
  ------------------------------ */
  const routeForSection = (item: Section) => {
    if (item === 'projects' || item === 'projects:exhibition') return '/projects';
    if (item === 'projects:frames') return '/frames';
    if (item === 'artist') return '/artist';
    return '/';
  };

  const isActive = (item: Section) => {
    if (item === 'projects') return currentSection === 'projects' || currentSection === 'projects:exhibition';
    return currentSection === item;
  };

  const NavLink = ({ item, mobile = false }: { item: { label: string; id: Section }; mobile?: boolean }) => (
    <Link
      to={routeForSection(item.id)}
      onClick={() => {
        setSection(item.id);
      }}
      data-cursor={item.label}
      className={`group relative inline-flex items-center text-ink-primary transition-[opacity,transform,border-color,color] duration-200 hover:text-accent focus:outline-none dark:text-bone-primary ${
        mobile
          ? 'min-h-[28px] px-1 py-1.5'
          : 'min-h-[30px] px-1 py-1'
      }`}
    >
      <span
        className={`font-serif text-[10px] tracking-[0.03em] sm:text-[11px] md:text-[14px] md:tracking-[0.035em] ${
          isActive(item.id)
            ? 'opacity-100'
            : 'opacity-55'
        }`}
      >
        {item.label}
      </span>

      <span
        className={`absolute ${mobile ? 'bottom-0.5' : 'bottom-1.5'} left-1/2 h-px -translate-x-1/2 bg-accent transition-all duration-200 ${
          isActive(item.id) ? 'w-5' : 'w-0 group-hover:w-4'
        }`}
      />
    </Link>
  );

  const IconButton = ({
    onClick,
    label,
    children,
    mobile = false,
  }: {
    onClick: () => void;
    label: string;
    children: React.ReactNode;
    mobile?: boolean;
  }) => (
    <button
      onClick={onClick}
      data-cursor={label}
      aria-label={label}
      className={`relative flex items-center justify-center rounded-full text-ink-primary/65 transition-[opacity,transform,border-color,color,background-color] duration-200 hover:text-accent hover:opacity-100 dark:text-bone-primary/65 ${
        mobile
          ? 'min-h-[28px] min-w-[28px] bg-transparent'
          : 'min-h-[30px] min-w-[30px] bg-transparent'
      }`}
    >
      {children}
    </button>
  );

  /* ------------------------------
     THEME TOGGLE (UNCHANGED)
  ------------------------------ */
  const ThemeToggle = ({ mobile = false }: { mobile?: boolean }) => (
    <IconButton onClick={toggleTheme} label="Theme" mobile={mobile}>
      <div>
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
      </div>
    </IconButton>
  );

  const FullscreenToggle = ({ mobile = false }: { mobile?: boolean }) => (
    <IconButton onClick={toggleFullscreen} label="Fullscreen" mobile={mobile}>
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
      {/* ================= EDITORIAL TOP NAV ================= */}
      <nav className="pointer-events-none fixed left-0 right-0 top-0 z-[9993] hidden px-6 py-5 md:block lg:px-10">
        <div className="mx-auto flex max-w-[1880px] items-start justify-center gap-2.5">
          <div className="pointer-events-auto flex items-center justify-center gap-2.5">
            {navItems.map((item) => (
              <React.Fragment key={item.id}>
                <NavLink item={item} />
              </React.Fragment>
            ))}
          </div>

          <div className="pointer-events-auto absolute right-6 top-5 flex items-start justify-end gap-2.5 lg:right-10">
            <FullscreenToggle />
            <ThemeToggle />
            <div className="flex min-h-[30px] items-center px-1 text-[10px] uppercase tracking-[0.18em] text-ink-secondary dark:text-bone-secondary">
              Mogadishu, SO
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-[9993] px-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] md:hidden">
        <div className="nav-material-capsule pointer-events-auto mx-auto flex w-full max-w-[330px] items-center justify-center gap-0.5 rounded-full px-2 py-2">
          {navItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <NavLink item={item} mobile />
              {index < navItems.length - 1 && <span className="h-5 w-px bg-accent/35" aria-hidden="true" />}
            </React.Fragment>
          ))}
          <span className="h-5 w-px bg-accent/35" aria-hidden="true" />
          <FullscreenToggle mobile />
          <ThemeToggle mobile />
        </div>
      </nav>
    </>
  );
};

export default Navigation;
