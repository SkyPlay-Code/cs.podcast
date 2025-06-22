
import React from 'react';

// A generic props interface for our SVG icons
interface IconProps {
  className?: string; // Allow passing Tailwind classes for sizing, color, etc.
  style?: React.CSSProperties; // Allow passing inline styles
}

export const PlayIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

export const PreviousIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

export const NextIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

export const SkipForwardIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);

export const SkipBackwardIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);
