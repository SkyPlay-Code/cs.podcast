
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { SkipForwardIcon, SkipBackwardIcon, NextIcon, PreviousIcon } from './icons/PlaybackIcons'; // Keep using existing static icons
import PlayPauseIcon from './icons/PlayPauseIcon';
import { useTheme } from '../contexts/ThemeContext';

// Define the props specific to QuantumTriggerButton's unique features
interface QuantumTriggerCustomProps {
  children: React.ReactNode;
  ariaLabel: string; // Will be mapped to 'aria-label'
  iconClassName?: string;
}

// Define the props that will be forwarded to motion.button, omitting those handled by CustomProps or defined inline
type ForwardedMotionProps = Omit<
  HTMLMotionProps<'button'>, 
  keyof QuantumTriggerCustomProps | 'aria-label' | 'style' | 'whileHover' | 'whileTap' | 'transition'
>;

// Combine custom props with the allowed/forwarded motion props
type QuantumTriggerButtonProps = QuantumTriggerCustomProps & ForwardedMotionProps;

const QuantumTriggerButton: React.FC<QuantumTriggerButtonProps> = ({ 
  children, 
  ariaLabel, 
  className, // className comes from ForwardedMotionProps, intended for the motion.button
  iconClassName, 
  ...restMotionProps // These are the remaining, compatible HTMLMotionProps
}) => {
  return (
    <motion.button
      {...restMotionProps} // Spread compatible motion props
      aria-label={ariaLabel}
      className={`p-2 rounded-full relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-color-accent-primary)] theme-transition ${className || ''}`}
      style={{ color: 'var(--current-color-text-secondary)' }}
      whileHover={{ 
        scale: 1.1, 
        color: 'var(--current-color-accent-primary)',
      }}
      whileTap={{ scale: 0.9, y: 1 }}
      transition={{ type: 'spring' as const, stiffness: 400, damping: 15 }}
    >
      <motion.span 
        className={`block ${iconClassName || ''}`} 
        whileHover={{scale: 1.2}} 
        transition={{type: 'spring' as const, stiffness:300, damping:10}}
      >
         {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 rounded-full opacity-0"
        style={{ backgroundColor: 'var(--current-color-accent-primary)'}}
        whileTap={{ scale: [0, 2], opacity: [0.7, 0], transition: { duration: 0.4, ease:"easeOut" as const } }}
      />
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
  const { theme } = useTheme();
  const playPauseColor = theme === 'dark' ? 'var(--color-background-dark)' : 'var(--color-surface-light)';

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">

      <QuantumTriggerButton
        onClick={onPlaybackRateChange}
        ariaLabel={`Change playback speed. Current speed: ${playbackRate}x`}
        className="w-12 text-sm font-mono py-2 px-1" // No rounded-full for text button
      >
        {playbackRate.toFixed(2)}x
      </QuantumTriggerButton>

      <QuantumTriggerButton onClick={() => onSkip(-15)} ariaLabel="Skip 15 seconds backward">
        <SkipBackwardIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </QuantumTriggerButton>

      <QuantumTriggerButton onClick={onPrevious} ariaLabel="Previous track">
        <PreviousIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      </QuantumTriggerButton>

      {/* Main Play/Pause Button */}
      <motion.button
        onClick={onPlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative overflow-hidden shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-color-accent-primary)] theme-transition"
        style={{ 
            backgroundColor: 'var(--current-color-accent-primary)',
            color: playPauseColor
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 15 }}
      >
        <PlayPauseIcon isPlaying={isPlaying} className="w-6 h-6 sm:w-7 sm:h-7" color={playPauseColor}/>
        {/* Active Play Indicator Ring - conceptual */}
        {isPlaying && (
            <motion.div 
                className="absolute inset-0 border-2 rounded-full"
                style={{borderColor: playPauseColor}}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" as const }}
            />
        )}
      </motion.button>

      <QuantumTriggerButton onClick={onNext} ariaLabel="Next track">
        <NextIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      </QuantumTriggerButton>

      <QuantumTriggerButton onClick={() => onSkip(15)} ariaLabel="Skip 15 seconds forward">
        <SkipForwardIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </QuantumTriggerButton>

      <div className="w-12 hidden sm:block"></div> {/* Spacer */}
    </div>
  );
};

export default PlayerControls;