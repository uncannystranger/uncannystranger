import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgress: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 140,
        damping: 26,
        restDelta: 0.001
    });
    const [chapterStops, setChapterStops] = useState<Array<{ label: string; left: number }>>([]);

    useEffect(() => {
        const computeStops = () => {
            if (typeof document === 'undefined') return;
            const sections = Array.from(
                document.querySelectorAll<HTMLElement>('[data-chapter]')
            );
            if (!sections.length) {
                setChapterStops([]);
                return;
            }
            const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll <= 0) {
                setChapterStops([]);
                return;
            }
            const stops = sections
                .map((section) => {
                    const label = section.dataset.chapter || '';
                    const top = section.getBoundingClientRect().top + window.scrollY;
                    const ratio = Math.min(1, Math.max(0, top / maxScroll));
                    return { label, left: ratio };
                })
                .filter((stop) => stop.label);
            setChapterStops(stops);
        };

        computeStops();
        window.addEventListener('resize', computeStops);
        window.addEventListener('orientationchange', computeStops);
        return () => {
            window.removeEventListener('resize', computeStops);
            window.removeEventListener('orientationchange', computeStops);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-[1px] z-[10001] pointer-events-none">
            <motion.div
                className="absolute inset-0 bg-accent origin-left"
                style={{ scaleX }}
            />
            {chapterStops.map((stop) => (
                <div
                    key={stop.label}
                    className="absolute top-0 h-full w-px bg-accent/40"
                    style={{ left: `${stop.left * 100}%` }}
                />
            ))}
        </div>
    );
};
