
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type IconName = 'playpause' | 'next' | 'previous' | 'skipForward' | 'skipBackward';

// Defines the set of icon keys that have actual SVG path definitions
type DefinedIconSVGKeys = 'play' | 'pause' | 'next' | 'previous' | 'skipForward' | 'skipBackward';

interface ConcaveDialProps extends Omit<HTMLMotionProps<'button'>, 'onClick'> {
  contentType: 'icon' | 'text';
  iconName?: IconName;
  text?: string;
  isPlaying?: boolean; // Used if iconName is 'playpause'
  onClick: () => void; // Combined with playThumpSound
  ariaLabel: string;
  className?: string;
  isMainPlayPause?: boolean; // For potential distinct styling of main play/pause
}

// SVG Path data for icons (white fill for masking)
// Type is now Record<DefinedIconSVGKeys, string>
const iconDefs: Record<DefinedIconSVGKeys, string> = {
  play: '<path fill="white" d="M8 5v14l11-7z" />',
  pause: '<path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />',
  previous: '<path fill="white" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12zM6 6h2v12H6z" />', // Added bar for previous
  next: '<path fill="white" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6zM18 6h-2v12h2z" />', // Added bar for next
  skipForward: '<path fill="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" stroke="white" d="M5.5 5.5v13M10 5l7 7-7 7M16.5 5.5v13" />', // Adjusted for visual consistency as mask
  skipBackward: '<path fill="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" stroke="white" d="M18.5 5.5v13M14 5l-7 7 7 7M7.5 5.5v13" />', // Adjusted
};

const ConcaveDial: React.FC<ConcaveDialProps> = ({
  contentType,
  iconName,
  text,
  isPlaying,
  onClick,
  ariaLabel,
  className = '',
  isMainPlayPause = false,
  ...restMotionProps
}) => {
  // finalIconName will be one of DefinedIconSVGKeys or undefined
  let finalIconName: DefinedIconSVGKeys | undefined = undefined;
  if (iconName === 'playpause') {
    finalIconName = isPlaying ? 'pause' : 'play';
  } else if (iconName) { // iconName is 'next' | 'previous' | 'skipForward' | 'skipBackward'
    // This cast is safe because IconName excluding 'playpause' is a subset of DefinedIconSVGKeys
    finalIconName = iconName as Exclude<IconName, 'playpause'>;
  }

  const svgString = finalIconName
    ? `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${iconDefs[finalIconName]}</svg>`
    : '';

  const maskStyle = contentType === 'icon' && svgString
    ? {
        maskImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(svgString)}')`,
        WebkitMaskImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(svgString)}')`,
      }
    : {};

  const dialSizeClasses = isMainPlayPause ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-10 h-10 sm:w-11 sm:h-11';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`concave-dial-button ${dialSizeClasses} ${className}`}
      style={{
        // Initial CSS variables for glow, Framer Motion will override
        // @ts-ignore
        '--glow-opacity': 0.6,
        '--glow-scale': 1,
      }}
      whileHover={{
        // @ts-ignore
        '--glow-opacity': 1,
        '--glow-scale': 1.2,
      }}
      whileTap={{
        y: 2,
        // @ts-ignore
        '--glow-opacity': 1.5, // Intensify glow briefly
        '--glow-scale': 1.25, // Slightly larger intense glow
      }}
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
