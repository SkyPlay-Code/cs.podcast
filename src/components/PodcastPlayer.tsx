import React from 'react';
import { Episode } from '../types';
import { PlayIcon, PauseIcon, PreviousIcon, NextIcon } from './icons/PlaybackIcons';
import ProgressBar from './ProgressBar';
import { formatTime } from '../utils/time';

interface PodcastPlayerProps {
  episode: Episode;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seekTime: number) => void;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({
  episode,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
}) => {
  if (!episode) return null;

  const PlayPauseIconComponent = isPlaying ? PauseIcon : PlayIcon;

  const safeDuration = Number.isFinite(duration) ? duration : 0;
  const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : 0;

  return (
    <footer className="bg-surface shadow-[0_-4px_12px_-1px_rgba(0,0,0,0.07),0_-2px_8px_-2px_rgba(0,0,0,0.04)] fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-3 space-y-2">
        <ProgressBar
          currentTime={safeCurrentTime}
          duration={safeDuration}
          onSeek={onSeek}
        />
        <div className="flex items-center justify-between space-x-4">
          {/* Track Info */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <img 
              src={episode.coverArt || "https://picsum.photos/48/48?grayscale&auto=compress&cs=tinysrgb&dpr=1&w=50"} 
              alt={`Cover art for ${episode.title}`} 
              className="w-10 h-10 md:w-12 md:h-12 rounded-md flex-shrink-0 object-cover bg-gray-200" 
            />
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-text-primary truncate" title={episode.title}>{episode.title}</h4>
              <p className="text-xs text-text-secondary truncate">{episode.chapter}</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button 
              aria-label="Previous track" 
              onClick={onPrevious}
              className="p-2 rounded-full hover:bg-background focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-opacity-75 transition-colors"
            >
              <PreviousIcon className="text-text-primary h-5 w-5 hover:text-brand" />
            </button>
            <button 
              aria-label={isPlaying ? "Pause" : "Play"} 
              onClick={onPlayPause}
              className="p-2 rounded-full bg-brand text-white hover:bg-brand-light active:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-opacity-75 transition-colors"
            >
              <PlayPauseIconComponent className="h-6 w-6" /> 
            </button>
            <button 
              aria-label="Next track" 
              onClick={onNext}
              className="p-2 rounded-full hover:bg-background focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-opacity-75 transition-colors"
            >
              <NextIcon className="text-text-primary h-5 w-5 hover:text-brand" />
            </button>
          </div>
          
          {/* Time Display */}
          <div className="text-xs sm:text-sm text-text-secondary hidden sm:flex items-center space-x-1 tabular-nums w-24 justify-end">
            <span>{formatTime(safeCurrentTime)}</span>
            <span>/</span>
            <span>{formatTime(safeDuration)}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PodcastPlayer;
