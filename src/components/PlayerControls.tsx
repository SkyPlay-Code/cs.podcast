import React from 'react';
import { PlayIcon, PauseIcon, SkipForwardIcon, SkipBackwardIcon, NextIcon, PreviousIcon } from './icons/PlaybackIcons';

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
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">

      <button
        onClick={onPlaybackRateChange}
        className="w-12 text-sm font-mono text-text-secondary hover:text-text-primary transition-colors py-2 px-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
        aria-label={`Change playback speed. Current speed: ${playbackRate}x`}
      >
        {playbackRate.toFixed(2)}x
      </button>

      <button 
        onClick={() => onSkip(-15)} 
        className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-light" 
        aria-label="Skip 15 seconds backward"
      >
        <SkipBackwardIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      <button 
        onClick={onPrevious} 
        className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-light" 
        aria-label="Previous track"
      >
        <PreviousIcon className="w-7 h-7 sm:w-8 sm:h-8" />
      </button>

      <button
        onClick={onPlayPause}
        className="w-12 h-12 sm:w-16 sm:h-16 bg-brand text-white rounded-full flex items-center justify-center shadow-lg
                   hover:bg-brand-dark active:bg-brand-dark transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying
          ? <PauseIcon className="w-7 h-7 sm:w-8 sm:h-8" />
          : <PlayIcon className="w-7 h-7 sm:w-8 sm:h-8" />
        }
      </button>

      <button 
        onClick={onNext} 
        className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-light" 
        aria-label="Next track"
      >
        <NextIcon className="w-7 h-7 sm:w-8 sm:h-8" />
      </button>

      <button 
        onClick={() => onSkip(15)} 
        className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-light" 
        aria-label="Skip 15 seconds forward"
      >
        <SkipForwardIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      <div className="w-12 hidden sm:block"></div>

    </div>
  );
};

export default PlayerControls;