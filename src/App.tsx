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
    if (!audio) return;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
      } else {
        setDuration(0); // Set to 0 if duration is NaN or Infinite
      }
    };
    const handleEpisodeEnd = () => {
      // Check if there's a next episode before auto-playing
      if (currentEpisodeIndex !== null && currentEpisodeIndex < episodes.length - 1) {
        handleNext();
      } else {
        setIsPlaying(false); // No next episode, or at the end of the list
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('durationchange', setAudioDuration); // Handles cases where duration might change
    audio.addEventListener('ended', handleEpisodeEnd);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Set initial duration if audio is already loaded (e.g. on page refresh with an episode selected)
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        setAudioDuration();
    }


    return () => {
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('durationchange', setAudioDuration);
      audio.removeEventListener('ended', handleEpisodeEnd);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [currentEpisodeIndex, episodes.length]); // Add episodes.length in case it could change (though static here)

  const handleSelectEpisode = (index: number): void => {
    if (index < 0 || index >= episodes.length) {
      console.error("Invalid episode index selected:", index);
      return;
    }
    setCurrentEpisodeIndex(index);
    // isPlaying will be set by the 'play' event listener on the audio element
    if (audioRef.current) {
      audioRef.current.src = episodes[index].audioSrc;
      audioRef.current.load(); 
      audioRef.current.play().catch(error => {
        console.error("Audio play failed on select:", error);
        // isPlaying will be false due to 'pause' event or lack of 'play' event
      });
    }
  };

  const handlePlayPause = (): void => {
    if (!audioRef.current || currentEpisodeIndex === null) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Ensure src is set if trying to play after initial load without auto-play
      // or if somehow src is not the current episode's src
      if (audioRef.current.currentSrc !== episodes[currentEpisodeIndex].audioSrc) {
         audioRef.current.src = episodes[currentEpisodeIndex].audioSrc;
         audioRef.current.load();
      }
      audioRef.current.play().catch(error => {
        console.error("Audio play failed on toggle:", error);
      });
    }
  };

  const handleNext = (): void => {
    if (currentEpisodeIndex === null) { 
       handleSelectEpisode(0);
       return;
    }
    const nextIndex = (currentEpisodeIndex + 1) % episodes.length;
    handleSelectEpisode(nextIndex);
  };

  const handlePrevious = (): void => {
    if (currentEpisodeIndex === null) {
        handleSelectEpisode(episodes.length - 1);
        return;
    }
    const prevIndex = (currentEpisodeIndex - 1 + episodes.length) % episodes.length;
    handleSelectEpisode(prevIndex);
  };
  
  const handleSeek = (seekTime: number) => {
    if (audioRef.current && isFinite(seekTime) && duration > 0) {
      const newTime = Math.max(0, Math.min(seekTime, duration));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime); // Optimistically update currentTime
    }
  };

  return (
    <div className="bg-background min-h-screen font-sans text-text-primary flex flex-col">
      <audio 
        ref={audioRef}
        onLoadedData={() => { // Handle case where loadedmetadata might not fire reliably for duration
            if (audioRef.current && isFinite(audioRef.current.duration)) {
                setDuration(audioRef.current.duration);
            }
        }}
      />

      <Header />

      <main className={`max-w-4xl mx-auto p-4 md:p-8 flex-grow w-full ${currentEpisode ? 'pb-36 md:pb-40' : 'pb-8'}`}>
        <EpisodeList
          episodes={episodes}
          onSelectEpisode={handleSelectEpisode}
          currentEpisodeId={currentEpisode?.id}
          isPlaying={isPlaying} 
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
