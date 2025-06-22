
import React from 'react';
import { motion } from 'framer-motion';

interface ScrubberOrbProps {
  progressPercentage: number;
  isDragging: boolean;
  theme: 'light' | 'dark'; // Passed from parent for styling convenience
}

const ScrubberOrb: React.FC<ScrubberOrbProps> = ({ progressPercentage, isDragging, theme }) => {
  const orbSize = isDragging ? 20 : 16; // Larger when dragging
  const shadowIntensity = isDragging ? (theme === 'dark' ? '0 0 15px 3px' : '0 0 12px 2px') : (theme === 'dark' ? '0 0 10px' : '0 0 8px');
  
  return (
    <motion.div
      className="absolute top-1/2 rounded-full cursor-grab"
      style={{
        width: orbSize,
        height: orbSize,
        // Calculate left position based on progress. Center orb on the progress line.
        left: `calc(${progressPercentage}% - ${orbSize / 2}px)`, 
        y: '-50%', // Vertically center on the track
        background: `radial-gradient(circle, var(--current-color-accent-primary) 30%, ${theme === 'dark' ? 'var(--color-accent-secondary-dark)' : 'var(--current-color-accent-primary)'}99 100%)`,
        boxShadow: `${shadowIntensity} var(--current-color-accent-primary)`,
        border: `2px solid ${theme === 'dark' ? 'var(--color-background-dark)' : 'var(--color-surface-light)'}`, // Contrast border
      }}
      animate={{
        scale: isDragging ? 1.1 : [1, 1.05, 1], // Pulse animation when not dragging
        boxShadow: `${shadowIntensity} var(--current-color-accent-primary)`,
      }}
      transition={{
        scale: isDragging ? { type: 'spring', stiffness: 300, damping: 20 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        boxShadow: { duration: 0.2 }
      }}
    />
  );
};

export default ScrubberOrb;
