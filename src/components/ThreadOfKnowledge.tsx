
import React, { useState, useRef } from 'react';
import { motion, PanInfo, useMotionValue } from 'framer-motion';
// import { useTheme } from '../contexts/ThemeContext'; // Theme handled by CSS vars
import ScrubberOrb from './ScrubberOrb';
import { formatTime } from '../utils/time';

interface ThreadOfKnowledgeProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ThreadOfKnowledge: React.FC<ThreadOfKnowledgeProps> = ({ currentTime, duration, onSeek }) => {
  // const { theme } = useTheme(); 
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const dragX = useMotionValue(0);
  const [tooltipTime, setTooltipTime] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : 0;
  const safeDuration = Number.isFinite(duration) ? duration : 0;

  const handleInteractionStart = (event: React.MouseEvent | React.TouchEvent | React.PointerEvent | React.KeyboardEvent) => {
    // For click/tap/drag start
    setIsDragging(true); // Simplified: dragging also covers click seeking state
    if (progressBarRef.current && safeDuration > 0 && 'clientX' in event) { // Click/Tap
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = (event as React.MouseEvent).clientX - rect.left;
        const seekPercentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = seekPercentage * safeDuration;
        onSeek(newTime);
        setTooltipTime(newTime); // Show tooltip on click as well
    } else if ('key' in event) { // Keyboard
        // Keyboard seeking logic
        let newTime = safeCurrentTime;
        if (event.key === 'ArrowLeft') newTime = Math.max(0, safeCurrentTime - 5);
        else if (event.key === 'ArrowRight') newTime = Math.min(safeDuration, safeCurrentTime + 5);
        else if (event.key === 'Home') newTime = 0;
        else if (event.key === 'End') newTime = safeDuration;
        
        if (newTime !== safeCurrentTime) {
            onSeek(newTime);
            setTooltipTime(newTime);
        }
    }
  };
  
  const handlePan = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!progressBarRef.current || safeDuration <= 0) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    // Calculate newX based on the direct pointer position relative to the bar's start
    // This assumes the pointer event's clientX is available and relevant
    let pointerX = 0;
    if ('clientX' in event) pointerX = (event as MouseEvent).clientX;
    else if ('touches' in event && event.touches.length > 0) pointerX = (event as TouchEvent).touches[0].clientX;

    const newX = Math.max(0, Math.min(pointerX - rect.left, rect.width));
    dragX.set(newX); 

    const seekPercentage = newX / rect.width;
    const newTime = seekPercentage * safeDuration;
    setTooltipTime(newTime);
    onSeek(newTime); // Seek live during pan
  };
  
  const handleInteractionEnd = () => {
    setIsDragging(false);
    setTooltipTime(null);
  };

  const trackStyle: React.CSSProperties = {
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)', 
    backgroundColor: 'var(--current-color-border)', // Use border or a muted color from theme
    height: '8px', 
    borderRadius: '4px',
  };

  const fillStyle: React.CSSProperties = {
    background: `linear-gradient(90deg, var(--current-color-accent-primary), var(--current-color-accent-secondary))`,
    height: '100%',
    borderRadius: '4px',
  };

  return (
    <div className="w-full flex items-center gap-2 px-1 relative">
      <span className="text-xs font-mono tabular-nums w-12 text-right theme-transition" style={{color: 'var(--current-color-text-secondary)'}}>
        {formatTime(safeCurrentTime)}
      </span>

      <motion.div
        ref={progressBarRef}
        className="group flex-1 h-6 flex items-center cursor-grab relative touch-none" // touch-none for better pan
        onPointerDown={handleInteractionStart as any} // Use pointer events for unified mouse/touch
        onPanStart={() => setIsDragging(true)} // Keep isDragging for ScrubberOrb visual state
        onPan={handlePan}
        onPanEnd={handleInteractionEnd}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { if (!isDragging) setIsHovering(false); }}
        onFocus={() => setIsHovering(true)}
        onBlur={() => { if (!isDragging) setIsHovering(false); }}
        role="slider"
        aria-valuenow={safeCurrentTime}
        aria-valuemin={0}
        aria-valuemax={safeDuration}
        aria-label="Audio progress"
        tabIndex={0}
        onKeyDown={handleInteractionStart as any}
      >
        <div className="relative w-full" style={trackStyle}>
          <motion.div
            style={fillStyle}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: 'spring' as const, stiffness: 150, damping: 25, mass:0.5 }}
          />
          <ScrubberOrb 
            progressPercentage={progressPercentage} 
            isDragging={isDragging || isHovering} // Orb active on hover too
          />
        </div>
      </motion.div>
      
      {(isDragging || (isHovering && tooltipTime === null)) && progressBarRef.current && (
        <motion.div
          className="absolute text-xs p-1 rounded theme-transition shadow-lg pointer-events-none"
          style={{
            backgroundColor: 'var(--current-color-surface)',
            color: 'var(--current-color-text-primary)',
            border: '1px solid var(--current-color-border)',
            x: progressBarRef.current ? (safeCurrentTime / safeDuration) * progressBarRef.current.offsetWidth : 0, 
            bottom: '100%', 
            marginBottom: '8px',
            left: 0, 
            transform: 'translateX(-50%)',
            minWidth: '40px',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{opacity:0, y:5}}
        >
          {formatTime(tooltipTime !== null ? tooltipTime : safeCurrentTime)}
        </motion.div>
      )}

      <span className="text-xs font-mono tabular-nums w-12 text-left theme-transition" style={{color: 'var(--current-color-text-secondary)'}}>
        {formatTime(safeDuration)}
      </span>
    </div>
  );
};

export default ThreadOfKnowledge;
