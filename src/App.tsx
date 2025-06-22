
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Episode } from './types';
import { episodes as allEpisodes } from './data/episodes';
import { useTheme } from './contexts/ThemeContext';

// Placeholder for new components (actual files to be created)
import Header from './components/Header'; // Assuming Header will be adapted
import KnowledgeCrystal from './components/KnowledgeCrystal';
import CommandDeck from './components/CommandDeck';
import CerebralField from './components/canvas/CerebralField'; // Placeholder

const PLAYBACK_RATES = [1, 1.25, 1.5, 2, 0.75];

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [episodesData] = useState<Episode[]>(allEpisodes);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  
  // For Cerebral Field interaction
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [playerYPosition, setPlayerYPosition] = useState<number | null>(null);


  const currentEpisode = currentEpisodeIndex !== null ? episodesData[currentEpisodeIndex] : null;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(isFinite(audio.duration) ? audio.duration : 0);
    const handleEpisodeEnd = () => setIsPlaying(false); // Simplified, can add auto-next later
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
  }, [currentEpisodeIndex, playbackRate]);

  const handleSelectEpisode = useCallback((index: number) => {
    setCurrentEpisodeIndex(index);
    if (audioRef.current) {
      audioRef.current.src = episodesData[index].audioSrc;
      audioRef.current.load();
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(console.error);
    }
  }, [episodesData, playbackRate]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || currentEpisodeIndex === null) return;
    if (isPlaying) audioRef.current.pause();
    else {
      if (audioRef.current.currentSrc !== episodesData[currentEpisodeIndex].audioSrc) {
        audioRef.current.src = episodesData[currentEpisodeIndex].audioSrc;
        audioRef.current.load();
      }
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(console.error);
    }
  }, [isPlaying, currentEpisodeIndex, episodesData, playbackRate]);

  const handleNext = useCallback(() => {
    if (currentEpisodeIndex === null) return handleSelectEpisode(0);
    const nextIndex = (currentEpisodeIndex + 1) % episodesData.length;
    handleSelectEpisode(nextIndex);
  }, [currentEpisodeIndex, episodesData.length, handleSelectEpisode]);

  const handlePrevious = useCallback(() => {
    if (currentEpisodeIndex === null) return handleSelectEpisode(episodesData.length - 1);
    const prevIndex = (currentEpisodeIndex - 1 + episodesData.length) % episodesData.length;
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
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--current-color-background)'}}>
      <CerebralField mousePosition={mousePosition} playerYPosition={playerYPosition} />
      
      <audio ref={audioRef} />

      {/* Adapted Header - Assuming it's a simple component that will use CSS vars */}
      <Header />
      {/* Theme Toggle Button - Example */}
      <button 
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 rounded theme-transition"
        style={{backgroundColor: 'var(--current-color-surface)', color: 'var(--current-color-text-primary)', border: '1px solid var(--current-color-border)'}}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? 'Nexus' : 'Sanctuary'}
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
      </main>

      <AnimatePresence>
        {currentEpisode && (
          <CommandDeck
            key="command-deck" // Key for AnimatePresence
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
            onPlayerYPositionChange={setPlayerYPosition} // For Cerebral Field interaction
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
