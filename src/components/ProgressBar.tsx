import React from 'react';

interface ProgressBarProps {
  /** The current playback time of the audio in seconds. */
  currentTime: number;

  /** The total duration of the audio in seconds. */
  duration: number;

  /** Callback function to execute when the user seeks to a new time. */
  onSeek: (time: number) => void;
}

// Helper function to format seconds into a "MM:SS" string.
const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * An interactive progress bar that displays playback time and allows seeking.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime, duration, onSeek }) => {
  // Calculate progress percentage, ensuring no division by zero.
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : 0;
  const safeDuration = Number.isFinite(duration) ? duration : 0;


  // Click handler to calculate and trigger a seek action.
  const handleSeekClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (safeDuration <= 0) return; // Cannot seek if there is no duration.

    // 1. Get the bounding rectangle of the progress bar track.
    const rect = event.currentTarget.getBoundingClientRect();
    // 2. Calculate the horizontal click position relative to the start of the element.
    const clickX = event.clientX - rect.left;
    // 3. Calculate the clicked percentage of the total width.
    const seekPercentage = Math.max(0, Math.min(1, clickX / rect.width)); // Ensure percentage is between 0 and 1
    // 4. Calculate the new time in seconds.
    const newTime = seekPercentage * safeDuration;

    // 5. Call the parent's onSeek function with the new time.
    onSeek(newTime);
  };

  return (
    // Main container for the entire progress bar assembly
    // - w-full: Takes up the full width of its parent container.
    // - flex, items-center, gap-2: Arranges timestamps and the bar horizontally with spacing.
    <div className="w-full flex items-center gap-2 px-1"> {/* Added small horizontal padding */}
      {/* Left Timestamp: Current Time */}
      <span className="text-xs font-mono text-text-secondary w-12 text-right tabular-nums">
        {formatTime(safeCurrentTime)}
      </span>

      {/* The Interactive Bar Area */}
      {/* - group: Establishes a CSS group for child elements to react to hover on this parent. */}
      {/* - cursor-pointer: Indicates the element is clickable. */}
      {/* - relative: Creates a positioning context for the fill and scrubber elements. */}
      {/* - h-4: Provides a larger, easier-to-click hover/touch target area. */}
      <div
        className="group flex-1 h-4 flex items-center cursor-pointer"
        onClick={handleSeekClick}
        role="slider" // Changed from progressbar to slider for better semantics of seekable bar
        aria-valuenow={safeCurrentTime}
        aria-valuemin={0}
        aria-valuemax={safeDuration}
        aria-label="Audio progress bar"
        aria-valuetext={`Time: ${formatTime(safeCurrentTime)} of ${formatTime(safeDuration)}`}
        tabIndex={0} // Make it focusable
        onKeyDown={(e) => { // Basic keyboard seeking
          if (e.key === 'ArrowLeft') {
            onSeek(Math.max(0, safeCurrentTime - 5)); // Seek back 5s
          } else if (e.key === 'ArrowRight') {
            onSeek(Math.min(safeDuration, safeCurrentTime + 5)); // Seek forward 5s
          }
        }}
      >
        {/* Track (Background) */}
        {/* - h-1.5: The visible height of the track itself. (Increased slightly) */}
        {/* - bg-slate-300: Light gray color for the background track. */}
        <div className="relative w-full h-1.5 bg-gray-300 rounded-full"> {/* Used gray-300 for slightly darker track */}
          {/* Fill (Progress) */}
          {/* - absolute, h-full: Positions it within the track. */}
          {/* - bg-brand: Uses the primary Blue accent color. */}
          {/* - style: Dynamically sets the width based on progress percentage. */}
          <div
            className="absolute h-full bg-brand rounded-full transition-all duration-75 ease-linear" // Added transition
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Scrubber/Thumb */}
            {/* - absolute, right-0, top-1/2: Positions it at the end of the fill bar. */}
            {/* - transform, -translate-y-1/2, translate-x-1/2: Perfectly centers it on the line. */}
            {/* - opacity-0, group-hover:opacity-100: Makes it invisible by default, and visible on parent hover. */}
            {/* - group-focus-within:opacity-100: Also show on focus for keyboard users */}
            <div
              className="absolute right-0 top-1/2 w-3.5 h-3.5 bg-brand rounded-full shadow-md border-2 border-surface
                         transform -translate-y-1/2 translate-x-1/2
                         opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>

      {/* Right Timestamp: Total Duration */}
      <span className="text-xs font-mono text-text-secondary w-12 text-left tabular-nums">
        {formatTime(safeDuration)}
      </span>
    </div>
  );
};

export default ProgressBar;
