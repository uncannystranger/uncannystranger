import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollDirection } from '../src/hooks/useScrollDirection';

/**
 * Minimal orange scroll indicator.
 * Appears on the right edge when the user scrolls and fades out after 2 seconds of inactivity.
 * It also subtly reflects scroll direction with a slight vertical offset.
 */
export const ScrollIndicator: React.FC = () => {
    const direction = useScrollDirection();
    const [visible, setVisible] = useState(false);
    const visibleRef = useRef(false);
    const hideTimerRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    // Show indicator on any scroll activity
    useEffect(() => {
        const handle = () => {
            if (rafRef.current !== null) return;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                if (!visibleRef.current) {
                    visibleRef.current = true;
                    setVisible(true);
                }
                if (hideTimerRef.current !== null) {
                    window.clearTimeout(hideTimerRef.current);
                }
                hideTimerRef.current = window.setTimeout(() => {
                    visibleRef.current = false;
                    setVisible(false);
                }, 2000);
            });
        };
        window.addEventListener('scroll', handle, { passive: true });
        return () => {
            window.removeEventListener('scroll', handle);
            if (hideTimerRef.current !== null) {
                window.clearTimeout(hideTimerRef.current);
            }
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    const offset = direction === 'down' ? 4 : direction === 'up' ? -4 : 0;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed right-4 top-1/2 w-2 h-12 bg-orange-500 rounded"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 0.8, y: offset, transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                />
            )}
        </AnimatePresence>
    );
};
