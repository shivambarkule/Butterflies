import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeasonalTheme, Season } from '../contexts/SeasonalThemeContext';
import { GlassCard } from './GlassCard';

const seasons: { key: Season; name: string; icon: string; description: string }[] = [
  {
    key: 'spring',
    name: 'Spring',
    icon: '🌸',
    description: 'Fresh blooms and new beginnings'
  },
  {
    key: 'summer',
    name: 'Summer',
    icon: '☀️',
    description: 'Warm sunshine and vibrant energy'
  },
  {
    key: 'autumn',
    name: 'Autumn',
    icon: '🍂',
    description: 'Golden leaves and cozy warmth'
  },
  {
    key: 'winter',
    name: 'Winter',
    icon: '❄️',
    description: 'Crisp snow and magical sparkle'
  }
];

export const SeasonalThemeSelector: React.FC = () => {
  const { currentSeason, setSeason, getSeasonalColors } = useSeasonalTheme();
  const colors = getSeasonalColors();
  const [isOpen, setIsOpen] = useState(false);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.seasonal-theme-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSeasonChange = (season: Season) => {
    setSeason(season);
    setIsOpen(false); // Close the panel after selection
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button p-3 mb-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-xl">🌿</span>
      </motion.button>

      {/* Theme Selector Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="seasonal-theme-selector"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard className="p-4 w-80">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">Seasonal Theme</h3>
                <p className="text-sm text-gray-300">Choose your seasonal atmosphere</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {seasons.map((season) => {
                  const isActive = currentSeason === season.key;
                  const seasonColors = getSeasonalColors();
                  
                  return (
                    <motion.button
                      key={season.key}
                      onClick={() => handleSeasonChange(season.key)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                        isActive 
                          ? 'border-current shadow-lg' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      style={{
                        borderColor: isActive ? seasonColors.primary : undefined,
                        boxShadow: isActive ? `0 0 20px ${seasonColors.primary}40` : undefined,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <motion.div
                          className="text-2xl"
                          animate={isActive ? { 
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {season.icon}
                        </motion.div>
                        <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {season.name}
                        </span>
                        <span className="text-xs text-gray-400 text-center">
                          {season.description}
                        </span>
                      </div>
                      
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, ${seasonColors.primary}20, ${seasonColors.secondary}10)`,
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Current Season:</span>
                  <span className="text-sm font-medium text-white capitalize">
                    {currentSeason}
                  </span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <span className="text-xs text-gray-400">
                    {colors.primary} • {colors.secondary} • {colors.accent}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 