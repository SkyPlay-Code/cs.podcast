
import React from 'react';
import { motion } from 'framer-motion';
import { Episode } from '../types';
import PlayerControls from './PlayerControls';
import ProgressBarInlay from './ProgressBarInlay'; // Updated from ThreadOfKnowledge
import { formatTime } from '../utils/time';

interface ConsoleProps { // Renamed from CommandDeckProps
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

const Console: React.FC<ConsoleProps> = ({ // Renamed from CommandDeck
  episode, isPlaying, duration, currentTime, playbackRate,
  onPlayPause, onNext, onPrevious, onSeek, onSkip, onPlaybackRateChange
}) => {
  const playerVariants = {
    hidden: { y: '100%', opacity: 0.8 },
    visible: { 
      y: '0%', 
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 120, damping: 25, mass: 0.8 } 
    },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.4, ease: "easeIn" as const } }
  };
  
  const consoleStyles: React.CSSProperties = {
    color: 'var(--current-color-text-primary)',
    background: 'var(--current-color-console-bg)',
    // Inset top shadow for hard edge, combined with overall elevation shadow
    boxShadow: 'var(--current-shadow-console-edge), var(--current-shadow-properties)', 
    borderTop: '1px solid var(--current-color-border)', 
  };
  
  // Apply backdrop-filter if the theme defines it and it's not 'none'
  // Note: This requires the background to be semi-transparent to see the blur effect.
  // --current-color-console-bg is a gradient; if it's opaque, backdrop-filter won't be visible.
  // We'll assume the gradient might have some transparency or this is for future flexibility.
  if (typeof window !== 'undefined') { // Ensure this runs client-side
    const currentBackdropBlur = getComputedStyle(document.body).getPropertyValue('--current-backdrop-blur').trim();
    if (currentBackdropBlur !== 'none') {
      consoleStyles.backdropFilter = 'var(--current-backdrop-blur)';
      // Example: if console-bg could be semi-transparent:
      // consoleStyles.backgroundColor = 'rgba(var(--some-rgb-color), 0.8)'; // If console-bg was a solid color
    }
  }


  return (
    <motion.div
      variants={playerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed bottom-0 left-0 right-0 z-40 console-theme-transition"
      style={consoleStyles}
      aria-label="Audio Player Console"
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
          <ProgressBarInlay // Updated from ThreadOfKnowledge
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

export default Console;
