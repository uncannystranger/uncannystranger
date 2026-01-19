// Cloudinary URL helper (FAST + LCP optimized)
export function cld(publicId: string, width?: number): string {
  const parts = publicId.split('/').map(encodeURIComponent).join('/');

  const transformations = [
    'f_auto',
    'q_auto',
    'dpr_auto',
    'c_fill',
  ];

  if (width) transformations.push(`w_${width}`);

  return `https://res.cloudinary.com/duwhuzkib/image/upload/${transformations.join(',')}/${parts}`;
}

/* ================= GLOBAL SYSTEM CONSTANTS ================= */

export const MOTION = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
  },
  ease: [0.4, 0, 0.2, 1] as const,
};

export const INTERACTION = {
  hoverScale: 1.01,
  activeScale: 0.98,
};

export const SOUND = {
  fadeStep: 0.05,
  fadeInterval: 60,
};

/** SAFE — call inside useEffect only */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};