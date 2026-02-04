import React, { useRef } from 'react';

export const LightingWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const latestPos = useRef({ x: 0, y: 0 });

    const applyVars = () => {
        rafRef.current = null;
        if (!containerRef.current) return;
        containerRef.current.style.setProperty('--x', `${latestPos.current.x}px`);
        containerRef.current.style.setProperty('--y', `${latestPos.current.y}px`);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        latestPos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(applyVars);
        }
    };

    const handlePointerLeave = () => {
        latestPos.current = { x: 0, y: 0 };
        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(applyVars);
        }
    };

    return (
        <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className={`relative overflow-hidden ${className}`}
            style={{
                '--x': `0px`,
                '--y': `0px`,
            } as React.CSSProperties}
        >
            <div className="absolute inset-0 spotlight-radial opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            {children}
        </div>
    );
};
