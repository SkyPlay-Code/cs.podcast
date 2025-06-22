
import React from 'react';
import { motion } from 'framer-motion';
import { Episode } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import PlayPauseIcon from './icons/PlayPauseIcon'; // Assuming this will be created

interface KnowledgeCrystalProps {
  episode: Episode;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: () => void;
}

// Helper to format duration, can be moved to utils if used elsewhere
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const KnowledgeCrystal: React.FC<KnowledgeCrystalProps> = ({ episode, isActive, isPlaying, onSelect }) => {
  const { theme } = useTheme();

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 12 } },
  };

  const commonCardStyles: React.CSSProperties = {
    backgroundColor: theme === 'dark' ? 'var(--color-surface-dark)' : 'var(--color-surface-light)',
    borderColor: theme === 'dark' ? 'transparent' : 'var(--color-border-light)',
    boxShadow: theme === 'dark' ? 'var(--current-shadow-properties)' : 'var(--current-shadow-properties)',
    backdropFilter: theme === 'dark' ? 'var(--backdrop-blur-dark)' : 'none',
    color: 'var(--current-color-text-primary)',
  };

  const activePulseAnimation = isActive && isPlaying ? {
    boxShadow: [
      `0 0 0px 0px ${theme === 'dark' ? 'var(--color-accent-primary-dark)' : 'var(--color-accent-primary-light)'}33`,
      `0 0 15px 5px ${theme === 'dark' ? 'var(--color-accent-primary-dark)' : 'var(--color-accent-primary-light)'}66`,
      `0 0 0px 0px ${theme === 'dark' ? 'var(--color-accent-primary-dark)' : 'var(--color-accent-primary-light)'}33`,
    ],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }
  } : {};
  
  // Simplified Thread of Thought: animated border
   const threadOfThoughtStyle = isActive ? {
    borderImageSource: `linear-gradient(to right, ${theme === 'dark' ? 'var(--color-accent-primary-dark)' : 'var(--color-accent-primary-light)'}, ${theme === 'dark' ? 'var(--color-accent-secondary-dark)' : 'var(--color-accent-secondary-light)'})`,
    borderImageSlice: 1,
    borderWidth: '2px', // Make border visible for the gradient
   } : {
    borderColor: theme === 'dark' ? 'var(--color-border-dark)' : 'var(--color-border-light)',
    borderWidth: '1px',
   };


  return (
    <motion.div
      variants={cardVariants}
      className="rounded-lg p-4 flex flex-col justify-between relative overflow-hidden theme-transition cursor-pointer group"
      style={{...commonCardStyles, ...threadOfThoughtStyle }}
      whileHover={{ y: -8 }}
      animate={activePulseAnimation}
      onClick={onSelect}
      layout // Enable layout animations
    >
      {/* Radial Glow on Hover */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: `radial-gradient(circle, var(--current-color-accent-primary) 10%, transparent 70%)`,
          opacity: 0,
        }}
        whileHover={{ opacity: theme === 'dark' ? 0.2 : 0.1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content appears above the glow */}
      <div className="relative z-10 flex items-start gap-4">
        <motion.img
          src={episode.coverArt || "/images/cs-cover.png"} // Ensure placeholder exists
          alt={episode.title}
          className="w-20 h-20 md:w-24 md:h-24 rounded-md object-cover flex-shrink-0 bg-gray-700" // Added bg for placeholder
          style={{ borderColor: 'var(--current-color-border)'}} // Themed border for image
          whileHover={{ y: 4 }} // Parallax for cover art
          transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider theme-transition" style={{ color: 'var(--current-color-text-secondary)'}}>
            {episode.chapter}
          </p>
          <h3 className="text-lg md:text-xl font-semibold my-1 truncate theme-transition" title={episode.title}>
            {episode.title}
          </h3>
          <p className="text-sm text-opacity-80 theme-transition line-clamp-2" style={{ color: 'var(--current-color-text-secondary)'}}>
            {episode.description}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex justify-between items-center mt-4">
        <span className="text-xs theme-transition" style={{ color: 'var(--current-color-text-secondary)'}}>
          {formatDuration(episode.duration)}
        </span>
        <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center theme-transition"
            style={{ 
                backgroundColor: isActive && isPlaying ? 'var(--current-color-accent-primary)' : 'var(--current-color-surface)',
                border: `1px solid ${isActive && isPlaying ? 'var(--current-color-accent-primary)' : 'var(--current-color-border)'}`
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            // For button morph effect (simplified here, more complex for full morph)
            // layout 
        >
            <PlayPauseIcon 
                isPlaying={isActive && isPlaying} 
                className="w-5 h-5" 
                color={isActive && isPlaying ? (theme === 'dark' ? 'var(--color-background-dark)' : 'var(--color-surface-light)') : 'var(--current-color-accent-primary)'}
            />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default KnowledgeCrystal;