
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';
type TransitionDirection = 'toLight' | 'toDark' | null;

interface ThemeContextType {
  theme: Theme;
  isTransitioning: boolean;
  transitionDirection: TransitionDirection;
  initiateThemeChange: () => void; // Renamed from toggleTheme for clarity
  completeActualThemeSwap: () => void; // Called by overlay when safe to swap theme attributes
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

  const initiateThemeChange = useCallback(() => {
    if (isTransitioning) return;

    const newTargetTheme = theme === 'dark' ? 'light' : 'dark';
    setTargetTheme(newTargetTheme);
    setTransitionDirection(newTargetTheme === 'light' ? 'toLight' : 'toDark');
    setIsTransitioning(true);
    // Actual theme attribute swap is deferred to completeActualThemeSwap
  }, [theme, isTransitioning]);

  const completeActualThemeSwap = useCallback(() => {
    if (targetTheme) {
      document.body.setAttribute('data-theme', targetTheme);
      localStorage.setItem('theme', targetTheme);
      setTheme(targetTheme);
    }
    // Reset transition states after a short delay to allow UI to settle if needed, or immediately
    // For now, reset immediately. Overlay will handle its own disappearance.
    // setIsTransitioning(false); 
    // setTransitionDirection(null);
    // setTargetTheme(null); 
    // Better to have overlay signal when it's fully done with its own animations.
  }, [targetTheme]);
  
  // Effect to set initial theme on body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Provider value needs to also provide a way for overlay to signal it's truly finished
  const contextValue: ThemeContextType = {
    theme,
    isTransitioning,
    transitionDirection,
    initiateThemeChange,
    completeActualThemeSwap,
    // Add a way for overlay to tell context it's fully done and hidden
    // For example, by adding another callback here that overlay calls when it's finally hidden
    // For now, overlay will manage its visibility, and we'll reset transition state when new one starts or after swap.
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
