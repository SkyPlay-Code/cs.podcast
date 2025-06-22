
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Episode } from '../types';
import { useTheme } from '../contexts/ThemeContext';
// Assuming PlayerControls becomes QuantumTriggers or is refactored
// Assuming ProgressBar becomes ThreadOfKnowledge
import PlayerControls from './PlayerControls'; // Placeholder, to be refactored to QuantumTriggers
import ThreadOfKnowledge from './ThreadOfKnowledge'; // Placeholder
import { formatTime } from '../utils/time'; // Re-use existing util

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
  onPlayerYPositionChange: (y: number | null) => void; // For Cerebral Field
}

const CommandDeck: React.FC<CommandDeckProps> = ({
  episode, isPlaying, duration, currentTime, playbackRate,
  onPlayPause, onNext, onPrevious, onSeek, onSkip, onPlaybackRateChange,
  onPlayerYPositionChange
}) => {
  const { theme } = useTheme();
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (deckRef.current) {
      const rect = deckRef.current.getBoundingClientRect();
      onPlayerYPositionChange(rect.top); // Pass Y position up
    }
    return () => {
      onPlayerYPositionChange(null); // Clear when unmounting
    }
  }, [onPlayerYPositionChange, episode]); // Re-check on episode change if its height changes

  const playerVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { 
      y: '0%', 
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 120, damping: 25, mass: 0.8 } 
    },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.3, ease: "easeIn" as const } }
  };
  
  const commonDeckStyles: React.CSSProperties = {
    color: 'var(--current-color-text-primary)',
    // Nexus: Stronger backdrop-blur(24px), a more transparent var(--color-surface), 
    // and a defined top border made of a 1px high div with a box-shadow: 0 0 15px var(--color-accent).
    // Sanctuary: Crisp box-shadow (0 -10px 30px rgba(0,0,0,0.1)) and an opaque var(--color-surface) background.
    backdropFilter: theme === 'dark' ? 'blur(24px)' : 'none',
    backgroundColor: theme === 'dark' ? 'rgba(22, 27, 34, 0.85)' : 'var(--color-surface-light)', // Dark more transparent
    boxShadow: theme === 'light' ? '0 -10px 30px rgba(0,0,0,0.1)' : 'none',
  };

  return (
    <motion.div
      ref={deckRef}
      variants={playerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed bottom-0 left-0 right-0 z-50 theme-transition"
      style={commonDeckStyles}
    >
      {/* Nexus theme top border glow */}
      {theme === 'dark' && (
        <div 
            className="h-[1px] w-full absolute top-0 left-0" 
            style={{ boxShadow: '0 0 15px var(--color-accent-primary-dark)'}} 
        />
      )}
      {/* Sanctuary theme top border subtle */}
      {theme === 'light' && (
         <div className="h-[1px] w-full absolute top-0 left-0 bg-[var(--color-border-light)]" />
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 items-center p-3 md:p-4 gap-3 md:gap-4 relative">
        <div className="md:col-span-1 flex items-center gap-3 min-w-0">
          <img 
            src={episode.coverArt || "/images/cs-cover.png"}
            alt={episode.title} 
            className="w-12 h-12 md:w-14 md:h-14 rounded-md object-cover flex-shrink-0 bg-gray-700 theme-transition"
            style={{ borderColor: 'var(--current-color-border)' }}
          />
          <div className="min-w-0">
            <p className="font-semibold truncate text-sm md:text-base theme-transition" title={episode.title} style={{color: 'var(--current-color-text-primary)'}}>{episode.title}</p>
            <p className="text-xs truncate theme-transition" style={{color: 'var(--current-color-text-secondary)'}}>{episode.chapter}</p>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center items-center w-full gap-2 px-1 md:px-0">
          {/* These will be replaced by QuantumTriggers and ThreadOfKnowledge */}
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
            // Add props for Cerebral Field interaction during drag
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