import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Bell,
  User,
  Settings,
  LogOut,
  Play,
  Eye,
  FileText,
  BarChart3,
  GraduationCap,
  Heart,
  Brain,
  Lightbulb,
  Star,
  Zap,
  Home,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Aperture
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { GlassCard } from '@/components/GlassCard';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { FloatingShapes } from '@/components/FloatingShapes';
import toast from 'react-hot-toast';
import { useTheme } from '@/contexts/ThemeContext';
import Snowfall from '@/components/Snowfall';
import { Helmet } from 'react-helmet-async';

// Mock data - replace with API calls
const mockStats = {
  totalClasses: 6,
  upcomingExams: 3,
  completedExams: 12,
  averageScore: 87,
  currentStreak: 5,
  totalXP: 1250,
  level: 8
};

const mockExams = [
  {
    id: '1',
    title: 'Mathematics - Calculus',
    subject: 'Mathematics',
    date: '2024-01-15T10:00:00',
    duration: 90,
    status: 'upcoming',
    totalQuestions: 50,
    difficulty: 'Medium'
  },
  {
    id: '2',
    title: 'Physics - Mechanics',
    subject: 'Physics',
    date: '2024-01-12T14:00:00',
    duration: 120,
    status: 'active',
    totalQuestions: 60,
    difficulty: 'Hard'
  },
  {
    id: '3',
    title: 'English Literature',
    subject: 'English',
    date: '2024-01-10T09:00:00',
    duration: 75,
    status: 'completed',
    totalQuestions: 40,
    difficulty: 'Easy',
    score: 92,
    rank: 3
  }
];

const mockClasses = [
  {
    id: '1',
    name: 'Advanced Mathematics',
    teacher: 'Dr. Sarah Johnson',
    progress: 75,
    nextClass: '2024-01-15T10:00:00',
    totalStudents: 28,
    recentActivity: 'New assignment posted'
  },
  {
    id: '2',
    name: 'Physics Fundamentals',
    teacher: 'Prof. Michael Chen',
    progress: 60,
    nextClass: '2024-01-16T14:00:00',
    totalStudents: 32,
    recentActivity: 'Lab report due tomorrow'
  },
  {
    id: '3',
    name: 'English Literature',
    teacher: 'Ms. Emily Davis',
    progress: 85,
    nextClass: '2024-01-17T11:00:00',
    totalStudents: 25,
    recentActivity: 'Discussion forum updated'
  }
];

const mockAchievements = [
  { id: '1', name: 'Perfect Score', icon: Star, color: 'from-yellow-400 to-orange-400', unlocked: true },
  { id: '2', name: 'Study Streak', icon: Zap, color: 'from-blue-400 to-purple-400', unlocked: true },
  { id: '3', name: 'Quick Learner', icon: Brain, color: 'from-green-400 to-emerald-400', unlocked: false },
  { id: '4', name: 'Helpful Student', icon: Heart, color: 'from-pink-400 to-rose-400', unlocked: true }
];

const motivationalQuotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Education is the most powerful weapon which you can use to change the world.",
  "Your time is limited, don't waste it living someone else's life."
];

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'classes', label: 'Classes', icon: GraduationCap, path: '/classes' },
  { id: 'exams', label: 'Exams', icon: FileText, path: '/exams' },
  { id: 'results', label: 'Results', icon: BarChart3, path: '/results' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
];

