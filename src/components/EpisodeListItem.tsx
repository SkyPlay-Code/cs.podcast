import React from 'react';
import { Episode } from '../types';
import { PlayIcon, PauseIcon } from './icons/PlaybackIcons';

// Helper function to format seconds into MM:SS format
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface EpisodeListItemProps {
  /** The data object for the episode to display. */
  episode: Episode;

  /** True if this is the currently selected episode in the app. */
  isActive: boolean;

  /** True if audio is currently playing globally. */
  isPlaying: boolean;

  /** The callback function to execute when the user clicks the action button. */
  onSelect: () => void;
}

/**
 * A card component that displays information about a single episode.
 * It changes style based on active/playing state and allows user selection.
 */
const EpisodeListItem: React.FC<EpisodeListItemProps> = ({ episode, isActive, isPlaying, onSelect }) => {
  return (
    <div
      className={`
        bg-surface rounded-lg flex items-center gap-4 p-4
        transition-all duration-200 ease-in-out
        hover:shadow-lg hover:-translate-y-px cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${isActive ? 'ring-2 ring-brand ring-offset-2 ring-offset-background' : 'shadow-md'}
      `}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={isActive && isPlaying ? `Pause ${episode.title}` : `Play ${episode.title}, ${episode.chapter}`}
    >
      {/* Column 1: Cover Art */}
      <img
        src={episode.coverArt || "https://picsum.photos/64/64?grayscale&auto=compress&cs=tinysrgb&dpr=1&w=64"} // Fallback image
        alt={`Cover art for ${episode.title}`}
        className="w-16 h-16 rounded-md object-cover flex-shrink-0 bg-gray-200"
      />

      {/* Column 2: Text Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-secondary">{episode.chapter} • {formatDuration(episode.duration)}</p>
        <h3 className="text-lg font-semibold text-text-primary truncate" title={episode.title}>{episode.title}</h3>
        <p className="text-sm text-text-secondary truncate" title={episode.description}>{episode.description}</p>
      </div>

      {/* Column 3: Action Button */}
      <button
        onClick={(e) => {
            e.stopPropagation(); // Prevent card's onClick from firing again
            onSelect();
        }}
        aria-label={isActive && isPlaying ? `Pause ${episode.title}` : `Play ${episode.title}`}
        className="flex-shrink-0 w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center
                   hover:bg-brand-dark active:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-light transition-colors"
      >
        {isActive && isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default EpisodeListItem;
