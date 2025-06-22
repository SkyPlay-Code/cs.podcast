
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Episode } from './types';
import { episodes as allEpisodes } from './data/episodes';
import { useTheme } from './contexts/ThemeContext';

import Header from './components/Header';
import Bookshelf from './components/Bookshelf';
import Console from './components/Console';
import ThemeTransitionOverlay from './components/ThemeTransitionOverlay';
import CerebralField from './components/canvas/CerebralField'; // Added for dust motes

const PLAYBACK_RATES = [1, 1.25, 1.5, 2, 0.75];

const App: React.FC = () => {
  const { theme, initiateThemeChange, isLogicTransitioning } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const darkAmbientAudioRef = useRef<HTMLAudioElement | null>(null);
  const lightAmbientAudioRef = useRef<HTMLAudioElement | null>(null);

  const [episodesData] = useState<Episode[]>(allEpisodes);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isAmbientMuted, setIsAmbientMuted] = useState<boolean>(false);
  
  const currentEpisode = currentEpisodeIndex !== null ? episodesData[currentEpisodeIndex] : null;

  const handleSelectEpisode = useCallback((index: number) => {
    setCurrentEpisodeIndex(index);
    if (audioRef.current) {
      audioRef.current.src = episodesData[index].audioSrc;
      audioRef.current.load();
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(error => console.error("Error playing episode audio:", error));
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
      audioRef.current.play().catch(error => console.error("Error playing episode audio:", error));
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

  const toggleAmbientMute = useCallback(() => {
    setIsAmbientMuted(prev => !prev);
  }, []);

  // Ambient sound effect logic
  useEffect(() => {
    if (!darkAmbientAudioRef.current) {
      darkAmbientAudioRef.current = new Audio('/audio/ambient-dark.mp3');
      darkAmbientAudioRef.current.loop = true;
      darkAmbientAudioRef.current.volume = 0.1;
    }
    if (!lightAmbientAudioRef.current) {
      lightAmbientAudioRef.current = new Audio('/audio/ambient-light.mp3');
      lightAmbientAudioRef.current.loop = true;
      lightAmbientAudioRef.current.volume = 0.08;
    }

    const darkAudio = darkAmbientAudioRef.current;
    const lightAudio = lightAmbientAudioRef.current;

    if (isAmbientMuted) {
      darkAudio.pause();
      lightAudio.pause();
    } else {
      if (theme === 'dark') {
        lightAudio.pause();
        darkAudio.play().catch(e => console.error("Error playing dark ambient sound:", e));
      } else {
        darkAudio.pause();
        lightAudio.play().catch(e => console.error("Error playing light ambient sound:", e));
      }
    }
    // Cleanup on component unmount
    return () => {
        darkAudio.pause();
        lightAudio.pause();
    }
  }, [theme, isAmbientMuted]);


  return (
    <motion.div 
      className="min-h-screen flex flex-col relative overflow-x-hidden pb-32 md:pb-28" // Adjusted pb for console height
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "linear" }}
    >
      <CerebralField theme={theme} />
      <audio ref={audioRef} />
      {/* Ambient audio elements are not rendered in DOM but controlled via refs */}
      <ThemeTransitionOverlay />

      <Header />
      
      {/* Theme switcher button removed from here, moved to Console */}

      <motion.main 
        className="flex-grow w-full max-w-5xl mx-auto px-4 md:px-8 py-8 relative z-10"
        initial={{ opacity: 0, x: '100vw' }}
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

      {/* Console is now always rendered to allow for "Foreword" message */}
      <Console
        key="console-deck" 
        episode={currentEpisode} // Can be null
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
        // Theme and Ambient Mute Props
        theme={theme}
        onToggleTheme={initiateThemeChange}
        isThemeLogicTransitioning={isLogicTransitioning}
        isAmbientMuted={isAmbientMuted}
        onToggleAmbientMute={toggleAmbientMute}
      />
    </motion.div>
  );
};

export default App;
