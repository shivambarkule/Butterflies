import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Save, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { playTypingSound, playSuccessSound, playNotificationSound, toggleSound, isSoundEnabled } from '../utils/soundEffects';

// Mock exam data
const mockExam = {
  id: '1',
  title: 'Advanced Mathematics - Calculus',
  duration: 60, // minutes
  totalQuestions: 10,
  questions: [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the derivative of x²?',
      options: ['x', '2x', 'x²', '2x²'],
      correctAnswer: 1
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: 'What is the integral of 2x?',
      options: ['x²', 'x² + C', '2x²', '2x² + C'],
      correctAnswer: 1
    },
    {
      id: 3,
      type: 'text',
      question: 'Explain the concept of limits in calculus.',
      placeholder: 'Type your answer here...'
    },
    {
      id: 4,
      type: 'multiple-choice',
      question: 'What is the limit of sin(x)/x as x approaches 0?',
      options: ['0', '1', '∞', 'Undefined'],
      correctAnswer: 1
    },
    {
      id: 5,
      type: 'multiple-choice',
      question: 'Which of the following is a continuous function?',
      options: ['f(x) = 1/x', 'f(x) = |x|', 'f(x) = 1/(x-1)', 'f(x) = √x'],
      correctAnswer: 1
    }
  ]
};

interface InteractiveExamProps {
  onComplete?: (answers: any) => void;
  onExit?: () => void;
}

export const InteractiveExam: React.FC<InteractiveExamProps> = ({ onComplete, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(mockExam.duration * 60); // in seconds
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());
  
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (!isExamStarted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit exam
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted]);

  // Auto-save effect
  useEffect(() => {
    if (!isExamStarted) return;

    autoSaveInterval.current = setInterval(() => {
      setIsAutoSaving(true);
      setShowSaveIndicator(true);
      playNotificationSound();
      
      // Simulate auto-save
      setTimeout(() => {
        setIsAutoSaving(false);
        playSuccessSound();
        setTimeout(() => setShowSaveIndicator(false), 2000);
      }, 1000);
    }, 30000); // Auto-save every 30 seconds

    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [isExamStarted, answers]);

  // Update progress
  useEffect(() => {
    const answeredQuestions = Object.keys(answers).length;
    setProgress((answeredQuestions / mockExam.totalQuestions) * 100);
  }, [answers]);

  const handleTypingSound = () => {
    playTypingSound();
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    handleTypingSound();
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mockExam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    if (onComplete) {
      onComplete(answers);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 300) return 'text-red-400'; // Last 5 minutes
    if (timeLeft <= 600) return 'text-yellow-400'; // Last 10 minutes
    return 'text-green-400';
  };

  const getTimePulse = () => {
    if (timeLeft <= 300) return 'animate-pulse';
    if (timeLeft <= 600) return 'animate-pulse';
    return '';
  };

  const currentQ = mockExam.questions[currentQuestion];

  if (!isExamStarted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center p-6"
      >
        <GlassCard className="p-8 max-w-2xl w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-4">{mockExam.title}</h1>
            <div className="space-y-4 text-gray-300 mb-8">
              <p><strong>Duration:</strong> {mockExam.duration} minutes</p>
              <p><strong>Questions:</strong> {mockExam.totalQuestions}</p>
              <p><strong>Instructions:</strong></p>
              <ul className="text-left max-w-md mx-auto space-y-2">
                <li>• Read each question carefully</li>
                <li>• You can navigate between questions</li>
                <li>• Your answers are auto-saved</li>
                <li>• Timer will auto-submit when time runs out</li>
              </ul>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExamStarted(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300"
            >
              Start Exam
            </motion.button>
          </motion.div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header with Timer and Progress */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">{mockExam.title}</h1>
              <span className="text-gray-300">Question {currentQuestion + 1} of {mockExam.questions.length}</span>
            </div>
            
            {/* Timer and Sound Toggle */}
            <div className="flex items-center space-x-3">
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
              
              <Clock className={`w-5 h-5 ${getTimeColor()}`} />
              <span className={`text-xl font-mono font-bold ${getTimeColor()} ${getTimePulse()}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-glass-100/30 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              >
                {/* Particle effects on progress */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Auto-save Indicator */}
      <AnimatePresence>
        {showSaveIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <GlassCard className="p-3 flex items-center space-x-2">
              {isAutoSaving ? (
                <>
                  <Save className="w-4 h-4 text-blue-400 animate-spin" />
                  <span className="text-white text-sm">Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Auto-saved</span>
                </>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Content */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <GlassCard className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Question {currentQ.id}: {currentQ.question}
            </h2>
            
            {currentQ.type === 'multiple-choice' ? (
              <div className="space-y-3">
                {currentQ.options?.map((option, index) => (
                  <motion.label
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-glass-100/30 hover:bg-glass-100/50 cursor-pointer transition-all duration-200"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={index}
                      checked={answers[currentQ.id] === index}
                      onChange={() => handleAnswerChange(currentQ.id, index)}
                      className="w-4 h-4 text-blue-400 bg-glass-200 border-glass-300 focus:ring-blue-400"
                    />
                    <span className="text-white">{option}</span>
                  </motion.label>
                ))}
              </div>
            ) : (
              <textarea
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                placeholder={currentQ.placeholder}
                className="w-full p-4 rounded-lg bg-glass-100/50 border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
                rows={6}
                onKeyDown={handleTypingSound}
              />
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-glass-100/50 rounded-xl text-white hover:bg-glass-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </motion.button>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmitExam}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300"
          >
            Submit Exam
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextQuestion}
          disabled={currentQuestion === mockExam.questions.length - 1}
          className="flex items-center space-x-2 px-6 py-3 bg-glass-100/50 rounded-xl text-white hover:bg-glass-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <span>Next</span>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}; 