import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDeviceTier } from '../src/hooks/useDeviceTier';

interface IntertitleProps {
  text: string;
  subtext?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const Intertitle: React.FC<IntertitleProps> = ({
  text,
  subtext,
  align = 'center',
  className,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { isLowPower } = useDeviceTier();
  const alignClass =
    align === 'left'
      ? 'items-start text-left'
      : align === 'right'
      ? 'items-end text-right'
      : 'items-center text-center';

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{
        duration: isLowPower ? 0.6 : 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`intertitle ${alignClass} ${className ?? ''}`}
    >
      <span className="intertitle-title">{text}</span>
      {subtext && (
        <span className="intertitle-subtitle">
          {subtext}
        </span>
      )}
    </motion.div>
  );
};
