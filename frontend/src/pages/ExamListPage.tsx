import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { FloatingShapes } from '@/components/FloatingShapes';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Mock data - replace with API calls
const mockExams = [
  {
    id: '1',
    title: 'Advanced Calculus - Integration Techniques',
    subject: 'Mathematics',
    date: '2024-01-15T10:00:00',
    duration: 90,
    status: 'upcoming',
    totalQuestions: 50,
    difficulty: 'Hard',
    description: 'Comprehensive test covering integration techniques, partial fractions, and trigonometric substitutions.',
    topics: ['Integration by Parts', 'Partial Fractions', 'Trigonometric Substitution'],
    maxScore: 100
  },
  {
    id: '2',
    title: 'Physics - Classical Mechanics',
    subject: 'Physics',
    date: '2024-01-12T14:00:00',
    duration: 120,
    status: 'active',
    totalQuestions: 60,
    difficulty: 'Medium',
    description: 'Test your understanding of Newton\'s laws, momentum, and energy conservation.',
    topics: ['Newton\'s Laws', 'Momentum', 'Energy Conservation'],
    maxScore: 100
  },
  {
    id: '3',
    title: 'English Literature - Shakespeare',
    subject: 'English',
    date: '2024-01-10T09:00:00',
    duration: 75,
    status: 'completed',
    totalQuestions: 40,
    difficulty: 'Easy',
    description: 'Analysis of Shakespeare\'s major works and literary devices.',
    topics: ['Hamlet', 'Macbeth', 'Literary Devices'],
    maxScore: 100,
    score: 92,
    rank: 3,
    timeTaken: 65
  },
  {
    id: '4',
    title: 'Chemistry - Organic Chemistry',
    subject: 'Chemistry',
    date: '2024-01-18T11:00:00',
    duration: 90,
    status: 'upcoming',
    totalQuestions: 45,
    difficulty: 'Hard',
    description: 'Comprehensive test on organic chemistry including reactions and mechanisms.',
    topics: ['Alkanes', 'Alkenes', 'Reaction Mechanisms'],
    maxScore: 100
  },
  {
    id: '5',
    title: 'Computer Science - Data Structures',
    subject: 'Computer Science',
    date: '2024-01-08T13:00:00',
    duration: 100,
    status: 'completed',
    totalQuestions: 55,
    difficulty: 'Medium',
    description: 'Test on fundamental data structures and algorithms.',
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Sorting'],
    maxScore: 100,
    score: 88,
    rank: 7,
    timeTaken: 85
  }
];

const subjects = ['All', 'Mathematics', 'Physics', 'English', 'Chemistry', 'Computer Science'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const statuses = ['All', 'upcoming', 'active', 'completed'];

export const ExamListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredExams = mockExams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || exam.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'All' || exam.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'All' || exam.status === selectedStatus;
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesStatus;
  });

  const handleStartExam = () => {
    toast.success('Starting exam... Good luck! 🍀');
    // Navigate to exam page
  };

  const handleViewResults = () => {
    // Navigate to results page
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400 bg-blue-400/20';
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'completed': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <FloatingShapes />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Exams</h1>
          <p className="text-gray-300">Manage and take your exams</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <GlassCard className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-glass-100/50 backdrop-blur-md rounded-xl border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-glass-100/50 backdrop-blur-md rounded-xl border border-glass-200 text-white hover:bg-glass-200/50 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Filters</span>
              </motion.button>
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-glass-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Subject Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-4 py-2 bg-glass-100/50 backdrop-blur-md rounded-lg border border-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-300"
                      >
                        {subjects.map(subject => (
                          <option key={subject} value={subject} className="bg-slate-800">
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Difficulty Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full px-4 py-2 bg-glass-100/50 backdrop-blur-md rounded-lg border border-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-300"
                      >
                        {difficulties.map(difficulty => (
                          <option key={difficulty} value={difficulty} className="bg-slate-800">
                            {difficulty}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-4 py-2 bg-glass-100/50 backdrop-blur-md rounded-lg border border-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-300"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status} className="bg-slate-800">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>

        {/* Exam Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExams.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <GlassCard className="p-6 h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{exam.title}</h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-300">{exam.subject}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                        {exam.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                        {exam.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {exam.description}
                </p>

                {/* Topics */}
                <div className="mb-4">
                  <h4 className="text-white font-medium text-sm mb-2">Topics Covered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {exam.topics.map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        className="px-2 py-1 bg-glass-100/30 rounded-lg text-xs text-gray-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Exam Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">{exam.duration} minutes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">{exam.totalQuestions} questions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">
                      {new Date(exam.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Max: {exam.maxScore} points</span>
                  </div>
                </div>

                {/* Results for completed exams */}
                {exam.status === 'completed' && exam.score && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-lg border border-purple-400/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Your Score</p>
                        <p className="text-2xl font-bold text-purple-400">{exam.score}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300 text-sm">Rank</p>
                        <p className="text-lg font-bold text-yellow-400">#{exam.rank}</p>
                      </div>
                    </div>
                    {exam.timeTaken && (
                      <p className="text-gray-300 text-sm mt-1">
                        Completed in {exam.timeTaken} minutes
                      </p>
                    )}
                  </div>
                )}

                {/* Countdown for upcoming exams */}
                {exam.status === 'upcoming' && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-lg border border-blue-400/20">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 font-medium">
                        Starts in {getTimeUntilExam(exam.date)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {exam.status === 'active' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStartExam()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Start Exam</span>
                    </motion.button>
                  )}
                  
                  {exam.status === 'completed' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleViewResults()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-400/25 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>View Results</span>
                    </motion.button>
                  )}
                  
                  {exam.status === 'upcoming' && (
                    <div className="flex-1 px-4 py-3 bg-glass-100/30 rounded-lg text-gray-300 text-center">
                      Not available yet
                    </div>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-glass-100/30 rounded-lg text-gray-400 hover:text-white hover:bg-glass-200/30 transition-all duration-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-glass-100/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No exams found</h3>
            <p className="text-gray-300">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExamListPage; 