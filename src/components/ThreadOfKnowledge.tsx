
import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import ScrubberOrb from './ScrubberOrb'; // To be created
import { formatTime } from '../utils/time';

interface ThreadOfKnowledgeProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  // TODO: Add props for Cerebral Field interaction: onDragStart, onDrag, onDragEnd
}

const ThreadOfKnowledge: React.FC<ThreadOfKnowledgeProps> = ({ currentTime, duration, onSeek }) => {
  const { theme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  
  // For tooltip
  const dragX = useMotionValue(0);
  const [tooltipTime, setTooltipTime] = useState<number | null>(null);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : 0;
  const safeDuration = Number.isFinite(duration) ? duration : 0;

  const handlePan = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!progressBarRef.current || safeDuration <= 0) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(info.offset.x, rect.width));
    dragX.set(newX); // For tooltip positioning relative to bar start

    const seekPercentage = newX / rect.width;
    const newTime = seekPercentage * safeDuration;
    setTooltipTime(newTime); // Update tooltip display time
    onSeek(newTime);
    // TODO: Call onDrag prop for Cerebral Field chronon particles
  };

  const handlePanStart = () => {
    setIsDragging(true);
    setTooltipTime(safeCurrentTime); // Show tooltip immediately
    // TODO: Call onDragStart for Cerebral Field
  };
  
  const handlePanEnd = () => {
    setIsDragging(false);
    setTooltipTime(null); // Hide tooltip
    // TODO: Call onDragEnd for Cerebral Field (pop animation, shockwave)
  };

  const trackStyle: React.CSSProperties = {
    // Recessed groove using inset shadows
    boxShadow: theme === 'dark' 
      ? 'inset 0 1px 2px rgba(0,0,0,0.5), inset 0 0 3px var(--color-accent-primary-dark)'
      : 'inset 0 1px 3px rgba(0,0,0,0.2)',
    backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)',
  };

  const fillStyle: React.CSSProperties = {
    // Volumetric glowing fill
    background: `linear-gradient(90deg, var(--current-color-accent-primary), ${theme === 'dark' ? 'var(--color-accent-secondary-dark)' : 'var(--color-accent-primary-light)'}99 )`,
    boxShadow: `0 0 8px var(--current-color-accent-primary)${theme === 'dark' ? 'AA' : '77'}`,
  };


  return (
    <div className="w-full flex items-center gap-2 px-1 relative">
      <span className="text-xs font-mono tabular-nums w-12 text-right theme-transition" style={{color: 'var(--current-color-text-secondary)'}}>
        {formatTime(safeCurrentTime)}
      </span>

      <motion.div
        ref={progressBarRef}
        className="group flex-1 h-5 flex items-center cursor-grab relative" // h-5 for better grab target
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        role="slider"
        aria-valuenow={safeCurrentTime}
        aria-valuemin={0}
        aria-valuemax={safeDuration}
        aria-label="Audio progress"
        tabIndex={0}
         // Basic keyboard seeking (can be enhanced)
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') onSeek(Math.max(0, safeCurrentTime - 5));
          else if (e.key === 'ArrowRight') onSeek(Math.min(safeDuration, safeCurrentTime + 5));
        }}
      >
        {/* Track */}
        <div className="relative w-full h-1.5 rounded-full" style={trackStyle}>
          {/* Fill */}
          <motion.div
            className="absolute h-full rounded-full"
            style={{...fillStyle, width: `${progressPercentage}%` }}
          />
          {/* ScrubberOrb will be positioned based on progressPercentage */}
          <ScrubberOrb 
            progressPercentage={progressPercentage} 
            isDragging={isDragging} 
            theme={theme}
          />
        </div>
      </motion.div>
      
      {/* Tooltip for scrub time */}
      {isDragging && tooltipTime !== null && progressBarRef.current && (
        <motion.div
          className="absolute text-xs p-1 rounded theme-transition shadow-lg"
          style={{
            backgroundColor: 'var(--current-color-surface)',
            color: 'var(--current-color-text-primary)',
            border: '1px solid var(--current-color-border)',
            x: dragX, // Position relative to bar start
            bottom: '100%', // Position above the bar
            marginBottom: '8px',
            left: 0, // Initial left for dragX to work from
            transform: 'translateX(-50%)', // Center tooltip on dragX point
            minWidth: '40px',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {formatTime(tooltipTime)}
        </motion.div>
      )}

      <span className="text-xs font-mono tabular-nums w-12 text-left theme-transition" style={{color: 'var(--current-color-text-secondary)'}}>
        {formatTime(safeDuration)}
      </span>
    </div>
  );
};

export default ThreadOfKnowledge;

