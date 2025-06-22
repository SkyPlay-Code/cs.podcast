
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Episode } from './types';
import { episodes as allEpisodes } from './data/episodes';
import { useTheme } from './contexts/ThemeContext';

import Header from './components/Header';
import KnowledgeCrystal from './components/KnowledgeCrystal';
import CommandDeck from './components/CommandDeck';
import ThemeTransitionOverlay from './components/ThemeTransitionOverlay'; // Import the overlay

const PLAYBACK_RATES = [1, 1.25, 1.5, 2, 0.75];

const App: React.FC = () => {
  const { theme, initiateThemeChange, isTransitioning } = useTheme(); // Use new context values
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [episodesData] = useState<Episode[]>(allEpisodes);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  
  const currentEpisode = currentEpisodeIndex !== null ? episodesData[currentEpisodeIndex] : null;

  // Audio event handling
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(isFinite(audio.duration) ? audio.duration : 0);
    const handleEpisodeEnd = () => handleNext(); // Auto-play next or can be changed
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('durationchange', setAudioDuration); 
    audio.addEventListener('ended', handleEpisodeEnd);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) setAudioDuration();
    audio.playbackRate = playbackRate;

    return () => {
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('durationchange', setAudioDuration);
      audio.removeEventListener('ended', handleEpisodeEnd);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [currentEpisodeIndex, playbackRate]); // Removed handleNext from deps to avoid issues, ensure it's stable

  const handleSelectEpisode = useCallback((index: number) => {
    setCurrentEpisodeIndex(index);
    if (audioRef.current) {
      audioRef.current.src = episodesData[index].audioSrc;
      audioRef.current.load();
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    }
  }, [episodesData, playbackRate]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || currentEpisodeIndex === null) {
      if(episodesData.length > 0) handleSelectEpisode(0); // Play first if nothing selected
      return;
    }
    if (isPlaying) audioRef.current.pause();
    else {
      // Ensure src is set if it's not the current episode or if src is not set
      if (audioRef.current.currentSrc !== episodesData[currentEpisodeIndex].audioSrc || !audioRef.current.currentSrc) {
        audioRef.current.src = episodesData[currentEpisodeIndex].audioSrc;
        audioRef.current.load(); // Important to load new src
      }
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    }
  }, [isPlaying, currentEpisodeIndex, episodesData, playbackRate, handleSelectEpisode]);

  const handleNext = useCallback(() => {
    if (currentEpisodeIndex === null && episodesData.length > 0) return handleSelectEpisode(0);
    if (episodesData.length === 0) return;
    const nextIndex = (currentEpisodeIndex! + 1) % episodesData.length;
    handleSelectEpisode(nextIndex);
  }, [currentEpisodeIndex, episodesData.length, handleSelectEpisode]);

  const handlePrevious = useCallback(() => {
    if (currentEpisodeIndex === null && episodesData.length > 0) return handleSelectEpisode(episodesData.length - 1);
    if (episodesData.length === 0) return;
    const prevIndex = (currentEpisodeIndex! - 1 + episodesData.length) % episodesData.length;
    handleSelectEpisode(prevIndex);
  }, [currentEpisodeIndex, episodesData.length, handleSelectEpisode]);
  
  const handleSeek = useCallback((seekTime: number) => {
    if (audioRef.current && isFinite(seekTime) && duration > 0) {
      const newTime = Math.max(0, Math.min(seekTime, duration));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime); 
    }
  }, [duration]);

  const handleSkip = useCallback((amount: number) => {
    if (audioRef.current && duration > 0) {
      const newTime = Math.max(0, Math.min(audioRef.current.currentTime + amount, duration));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime); 
    }
  }, [duration]);

  const handlePlaybackRateChange = useCallback(() => {
    if (audioRef.current) {
      const currentIndex = PLAYBACK_RATES.indexOf(playbackRate);
      const nextIndex = (currentIndex + 1) % PLAYBACK_RATES.length;
      const newRate = PLAYBACK_RATES[nextIndex];
      setPlaybackRate(newRate);
      audioRef.current.playbackRate = newRate;
    }
  }, [playbackRate]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <audio ref={audioRef} />
      <ThemeTransitionOverlay /> {/* Add the overlay component */}

      <Header />
      
      <button 
        onClick={initiateThemeChange} // Use new function from context
        disabled={isTransitioning} // Disable button during transition
        className="fixed top-4 right-4 z-50 p-3 rounded-md theme-transition shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-color-accent-primary)]"
        style={{
            backgroundColor: 'var(--current-color-surface)', 
            color: 'var(--current-color-text-primary)', 
            border: '1px solid var(--current-color-border)',
        }}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? 'Dim Study Lights' : 'Illuminate Study'}
      </button>

      <motion.main 
        className="flex-grow w-full max-w-5xl mx-auto px-4 md:px-8 py-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatePresence>
          {episodesData.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {episodesData.map((episode, index) => (
                <KnowledgeCrystal
                  key={episode.id}
                  episode={episode}
                  isActive={currentEpisode?.id === episode.id}
                  isPlaying={isPlaying && currentEpisode?.id === episode.id}
                  onSelect={() => handleSelectEpisode(index)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      <AnimatePresence>
        {currentEpisode && (
          <CommandDeck
            key="command-deck" // Ensure key for AnimatePresence direct child
            episode={currentEpisode}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            playbackRate={playbackRate}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSeek={handleSeek}
            onSkip={handleSkip}
            onPlaybackRateChange={handlePlaybackRateChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
