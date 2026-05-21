import React, { useMemo } from 'react';
import './FloatingLines.css';

type Wave = 'top' | 'middle' | 'bottom';
type WavePosition = { x?: number; y?: number; rotate?: number };

interface FloatingLinesProps {
  linesGradient?: string[];
  gradientStart?: string;
  gradientMid?: string;
  gradientEnd?: string;
  enabledWaves?: Wave[];
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  className?: string;
}

const viewBox = { width: 1440, height: 720 };

const waveDefaults: Record<Wave, Required<WavePosition>> = {
  top: { x: -96, y: 118, rotate: -2 },
  middle: { x: -36, y: 330, rotate: 1 },
  bottom: { x: -120, y: 548, rotate: -1.5 },
};

const waveClass: Record<Wave, string> = {
  top: 'floating-lines-wave-top',
  middle: 'floating-lines-wave-middle',
  bottom: 'floating-lines-wave-bottom',
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

export default function FloatingLines({
  linesGradient,
  gradientStart = 'var(--flow-line-start)',
  gradientMid = 'var(--flow-line-mid)',
  gradientEnd = 'var(--flow-line-end)',
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = 4,
  lineDistance = 16,
  topWavePosition,
  middleWavePosition,
  bottomWavePosition,
  animationSpeed = 0.32,
  mixBlendMode = 'normal',
  className = '',
}: FloatingLinesProps) {
  const gradient = linesGradient?.length
    ? linesGradient.slice(0, 3)
    : [gradientStart, gradientMid, gradientEnd];

  const getLineCount = (wave: Wave) => {
    if (typeof lineCount === 'number') return clamp(lineCount, 1, 10);
    const index = enabledWaves.indexOf(wave);
    return clamp(lineCount[index] ?? 4, 1, 10);
  };

  const getLineDistance = (wave: Wave) => {
    if (typeof lineDistance === 'number') return lineDistance;
    const index = enabledWaves.indexOf(wave);
    return lineDistance[index] ?? 16;
  };

  const positions: Record<Wave, WavePosition | undefined> = {
    top: topWavePosition,
    middle: middleWavePosition,
    bottom: bottomWavePosition,
  };

  const paths = useMemo(
    () =>
      enabledWaves.flatMap((wave) => {
        const count = getLineCount(wave);
        const distance = getLineDistance(wave);
        const base = { ...waveDefaults[wave], ...positions[wave] };

        return Array.from({ length: count }, (_, index) => {
          const y = base.y + (index - (count - 1) / 2) * distance;
          const intensity = wave === 'middle' ? 1 : wave === 'top' ? 0.72 : 0.58;
          const d = [
            `M ${-90 + base.x} ${y}`,
            `C ${230 + base.x} ${y - 82 * intensity}, ${405 + base.x} ${y + 104 * intensity}, ${710 + base.x} ${y + 8}`,
            `S ${1120 + base.x} ${y - 92 * intensity}, ${1530 + base.x} ${y + 42 * intensity}`,
          ].join(' ');

          return {
            d,
            key: `${wave}-${index}`,
            opacity: 0.18 + index * 0.018,
            rotate: base.rotate,
            wave,
          };
        });
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabledWaves.join(','), JSON.stringify(lineCount), JSON.stringify(lineDistance)]
  );

  return (
    <div
      className={`floating-lines-container ${className}`}
      aria-hidden="true"
      style={{
        mixBlendMode,
        ['--flow-line-speed' as string]: `${clamp(28 / Math.max(animationSpeed, 0.1), 32, 120)}s`,
      }}
    >
      <svg
        className="floating-lines-svg"
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="floating-lines-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradient[0]} stopOpacity="0.08" />
            <stop offset="48%" stopColor={gradient[1] ?? gradient[0]} stopOpacity="0.45" />
            <stop offset="100%" stopColor={gradient[2] ?? gradient[1] ?? gradient[0]} stopOpacity="0.16" />
          </linearGradient>
        </defs>
        {paths.map((path) => (
          <g
            key={path.key}
            className={`floating-lines-wave ${waveClass[path.wave]}`}
            opacity={path.opacity}
            transform={`rotate(${path.rotate} ${viewBox.width / 2} ${viewBox.height / 2})`}
          >
            <path className="floating-lines-path" d={path.d} />
          </g>
        ))}
      </svg>
    </div>
  );
}
