
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Episode } from './types';
import { episodes as allEpisodes } from './data/episodes';
import { useTheme } from './contexts/ThemeContext';

import Header from './components/Header';
import Bookshelf from './components/Bookshelf';
import Console from './components/Console';
import ThemeTransitionOverlay from './components/ThemeTransitionOverlay';

const PLAYBACK_RATES = [1, 1.25, 1.5, 2, 0.75];

const App: React.FC = () => {
  const { theme, initiateThemeChange, isLogicTransitioning } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [episodesData] = useState<Episode[]>(allEpisodes);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number | null>(null); // Set to 0 to test console animation on load
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  
  const currentEpisode = currentEpisodeIndex !== null ? episodesData[currentEpisodeIndex] : null;

  const handleSelectEpisode = useCallback((index: number) => {
    setCurrentEpisodeIndex(index);
    if (audioRef.current) {
      audioRef.current.src = episodesData[index].audioSrc;
      audioRef.current.load();
      audioRef.current.playbackRate = playbackRate;
      // Autoplay is handled by the play() call after src/load
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    }
  }, [episodesData, playbackRate]);

  const stableHandleNext = useCallback(() => {
    if (currentEpisodeIndex === null && episodesData.length > 0) {
      handleSelectEpisode(0);
      return;
    }
    if (episodesData.length === 0) return;
    const nextIndex = (currentEpisodeIndex! + 1) % episodesData.length;
    handleSelectEpisode(nextIndex);
  }, [currentEpisodeIndex, episodesData, handleSelectEpisode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(isFinite(audio.duration) ? audio.duration : 0);
    const handleEpisodeEnd = () => stableHandleNext();
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
  }, [currentEpisodeIndex, playbackRate, stableHandleNext]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || currentEpisodeIndex === null) {
      if(episodesData.length > 0) handleSelectEpisode(0);
      return;
    }
    if (isPlaying) audioRef.current.pause();
    else {
      if (audioRef.current.currentSrc !== episodesData[currentEpisodeIndex].audioSrc || !audioRef.current.currentSrc) {
        audioRef.current.src = episodesData[currentEpisodeIndex].audioSrc;
        audioRef.current.load();
      }
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    }
  }, [isPlaying, currentEpisodeIndex, episodesData, playbackRate, handleSelectEpisode]);
  
  useEffect(() => {
     const audio = audioRef.current;
     if (audio) {
        audio.onended = stableHandleNext;
     }
     return () => {
        if (audio) {
            audio.onended = null;
        }
     }
  }, [stableHandleNext]);


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
    <motion.div 
      className="min-h-screen flex flex-col relative overflow-x-hidden pb-32 md:pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "linear" }} // Stage 1: Background fade-in
    >
      <audio ref={audioRef} />
      <ThemeTransitionOverlay />

      <Header /> {/* Header will have its own animation */}
      
      <motion.button 
        onClick={initiateThemeChange} 
        disabled={isLogicTransitioning}
        className="fixed top-4 right-4 z-50 p-3 rounded-md theme-transition shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-color-accent-primary)]"
        style={{
            backgroundColor: 'var(--current-color-surface)', 
            color: 'var(--current-color-text-primary)', 
            border: '1px solid var(--current-color-border)',
        }}
        aria-label="Toggle theme"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }} // Theme button animation
      >
        {theme === 'light' ? 'Dim Study Lights' : 'Illuminate Study'}
      </motion.button>

      <motion.main 
        className="flex-grow w-full max-w-5xl mx-auto px-4 md:px-8 py-8 relative z-10"
        initial={{ opacity: 0, x: '100vw' }} // Stage 2: Bookshelf container slide-in
        animate={{ opacity: 1, x: '0%' }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      >
        {episodesData.length > 0 ? (
            <Bookshelf
              episodes={episodesData}
              currentEpisodeId={currentEpisode?.id || null}
              isPlaying={isPlaying}
              onSelectEpisode={handleSelectEpisode}
            />
          ) : (
            <p className="text-center text-[var(--current-color-text-secondary)]">No episodes available at the moment.</p>
          )}
      </motion.main>

      <AnimatePresence>
        {currentEpisode && (
          <Console // Stage 3: Console animates in via its own variants (with delay)
            key="console-deck" 
            episode={currentEpisode}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            playbackRate={playbackRate}
            onPlayPause={handlePlayPause}
            onNext={stableHandleNext}
            onPrevious={handlePrevious}
            onSeek={handleSeek}
            onSkip={handleSkip}
            onPlaybackRateChange={handlePlaybackRateChange}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default App;