/**
 * Theme Utility Functions
 * Handles applying and managing user theme preferences
 */

export const AVAILABLE_THEMES = [
  {
    id: 'purple',
    name: 'Purple',
    description: 'Elegant purple with blue accents',
    preview: '#667eea'
  },
  {
    id: 'blue',
    name: 'Blue Serenity',
    description: 'Cool blues and teals for calm focus',
    preview: '#1976d2'
  },
  {
    id: 'green',
    name: 'Green Energy',
    description: 'Vibrant greens for health and growth',
    preview: '#43a047'
  },
  {
    id: 'orange',
    name: 'Orange Warmth',
    description: 'Warm oranges for energy and motivation',
    preview: '#f57c00'
  },
  {
    id: 'slate',
    name: 'Cool Slate',
    description: 'Professional slate grays',
    preview: '#37474f'
  },
  {
    id: 'contrast',
    name: 'High Contrast',
    description: 'Bold blacks and bright accents',
    preview: '#ff006e'
  }
];

/**
 * Apply theme to the document root
 * @param {string} themeId - The theme ID to apply
 */
export const applyTheme = (themeId) => {
  const root = document.documentElement;

  // Remove all theme classes
  AVAILABLE_THEMES.forEach(theme => {
    root.classList.remove(`theme-${theme.id}`);
  });

  // Add the new theme class
  root.classList.add(`theme-${themeId}`);

  // Save preference to localStorage
  localStorage.setItem('userTheme', themeId);
};

/**
 * Get the user's saved theme preference or default
 * @returns {string} - The theme ID
 */
export const getSavedTheme = () => {
  return localStorage.getItem('userTheme') || 'purple';
};

/**
 * Initialize theme on app load
 */
export const initializeTheme = () => {
  const savedTheme = getSavedTheme();
  applyTheme(savedTheme);
};

/**
 * Get theme details by ID
 * @param {string} themeId - The theme ID
 * @returns {object} - Theme details
 */
export const getThemeDetails = (themeId) => {
  return AVAILABLE_THEMES.find(theme => theme.id === themeId);
};