export const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentQuote, setCurrentQuote] = useState(0);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, setTheme } = useTheme();

  // Add a mock unread notifications count
  const unreadNotifications = 2; // Example: 2 unread

  useEffect(() => {
    // Rotate motivational quotes
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully! 👋');
  };

  const handleStartExam = (examId: string) => {
    toast.success('Starting exam... Good luck! 🍀');
    navigate(`/exam/${examId}`);
  };

  const handleViewResults = (examId: string) => {
    navigate(`/results/${examId}`);
  };

  const getTimeUntilExam = (examDate: string) => {
    const now = new Date();
    const exam = new Date(examDate);
    const diff = exam.getTime() - now.getTime();
    
    if (diff <= 0) return 'Now';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400';
      case 'active': return 'text-green-400';
      case 'completed': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-400/20';
      case 'active': return 'bg-green-400/20';
      case 'completed': return 'bg-purple-400/20';
      default: return 'bg-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Butterflies</title>
      </Helmet>
      <AnimatedBackground />
      <FloatingShapes />
      {isDark && <Snowfall />}
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-80 bg-gradient-to-br from-purple-200/80 via-blue-100/80 to-pink-100/80 backdrop-blur-xl border-r border-glass-200 z-50 shadow-2xl"
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-brand-400 to-purple-400 rounded-xl flex items-center justify-center">
              <Aperture className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Butterflies
            </span>
          </div>

          {/* User Profile */}
          <GlassCard className="p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-400 to-purple-400 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{user?.firstName} {user?.lastName}</h3>
                <p className="text-gray-300 text-sm">Level {mockStats.level} • {mockStats.totalXP} XP</p>
              </div>
            </div>
          </GlassCard>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-brand-400/20 to-purple-400/20 border border-brand-400/30'
                      : 'hover:bg-glass-200/40'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className={`w-5 h-5 ${
                    activeTab === item.id ? 'text-brand-400' : 'text-gray-600'
                  }`} />
                  <span className={`font-medium ${
                    activeTab === item.id ? 'text-white' : 'text-gray-700'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="mt-8 flex items-center space-x-3">
            <span className="text-xs text-gray-400">Light</span>
            <button
              className={`relative w-12 h-6 rounded-full transition bg-glass-200 ${isDark ? 'bg-purple-500' : 'bg-yellow-300'}`}
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Toggle dark mode"
            >
              <span
                className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${isDark ? 'translate-x-6' : ''}`}
                style={{ transform: isDark ? 'translateX(24px)' : 'translateX(0)' }}
              />
            </button>
            <span className="text-xs text-gray-400">Dark</span>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-glass-200/30 transition-all duration-300"
            >
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300 font-medium">Settings</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-400/20 transition-all duration-300"
            >
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      {/* Update main content wrapper to ensure it overlays correctly and is always visible */}
      <div className={`transition-all duration-300 relative z-10 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        {/* Top Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white hover:bg-glass-200/50 transition-all duration-300"
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </motion.button>
            
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user?.firstName}! 👋</h1>
              <p className="text-gray-300">Ready to ace your next exam?</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white hover:bg-glass-200/50 transition-all duration-300"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 border-2 border-white rounded-full flex items-center justify-center text-xs text-white font-bold animate-bounce">{unreadNotifications}</span>
              )}
            </motion.button>
            {/* Dark mode toggle */}
            <button
              aria-label="Toggle dark mode"
              className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${isDark ? 'bg-gradient-to-r from-purple-700 to-blue-700' : 'bg-gradient-to-r from-purple-200 to-blue-200'}`}
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDark ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="p-6 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <GlassCard className="p-6 cursor-pointer hover:bg-blue-100/30" onClick={() => navigate('/classes')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Classes</p>
                    <p className="text-3xl font-bold text-white">{mockStats.totalClasses}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-6 cursor-pointer hover:bg-orange-100/30" onClick={() => navigate('/upcoming-exams')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Upcoming Exams</p>
                    <p className="text-3xl font-bold text-white">{mockStats.upcomingExams}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <GlassCard className="p-6 cursor-pointer hover:bg-blue-100/30" onClick={() => navigate('/total-exams')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Exams</p>
                    <p className="text-3xl font-bold text-white">{mockStats.completedExams + mockStats.upcomingExams}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GlassCard className="p-6 cursor-pointer hover:bg-pink-100/30" onClick={() => navigate('/recent-achievements')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Recent Achievements</p>
                    <p className="text-3xl font-bold text-white">{mockAchievements.filter(a => a.unlocked).length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Exams */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="lg:col-span-2"
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Upcoming Exams</h2>
                  <Link
                    to="/exams"
                    className="text-brand-400 hover:text-brand-300 transition-colors text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {mockExams.slice(0, 3).map((exam, index) => (
                    <motion.div
                      key={exam.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200 hover:bg-glass-200/30 transition-all duration-300"
                    >
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{exam.title}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-gray-300">{exam.subject}</span>
                          <span className="text-gray-300">• {exam.duration} min</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(exam.status)} ${getStatusColor(exam.status)}`}>
                            {exam.status}
                          </span>
                        </div>
                        {exam.status === 'upcoming' && (
                          <p className="text-brand-400 text-sm mt-1">
                            Starts in {getTimeUntilExam(exam.date)}
                          </p>
                        )}
                        {exam.status === 'completed' && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-green-400 text-sm">Score: {exam.score}%</span>
                            <span className="text-purple-400 text-sm">Rank: #{exam.rank}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {exam.status === 'active' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleStartExam(exam.id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300 flex items-center space-x-2"
                          >
                            <Play className="w-4 h-4" />
                            <span>Start</span>
                          </motion.button>
                        )}
                        {exam.status === 'completed' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewResults(exam.id)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-400/25 transition-all duration-300 flex items-center space-x-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </motion.button>
                        )}
                        {exam.status === 'upcoming' && (
                          <div className="text-gray-400 text-sm">
                            {new Date(exam.date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Right Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="space-y-6"
            >
              {/* Motivational Quote */}
              <GlassCard className="p-6">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">Quote of the Day</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {motivationalQuotes[currentQuote]}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Achievements */}
              <GlassCard className="p-6">
                <h3 className="text-white font-semibold mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {mockAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-brand-400/10 to-purple-400/10 border border-brand-400/20' 
                          : 'bg-gray-700/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        achievement.unlocked 
                          ? `bg-gradient-to-r ${achievement.color}` 
                          : 'bg-gray-600'
                      }`}>
                        <achievement.icon className={`w-5 h-5 ${
                          achievement.unlocked ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          achievement.unlocked ? 'text-white' : 'text-gray-400'
                        }`}>
                          {achievement.name}
                        </p>
                        <p className={`text-xs ${
                          achievement.unlocked ? 'text-green-400' : 'text-gray-500'
                        }`}>
                          {achievement.unlocked ? 'Unlocked' : 'Locked'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Quick Actions */}
              <GlassCard className="p-6">
                <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-400 to-emerald-400 text-white font-semibold shadow-lg hover:shadow-green-400/25 transition-all duration-300"
                    onClick={() => navigate('/exams')}
                  >
                    <Play className="w-5 h-5" />
                    <span>Start New Exam</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold shadow-lg hover:shadow-purple-400/25 transition-all duration-300"
                    onClick={() => navigate('/results')}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>View Results</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-semibold shadow-lg hover:shadow-blue-400/25 transition-all duration-300"
                    onClick={() => navigate('/classes')}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>Join Class</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-semibold shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
                    onClick={() => navigate('/study-materials')}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Study Materials</span>
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Classes Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Your Classes</h2>
                <Link
                  to="/classes"
                  className="text-brand-400 hover:text-brand-300 transition-colors text-sm font-medium"
                >
                  View All Classes
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockClasses.map((classItem, index) => (
                  <motion.div
                    key={classItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                    className="p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200 hover:bg-glass-200/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-white font-semibold">{classItem.name}</h3>
                      <div className="w-8 h-8 bg-gradient-to-r from-brand-400 to-purple-400 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3">{classItem.teacher}</p>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-white font-medium">{classItem.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-brand-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${classItem.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          Next: {new Date(classItem.nextClass).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{classItem.totalStudents} students</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-blue-400/10 rounded-lg">
                      <p className="text-blue-400 text-xs">{classItem.recentActivity}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}; 