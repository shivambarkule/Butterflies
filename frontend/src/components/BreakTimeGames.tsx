import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Zap, 
  Palette, 
  Type, 
  Brain,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { playNotificationSound } from '../utils/soundEffects';

interface GameScore {
  game: string;
  score: number;
  time: number;
  date: Date;
}

interface BreakTimeGamesProps {
  onClose?: () => void;
}

type GameType = 'memory' | 'scramble' | 'math' | 'color' | 'typing';

const SUBJECT_CARDS = [
  { id: 1, subject: 'Math', icon: '∫', color: 'from-blue-400 to-cyan-400' },
  { id: 2, subject: 'Physics', icon: '⚡', color: 'from-purple-400 to-pink-400' },
  { id: 3, subject: 'Chemistry', icon: '⚗️', color: 'from-green-400 to-emerald-400' },
  { id: 4, subject: 'Biology', icon: '🧬', color: 'from-red-400 to-orange-400' },
  { id: 5, subject: 'History', icon: '📜', color: 'from-yellow-400 to-amber-400' },
  { id: 6, subject: 'Literature', icon: '📚', color: 'from-indigo-400 to-blue-400' },
  { id: 7, subject: 'Geography', icon: '🌍', color: 'from-teal-400 to-cyan-400' },
  { id: 8, subject: 'Art', icon: '🎨', color: 'from-pink-400 to-rose-400' },
];

const WORD_LIST = [
  'CALCULUS', 'DERIVATIVE', 'INTEGRAL', 'ALGEBRA', 'GEOMETRY',
  'PHYSICS', 'MECHANICS', 'THERMODYNAMICS', 'ELECTROMAGNETISM',
  'CHEMISTRY', 'MOLECULE', 'REACTION', 'CATALYST', 'EQUILIBRIUM',
  'BIOLOGY', 'ECOSYSTEM', 'EVOLUTION', 'GENETICS', 'PHOTOSYNTHESIS'
];

const MATH_PROBLEMS = [
  { question: '15 + 27 = ?', answer: 42 },
  { question: '8 × 6 = ?', answer: 48 },
  { question: '64 ÷ 8 = ?', answer: 8 },
  { question: '13 + 19 = ?', answer: 32 },
  { question: '7 × 9 = ?', answer: 63 },
  { question: '81 ÷ 9 = ?', answer: 9 },
  { question: '25 + 17 = ?', answer: 42 },
  { question: '6 × 8 = ?', answer: 48 },
];

const TYPING_WORDS = [
  'algorithm', 'hypothesis', 'synthesis', 'analysis', 'theorem',
  'equation', 'variable', 'constant', 'function', 'derivative'
];

