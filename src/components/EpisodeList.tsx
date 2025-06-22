import React from 'react';
import { Episode } from '../types';
import EpisodeListItem from './EpisodeListItem';

interface EpisodeListProps {
  /** The complete array of episode objects. */
  episodes: Episode[];

  /** The ID of the currently selected/playing episode, or null if none. */
  currentEpisodeId: string | null;

  /** A callback function, triggered when a user selects an episode. It passes the index of the selected episode. */
  onSelectEpisode: (index: number) => void;

  /** True if audio is currently playing globally. */
  isPlaying: boolean;
}

/**
 * Renders a vertical list of all available episodes.
 * It maps over the episodes data and renders an EpisodeListItem for each one.
 */
const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, currentEpisodeId, onSelectEpisode, isPlaying }) => {
  if (!episodes || episodes.length === 0) {
    return (
      <section aria-labelledby="all-episodes-heading">
        <h2 id="all-episodes-heading" className="text-2xl font-semibold text-text-primary mb-6">
          All Episodes
        </h2>
        <p className="text-text-secondary">No episodes available at the moment.</p>
      </section>
    );
  }
  
  return (
    <section aria-labelledby="all-episodes-heading">
      <h2 id="all-episodes-heading" className="text-2xl font-semibold text-text-primary mb-6 sr-only">
        All Episodes
      </h2>

      <div className="flex flex-col gap-4" role="list">
        {episodes.map((episode, index) => (
          <EpisodeListItem
            key={episode.id}
            episode={episode}
            isActive={currentEpisodeId === episode.id}
            isPlaying={isPlaying} 
            onSelect={() => onSelectEpisode(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default EpisodeList;
