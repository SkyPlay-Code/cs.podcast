
import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Episode } from '../types';
import TomeSpine from './TomeSpine';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/ChevronIcons';

interface BookshelfProps {
  episodes: Episode[];
  currentEpisodeId: string | null;
  isPlaying: boolean;
  onSelectEpisode: (index: number) => void;
}

const Bookshelf: React.FC<BookshelfProps> = ({ episodes, currentEpisodeId, isPlaying, onSelectEpisode }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const draggableContainerRef = useRef<HTMLDivElement>(null);

  const [isShelfHovered, setIsShelfHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  const bookshelfStaggerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger animation for each TomeSpine
        delayChildren: 0.1,  // Delay after the container itself is ready (if it animated in)
      },
    },
  };

  const updateScrollStates = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 1); // Use a small threshold for precision
      setCanScrollRight(scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const updateDragConstraints = useCallback(() => {
    if (scrollContainerRef.current && draggableContainerRef.current) {
      const scrollViewportWidth = scrollContainerRef.current.offsetWidth;
      const draggableContentWidth = draggableContainerRef.current.scrollWidth;
      
      if (draggableContentWidth <= scrollViewportWidth) {
        setDragConstraints({ left: 0, right: 0 });
      } else {
        setDragConstraints({
          left: -(draggableContentWidth - scrollViewportWidth),
          right: 0,
        });
      }
    }
  }, []);

  useLayoutEffect(() => {
    updateDragConstraints();
    updateScrollStates(); // Initial check
    
    const currentScrollContainer = scrollContainerRef.current;
    if (currentScrollContainer) {
      currentScrollContainer.addEventListener('scroll', updateScrollStates);
    }
    window.addEventListener('resize', updateDragConstraints);
    window.addEventListener('resize', updateScrollStates);

    return () => {
      if (currentScrollContainer) {
        currentScrollContainer.removeEventListener('scroll', updateScrollStates);
      }
      window.removeEventListener('resize', updateDragConstraints);
      window.removeEventListener('resize', updateScrollStates);
    };
  }, [episodes, updateDragConstraints, updateScrollStates]);

  const handleChevronScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  // Update scroll state when drag finishes, as `scroll` event might not fire for `x` motion value changes
  const handleDragEnd = () => {
    // A small delay to allow the scroll position to settle after drag
    setTimeout(updateScrollStates, 50);
  };


  return (
    <motion.div
      className="relative w-full h-[380px]" // Container for chevrons and scroll viewport
      onMouseEnter={() => setIsShelfHovered(true)}
      onMouseLeave={() => setIsShelfHovered(false)}
      aria-label="Bookshelf of audio episodes"
    >
      {/* Scroll Viewport with Masking */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-x-auto overflow-y-hidden no-scrollbar relative"
        style={{
          maskImage: 'var(--shelf-mask-gradient)',
          WebkitMaskImage: 'var(--shelf-mask-gradient)', // For Safari
        }}
        onScroll={updateScrollStates} // Added for direct scroll events (e.g., wheel, touch on some devices)
      >
        {/* Draggable Container for Tomes */}
        <motion.div
          ref={draggableContainerRef}
          className="inline-flex flex-row items-center h-full px-8 md:px-12 py-4 gap-4 md:gap-6 cursor-grab active:cursor-grabbing"
          style={{
            backgroundImage: 'var(--shelf-light-wash)',
          }}
          drag="x"
          dragConstraints={dragConstraints}
          onDragEnd={handleDragEnd} // Update scroll states after drag
          variants={bookshelfStaggerVariants}
          initial="hidden"
          animate="show"
          role="list" // The container of list items
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
      </div>

      {/* Chevron Navigators */}
      <AnimatePresence>
        {isShelfHovered && canScrollLeft && (
          <motion.button
            onClick={() => handleChevronScroll('left')}
            className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full theme-transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-color-accent-primary)]"
            style={{ backgroundColor: 'rgba(var(--current-rgb-accent-primary-val), 0.1)', backdropFilter: 'blur(2px)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8" style={{ color: 'var(--current-color-accent-primary)' }} />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isShelfHovered && canScrollRight && (
          <motion.button
            onClick={() => handleChevronScroll('right')}
            className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full theme-transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-color-accent-primary)]"
            style={{ backgroundColor: 'rgba(var(--current-rgb-accent-primary-val), 0.1)', backdropFilter: 'blur(2px)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8" style={{ color: 'var(--current-color-accent-primary)' }}/>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Bookshelf;
