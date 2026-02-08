import React, { useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useScrollDirection } from '../src/hooks/useScrollDirection';

const GRADIENT_PALETTES = [
  ['#ffb703', '#fb8500', '#8ecae6', '#219ebc'],
  ['#ffd6ff', '#bdb2ff', '#a0c4ff', '#9bf6ff'],
  ['#f1faee', '#e63946', '#a8dadc', '#457b9d'],
  ['#ffafcc', '#ffc8dd', '#cdb4db', '#bde0fe'],
  ['#ffd166', '#ef476f', '#06d6a0', '#118ab2'],
];

export const Orb: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const direction = useScrollDirection();

  /* ---------- palette evolution ---------- */
  const [paletteIndex, setPaletteIndex] = useState(0);
  const palette = GRADIENT_PALETTES[paletteIndex];

  const nextPalette = () => {
    setPaletteIndex((i) => (i + 1) % GRADIENT_PALETTES.length);
  };

  /* ---------- cursor magnet ---------- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.15);
    my.set((e.clientY - r.top - r.height / 2) * 0.15);
  };

  /* ---------- scroll aware rotation ---------- */
  const rotate = direction === 'down' ? 360 : -360;

  /* ---------- stars ---------- */
  const stars = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 2,
      })),
    []
  );

  return (
    <div className="flex flex-col md:flex-row items-center gap-16">
      {/* ================= ORB ================= */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onClick={nextPalette}
        style={{ x: sx, y: sy }}
        animate={{ rotate }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="relative w-[220px] h-[220px] rounded-full cursor-pointer"
      >
        {/* GLOW */}
        <div
          className="absolute inset-[-20%] rounded-full blur-3xl opacity-60"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${palette[0]}, transparent 60%)`,
          }}
        />

        {/* ORB BODY */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, ${palette[0]}, transparent 55%),
              radial-gradient(circle at 70% 60%, ${palette[1]}, transparent 60%),
              radial-gradient(circle at 40% 80%, ${palette[2]}, transparent 65%),
              radial-gradient(circle at 80% 20%, ${palette[3]}, transparent 60%)
            `,
          }}
        >
          {/* SOFT WARP */}
          <motion.div
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 opacity-40"
            style={{
              background:
                'linear-gradient(120deg, rgba(255,255,255,0.15), rgba(255,255,255,0))',
            }}
          />

          {/* STARS */}
          {stars.map((s) => (
            <motion.span
              key={s.id}
              className="absolute rounded-full bg-white/80"
              style={{
                width: s.size,
                height: s.size,
                left: `${s.x}%`,
                top: `${s.y}%`,
              }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 2 + s.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* ================= BIO ================= */}
      <div className="max-w-md text-center md:text-left">
        <p className="text-xs tracking-[0.4em] uppercase opacity-60 mb-4">
          ARAGTI AAMUSAN
        </p>
        <h3 className="text-3xl md:text-4xl font-serif italic mb-6">
          Indhuhu ma qaadaan, way sugaan
        </h3>
        <p className="text-sm leading-relaxed opacity-70 font-serif">
          Sawirku wuxuu dhashaa marka wax walba degaan.
        </p>
      </div>
    </div>
  );
};