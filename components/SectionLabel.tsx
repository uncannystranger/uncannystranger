import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../types';

interface SectionLabelProps {
    currentSection: Section;
}

const SECTION_MAP: Record<string, string> = {
    'home': 'ESTB. 2024',
    'projects': 'EXHIBITION ARC',
    'projects:exhibition': 'VIEWING ROOM',
    'artist': 'THE ARCHIVE'
};

export const SectionLabel: React.FC<SectionLabelProps> = ({ currentSection }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [lastSection, setLastSection] = useState(currentSection);

    useEffect(() => {
        if (currentSection !== lastSection) {
            setIsVisible(true);
            setLastSection(currentSection);
            const timer = setTimeout(() => setIsVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [currentSection, lastSection]);

    return (
        <div className="fixed left-6 md:left-12 bottom-8 z-50 pointer-events-none overflow-hidden">
            <AnimatePresence mode="wait">
                {isVisible && (
                    <motion.div
                        key={currentSection}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 40, damping: 20, mass: 1.5 }}
                        className="flex items-center gap-4"
                    >
                        <span className="w-8 h-[1px] bg-accent" />
                        <span className="text-[10px] tracking-[0.4em] uppercase text-ink-primary dark:text-bone-secondary font-semibold">
                            {SECTION_MAP[currentSection] || currentSection.toUpperCase()}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
