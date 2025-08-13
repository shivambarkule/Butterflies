import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useSound } from '../contexts/SoundContext';

interface EasterEggsProps {
  onClose?: () => void;
}

interface MatrixCharacter {
  id: number;
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
}

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

const MOTIVATIONAL_MESSAGES = [
  "🌟 You're doing amazing! Keep pushing forward!",
  "🚀 Every expert was once a beginner. You've got this!",
  "💪 Your dedication is inspiring. Don't give up!",
  "🎯 Focus on progress, not perfection. You're learning!",
  "🔥 You have the power to achieve anything you set your mind to!",
  "✨ Believe in yourself. You're capable of incredible things!",
  "🎓 Education is the key to unlocking your potential!",
  "🌈 Every challenge is an opportunity to grow stronger!",
  "⚡ You're building a brighter future with every study session!",
  "🎉 Celebrate your small wins - they lead to big victories!"
];

const DEVELOPER_CREDITS = [
  { name: "Lead Developer", role: "Full Stack Wizard", emoji: "🧙‍♂️" },
  { name: "UI/UX Designer", role: "Pixel Perfectionist", emoji: "🎨" },
  { name: "Backend Engineer", role: "Database Ninja", emoji: "🥷" },
  { name: "QA Tester", role: "Bug Hunter", emoji: "🐛" },
  { name: "Product Manager", role: "Feature Architect", emoji: "🏗️" }
];

