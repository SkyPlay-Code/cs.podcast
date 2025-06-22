
import React from 'react';

const Header: React.FC = () => {
  return (
    <header 
      className="w-full sticky top-0 z-30 theme-transition" // z-30 so it's above canvas but below modals/player if any higher
      style={{ 
        backgroundColor: 'var(--current-color-surface)',
        boxShadow: 'var(--current-shadow-properties)',
        borderBottom: '1px solid var(--current-color-border)' // Optional: subtle border
      }}
    >
      <div className="max-w-5xl mx-auto py-4 px-4 md:px-8">
        <h1 
          className="font-semibold text-2xl theme-transition"
          style={{ color: 'var(--current-color-text-primary)' }}
        >
          CS-11: NCERT Decoded
        </h1>
        <p 
          className="text-sm theme-transition"
          style={{ color: 'var(--current-color-text-secondary)' }}
        >
          An Immersive Audio-First Learning Experience
        </p>
      </div>
    </header>
  );
};

export default Header;
