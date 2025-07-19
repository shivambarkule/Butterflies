import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { playNotificationSound, toggleSound, isSoundEnabled } from '../utils/soundEffects';

interface TimerState {
  isRunning: boolean;
  isBreak: boolean;
  timeLeft: number;
  totalTime: number;
  cycles: number;
  completedSessions: number;
}

interface StudyTimerProps {
  onClose?: () => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ onClose }) => {
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isBreak: false,
    timeLeft: 25 * 60, // 25 minutes in seconds
    totalTime: 25 * 60,
    cycles: 0,
    completedSessions: 0
  });

  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());
  const [showNotification, setShowNotification] = useState(false);
  const [keyPressFeedback, setKeyPressFeedback] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        setKeyPressFeedback(true);
        setTimeout(() => setKeyPressFeedback(false), 200);
        
        if (timerState.isRunning) {
          handlePause();
        } else {
          handleStart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [timerState.isRunning]);

  const STUDY_TIME = 25 * 60; // 25 minutes
  const BREAK_TIME = 5 * 60; // 5 minutes
  const LONG_BREAK_TIME = 15 * 60; // 15 minutes after 4 cycles

  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            // Timer finished
            playNotificationSound();
            setShowNotification(true);
            
            if (prev.isBreak) {
              // Break finished, start study session
              return {
                ...prev,
                isRunning: false,
                isBreak: false,
                timeLeft: STUDY_TIME,
                totalTime: STUDY_TIME,
                cycles: prev.cycles + 1
              };
            } else {
              // Study session finished, start break
              const isLongBreak = (prev.completedSessions + 1) % 4 === 0;
              return {
                ...prev,
                isRunning: false,
                isBreak: true,
                timeLeft: isLongBreak ? LONG_BREAK_TIME : BREAK_TIME,
                totalTime: isLongBreak ? LONG_BREAK_TIME : BREAK_TIME,
                completedSessions: prev.completedSessions + 1
              };
            }
          }
          
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning]);

  const handleStart = () => {
    setTimerState(prev => ({ ...prev, isRunning: true }));
  };

  const handlePause = () => {
    setTimerState(prev => ({ ...prev, isRunning: false }));
  };

  const handleReset = () => {
    setTimerState({
      isRunning: false,
      isBreak: false,
      timeLeft: STUDY_TIME,
      totalTime: STUDY_TIME,
      cycles: 0,
      completedSessions: 0
    });
  };

  const handleSkip = () => {
    if (timerState.isBreak) {
      // Skip break, start study session
      setTimerState(prev => ({
        ...prev,
        isRunning: false,
        isBreak: false,
        timeLeft: STUDY_TIME,
        totalTime: STUDY_TIME,
        cycles: prev.cycles + 1
      }));
    } else {
      // Skip study session, start break
      const isLongBreak = (timerState.completedSessions + 1) % 4 === 0;
      setTimerState(prev => ({
        ...prev,
        isRunning: false,
        isBreak: true,
        timeLeft: isLongBreak ? LONG_BREAK_TIME : BREAK_TIME,
        totalTime: isLongBreak ? LONG_BREAK_TIME : BREAK_TIME,
        completedSessions: prev.completedSessions + 1
      }));
    }
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((timerState.totalTime - timerState.timeLeft) / timerState.totalTime) * 100;
  const isLongBreak = timerState.completedSessions > 0 && timerState.completedSessions % 4 === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Study Timer</h1>
              <p className="text-gray-300">Pomodoro Technique - Stay focused and productive</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleSound}
              className="p-2 rounded-lg bg-glass-100/30 hover:bg-glass-100/50 transition-all duration-300"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </motion.button>
          </div>
        </GlassCard>
      </div>

      {/* Timer Display */}
      <div className="flex items-center justify-center mb-8">
        <GlassCard className="p-8 max-w-md w-full text-center">
          <motion.div
            key={`${timerState.isBreak}-${timerState.cycles}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Timer Status */}
            <div className="mb-6">
              <motion.div
                animate={{ 
                  color: timerState.isBreak ? '#10B981' : '#3B82F6',
                  scale: timerState.isRunning ? 1.05 : 1
                }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold mb-2"
              >
                {timerState.isBreak ? 'Break Time' : 'Study Time'}
              </motion.div>
              {isLongBreak && timerState.isBreak && (
                <div className="text-yellow-400 text-sm font-medium">Long Break (15 min)</div>
              )}
            </div>

            {/* Timer Circle */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="4"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={timerState.isBreak ? "#10B981" : "#3B82F6"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "283", strokeDashoffset: "283" }}
                  animate={{ 
                    strokeDashoffset: 283 - (283 * progress) / 100 
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </svg>
              
              {/* Time display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: timerState.isRunning ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl font-mono font-bold text-white"
                >
                  {formatTime(timerState.timeLeft)}
                </motion.div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-glass-100/30 rounded-full h-2">
                <motion.div
                  className={`h-full rounded-full ${
                    timerState.isBreak ? 'bg-green-400' : 'bg-blue-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300">Completed Sessions</p>
                <p className="text-white font-semibold">{timerState.completedSessions}</p>
              </div>
              <div>
                <p className="text-gray-300">Current Cycle</p>
                <p className="text-white font-semibold">{timerState.cycles + 1}</p>
              </div>
            </div>
          </motion.div>
        </GlassCard>
      </div>

      {/* Enhanced Controls */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="p-4 bg-glass-100/50 rounded-xl text-white hover:bg-glass-200/50 transition-all duration-300 flex flex-col items-center space-y-1"
        >
          <RotateCcw className="w-6 h-6" />
          <span className="text-xs">Reset</span>
        </motion.button>

        {/* Main Play/Pause Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={keyPressFeedback ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {timerState.isRunning ? (
            <motion.button
              onClick={handlePause}
              className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-400 rounded-full text-white hover:shadow-lg hover:shadow-red-400/25 transition-all duration-300 flex items-center justify-center"
            >
              <Pause className="w-10 h-10" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleStart}
              className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full text-white hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300 flex items-center justify-center"
            >
              <Play className="w-10 h-10 ml-1" />
            </motion.button>
          )}
          
          {/* Status indicator */}
          <div className="absolute -top-2 -right-2">
            <motion.div
              animate={{ 
                scale: timerState.isRunning ? [1, 1.2, 1] : 1,
                opacity: timerState.isRunning ? 1 : 0.5
              }}
              transition={{ 
                scale: { duration: 1, repeat: timerState.isRunning ? Infinity : 0 },
                opacity: { duration: 0.3 }
              }}
              className={`w-4 h-4 rounded-full ${
                timerState.isRunning ? 'bg-green-400' : 'bg-gray-400'
              }`}
            />
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSkip}
          className="p-4 bg-glass-100/50 rounded-xl text-white hover:bg-glass-200/50 transition-all duration-300 flex flex-col items-center space-y-1"
        >
          <SkipForward className="w-6 h-6" />
          <span className="text-xs">Skip</span>
        </motion.button>
      </div>

      {/* Timer Status */}
      <div className="text-center mb-6">
        <motion.div
          animate={{ 
            color: timerState.isRunning ? '#10B981' : '#6B7280',
            scale: timerState.isRunning ? 1.05 : 1
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center space-x-2"
        >
          <div className={`w-3 h-3 rounded-full ${
            timerState.isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
          }`} />
          <span className="text-lg font-medium">
            {timerState.isRunning ? 'Timer Running' : 'Timer Paused'}
          </span>
        </motion.div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <GlassCard className="p-4 max-w-2xl mx-auto">
          <h3 className="text-white font-semibold mb-2">How it works:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300 mb-4">
            <div>
              <div className="font-medium text-blue-400">Study Session</div>
              <p>25 minutes of focused work</p>
            </div>
            <div>
              <div className="font-medium text-green-400">Short Break</div>
              <p>5 minutes to rest and recharge</p>
            </div>
            <div>
              <div className="font-medium text-yellow-400">Long Break</div>
              <p>15 minutes after 4 sessions</p>
            </div>
          </div>
          
          {/* Keyboard Shortcuts */}
          <div className="border-t border-glass-200/30 pt-4">
            <h4 className="text-white font-medium mb-2">Keyboard Shortcuts:</h4>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-glass-100/50 rounded text-xs font-mono">Space</kbd>
                <span>Play/Pause</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4">
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300"
          >
            Close Timer
          </motion.button>
        )}
      </div>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <GlassCard className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">
                    {timerState.isBreak ? 'Study session completed!' : 'Break time is over!'}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {timerState.isBreak ? 'Time to get back to work' : 'Take a well-deserved break'}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 