import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Zap,
  Leaf,
  Sun as Summer,
  TreePine,
  Snowflake,
  BookOpen,
  FlaskConical,
  BookText,
  Landmark,
  Globe,
  Settings,
  X,
  Trophy,
  Star,
  Target
} from 'lucide-react';
import { useTheme, type Season, type Weather, type Subject } from '../contexts/ThemeContext';
import { useSeasonalTheme } from '../contexts/SeasonalThemeContext';
import { GlassCard } from './GlassCard';

export const ThemeControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { 
    mode, 
    timeOfDay, 
    weather, 
    subject, 
    toggleTheme, 
    setWeather, 
    setSubject 
  } = useTheme();
  const { currentSeason, setSeason: setSeasonalSeason } = useSeasonalTheme();

  const handleSeasonChange = (season: Season) => {
    setSeasonalSeason(season);
    showSuccessMessage();
  };

  const handleWeatherChange = (weather: Weather) => {
    setWeather(weather);
    showSuccessMessage();
  };

  const handleSubjectChange = (subject: Subject) => {
    setSubject(subject);
    showSuccessMessage();
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const weatherOptions = [
    { value: 'sunny', label: 'Sunny', icon: Sun, color: 'from-yellow-400 to-orange-400' },
    { value: 'cloudy', label: 'Cloudy', icon: Cloud, color: 'from-gray-400 to-blue-400' },
    { value: 'rainy', label: 'Rainy', icon: CloudRain, color: 'from-blue-400 to-indigo-400' },
    { value: 'snowy', label: 'Snowy', icon: CloudSnow, color: 'from-white to-blue-200' },
    { value: 'stormy', label: 'Stormy', icon: Zap, color: 'from-gray-600 to-gray-800' },
  ];

  const seasonOptions = [
    { value: 'spring', label: 'Spring', icon: Leaf, color: 'from-green-400 to-pink-400' },
    { value: 'summer', label: 'Summer', icon: Summer, color: 'from-cyan-400 to-yellow-400' },
    { value: 'autumn', label: 'Autumn', icon: TreePine, color: 'from-orange-400 to-red-400' },
    { value: 'winter', label: 'Winter', icon: Snowflake, color: 'from-blue-400 to-cyan-400' },
  ];

  const subjectOptions = [
    { value: 'general', label: 'General', icon: BookOpen, color: 'from-purple-400 to-pink-400' },
    { value: 'math', label: 'Mathematics', icon: BookOpen, color: 'from-blue-400 to-purple-400' },
    { value: 'science', label: 'Science', icon: FlaskConical, color: 'from-green-400 to-cyan-400' },
    { value: 'english', label: 'English', icon: BookText, color: 'from-red-400 to-pink-400' },
    { value: 'history', label: 'History', icon: Landmark, color: 'from-yellow-400 to-orange-400' },
    { value: 'geography', label: 'Geography', icon: Globe, color: 'from-green-400 to-emerald-400' },
  ];

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning': return Sun;
      case 'afternoon': return Sun;
      case 'evening': return Sun;
      case 'night': return Moon;
      default: return Sun;
    }
  };

  const getTimeColor = () => {
    switch (timeOfDay) {
      case 'morning': return 'from-orange-400 to-pink-400';
      case 'afternoon': return 'from-blue-400 to-cyan-400';
      case 'evening': return 'from-purple-400 to-pink-400';
      case 'night': return 'from-indigo-400 to-purple-400';
      default: return 'from-purple-400 to-pink-400';
    }
  };

  return (
    <>
      {/* Theme Controls Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Settings className="w-6 h-6 text-white" />
      </motion.button>

      {/* Theme Controls Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh]"
            >
              <GlassCard className="p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Theme Controls</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-glass-200 rounded-lg transition-colors duration-300"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Success Notification */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-4 p-3 bg-green-500/20 border border-green-400 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-sm font-medium">
                          Theme updated successfully!
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-6">
                  {/* Score Display */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Theme Score</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-glass-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">Theme Mastery</div>
                            <div className="text-yellow-400 text-lg font-bold">85%</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-glass-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">Achievements</div>
                            <div className="text-purple-400 text-lg font-bold">12/16</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-glass-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">Streak</div>
                            <div className="text-blue-400 text-lg font-bold">7 days</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-glass-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">Study Hours</div>
                            <div className="text-green-400 text-lg font-bold">24.5h</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Overall Progress */}
                    <div className="mt-4 p-4 bg-glass-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">Overall Theme Progress</span>
                        <span className="text-blue-400 font-bold">75%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Basic</span>
                        <span>Advanced</span>
                        <span>Master</span>
                      </div>
                    </div>
                  </div>

                  {/* Dark/Light Mode Toggle */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Mode</h3>
                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTheme()}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                          mode === 'light'
                            ? 'border-blue-400 bg-blue-400/20'
                            : 'border-purple-400 bg-purple-400/20'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          {mode === 'light' ? (
                            <>
                              <Sun className="w-5 h-5 text-white" />
                              <span className="text-white font-medium">Light</span>
                            </>
                          ) : (
                            <>
                              <Moon className="w-5 h-5 text-white" />
                              <span className="text-white font-medium">Dark</span>
                            </>
                          )}
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Time of Day (Read-only) */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Time of Day</h3>
                    <div className="p-4 bg-glass-200 rounded-lg">
                      <div className="flex items-center justify-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getTimeColor()} rounded-full flex items-center justify-center`}>
                          {React.createElement(getTimeIcon(), { className: "w-6 h-6 text-white" })}
                        </div>
                        <div>
                          <div className="text-white font-semibold capitalize">{timeOfDay}</div>
                          <div className="text-gray-300 text-sm">Auto-detected</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weather Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Weather</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {weatherOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleWeatherChange(option.value as any)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                            weather === option.value
                              ? 'border-blue-400 bg-blue-400/20'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`w-8 h-8 bg-gradient-to-r ${option.color} rounded-full flex items-center justify-center`}>
                              <option.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white text-xs">{option.label}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Season Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Season</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {seasonOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSeasonChange(option.value as any)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                            currentSeason === option.value
                              ? 'border-green-400 bg-green-400/20'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`w-8 h-8 bg-gradient-to-r ${option.color} rounded-full flex items-center justify-center`}>
                              <option.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white text-xs">{option.label}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Subject Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Subject Theme</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {subjectOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSubjectChange(option.value as any)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                            subject === option.value
                              ? 'border-purple-400 bg-purple-400/20'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`w-8 h-8 bg-gradient-to-r ${option.color} rounded-full flex items-center justify-center`}>
                              <option.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white text-xs">{option.label}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Current Theme Preview */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Current Theme</h3>
                    <div className="p-4 bg-glass-200 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-300">Mode:</span>
                          <span className="text-white ml-2 capitalize">{mode}</span>
                        </div>
                        <div>
                          <span className="text-gray-300">Time:</span>
                          <span className="text-white ml-2 capitalize">{timeOfDay}</span>
                        </div>
                        <div>
                          <span className="text-gray-300">Weather:</span>
                          <span className="text-white ml-2 capitalize">{weather}</span>
                        </div>
                        <div>
                          <span className="text-gray-300">Season:</span>
                          <span className="text-white ml-2 capitalize">{currentSeason}</span>
                        </div>
                        <div>
                          <span className="text-gray-300">Subject:</span>
                          <span className="text-white ml-2 capitalize">{subject}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 