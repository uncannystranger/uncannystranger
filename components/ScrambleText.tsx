import { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const shouldReduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
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
  }, [durationMs, startDelayMs, text]);

  return (
    <span
      key={text}
      className={className}
      aria-hidden={ariaHidden}
    >
      {output}
    </span>
  );
};

export default ScrambleText;
