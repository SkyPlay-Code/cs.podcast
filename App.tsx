import React from 'react';
import { PlayIcon, PreviousIcon, NextIcon } from './components/Icons';

const App: React.FC = () => {
  // Approximate height of the footer for padding-bottom on main content.
  // Footer p-4 (16px vert), content inside ~40px (album art) + internal padding.
  // Using pb-28 (7rem = 112px) for main content area to ensure content is not hidden by fixed footer.
  const footerPaddingBottomClass = "pb-28";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-surface shadow-md p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <h1 className="text-2xl font-semibold text-text-primary">CS-11: NCERT Decoded</h1>
        </div>
      </header>

      {/* Main Content Area (Scrollable) */}
      <main className={`flex-grow p-6 space-y-6 ${footerPaddingBottomClass}`}>
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-text-primary mb-2">Welcome to NCERT Decoded!</h2>
          <p className="text-text-secondary font-normal">
            This application provides educational audio content. The interface is designed for clarity and ease of use,
            following the specified design system: Professional Blue for branding, Inter/Poppins for typography,
            and an 8-point grid for consistent spacing.
          </p>
          <button className="mt-4 bg-brand hover:bg-brand-light active:bg-brand-dark text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-opacity-75">
            Browse Episodes
          </button>
        </div>

        {/* Example Card 1 */}
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-text-primary mb-1">Chapter 1: Introduction to CS</h3>
          <p className="text-text-secondary font-normal text-sm mb-3">
            An overview of fundamental computer science concepts. Duration: 15:30.
          </p>
          <button className="text-sm bg-brand-light text-brand-dark font-medium py-1 px-3 rounded-md hover:bg-brand hover:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50">
            Play Audio
          </button>
        </div>
        
        {/* Example Card 2 */}
         <div className="bg-surface p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-text-primary mb-1">Chapter 2: Data Structures</h3>
          <p className="text-text-secondary font-normal text-sm mb-3">
            Exploring common data structures and their applications. Duration: 22:10.
          </p>
           <button className="text-sm bg-brand-light text-brand-dark font-medium py-1 px-3 rounded-md hover:bg-brand hover:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50">
            Play Audio
          </button>
        </div>
      </main>

      {/* Persistent Audio Player */}
      <footer className="bg-surface shadow-[0_-4px_12px_-1px_rgba(0,0,0,0.07),0_-2px_8px_-2px_rgba(0,0,0,0.04)] p-4 fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between space-x-4">
            {/* Track Info */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
                <img src="https://picsum.photos/48/48?grayscale" alt="Album Art" className="w-12 h-12 rounded-md flex-shrink-0" />
                <div className="min-w-0">
                    <h4 className="text-sm font-medium text-text-primary truncate">Audio Track Title Placeholder</h4>
                    <p className="text-xs text-text-secondary truncate">Artist Name or Chapter Details</p>
                </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2">
                <button aria-label="Previous track" className="p-2 rounded-full hover:bg-background focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-opacity-75">
                    <PreviousIcon className="text-text-primary h-5 w-5 hover:text-brand" />
                </button>
                <button aria-label="Play/Pause" className="p-2 rounded-full bg-brand text-white hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-opacity-75">
                    <PlayIcon className="h-6 w-6" />
                </button>
                <button aria-label="Next track" className="p-2 rounded-full hover:bg-background focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-opacity-75">
                    <NextIcon className="text-text-primary h-5 w-5 hover:text-brand" />
                </button>
            </div>
            
            {/* Time Display */}
            <div className="text-sm text-text-secondary hidden sm:block">
                <span>0:00</span> / <span>0:00</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
