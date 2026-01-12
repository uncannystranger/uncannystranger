import React, { useEffect, useState } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number; // ms per frame
}

const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className,
  speed = 18,
}) => {
  const [output, setOutput] = useState(text);

  useEffect(() => {
    let frame = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const scramble = () => {
      frame++;

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
        requestAnimationFrame(scramble);
      } else {
        setOutput(text);
      }
    };

    scramble();
  }, [text]);

  return <span className={className}>{output}</span>;
};

export default ScrambleText;