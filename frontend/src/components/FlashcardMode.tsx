import React, { useState, useRef } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, RotateCw, Shuffle } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Mock flashcard data
const mockFlashcards: Flashcard[] = [
  {
    id: 1,
    front: "What is the derivative of x²?",
    back: "2x",
    subject: "Calculus",
    difficulty: "easy"
  },
  {
    id: 2,
    front: "What is the integral of 2x?",
    back: "x² + C",
    subject: "Calculus",
    difficulty: "easy"
  },
  {
    id: 3,
    front: "What is Newton's First Law?",
    back: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.",
    subject: "Physics",
    difficulty: "medium"
  },
  {
    id: 4,
    front: "What is the chemical formula for water?",
    back: "H₂O",
    subject: "Chemistry",
    difficulty: "easy"
  },
  {
    id: 5,
    front: "What is the capital of France?",
    back: "Paris",
    subject: "Geography",
    difficulty: "easy"
  },
  {
    id: 6,
    front: "What is the Pythagorean theorem?",
    back: "a² + b² = c²",
    subject: "Mathematics",
    difficulty: "medium"
  }
];

interface FlashcardModeProps {
  onClose?: () => void;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState([...mockFlashcards]);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      // Swipe right - correct
      handleSwipe('correct');
    } else if (info.offset.x < -100) {
      // Swipe left - incorrect
      handleSwipe('incorrect');
    }
  };

  const handleSwipe = (direction: 'correct' | 'incorrect') => {
    setStudyStats(prev => ({
      ...prev,
      [direction]: prev[direction] + 1,
      total: prev.total + 1
    }));

    // Move to next card
    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
        x.set(0);
      }
    }, 300);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudyStats({ correct: 0, incorrect: 0, total: 0 });
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudyStats({ correct: 0, incorrect: 0, total: 0 });
    x.set(0);
  };

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Flashcard Mode</h1>
              <p className="text-gray-300">Swipe right for correct, left for incorrect</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">Progress</p>
                <p className="text-white font-semibold">{currentIndex + 1} / {flashcards.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Score</p>
                <p className="text-white font-semibold">{studyStats.correct} / {studyStats.total}</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-glass-100/30 rounded-full h-2">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Flashcard */}
      <div className="flex items-center justify-center mb-6">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          style={{ x, rotate, opacity }}
          className="w-full max-w-md"
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-64 cursor-grab active:cursor-grabbing"
          >
            {/* Front of card */}
            <motion.div
              className={`absolute inset-0 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <GlassCard className="w-full h-full p-6 flex flex-col justify-center items-center text-center">
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentCard.difficulty === 'easy' ? 'bg-green-400/20 text-green-400' :
                    currentCard.difficulty === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-red-400/20 text-red-400'
                  }`}>
                    {currentCard.difficulty}
                  </span>
                  <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-400/20 text-blue-400">
                    {currentCard.subject}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-4">{currentCard.front}</h2>
                <p className="text-gray-300 text-sm">Tap to flip</p>
              </GlassCard>
            </motion.div>

            {/* Back of card */}
            <motion.div
              className={`absolute inset-0 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <GlassCard className="w-full h-full p-6 flex flex-col justify-center items-center text-center">
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentCard.difficulty === 'easy' ? 'bg-green-400/20 text-green-400' :
                    currentCard.difficulty === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-red-400/20 text-red-400'
                  }`}>
                    {currentCard.difficulty}
                  </span>
                  <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-400/20 text-blue-400">
                    {currentCard.subject}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-4">{currentCard.back}</h2>
                <p className="text-gray-300 text-sm">Tap to flip back</p>
              </GlassCard>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-3 bg-glass-100/50 rounded-xl text-white hover:bg-glass-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFlip}
          className="p-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl text-white hover:shadow-lg transition-all duration-300"
        >
          {isFlipped ? <RotateCcw className="w-6 h-6" /> : <RotateCw className="w-6 h-6" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="p-3 bg-glass-100/50 rounded-xl text-white hover:bg-glass-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShuffle}
          className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Shuffle className="w-5 h-5" />
          <span>Shuffle</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="px-6 py-3 bg-glass-100/50 rounded-xl text-white font-semibold hover:bg-glass-200/50 transition-all duration-300"
        >
          Reset
        </motion.button>

        {onClose && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300"
          >
            Close
          </motion.button>
        )}
      </div>

      {/* Swipe Instructions */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 rounded-full"></div>
            <span>Swipe left for incorrect</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <span>Swipe right for correct</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 