import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  Zap, 
  Award, 
  Medal, 
  Crown, 
  Gift,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  BookOpen,
  Brain,
  Rocket,
  X,
  MessageCircle,
  Phone,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  Search,
  User,
  UserPlus,
  Flame,
  Plus,
  Play,
  Shield,
  Share,
  Eye
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSound } from '../contexts/SoundContext';
import { GlassCard } from './GlassCard';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  maxMembers: number;
  currentMembers: number;
  members: StudyBuddy[];
  isActive: boolean;
  isPrivate: boolean;
  createdAt: Date;
  lastActivity: Date;
  topics: string[];
  schedule: StudySession[];
  avatar: string;
  color: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

interface StudyBuddy {
  id: string;
  name: string;
  avatar: string;
  level: number;
  experience: number;
  subjects: string[];
  isOnline: boolean;
  lastSeen: Date;
  streak: number;
  achievements: Achievement[];
  compatibility: number;
  studyStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  availability: string[];
  timezone: string;
  bio: string;
  rating: number;
  reviews: number;
  isVerified: boolean;
  badges: string[];
  status: 'available' | 'busy' | 'studying' | 'offline';
}

interface StudySession {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  participants: StudyBuddy[];
  maxParticipants: number;
  topic: string;
  isActive: boolean;
  isRecording: boolean;
  chatMessages: ChatMessage[];
  sharedResources: SharedResource[];
}

interface ChatMessage {
  id: string;
  sender: StudyBuddy;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'link';
  isEdited: boolean;
  reactions: Reaction[];
}

interface Reaction {
  emoji: string;
  users: string[];
}

interface SharedResource {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'link' | 'note';
  url: string;
  uploadedBy: StudyBuddy;
  uploadedAt: Date;
  size: number;
  downloads: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
}

