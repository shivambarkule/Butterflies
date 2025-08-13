import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Bell,
  LogOut,
  FileText,
  GraduationCap,
  Lightbulb,
  ChevronLeft,
  Plus,
  Users,
  Trophy,
  Target,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { FloatingShapes } from '../components/FloatingShapes';
import Snowfall from '../components/Snowfall';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { MagneticElement } from '../components/MagneticElement';
import { LoadingSystem } from '../components/LoadingSystem';
import { NotificationPopup } from '../components/NotificationPopup';
import { useNotifications } from '../contexts/NotificationContext';

// Mock data - replace with API calls
const mockStats = {
  totalClasses: 0,
  totalExams: 0,
  upcomingExams: 0,
  goodPoints: 1250
};

const mockJoinedClasses: any[] = [];



export const DashboardPage: React.FC = () => {
  const [joinCode, setJoinCode] = useState('');
  const [joinStatus, setJoinStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [joinMessage, setJoinMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoadingDemo, setShowLoadingDemo] = useState(false);
  const [loadingType, setLoadingType] = useState<'subject' | 'progress' | 'success' | 'error'>('subject');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { unreadCount } = useNotifications();
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinStatus('loading');
    setJoinMessage('');
    
    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (joinCode.trim().length < 3) {
        throw new Error('Invalid class code. Please check and try again.');
      }
      
      setJoinStatus('success');
      setJoinMessage('Successfully joined the class! 🎉');
      setJoinCode('');
      toast.success('Welcome to the class!');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setJoinStatus('idle');
        setJoinMessage('');
      }, 3000);
      
    } catch (err: any) {
      setJoinStatus('error');
      setJoinMessage(err.message || 'Failed to join class. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully! 👋');
  };

  const handleClassClick = (classId: string) => {
    navigate(`/classes/${classId}`);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getTimeUntilClass = (classDate: string) => {
    const now = new Date();
    const classTime = new Date(classDate);
    const diff = classTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Now';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Dashboard - Butterflies</title>
      </Helmet>
      
      <AnimatedBackground />
      <FloatingShapes />
      <Snowfall />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="glass-header p-6">
          <div className="flex items-center justify-between">
            {/* Left - Welcome */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSidebar}
                className="glass-button p-2"
              >
                <ChevronLeft className={`w-5 h-5 text-white transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {user?.firstName || 'Student'}! 👋
                </h1>
                <p className="text-gray-300">Ready to ace your next exam?</p>
              </div>
            {/* Double-clickable Logo */}
            <div
              className="ml-4 cursor-pointer relative group"
              onDoubleClick={() => {
                // Dispatch custom event for EasterEggs component
                const event = new CustomEvent('logo-double-click');
                window.dispatchEvent(event);
              }}
              title="Double-click for a surprise!"
            >
              {/* Hover indicator */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                Double-click for surprise! ✨
              </div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <span className="text-white font-bold text-lg">B</span>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                />
              </motion.div>
            </div>
          </div>
          
          {/* Right - Notifications & Theme */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative glass-button p-2"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button 
              onClick={handleLogout}
              className="glass-button p-2"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => {
                setLoadingType('subject');
                setShowLoadingDemo(true);
                setTimeout(() => setShowLoadingDemo(false), 3000);
              }}
              className="glass-button p-2"
              title="Test Subject Loader"
            >
              <BookOpen className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => {
                setLoadingType('success');
                setShowLoadingDemo(true);
                setTimeout(() => setShowLoadingDemo(false), 3000);
              }}
              className="glass-button p-2"
              title="Test Success Animation"
            >
              <Target className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => {
                const event = new CustomEvent('interactive-backgrounds-toggle');
                window.dispatchEvent(event);
              }}
              className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 backdrop-blur-md rounded-full border border-green-300 hover:from-green-500 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
              title="Toggle Interactive Backgrounds"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => {
                const event = new CustomEvent('gamification-toggle');
                window.dispatchEvent(event);
              }}
              className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 backdrop-blur-md rounded-full border border-yellow-300 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              title="Open Gamification"
            >
              <Trophy className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => {
                const event = new CustomEvent('social-features-toggle');
                window.dispatchEvent(event);
              }}
              className="p-2 bg-gradient-to-r from-blue-400 to-cyan-500 backdrop-blur-md rounded-full border border-blue-300 hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              title="Open Social Features"
            >
              <Users className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        </div>
      </header>

      {/* Sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 h-full w-80 bg-glass-100 backdrop-blur-md border-r border-glass-200 z-50 p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Navigation</h2>
            <button 
              onClick={toggleSidebar}
              className="p-2 bg-glass-200 rounded-full hover:bg-glass-300 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <nav className="space-y-4">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-3 p-3 bg-glass-200 rounded-lg text-white hover:bg-glass-300 transition-all duration-300"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/classes" 
              className="flex items-center space-x-3 p-3 bg-glass-100 rounded-lg text-white hover:bg-glass-200 transition-all duration-300"
            >
              <BookOpen className="w-5 h-5" />
              <span>Classes</span>
            </Link>
            <Link 
              to="/exams" 
              className="flex items-center space-x-3 p-3 bg-glass-100 rounded-lg text-white hover:bg-glass-200 transition-all duration-300"
            >
              <FileText className="w-5 h-5" />
              <span>Exams</span>
            </Link>
            <Link 
              to="/study-tools" 
              className="flex items-center space-x-3 p-3 bg-glass-100 rounded-lg text-white hover:bg-glass-200 transition-all duration-300"
            >
              <Lightbulb className="w-5 h-5" />
              <span>Study Tools</span>
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center space-x-3 p-3 bg-glass-100 rounded-lg text-white hover:bg-glass-200 transition-all duration-300"
            >
              <Users className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <Link 
              to="/study-tools" 
              className="flex items-center space-x-3 p-3 bg-glass-100 rounded-lg text-white hover:bg-glass-200 transition-all duration-300"
            >
              <Trophy className="w-5 h-5" />
              <span>Achievements</span>
            </Link>
          </nav>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Total Classes Card */}
            <MagneticElement strength={0.025}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Classes</p>
                    <p className="text-3xl font-bold text-white">{mockStats.totalClasses}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </MagneticElement>

            {/* Total Exams Card */}
            <MagneticElement strength={0.025}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Exams</p>
                    <p className="text-3xl font-bold text-white">{mockStats.totalExams}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </MagneticElement>

            {/* Upcoming Exams Card */}
            <MagneticElement strength={0.025}>
              <GlassCard className="p-6">
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
            </MagneticElement>
          </div>

          {/* Center Column - Joined Classes */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Your Classes</h2>
              <p className="text-gray-300">Start your learning journey</p>
            </div>
            
            {mockJoinedClasses.length > 0 ? (
              <div className="grid gap-4">
                {mockJoinedClasses.map((classItem, index) => (
                  <MagneticElement key={classItem.id} strength={0.04}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <GlassCard 
                        className="p-6 cursor-pointer hover:bg-glass-200 transition-all duration-300"
                        onClick={() => handleClassClick(classItem.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${classItem.color} rounded-xl flex items-center justify-center`}>
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{classItem.name}</h3>
                              <p className="text-gray-300 text-sm">{classItem.teacher}</p>
                              <p className="text-gray-400 text-xs">{classItem.recentActivity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300 text-sm">{classItem.totalStudents} students</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300 text-sm">
                                Next: {getTimeUntilClass(classItem.nextClass)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-300">Progress</span>
                            <span className="text-sm text-white font-semibold">{classItem.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 bg-gradient-to-r ${classItem.color} rounded-full transition-all duration-300`}
                              style={{ width: `${classItem.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  </MagneticElement>
                ))}
              </div>
            ) : (
              <MagneticElement strength={0.04}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                      <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Classes Yet</h3>
                    <p className="text-gray-300 mb-6">Join your first class to start learning and track your progress!</p>
                    <div className="flex items-center justify-center space-x-2 text-blue-400">
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">Use the "Join Class" feature to get started</span>
                    </div>
                  </GlassCard>
                </motion.div>
              </MagneticElement>
            )}
          </div>

          {/* Right Column - Join Class */}
          <div className="lg:col-span-1">
            {/* Join Class Card */}
            <MagneticElement strength={0.025}>
              <GlassCard className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Plus className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Join Class</h3>
                </div>
                
                <form onSubmit={handleJoinClass} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter class code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="glass-input w-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
                      disabled={joinStatus === 'loading'}
                    />
                  </div>
                  
                  {joinMessage && (
                    <div className={`p-3 rounded-lg text-sm ${
                      joinStatus === 'success' 
                        ? 'bg-green-400/20 border border-green-400/30 text-green-300' 
                        : 'bg-red-400/20 border border-red-400/30 text-red-300'
                    }`}>
                      {joinMessage}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={joinStatus === 'loading' || !joinCode.trim()}
                    className="w-full py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {joinStatus === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Joining...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Join Class</span>
                      </>
                    )}
                  </button>
                </form>
              </GlassCard>
            </MagneticElement>

            {/* Smart Study Tools Card */}
            <MagneticElement strength={0.04} className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Smart Study Tools</h3>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    Enhance your learning with interactive flashcards, timers, mind maps, and more!
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Flashcards</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Timer</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Mind Maps</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span>Voice Notes</span>
                    </div>
                  </div>
                  
                  <Link
                    to="/study-tools"
                    className="w-full py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-400/25 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Explore Tools</span>
                  </Link>
                </GlassCard>
              </motion.div>
            </MagneticElement>
          </div>
        </div>
      </main>
      <LoadingSystem isLoading={showLoadingDemo} type={loadingType} />
      
      {/* Notification Popup */}
      <NotificationPopup 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}; 