
import React from 'react';
import { motion } from 'framer-motion';
import { Episode } from '../types';
// import { useTheme } from '../contexts/ThemeContext'; // Not strictly needed
import PlayerControls from './PlayerControls';
import ThreadOfKnowledge from './ThreadOfKnowledge';
import { formatTime } from '../utils/time';

interface CommandDeckProps {
  episode: Episode;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  playbackRate: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onSkip: (amount: number) => void;
  onPlaybackRateChange: () => void;
}

const CommandDeck: React.FC<CommandDeckProps> = ({
  episode, isPlaying, duration, currentTime, playbackRate,
  onPlayPause, onNext, onPrevious, onSeek, onSkip, onPlaybackRateChange
}) => {
  // const { theme } = useTheme(); // CSS vars handle theme styling

  const playerVariants = {
    hidden: { y: '100%', opacity: 0.8 }, // Start slightly visible if desired
    visible: { 
      y: '0%', 
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 120, damping: 25, mass: 0.8 } 
    },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.4, ease: "easeIn" as const } }
  };
  
  const deckStyles: React.CSSProperties = {
    color: 'var(--current-color-text-primary)',
    background: 'var(--current-color-console-bg)', // Use console gradient
    boxShadow: 'var(--current-shadow-properties)', 
    borderTop: '1px solid var(--current-color-border)', 
    // Apply backdrop blur if defined for the theme, and if browser supports it
    // Note: backdrop-filter might need a semi-transparent background to be visible.
    // The --current-color-console-bg is a gradient, so backdrop-blur might not be directly applicable to IT
    // but rather to a container that MIGHT be semi-transparent and sit ON the console.
    // For now, relying on the solid/gradient console background.
    // If a glassy effect on top of the console is desired, structure would need adjustment.
  };
  
  // Apply backdrop-filter if the theme defines it (e.g., for dark theme)
  // This is tricky because CSS variables can't directly enable/disable properties like backdrop-filter
  // A class or direct style check might be better if blur is conditional.
  // For simplicity, if --current-backdrop-blur is 'none', it won't apply. Otherwise, it will.
  if (getComputedStyle(document.body).getPropertyValue('--current-backdrop-blur').trim() !== 'none') {
    deckStyles.backdropFilter = 'var(--current-backdrop-blur)';
    // Ensure background is semi-transparent for backdrop-filter to show through
    // This conflicts with a solid gradient. Consider if CommandDeck itself should be semi-transparent
    // or if the --current-color-console-bg should be a semi-transparent gradient.
    // For this iteration, let's assume --current-color-console-bg can be solid.
  }


  return (
    <motion.div
      variants={playerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed bottom-0 left-0 right-0 z-40 console-theme-transition" // Use console-theme-transition for background
      style={deckStyles}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 items-center p-3 md:p-4 gap-3 md:gap-4 relative">
        <div className="md:col-span-1 flex items-center gap-3 min-w-0">
          <img 
            src={episode.coverArt || "/images/cs-cover.png"}
            alt={episode.title} 
            className="w-12 h-12 md:w-14 md:h-14 rounded-md object-cover flex-shrink-0 theme-transition"
            style={{ border: '1px solid var(--current-color-border)', backgroundColor: 'var(--current-color-background-fallback)' }}
          />
          <div className="min-w-0">
            <p className="font-semibold truncate text-sm md:text-base theme-transition" title={episode.title} style={{color: 'var(--current-color-text-primary)'}}>{episode.title}</p>
            <p className="text-xs truncate theme-transition" style={{color: 'var(--current-color-text-secondary)'}}>{episode.chapter}</p>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center items-center w-full gap-2 px-1 md:px-0">
          <PlayerControls
            isPlaying={isPlaying}
            playbackRate={playbackRate}
            onPlayPause={onPlayPause}
            onNext={onNext}
            onPrevious={onPrevious}
            onSkip={onSkip}
            onPlaybackRateChange={onPlaybackRateChange}
          />
          <ThreadOfKnowledge
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
          />
        </div>

        <div className="md:col-span-1 flex justify-end items-center">
          <div className="text-xs sm:text-sm tabular-nums w-24 text-right hidden md:block theme-transition" style={{color: 'var(--current-color-text-secondary)'}}>
              <span>{formatTime(currentTime)}</span>
              <span> / </span>
              <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommandDeck;
