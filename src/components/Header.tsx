
import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="w-full sticky top-0 z-30 theme-transition console-theme-transition"
      style={{ 
        background: 'var(--current-color-console-bg)', 
        boxShadow: 'var(--current-shadow-properties)',
      }}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }} // Header animation
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
    </motion.header>
  );
};

export default Header;