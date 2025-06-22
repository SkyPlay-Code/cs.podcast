
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { SkipForwardIcon, SkipBackwardIcon, NextIcon, PreviousIcon } from './icons/PlaybackIcons';
import PlayPauseIcon from './icons/PlayPauseIcon';
// import { useTheme } from '../contexts/ThemeContext'; // Theme handled by CSS vars

interface QuantumTriggerCustomProps {
  children: React.ReactNode;
  ariaLabel: string;
  iconClassName?: string;
  isMainPlayPause?: boolean;
  isTextButton?: boolean; // For playback rate button
}

type ForwardedMotionProps = Omit<
  HTMLMotionProps<'button'>, 
  keyof QuantumTriggerCustomProps | 'aria-label' | 'style' | 'whileHover' | 'whileTap' | 'transition'
>;

type QuantumTriggerButtonProps = QuantumTriggerCustomProps & ForwardedMotionProps;

const QuantumTriggerButton: React.FC<QuantumTriggerButtonProps> = ({ 
  children, 
  ariaLabel, 
  className,
  // iconClassName, // Not directly used on span anymore
  isMainPlayPause = false,
  isTextButton = false,
  ...restMotionProps 
}) => {
  // const { theme } = useTheme(); // CSS vars for styling

  const buttonBaseStyle: React.CSSProperties = {
    color: isMainPlayPause ? 'var(--current-color-surface)' : 'var(--current-color-text-secondary)',
    backgroundColor: isMainPlayPause ? 'var(--current-color-accent-primary)' : 'transparent',
    border: isMainPlayPause ? '1px solid var(--current-color-accent-secondary)' : '1px solid transparent',
    boxShadow: isMainPlayPause ? 'var(--current-shadow-properties)' : 'none',
  };

  const hoverStyle = { 
    scale: 1.08,
    color: isTextButton || !isMainPlayPause ? 'var(--current-color-accent-primary)' : 'var(--current-color-surface)',
    backgroundColor: isMainPlayPause ? 'var(--current-color-accent-secondary)' : 'transparent',
    // boxShadow: isMainPlayPause ? `0 0 10px var(--current-color-accent-primary)` : 'none',
  };

  return (
    <motion.button
      {...restMotionProps}
      aria-label={ariaLabel}
      className={`p-2 rounded-full relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-color-accent-primary)] theme-transition console-theme-transition ${isMainPlayPause ? 'w-12 h-12 sm:w-14 sm:h-14' : ''} ${isTextButton ? 'px-2' : ''} ${className || ''}`}
      style={buttonBaseStyle}
      whileHover={hoverStyle}
      whileTap={{ scale: 0.92, y: 1 }}
      transition={{ type: 'spring' as const, stiffness: 350, damping: 15 }}
    >
      {children}
      {/* Subtle shockwave for secondary buttons */}
      {!isMainPlayPause && !isTextButton && (
        <motion.span
            className="absolute inset-0 rounded-full opacity-0"
            style={{ backgroundColor: 'var(--current-color-accent-primary)'}}
            // Adjust scale and opacity for a more subtle material interaction "ripple"
            whileTap={{ scale: [0, 1.5], opacity: [0.2, 0], transition: { duration: 0.35, ease:"easeOut" as const } }}
        />
      )}
    </motion.button>
  );
};


interface PlayerControlsProps {
    isPlaying: boolean;
    playbackRate: number;
    onPlayPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onSkip: (amount: number) => void;
    onPlaybackRateChange: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying, playbackRate, onPlayPause, onNext, onPrevious, onSkip, onPlaybackRateChange
}) => {
  // Main play/pause icon color needs to contrast with its accent background
  const mainPlayPauseIconColor = 'var(--current-color-surface)'; // Or a specific color for text on accent

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">

      <QuantumTriggerButton
        onClick={onPlaybackRateChange}
        ariaLabel={`Change playback speed. Current speed: ${playbackRate}x`}
        className="w-14 text-sm font-mono" 
        isTextButton={true}
      >
        <span style={{color: 'var(--current-color-text-secondary)'}} className="group-hover:text-[var(--current-color-accent-primary)] theme-transition">
         {playbackRate.toFixed(2)}x
        </span>
      </QuantumTriggerButton>

      <QuantumTriggerButton onClick={() => onSkip(-15)} ariaLabel="Skip 15 seconds backward">
        <SkipBackwardIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </QuantumTriggerButton>

      <QuantumTriggerButton onClick={onPrevious} ariaLabel="Previous track">
        <PreviousIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      </QuantumTriggerButton>

      <QuantumTriggerButton
        onClick={onPlayPause}
        ariaLabel={isPlaying ? 'Pause' : 'Play'}
        isMainPlayPause={true}
        className="flex items-center justify-center"
      >
        <PlayPauseIcon isPlaying={isPlaying} className="w-6 h-6 sm:w-7 sm:h-7" color={mainPlayPauseIconColor}/>
      </QuantumTriggerButton>

      <QuantumTriggerButton onClick={onNext} ariaLabel="Next track">
        <NextIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      </QuantumTriggerButton>

      <QuantumTriggerButton onClick={() => onSkip(15)} ariaLabel="Skip 15 seconds forward">
        <SkipForwardIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </QuantumTriggerButton>

      <div className="w-14 hidden sm:block"></div> {/* Spacer to balance playback rate button */}
    </div>
  );
};

export default PlayerControls;
