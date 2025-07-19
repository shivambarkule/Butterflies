import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Star, 
  Zap, 
  Target, 
  Clock, 
  BookOpen, 
  Award,
  TrendingUp,
  Crown,
  Shield,
  Sparkles,
  X
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useSound } from '../contexts/SoundContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'mastery' | 'speed' | 'perfect' | 'warrior';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  animation?: string;
}

interface SubjectMastery {
  subject: string;
  progress: number;
  maxProgress: number;
  level: number;
  color: string;
}

export const AchievementSystem: React.FC = () => {
  const { playAchievement, playNotification } = useSound();
  const [achievements, setAchievements] = useState<Achievement[]>([
    // Streak Achievements
    {
      id: 'streak_3',
      title: 'Getting Started',
      description: 'Maintain a 3-day login streak',
      icon: '🔥',
      category: 'streak',
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      rarity: 'common'
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day login streak',
      icon: '🔥',
      category: 'streak',
      unlocked: false,
      progress: 0,
      maxProgress: 7,
      rarity: 'rare'
    },
    {
      id: 'streak_30',
      title: 'Monthly Master',
      description: 'Maintain a 30-day login streak',
      icon: '🔥',
      category: 'streak',
      unlocked: false,
      progress: 0,
      maxProgress: 30,
      rarity: 'epic'
    },
    {
      id: 'streak_100',
      title: 'Century Streak',
      description: 'Maintain a 100-day login streak',
      icon: '🔥',
      category: 'streak',
      unlocked: false,
      progress: 0,
      maxProgress: 100,
      rarity: 'legendary'
    },

    // Subject Mastery Achievements
    {
      id: 'mastery_math',
      title: 'Math Wizard',
      description: 'Achieve 100% mastery in Mathematics',
      icon: '📐',
      category: 'mastery',
      unlocked: false,
      progress: 0,
      maxProgress: 100,
      rarity: 'rare'
    },
    {
      id: 'mastery_science',
      title: 'Science Sage',
      description: 'Achieve 100% mastery in Science',
      icon: '🧪',
      category: 'mastery',
      unlocked: false,
      progress: 0,
      maxProgress: 100,
      rarity: 'rare'
    },
    {
      id: 'mastery_english',
      title: 'English Expert',
      description: 'Achieve 100% mastery in English',
      icon: '📚',
      category: 'mastery',
      unlocked: false,
      progress: 0,
      maxProgress: 100,
      rarity: 'rare'
    },
    {
      id: 'mastery_all',
      title: 'Renaissance Scholar',
      description: 'Achieve 100% mastery in all subjects',
      icon: '🎓',
      category: 'mastery',
      unlocked: false,
      progress: 0,
      maxProgress: 300,
      rarity: 'legendary'
    },

    // Speed Achievements
    {
      id: 'speed_5min',
      title: 'Speed Demon',
      description: 'Complete an exam in under 5 minutes',
      icon: '⚡',
      category: 'speed',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      rarity: 'rare'
    },
    {
      id: 'speed_3min',
      title: 'Lightning Fast',
      description: 'Complete an exam in under 3 minutes',
      icon: '⚡',
      category: 'speed',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      rarity: 'epic'
    },
    {
      id: 'speed_1min',
      title: 'Time Bender',
      description: 'Complete an exam in under 1 minute',
      icon: '⚡',
      category: 'speed',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      rarity: 'legendary'
    },

    // Perfect Score Achievements
    {
      id: 'perfect_1',
      title: 'First Perfect',
      description: 'Get your first perfect score',
      icon: '🏆',
      category: 'perfect',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      rarity: 'common'
    },
    {
      id: 'perfect_5',
      title: 'Perfect Streak',
      description: 'Get 5 perfect scores',
      icon: '🏆',
      category: 'perfect',
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      rarity: 'rare'
    },
    {
      id: 'perfect_10',
      title: 'Perfect Master',
      description: 'Get 10 perfect scores',
      icon: '🏆',
      category: 'perfect',
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      rarity: 'epic'
    },
    {
      id: 'perfect_25',
      title: 'Perfect Legend',
      description: 'Get 25 perfect scores',
      icon: '🏆',
      category: 'perfect',
      unlocked: false,
      progress: 0,
      maxProgress: 25,
      rarity: 'legendary'
    },

    // Study Warrior Achievements
    {
      id: 'warrior_1hour',
      title: 'Study Beginner',
      description: 'Study for 1 hour total',
      icon: '⚔️',
      category: 'warrior',
      unlocked: false,
      progress: 0,
      maxProgress: 60,
      rarity: 'common'
    },
    {
      id: 'warrior_10hours',
      title: 'Study Warrior',
      description: 'Study for 10 hours total',
      icon: '⚔️',
      category: 'warrior',
      unlocked: false,
      progress: 0,
      maxProgress: 600,
      rarity: 'rare'
    },
    {
      id: 'warrior_50hours',
      title: 'Study Master',
      description: 'Study for 50 hours total',
      icon: '⚔️',
      category: 'warrior',
      unlocked: false,
      progress: 0,
      maxProgress: 3000,
      rarity: 'epic'
    },
    {
      id: 'warrior_100hours',
      title: 'Study Legend',
      description: 'Study for 100 hours total',
      icon: '⚔️',
      category: 'warrior',
      unlocked: false,
      progress: 0,
      maxProgress: 6000,
      rarity: 'legendary'
    }
  ]);

  const [subjectMastery, setSubjectMastery] = useState<SubjectMastery[]>([
    { subject: 'Mathematics', progress: 65, maxProgress: 100, level: 6, color: '#FF6B6B' },
    { subject: 'Science', progress: 42, maxProgress: 100, level: 4, color: '#4ECDC4' },
    { subject: 'English', progress: 78, maxProgress: 100, level: 7, color: '#45B7D1' },
    { subject: 'History', progress: 89, maxProgress: 100, level: 8, color: '#96CEB4' },
    { subject: 'Geography', progress: 23, maxProgress: 100, level: 2, color: '#FFEAA7' }
  ]);

  const [currentStreak, setCurrentStreak] = useState(5);
  const [totalStudyHours, setTotalStudyHours] = useState(12.5);
  const [perfectScores, setPerfectScores] = useState(3);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Simulate achievement unlocks
  useEffect(() => {
    const checkAchievements = () => {
      const updatedAchievements = achievements.map(achievement => {
        let shouldUnlock = false;
        let newProgress = achievement.progress;

        switch (achievement.id) {
          case 'streak_3':
            newProgress = Math.min(currentStreak, 3);
            shouldUnlock = currentStreak >= 3 && !achievement.unlocked;
            break;
          case 'streak_7':
            newProgress = Math.min(currentStreak, 7);
            shouldUnlock = currentStreak >= 7 && !achievement.unlocked;
            break;
          case 'streak_30':
            newProgress = Math.min(currentStreak, 30);
            shouldUnlock = currentStreak >= 30 && !achievement.unlocked;
            break;
          case 'streak_100':
            newProgress = Math.min(currentStreak, 100);
            shouldUnlock = currentStreak >= 100 && !achievement.unlocked;
            break;
          case 'warrior_1hour':
            newProgress = Math.min(totalStudyHours * 60, 60);
            shouldUnlock = totalStudyHours >= 1 && !achievement.unlocked;
            break;
          case 'warrior_10hours':
            newProgress = Math.min(totalStudyHours * 60, 600);
            shouldUnlock = totalStudyHours >= 10 && !achievement.unlocked;
            break;
          case 'warrior_50hours':
            newProgress = Math.min(totalStudyHours * 60, 3000);
            shouldUnlock = totalStudyHours >= 50 && !achievement.unlocked;
            break;
          case 'warrior_100hours':
            newProgress = Math.min(totalStudyHours * 60, 6000);
            shouldUnlock = totalStudyHours >= 100 && !achievement.unlocked;
            break;
          case 'perfect_1':
            newProgress = Math.min(perfectScores, 1);
            shouldUnlock = perfectScores >= 1 && !achievement.unlocked;
            break;
          case 'perfect_5':
            newProgress = Math.min(perfectScores, 5);
            shouldUnlock = perfectScores >= 5 && !achievement.unlocked;
            break;
          case 'perfect_10':
            newProgress = Math.min(perfectScores, 10);
            shouldUnlock = perfectScores >= 10 && !achievement.unlocked;
            break;
          case 'perfect_25':
            newProgress = Math.min(perfectScores, 25);
            shouldUnlock = perfectScores >= 25 && !achievement.unlocked;
            break;
        }

        if (shouldUnlock) {
          return {
            ...achievement,
            unlocked: true,
            progress: newProgress,
            unlockedAt: new Date()
          };
        }

        return {
          ...achievement,
          progress: newProgress
        };
      });

      setAchievements(updatedAchievements);

      // Check for newly unlocked achievements
      const newlyUnlocked = updatedAchievements.find(a => a.unlocked && a.unlockedAt);
      if (newlyUnlocked) {
        setShowAchievement(newlyUnlocked);
                  if (soundEnabled) {
            playNotification('success');
          }
        setTimeout(() => setShowAchievement(null), 4000);
      }
    };

    checkAchievements();
  }, [currentStreak, totalStudyHours, perfectScores, soundEnabled]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20';
      case 'rare': return 'bg-blue-500/20';
      case 'epic': return 'bg-purple-500/20';
      case 'legendary': return 'bg-yellow-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'mastery': return <Target className="w-4 h-4" />;
      case 'speed': return <Zap className="w-4 h-4" />;
      case 'perfect': return <Trophy className="w-4 h-4" />;
      case 'warrior': return <Shield className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Achievement Unlock Notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            className="fixed top-4 right-4 z-50"
          >
            <GlassCard className="p-6 min-w-80">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-4xl"
                >
                  {showAchievement.icon}
                </motion.div>
                <div className="flex-1">
                  <div className={`text-lg font-bold ${getRarityColor(showAchievement.rarity)}`}>
                    {showAchievement.title}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {showAchievement.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {showAchievement.rarity.toUpperCase()} ACHIEVEMENT UNLOCKED!
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-2xl"
                >
                  🎉
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Current Streak */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-300 text-sm">Current Streak</div>
              <div className="text-3xl font-bold text-white">{currentStreak} days</div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              🔥
            </motion.div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.min(currentStreak, 100)}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(currentStreak, 100)}%` }}
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
              />
            </div>
          </div>
        </GlassCard>

        {/* Total Study Hours */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-300 text-sm">Study Warrior</div>
              <div className="text-3xl font-bold text-white">{totalStudyHours}h</div>
            </div>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              ⚔️
            </motion.div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.floor(totalStudyHours)}/100h</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(totalStudyHours, 100)}%` }}
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
              />
            </div>
          </div>
        </GlassCard>

        {/* Perfect Scores */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-300 text-sm">Perfect Scores</div>
              <div className="text-3xl font-bold text-white">{perfectScores}</div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-3xl"
            >
              🏆
            </motion.div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{perfectScores}/25</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(perfectScores / 25) * 100}%` }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
              />
            </div>
          </div>
        </GlassCard>

        {/* Achievements Unlocked */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-300 text-sm">Achievements</div>
              <div className="text-3xl font-bold text-white">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-3xl"
            >
              ⭐
            </motion.div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }}
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
              />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Subject Mastery */}
      <GlassCard className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Subject Mastery</h3>
          <Target className="w-6 h-6 text-blue-400" />
        </div>
        
        <div className="space-y-4">
          {subjectMastery.map((subject, index) => (
            <div key={subject.subject} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="text-white font-medium">{subject.subject}</span>
                  <span className="text-gray-400 text-sm">Level {subject.level}</span>
                </div>
                <span className="text-gray-300 text-sm">{subject.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${subject.progress}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="h-3 rounded-full relative"
                  style={{ backgroundColor: subject.color }}
                >
                  <motion.div
                    animate={{ x: [-20, 20] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-white/20 rounded-full"
                  />
                </motion.div>
                {subject.progress >= 100 && (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    ✨
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Achievements List */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">All Achievements</h3>
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
          >
            {showAchievements ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {showAchievements && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : 'border-gray-600/50 bg-gray-500/10'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                      {achievement.title}
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      {achievement.description}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        className={`h-2 rounded-full ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                            : 'bg-gradient-to-r from-blue-400 to-purple-500'
                        }`}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(achievement.category)}
                        <span className={`${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </span>
                      </div>
                    </div>
                    
                    {achievement.unlocked && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-2 text-xs text-green-400 flex items-center space-x-1"
                      >
                        <Trophy className="w-3 h-3" />
                        <span>UNLOCKED</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </>
  );
}; 