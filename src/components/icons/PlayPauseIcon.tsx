import React from 'react';
import { PlayIcon, PauseIcon } from './PlaybackIcons'; // Assumes PlaybackIcons.tsx is in the same directory

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

interface PlayPauseIconProps {
  isPlaying: boolean;
  className?: string;
  color?: string; // For fill/stroke color, to be applied via style
}

const PlayPauseIcon: React.FC<PlayPauseIconProps> = ({ isPlaying, className, color }) => {
  const iconStyle: React.CSSProperties = color ? { color: color } : {};

  if (isPlaying) {
    return <PauseIcon className={className} style={iconStyle} />;
  }
  return <PlayIcon className={className} style={iconStyle} />;
};

export default PlayPauseIcon;
