
import React from 'react';
import { motion } from 'framer-motion';
import { Episode } from '../types';
// import { useTheme } from '../contexts/ThemeContext'; // Not strictly needed if all styles are from CSS vars
import PlayPauseIcon from './icons/PlayPauseIcon';

interface KnowledgeCrystalProps {
  episode: Episode;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: () => void;
}

const formatDuration = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const KnowledgeCrystal: React.FC<KnowledgeCrystalProps> = ({ episode, isActive, isPlaying, onSelect }) => {
  // const { theme } = useTheme(); // CSS vars should handle theme changes

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 12 } },
  };

  const cardBaseStyle: React.CSSProperties = {
    backgroundColor: 'var(--current-color-surface)',
    borderColor: 'var(--current-color-border)',
    boxShadow: 'var(--current-shadow-properties)',
    color: 'var(--current-color-text-primary)',
  };
  
  // Define a CSS variable for the accent glow if not already present
  // e.g., --current-color-accent-primary-glow: rgba(var(--rgb-accent-primary), 0.3);
  const activePlayingStyle = isActive ? { // Simplified: active means prominent border/shadow
     borderColor: 'var(--current-color-accent-primary)',
     boxShadow: `0 0 12px 1px var(--current-color-accent-primary)`, 
  } : {};

  return (
    <motion.div
      variants={cardVariants}
      className="rounded-lg p-4 flex flex-col justify-between relative overflow-hidden theme-transition cursor-pointer group border"
      style={{...cardBaseStyle, ...activePlayingStyle }}
      whileHover={{ 
        y: -6, 
        // Define a hover shadow, e.g., slightly larger or using accent color
        boxShadow: isActive ? `0 0 18px 2px var(--current-color-accent-primary)` : `0 10px 25px rgba(0,0,0,0.1), 0 6px 10px rgba(0,0,0,0.08)` 
      }}
      onClick={onSelect}
      layout 
    >
      {/* Radial Glow - make it more subtle or remove if not fitting "material" feel */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 theme-transition"
        style={{
          // Subtle inner highlight or texture overlay effect
          // Example: linear-gradient(rgba(255,255,255,0.03), rgba(255,255,255,0.03))
          // For dark theme, could be a subtle light catch. For light, a subtle shadow.
        }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10 flex items-start gap-4">
        <motion.img
          src={episode.coverArt || "/images/cs-cover.png"} // Ensure this path is correct or provide a themeable placeholder
          alt={episode.title}
          className="w-20 h-20 md:w-24 md:h-24 rounded-md object-cover flex-shrink-0 theme-transition"
          style={{ border: '1px solid var(--current-color-border)', backgroundColor: 'var(--current-color-background-fallback)' }}
          whileHover={{ y: 1, scale: 1.01 }} // Very subtle parallax
          transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider theme-transition" style={{ color: 'var(--current-color-text-secondary)'}}>
            {episode.chapter}
          </p>
          <h3 className="text-lg md:text-xl font-semibold my-1 truncate theme-transition" title={episode.title} style={{color: 'var(--current-color-text-primary)'}}>
            {episode.title}
          </h3>
          <p className="text-sm text-opacity-80 theme-transition line-clamp-2" style={{ color: 'var(--current-color-text-secondary)'}}>
            {episode.description}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex justify-between items-center mt-4">
        <span className="text-xs theme-transition tabular-nums" style={{ color: 'var(--current-color-text-secondary)'}}>
          {formatDuration(episode.duration)}
        </span>
        <motion.button // Changed div to button for accessibility
            aria-label={isActive && isPlaying ? `Pause ${episode.title}` : `Play ${episode.title}`}
            className="w-10 h-10 rounded-full flex items-center justify-center theme-transition border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-color-accent-primary)]"
            style={{ 
                backgroundColor: isActive && isPlaying ? 'var(--current-color-accent-primary)' : 'var(--current-color-surface)',
                borderColor: isActive && isPlaying ? 'var(--current-color-accent-primary)' : 'var(--current-color-border)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onSelect(); }} // Stop propagation and trigger select
        >
            <PlayPauseIcon 
                isPlaying={isActive && isPlaying} 
                className="w-5 h-5" 
                color={isActive && isPlaying ? 'var(--current-color-surface)' : 'var(--current-color-accent-primary)'}
            />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default KnowledgeCrystal;
