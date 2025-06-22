
import React from 'react';

const Header: React.FC = () => {
  return (
    <header 
      className="w-full sticky top-0 z-30 theme-transition console-theme-transition" // Added console-theme-transition for background
      style={{ 
        background: 'var(--current-color-console-bg)', // Use console background or surface as appropriate
        boxShadow: 'var(--current-shadow-properties)',
        // borderBottom: '1px solid var(--current-color-border)' // Optional
      }}
    >
      <div className="max-w-5xl mx-auto py-4 px-4 md:px-8">
        <h1 
          className="font-semibold text-2xl theme-transition"
          style={{ color: 'var(--current-color-text-primary)' }}
        >
          The Ethereal Library
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
