import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useDeviceTier } from '../src/hooks/useDeviceTier';

export const ChapterIntro: React.FC = () => {
  const [label, setLabel] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const lastLabelRef = useRef('');
  const lastShownAt = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { isLowPower } = useDeviceTier();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-chapter]')
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const nextLabel = (entry.target as HTMLElement).dataset.chapter;
          if (!nextLabel || nextLabel === lastLabelRef.current) return;
          const now = Date.now();
          if (now - lastShownAt.current < 1200) return;
          lastShownAt.current = now;
          lastLabelRef.current = nextLabel;
          setLabel(nextLabel);
          setIsVisible(true);
          if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
          timeoutRef.current = window.setTimeout(() => {
            setIsVisible(false);
          }, 1200);
        });
      },
      { threshold: 0.55, rootMargin: '0px 0px -10% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="chapter-intro-wrapper">
      <AnimatePresence>
        {isVisible && label && (
          <motion.div
            className="chapter-intro-card"
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.98,
              y: shouldReduceMotion ? 0 : 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                duration: isLowPower ? 0.35 : 0.55,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.98,
              y: shouldReduceMotion ? 0 : -6,
              transition: { duration: 0.25 },
            }}
          >
            <span className="chapter-intro-label">Chapter</span>
            <span className="chapter-intro-title">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
