
import React from 'react';
import { motion, MotionStyle } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface ScrubberOrbProps {
  progressPercentage: number;
  isDragging: boolean; // Renamed from isDragging to be more generic for hover state too
}

const ScrubberOrb: React.FC<ScrubberOrbProps> = ({ progressPercentage, isDragging }) => {
  const { theme } = useTheme(); 
  const orbSize = isDragging ? 18 : 14; // Slightly larger when active
  const shadowOpacity = isDragging ? 0.5 : 0.3;
  const shadowBlur = isDragging ? '10px' : '6px';
  
  const orbBaseStyle: MotionStyle = {
    width: orbSize,
    height: orbSize,
    // Position orb based on progress. Ensure it's centered on the fill line end.
    left: `calc(${progressPercentage}% - ${orbSize / 2}px)`, 
    top: '50%', // Centered on the track, which is now 8px high
    y: '-50%', // Framer motion transform for centering
    backgroundColor: 'var(--current-color-accent-primary)',
    // Dynamic shadow based on state for a more "alive" feel
    boxShadow: `0 0 ${shadowBlur} rgba(var(--rgb-accent-primary-val, 212, 175, 55), ${shadowOpacity}), 0 1px 2px rgba(0,0,0,0.4)`,
    // Border for definition, using surface color of the current theme
    border: `2px solid var(--current-color-surface)`, 
    borderRadius: '50%', // Ensure it's always a circle
    position: 'absolute', // Positioned within the progress bar track
    cursor: 'grab',
    transition: 'width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease', // Smooth size and shadow changes
  };
  
  // Define --rgb-accent-primary-val in global.css if not already, e.g.
  // body[data-theme='dark'] { --rgb-accent-primary-val: 212, 175, 55; }
  // body[data-theme='light'] { --rgb-accent-primary-val: 139, 111, 30; }


  return (
    <motion.div
      style={orbBaseStyle}
      animate={{
        scale: isDragging ? 1.1 : 1,
      }}
      transition={{
        scale: { type: 'spring' as const, stiffness: 400, damping: 15 },
      }}
      // The continuous pulse animation might be too much, focus on interactive feedback
      // whileHover={{ scale: 1.1 }} // Already handled by isDragging prop effectively
    />
  );
};

export default ScrubberOrb;
