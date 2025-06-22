
import React from "react";
import { motion, useCycle } from "framer-motion";

interface PlayPauseIconProps {
  isPlaying: boolean;
  className?: string;
  color?: string;
  size?: number;
}

const PlayPauseIcon: React.FC<PlayPauseIconProps> = ({ 
  isPlaying, 
  className = "w-6 h-6", 
  color = "currentColor",
  size = 24
}) => {
  const playPath = "M8 5 L8 19 L19 12 Z"; // Triangle for Play
  // Two rectangles for Pause. Ensure points allow smooth morph if possible, or accept a cross-fade like morph
  const pausePath = "M6 5 L6 19 L10 19 L10 5 Z M14 5 L14 19 L18 19 L18 5 Z";

  // Using a key change for simple switch, true morph is more complex path animation
  return (
    <svg 
        viewBox="0 0 24 24" 
        className={className} 
        stroke={color} 
        fill={color} 
        strokeWidth="0" // Assuming filled icons
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size }}
    >
      <motion.path
        key={isPlaying ? "pause" : "play"} // Change key to force re-render for simple switch
        d={isPlaying ? pausePath : playPath}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }} // Short duration for quick switch
      />
    </svg>
  );
};

export default PlayPauseIcon;
