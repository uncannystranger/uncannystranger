import { useEffect, useState } from 'react';

/**
 * Hook to detect scroll direction (up or down).
 * Returns 'up' when the user scrolls upward, 'down' when scrolling downward,
 * and null when there is no movement yet.
 */
type ScrollDirection = 'up' | 'down' | null;

let sharedDirection: ScrollDirection = null;
let sharedLastY = typeof window !== 'undefined' ? window.scrollY : 0;
let sharedTicking = false;
let listenerCount = 0;
const subscribers = new Set<(dir: ScrollDirection) => void>();

const notify = (dir: ScrollDirection) => {
    subscribers.forEach((cb) => cb(dir));
};

const onScroll = () => {
    if (sharedTicking) return;
    sharedTicking = true;
    requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - sharedLastY;
        if (diff > 0) sharedDirection = 'down';
        if (diff < 0) sharedDirection = 'up';
        sharedLastY = currentY;
        sharedTicking = false;
        notify(sharedDirection);
    });
};

export function useScrollDirection(): ScrollDirection {
    const [direction, setDirection] = useState<ScrollDirection>(sharedDirection);

    useEffect(() => {
        const handle = (dir: ScrollDirection) => setDirection(dir);
        subscribers.add(handle);
        listenerCount += 1;

        if (listenerCount === 1 && typeof window !== 'undefined') {
            sharedLastY = window.scrollY;
            window.addEventListener('scroll', onScroll, { passive: true });
        }

        return () => {
            subscribers.delete(handle);
            listenerCount -= 1;
            if (listenerCount === 0 && typeof window !== 'undefined') {
                window.removeEventListener('scroll', onScroll);
            }
        };
    }, []);

    return direction;
}
