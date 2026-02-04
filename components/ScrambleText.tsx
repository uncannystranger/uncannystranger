import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ScrambleTextProps {
  text: string;
  className?: string;
}

const ScrambleText = ({ text, className }: ScrambleTextProps) => {
  const [output, setOutput] = useState(text);
  const hasRun = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    if (shouldReduceMotion) {
      setOutput(text);
      return;
    }

    let frame = 0;
    let rafId = 0;
    let idleId: number | null = null;
    let idleMode: 'idle' | 'timeout' | null = null;
    let lastTime = 0;

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const scramble = (time: number) => {
      if (time - lastTime < 32) {
        rafId = requestAnimationFrame(scramble);
        return;
      }
      lastTime = time;
      frame += 3; // 🔥 FAST

      setOutput(
        text
          .split('')
          .map((char, i) => {
            if (i < frame / 2) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (frame < text.length * 2) {
        rafId = requestAnimationFrame(scramble);
      } else {
        setOutput(text);
      }
    };

    const start = () => {
      rafId = requestAnimationFrame(scramble);
    };

    // ✅ Start AFTER first paint + idle window to reduce main-thread contention
    const hasWindow = typeof window !== 'undefined';
    if (hasWindow && typeof (window as any).requestIdleCallback === 'function') {
      idleMode = 'idle';
      idleId = (window as any).requestIdleCallback(start, { timeout: 600 });
    } else {
      idleMode = 'timeout';
      idleId = (hasWindow ? window : globalThis).setTimeout(start, 120);
    }

    return () => {
      if (idleId !== null && idleMode === 'idle') {
        (window as any).cancelIdleCallback(idleId);
      }
      if (idleId !== null && idleMode === 'timeout') {
        (hasWindow ? window : globalThis).clearTimeout(idleId);
      }
      cancelAnimationFrame(rafId);
    };
  }, [text, shouldReduceMotion]);

  return (
    <motion.span
      key={text}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {output}
    </motion.span>
  );
};

export default ScrambleText;
