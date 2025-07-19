import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Headphones, 
  Coffee, 
  TreePine, 
  CloudRain, 
  BookOpen,
  Settings,
  X,
  Waves,
  Bell,
  Zap,
  Star
} from 'lucide-react';
import { useSound } from '../contexts/SoundContext';
import { GlassCard } from './GlassCard';

export const SoundControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ambient' | 'music' | 'sfx' | 'settings'>('ambient');
  
  const {
    isMuted,
    masterVolume,
    ambientVolume,
    musicVolume,
    sfxVolume,
    currentAmbient,
    currentMusic,
    toggleMute,
    setMasterVolume,
    setAmbientVolume,
    setMusicVolume,
    setSfxVolume,
    playAmbient,
    stopAmbient,
    playStudyMusic,
    stopStudyMusic,
    playSfx,
  } = useSound();

  const ambientOptions = [
    { type: 'library', label: 'Library', icon: BookOpen, color: 'from-amber-400 to-orange-400' },
    { type: 'nature', label: 'Nature', icon: TreePine, color: 'from-green-400 to-emerald-400' },
    { type: 'cafe', label: 'Cafe', icon: Coffee, color: 'from-brown-400 to-amber-400' },
    { type: 'rain', label: 'Rain', icon: CloudRain, color: 'from-blue-400 to-indigo-400' },
    { type: 'forest', label: 'Forest', icon: TreePine, color: 'from-green-400 to-teal-400' },
  ];

  const musicOptions = [
    { type: 'lofi', label: 'Lo-Fi', icon: Music, color: 'from-purple-400 to-pink-400' },
    { type: 'classical', label: 'Classical', icon: Music, color: 'from-blue-400 to-cyan-400' },
    { type: 'nature', label: 'Nature', icon: TreePine, color: 'from-green-400 to-emerald-400' },
    { type: 'instrumental', label: 'Instrumental', icon: Headphones, color: 'from-orange-400 to-red-400' },
  ];

  const handleAmbientClick = (type: string) => {
    if (currentAmbient === type) {
      stopAmbient();
    } else {
      playAmbient(type as any);
    }
  };

  const handleMusicClick = (type: string) => {
    if (currentMusic === type) {
      stopStudyMusic();
    } else {
      playStudyMusic(type as any);
    }
  };

  const testSfx = (type: string) => {
    playSfx(type as any);
  };

  const tabs = [
    { id: 'ambient', label: 'Ambient', icon: Waves },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'sfx', label: 'Effects', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Sound Controls Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 p-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Sound Controls Modal */}
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
              className="w-full max-w-4xl max-h-[90vh]"
            >
              <GlassCard className="p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Sound Studio</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-glass-200 rounded-lg transition-colors duration-300"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-2 mb-6">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-blue-400/20 border-2 border-blue-400'
                          : 'border-2 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 text-white" />
                      <span className="text-white font-medium">{tab.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'ambient' && (
                    <motion.div
                      key="ambient"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Ambient Background Sounds</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {ambientOptions.map((option) => (
                            <motion.button
                              key={option.type}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAmbientClick(option.type)}
                              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                                currentAmbient === option.type
                                  ? 'border-green-400 bg-green-400/20'
                                  : 'border-gray-600 hover:border-gray-500'
                              }`}
                            >
                              <div className="flex flex-col items-center space-y-3">
                                <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-full flex items-center justify-center`}>
                                  <option.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-white font-medium">{option.label}</span>
                                {currentAmbient === option.type && (
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-green-400 text-sm">Playing</span>
                                  </div>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'music' && (
                    <motion.div
                      key="music"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Study Music</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {musicOptions.map((option) => (
                            <motion.button
                              key={option.type}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleMusicClick(option.type)}
                              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                                currentMusic === option.type
                                  ? 'border-purple-400 bg-purple-400/20'
                                  : 'border-gray-600 hover:border-gray-500'
                              }`}
                            >
                              <div className="flex flex-col items-center space-y-3">
                                <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-full flex items-center justify-center`}>
                                  <option.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-white font-medium">{option.label}</span>
                                {currentMusic === option.type && (
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                    <span className="text-purple-400 text-sm">Playing</span>
                                  </div>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'sfx' && (
                    <motion.div
                      key="sfx"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Sound Effects</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            { type: 'click', label: 'Button Click', icon: Zap, color: 'from-blue-400 to-cyan-400' },
                            { type: 'hover', label: 'Hover', icon: Zap, color: 'from-green-400 to-emerald-400' },
                            { type: 'success', label: 'Success', icon: Star, color: 'from-green-400 to-teal-400' },
                            { type: 'error', label: 'Error', icon: Zap, color: 'from-red-400 to-pink-400' },
                            { type: 'pageTurn', label: 'Page Turn', icon: BookOpen, color: 'from-amber-400 to-orange-400' },
                            { type: 'notification', label: 'Notification', icon: Bell, color: 'from-purple-400 to-pink-400' },
                          ].map((option) => (
                            <motion.button
                              key={option.type}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => testSfx(option.type)}
                              className="p-4 rounded-lg border-2 border-gray-600 hover:border-gray-500 transition-all duration-300"
                            >
                              <div className="flex flex-col items-center space-y-3">
                                <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-full flex items-center justify-center`}>
                                  <option.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-white font-medium">{option.label}</span>
                                <span className="text-gray-400 text-sm">Click to test</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Audio Settings</h3>
                        
                        {/* Master Volume */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {isMuted ? (
                                <VolumeX className="w-5 h-5 text-white" />
                              ) : (
                                <Volume2 className="w-5 h-5 text-white" />
                              )}
                              <span className="text-white font-medium">Master Volume</span>
                            </div>
                            <button
                              onClick={toggleMute}
                              className="p-2 hover:bg-glass-200 rounded-lg transition-colors duration-300"
                            >
                              {isMuted ? (
                                <VolumeX className="w-4 h-4 text-white" />
                              ) : (
                                <Volume2 className="w-4 h-4 text-white" />
                              )}
                            </button>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={masterVolume}
                            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>0%</span>
                            <span>{Math.round(masterVolume * 100)}%</span>
                            <span>100%</span>
                          </div>
                        </div>

                        {/* Ambient Volume */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Waves className="w-5 h-5 text-white" />
                            <span className="text-white font-medium">Ambient Volume</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={ambientVolume}
                            onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>0%</span>
                            <span>{Math.round(ambientVolume * 100)}%</span>
                            <span>100%</span>
                          </div>
                        </div>

                        {/* Music Volume */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Music className="w-5 h-5 text-white" />
                            <span className="text-white font-medium">Music Volume</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={musicVolume}
                            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>0%</span>
                            <span>{Math.round(musicVolume * 100)}%</span>
                            <span>100%</span>
                          </div>
                        </div>

                        {/* SFX Volume */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Zap className="w-5 h-5 text-white" />
                            <span className="text-white font-medium">Sound Effects Volume</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={sfxVolume}
                            onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>0%</span>
                            <span>{Math.round(sfxVolume * 100)}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 