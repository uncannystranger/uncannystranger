import { useEffect, useRef, useState } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
}

const ScrambleText = ({ text, className }: ScrambleTextProps) => {
  const [output, setOutput] = useState(text);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    let frame = 0;
    let rafId: number;

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const scramble = () => {
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

    // ✅ Start AFTER first paint — no black screen
    requestAnimationFrame(scramble);

    return () => cancelAnimationFrame(rafId);
  }, [text]);

  return <span className={className}>{output}</span>;
};

export default ScrambleText;