import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  Zap, 
  Flame, 
  Award, 
  Medal, 
  Crown, 
  Gift,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Calendar,
  BookOpen,
  Brain,
  Rocket,
  Sparkles,
  Heart,
  Gem,
  Diamond,
  Crown as CrownIcon,
  Shield,
  Sword,
  Castle,
  Flag,
  Compass,
  Map,
  Navigation,
  Home,
  Settings,
  Plus,
  Minus,
  Edit,
  Trash,
  Eye,
  EyeOff,
  Share,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Timer,
  Hourglass,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarRange,
  CalendarSearch,
  CalendarClock,
  CalendarHeart,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSound } from '../contexts/SoundContext';
import { GlassCard } from './GlassCard';

interface Challenge {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'subject' | 'speed';
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  reward: {
    points: number;
    badge?: string;
    title?: string;
  };
  deadline: Date;
  isCompleted: boolean;
  isActive: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  subject?: string;
  category: string;
  streak?: number;
  bestTime?: number;
  attempts: number;
  createdAt: Date;
  completedAt?: Date;
}

interface GamificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GamificationSystem: React.FC<GamificationSystemProps> = ({ isOpen, onClose }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState<'challenges' | 'progress' | 'rewards' | 'leaderboard'>('challenges');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [userStats, setUserStats] = useState({
    totalPoints: 1250,
    level: 8,
    experience: 750,
    experienceToNext: 1000,
    streak: 12,
    badges: 15,
    completedChallenges: 47,
    totalChallenges: 89
  });

  const { mode, timeOfDay, season, weather, subject: currentSubject } = useTheme();
  const { playSfx, playNotification } = useSound();

  // Generate sample challenges
  useEffect(() => {
    const generateChallenges = () => {
      const now = new Date();
      const sampleChallenges: Challenge[] = [
        // Daily Challenges
        {
          id: 'daily-1',
          type: 'daily',
          title: 'Math Master',
          description: 'Complete 3 math problems today',
          target: 3,
          current: 1,
          unit: 'problems',
          reward: { points: 50, badge: '🧮', title: 'Math Whiz' },
          deadline: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          isCompleted: false,
          isActive: true,
          difficulty: 'easy',
          subject: 'math',
          category: 'Problem Solving',
          attempts: 0,
          createdAt: now
        },
        {
          id: 'daily-2',
          type: 'daily',
          title: 'Speed Reader',
          description: 'Read 2 chapters of literature',
          target: 2,
          current: 0,
          unit: 'chapters',
          reward: { points: 75, badge: '📚', title: 'Bookworm' },
          deadline: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          isCompleted: false,
          isActive: true,
          difficulty: 'medium',
          subject: 'english',
          category: 'Reading',
          attempts: 0,
          createdAt: now
        },
        {
          id: 'daily-3',
          type: 'daily',
          title: 'Science Explorer',
          description: 'Complete 1 science experiment',
          target: 1,
          current: 0,
          unit: 'experiments',
          reward: { points: 100, badge: '🔬', title: 'Scientist' },
          deadline: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          isCompleted: false,
          isActive: true,
          difficulty: 'hard',
          subject: 'science',
          category: 'Experiments',
          attempts: 0,
          createdAt: now
        },

        // Weekly Goals
        {
          id: 'weekly-1',
          type: 'weekly',
          title: 'Study Marathon',
          description: 'Study for 5 hours this week',
          target: 5,
          current: 2.5,
          unit: 'hours',
          reward: { points: 200, badge: '⏰', title: 'Time Master' },
          deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          isCompleted: false,
          isActive: true,
          difficulty: 'medium',
          category: 'Time Management',
          attempts: 0,
          createdAt: now
        },
        {
          id: 'weekly-2',
          type: 'weekly',
          title: 'Subject Mastery',
          description: 'Complete all physics topics',
          target: 8,
          current: 3,
          unit: 'topics',
          reward: { points: 300, badge: '⚛️', title: 'Physics Pro' },
          deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          isCompleted: false,
          isActive: true,
          difficulty: 'hard',
          subject: 'physics',
          category: 'Subject Mastery',
          attempts: 0,
          createdAt: now
        },

        // Monthly Milestones
        {
          id: 'monthly-1',
          type: 'monthly',
          title: 'Exam Champion',
          description: 'Take 10 exams this month',
          target: 10,
          current: 4,
          unit: 'exams',
          reward: { points: 500, badge: '🏆', title: 'Exam Master' },
          deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          isCompleted: false,
          isActive: true,
          difficulty: 'epic',
          category: 'Examinations',
          attempts: 0,
          createdAt: now
        },
        {
          id: 'monthly-2',
          type: 'monthly',
          title: 'Perfect Score',
          description: 'Achieve 100% on 3 exams',
          target: 3,
          current: 1,
          unit: 'perfect scores',
          reward: { points: 750, badge: '💎', title: 'Perfect Scholar' },
          deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          isCompleted: false,
          isActive: true,
          difficulty: 'epic',
          category: 'Achievement',
          attempts: 0,
          createdAt: now
        },

        // Subject Challenges
        {
          id: 'subject-1',
          type: 'subject',
          title: 'History Buff',
          description: 'Master all history topics',
          target: 15,
          current: 8,
          unit: 'topics',
          reward: { points: 400, badge: '🏛️', title: 'Historian' },
          deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
          isCompleted: false,
          isActive: true,
          difficulty: 'hard',
          subject: 'history',
          category: 'Subject Mastery',
          attempts: 0,
          createdAt: now
        },
        {
          id: 'subject-2',
          type: 'subject',
          title: 'Geography Explorer',
          description: 'Complete all geography modules',
          target: 12,
          current: 6,
          unit: 'modules',
          reward: { points: 350, badge: '🌍', title: 'Geographer' },
          deadline: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
          isCompleted: false,
          isActive: true,
          difficulty: 'medium',
          subject: 'geography',
          category: 'Subject Mastery',
          attempts: 0,
          createdAt: now
        },

        // Speed Challenges
        {
          id: 'speed-1',
          type: 'speed',
          title: 'Speed Demon',
          description: 'Complete exam in under 30 minutes',
          target: 30,
          current: 0,
          unit: 'minutes',
          reward: { points: 250, badge: '⚡', title: 'Speed Demon' },
          deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          isCompleted: false,
          isActive: true,
          difficulty: 'hard',
          category: 'Speed',
          bestTime: 45,
          attempts: 2,
          createdAt: now
        },
        {
          id: 'speed-2',
          type: 'speed',
          title: 'Quick Thinker',
          description: 'Solve 5 problems in 10 minutes',
          target: 10,
          current: 0,
          unit: 'minutes',
          reward: { points: 150, badge: '🧠', title: 'Quick Thinker' },
          deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
          isCompleted: false,
          isActive: true,
          difficulty: 'medium',
          category: 'Speed',
          bestTime: 15,
          attempts: 1,
          createdAt: now
        }
      ];
      setChallenges(sampleChallenges);
    };

    generateChallenges();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-emerald-400';
      case 'medium': return 'from-yellow-400 to-orange-400';
      case 'hard': return 'from-red-400 to-pink-400';
      case 'epic': return 'from-purple-400 to-indigo-400';
      default: return 'from-gray-400 to-slate-400';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '⭐';
      case 'medium': return '🔥';
      case 'hard': return '💎';
      case 'epic': return '👑';
      default: return '📝';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <CalendarDays className="w-5 h-5" />;
      case 'weekly': return <CalendarRange className="w-5 h-5" />;
      case 'monthly': return <Calendar className="w-5 h-5" />;
      case 'subject': return <BookOpen className="w-5 h-5" />;
      case 'speed': return <Timer className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getProgressPercentage = (challenge: Challenge) => {
    return Math.min((challenge.current / challenge.target) * 100, 100);
  };

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const updateChallengeProgress = (challengeId: string, increment: number = 1) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId) {
        const newCurrent = Math.min(challenge.current + increment, challenge.target);
        const isCompleted = newCurrent >= challenge.target;
        
        if (isCompleted && !challenge.isCompleted) {
          // Challenge completed!
          playSfx('success');
          playNotification('achievement');
          
          // Update user stats
          setUserStats(prevStats => ({
            ...prevStats,
            totalPoints: prevStats.totalPoints + challenge.reward.points,
            completedChallenges: prevStats.completedChallenges + 1,
            experience: prevStats.experience + challenge.reward.points
          }));
        }
        
        return {
          ...challenge,
          current: newCurrent,
          isCompleted,
          completedAt: isCompleted ? new Date() : challenge.completedAt
        };
      }
      return challenge;
    }));
  };

  const startSpeedChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    // Start timer logic would go here
    playSfx('start');
  };

  const completeSpeedChallenge = (challenge: Challenge, timeTaken: number) => {
    const isCompleted = timeTaken <= challenge.target;
    
    setChallenges(prev => prev.map(c => {
      if (c.id === challenge.id) {
        return {
          ...c,
          current: timeTaken,
          isCompleted,
          attempts: c.attempts + 1,
          bestTime: c.bestTime ? Math.min(c.bestTime, timeTaken) : timeTaken,
          completedAt: isCompleted ? new Date() : c.completedAt
        };
      }
      return c;
    }));
    
    if (isCompleted) {
      playSfx('success');
      playNotification('achievement');
    } else {
      playSfx('error');
    }
    
    setSelectedChallenge(null);
  };

  const ChallengesTab = () => (
    <div className="space-y-6">
      {/* Challenge Categories */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['daily', 'weekly', 'monthly', 'subject', 'speed'].map((type) => {
          const typeChallenges = challenges.filter(c => c.type === type);
          const completed = typeChallenges.filter(c => c.isCompleted).length;
          const total = typeChallenges.length;
          
          return (
            <motion.div
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-center p-4 bg-glass-100 rounded-lg border border-glass-200 cursor-pointer hover:bg-glass-200 transition-all duration-300"
            >
              <div className="text-2xl mb-2">{getTypeIcon(type)}</div>
              <h3 className="font-semibold text-white capitalize mb-1">{type}</h3>
              <p className="text-sm text-gray-300">{completed}/{total}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Active Challenges */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Active Challenges</h3>
        <div className="grid gap-4">
          {challenges.filter(c => c.isActive && !c.isCompleted).map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className="cursor-pointer"
              onClick={() => setSelectedChallenge(challenge)}
            >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                        {getDifficultyIcon(challenge.difficulty)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{challenge.title}</h4>
                        <p className="text-gray-300 text-sm">{challenge.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center space-x-1">
                        {getTypeIcon(challenge.type)}
                        <span className="capitalize">{challenge.type}</span>
                      </span>
                      {challenge.subject && (
                        <span className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span className="capitalize">{challenge.subject}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{getTimeRemaining(challenge.deadline)}</span>
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-white">{challenge.current}/{challenge.target} {challenge.unit}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getProgressPercentage(challenge)}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-2 bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} rounded-full`}
                        />
                      </div>
                    </div>
                    
                    {/* Reward */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">+{challenge.reward.points} points</span>
                        {challenge.reward.badge && (
                          <span className="text-2xl">{challenge.reward.badge}</span>
                        )}
                      </div>
                      
                      {challenge.type === 'speed' ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            startSpeedChallenge(challenge);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg font-semibold flex items-center space-x-2"
                        >
                          <Play className="w-4 h-4" />
                          <span>Start</span>
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateChallengeProgress(challenge.id);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-lg font-semibold flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Update</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Completed Challenges */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Completed Challenges</h3>
        <div className="grid gap-4">
          {challenges.filter(c => c.isCompleted).map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="cursor-pointer"
              onClick={() => setSelectedChallenge(challenge)}
            >
              <GlassCard className="p-6 bg-gradient-to-r from-green-400/10 to-emerald-400/10 border-green-400/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{challenge.title}</h4>
                      <p className="text-gray-300 text-sm">Completed {challenge.completedAt?.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">+{challenge.reward.points}</span>
                    </div>
                    {challenge.reward.badge && (
                      <span className="text-2xl">{challenge.reward.badge}</span>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProgressTab = () => (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <div className="text-2xl mb-2">🏆</div>
          <h3 className="font-semibold text-white">{userStats.totalPoints}</h3>
          <p className="text-gray-300 text-sm">Total Points</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl mb-2">⭐</div>
          <h3 className="font-semibold text-white">Level {userStats.level}</h3>
          <p className="text-gray-300 text-sm">Current Level</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl mb-2">🔥</div>
          <h3 className="font-semibold text-white">{userStats.streak}</h3>
          <p className="text-gray-300 text-sm">Day Streak</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl mb-2">🎖️</div>
          <h3 className="font-semibold text-white">{userStats.badges}</h3>
          <p className="text-gray-300 text-sm">Badges Earned</p>
        </GlassCard>
      </div>

      {/* Experience Bar */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Experience Progress</h3>
        <div className="mb-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Level {userStats.level}</span>
            <span className="text-gray-300">Level {userStats.level + 1}</span>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(userStats.experience / userStats.experienceToNext) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
          />
        </div>
        <p className="text-sm text-gray-300">{userStats.experience} / {userStats.experienceToNext} XP</p>
      </GlassCard>

      {/* Challenge Statistics */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Challenge Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{userStats.completedChallenges}</div>
            <p className="text-gray-300 text-sm">Completed</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{userStats.totalChallenges - userStats.completedChallenges}</div>
            <p className="text-gray-300 text-sm">Remaining</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">Completion Rate</span>
            <span className="text-white">{Math.round((userStats.completedChallenges / userStats.totalChallenges) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(userStats.completedChallenges / userStats.totalChallenges) * 100}%` }}
              transition={{ duration: 1 }}
              className="h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const RewardsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Earned Rewards</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { badge: '🧮', title: 'Math Whiz', description: 'Complete math challenges' },
          { badge: '📚', title: 'Bookworm', description: 'Read literature chapters' },
          { badge: '🔬', title: 'Scientist', description: 'Complete experiments' },
          { badge: '⏰', title: 'Time Master', description: 'Study for hours' },
          { badge: '⚛️', title: 'Physics Pro', description: 'Master physics topics' },
          { badge: '🏆', title: 'Exam Master', description: 'Take many exams' },
          { badge: '💎', title: 'Perfect Scholar', description: 'Achieve perfect scores' },
          { badge: '🏛️', title: 'Historian', description: 'Master history topics' }
        ].map((reward, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 bg-glass-100 rounded-lg border border-glass-200"
          >
            <div className="text-4xl mb-2">{reward.badge}</div>
            <h4 className="font-semibold text-white mb-1">{reward.title}</h4>
            <p className="text-gray-300 text-xs">{reward.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const LeaderboardTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Leaderboard</h3>
      <div className="space-y-4">
        {[
          { name: 'Alice Johnson', points: 2500, level: 12, streak: 25 },
          { name: 'Bob Smith', points: 2200, level: 11, streak: 18 },
          { name: 'Carol Davis', points: 2000, level: 10, streak: 15 },
          { name: 'David Wilson', points: 1800, level: 9, streak: 12 },
          { name: 'Eva Brown', points: 1600, level: 8, streak: 10 }
        ].map((user, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-glass-100 rounded-lg border border-glass-200"
          >
            <div className="text-2xl">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white">{user.name}</h4>
              <p className="text-gray-300 text-sm">Level {user.level} • {user.streak} day streak</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-yellow-400">{user.points} pts</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Gamification Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onClose()}
        className="fixed bottom-6 left-48 z-50 p-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Trophy className="w-6 h-6 text-white" />
      </motion.button>

      {/* Gamification Modal */}
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
          className="w-full max-w-6xl max-h-[90vh]"
        >
          <GlassCard className="p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Study Challenges & Gamification</h2>
              <button
                onClick={() => onClose()}
                className="p-2 hover:bg-glass-200 rounded-lg transition-colors duration-300"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-glass-200 rounded-lg p-1">
              {[
                { id: 'challenges', label: 'Challenges', icon: Target },
                { id: 'progress', label: 'Progress', icon: BarChart3 },
                { id: 'rewards', label: 'Rewards', icon: Trophy },
                { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'challenges' && <ChallengesTab />}
                {activeTab === 'progress' && <ProgressTab />}
                {activeTab === 'rewards' && <RewardsTab />}
                {activeTab === 'leaderboard' && <LeaderboardTab />}
              </motion.div>
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Speed Challenge Modal */}
      <AnimatePresence>
        {selectedChallenge && selectedChallenge.type === 'speed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-full max-w-md"
            >
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Speed Challenge</h3>
                <p className="text-gray-300 mb-4">{selectedChallenge.description}</p>
                <p className="text-white mb-4">Target: {selectedChallenge.target} {selectedChallenge.unit}</p>
                {selectedChallenge.bestTime && (
                  <p className="text-gray-300 mb-4">Best Time: {selectedChallenge.bestTime} {selectedChallenge.unit}</p>
                )}
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => completeSpeedChallenge(selectedChallenge, 25)}
                    className="flex-1 py-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-lg font-semibold"
                  >
                    Complete (25 min)
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedChallenge(null)}
                    className="flex-1 py-3 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-lg font-semibold"
                  >
                    Cancel
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 