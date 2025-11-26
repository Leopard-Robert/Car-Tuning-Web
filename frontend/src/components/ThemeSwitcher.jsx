import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx'; // Corrected import to use ThemeContext directly
import { Moon, Sun } from 'lucide-react';

/**
 * A dedicated component for toggling the application's theme (light/dark).
 * It reads the current theme from the document element attribute.
 */
const ThemeSwitcher = () => {
  // Correctly importing useTheme directly from its source (ThemeContext.js)
  const themeContext = useTheme();

  // Checking the document attribute for the current theme state.
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  
  if (!themeContext) {
      // Fallback for environment constraints where context might be improperly wired
      return (
          <button className="btn-secondary" style={{ padding: '8px', border: 'none' }} disabled>
            <Sun size={18} />
          </button>
      );
  }

  const { toggleTheme } = themeContext;

  return (
    <button onClick={toggleTheme} className="btn-secondary" style={{ padding: '8px', border: 'none' }}>
      {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18}/>}
    </button>
  );
};

export default ThemeSwitcher;