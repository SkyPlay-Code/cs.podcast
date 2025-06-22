import React from 'react';
import { Episode } from '../types';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import { formatTime } from '../utils/time';

interface PodcastPlayerProps {
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

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({
  episode, isPlaying, duration, currentTime, playbackRate,
  onPlayPause, onNext, onPrevious, onSeek, onSkip, onPlaybackRateChange
}) => {
  if (!episode) return null;

  const safeDuration = Number.isFinite(duration) ? duration : 0;
  const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-surface/80 backdrop-blur-lg border-t border-slate-200/60 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 items-center p-3 gap-3 md:gap-4">
          
          <div className="md:col-span-1 flex items-center gap-3 min-w-0">
            <img 
              src={episode.coverArt || "https://picsum.photos/56/56?grayscale"} 
              alt={episode.title} 
              className="w-12 h-12 md:w-14 md:h-14 rounded-md object-cover flex-shrink-0 bg-gray-200" 
            />
            <div className="min-w-0">
              <p className="font-semibold text-text-primary truncate text-sm md:text-base" title={episode.title}>{episode.title}</p>
              <p className="text-xs text-text-secondary truncate">{episode.chapter}</p>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col justify-center items-center w-full gap-2 px-2 md:px-0">
            <PlayerControls
              isPlaying={isPlaying}
              playbackRate={playbackRate}
              onPlayPause={onPlayPause}
              onNext={onNext}
              onPrevious={onPrevious}
              onSkip={onSkip}
              onPlaybackRateChange={onPlaybackRateChange}
            />
            <ProgressBar
              currentTime={safeCurrentTime}
              duration={safeDuration}
              onSeek={onSeek}
            />
          </div>

          <div className="md:col-span-1 flex justify-end items-center">
            <div className="text-xs sm:text-sm text-text-secondary tabular-nums w-24 text-right hidden md:block">
                <span>{formatTime(safeCurrentTime)}</span>
                <span>/</span>
                <span>{formatTime(safeDuration)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;