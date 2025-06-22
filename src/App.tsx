import React, { useState, useRef, useEffect } from 'react';
import { Episode } from './types';
import { episodes as allEpisodes } from './data/episodes';
import Header from './components/Header';
import EpisodeList from './components/EpisodeList';
import PodcastPlayer from './components/PodcastPlayer';

const PLAYBACK_RATES = [1, 1.25, 1.5, 2, 0.75];

const App: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [episodes] = useState<Episode[]>(allEpisodes);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  const currentEpisode = currentEpisodeIndex !== null ? episodes[currentEpisodeIndex] : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
      } else {
        setDuration(0); 
      }
    };
    const handleEpisodeEnd = () => {
      if (currentEpisodeIndex !== null && currentEpisodeIndex < episodes.length - 1) {
        handleNext();
      } else {
        setIsPlaying(false); 
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('durationchange', setAudioDuration); 
    audio.addEventListener('ended', handleEpisodeEnd);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        setAudioDuration();
    }
    audio.playbackRate = playbackRate; // Ensure playback rate is set on mount/episode change


    return () => {
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('durationchange', setAudioDuration);
      audio.removeEventListener('ended', handleEpisodeEnd);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [currentEpisodeIndex, episodes.length, playbackRate]); // Added playbackRate to dependencies

  const handleSelectEpisode = (index: number): void => {
    if (index < 0 || index >= episodes.length) {
      console.error("Invalid episode index selected:", index);
      return;
    }
    setCurrentEpisodeIndex(index);
    if (audioRef.current) {
      audioRef.current.src = episodes[index].audioSrc;
      audioRef.current.load(); 
      audioRef.current.playbackRate = playbackRate; // Ensure playback rate is set for new episode
      audioRef.current.play().catch(error => {
        console.error("Audio play failed on select:", error);
      });
    }
  };

  const handlePlayPause = (): void => {
    if (!audioRef.current || currentEpisodeIndex === null) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioRef.current.currentSrc !== episodes[currentEpisodeIndex].audioSrc) {
         audioRef.current.src = episodes[currentEpisodeIndex].audioSrc;
         audioRef.current.load();
      }
      audioRef.current.playbackRate = playbackRate;
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
      setCurrentTime(newTime); 
    }
  };

  const handleSkip = (amount: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(audioRef.current.currentTime + amount, duration));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime); 
    }
  };

  const handlePlaybackRateChange = () => {
    if (audioRef.current) {
      const currentIndex = PLAYBACK_RATES.indexOf(playbackRate);
      const nextIndex = (currentIndex + 1) % PLAYBACK_RATES.length;
      const newRate = PLAYBACK_RATES[nextIndex];
      setPlaybackRate(newRate);
      audioRef.current.playbackRate = newRate;
    }
  };

  return (
    <div className="bg-background min-h-screen font-sans text-text-primary flex flex-col">
      <audio 
        ref={audioRef}
        onLoadedData={() => { 
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
          playbackRate={playbackRate}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSeek={handleSeek}
          onSkip={handleSkip}
          onPlaybackRateChange={handlePlaybackRateChange}
        />
      )}
    </div>
  );
};

export default App;