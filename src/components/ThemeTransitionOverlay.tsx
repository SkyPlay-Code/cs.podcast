
import React, { useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const ThemeTransitionOverlay: React.FC = () => {
  const { isTransitioning, transitionDirection, completeActualThemeSwap, finalizeTransition } = useTheme();

  const commonOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    pointerEvents: 'none',
  };

  const lightWashVariants: Variants = {
    initial: {
      clipPath: 'circle(0% at 0% 0%)',
    },
    animate: {
      clipPath: 'circle(150% at 0% 0%)', // Ensure it covers the whole screen
      transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] as const },
    },
    exit: { // Fade out quickly after revealing the light theme
      opacity: 0,
      transition: { duration: 0.3, delay: 0 }, // No delay, start fade out as soon as exit starts
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
      transition: { duration: 0.6, ease: 'easeInOut' as const } 
    },
  };
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isTransitioning) {
        const swapDelay = transitionDirection === 'toLight' ? 600 : 500; // ms
        
        timer = setTimeout(() => {
            completeActualThemeSwap();
        }, swapDelay);
    }
    return () => clearTimeout(timer);
  }, [isTransitioning, transitionDirection, completeActualThemeSwap]);

  return (
    <AnimatePresence onExitComplete={finalizeTransition}>
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