import React, { createContext, useContext, useState, useEffect } from 'react';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface SeasonalThemeContextType {
  currentSeason: Season;
  setSeason: (season: Season) => void;
  getSeasonalColors: () => SeasonalColors;
  getSeasonalGradients: () => SeasonalGradients;
  getSeasonalEffects: () => SeasonalEffects;
}

interface SeasonalColors {
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
  cardBg: string;
  cardBorder: string;
  buttonBg: string;
  buttonHover: string;
  inputBg: string;
  inputBorder: string;
  shadow: string;
  shadowHover: string;
}

interface SeasonalGradients {
  background: string;
  card: string;
  button: string;
  accent: string;
  overlay: string;
}

interface SeasonalEffects {
  particles: string[];
  animations: string[];
  glows: string[];
}

const SeasonalThemeContext = createContext<SeasonalThemeContextType | undefined>(undefined);

export const useSeasonalTheme = () => {
  const context = useContext(SeasonalThemeContext);
  if (context === undefined) {
    throw new Error('useSeasonalTheme must be used within a SeasonalThemeProvider');
  }
  return context;
};

const getSeasonalColors = (season: Season): SeasonalColors => {
  const seasonalColorSchemes = {
    spring: {
      primary: '#4ade80',
      secondary: '#22c55e',
      accent: '#fbbf24',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#ffffff',
      textSecondary: '#cbd5e1',
      border: '#334155',
      glass: 'rgba(34, 197, 94, 0.1)',
      glassBorder: 'rgba(74, 222, 128, 0.2)',
      cardBg: '#1e293b',
      cardBorder: '#334155',
      buttonBg: '#334155',
      buttonHover: '#475569',
      inputBg: '#1e293b',
      inputBorder: '#334155',
      shadow: '0 4px 6px -1px rgba(34, 197, 94, 0.2)',
      shadowHover: '0 10px 15px -3px rgba(34, 197, 94, 0.3)',
    },
    summer: {
      primary: '#fbbf24',
      secondary: '#f59e0b',
      accent: '#ef4444',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#ffffff',
      textSecondary: '#cbd5e1',
      border: '#334155',
      glass: 'rgba(251, 191, 36, 0.1)',
      glassBorder: 'rgba(245, 158, 11, 0.2)',
      cardBg: '#1e293b',
      cardBorder: '#334155',
      buttonBg: '#334155',
      buttonHover: '#475569',
      inputBg: '#1e293b',
      inputBorder: '#334155',
      shadow: '0 4px 6px -1px rgba(251, 191, 36, 0.2)',
      shadowHover: '0 10px 15px -3px rgba(251, 191, 36, 0.3)',
    },
    autumn: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#dc2626',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#ffffff',
      textSecondary: '#cbd5e1',
      border: '#334155',
      glass: 'rgba(249, 115, 22, 0.1)',
      glassBorder: 'rgba(234, 88, 12, 0.2)',
      cardBg: '#1e293b',
      cardBorder: '#334155',
      buttonBg: '#334155',
      buttonHover: '#475569',
      inputBg: '#1e293b',
      inputBorder: '#334155',
      shadow: '0 4px 6px -1px rgba(249, 115, 22, 0.2)',
      shadowHover: '0 10px 15px -3px rgba(249, 115, 22, 0.3)',
    },
    winter: {
      primary: '#60a5fa',
      secondary: '#3b82f6',
      accent: '#8b5cf6',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#ffffff',
      textSecondary: '#cbd5e1',
      border: '#334155',
      glass: 'rgba(96, 165, 250, 0.1)',
      glassBorder: 'rgba(59, 130, 246, 0.2)',
      cardBg: '#1e293b',
      cardBorder: '#334155',
      buttonBg: '#334155',
      buttonHover: '#475569',
      inputBg: '#1e293b',
      inputBorder: '#334155',
      shadow: '0 4px 6px -1px rgba(96, 165, 250, 0.2)',
      shadowHover: '0 10px 15px -3px rgba(96, 165, 250, 0.3)',
    },
  };

  return seasonalColorSchemes[season];
};

const getSeasonalGradients = (season: Season): SeasonalGradients => {
  const seasonalGradientSchemes = {
    spring: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #14532d 50%, #166534 75%, #15803d 100%)',
      card: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(74, 222, 128, 0.05) 100%)',
      button: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
      accent: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      overlay: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(74, 222, 128, 0.05) 100%)',
    },
    summer: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #92400e 50%, #a16207 75%, #ca8a04 100%)',
      card: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
      button: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      accent: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      overlay: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
    },
    autumn: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #7c2d12 50%, #9a3412 75%, #c2410c 100%)',
      card: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)',
      button: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      accent: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      overlay: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)',
    },
    winter: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #1e3a8a 50%, #1d4ed8 75%, #2563eb 100%)',
      card: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
      button: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      accent: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      overlay: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
    },
  };

  return seasonalGradientSchemes[season];
};

