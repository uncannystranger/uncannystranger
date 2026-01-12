
import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '../types';

interface NavigationProps {
  currentSection: Section;
  setSection: (section: Section) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, setSection, isDarkMode, toggleTheme }) => {
  const navItems: { label: string; id: Section }[] = [
    { label: 'Home', id: 'home' },
    { label: 'Projects', id: 'projects' },
    { label: 'Artist', id: 'artist' },
  ];

  const NavLink = ({ item }: { item: { label: string; id: Section }; key?: React.Key }) => (
    <button
      onClick={() => setSection(item.id)}
      className="relative group py-2 px-1 focus:outline-none"
    >
      <span className={`text-sm md:text-base tracking-widest transition-opacity duration-300 font-sans ${currentSection === item.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}>
        {item.label}
      </span>
      {currentSection === item.id && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="p-2 opacity-60 hover:opacity-100 transition-opacity"
      aria-label="Toggle Theme"
    >
      {isDarkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
        </svg>
      )}
    </button>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-20 items-center justify-between px-12 mix-blend-difference text-white">
        <div className="flex gap-12">
          {navItems.map((item) => (
            <NavLink key={item.id} item={item} />
          ))}
        </div>
        <ThemeToggle />
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
        <div className="bg-neutral-900/10 dark:bg-white/10 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-full px-8 py-3 flex items-center justify-between shadow-2xl">
          {navItems.map((item) => (
            <NavLink key={item.id} item={item} />
          ))}
          <div className="w-[1px] h-4 bg-white/20" />
          <ThemeToggle />
        </div>
      </nav>
    </>
  );
};

export default Navigation;
