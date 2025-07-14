import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Award, 
  BarChart3, 
  Download, 
  Eye, 
  Trophy, 
  AlertCircle,
  Clock,
  Lightbulb,
  Target
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { FloatingShapes } from '@/components/FloatingShapes';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Mock data - replace with API calls
const mockResults = [
  {
    id: '1',
    examTitle: 'Advanced Calculus - Integration Techniques',
    subject: 'Mathematics',
    date: '2024-01-10T09:00:00',
    duration: 90,
    totalQuestions: 50,
    correctAnswers: 46,
    score: 92,
    percentage: 92,
    rank: 3,
    totalStudents: 45,
    timeTaken: 75,
    difficulty: 'Hard',
    topics: ['Integration by Parts', 'Partial Fractions', 'Trigonometric Substitution'],
    feedback: 'Excellent work on integration techniques. Strong understanding of partial fractions.',
    improvements: ['Practice more complex trigonometric substitutions', 'Review series convergence'],
    grade: 'A',
    status: 'completed'
  },
  {
    id: '2',
    examTitle: 'Physics - Classical Mechanics',
    subject: 'Physics',
    date: '2024-01-08T14:00:00',
    duration: 120,
    totalQuestions: 60,
    correctAnswers: 48,
    score: 80,
    percentage: 80,
    rank: 8,
    totalStudents: 52,
    timeTaken: 110,
    difficulty: 'Medium',
    topics: ['Newton\'s Laws', 'Momentum', 'Energy Conservation'],
    feedback: 'Good understanding of basic concepts. Need more practice with energy conservation.',
    improvements: ['Focus on energy conservation problems', 'Practice momentum calculations'],
    grade: 'B+',
    status: 'completed'
  },
  {
    id: '3',
    examTitle: 'English Literature - Shakespeare',
    subject: 'English',
    date: '2024-01-05T11:00:00',
    duration: 75,
    totalQuestions: 40,
    correctAnswers: 38,
    score: 95,
    percentage: 95,
    rank: 1,
    totalStudents: 38,
    timeTaken: 65,
    difficulty: 'Easy',
    topics: ['Hamlet', 'Macbeth', 'Literary Devices'],
    feedback: 'Outstanding analysis and interpretation. Excellent understanding of Shakespeare\'s themes.',
    improvements: ['Continue exploring deeper themes', 'Consider historical context more'],
    grade: 'A+',
    status: 'completed'
  },
  {
    id: '4',
    examTitle: 'Computer Science - Data Structures',
    subject: 'Computer Science',
    date: '2024-01-03T13:00:00',
    duration: 100,
    totalQuestions: 55,
    correctAnswers: 44,
    score: 80,
    percentage: 80,
    rank: 12,
    totalStudents: 48,
    timeTaken: 85,
    difficulty: 'Medium',
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Sorting'],
    feedback: 'Good grasp of basic data structures. Need more practice with tree algorithms.',
    improvements: ['Practice tree traversal algorithms', 'Review sorting complexity'],
    grade: 'B',
    status: 'completed'
  }
];

const subjects = ['All', 'Mathematics', 'Physics', 'English', 'Computer Science'];
const timeRanges = ['All Time', 'This Month', 'Last Month', 'This Semester'];
const performanceLevels = ['All', '90%+', '80-89%', '70-79%', 'Below 70%'];

