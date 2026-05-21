import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ScrambleTextProps {
  text: string;
  className?: string;
  durationMs?: number;
  startDelayMs?: number;
  ariaHidden?: boolean;
}

const completedScrambles = new Set<string>();

const ScrambleText = ({
  text,
  className,
  durationMs = 820,
  startDelayMs = 80,
  ariaHidden = false,
}: ScrambleTextProps) => {
  const [output, setOutput] = useState(text);
  const hasRun = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    if (shouldReduceMotion || completedScrambles.has(text)) {
      setOutput(text);
      return;
    }

    let rafId = 0;
    let timeoutId = 0;
    let startedAt = 0;

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    const scramble = (time: number) => {
      if (!startedAt) startedAt = time;
      const progress = Math.min(1, (time - startedAt) / durationMs);
      const resolvedCount = Math.floor(progress * text.length);

      setOutput(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return char;
            if (i <= resolvedCount) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (progress < 1) {
        rafId = requestAnimationFrame(scramble);
      } else {
        completedScrambles.add(text);
        setOutput(text);
      }
    };

    timeoutId = window.setTimeout(() => {
      rafId = requestAnimationFrame(scramble);
    }, startDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [durationMs, startDelayMs, text, shouldReduceMotion]);

  return (
    <motion.span
      key={text}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
      aria-hidden={ariaHidden}
    >
      {output}
    </motion.span>
  );
};

export default ScrambleText;
