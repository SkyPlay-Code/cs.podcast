
import React from 'react';
import { motion } from 'framer-motion';
import { Episode } from '../types';
import TomeSpine from './TomeSpine';

interface BookshelfProps {
  episodes: Episode[];
  currentEpisodeId: string | null;
  isPlaying: boolean;
  onSelectEpisode: (index: number) => void;
}

const Bookshelf: React.FC<BookshelfProps> = ({ episodes, currentEpisodeId, isPlaying, onSelectEpisode }) => {
  const bookshelfVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-6 md:gap-8" 
      variants={bookshelfVariants}
      initial="hidden"
      animate="show"
      aria-label="List of audio episodes"
      role="list"
    >
      {episodes.map((episode, index) => (
        <TomeSpine
          key={episode.id}
          episode={episode}
          isActive={currentEpisodeId === episode.id}
          isPlaying={isPlaying && currentEpisodeId === episode.id}
          onSelect={() => onSelectEpisode(index)}
        />
      ))}
    </motion.div>
  );
};

export default Bookshelf;
