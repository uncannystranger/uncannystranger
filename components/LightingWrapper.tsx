import React, { useState, useRef } from 'react';

export const LightingWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={`relative overflow-hidden ${className}`}
            style={{
                '--x': `${mousePos.x}px`,
                '--y': `${mousePos.y}px`,
            } as React.CSSProperties}
        >
            <div className="absolute inset-0 spotlight-radial opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            {children}
        </div>
    );
};
