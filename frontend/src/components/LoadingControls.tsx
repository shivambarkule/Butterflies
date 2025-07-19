import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Square, 
  Settings, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Target,
  BookOpen,
  Calculator,
  Globe,
  History,
  Languages,
  X,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { LoadingSystem } from './LoadingSystem';
import { GlassCard } from './GlassCard';

interface LoadingControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoadingControls: React.FC<LoadingControlsProps> = ({ isOpen, onClose }) => {
  const [activeLoader, setActiveLoader] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [transitionType, setTransitionType] = useState<'slide' | 'fade' | 'morph' | 'zoom' | 'flip' | 'bounce'>('slide');
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | 'up' | 'down'>('right');

  const subjects = [
    { id: 'math', name: 'Mathematics', icon: Calculator, color: 'from-blue-400 to-cyan-400' },
    { id: 'science', name: 'Science', icon: Zap, color: 'from-green-400 to-emerald-400' },
    { id: 'english', name: 'English', icon: Languages, color: 'from-red-400 to-pink-400' },
    { id: 'history', name: 'History', icon: History, color: 'from-amber-400 to-orange-400' },
    { id: 'geography', name: 'Geography', icon: Globe, color: 'from-cyan-400 to-blue-400' },
    { id: 'general', name: 'General', icon: BookOpen, color: 'from-purple-400 to-pink-400' }
  ];

  const transitionTypes = [
    { type: 'slide', name: 'Slide', icon: Sparkles },
    { type: 'fade', name: 'Fade', icon: Sparkles },
    { type: 'morph', name: 'Morph', icon: Sparkles },
    { type: 'zoom', name: 'Zoom', icon: Sparkles },
    { type: 'flip', name: 'Flip', icon: Sparkles },
    { type: 'bounce', name: 'Bounce', icon: Sparkles }
  ];

  const directions = [
    { value: 'left', name: 'Left' },
    { value: 'right', name: 'Right' },
    { value: 'up', name: 'Up' },
    { value: 'down', name: 'Down' }
  ];

  const triggerLoader = (type: string) => {
    setActiveLoader(type);
    
    if (type === 'progress') {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setActiveLoader(null), 1000);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    } else {
      setTimeout(() => setActiveLoader(null), 3000);
    }
  };

  const stopLoader = () => {
    setActiveLoader(null);
    setProgress(0);
  };

  return (
    <>
      {/* Loading Controls Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onClose()}
        className="fixed bottom-6 left-32 z-50 p-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Settings className="w-6 h-6 text-white" />
      </motion.button>

      {/* Loading Controls Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={() => onClose()}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isOpen ? 1 : 0.8, opacity: isOpen ? 1 : 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh]"
        >
          <GlassCard className="p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Loading & Transitions Studio</h2>
              <button
                onClick={() => onClose()}
                className="p-2 hover:bg-glass-200 rounded-lg transition-colors duration-300"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Custom Loaders */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Custom Loaders</h3>
                <div className="space-y-4">
                  {/* Subject Selection */}
                  <div>
                    <label className="text-white text-sm mb-2 block">Select Subject</label>
                    <div className="grid grid-cols-3 gap-2">
                      {subjects.map((subject) => (
                        <motion.button
                          key={subject.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSubject(subject.id)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                            selectedSubject === subject.id
                              ? 'border-blue-400 bg-blue-400/20'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`w-8 h-8 bg-gradient-to-r ${subject.color} rounded-full flex items-center justify-center`}>
                              <subject.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white text-xs">{subject.name}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Loader Types */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => triggerLoader('subject')}
                      disabled={activeLoader !== null}
                      className="p-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Subject Loader</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => triggerLoader('progress')}
                      disabled={activeLoader !== null}
                      className="p-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Target className="w-4 h-4" />
                      <span>Progress Loader</span>
                    </motion.button>
                  </div>

                  {/* Stop Button */}
                  {activeLoader && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={stopLoader}
                      className="w-full p-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg text-white font-medium flex items-center justify-center space-x-2"
                    >
                      <Square className="w-4 h-4" />
                      <span>Stop Loader</span>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Success & Error Animations */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Success & Error Animations</h3>
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => triggerLoader('success')}
                    disabled={activeLoader !== null}
                    className="w-full p-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Success Animation</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => triggerLoader('error')}
                    disabled={activeLoader !== null}
                    className="w-full p-4 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Error Animation</span>
                  </motion.button>

                  {/* Custom Messages */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Custom success message..."
                      className="w-full px-3 py-2 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300"
                    />
                    <input
                      type="text"
                      placeholder="Custom error message..."
                      className="w-full px-3 py-2 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Page Transitions */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Page Transitions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Transition Types */}
                  <div>
                    <label className="text-white text-sm mb-2 block">Transition Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {transitionTypes.map((type) => (
                        <motion.button
                          key={type.type}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTransitionType(type.type as any)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                            transitionType === type.type
                              ? 'border-blue-400 bg-blue-400/20'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-1">
                            <type.icon className="w-4 h-4 text-white" />
                            <span className="text-white text-xs">{type.name}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Transition Directions */}
                  <div>
                    <label className="text-white text-sm mb-2 block">Direction (for Slide)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {directions.map((direction) => (
                        <motion.button
                          key={direction.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTransitionDirection(direction.value as any)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                            transitionDirection === direction.value
                              ? 'border-blue-400 bg-blue-400/20'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <span className="text-white text-sm">{direction.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Transition Preview */}
                <div className="mt-6 p-4 bg-glass-200 rounded-lg border-2 border-dashed border-gray-600">
                  <h4 className="text-white font-medium mb-2">Transition Preview</h4>
                  <p className="text-gray-300 text-sm">
                    Current: <span className="text-blue-400">{transitionType}</span>
                    {transitionType === 'slide' && (
                      <> → <span className="text-green-400">{transitionDirection}</span></>
                    )}
                  </p>
                  <div className="mt-4 flex items-center space-x-2 text-gray-400">
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm">Transitions are automatically applied to page navigation</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Active Loaders */}
      {activeLoader === 'subject' && (
        <LoadingSystem 
          isLoading={true} 
          type="subject" 
          subject={selectedSubject}
          message={`Loading ${subjects.find(s => s.id === selectedSubject)?.name}...`}
        />
      )}
      
      {activeLoader === 'progress' && (
        <LoadingSystem 
          isLoading={true} 
          type="progress" 
          progress={progress}
          subject={selectedSubject}
        />
      )}
      
      {activeLoader === 'success' && (
        <LoadingSystem 
          type="success" 
          message="Great job! You've completed the task successfully! 🎉"
        />
      )}
      
      {activeLoader === 'error' && (
        <LoadingSystem 
          type="error" 
          message="Oops! Something went wrong, but don't worry - you've got this! 💪"
        />
      )}
    </>
  );
}; 