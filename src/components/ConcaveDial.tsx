
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// Updated IconName to include new types
type IconName = 'playpause' | 'next' | 'previous' | 'skipForward' | 'skipBackward' | 'themeToggle' | 'ambientMute';

// Updated DefinedIconSVGKeys with new icons
type DefinedIconSVGKeys = 
  | 'play' | 'pause' | 'next' | 'previous' | 'skipForward' | 'skipBackward'
  | 'sunIcon' | 'moonIcon' | 'speakerHighIcon' | 'speakerSlashIcon';

interface ConcaveDialProps extends Omit<HTMLMotionProps<'button'>, 'onClick' | 'disabled'> {
  contentType: 'icon' | 'text';
  iconName?: IconName;
  text?: string;
  isPlaying?: boolean; // Used if iconName is 'playpause', 'themeToggle', or 'ambientMute' to select specific icon variant
  onClick: () => void;
  ariaLabel: string;
  className?: string;
  isMainPlayPause?: boolean;
  disabled?: boolean; // Added disabled prop
}

const iconDefs: Record<DefinedIconSVGKeys, string> = {
  play: '<path fill="white" d="M8 5v14l11-7z" />',
  pause: '<path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />',
  previous: '<path fill="white" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12zM6 6h2v12H6z" />',
  next: '<path fill="white" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6zM18 6h-2v12h2z" />',
  skipForward: '<path fill="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" stroke="white" d="M5.5 5.5v13M10 5l7 7-7 7M16.5 5.5v13" />',
  skipBackward: '<path fill="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" stroke="white" d="M18.5 5.5v13M14 5l-7 7 7 7M7.5 5.5v13" />',
  sunIcon: '<path fill="white" d="M12 9c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0-4V3m0 18v-2m5.657-12.657l1.414-1.414M4.929 19.071l1.414-1.414M19.071 19.071l-1.414-1.414M6.343 6.343l-1.414-1.414M21 12h-2M5 12H3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />',
  moonIcon: '<path fill="white" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.64-.11 2.4-.32-2.77-1.3-4.6-4.01-4.6-7.18 0-2.88 1.44-5.37 3.61-6.95A8.937 8.937 0 0012 3z" />',
  speakerHighIcon: '<path fill="white" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>',
  speakerSlashIcon: '<path fill="white" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>',
};

const ConcaveDial: React.FC<ConcaveDialProps> = ({
  contentType,
  iconName,
  text,
  isPlaying, // Used to select between icon variants (play/pause, sun/moon, speaker/mute)
  onClick,
  ariaLabel,
  className = '',
  isMainPlayPause = false,
  disabled = false,
  ...restMotionProps
}) => {
  let finalIconNameKey: DefinedIconSVGKeys | undefined = undefined;

  if (iconName === 'playpause') {
    finalIconNameKey = isPlaying ? 'pause' : 'play';
  } else if (iconName === 'themeToggle') {
    finalIconNameKey = isPlaying ? 'sunIcon' : 'moonIcon'; // isPlaying true means dark theme is active, show sun to switch to light
  } else if (iconName === 'ambientMute') {
    finalIconNameKey = isPlaying ? 'speakerHighIcon' : 'speakerSlashIcon'; // isPlaying true means unmuted, show speaker
  } else if (iconName) {
    finalIconNameKey = iconName as Exclude<IconName, 'playpause' | 'themeToggle' | 'ambientMute'>;
  }

  const svgString = finalIconNameKey
    ? `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${iconDefs[finalIconNameKey]}</svg>`
    : '';

  const maskStyle = contentType === 'icon' && svgString
    ? {
        maskImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(svgString)}')`,
        WebkitMaskImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(svgString)}')`,
      }
    : {};

  const dialSizeClasses = isMainPlayPause ? 'w-14 h-14 sm:w-16 sm:h-16' : 
                          (className.includes('w-') || className.includes('h-')) ? '' : 'w-10 h-10 sm:w-11 sm:h-11';


  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`concave-dial-button ${dialSizeClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        // @ts-ignore
        '--glow-opacity': 0.6,
        '--glow-scale': 1,
      }}
      whileHover={!disabled ? {
        // @ts-ignore
        '--glow-opacity': 1,
        '--glow-scale': 1.2,
      } : {}}
      whileTap={!disabled ? {
        y: 2,
        // @ts-ignore
        '--glow-opacity': 1.5,
        '--glow-scale': 1.25,
      } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      {...restMotionProps}
    >
      <div className="dial-surface-masked" style={maskStyle}>
        {contentType === 'text' && (
          <span className="dial-text-content">{text}</span>
        )}
      </div>
    </motion.button>
  );
};

export default ConcaveDial;
