// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#F0F2F5', // Light Gray: Global page background
        'surface': '#FFFFFF',    // White: Cards, Header, Modal backgrounds
        'brand': {
          'DEFAULT': '#3B82F6', // Professional Blue: Primary interactive elements
          'light': '#60A5FA',   // Lighter shade for hover/focus states
          'dark': '#2563EB',    // Darker shade for active/pressed states
        },
        'text': {
          'primary': '#1F2937',   // Near Black: Headings, primary body copy
          'secondary': '#6B7280', // Medium Gray: Descriptions, metadata, placeholders
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      }
    }
  },
  plugins: [],
};