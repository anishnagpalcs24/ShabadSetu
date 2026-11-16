import { createContext, useContext, useState, useEffect } from 'react';

const UserPreferencesContext = createContext(null);

const STORAGE_KEY = 'shabadsetu_guest_prefs';

const DEFAULT_PREFS = {
  theme: 'light',
  fontSize: 'medium',
  larivaar: false,
  englishTranslation: true,
  punjabiTeeka: true,
  spanishTranslation: false,
  punjlish: false,
  tapToRead: false,
  continuousPaath: false,
};

export const UserPreferencesProvider = ({ children }) => {
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  // Apply theme to HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', prefs.theme);
  }, [prefs.theme]);

  // Apply dynamic font size to root CSS variable
  useEffect(() => {
    const sizeMap = {
      small: '1.35rem',
      medium: '1.75rem',
      large: '2.15rem',
      xlarge: '2.6rem',
    };
    const sizeValue = sizeMap[prefs.fontSize] || sizeMap.medium;
    document.documentElement.style.setProperty('--gurbani-current-size', sizeValue);
  }, [prefs.fontSize]);

  // Save changes to localStorage
  const updatePreference = (key, value) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const toggleTheme = () => {
    updatePreference('theme', prefs.theme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme: prefs.theme,
    fontSize: prefs.fontSize,
    larivaar: prefs.larivaar,
    englishTranslation: prefs.englishTranslation,
    punjabiTeeka: prefs.punjabiTeeka,
    spanishTranslation: prefs.spanishTranslation,
    punjlish: prefs.punjlish,
    tapToRead: prefs.tapToRead,
    continuousPaath: prefs.continuousPaath,
    toggleTheme,
    setFontSize: (size) => updatePreference('fontSize', size),
    setLarivaar: (val) => updatePreference('larivaar', val),
    setEnglishTranslation: (val) => updatePreference('englishTranslation', val),
    setPunjabiTeeka: (val) => updatePreference('punjabiTeeka', val),
    setSpanishTranslation: (val) => updatePreference('spanishTranslation', val),
    setPunjlish: (val) => updatePreference('punjlish', val),
    setTapToRead: (val) => updatePreference('tapToRead', val),
    setContinuousPaath: (val) => updatePreference('continuousPaath', val),
  };

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>;
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return context;
};

export default UserPreferencesContext;
