import React, { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Use a unique key for theme storage
  const [theme, setTheme] = useState(localStorage.getItem('st_theme_v2') || 'dark');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('st_theme_v2', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// This is the hook used by ThemeSwitcher.jsx
export const useTheme = () => useContext(ThemeContext);