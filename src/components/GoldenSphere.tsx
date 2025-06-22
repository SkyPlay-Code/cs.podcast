
import React from 'react';
import { motion, MotionValue } from 'framer-motion';

interface GoldenSphereProps { // Renamed from ScrubberOrbProps
  xMotionValue: MotionValue<number>;
  constraintsRef: React.RefObject<HTMLElement>;
  onDragStart: () => void;
  onDrag: (x: number) => void;
  onDragEnd: () => void;
  isInteracting: boolean;
}

const GoldenSphere: React.FC<GoldenSphereProps> = ({ 
  xMotionValue, 
  constraintsRef,
  onDragStart,
  onDrag,
  onDragEnd,
  isInteracting
}) => {
  const sphereSize = isInteracting ? 20 : 16; // Slightly larger when active
  const shadowOpacity = isInteracting ? 0.6 : 0.4;
  const shadowBlur = isInteracting ? '8px' : '5px';

  // 3D Gold gradient for the sphere
  // Corrected "золото" which likely was a placeholder for FFD700 if not a valid hex.
  const goldGradient = `radial-gradient(circle at 35% 35%, #FFFDE4 5%, #FFD700 30%, #D4AF37 60%, #B8860B 100%)`; 

  return (
    <motion.div
      drag="x"
      dragConstraints={constraintsRef}
      dragElastic={0.05} // Less elastic for a "heavier" stop at boundaries
      dragMomentum={false} // Important for "heavy" feel, prevents overshooting
      style={{
        x: xMotionValue, // Controlled by parent's motion value
        width: sphereSize,
        height: sphereSize,
        borderRadius: '50%',
        background: goldGradient, // Use the corrected 3D Gold gradient
        boxShadow: `0 0 ${shadowBlur} rgba(var(--current-rgb-accent-primary-val), ${shadowOpacity}), 0 2px 3px rgba(0,0,0,0.3)`,
        border: `1px solid rgba(255,255,255,0.3)`, // Subtle highlight edge
        position: 'absolute',
        top: '50%',
        translateY: '-50%', // Ensures vertical centering on the track
        cursor: 'grab',
        zIndex: 10, // Ensure it's above the fill
        transition: 'width 0.15s ease-out, height 0.15s ease-out, box-shadow 0.15s ease-out', // Smooth size/shadow changes
      }}
      onDragStart={onDragStart}
      onDrag={(event, info) => {
        // xMotionValue is already updated by Framer Motion internally during drag
        // We call onDrag with the current value of the motion value
        onDrag(xMotionValue.get());
      }}
      onDragEnd={onDragEnd}
      dragTransition={{
        power: 0.1, // Lower power reduces the influence of initial velocity
        bounceStiffness: 200, // Moderately stiff for a firm stop
        bounceDamping: 30,    // High damping for "heavy" feel, reduces oscillation
        timeConstant: 250,    // Influences how quickly it settles after drag release
      }}
      whileTap={{ cursor: 'grabbing', scale: 1.1 }}
      animate={{ scale: isInteracting ? 1.1 : 1 }}
      transition={{ scale: { type: 'spring', stiffness: 300, damping: 20 } }}
    />
  );
};

export default GoldenSphere;
