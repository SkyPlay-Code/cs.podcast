import React from 'react';
import { Episode } from '../types'; // Import Episode type

interface EpisodeListProps {
  episodes: Episode[];
  onSelectEpisode: (index: number) => void;
  currentEpisodeId?: string | null; // Can be undefined or null if no episode is current
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, onSelectEpisode, currentEpisodeId }) => {
  // Placeholder implementation - will be built out later
  // This console.log is just to show props are received and avoid unused variable errors.
  console.log('EpisodeList rendered with:', episodes.length, 'episodes. Current ID:', currentEpisodeId);
  
  if (!episodes || episodes.length === 0) {
    return <p className="text-text-secondary">No episodes available.</p>;
  }

  return (
    <div className="space-y-4">
      {episodes.map((episode, index) => (
        <div 
          key={episode.id} 
          onClick={() => onSelectEpisode(index)}
          className={`p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out ${
            currentEpisodeId === episode.id ? 'bg-brand-light ring-2 ring-brand' : 'bg-surface hover:bg-gray-50'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectEpisode(index);}}
          aria-pressed={currentEpisodeId === episode.id}
          aria-label={`Play episode: ${episode.title}`}
        >
          <h3 className={`text-lg font-semibold ${currentEpisodeId === episode.id ? 'text-brand-dark' : 'text-text-primary'}`}>{episode.chapter}: {episode.title}</h3>
          <p className={`text-sm ${currentEpisodeId === episode.id ? 'text-brand-dark opacity-90' : 'text-text-secondary'}`}>{episode.description}</p>
          <p className={`text-xs mt-1 ${currentEpisodeId === episode.id ? 'text-brand-dark opacity-75' : 'text-text-secondary'}`}>
            Duration: {Math.floor(episode.duration / 60)}:{String(episode.duration % 60).padStart(2, '0')}
          </p>
        </div>
      ))}
    </div>
  );
};

export default EpisodeList;