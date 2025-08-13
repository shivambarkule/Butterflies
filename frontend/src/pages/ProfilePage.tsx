import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { FloatingShapes } from '../components/FloatingShapes';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Edit3, 
  Save, 
  X, 
  User, 
  Mail, 
  BookOpen, 
  Trophy, 
  Users, 
  Target, 
  Clock, 
  Star,
  Award,
  Heart,
  MessageCircle,
  Share2,
  Download,
  Upload,
  Settings,
  Bell,
  Calendar,
  TrendingUp,
  Zap,
  Crown,
  Shield,
  Sword,
  Flag,
  Compass,
  Map,
  Navigation,
  Home,
  Plus,
  Minus,
  Eye,
  EyeOff,
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
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Gem,
  Diamond,
  Castle,
  Gamepad2,
  Lightbulb,
  Brain,
  Rocket,
  Flame,
  Gift,
  Medal
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'studying';
  mutualClasses: number;
  mutualFriends: number;
  lastSeen: Date;
}

interface StudyStats {
  totalStudyTime: number;
  examsTaken: number;
  averageScore: number;
  subjectsMastered: number;
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'friends' | 'stats' | 'settings'>('profile');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    studentId: user?.studentId || '',
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    location: user?.location || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    interests: user?.interests || [],
    socialLinks: {
      twitter: user?.socialLinks?.twitter || '',
      linkedin: user?.socialLinks?.linkedin || '',
      github: user?.socialLinks?.github || '',
      instagram: user?.socialLinks?.instagram || ''
    }
  });

  // Mock data for achievements
  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first exam',
      icon: '🎯',
      color: 'from-green-400 to-emerald-400',
      unlockedAt: new Date('2024-01-15'),
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Math Master',
      description: 'Score 100% on 5 math exams',
      icon: '🧮',
      color: 'from-blue-400 to-purple-400',
      unlockedAt: new Date('2024-02-20'),
      rarity: 'rare'
    },
    {
      id: '3',
      name: 'Study Warrior',
      description: 'Study for 50 hours in a month',
      icon: '⚔️',
      color: 'from-orange-400 to-red-400',
      unlockedAt: new Date('2024-03-10'),
      rarity: 'epic'
    },
    {
      id: '4',
      name: 'Perfect Scholar',
      description: 'Maintain 95%+ average for 3 months',
      icon: '👑',
      color: 'from-yellow-400 to-amber-400',
      unlockedAt: new Date('2024-04-05'),
      rarity: 'legendary'
    }
  ];

  // Mock data for friends
  const friends: Friend[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      mutualClasses: 3,
      mutualFriends: 12,
      lastSeen: new Date()
    },
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      status: 'studying',
      mutualClasses: 2,
      mutualFriends: 8,
      lastSeen: new Date(Date.now() - 300000)
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'offline',
      mutualClasses: 1,
      mutualFriends: 5,
      lastSeen: new Date(Date.now() - 3600000)
    }
  ];

  // Mock study stats
  const studyStats: StudyStats = {
    totalStudyTime: 127.5,
    examsTaken: 24,
    averageScore: 87.3,
    subjectsMastered: 4,
    currentStreak: 12,
    longestStreak: 28,
    weeklyGoal: 20,
    weeklyProgress: 15.5
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm(prev => ({ ...prev, avatar: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(form);
      // Show success message
    } catch (err) {
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-purple-400';
      case 'epic': return 'from-purple-400 to-pink-400';
      case 'legendary': return 'from-yellow-400 to-orange-400';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'studying': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="text-center">
        <div className="relative inline-block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl"
          >
            <img
              src={form.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Camera className="w-5 h-5 text-white" />
          </motion.button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">First Name</label>
          <input 
            name="firstName" 
            value={form.firstName} 
            onChange={handleChange} 
            className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Last Name</label>
          <input 
            name="lastName" 
            value={form.lastName} 
            onChange={handleChange} 
            className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Username</label>
        <input 
          name="username" 
          value={form.username} 
          onChange={handleChange} 
          placeholder="@username"
          className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Bio</label>
        <textarea 
          name="bio" 
          value={form.bio} 
          onChange={handleChange} 
          rows={3}
          placeholder="Tell us about yourself..."
          className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Email</label>
          <input 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            className="w-full p-3 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200 text-gray-400 cursor-not-allowed" 
            disabled 
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Student ID</label>
          <input 
            name="studentId" 
            value={form.studentId} 
            onChange={handleChange} 
            className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Location</label>
          <input 
            name="location" 
            value={form.location} 
            onChange={handleChange} 
            placeholder="City, Country"
            className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Phone</label>
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            placeholder="+1 (555) 123-4567"
            className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Date of Birth</label>
        <input 
          name="dateOfBirth" 
          type="date"
          value={form.dateOfBirth} 
          onChange={handleChange} 
          className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
        />
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-gray-300 mb-2">Social Links</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            name="socialLinks.twitter" 
            value={form.socialLinks.twitter} 
            onChange={handleChange} 
            placeholder="Twitter username"
            className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
          />
          <input 
            name="socialLinks.linkedin" 
            value={form.socialLinks.linkedin} 
            onChange={handleChange} 
            placeholder="LinkedIn profile"
            className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
          />
          <input 
            name="socialLinks.github" 
            value={form.socialLinks.github} 
            onChange={handleChange} 
            placeholder="GitHub username"
            className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
          />
          <input 
            name="socialLinks.instagram" 
            value={form.socialLinks.instagram} 
            onChange={handleChange} 
            placeholder="Instagram username"
            className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
          />
        </div>
      </div>

      <motion.button 
        type="submit" 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl" 
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </motion.button>
    </div>
  );

  const AchievementsTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Achievements</h3>
        <p className="text-gray-300">Track your learning milestones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-full flex items-center justify-center text-2xl`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold">{achievement.name}</h4>
                <p className="text-gray-300 text-sm">{achievement.description}</p>
                <p className="text-gray-400 text-xs mt-1">
                  Unlocked {achievement.unlockedAt.toLocaleDateString()}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {achievement.rarity.toUpperCase()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const FriendsTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Friends</h3>
        <p className="text-gray-300">Connect with your study buddies</p>
      </div>

      <div className="space-y-4">
        {friends.map((friend) => (
          <motion.div
            key={friend.id}
            whileHover={{ scale: 1.01 }}
            className="p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-white`}></div>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold">{friend.name}</h4>
                <p className="text-gray-300 text-sm">
                  {friend.mutualClasses} mutual classes • {friend.mutualFriends} mutual friends
                </p>
                <p className="text-gray-400 text-xs">
                  Last seen {friend.lastSeen.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-blue-500/20 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-green-500/20 rounded-lg text-green-300 hover:bg-green-500/30 transition-all duration-300"
                >
                  <Users className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const StatsTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Study Statistics</h3>
        <p className="text-gray-300">Your learning journey in numbers</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200 text-center"
        >
          <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{studyStats.totalStudyTime}h</div>
          <div className="text-gray-300 text-sm">Total Study Time</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200 text-center"
        >
          <BookOpen className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{studyStats.examsTaken}</div>
          <div className="text-gray-300 text-sm">Exams Taken</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200 text-center"
        >
          <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{studyStats.averageScore}%</div>
          <div className="text-gray-300 text-sm">Average Score</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200 text-center"
        >
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{studyStats.subjectsMastered}</div>
          <div className="text-gray-300 text-sm">Subjects Mastered</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200"
        >
          <h4 className="text-white font-semibold mb-3">Study Streaks</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Current Streak</span>
              <span className="text-white font-semibold">{studyStats.currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Longest Streak</span>
              <span className="text-white font-semibold">{studyStats.longestStreak} days</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200"
        >
          <h4 className="text-white font-semibold mb-3">Weekly Goal</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Progress</span>
              <span className="text-white font-semibold">{studyStats.weeklyProgress}/{studyStats.weeklyGoal}h</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(studyStats.weeklyProgress / studyStats.weeklyGoal) * 100}%` }}
              ></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Settings</h3>
        <p className="text-gray-300">Customize your experience</p>
      </div>

      <div className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="text-white font-semibold">Notifications</h4>
                <p className="text-gray-300 text-sm">Manage your notification preferences</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-blue-500/20 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-green-400" />
              <div>
                <h4 className="text-white font-semibold">Privacy</h4>
                <p className="text-gray-300 text-sm">Control your profile visibility</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-green-500/20 rounded-lg text-green-300 hover:bg-green-500/30 transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-4 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="text-white font-semibold">Export Data</h4>
                <p className="text-gray-300 text-sm">Download your study data</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-purple-500/20 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Profile - Butterflies</title>
      </Helmet>
      
      <AnimatedBackground />
      <FloatingShapes />
      
      <div className="relative z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white text-center mb-2">Profile</h1>
            <p className="text-gray-300 text-center">Manage your account and track your progress</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2 p-1 bg-glass-100/30 backdrop-blur-md rounded-xl border border-glass-200">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'achievements', label: 'Achievements', icon: Trophy },
                { id: 'friends', label: 'Friends', icon: Users },
                { id: 'stats', label: 'Stats', icon: BarChart3 },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-glass-200/30'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden md:block">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <GlassCard className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'achievements' && <AchievementsTab />}
                {activeTab === 'friends' && <FriendsTab />}
                {activeTab === 'stats' && <StatsTab />}
                {activeTab === 'settings' && <SettingsTab />}
              </motion.div>
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};