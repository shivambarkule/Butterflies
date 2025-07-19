import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
export type Subject = 'math' | 'science' | 'english' | 'history' | 'geography' | 'general';

interface ThemeContextType {
  mode: ThemeMode;
  timeOfDay: TimeOfDay;
  season: Season;
  weather: Weather;
  subject: Subject;
  setMode: (mode: ThemeMode) => void;
  setSubject: (subject: Subject) => void;
  setWeather: (weather: Weather) => void;
  setSeason: (season: Season) => void;
  getThemeColors: () => ThemeColors;
  isDark: boolean;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  glass: string;
  glassBorder: string;
  gradient: string;
  gradientSecondary: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const getSeason = (): Season => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

const getThemeColors = (
  mode: ThemeMode,
  timeOfDay: TimeOfDay,
  season: Season,
  weather: Weather,
  subject: Subject
): ThemeColors => {
  // Base colors for dark/light mode
  const baseColors = {
    dark: {
      background: '#0f0f23',
      surface: '#1a1a2e',
      text: '#ffffff',
      textSecondary: '#a0a0a0',
      border: '#2a2a3e',
      glass: 'rgba(26, 26, 46, 0.8)',
      glassBorder: 'rgba(42, 42, 62, 0.5)',
    },
    light: {
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1a1a2e',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      glass: 'rgba(255, 255, 255, 0.8)',
      glassBorder: 'rgba(226, 232, 240, 0.5)',
    }
  };

  // Time-based color variations
  const timeColors = {
    morning: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#ffe66d',
      gradient: 'from-orange-400 to-pink-400',
      gradientSecondary: 'from-yellow-400 to-orange-400',
    },
    afternoon: {
      primary: '#4ecdc4',
      secondary: '#45b7d1',
      accent: '#96ceb4',
      gradient: 'from-blue-400 to-cyan-400',
      gradientSecondary: 'from-green-400 to-blue-400',
    },
    evening: {
      primary: '#a8e6cf',
      secondary: '#ff8b94',
      accent: '#ffd3b6',
      gradient: 'from-purple-400 to-pink-400',
      gradientSecondary: 'from-pink-400 to-red-400',
    },
    night: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      gradient: 'from-indigo-400 to-purple-400',
      gradientSecondary: 'from-purple-400 to-pink-400',
    }
  };

  // Seasonal color variations
  const seasonColors = {
    spring: {
      primary: '#a8e6cf',
      secondary: '#ff8b94',
      accent: '#ffd3b6',
      gradient: 'from-green-400 to-pink-400',
      gradientSecondary: 'from-pink-400 to-yellow-400',
    },
    summer: {
      primary: '#4ecdc4',
      secondary: '#ffe66d',
      accent: '#ff6b6b',
      gradient: 'from-cyan-400 to-yellow-400',
      gradientSecondary: 'from-yellow-400 to-orange-400',
    },
    autumn: {
      primary: '#ff8b94',
      secondary: '#ffd3b6',
      accent: '#a8e6cf',
      gradient: 'from-orange-400 to-red-400',
      gradientSecondary: 'from-red-400 to-yellow-400',
    },
    winter: {
      primary: '#667eea',
      secondary: '#a8e6cf',
      accent: '#ff8b94',
      gradient: 'from-blue-400 to-cyan-400',
      gradientSecondary: 'from-cyan-400 to-white',
    }
  };

  // Weather-based color variations
  const weatherColors = {
    sunny: {
      primary: '#ffe66d',
      secondary: '#ff6b6b',
      accent: '#4ecdc4',
      gradient: 'from-yellow-400 to-orange-400',
      gradientSecondary: 'from-orange-400 to-red-400',
    },
    cloudy: {
      primary: '#b8c5d6',
      secondary: '#8fa4c0',
      accent: '#667eea',
      gradient: 'from-gray-400 to-blue-400',
      gradientSecondary: 'from-blue-400 to-indigo-400',
    },
    rainy: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#a8e6cf',
      gradient: 'from-blue-400 to-indigo-400',
      gradientSecondary: 'from-indigo-400 to-purple-400',
    },
    snowy: {
      primary: '#ffffff',
      secondary: '#e2e8f0',
      accent: '#667eea',
      gradient: 'from-white to-blue-200',
      gradientSecondary: 'from-blue-200 to-indigo-200',
    },
    stormy: {
      primary: '#4a5568',
      secondary: '#2d3748',
      accent: '#667eea',
      gradient: 'from-gray-600 to-gray-800',
      gradientSecondary: 'from-gray-800 to-indigo-800',
    }
  };

  // Subject-specific color variations
  const subjectColors = {
    math: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      gradient: 'from-blue-400 to-purple-400',
      gradientSecondary: 'from-purple-400 to-indigo-400',
    },
    science: {
      primary: '#4ecdc4',
      secondary: '#45b7d1',
      accent: '#96ceb4',
      gradient: 'from-green-400 to-cyan-400',
      gradientSecondary: 'from-cyan-400 to-blue-400',
    },
    english: {
      primary: '#ff6b6b',
      secondary: '#ff8b94',
      accent: '#ffd3b6',
      gradient: 'from-red-400 to-pink-400',
      gradientSecondary: 'from-pink-400 to-orange-400',
    },
    history: {
      primary: '#ffd93d',
      secondary: '#ff6b6b',
      accent: '#6bcf7f',
      gradient: 'from-yellow-400 to-orange-400',
      gradientSecondary: 'from-orange-400 to-red-400',
    },
    geography: {
      primary: '#6bcf7f',
      secondary: '#4ecdc4',
      accent: '#ffe66d',
      gradient: 'from-green-400 to-emerald-400',
      gradientSecondary: 'from-emerald-400 to-teal-400',
    },
    general: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      gradient: 'from-purple-400 to-pink-400',
      gradientSecondary: 'from-pink-400 to-indigo-400',
    }
  };

  // Combine all theme factors
  const base = baseColors[mode];
  const time = timeColors[timeOfDay];
  const seasonTheme = seasonColors[season];
  const weatherTheme = weatherColors[weather];
  const subjectTheme = subjectColors[subject];

  // Blend colors based on theme factors
  const blendColors = (color1: string, color2: string, factor: number = 0.5) => {
    // Simple color blending - in a real app you'd use a proper color library
    return factor > 0.5 ? color1 : color2;
  };

  return {
    primary: blendColors(time.primary, subjectTheme.primary, 0.6),
    secondary: blendColors(seasonTheme.secondary, weatherTheme.secondary, 0.4),
    accent: subjectTheme.accent,
    background: base.background,
    surface: base.surface,
    text: base.text,
    textSecondary: base.textSecondary,
    border: base.border,
    glass: base.glass,
    glassBorder: base.glassBorder,
    gradient: subjectTheme.gradient,
    gradientSecondary: time.gradientSecondary,
  };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());
  const [season, setSeason] = useState<Season>(getSeason());
  const [weather, setWeather] = useState<Weather>('sunny');
  const [subject, setSubject] = useState<Subject>('general');

  // Update time of day every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Update season monthly
  useEffect(() => {
    setSeason(getSeason());
  }, []);

  // Apply theme to document
  useEffect(() => {
    const colors = getThemeColors(mode, timeOfDay, season, weather, subject);
    
    // Apply CSS custom properties
    document.documentElement.style.setProperty('--color-primary', colors.primary);
    document.documentElement.style.setProperty('--color-secondary', colors.secondary);
    document.documentElement.style.setProperty('--color-accent', colors.accent);
    document.documentElement.style.setProperty('--color-background', colors.background);
    document.documentElement.style.setProperty('--color-surface', colors.surface);
    document.documentElement.style.setProperty('--color-text', colors.text);
    document.documentElement.style.setProperty('--color-text-secondary', colors.textSecondary);
    document.documentElement.style.setProperty('--color-border', colors.border);
    document.documentElement.style.setProperty('--color-glass', colors.glass);
    document.documentElement.style.setProperty('--color-glass-border', colors.glassBorder);
    document.documentElement.style.setProperty('--gradient-primary', colors.gradient);
    document.documentElement.style.setProperty('--gradient-secondary', colors.gradientSecondary);

    // Apply theme class to body
    document.body.className = `theme-${mode} theme-${timeOfDay} theme-${season} theme-${weather} theme-${subject}`;
  }, [mode, timeOfDay, season, weather, subject]);

  const value: ThemeContextType = {
    mode,
    timeOfDay,
    season,
    weather,
    subject,
    setMode,
    setSubject,
    setWeather,
    setSeason,
    getThemeColors: () => getThemeColors(mode, timeOfDay, season, weather, subject),
    isDark: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 