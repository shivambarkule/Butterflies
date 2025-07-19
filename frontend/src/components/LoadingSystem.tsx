import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  History, 
  Languages, 
  Zap,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  Sparkles,
  Target,
  Brain,
  Heart,
  Rocket,
  Crown,
  Medal,
  Award,
  Gift
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSound } from '../contexts/SoundContext';

interface LoadingSystemProps {
  isLoading?: boolean;
  progress?: number;
  type?: 'subject' | 'page' | 'progress' | 'success' | 'error';
  subject?: string;
  message?: string;
  onComplete?: () => void;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
}

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  }>;
}

export const LoadingSystem: React.FC<LoadingSystemProps> = ({
  isLoading = false,
  progress = 0,
  type = 'subject',
  subject = 'general',
  message = '',
  onComplete
}) => {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const { subject: currentSubject } = useTheme();
  const { playSfx, playNotification } = useSound();

  // Get subject-specific icons and colors
  const getSubjectConfig = (subjectName: string) => {
    const configs = {
      math: {
        icon: Calculator,
        color: 'from-blue-400 to-cyan-400',
        particles: ['∑', 'π', '∞', '√', '∫', 'Δ', 'θ', 'φ'],
        bgColor: 'from-blue-500/20 to-cyan-500/20'
      },
      science: {
        icon: Zap,
        color: 'from-green-400 to-emerald-400',
        particles: ['⚛', '🧬', '🔬', '⚗', '🧪', '🔋', '⚡', '🌱'],
        bgColor: 'from-green-500/20 to-emerald-500/20'
      },
      english: {
        icon: Languages,
        color: 'from-red-400 to-pink-400',
        particles: ['📚', '✍', '📝', '📖', '🎭', '📜', '🖋', '📰'],
        bgColor: 'from-red-500/20 to-pink-500/20'
      },
      history: {
        icon: History,
        color: 'from-amber-400 to-orange-400',
        particles: ['🏛', '⚔', '👑', '🗡', '🏺', '📜', '⚜', '🎖'],
        bgColor: 'from-amber-500/20 to-orange-500/20'
      },
      geography: {
        icon: Globe,
        color: 'from-cyan-400 to-blue-400',
        particles: ['🌍', '🗺', '🏔', '🌊', '🏝', '🗽', '🗼', '🏰'],
        bgColor: 'from-cyan-500/20 to-blue-500/20'
      },
      general: {
        icon: BookOpen,
        color: 'from-purple-400 to-pink-400',
        particles: ['✨', '🌟', '💫', '⭐', '🎯', '🎨', '🎭', '🎪'],
        bgColor: 'from-purple-500/20 to-pink-500/20'
      }
    };
    
    return configs[subjectName as keyof typeof configs] || configs.general;
  };

  const subjectConfig = getSubjectConfig(subject);

  // Create confetti effect
  const createConfetti = () => {
    const newConfetti: Confetti[] = [];
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: ['#fbbf24', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b'][Math.floor(Math.random() * 6)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 8,
          y: Math.random() * 3 + 2
        }
      });
    }
    setConfetti(newConfetti);
    playSfx('success');
  };

  // Create firework effect
  const createFirework = (x: number, y: number) => {
    const colors = ['#fbbf24', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
    }> = [];
    
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const velocity = Math.random() * 3 + 2;
      particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1
      });
    }
    
    setFireworks(prev => [...prev, {
      id: Date.now(),
      x,
      y,
      color,
      particles
    }]);
  };

  // Success animation
  const triggerSuccess = () => {
    setShowSuccess(true);
    createConfetti();
    
    // Create multiple fireworks
    setTimeout(() => createFirework(window.innerWidth * 0.2, window.innerHeight * 0.3), 100);
    setTimeout(() => createFirework(window.innerWidth * 0.8, window.innerHeight * 0.4), 300);
    setTimeout(() => createFirework(window.innerWidth * 0.5, window.innerHeight * 0.2), 500);
    
    setTimeout(() => {
      setShowSuccess(false);
      setConfetti([]);
      setFireworks([]);
      onComplete?.();
    }, 3000);
  };

  // Error animation
  const triggerError = () => {
    setShowError(true);
    playNotification('error');
    
    setTimeout(() => {
      setShowError(false);
      onComplete?.();
    }, 3000);
  };

  // Auto-trigger based on type
  useEffect(() => {
    if (type === 'success' && !showSuccess) {
      triggerSuccess();
    } else if (type === 'error' && !showError) {
      triggerError();
    }
  }, [type]);

  // Animate confetti
  useEffect(() => {
    if (confetti.length > 0) {
      const interval = setInterval(() => {
        setConfetti(prev => 
          prev.map(c => ({
            ...c,
            x: c.x + c.velocity.x,
            y: c.y + c.velocity.y,
            rotation: c.rotation + 5
          })).filter(c => c.y < window.innerHeight + 50)
        );
      }, 16);
      
      return () => clearInterval(interval);
    }
  }, [confetti]);

  // Animate fireworks
  useEffect(() => {
    if (fireworks.length > 0) {
      const interval = setInterval(() => {
        setFireworks(prev => 
          prev.map(fw => ({
            ...fw,
            particles: fw.particles.map(p => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              life: p.life - 0.02
            })).filter(p => p.life > 0)
          })).filter(fw => fw.particles.length > 0)
        );
      }, 16);
      
      return () => clearInterval(interval);
    }
  }, [fireworks]);

  // Subject-themed loading animation
  const SubjectLoader = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-sm"
    >
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`w-24 h-24 bg-gradient-to-r ${subjectConfig.color} rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl`}
        >
          <subjectConfig.icon className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-white mb-4 capitalize"
        >
          Loading {subject}...
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-300 mb-8"
        >
          {message || `Preparing your ${subject} learning experience`}
        </motion.p>
        
        {/* Floating particles */}
        <div className="relative w-64 h-32 mx-auto">
          {subjectConfig.particles.map((particle, index) => (
            <motion.div
              key={index}
              initial={{ 
                x: Math.random() * 256,
                y: Math.random() * 128,
                opacity: 0
              }}
              animate={{ 
                x: Math.random() * 256,
                y: Math.random() * 128,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              className="absolute text-2xl text-white/60"
            >
              {particle}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Progress animation
  const ProgressLoader = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-sm"
    >
      <div className="w-96 max-w-[90vw] text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-20 h-20 bg-gradient-to-r ${subjectConfig.color} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          <Target className="w-10 h-10 text-white" />
        </motion.div>
        
        <h3 className="text-xl font-bold text-white mb-4">Loading Progress</h3>
        
        {/* Animated progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${subjectConfig.color} rounded-full relative`}
          >
            {/* Animated particles on progress bar */}
            <motion.div
              animate={{ x: [0, 100] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>
        
        <p className="text-gray-300">{Math.round(progress)}% Complete</p>
        
        {/* Floating progress indicators */}
        <div className="mt-8 flex justify-center space-x-2">
          {[0, 25, 50, 75, 100].map((milestone) => (
            <motion.div
              key={milestone}
              animate={{ 
                scale: progress >= milestone ? [1, 1.2, 1] : 1,
                opacity: progress >= milestone ? 1 : 0.3
              }}
              transition={{ duration: 0.3 }}
              className={`w-3 h-3 rounded-full ${
                progress >= milestone 
                  ? `bg-gradient-to-r ${subjectConfig.color}` 
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Success animation
  const SuccessAnimation = () => (
    <AnimatePresence>
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Confetti */}
          {confetti.map((c) => (
            <motion.div
              key={c.id}
              initial={{ x: c.x, y: c.y, rotate: 0 }}
              animate={{ 
                x: c.x + c.velocity.x * 100,
                y: c.y + c.velocity.y * 100,
                rotate: c.rotation + 360
              }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute text-2xl"
              style={{ color: c.color }}
            >
              {['✨', '🎉', '🎊', '⭐', '💫', '🌟'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
          
          {/* Fireworks */}
          {fireworks.map((fw) => (
            <div key={fw.id} className="absolute" style={{ left: fw.x, top: fw.y }}>
              {fw.particles.map((p, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ 
                    x: p.x,
                    y: p.y,
                    opacity: p.life
                  }}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: fw.color }}
                />
              ))}
            </div>
          ))}
          
          {/* Success message */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            className="text-center"
          >
            <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
            <p className="text-gray-300">{message || 'Operation completed successfully'}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Error animation
  const ErrorAnimation = () => (
    <AnimatePresence>
      {showError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="w-32 h-32 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
            >
              <XCircle className="w-16 h-16 text-white" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Oops! Something went wrong
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 mb-6"
            >
              {message || "Don't worry, even the best students make mistakes!"}
            </motion.p>
            
            <motion.div
              animate={{ 
                x: [0, -5, 5, -5, 0],
                y: [0, -2, 2, -2, 0]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-4xl"
            >
              😅
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!isLoading && type !== 'success' && type !== 'error') {
    return null;
  }

  return (
    <>
      {type === 'subject' && <SubjectLoader />}
      {type === 'progress' && <ProgressLoader />}
      <SuccessAnimation />
      <ErrorAnimation />
    </>
  );
};

// Export individual components for use in other parts of the app
export const SubjectLoader = () => <LoadingSystem isLoading={true} type="subject" />;
export const ProgressLoader = ({ progress }: { progress: number }) => (
  <LoadingSystem isLoading={true} type="progress" progress={progress} />
);
export const SuccessAnimation = ({ message }: { message?: string }) => (
  <LoadingSystem type="success" message={message} />
);
export const ErrorAnimation = ({ message }: { message?: string }) => (
  <LoadingSystem type="error" message={message} />
); 