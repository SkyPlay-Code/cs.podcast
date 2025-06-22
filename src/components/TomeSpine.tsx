
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Episode } from '../types';
import { useTheme } from '../contexts/ThemeContext';


interface TomeSpineProps {
  episode: Episode;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: () => void;
}

const TomeSpine: React.FC<TomeSpineProps> = ({ episode, isActive, isPlaying, onSelect }) => {
  const { theme } = useTheme(); 
  const tomeBaseWidth = 80;
  const tomeBaseHeight = 320;

  const combinedVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    
    initial: (isActiveFlag: boolean) => ({
      x: isActiveFlag ? 20 : 0,
      boxShadow: isActiveFlag ? 'var(--tomespine-glow-shadow-static)' : 'none',
      zIndex: isActiveFlag ? 5 : 1,
      transition: { ease: "easeOut", duration: 0.4 }
    }),
    hover: {
      x: 10,
      boxShadow: 'var(--tomespine-glow-shadow-static)',
      zIndex: 10,
      transition: { ease: "easeOut", duration: 0.3 }
    },
    active: { 
      x: 20,
      boxShadow: 'var(--tomespine-glow-shadow-static)',
      zIndex: 5,
      transition: { ease: "easeOut", duration: 0.4 }
    },
  };
  
  let currentAnimateState = isActive ? 'active' : 'initial';

  const baseSpineStyles: React.CSSProperties = {
    width: `${tomeBaseWidth}px`,
    height: `${tomeBaseHeight}px`,
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    backgroundColor: 'var(--current-color-surface)',
    border: `1px solid ${isActive ? 'var(--current-color-accent-primary)' : 'var(--current-color-border)'}`,
    color: 'var(--current-color-text-primary)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 8px', 
    boxSizing: 'border-box',
    borderRadius: '6px 3px 3px 6px', 
  };
  
  const darkThemeSpineOverlayStyle: React.CSSProperties = theme === 'dark' ? {
     backgroundImage: `linear-gradient(to left, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%)`,
  } : {};
  
  const effectiveSpineStyles = {...baseSpineStyles, ...darkThemeSpineOverlayStyle};


  return (
    <motion.div
      role="listitem"
      variants={combinedVariants} 
      custom={isActive} 
      animate={currentAnimateState} 
      whileHover={isActive ? undefined : "hover"} 
      className={`theme-transition ${isActive && isPlaying ? 'tomespine-pulsing' : ''}`}
      style={effectiveSpineStyles}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      tabIndex={0}
      aria-label={`${episode.chapter}: ${episode.title}. Duration: ${Math.floor(episode.duration / 60)} minutes. ${isActive ? (isPlaying ? 'Currently playing.' : 'Selected.') : 'Select to play.'}`}
      aria-pressed={isActive}
    >
      <h3
        className="font-serif-display font-medium text-center origin-center" // Applied Lora font
        style={{
          transform: 'rotate(180deg)', 
          fontSize: '14px', // Slightly adjusted for Lora if needed
          lineHeight: '1.3',
          maxHeight: `${tomeBaseHeight - (tomeBaseWidth - 16) - 32 - 10}px`, 
          color: 'var(--current-color-accent-primary)',
          whiteSpace: 'normal',
          overflowWrap: 'break-word',
          width: `${tomeBaseWidth - 16}px`, 
          overflow: 'hidden', 
        }}
        title={episode.title}
      >
        {episode.title}
      </h3>

      <div 
        style={{
          marginTop: 'auto', 
          transform: 'rotate(180deg)', 
          width: `${tomeBaseWidth - 20}px`, 
          height: `${tomeBaseWidth - 20}px`,
        }}
      >
        <motion.img
          src={episode.coverArt || "/images/cs-cover.png"}
          alt={`Cover for ${episode.title}`}
          className="object-cover rounded-sm flex-shrink-0"
          style={{
            width: '100%', 
            height: '100%',
            border: `1px solid var(--current-color-border)`,
          }}
        />
      </div>
    </motion.div>
  );
};

export default TomeSpine;