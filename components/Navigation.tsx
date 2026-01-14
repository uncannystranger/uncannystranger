
import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Section } from '../types';

interface NavigationProps {
  currentSection: Section;
  setSection: (section: Section) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const LIQUID_SPRING = {
  type: 'spring',
  stiffness: 150,
  damping: 25,
  mass: 1,
};

const Navigation: React.FC<NavigationProps> = ({ currentSection, setSection, isDarkMode, toggleTheme }) => {
  const shouldReduceMotion = useReducedMotion();
  const navItems: { label: string; id: Section }[] = [
    { label: 'Home', id: 'home' },
    { label: 'Projects', id: 'projects' },
    { label: 'Artist', id: 'artist' },
  ];

  const NavLink = ({ item, ...props }: { item: { label: string; id: Section } } & React.ComponentPropsWithoutRef<typeof motion.button>) => (
    <motion.button
      {...props}
      onClick={() => setSection(item.id)}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ y: 0, scale: 0.98 }}
      data-cursor={item.label}
      className="relative group py-2 px-1 focus:outline-none"
    >
      <span className={`text-sm md:text-base tracking-[0.2em] uppercase transition-all duration-700 font-sans ${currentSection === item.id ? 'opacity-100 font-medium text-orange-500' : 'opacity-60 dark:opacity-40 group-hover:opacity-100'}`}>
        {item.label}
      </span>
      {currentSection === item.id && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-orange-500"
          transition={LIQUID_SPRING}
        />
      )}
    </motion.button>
  );

  const ThemeToggle = () => (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.15, rotate: 10 }}
      whileTap={{ scale: 0.85, rotate: -10 }}
      data-cursor="Theme"
      className="p-2 opacity-60 hover:opacity-100 transition-all duration-500 hover:text-orange-500"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDarkMode ? 'dark' : 'light'}
          initial={{ opacity: 0, rotate: -90, scale: 0.5, filter: 'blur(4px)' }}
          animate={{ opacity: 1, rotate: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5, filter: 'blur(4px)' }}
          transition={LIQUID_SPRING}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
            </svg>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-24 items-center justify-between px-12 mix-blend-difference">
        <div className="flex gap-16">
          {navItems.map((item) => (
            <NavLink key={item.id} item={item} />
          ))}
        </div>
        <div className="flex items-center gap-8">
          <ThemeToggle />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...LIQUID_SPRING, delay: 0.5 }}
            className="text-[10px] tracking-[0.5em] uppercase text-white/40"
          >
            Mogadishu, SO
          </motion.div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm">
        <div className="
          bg-white/30 dark:bg-black/40 
          backdrop-blur-2xl 
          border border-white/20 dark:border-white/10 
          rounded-[2.5rem] 
          px-8 py-4 
          flex items-center justify-between 
          shadow-[0_20px_40px_rgba(0,0,0,0.3)]
          transition-all duration-700
        ">
          {navItems.map((item, index) => (
  <React.Fragment key={item.id}>
    <NavLink item={item} />
    {index < navItems.length - 1 && (
      <div className="w-[1px] h-4 bg-ink-primary/10 dark:bg-bone-primary/10 mx-0.5" />
    )}
  </React.Fragment>
))}
          <div className="w-[1px] h-4 bg-ink-primary/10 dark:bg-bone-primary/10 mx-0.5" />
          <ThemeToggle />
        </div>
      </nav>
    </>
  );
};

export default Navigation;
