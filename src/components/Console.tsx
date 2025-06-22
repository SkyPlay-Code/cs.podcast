
import React from 'react';
import { motion } from 'framer-motion';
import { Episode } from '../types';
import PlayerControls from './PlayerControls';
import ProgressBarInlay from './ProgressBarInlay'; 
import { formatTime } from '../utils/time';
import ConcaveDial from './ConcaveDial'; // For Theme and Mute buttons

interface ConsoleProps { 
  episode: Episode | null; // Episode can be null for "Foreword" state
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
  // Theme and Ambient Mute related props
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isThemeLogicTransitioning: boolean;
  isAmbientMuted: boolean;
  onToggleAmbientMute: () => void;
}

const Console: React.FC<ConsoleProps> = ({ 
  episode, isPlaying, duration, currentTime, playbackRate,
  onPlayPause, onNext, onPrevious, onSeek, onSkip, onPlaybackRateChange,
  theme, onToggleTheme, isThemeLogicTransitioning, isAmbientMuted, onToggleAmbientMute
}) => {
  const playerVariants = {
    hidden: { y: '100%', opacity: 0.8 },
    visible: { 
      y: '0%', 
      opacity: 1,
      transition: { delay: 0.8, type: 'spring' as const, stiffness: 120, damping: 25, mass: 0.8 } 
    },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.4, ease: "easeIn" as const } }
  };
  
  const consoleStyles: React.CSSProperties = {
    color: 'var(--current-color-text-primary)',
    background: 'var(--current-color-console-bg)',
    boxShadow: 'var(--current-shadow-console-edge), var(--current-shadow-properties)', 
    borderTop: '1px solid var(--current-color-border)', 
  };
  
  if (typeof window !== 'undefined') { 
    const currentBackdropBlur = getComputedStyle(document.body).getPropertyValue('--current-backdrop-blur').trim();
    if (currentBackdropBlur !== 'none') {
      consoleStyles.backdropFilter = 'var(--current-backdrop-blur)';
    }
  }

  const thumpSoundRef = React.useRef<HTMLAudioElement | null>(null);
  if (typeof window !== 'undefined' && !thumpSoundRef.current) {
    thumpSoundRef.current = new Audio('/audio/thump.mp3');
    thumpSoundRef.current.volume = 0.3;
  }
  const playThump = () => {
    if (thumpSoundRef.current) {
      thumpSoundRef.current.currentTime = 0;
      thumpSoundRef.current.play().catch(e => console.error("Error playing thump:", e));
    }
  };

  return (
    <motion.div
      variants={playerVariants}
      initial="hidden"
      animate="visible"
      exit="exit" // This exit won't be used if Console is always mounted, unless App.tsx wraps it in AnimatePresence for other reasons
      className="fixed bottom-0 left-0 right-0 z-40 console-theme-transition"
      style={consoleStyles}
      aria-label="Audio Player Console"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 items-center p-3 md:p-4 gap-3 md:gap-4 relative">
        {/* Episode Info / Foreword */}
        <div className="md:col-span-1 flex items-center gap-3 min-w-0 h-14"> {/* Added fixed height for consistency */}
          {episode ? (
            <>
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
            </>
          ) : (
            <div className="w-full text-center md:text-left">
              <p className="font-serif-display italic text-sm theme-transition" style={{color: 'var(--current-color-text-secondary)'}}>
                The library is quiet. Select a tome to begin.
              </p>
            </div>
          )}
        </div>

        {/* Player Controls & Progress Bar */}
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
          <ProgressBarInlay 
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
          />
        </div>

        {/* Timestamps, Theme Toggle, Mute Button */}
        <div className="md:col-span-1 flex justify-end items-center gap-2 sm:gap-3">
          <div className="text-xs sm:text-sm tabular-nums w-24 text-right hidden lg:block theme-transition" style={{color: 'var(--current-color-text-secondary)'}}>
              <span>{formatTime(currentTime)}</span>
              <span> / </span>
              <span>{formatTime(duration)}</span>
          </div>
          <ConcaveDial
            contentType="icon"
            iconName="ambientMute"
            isPlaying={!isAmbientMuted} // isPlaying true means "unmuted", shows speaker icon
            onClick={() => { onToggleAmbientMute(); playThump(); }}
            ariaLabel={isAmbientMuted ? "Unmute ambient sounds" : "Mute ambient sounds"}
            className="w-8 h-8 sm:w-9 sm:h-9" // Smaller dial
          />
          <ConcaveDial
            contentType="icon"
            iconName="themeToggle"
            isPlaying={theme === 'dark'} // isPlaying true means "dark theme active", shows sun icon
            onClick={() => { if (!isThemeLogicTransitioning) { onToggleTheme(); playThump(); } }}
            ariaLabel={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            disabled={isThemeLogicTransitioning}
            className="w-8 h-8 sm:w-9 sm:h-9" // Smaller dial
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Console;
