
import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export const ChevronLeftIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg 
    className={className} 
    style={style} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg 
    className={className} 
    style={style} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
  </svg>
);