export const EasterEggs: React.FC<EasterEggsProps> = () => {
  const { playNotification } = useSound();
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [matrixMode, setMatrixMode] = useState(false);
  const [matrixChars, setMatrixChars] = useState<MatrixCharacter[]>([]);
  const [cheatDetected, setCheatDetected] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [soundEnabled] = useState(true);
  const [easterEggs, setEasterEggs] = useState<string[]>([]);
  const [showEasterEggs, setShowEasterEggs] = useState(false);

  const matrixRef = useRef<HTMLDivElement>(null);
  const konamiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Konami Code Detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (KONAMI_CODE[konamiProgress] === e.code) {
        setKonamiProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress === KONAMI_CODE.length) {
            // Konami Code completed!
            unlockEasterEgg('konami_code');
            setShowEasterEggs(true);
            if (soundEnabled) {
              playNotification('success');
            }
            return 0;
          }
          return newProgress;
        });

        // Reset progress after 3 seconds of inactivity
        if (konamiTimeoutRef.current) {
          clearTimeout(konamiTimeoutRef.current);
        }
        konamiTimeoutRef.current = setTimeout(() => {
          setKonamiProgress(0);
        }, 3000);
      } else {
        setKonamiProgress(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (konamiTimeoutRef.current) {
        clearTimeout(konamiTimeoutRef.current);
      }
    };
  }, [konamiProgress, soundEnabled]);

  // Cheat Detection
  useEffect(() => {
    let typedText = '';
    const handleKeyPress = (e: KeyboardEvent) => {
      typedText += e.key.toLowerCase();
      if (typedText.includes('cheat')) {
        setCheatDetected(true);
        unlockEasterEgg('cheat_detected');
        if (soundEnabled) {
          playNotification('success');
        }
        setTimeout(() => {
          setCheatDetected(false);
        }, 3000);
        typedText = '';
      }
      // Reset after 2 seconds of inactivity
      setTimeout(() => {
        typedText = '';
      }, 2000);
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [soundEnabled]);

  // Matrix Mode
  useEffect(() => {
    let matrixInterval: NodeJS.Timeout;
    
    if (matrixMode) {
      matrixInterval = setInterval(() => {
        if (matrixRef.current) {
          const rect = matrixRef.current.getBoundingClientRect();
          const newChar: MatrixCharacter = {
            id: Date.now(),
            x: Math.random() * rect.width,
            y: -20,
            char: String.fromCharCode(0x30A0 + Math.random() * 96), // Japanese katakana
            speed: 1 + Math.random() * 2,
            opacity: 0.7 + Math.random() * 0.3
          };
          
          setMatrixChars(prev => [...prev, newChar]);
        }
      }, 100);

      // Clean up characters that are off screen
      const cleanupInterval = setInterval(() => {
        setMatrixChars(prev => prev.filter(char => char.y < window.innerHeight + 50));
      }, 1000);

      return () => {
        clearInterval(matrixInterval);
        clearInterval(cleanupInterval);
      };
    }
  }, [matrixMode]);

  // Matrix character animation
  useEffect(() => {
    if (matrixMode) {
      const animationInterval = setInterval(() => {
        setMatrixChars(prev => 
          prev.map(char => ({
            ...char,
            y: char.y + char.speed
          }))
        );
      }, 50);

      return () => clearInterval(animationInterval);
    }
  }, [matrixMode]);

  // Spacebar hold detection for Matrix mode
  useEffect(() => {
    let spacebarTimeout: NodeJS.Timeout;
    let isSpacebarHeld = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpacebarHeld) {
        isSpacebarHeld = true;
        spacebarTimeout = setTimeout(() => {
          setMatrixMode(true);
          unlockEasterEgg('matrix_mode');
          if (soundEnabled) {
            playNotification('success');
          }
        }, 2000);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpacebarHeld = false;
        if (spacebarTimeout) {
          clearTimeout(spacebarTimeout);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (spacebarTimeout) {
        clearTimeout(spacebarTimeout);
      }
    };
  }, [soundEnabled]);

  // Scroll to bottom detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition >= documentHeight - 100) {
        const randomMessage = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
        setMotivationalMessage(randomMessage);
        unlockEasterEgg('motivational_message');
        if (soundEnabled) {
          playNotification('success');
        }
        
        setTimeout(() => {
          setMotivationalMessage('');
        }, 5000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [soundEnabled]);

  // Global event listener for logo double-click
  useEffect(() => {
    const handleLogoDoubleClick = () => {
      setShowCredits(true);
      unlockEasterEgg('developer_credits');
      if (soundEnabled) {
        playNotification('success');
      }
    };

    window.addEventListener('logo-double-click', handleLogoDoubleClick);
    return () => window.removeEventListener('logo-double-click', handleLogoDoubleClick);
  }, [soundEnabled]);

  const unlockEasterEgg = (egg: string) => {
    if (!easterEggs.includes(egg)) {
      setEasterEggs(prev => [...prev, egg]);
    }
  };

  const handleLogoDoubleClick = () => {
    setShowCredits(true);
    unlockEasterEgg('developer_credits');
    if (soundEnabled) {
      playNotification('success');
    }
  };

  const closeMatrixMode = () => {
    setMatrixMode(false);
    setMatrixChars([]);
  };

  return (
    <>
      {/* Konami Code Progress Indicator (Hidden) */}
      <div className="fixed top-4 left-4 z-50">
        <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 transition-opacity duration-300"
             style={{ opacity: konamiProgress > 0 ? 1 : 0 }}>
          {konamiProgress > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs text-green-400 ml-3"
            >
              {konamiProgress}/{KONAMI_CODE.length}
            </motion.div>
          )}
        </div>
      </div>

      {/* Matrix Mode Overlay */}
      <AnimatePresence>
        {matrixMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={matrixRef}
            className="fixed inset-0 bg-black/80 z-50 pointer-events-none"
          >
            {matrixChars.map(char => (
              <motion.div
                key={char.id}
                className="absolute text-green-400 font-mono text-sm pointer-events-none"
                style={{
                  left: char.x,
                  top: char.y,
                  opacity: char.opacity
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: char.opacity }}
                exit={{ opacity: 0 }}
              >
                {char.char}
              </motion.div>
            ))}
            
            <div className="absolute top-4 right-4 pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeMatrixMode}
                className="p-2 bg-red-500 rounded-lg text-white"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🌌</div>
                <div className="text-2xl font-bold text-green-400 mb-2">Matrix Mode Activated</div>
                <div className="text-green-300">You've unlocked the secret study dimension!</div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cheat Detection Animation */}
      <AnimatePresence>
        {cheatDetected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <GlassCard className="p-8 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-6xl mb-4"
              >
                🚨
              </motion.div>
              <div className="text-2xl font-bold text-red-400 mb-2">CHEATING DETECTED!</div>
              <div className="text-gray-300">Just kidding! 😄 You found an easter egg!</div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Developer Credits */}
      <AnimatePresence>
        {showCredits && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCredits(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-8 w-96">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-4xl mb-4"
                  >
                    ⭐
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-6">Developer Credits</h2>
                  
                  <div className="space-y-4">
                    {DEVELOPER_CREDITS.map((credit, index) => (
                      <motion.div
                        key={credit.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-glass-100/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{credit.emoji}</span>
                          <div>
                            <div className="text-white font-semibold">{credit.name}</div>
                            <div className="text-gray-300 text-sm">{credit.role}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCredits(false)}
                    className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg text-white font-semibold"
                  >
                    Close
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivational Message */}
      <AnimatePresence>
        {motivationalMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <GlassCard className="p-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-2xl"
                >
                  ✨
                </motion.div>
                <div className="text-white font-semibold">{motivationalMessage}</div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Eggs Menu */}
      <AnimatePresence>
        {showEasterEggs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowEasterEggs(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-8 w-96">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-6">Secret Study Mode Unlocked!</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-gray-300">
                      <div className="font-semibold text-yellow-400 mb-2">🎮 Konami Code Detected!</div>
                      <div className="text-sm">You've unlocked the secret developer mode!</div>
                    </div>
                    
                    <div className="text-gray-300">
                      <div className="font-semibold text-blue-400 mb-2">🌟 Easter Eggs Found:</div>
                      <div className="text-sm">
                        {easterEggs.length} / 5 discovered
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {easterEggs.map(egg => (
                      <div key={egg} className="bg-green-400/20 text-green-300 p-2 rounded">
                        {egg.replace('_', ' ').toUpperCase()}
                      </div>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEasterEggs(false)}
                    className="mt-6 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg text-white font-semibold"
                  >
                    Continue Exploring!
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo Double-Click Area */}
      <div
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 cursor-pointer"
        onDoubleClick={handleLogoDoubleClick}
        title="Double-click for credits"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center opacity-20 hover:opacity-100 transition-opacity duration-300"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    </>
  );
}; 