

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, PanInfo, AnimatePresence } from 'framer-motion';
import GoldenSphere from './GoldenSphere'; // Updated from ScrubberOrb
import { formatTime } from '../utils/time';

interface ProgressBarInlayProps { // Renamed from ThreadOfKnowledgeProps
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressBarInlay: React.FC<ProgressBarInlayProps> = ({ currentTime, duration, onSeek }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false); // Combines dragging and track click states
  const [tooltipTime, setTooltipTime] = useState<number | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipX, setTooltipX] = useState(0);

  const scrubberX = useMotionValue(0); // Motion value for GoldenSphere's X position

  const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : 0;
  const safeDuration = Number.isFinite(duration) ? duration : 0;

  // Update scrubber and fill when currentTime or duration changes externally
  useEffect(() => {
    if (trackRef.current && safeDuration > 0 && !isInteracting) {
      const newX = (safeCurrentTime / safeDuration) * trackRef.current.offsetWidth;
      scrubberX.set(newX);
    }
  }, [safeCurrentTime, safeDuration, scrubberX, isInteracting]);


  const calculateTimeFromX = useCallback((xPosition: number) => {
    if (trackRef.current && safeDuration > 0) {
      const rect = trackRef.current.getBoundingClientRect();
      const seekPercentage = Math.max(0, Math.min(1, xPosition / rect.width));
      return seekPercentage * safeDuration;
    }
    return 0;
  }, [safeDuration]);

  // Handle track click for seeking
  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (trackRef.current && safeDuration > 0) {
      const rect = trackRef.current.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const newTime = calculateTimeFromX(clickX);
      onSeek(newTime);
      scrubberX.set(clickX); // Move scrubber immediately on click
      
      // Show tooltip briefly on click
      setTooltipTime(newTime);
      setTooltipX(clickX);
      setTooltipVisible(true);
      setTimeout(() => setTooltipVisible(false), 1000);
    }
  };
  
  // Handle dragging of GoldenSphere
  const handleSphereDragStart = () => {
    setIsInteracting(true);
    setTooltipVisible(true);
  };

  const handleSphereDrag = (newX: number) => {
    if (!trackRef.current) return;
    const newTime = calculateTimeFromX(newX);
    setTooltipTime(newTime);
    setTooltipX(newX); // Update tooltip X based on sphere's actual dragged X
    // Live seek can be performance intensive, consider debouncing or seeking onDragEnd only
    // For now, live seek:
    onSeek(newTime);
  };

  const handleSphereDragEnd = () => {
    setIsInteracting(false);
    setTooltipVisible(false);
    // Final seek call to ensure consistency if onDrag was debounced
    const finalX = scrubberX.get();
    const finalTime = calculateTimeFromX(finalX);
    onSeek(finalTime);
  };
  
  const handleTrackHover = (event: React.MouseEvent<HTMLDivElement>) => {
    if (trackRef.current && safeDuration > 0 && !isInteracting) {
        const rect = trackRef.current.getBoundingClientRect();
        const hoverX = event.clientX - rect.left;
        setTooltipTime(calculateTimeFromX(hoverX));
        setTooltipX(hoverX);
        setTooltipVisible(true);
    }
  };

  const handleTrackLeave = () => {
    if (!isInteracting) {
        setTooltipVisible(false);
    }
  };

  const fillPercentage = safeDuration > 0 ? (safeCurrentTime / safeDuration) * 100 : 0;

  return (
    <div className="w-full flex items-center gap-2 px-1 relative">
      <span className="text-xs font-mono tabular-nums w-12 text-right theme-transition" style={{color: 'var(--current-color-text-secondary)'}}>
        {formatTime(safeCurrentTime)}
      </span>

      <div
        ref={trackRef}
        className="group flex-1 h-6 flex items-center cursor-pointer relative touch-none"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)', // Carved channel
          backgroundColor: 'rgba(0,0,0,0.2)', // Darkens the channel
          height: '12px', // Height for the channel effect
          borderRadius: '6px',
        }}
        onClick={handleTrackClick}
        onMouseMove={handleTrackHover}
        onMouseLeave={handleTrackLeave}
        role="slider"
        aria-valuenow={safeCurrentTime}
        aria-valuemin={0}
        aria-valuemax={safeDuration}
        aria-label="Audio progress"
        tabIndex={0} // Make focusable for potential keyboard controls (not fully implemented here)
        onKeyDown={(e) => { // Basic keyboard seeking example
          let newTime = safeCurrentTime;
          if (e.key === 'ArrowLeft') newTime = Math.max(0, safeCurrentTime - 5);
          else if (e.key === 'ArrowRight') newTime = Math.min(safeDuration, safeCurrentTime + 5);
          if (newTime !== safeCurrentTime) onSeek(newTime);
        }}
      >
        {/* Fill for molten gold */}
        <motion.div
          className="molten-gold-fill" // Class for shimmer animation
          style={{
            width: `${fillPercentage}%`,
            background: 'linear-gradient(90deg, #D4AF37, #FFD700)', // Molten gold
            backgroundSize: '200% 100%', // For shimmer animation
            height: '100%',
            borderRadius: '6px', // Match channel's border radius
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 25, mass: 0.5 }}
        />
        
        <GoldenSphere
          xMotionValue={scrubberX}
          constraintsRef={trackRef}
          onDragStart={handleSphereDragStart}
          onDrag={handleSphereDrag}
          onDragEnd={handleSphereDragEnd}
          isInteracting={isInteracting}
        />
      </div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {tooltipVisible && tooltipTime !== null && (
          <motion.div
            className="absolute text-xs p-1 rounded theme-transition shadow-lg pointer-events-none whitespace-nowrap"
            style={{
              backgroundColor: 'var(--current-color-surface)',
              color: 'var(--current-color-text-primary)',
              border: '1px solid var(--current-color-border)',
              bottom: '100%', 
              marginBottom: '8px',
              left: tooltipX, // Position based on hover/drag X
              transform: 'translateX(-50%)',
              minWidth: '40px',
              textAlign: 'center',
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5, transition: {duration: 0.1} }}
            transition={{duration: 0.15}}
          >
            {formatTime(tooltipTime)}
          </motion.div>
        )}
      </AnimatePresence>

      <span className="text-xs font-mono tabular-nums w-12 text-left theme-transition" style={{color: 'var(--current-color-text-secondary)'}}>
        {formatTime(safeDuration)}
      </span>
    </div>
  );
};

export default ProgressBarInlay;
