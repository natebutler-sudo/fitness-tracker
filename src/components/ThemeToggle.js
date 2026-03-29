// Theme Toggle Component - Dark/Light mode switcher
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
