import React, { useEffect, useState } from 'react';
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
    const [offset, setOffset] = useState(0);

    // Show indicator on any scroll activity
    useEffect(() => {
        const handle = () => {
            setVisible(true);
            // Reset hide timer
            clearTimeout((handle as any).hideTimer);
            (handle as any).hideTimer = setTimeout(() => setVisible(false), 2000);
        };
        window.addEventListener('scroll', handle, { passive: true });
        return () => {
            window.removeEventListener('scroll', handle);
            clearTimeout((handle as any).hideTimer);
        };
    }, []);

    // Update slight offset based on direction for visual cue
    useEffect(() => {
        if (direction === 'down') setOffset(4);
        else if (direction === 'up') setOffset(-4);
        else setOffset(0);
    }, [direction]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed right-4 top-1/2 w-2 h-12 bg-orange-500 rounded"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 0.8, y: offset, transition: { duration: 0.3 } }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                />
            )}
        </AnimatePresence>
    );
};