const getSeasonalEffects = (season: Season): SeasonalEffects => {
  const seasonalEffectSchemes = {
    spring: {
      particles: ['🌸', '🌱', '🍃', '🌿'],
      animations: ['bloom', 'grow', 'float'],
      glows: ['rgba(34, 197, 94, 0.3)', 'rgba(74, 222, 128, 0.2)'],
    },
    summer: {
      particles: ['☀️', '🌻', '🌴', '🌊'],
      animations: ['shine', 'wave', 'glow'],
      glows: ['rgba(251, 191, 36, 0.3)', 'rgba(245, 158, 11, 0.2)'],
    },
    autumn: {
      particles: ['🍂', '🍁', '🌰', '🌾'],
      animations: ['fall', 'sway', 'rustle'],
      glows: ['rgba(249, 115, 22, 0.3)', 'rgba(234, 88, 12, 0.2)'],
    },
    winter: {
      particles: ['❄️', '🌨️', '🧊', '💎'],
      animations: ['snow', 'crystal', 'sparkle'],
      glows: ['rgba(96, 165, 250, 0.3)', 'rgba(59, 130, 246, 0.2)'],
    },
  };

  return seasonalEffectSchemes[season];
};

export const SeasonalThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSeason, setCurrentSeason] = useState<Season>('spring');

  // Apply seasonal theme to document
  useEffect(() => {
    const colors = getSeasonalColors(currentSeason);
    const gradients = getSeasonalGradients(currentSeason);

    
    // Apply CSS custom properties
    document.documentElement.style.setProperty('--season-primary', colors.primary);
    document.documentElement.style.setProperty('--season-secondary', colors.secondary);
    document.documentElement.style.setProperty('--season-accent', colors.accent);
    document.documentElement.style.setProperty('--season-background', colors.background);
    document.documentElement.style.setProperty('--season-surface', colors.surface);
    document.documentElement.style.setProperty('--season-text', colors.text);
    document.documentElement.style.setProperty('--season-text-secondary', colors.textSecondary);
    document.documentElement.style.setProperty('--season-border', colors.border);
    document.documentElement.style.setProperty('--season-glass', colors.glass);
    document.documentElement.style.setProperty('--season-glass-border', colors.glassBorder);
    document.documentElement.style.setProperty('--season-card-bg', colors.cardBg);
    document.documentElement.style.setProperty('--season-card-border', colors.cardBorder);
    document.documentElement.style.setProperty('--season-button-bg', colors.buttonBg);
    document.documentElement.style.setProperty('--season-button-hover', colors.buttonHover);
    document.documentElement.style.setProperty('--season-input-bg', colors.inputBg);
    document.documentElement.style.setProperty('--season-input-border', colors.inputBorder);
    document.documentElement.style.setProperty('--season-shadow', colors.shadow);
    document.documentElement.style.setProperty('--season-shadow-hover', colors.shadowHover);
    
    // Apply gradients
    document.documentElement.style.setProperty('--season-bg-gradient', gradients.background);
    document.documentElement.style.setProperty('--season-card-gradient', gradients.card);
    document.documentElement.style.setProperty('--season-button-gradient', gradients.button);
    document.documentElement.style.setProperty('--season-accent-gradient', gradients.accent);
    document.documentElement.style.setProperty('--season-overlay-gradient', gradients.overlay);

    // Apply theme class to body and update background
    document.body.className = `season-${currentSeason}`;
    
    // Update the main app background
    const appElement = document.querySelector('.min-h-screen');
    if (appElement) {
      (appElement as HTMLElement).style.background = gradients.background;
    }
  }, [currentSeason]);

  const setSeason = (season: Season) => {
    setCurrentSeason(season);
  };

  const value: SeasonalThemeContextType = {
    currentSeason,
    setSeason,
    getSeasonalColors: () => getSeasonalColors(currentSeason),
    getSeasonalGradients: () => getSeasonalGradients(currentSeason),
    getSeasonalEffects: () => getSeasonalEffects(currentSeason),
  };

  return (
    <SeasonalThemeContext.Provider value={value}>
      {children}
    </SeasonalThemeContext.Provider>
  );
}; 