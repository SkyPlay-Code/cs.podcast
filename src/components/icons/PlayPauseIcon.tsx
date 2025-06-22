
import React from "react";
import { motion } from "framer-motion";

interface PlayPauseIconProps {
  isPlaying: boolean;
  className?: string;
  color?: string; // Expect color to be passed, e.g., 'var(--current-color-surface)'
  size?: number;
}

const PlayPauseIcon: React.FC<PlayPauseIconProps> = ({ 
  isPlaying, 
  className = "w-6 h-6", 
  color = "currentColor", // Default, but parent should provide theme-aware color
  size = 24
}) => {
  const playPath = "M8 5 L8 19 L19 12 Z";
  const pausePath = "M6 5 L6 19 L10 19 L10 5 Z M14 5 L14 19 L18 19 L18 5 Z";

  return (
    <svg 
        viewBox="0 0 24 24" 
        className={className} 
        // stroke and fill should be controlled by the 'color' prop for thematic consistency
        // stroke={color} 
        fill={color} 
        strokeWidth="0" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size }}
    >
      <motion.path
        key={isPlaying ? "pause" : "play"}
        d={isPlaying ? pausePath : playPath}
        initial={{ opacity: 0.5, scale: 0.8 }} // Smoother entry for icon switch
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.15, ease: "easeInOut" }} // Quicker, smoother ease
      />
    </svg>
  );
};

export default PlayPauseIcon;