interface LeaderboardEntry {
  id: string;
  user: StudyBuddy;
  rank: number;
  score: number;
  level: number;
  experience: number;
  streak: number;
  achievements: number;
  subjects: string[];
  lastUpdated: Date;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface SocialSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialSystem: React.FC<SocialSystemProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'groups' | 'buddies' | 'leaderboard' | 'achievements' | 'streaks'>('groups');
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [selectedBuddy, setSelectedBuddy] = useState<StudyBuddy | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showFindBuddies, setShowFindBuddies] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isInSession, setIsInSession] = useState(false);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const { } = useTheme();
  const { playSfx, playNotification } = useSound();

  // Sample data
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([
    {
      id: 'group-1',
      name: 'Math Masters',
      description: 'Advanced mathematics study group focusing on calculus and linear algebra',
      subject: 'math',
      maxMembers: 10,
      currentMembers: 7,
      members: [],
      isActive: true,
      isPrivate: false,
      createdAt: new Date(),
      lastActivity: new Date(),
      topics: ['Calculus', 'Linear Algebra', 'Differential Equations'],
      schedule: [],
      avatar: '🧮',
      color: 'bg-blue-500',
      level: 'advanced',
      tags: ['calculus', 'algebra', 'advanced']
    },
    {
      id: 'group-2',
      name: 'Physics Explorers',
      description: 'Study group for physics enthusiasts covering mechanics and thermodynamics',
      subject: 'physics',
      maxMembers: 8,
      currentMembers: 5,
      members: [],
      isActive: true,
      isPrivate: false,
      createdAt: new Date(),
      lastActivity: new Date(),
      topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism'],
      schedule: [],
      avatar: '⚛️',
      color: 'bg-purple-500',
      level: 'intermediate',
      tags: ['mechanics', 'thermodynamics', 'physics']
    },
    {
      id: 'group-3',
      name: 'Literature Circle',
      description: 'Reading and discussing classic and contemporary literature',
      subject: 'english',
      maxMembers: 12,
      currentMembers: 9,
      members: [],
      isActive: true,
      isPrivate: false,
      createdAt: new Date(),
      lastActivity: new Date(),
      topics: ['Shakespeare', 'Modern Literature', 'Poetry'],
      schedule: [],
      avatar: '📚',
      color: 'bg-green-500',
      level: 'beginner',
      tags: ['literature', 'reading', 'discussion']
    }
  ]);

  const [studyBuddies, setStudyBuddies] = useState<StudyBuddy[]>([
    {
      id: 'buddy-1',
      name: 'Alex Chen',
      avatar: '👨‍🎓',
      level: 12,
      experience: 2500,
      subjects: ['math', 'physics'],
      isOnline: true,
      lastSeen: new Date(),
      streak: 15,
      achievements: [],
      compatibility: 95,
      studyStyle: 'visual',
      availability: ['monday', 'wednesday', 'friday'],
      timezone: 'EST',
      bio: 'Passionate about mathematics and physics. Love solving complex problems!',
      rating: 4.8,
      reviews: 23,
      isVerified: true,
      badges: ['Math Whiz', 'Physics Pro', 'Study Streak'],
      status: 'available'
    },
    {
      id: 'buddy-2',
      name: 'Sarah Johnson',
      avatar: '👩‍🎓',
      level: 10,
      experience: 1800,
      subjects: ['english', 'history'],
      isOnline: true,
      lastSeen: new Date(),
      streak: 8,
      achievements: [],
      compatibility: 87,
      studyStyle: 'reading',
      availability: ['tuesday', 'thursday', 'saturday'],
      timezone: 'PST',
      bio: 'Literature enthusiast and history buff. Always ready for deep discussions!',
      rating: 4.6,
      reviews: 18,
      isVerified: true,
      badges: ['Bookworm', 'Historian', 'Discussion Leader'],
      status: 'studying'
    },
    {
      id: 'buddy-3',
      name: 'Mike Rodriguez',
      avatar: '👨‍🔬',
      level: 15,
      experience: 3200,
      subjects: ['chemistry', 'biology'],
      isOnline: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      streak: 22,
      achievements: [],
      compatibility: 92,
      studyStyle: 'kinesthetic',
      availability: ['monday', 'tuesday', 'thursday'],
      timezone: 'CST',
      bio: 'Science lover and lab enthusiast. Hands-on learning is my thing!',
      rating: 4.9,
      reviews: 31,
      isVerified: true,
      badges: ['Lab Master', 'Science Explorer', 'Experiment Pro'],
      status: 'offline'
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: 'leader-1',
      user: studyBuddies[0],
      rank: 1,
      score: 2850,
      level: 12,
      experience: 2500,
      streak: 15,
      achievements: 8,
      subjects: ['math', 'physics'],
      lastUpdated: new Date(),
      change: 0,
      trend: 'stable'
    },
    {
      id: 'leader-2',
      user: studyBuddies[2],
      rank: 2,
      score: 2720,
      level: 15,
      experience: 3200,
      streak: 22,
      achievements: 12,
      subjects: ['chemistry', 'biology'],
      lastUpdated: new Date(),
      change: 1,
      trend: 'up'
    },
    {
      id: 'leader-3',
      user: studyBuddies[1],
      rank: 3,
      score: 2180,
      level: 10,
      experience: 1800,
      streak: 8,
      achievements: 6,
      subjects: ['english', 'history'],
      lastUpdated: new Date(),
      change: -1,
      trend: 'down'
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'ach-1',
      title: 'Study Streak Master',
      description: 'Maintained a 30-day study streak',
      icon: '🔥',
      points: 500,
      earnedAt: new Date(),
      rarity: 'epic',
      category: 'consistency'
    },
    {
      id: 'ach-2',
      title: 'Math Whiz',
      description: 'Completed 100 math problems with 90%+ accuracy',
      icon: '🧮',
      points: 300,
      earnedAt: new Date(),
      rarity: 'rare',
      category: 'academic'
    },
    {
      id: 'ach-3',
      title: 'Social Butterfly',
      description: 'Joined 5 study groups and participated in 10 sessions',
      icon: '🦋',
      points: 400,
      earnedAt: new Date(),
      rarity: 'rare',
      category: 'social'
    }
  ]);

  const [streaks, setStreaks] = useState({
    current: 12,
    longest: 25,
    friends: [
      { name: 'Alex Chen', streak: 15, avatar: '👨‍🎓' },
      { name: 'Sarah Johnson', streak: 8, avatar: '👩‍🎓' },
      { name: 'Mike Rodriguez', streak: 22, avatar: '👨‍🔬' },
      { name: 'Emma Wilson', streak: 5, avatar: '👩‍💻' },
      { name: 'David Kim', streak: 18, avatar: '👨‍🎨' }
    ]
  });

  const getSubjectColor = (subject: string) => {
    const colors = {
      math: 'bg-blue-500',
      physics: 'bg-purple-500',
      chemistry: 'bg-green-500',
      biology: 'bg-emerald-500',
      english: 'bg-red-500',
      history: 'bg-orange-500',
      geography: 'bg-teal-500',
      computer: 'bg-indigo-500'
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-500';
  };

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-green-500',
      intermediate: 'bg-yellow-500',
      advanced: 'bg-red-500'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-500';
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500'
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-500';
  };

  const joinStudyGroup = (group: StudyGroup) => {
    if (group.currentMembers < group.maxMembers) {
      setStudyGroups(prev => prev.map(g => 
        g.id === group.id 
          ? { ...g, currentMembers: g.currentMembers + 1 }
          : g
      ));
      playSfx('success');
      playNotification('success');
    }
  };

  const startStudySession = (group: StudyGroup) => {
    const session: StudySession = {
      id: `session-${Date.now()}`,
      title: `${group.name} Study Session`,
      description: 'Join us for an interactive study session!',
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      participants: [],
      maxParticipants: group.maxMembers,
      topic: group.topics[0] || 'General Study',
      isActive: true,
      isRecording: false,
      chatMessages: [],
      sharedResources: []
    };
    setCurrentSession(session);
    setIsInSession(true);
    playSfx('notification');
  };

  const sendChatMessage = () => {
    if (chatMessage.trim() && currentSession) {
      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: studyBuddies[0], // Current user
        content: chatMessage,
        timestamp: new Date(),
        type: 'text',
        isEdited: false,
        reactions: []
      };
      setCurrentSession(prev => prev ? {
        ...prev,
        chatMessages: [...prev.chatMessages, message]
      } : null);
      setChatMessage('');
      playSfx('notification');
    }
  };

  const shareAchievement = (achievement: Achievement) => {
    const shareText = `🎉 I just earned the "${achievement.title}" achievement in my study app! ${achievement.icon} #StudyGoals #Achievement`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Study Achievement',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      playNotification('success');
    }
    playSfx('success');
  };

  const StudyGroupsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Study Groups</h3>
        <button
          onClick={() => setShowCreateGroup(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Plus size={16} />
          Create Group
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search study groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Subjects</option>
          <option value="math">Math</option>
          <option value="physics">Physics</option>
          <option value="chemistry">Chemistry</option>
          <option value="biology">Biology</option>
          <option value="english">English</option>
          <option value="history">History</option>
        </select>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyGroups.map((group) => (
          <GlassCard key={group.id} className="p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${group.color}`}>
                  {group.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{group.name}</h4>
                  <p className="text-sm text-gray-300">{group.subject}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(group.level)}`}>
                {group.level}
              </span>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">{group.description}</p>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Users size={16} className="text-gray-400" />
                <span className="text-sm text-gray-300">{group.currentMembers}/{group.maxMembers}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-300">Active</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {group.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => joinStudyGroup(group)}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Join Group
              </button>
              <button
                onClick={() => startStudySession(group)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Play size={16} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const StudyBuddiesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Study Buddies</h3>
        <button
          onClick={() => setShowFindBuddies(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <UserPlus size={16} />
          Find Buddies
        </button>
      </div>

      {/* Buddies List */}
      <div className="space-y-4">
        {studyBuddies.map((buddy) => (
          <GlassCard key={buddy.id} className="p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                    {buddy.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                    buddy.isOnline ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{buddy.name}</h4>
                    {buddy.isVerified && <Shield size={16} className="text-blue-400" />}
                  </div>
                  <p className="text-sm text-gray-300">Level {buddy.level} • {buddy.experience} XP</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-400">Compatibility: {buddy.compatibility}%</span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-300">{buddy.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Flame size={16} className="text-orange-400" />
                    <span className="text-sm text-gray-300">{buddy.streak} days</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    buddy.status === 'available' ? 'bg-green-500/20 text-green-400' :
                    buddy.status === 'studying' ? 'bg-yellow-500/20 text-yellow-400' :
                    buddy.status === 'busy' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {buddy.status}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <MessageCircle size={16} />
                  </button>
                  <button className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <Video size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-300 mb-3">{buddy.bio}</p>
              <div className="flex flex-wrap gap-2">
                {buddy.subjects.map((subject, index) => (
                  <span key={index} className={`px-2 py-1 rounded-full text-xs ${getSubjectColor(subject)}`}>
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const LeaderboardTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Leaderboard</h3>
      
      <div className="space-y-4">
        {leaderboard.map((entry, index) => (
          <GlassCard key={entry.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                    {entry.rank}
                  </div>
                  {index === 0 && <Crown className="absolute -top-2 -right-2 text-yellow-400" size={20} />}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                    {entry.user.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{entry.user.name}</h4>
                    <p className="text-sm text-gray-300">Level {entry.level} • {entry.experience} XP</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{entry.score}</span>
                  {entry.trend === 'up' && <TrendingUp className="text-green-400" size={20} />}
                  {entry.trend === 'down' && <TrendingUp className="text-red-400 rotate-180" size={20} />}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span>🔥 {entry.streak} days</span>
                  <span>🏆 {entry.achievements} achievements</span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const AchievementsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Achievements</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <GlassCard key={achievement.id} className="p-6 hover:scale-105 transition-transform">
            <div className="text-center">
              <div className="text-4xl mb-4">{achievement.icon}</div>
              <h4 className="font-semibold text-white mb-2">{achievement.title}</h4>
              <p className="text-sm text-gray-300 mb-4">{achievement.description}</p>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </span>
                <span className="text-sm text-gray-300">{achievement.points} points</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => shareAchievement(achievement)}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Share size={16} />
                  Share
                </button>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const StudyStreaksTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Study Streaks</h3>
      
      {/* Current Streak */}
      <GlassCard className="p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🔥</div>
          <h3 className="text-2xl font-bold text-white mb-2">{streaks.current} Days</h3>
          <p className="text-gray-300 mb-4">Current Study Streak</p>
          <div className="flex justify-center gap-4 text-sm text-gray-300">
            <span>Longest: {streaks.longest} days</span>
            <span>Rank: #{Math.floor(Math.random() * 10) + 1}</span>
          </div>
        </div>
      </GlassCard>

      {/* Friends Streaks */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Friends' Streaks</h4>
        <div className="space-y-3">
          {streaks.friends.map((friend, index) => (
            <GlassCard key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
                    {friend.avatar}
                  </div>
                  <div>
                    <h5 className="font-medium text-white">{friend.name}</h5>
                    <p className="text-sm text-gray-300">{friend.streak} days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-orange-400" />
                  <span className="text-sm text-gray-300">{friend.streak}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );

  const StudySessionModal = () => (
    <AnimatePresence>
      {isInSession && currentSession && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl w-full max-w-6xl h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white">{currentSession.title}</h3>
                <p className="text-gray-300">{currentSession.topic}</p>
              </div>
              <button
                onClick={() => setIsInSession(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
              {/* Video Area */}
              <div className="flex-1 p-6">
                <div className="bg-black rounded-lg h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📹</div>
                    <p className="text-gray-300">Video call area</p>
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="w-80 border-l border-white/10 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {currentSession.chatMessages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                          {message.sender.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">{message.sender.name}</span>
                            <span className="text-xs text-gray-400">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={sendChatMessage}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition-colors ${
                    isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {isMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
                </button>
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {isVideoOn ? <Camera size={20} className="text-white" /> : <CameraOff size={20} className="text-white" />}
                </button>
                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-full transition-colors ${
                    isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Monitor size={20} className="text-white" />
                </button>
                <button className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors">
                  <Phone size={20} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Social Features</h2>
                  <p className="text-gray-300">Connect, compete, and collaborate with fellow students</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {[
                { id: 'groups', label: 'Study Groups', icon: Users },
                { id: 'buddies', label: 'Study Buddies', icon: User },
                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                { id: 'achievements', label: 'Achievements', icon: Award },
                { id: 'streaks', label: 'Study Streaks', icon: Flame }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-purple-500 text-purple-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'groups' && <StudyGroupsTab />}
              {activeTab === 'buddies' && <StudyBuddiesTab />}
              {activeTab === 'leaderboard' && <LeaderboardTab />}
              {activeTab === 'achievements' && <AchievementsTab />}
              {activeTab === 'streaks' && <StudyStreaksTab />}
            </div>

            {/* Study Session Modal */}
            <StudySessionModal />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 