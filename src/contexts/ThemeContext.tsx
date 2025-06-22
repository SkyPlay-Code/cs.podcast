
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';
type TransitionDirection = 'toLight' | 'toDark' | null;

interface ThemeContextType {
  theme: Theme;
  isOverlayVisible: boolean; // Controls overlay rendering
  isLogicTransitioning: boolean; // Gates multiple transition starts
  transitionDirection: TransitionDirection;
  initiateThemeChange: () => void;
  completeActualThemeSwap: () => void;
  cleanupAfterOverlayExit: () => void; 
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') as Theme : null;
    return (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) ? savedTheme : 'dark';
  });
  
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
  const [isLogicTransitioning, setIsLogicTransitioning] = useState<boolean>(false);
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>(null);
  const [targetTheme, setTargetTheme] = useState<Theme | null>(null);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const initiateThemeChange = useCallback(() => {
    if (isLogicTransitioning) return; 

    setIsLogicTransitioning(true);
    const newTargetTheme = theme === 'dark' ? 'light' : 'dark';
    setTargetTheme(newTargetTheme);
    setTransitionDirection(newTargetTheme === 'light' ? 'toLight' : 'toDark');
    setIsOverlayVisible(true); // Make overlay appear and start its "in" animation
  }, [theme, isLogicTransitioning]);

  const completeActualThemeSwap = useCallback(() => {
    if (targetTheme) {
      document.body.setAttribute('data-theme', targetTheme);
      localStorage.setItem('theme', targetTheme);
      setTheme(targetTheme); // Update context theme, triggering React re-renders
      setIsOverlayVisible(false); // Signal overlay to start its "exit" animation
    }
  }, [targetTheme]); 

  const cleanupAfterOverlayExit = useCallback(() => {
    setTransitionDirection(null);
    setTargetTheme(null);
    setIsLogicTransitioning(false); // Ready for a new transition
  }, []);


  const contextValue: ThemeContextType = {
    theme,
    isOverlayVisible,
    isLogicTransitioning,
    transitionDirection,
    initiateThemeChange,
    completeActualThemeSwap,
    cleanupAfterOverlayExit, 
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