export const ResultsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState('All Time');
  const [selectedPerformance, setSelectedPerformance] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  const filteredResults = mockResults.filter(result => {
    const matchesSearch = result.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || result.subject === selectedSubject;
    const matchesPerformance = selectedPerformance === 'All' || 
      (selectedPerformance === '90%+' && result.percentage >= 90) ||
      (selectedPerformance === '80-89%' && result.percentage >= 80 && result.percentage < 90) ||
      (selectedPerformance === '70-79%' && result.percentage >= 70 && result.percentage < 80) ||
      (selectedPerformance === 'Below 70%' && result.percentage < 70);
    
    return matchesSearch && matchesSubject && matchesPerformance;
  });

  const handleViewDetails = (resultId: string) => {
    setSelectedResult(selectedResult === resultId ? null : resultId);
  };

  const handleDownloadCertificate = (_: string, examTitle: string) => {
    toast.success(`Downloading certificate for ${examTitle}...`);
    // Implement actual download logic
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A+') return 'text-yellow-400';
    if (grade.startsWith('A')) return 'text-green-400';
    if (grade.startsWith('B')) return 'text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'from-green-400 to-emerald-400';
    if (percentage >= 80) return 'from-blue-400 to-cyan-400';
    if (percentage >= 70) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-pink-400';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank <= 3) return 'text-purple-400';
    if (rank <= 10) return 'text-blue-400';
    return 'text-gray-400';
  };

  const averageScore = Math.round(mockResults.reduce((acc, r) => acc + r.percentage, 0) / mockResults.length);
  const totalExams = mockResults.length;
  const highScores = mockResults.filter(r => r.percentage >= 90).length;
  const averageRank = Math.round(mockResults.reduce((acc, r) => acc + r.rank, 0) / mockResults.length);

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
          <h1 className="text-3xl font-bold text-white mb-2">Exam Results</h1>
          <p className="text-gray-300">Track your performance and view detailed analytics</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Average Score</p>
                <p className="text-3xl font-bold text-white">{averageScore}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Exams</p>
                <p className="text-3xl font-bold text-white">{totalExams}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">High Scores (90%+)</p>
                <p className="text-3xl font-bold text-white">{highScores}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Avg. Rank</p>
                <p className="text-3xl font-bold text-white">#{averageRank}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <GlassCard className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exam results..."
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
                <Filter className="w-5 h-5" />
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

                    {/* Time Range Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
                      <select
                        value={selectedTimeRange}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                        className="w-full px-4 py-2 bg-glass-100/50 backdrop-blur-md rounded-lg border border-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-300"
                      >
                        {timeRanges.map(range => (
                          <option key={range} value={range} className="bg-slate-800">
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Performance Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Performance</label>
                      <select
                        value={selectedPerformance}
                        onChange={(e) => setSelectedPerformance(e.target.value)}
                        className="w-full px-4 py-2 bg-glass-100/50 backdrop-blur-md rounded-lg border border-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-300"
                      >
                        {performanceLevels.map(level => (
                          <option key={level} value={level} className="bg-slate-800">
                            {level}
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

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <GlassCard className="p-6">
                {/* Result Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{result.examTitle}</h3>
                    <div className="flex items-center space-x-4 text-sm mb-2">
                      <span className="text-gray-300">{result.subject}</span>
                      <span className="text-gray-300">• {result.difficulty}</span>
                      <span className="text-gray-300">• {new Date(result.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-brand-400 to-purple-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Score and Rank */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-glass-100/30 rounded-lg">
                    <div className={`text-3xl font-bold ${getScoreColor(result.percentage)} bg-gradient-to-r bg-clip-text text-transparent`}>
                      {result.percentage}%
                    </div>
                    <p className="text-gray-300 text-sm">Score</p>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <span className="text-gray-400 text-xs">{result.correctAnswers}/{result.totalQuestions}</span>
                      <span className="text-gray-400 text-xs">correct</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-glass-100/30 rounded-lg">
                    <div className={`text-3xl font-bold ${getRankColor(result.rank)}`}>
                      #{result.rank}
                    </div>
                    <p className="text-gray-300 text-sm">Rank</p>
                    <p className="text-gray-400 text-xs mt-1">of {result.totalStudents} students</p>
                  </div>
                </div>

                {/* Grade and Time */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Grade:</span>
                    <span className={`font-bold ${getGradeColor(result.grade)}`}>{result.grade}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{result.timeTaken}/{result.duration} min</span>
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <p className="text-gray-300 text-sm mb-2">Topics Covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.topics.map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        className="px-2 py-1 bg-brand-400/20 text-brand-400 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewDetails(result.id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-brand-400 to-purple-400 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-brand-400/25 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{selectedResult === result.id ? 'Hide Details' : 'View Details'}</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadCertificate(result.id, result.examTitle)}
                    className="p-3 bg-glass-100/30 rounded-lg text-gray-400 hover:text-white hover:bg-glass-200/30 transition-all duration-300"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedResult === result.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-glass-200"
                    >
                      {/* Feedback Section */}
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                          <Lightbulb className="w-4 h-4" />
                          <span>Feedback</span>
                        </h4>
                        <div className="p-3 bg-green-400/10 rounded-lg border border-green-400/20">
                          <p className="text-green-400 text-sm">{result.feedback}</p>
                        </div>
                      </div>

                      {/* Areas for Improvement */}
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>Areas for Improvement</span>
                        </h4>
                        <div className="space-y-2">
                          {result.improvements.map((improvement, impIndex) => (
                            <div key={impIndex} className="flex items-center space-x-2 p-2 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                              <AlertCircle className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400 text-sm">{improvement}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-glass-100/30 rounded-lg">
                          <p className="text-2xl font-bold text-white">{result.correctAnswers}</p>
                          <p className="text-gray-300 text-xs">Correct Answers</p>
                        </div>
                        <div className="text-center p-3 bg-glass-100/30 rounded-lg">
                          <p className="text-2xl font-bold text-white">{result.totalQuestions - result.correctAnswers}</p>
                          <p className="text-gray-300 text-xs">Incorrect Answers</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-glass-100/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-300">Try adjusting your search or filters</p>
          </motion.div>
        )}

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <GlassCard className="p-6">
            <h3 className="text-white font-semibold mb-4">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-medium mb-2">Strong Performance</h4>
                <p className="text-gray-300 text-sm">You're performing above average in most subjects</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-medium mb-2">Consistent Progress</h4>
                <p className="text-gray-300 text-sm">Your scores show steady improvement over time</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-medium mb-2">Top Rankings</h4>
                <p className="text-gray-300 text-sm">You're consistently ranking in the top 20%</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage; 