
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';
type TransitionDirection = 'toLight' | 'toDark' | null;

interface ThemeContextType {
  theme: Theme;
  isTransitioning: boolean;
  transitionDirection: TransitionDirection;
  initiateThemeChange: () => void;
  completeActualThemeSwap: () => void;
  finalizeTransition: () => void; // New function to signal end of overlay animation
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') as Theme : null;
    return (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) ? savedTheme : 'dark';
  });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>(null);
  const [targetTheme, setTargetTheme] = useState<Theme | null>(null);

  // Effect to set initial theme on body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const initiateThemeChange = useCallback(() => {
    if (isTransitioning) return; // Prevent stacking transitions

    const newTargetTheme = theme === 'dark' ? 'light' : 'dark';
    setTargetTheme(newTargetTheme);
    setTransitionDirection(newTargetTheme === 'light' ? 'toLight' : 'toDark');
    setIsTransitioning(true);
    // Actual theme attribute swap and context theme update are deferred
  }, [theme, isTransitioning]);

  const completeActualThemeSwap = useCallback(() => {
    if (targetTheme) {
      document.body.setAttribute('data-theme', targetTheme);
      localStorage.setItem('theme', targetTheme);
      setTheme(targetTheme); // This updates the context's theme value
    }
  }, [targetTheme]); // setTheme is stable from useState, no need to list as dep

  const finalizeTransition = useCallback(() => {
    setIsTransitioning(false);
    setTransitionDirection(null);
    setTargetTheme(null);
  }, []);


  const contextValue: ThemeContextType = {
    theme,
    isTransitioning,
    transitionDirection,
    initiateThemeChange,
    completeActualThemeSwap,
    finalizeTransition, 
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};