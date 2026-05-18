import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const visibleRef = useRef(false);

    useEffect(() => {
        let rafId: number | null = null;

        const updateVisibility = () => {
            rafId = null;
            const scrolled = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const nextVisible = scrolled > height * 0.4;
            if (nextVisible !== visibleRef.current) {
                visibleRef.current = nextVisible;
                setIsVisible(nextVisible);
            }
        };

        const handleScroll = () => {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(updateVisibility);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToTop}
                    className="fixed right-4 md:right-12 bottom-48 md:bottom-14 z-[60] p-3 bg-accent text-white rounded-full shadow-xl transition-all hover:bg-orange-600 focus:outline-none"
                    aria-label="Back to top"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 15l-6-6-6 6" />
                    </svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
};
