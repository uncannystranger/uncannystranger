import { useEffect, useRef, useState } from 'react';

/**
 * Hook to detect scroll direction (up or down).
 * Returns 'up' when the user scrolls upward, 'down' when scrolling downward,
 * and null when there is no movement yet.
 */
export function useScrollDirection(): 'up' | 'down' | null {
    const [direction, setDirection] = useState<'up' | 'down' | null>(null);
    const lastScrollY = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
    const ticking = useRef<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const diff = currentY - lastScrollY.current;
            if (diff > 0) {
                setDirection('down');
            } else if (diff < 0) {
                setDirection('up');
            }
            lastScrollY.current = currentY;
            ticking.current = false;
        };

        const onScroll = () => {
            if (!ticking.current) {
                ticking.current = true;
                requestAnimationFrame(handleScroll);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return direction;
}
