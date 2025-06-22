import React, { useState, useRef, useEffect } from 'react';
import { Episode } from './types';
import { episodes as allEpisodes } from './data/episodes';
import Header from './components/Header';
import EpisodeList from './components/EpisodeList';
import PodcastPlayer from './components/PodcastPlayer';

const App: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [episodes] = useState<Episode[]>(allEpisodes);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const currentEpisode = currentEpisodeIndex !== null ? episodes[currentEpisodeIndex] : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateCurrentTime = () => setCurrentTime(audio.currentTime);
      const setAudioDuration = () => setDuration(audio.duration);
      const handleEpisodeEnd = () => handleNext();

      audio.addEventListener('timeupdate', updateCurrentTime);
      audio.addEventListener('loadedmetadata', setAudioDuration);
      audio.addEventListener('ended', handleEpisodeEnd);
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));


      return () => {
        audio.removeEventListener('timeupdate', updateCurrentTime);
        audio.removeEventListener('loadedmetadata', setAudioDuration);
        audio.removeEventListener('ended', handleEpisodeEnd);
        audio.removeEventListener('play', () => setIsPlaying(true));
        audio.removeEventListener('pause', () => setIsPlaying(false));
      };
    }
  }, [currentEpisodeIndex]); // Re-attach listeners if episode changes, though ended/play/pause are on audioRef directly

  const handleSelectEpisode = (index: number): void => {
    if (index < 0 || index >= episodes.length) {
      console.error("Invalid episode index selected:", index);
      return;
    }
    setCurrentEpisodeIndex(index);
    setIsPlaying(true); // Intend to play
    if (audioRef.current) {
      audioRef.current.src = episodes[index].audioSrc;
      audioRef.current.load(); // Important to load new source
      audioRef.current.play().catch(error => {
        console.error("Audio play failed on select:", error);
        setIsPlaying(false); // Update state if play fails
      });
    }
  };

  const handlePlayPause = (): void => {
    if (!audioRef.current || currentEpisodeIndex === null) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Ensure src is set if trying to play after initial load without auto-play
      if (audioRef.current.src !== episodes[currentEpisodeIndex].audioSrc) {
         audioRef.current.src = episodes[currentEpisodeIndex].audioSrc;
         audioRef.current.load();
      }
      audioRef.current.play().catch(error => {
        console.error("Audio play failed on toggle:", error);
        // setIsPlaying will be handled by the audio element's 'pause' event if play fails
      });
    }
    // setIsPlaying is now primarily driven by the audio element's 'play' and 'pause' events
  };

  const handleNext = (): void => {
    if (currentEpisodeIndex === null) { // If nothing is playing, select the first episode
       handleSelectEpisode(0);
       return;
    }
    const nextIndex = (currentEpisodeIndex + 1) % episodes.length;
    handleSelectEpisode(nextIndex);
  };

  const handlePrevious = (): void => {
    if (currentEpisodeIndex === null) { // If nothing is playing, select the last episode
        handleSelectEpisode(episodes.length - 1);
        return;
    }
    const prevIndex = (currentEpisodeIndex - 1 + episodes.length) % episodes.length;
    handleSelectEpisode(prevIndex);
  };
  
  const handleSeek = (seekTime: number) => {
    if (audioRef.current && isFinite(seekTime)) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };


  return (
    <div className="bg-background min-h-screen font-sans text-text-primary flex flex-col">
      <audio 
        ref={audioRef}
        // Event listeners are now managed in useEffect for better control and cleanup
      />

      <Header />

      <main className={`max-w-4xl mx-auto p-4 md:p-8 flex-grow w-full ${currentEpisode ? 'pb-32 md:pb-36' : 'pb-8'}`}>
        <EpisodeList
          episodes={episodes}
          onSelectEpisode={handleSelectEpisode}
          currentEpisodeId={currentEpisode?.id}
        />
      </main>

      {currentEpisode && (
        <PodcastPlayer
          episode={currentEpisode}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSeek={handleSeek}
        />
      )}
    </div>
  );
};

export default App;