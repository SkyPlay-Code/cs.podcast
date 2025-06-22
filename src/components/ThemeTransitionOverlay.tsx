
import React, { useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const ThemeTransitionOverlay: React.FC = () => {
  const { isTransitioning, transitionDirection, completeActualThemeSwap } = useTheme();

  const commonOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    pointerEvents: 'none', // Allow clicks through if needed, though usually covers all
  };

  const lightWashVariants: Variants = {
    initial: {
      clipPath: 'circle(0% at 0% 0%)', // Start top-left
    },
    animate: {
      clipPath: 'circle(150% at 0% 0%)', // Expand to cover screen
      transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] as const },
    },
    exit: {
        // Optional: if it needs to animate out, though usually just disappears
        opacity: 0,
        transition: { duration: 0.3, delay: 0.2 } // Delay slightly after theme swap
    }
  };

  const darkFadeVariants: Variants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeInOut' as const }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.6, ease: 'easeInOut' as const, delay: 0.2 } // Fade out after theme swap
    },
  };
  
  // Track when animation starts to call completeActualThemeSwap mid-way or as needed
  // This is a simplified approach; more complex sync might be needed.
  useEffect(() => {
    if (isTransitioning) {
        // For 'toLight', swap when wash is about half-way or starting to reveal
        // For 'toDark', swap when overlay is fully opaque
        const swapDelay = transitionDirection === 'toLight' ? 600 : 500; // ms
        
        const timer = setTimeout(() => {
            completeActualThemeSwap();
        }, swapDelay);
        return () => clearTimeout(timer);
    }
  }, [isTransitioning, transitionDirection, completeActualThemeSwap]);

  return (
    <AnimatePresence>
      {isTransitioning && transitionDirection === 'toLight' && (
        <motion.div
          key="light-wash-overlay"
          style={{
            ...commonOverlayStyle,
            background: 'radial-gradient(circle at 0% 0%, var(--color-light-wash-start) 0%, var(--color-light-wash-end) 70%)',
          }}
          variants={lightWashVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          // onAnimationComplete might be too late for theme swap, hence useEffect above
        />
      )}
      {isTransitioning && transitionDirection === 'toDark' && (
        <motion.div
          key="dark-fade-overlay"
          style={{
            ...commonOverlayStyle,
            backgroundColor: 'var(--dark-overlay-color)',
          }}
          variants={darkFadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      )}
    </AnimatePresence>
  );
};

export default ThemeTransitionOverlay;