export const BreakTimeGames: React.FC<BreakTimeGamesProps> = ({ onClose }) => {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [scores, setScores] = useState<GameScore[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [easterEggs, setEasterEggs] = useState<string[]>([]);

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Word Scramble State
  const [scrambledWord, setScrambledWord] = useState('');
  const [originalWord, setOriginalWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [scrambleScore, setScrambleScore] = useState(0);
  const [scrambleTime, setScrambleTime] = useState(60);

  // Math Puzzle State
  const [currentMathProblem, setCurrentMathProblem] = useState<any>(null);
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathScore, setMathScore] = useState(0);
  const [mathTime, setMathTime] = useState(60);

  // Color Sorting State
  const [colorBlocks, setColorBlocks] = useState<any[]>([]);
  const [colorScore, setColorScore] = useState(0);
  const [colorTime, setColorTime] = useState(60);

  // Typing Test State
  const [typingWord, setTypingWord] = useState('');
  const [typingInput, setTypingInput] = useState('');
    const [typingWPM, setTypingWPM] = useState(0);
  const [typingScore, setTypingScore] = useState(0);
  const [typingAccuracy, setTypingAccuracy] = useState(100);
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [typingTime, setTypingTime] = useState(60);

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Memory Game
  const initMemoryGame = () => {
    const selectedCards = SUBJECT_CARDS.slice(0, 6);
    const gameCards = [...selectedCards, ...selectedCards]
      .map((card, index) => ({ ...card, id: index, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5);
    
    setMemoryCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMemoryMoves(0);
  };

  // Initialize Word Scramble
  const initWordScramble = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    const scrambled = randomWord.split('').sort(() => Math.random() - 0.5).join('');
    setOriginalWord(randomWord);
    setScrambledWord(scrambled);
    setUserGuess('');
    setScrambleScore(0);
    setScrambleTime(60);
  };

  // Initialize Math Puzzle
  const initMathPuzzle = () => {
    const randomProblem = MATH_PROBLEMS[Math.floor(Math.random() * MATH_PROBLEMS.length)];
    setCurrentMathProblem(randomProblem);
    setMathAnswer('');
    setMathScore(0);
    setMathTime(60);
  };

  // Initialize Color Sorting
  const initColorSorting = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const blocks = colors.map(color => ({
      id: Math.random(),
      color,
      x: Math.random() * 300,
      y: Math.random() * 200
    }));
    setColorBlocks(blocks);
    setColorScore(0);
    setColorTime(60);
  };

  // Initialize Typing Test
  const initTypingTest = () => {
    const randomWord = TYPING_WORDS[Math.floor(Math.random() * TYPING_WORDS.length)];
    setTypingWord(randomWord);
    setTypingInput('');
    setTypingWPM(0);
    setTypingAccuracy(100);
    setTypingStartTime(null);
    setTypingTime(60);
  };

  // Start Game
  const startGame = (gameType: GameType) => {
    setCurrentGame(gameType);
    setGameState('playing');
    
    switch (gameType) {
      case 'memory':
        initMemoryGame();
        break;
      case 'scramble':
        initWordScramble();
        break;
      case 'math':
        initMathPuzzle();
        break;
      case 'color':
        initColorSorting();
        break;
      case 'typing':
        initTypingTest();
        break;
    }

    if (soundEnabled) {
      playNotificationSound();
    }
  };

  // Memory Game Logic
  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedPairs.includes(cardId)) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMemoryMoves(prev => prev + 1);
      const [first, second] = newFlippedCards;
      const firstCard = memoryCards.find(card => card.id === first);
      const secondCard = memoryCards.find(card => card.id === second);

      if (firstCard.subject === secondCard.subject) {
        setMatchedPairs(prev => [...prev, first, second]);
        setFlippedCards([]);
        
        if (matchedPairs.length + 2 === memoryCards.length) {
          endGame('memory', memoryMoves + 1, 60 - Math.floor((memoryMoves + 1) * 2));
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Word Scramble Logic
  const handleScrambleSubmit = () => {
    if (userGuess.toUpperCase() === originalWord) {
      setScrambleScore(prev => prev + 10);
      setScrambleTime(prev => prev + 5);
      initWordScramble();
      setUserGuess('');
    }
  };

  // Math Puzzle Logic
  const handleMathSubmit = () => {
    if (parseInt(mathAnswer) === currentMathProblem.answer) {
      setMathScore(prev => prev + 10);
      setMathTime(prev => prev + 5);
      initMathPuzzle();
      setMathAnswer('');
    }
  };

  // Color Sorting Logic
  const handleColorSort = (blockId: number, targetColor: string) => {
    const block = colorBlocks.find(b => b.id === blockId);
    if (block && block.color === targetColor) {
      setColorScore(prev => prev + 10);
      setColorBlocks(prev => prev.filter(b => b.id !== blockId));
      
      if (colorBlocks.length === 1) {
        endGame('color', colorScore + 10, 60 - Math.floor((colorScore + 10) / 10));
      }
    }
  };

  // Typing Test Logic
  const handleTypingInput = (value: string) => {
    if (!typingStartTime) {
      setTypingStartTime(Date.now());
    }
    
    setTypingInput(value);
    
    if (value === typingWord) {
      const timeElapsed = (Date.now() - (typingStartTime || Date.now())) / 1000;
      const wpm = Math.round((typingWord.length / 5) / (timeElapsed / 60));
      setTypingWPM(wpm);
      setTypingScore(prev => prev + wpm);
      initTypingTest();
    }
  };

  // End Game
  const endGame = (game: string, score: number, timeLeft: number) => {
    const gameScore: GameScore = {
      game,
      score,
      time: timeLeft,
      date: new Date()
    };
    
    setScores(prev => [...prev, gameScore]);
    setGameState('gameOver');
    
    // Check for easter eggs
    if (score >= 100 && !easterEggs.includes('high_scorer')) {
      setEasterEggs(prev => [...prev, 'high_scorer']);
    }
    if (timeLeft >= 50 && !easterEggs.includes('speed_demon')) {
      setEasterEggs(prev => [...prev, 'speed_demon']);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (gameState === 'playing' && currentGame) {
      gameTimerRef.current = setInterval(() => {
        switch (currentGame) {
          case 'scramble':
            setScrambleTime(prev => {
              if (prev <= 1) {
                endGame('scramble', scrambleScore, 0);
                return 0;
              }
              return prev - 1;
            });
            break;
          case 'math':
            setMathTime(prev => {
              if (prev <= 1) {
                endGame('math', mathScore, 0);
                return 0;
              }
              return prev - 1;
            });
            break;
          case 'color':
            setColorTime(prev => {
              if (prev <= 1) {
                endGame('color', colorScore, 0);
                return 0;
              }
              return prev - 1;
            });
            break;
          case 'typing':
            setTypingTime(prev => {
              if (prev <= 1) {
                endGame('typing', typingScore, 0);
                return 0;
              }
              return prev - 1;
            });
            break;
        }
      }, 1000);
    }

    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, [gameState, currentGame, scrambleScore, mathScore, colorScore, typingWPM]);

  const renderGameMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => startGame('memory')}
        className="cursor-pointer"
      >
        <GlassCard className="p-6 text-center hover:bg-glass-200/30 transition-all duration-300">
          <Brain className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h3 className="text-xl font-bold text-white mb-2">Memory Match</h3>
          <p className="text-gray-300 text-sm">Match subject-related cards</p>
        </GlassCard>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => startGame('scramble')}
        className="cursor-pointer"
      >
        <GlassCard className="p-6 text-center hover:bg-glass-200/30 transition-all duration-300">
          <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-xl font-bold text-white mb-2">Word Scramble</h3>
          <p className="text-gray-300 text-sm">Unscramble subject terms</p>
        </GlassCard>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => startGame('math')}
        className="cursor-pointer"
      >
        <GlassCard className="p-6 text-center hover:bg-glass-200/30 transition-all duration-300">
          <Target className="w-12 h-12 mx-auto mb-4 text-green-400" />
          <h3 className="text-xl font-bold text-white mb-2">Math Puzzle</h3>
          <p className="text-gray-300 text-sm">Quick mental math challenges</p>
        </GlassCard>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => startGame('color')}
        className="cursor-pointer"
      >
        <GlassCard className="p-6 text-center hover:bg-glass-200/30 transition-all duration-300">
          <Palette className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <h3 className="text-xl font-bold text-white mb-2">Color Sorting</h3>
          <p className="text-gray-300 text-sm">Sort colored blocks by themes</p>
        </GlassCard>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => startGame('typing')}
        className="cursor-pointer"
      >
        <GlassCard className="p-6 text-center hover:bg-glass-200/30 transition-all duration-300">
          <Type className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-xl font-bold text-white mb-2">Typing Speed</h3>
          <p className="text-gray-300 text-sm">Race against time typing terms</p>
        </GlassCard>
      </motion.div>

      {easterEggs.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="cursor-pointer"
        >
          <GlassCard className="p-6 text-center bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-xl font-bold text-white mb-2">Easter Eggs!</h3>
            <p className="text-gray-300 text-sm">{easterEggs.length} discovered</p>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );

  const renderMemoryGame = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-white">
          <div className="text-2xl font-bold">Memory Match</div>
          <div className="text-gray-300">Moves: {memoryMoves}</div>
        </div>
        <div className="text-right text-white">
          <div className="text-2xl font-bold">{matchedPairs.length / 2}/6</div>
          <div className="text-gray-300">Pairs Found</div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {memoryCards.map(card => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 ${
              flippedCards.includes(card.id) || matchedPairs.includes(card.id)
                ? 'bg-gradient-to-br ' + card.color
                : 'bg-glass-200/50 hover:bg-glass-300/50'
            } flex items-center justify-center text-2xl font-bold`}
          >
            {flippedCards.includes(card.id) || matchedPairs.includes(card.id) ? (
              <div className="text-center">
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="text-sm">{card.subject}</div>
              </div>
            ) : (
              <div className="text-4xl">?</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderWordScramble = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-white">
          <div className="text-2xl font-bold">Word Scramble</div>
          <div className="text-gray-300">Score: {scrambleScore}</div>
        </div>
        <div className="text-right text-white">
          <div className="text-2xl font-bold">{scrambleTime}s</div>
          <div className="text-gray-300">Time Left</div>
        </div>
      </div>
      
      <GlassCard className="p-8 text-center">
        <div className="text-6xl font-bold text-blue-400 mb-6">{scrambledWord}</div>
        <div className="space-y-4">
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
            placeholder="Enter your answer..."
            className="w-full p-4 rounded-lg bg-glass-100/50 border border-glass-200 text-white text-center text-xl font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyPress={(e) => e.key === 'Enter' && handleScrambleSubmit()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleScrambleSubmit}
            className="px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg text-white font-semibold"
          >
            Submit Answer
          </motion.button>
        </div>
      </GlassCard>
    </div>
  );

  const renderMathPuzzle = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-white">
          <div className="text-2xl font-bold">Math Puzzle</div>
          <div className="text-gray-300">Score: {mathScore}</div>
        </div>
        <div className="text-right text-white">
          <div className="text-2xl font-bold">{mathTime}s</div>
          <div className="text-gray-300">Time Left</div>
        </div>
      </div>
      
      <GlassCard className="p-8 text-center">
        <div className="text-6xl font-bold text-green-400 mb-6">{currentMathProblem?.question}</div>
        <div className="space-y-4">
          <input
            type="number"
            value={mathAnswer}
            onChange={(e) => setMathAnswer(e.target.value)}
            placeholder="Enter your answer..."
            className="w-full p-4 rounded-lg bg-glass-100/50 border border-glass-200 text-white text-center text-xl font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            onKeyPress={(e) => e.key === 'Enter' && handleMathSubmit()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMathSubmit}
            className="px-8 py-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg text-white font-semibold"
          >
            Submit Answer
          </motion.button>
        </div>
      </GlassCard>
    </div>
  );

  const renderColorSorting = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-white">
          <div className="text-2xl font-bold">Color Sorting</div>
          <div className="text-gray-300">Score: {colorScore}</div>
        </div>
        <div className="text-right text-white">
          <div className="text-2xl font-bold">{colorTime}s</div>
          <div className="text-gray-300">Time Left</div>
        </div>
      </div>
      
      <div className="relative h-64 bg-glass-100/20 rounded-lg overflow-hidden">
        {colorBlocks.map(block => (
          <motion.div
            key={block.id}
            drag
            dragMomentum={false}
            dragElastic={0.1}
            onDragEnd={(_e, info) => {
              const targetY = info.point.y;
              const targetX = info.point.x;
              
              // Check if dropped in correct zone
              const colorZones = {
                red: { x: 50, y: 50, width: 80, height: 60 },
                blue: { x: 150, y: 50, width: 80, height: 60 },
                green: { x: 250, y: 50, width: 80, height: 60 },
                yellow: { x: 50, y: 150, width: 80, height: 60 },
                purple: { x: 150, y: 150, width: 80, height: 60 },
                orange: { x: 250, y: 150, width: 80, height: 60 }
              };
              
              const zone = colorZones[block.color as keyof typeof colorZones];
              if (targetX >= zone.x && targetX <= zone.x + zone.width &&
                  targetY >= zone.y && targetY <= zone.y + zone.height) {
                handleColorSort(block.id, block.color);
              }
            }}
            className={`absolute w-12 h-12 rounded-lg cursor-grab active:cursor-grabbing bg-${block.color}-400 shadow-lg`}
            style={{ left: block.x, top: block.y }}
          />
        ))}
        
        {/* Color zones */}
        {['red', 'blue', 'green', 'yellow', 'purple', 'orange'].map((color, index) => (
          <div
            key={color}
            className={`absolute w-20 h-15 rounded-lg border-2 border-dashed border-${color}-400/50 bg-${color}-400/10`}
            style={{
              left: 50 + (index % 3) * 100,
              top: 50 + Math.floor(index / 3) * 100
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderTypingTest = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-white">
          <div className="text-2xl font-bold">Typing Speed Test</div>
          <div className="text-gray-300">WPM: {typingWPM}</div>
        </div>
        <div className="text-right text-white">
          <div className="text-2xl font-bold">{typingTime}s</div>
          <div className="text-gray-300">Time Left</div>
        </div>
      </div>
      
      <GlassCard className="p-8 text-center">
        <div className="text-4xl font-bold text-red-400 mb-6">{typingWord}</div>
        <div className="space-y-4">
          <input
            type="text"
            value={typingInput}
            onChange={(e) => handleTypingInput(e.target.value)}
            placeholder="Start typing..."
            className="w-full p-4 rounded-lg bg-glass-100/50 border border-glass-200 text-white text-center text-xl font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
            autoFocus
          />
          <div className="text-gray-300">
            Accuracy: {typingAccuracy}% | Words Completed: {Math.floor(typingWPM / 10)}
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const renderGameOver = () => {
    const lastScore = scores[scores.length - 1];
    return (
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-3xl font-bold text-white">Game Over!</h2>
        <div className="text-xl text-gray-300">
          Final Score: {lastScore?.score} | Time: {lastScore?.time}s
        </div>
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setGameState('menu');
              setCurrentGame(null);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg text-white font-semibold"
          >
            Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setGameState('menu');
              setCurrentGame(null);
            }}
            className="px-6 py-3 bg-glass-100/50 rounded-lg text-white font-semibold"
          >
            Main Menu
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Break Time Games</h1>
              <p className="text-gray-300">Fun mini-games to keep your mind sharp during breaks</p>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 bg-glass-100/30 rounded-lg text-white hover:bg-glass-200/30 transition-all duration-300"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </motion.button>
              {onClose && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 bg-glass-100/30 rounded-lg text-white hover:bg-glass-200/30 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Game Content */}
      <div className="mb-6">
        <GlassCard className="p-6">
          <AnimatePresence mode="wait">
            {gameState === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {renderGameMenu()}
              </motion.div>
            )}

            {gameState === 'playing' && currentGame && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {currentGame === 'memory' && renderMemoryGame()}
                {currentGame === 'scramble' && renderWordScramble()}
                {currentGame === 'math' && renderMathPuzzle()}
                {currentGame === 'color' && renderColorSorting()}
                {currentGame === 'typing' && renderTypingTest()}
              </motion.div>
            )}

            {gameState === 'gameOver' && (
              <motion.div
                key="gameOver"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {renderGameOver()}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>

      {/* High Scores */}
      {scores.length > 0 && (
        <div className="mb-6">
          <GlassCard className="p-4">
            <h3 className="text-xl font-bold text-white mb-4">High Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scores.slice(-6).reverse().map((score, index) => (
                <div key={index} className="bg-glass-100/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold capitalize">{score.game}</div>
                      <div className="text-gray-300 text-sm">
                        {score.date.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{score.score}</div>
                      <div className="text-gray-300 text-sm">{score.time}s</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}; 