import React from 'react';

/**
 * A static, presentational header component for the application.
 * It displays the main title and subtitle.
 *
 * This component is self-contained and does not receive any props.
 */
const Header: React.FC = () => {
  return (
    // Outer container:
    // - <header>: Semantic HTML for a page header.
    // - bg-surface: Sets the background to White (#FFFFFF) as per the Design System.
    // - shadow-md: Applies a subtle box-shadow for elevation, separating it from the content below.
    // - w-full: Ensures the header spans the full width of the viewport.
    // - sticky top-0 z-40: Makes the header stick to the top and stay above most content
    <header className="bg-surface shadow-md w-full sticky top-0 z-40">
      {/* Inner container for content alignment: */}
      {/* - max-w-4xl: Constrains the content width to match the main application body. */}
      {/* - mx-auto: Centers the content container horizontally. */}
      {/* - py-4 px-4 md:px-8: Provides vertical and horizontal padding for spacing. */}
      <div className="max-w-4xl mx-auto py-4 px-4 md:px-8">
        {/* Main Title */}
        {/* - font-semibold: Sets font-weight to 600, as specified for headings in the Typography rules. */}
        {/* - text-2xl: A suitable, clean size for the primary heading. */}
        {/* - text-text-primary: Uses the Near Black (#1F2937) color for primary text. */}
        <h1 className="font-semibold text-2xl text-text-primary">
          CS-11: NCERT Decoded
        </h1>
        {/* Subtitle */}
        {/* - text-sm: A smaller font size to create visual hierarchy. */}
        {/* - text-text-secondary: Uses the Medium Gray (#6B7280) color for supplementary text. */}
        <p className="text-sm text-text-secondary">
          An Audio-First Learning Experience for Class 11 Computer Science
        </p>
      </div>
    </header>
  );
};

export default Header;
