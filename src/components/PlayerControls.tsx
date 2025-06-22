
import React, { useRef } from 'react';
import {
  SkipForwardIcon, SkipBackwardIcon, NextIcon, PreviousIcon
} from './icons/PlaybackIcons'; // Keep these for raw path data if needed, or ConcaveDial handles all.
import ConcaveDial from './ConcaveDial'; // New component

interface PlayerControlsProps {
    isPlaying: boolean;
    playbackRate: number;
    onPlayPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onSkip: (amount: number) => void;
    onPlaybackRateChange: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying, playbackRate, onPlayPause, onNext, onPrevious, onSkip, onPlaybackRateChange
}) => {
  const thumpSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize a single audio element for the thump sound
  if (typeof window !== 'undefined' && !thumpSoundRef.current) {
    thumpSoundRef.current = new Audio('/audio/thump.mp3');
    thumpSoundRef.current.volume = 0.3; // Adjust volume as needed
  }

  const playThumpSound = () => {
    if (thumpSoundRef.current) {
      thumpSoundRef.current.currentTime = 0; // Rewind to start
      thumpSoundRef.current.play().catch(error => console.error("Error playing thump sound:", error));
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
      <ConcaveDial
        contentType="text"
        text={playbackRate.toFixed(2) + 'x'}
        onClick={() => { onPlaybackRateChange(); playThumpSound(); }}
        ariaLabel={`Change playback speed. Current speed: ${playbackRate}x`}
        className="w-14 text-sm" // Base width, dial will be circular
      />

      <ConcaveDial
        contentType="icon"
        iconName="skipBackward"
        onClick={() => { onSkip(-15); playThumpSound(); }}
        ariaLabel="Skip 15 seconds backward"
      />

      <ConcaveDial
        contentType="icon"
        iconName="previous"
        onClick={() => { onPrevious(); playThumpSound(); }}
        ariaLabel="Previous track"
      />

      <ConcaveDial
        contentType="icon"
        iconName="playpause"
        isPlaying={isPlaying}
        onClick={() => { onPlayPause(); playThumpSound(); }}
        ariaLabel={isPlaying ? 'Pause' : 'Play'}
        isMainPlayPause={true} // For potentially different styling/size if needed
      />

      <ConcaveDial
        contentType="icon"
        iconName="next"
        onClick={() => { onNext(); playThumpSound(); }}
        ariaLabel="Next track"
      />

      <ConcaveDial
        contentType="icon"
        iconName="skipForward"
        onClick={() => { onSkip(15); playThumpSound(); }}
        ariaLabel="Skip 15 seconds forward"
      />
      
      {/* Spacer to balance playback rate button if it was on one side */}
      <div className="w-14 hidden sm:block"></div> 
    </div>
  );
};

export default PlayerControls;
