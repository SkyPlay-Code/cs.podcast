import React, { useRef } from 'react';
import { formatTime } from '../utils/time';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (seekTime: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime, duration, onSeek }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const seekRatio = Math.max(0, Math.min(1, clickX / width));
    onSeek(seekRatio * duration);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);


  return (
    <div 
      ref={progressBarRef}
      onClick={handleSeek}
      className="w-full h-2.5 bg-gray-200 rounded-full cursor-pointer group relative"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={duration || 0}
      aria-valuenow={currentTime || 0}
      aria-valuetext={`Time: ${formattedCurrentTime} of ${formattedDuration}`}
      tabIndex={0} // Make it focusable for potential keyboard nav later
      aria-label="Audio progress bar"
    >
      <div 
        className="h-full bg-brand rounded-full group-hover:bg-brand-light transition-colors"
        style={{ width: `${progressPercent}%` }}
      />
      <div 
        className="absolute top-1/2 left-0 transform -translate-y-1/2 w-4 h-4 bg-brand rounded-full shadow-md group-hover:bg-brand-light transition-all duration-150 ease-in-out"
        style={{ left: `calc(${progressPercent}% - 8px)` }} // Adjust -8px to center the 16px thumb
      />
    </div>
  );
};

export default ProgressBar;
