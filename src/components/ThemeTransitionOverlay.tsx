
import React from 'react';
import { motion, AnimatePresence, Variants, AnimationDefinition } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const ThemeTransitionOverlay: React.FC = () => {
  const { 
    isOverlayVisible, 
    transitionDirection, 
    completeActualThemeSwap, 
    cleanupAfterOverlayExit 
  } = useTheme();

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
      clipPath: 'circle(150% at 0% 0%)', 
      transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] as const },
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3, delay: 0 },
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
  
  // This handler will be called when the entry animation of an overlay completes.
  const handleEntryAnimationComplete = (definition: AnimationDefinition) => {
    // We only care about the completion of the 'animate' (entry) variant
    if (typeof definition === 'string' && definition === 'animate') {
        completeActualThemeSwap();
    } else if (typeof definition === 'object' && definition !== null && Object.keys(definition).length > 0) {
        // If definition is an object, it's a target. Assume it's the entry.
        // This check might need refinement based on exact Framer Motion behavior with complex variants.
        // For simple 'initial'/'animate'/'exit', checking string 'animate' is safer.
        // However, if animate is an object target, this might be the only way.
        // Let's assume for now that if it's not 'initial' or 'exit', it's related to entry.
        // A safer check: check if the definition matches the 'animate' variant from your variants object.
        if (transitionDirection === 'toLight' && definition === lightWashVariants.animate) {
            completeActualThemeSwap();
        } else if (transitionDirection === 'toDark' && definition === darkFadeVariants.animate) {
            completeActualThemeSwap();
        }
    }
  };


  return (
    <AnimatePresence onExitComplete={cleanupAfterOverlayExit}>
      {isOverlayVisible && transitionDirection === 'toLight' && (
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
          onAnimationComplete={handleEntryAnimationComplete}
        />
      )}
      {isOverlayVisible && transitionDirection === 'toDark' && (
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
          onAnimationComplete={handleEntryAnimationComplete}
        />
      )}
    </AnimatePresence>
  );
};

export default ThemeTransitionOverlay;
