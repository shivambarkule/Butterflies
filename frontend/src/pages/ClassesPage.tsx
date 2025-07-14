import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Filter, 
  GraduationCap, 
  Calendar, 
  Users, 
  Clock, 
  Target, 
  Bell, 
  Eye, 
  Settings, 
  FileText, 
  Video, 
  Download, 
  BookMarked, 
  MessageSquare, 
  BarChart3 
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { FloatingShapes } from '@/components/FloatingShapes';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Mock data - replace with API calls
const mockClasses = [
  {
    id: '1',
    name: 'Advanced Mathematics',
    code: 'MATH301',
    teacher: 'Dr. Sarah Johnson',
    teacherEmail: 'sarah.johnson@university.edu',
    progress: 75,
    totalLessons: 24,
    completedLessons: 18,
    nextClass: '2024-01-15T10:00:00',
    totalStudents: 28,
    description: 'Advanced calculus and mathematical analysis covering integration techniques, series, and multivariable calculus.',
    schedule: 'Mon, Wed, Fri 10:00 AM - 11:30 AM',
    room: 'Science Building 201',
    credits: 4,
    grade: 'A-',
    recentActivity: 'New assignment posted: Integration Techniques',
    materials: [
      { id: '1', name: 'Calculus Textbook', type: 'pdf', size: '2.4 MB', uploaded: '2024-01-10' },
      { id: '2', name: 'Integration Practice Problems', type: 'pdf', size: '1.2 MB', uploaded: '2024-01-12' },
      { id: '3', name: 'Video Lecture: Partial Fractions', type: 'video', size: '45 MB', uploaded: '2024-01-11' }
    ],
    announcements: [
      { id: '1', title: 'Midterm Exam Schedule', content: 'Midterm exam will be held on January 20th', date: '2024-01-13' },
      { id: '2', title: 'Office Hours Update', content: 'Office hours changed to Tuesday 2-4 PM', date: '2024-01-12' }
    ],
    assignments: [
      { id: '1', title: 'Integration Techniques', dueDate: '2024-01-18', status: 'pending', points: 25 },
      { id: '2', title: 'Series Convergence', dueDate: '2024-01-25', status: 'pending', points: 30 },
      { id: '3', title: 'Partial Fractions', dueDate: '2024-01-10', status: 'completed', points: 20, score: 18 }
    ]
  },
  {
    id: '2',
    name: 'Physics Fundamentals',
    code: 'PHYS201',
    teacher: 'Prof. Michael Chen',
    teacherEmail: 'michael.chen@university.edu',
    progress: 60,
    totalLessons: 30,
    completedLessons: 18,
    nextClass: '2024-01-16T14:00:00',
    totalStudents: 32,
    description: 'Comprehensive introduction to classical mechanics, thermodynamics, and wave phenomena.',
    schedule: 'Tue, Thu 2:00 PM - 3:30 PM',
    room: 'Physics Lab 105',
    credits: 4,
    grade: 'B+',
    recentActivity: 'Lab report due tomorrow',
    materials: [
      { id: '1', name: 'Physics Lab Manual', type: 'pdf', size: '3.1 MB', uploaded: '2024-01-09' },
      { id: '2', name: 'Mechanics Problems Set', type: 'pdf', size: '1.8 MB', uploaded: '2024-01-14' }
    ],
    announcements: [
      { id: '1', title: 'Lab Safety Reminder', content: 'Please review lab safety protocols before next session', date: '2024-01-14' }
    ],
    assignments: [
      { id: '1', title: 'Lab Report: Pendulum Motion', dueDate: '2024-01-17', status: 'pending', points: 25 },
      { id: '2', title: 'Mechanics Problem Set', dueDate: '2024-01-24', status: 'pending', points: 35 }
    ]
  },
  {
    id: '3',
    name: 'English Literature',
    code: 'ENG202',
    teacher: 'Ms. Emily Davis',
    teacherEmail: 'emily.davis@university.edu',
    progress: 85,
    totalLessons: 20,
    completedLessons: 17,
    nextClass: '2024-01-17T11:00:00',
    totalStudents: 25,
    description: 'Study of classic and contemporary literature with focus on critical analysis and interpretation.',
    schedule: 'Mon, Wed 11:00 AM - 12:30 PM',
    room: 'Humanities Building 301',
    credits: 3,
    grade: 'A',
    recentActivity: 'Discussion forum updated',
    materials: [
      { id: '1', name: 'Shakespeare Complete Works', type: 'pdf', size: '5.2 MB', uploaded: '2024-01-08' },
      { id: '2', name: 'Literary Analysis Guide', type: 'pdf', size: '1.5 MB', uploaded: '2024-01-13' }
    ],
    announcements: [
      { id: '1', title: 'Essay Contest', content: 'Submit your Hamlet analysis for the annual essay contest', date: '2024-01-15' }
    ],
    assignments: [
      { id: '1', title: 'Hamlet Analysis Essay', dueDate: '2024-01-22', status: 'pending', points: 40 },
      { id: '2', title: 'Class Participation', dueDate: 'Ongoing', status: 'completed', points: 15, score: 15 }
    ]
  },
  {
    id: '4',
    name: 'Computer Science Fundamentals',
    code: 'CS101',
    teacher: 'Dr. Alex Rodriguez',
    teacherEmail: 'alex.rodriguez@university.edu',
    progress: 45,
    totalLessons: 28,
    completedLessons: 12,
    nextClass: '2024-01-18T09:00:00',
    totalStudents: 35,
    description: 'Introduction to programming concepts, algorithms, and data structures using Python.',
    schedule: 'Tue, Thu 9:00 AM - 10:30 AM',
    room: 'Computer Lab 101',
    credits: 4,
    grade: 'B',
    recentActivity: 'New coding assignment posted',
    materials: [
      { id: '1', name: 'Python Programming Guide', type: 'pdf', size: '4.1 MB', uploaded: '2024-01-07' },
      { id: '2', name: 'Algorithm Examples', type: 'pdf', size: '2.3 MB', uploaded: '2024-01-12' }
    ],
    announcements: [
      { id: '1', title: 'Programming Contest', content: 'Weekly coding challenges now available', date: '2024-01-16' }
    ],
    assignments: [
      { id: '1', title: 'Python Functions Assignment', dueDate: '2024-01-19', status: 'pending', points: 30 },
      { id: '2', title: 'Data Structures Project', dueDate: '2024-01-26', status: 'pending', points: 50 }
    ]
  }
];

const subjects = ['All', 'Mathematics', 'Physics', 'English', 'Computer Science'];
const progressLevels = ['All', '0-25%', '26-50%', '51-75%', '76-100%'];

export const ClassesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedProgress, setSelectedProgress] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const filteredClasses = mockClasses.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || classItem.name.includes(selectedSubject);
    const matchesProgress = selectedProgress === 'All' || 
      (selectedProgress === '0-25%' && classItem.progress <= 25) ||
      (selectedProgress === '26-50%' && classItem.progress > 25 && classItem.progress <= 50) ||
      (selectedProgress === '51-75%' && classItem.progress > 50 && classItem.progress <= 75) ||
      (selectedProgress === '76-100%' && classItem.progress > 75);
    
    return matchesSearch && matchesSubject && matchesProgress;
  });

  const handleViewClass = (classId: string) => {
    setSelectedClass(selectedClass === classId ? null : classId);
  };

  const handleDownloadMaterial = (_: string, materialName: string) => {
    toast.success(`Downloading ${materialName}...`);
    // Implement actual download logic
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-400';
    if (grade.startsWith('B')) return 'text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-400 to-emerald-400';
    if (progress >= 60) return 'from-blue-400 to-cyan-400';
    if (progress >= 40) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-pink-400';
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
          <h1 className="text-3xl font-bold text-white mb-2">My Classes</h1>
          <p className="text-gray-300">Manage your enrolled courses and track progress</p>
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
                  placeholder="Search classes, teachers, or course codes..."
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    {/* Progress Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Progress</label>
                      <select
                        value={selectedProgress}
                        onChange={(e) => setSelectedProgress(e.target.value)}
                        className="w-full px-4 py-2 bg-glass-100/50 backdrop-blur-md rounded-lg border border-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-300"
                      >
                        {progressLevels.map(level => (
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

        {/* Classes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClasses.map((classItem, index) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <GlassCard className="p-6">
                {/* Class Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{classItem.name}</h3>
                      <span className="px-2 py-1 bg-brand-400/20 text-brand-400 text-xs font-medium rounded-full">
                        {classItem.code}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{classItem.teacher}</p>
                    <p className="text-gray-400 text-sm">{classItem.description}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-brand-400 to-purple-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-300">Progress</span>
                    <span className="text-white font-medium">{classItem.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <div
                      className={`bg-gradient-to-r ${getProgressColor(classItem.progress)} h-3 rounded-full transition-all duration-300`}
                      style={{ width: `${classItem.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{classItem.completedLessons} of {classItem.totalLessons} lessons completed</span>
                    <span className={`font-medium ${getGradeColor(classItem.grade)}`}>
                      Grade: {classItem.grade}
                    </span>
                  </div>
                </div>

                {/* Class Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{classItem.totalStudents} students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">
                      Next: {new Date(classItem.nextClass).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{classItem.credits} credits</span>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mb-4 p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <p className="text-blue-400 text-sm">{classItem.recentActivity}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewClass(classItem.id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-brand-400 to-purple-400 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-brand-400/25 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{selectedClass === classItem.id ? 'Hide Details' : 'View Details'}</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-glass-100/30 rounded-lg text-gray-400 hover:text-white hover:bg-glass-200/30 transition-all duration-300"
                  >
                    <Settings className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedClass === classItem.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-glass-200"
                    >
                      {/* Materials Section */}
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>Course Materials</span>
                        </h4>
                        <div className="space-y-2">
                          {classItem.materials.map((material) => (
                            <div key={material.id} className="flex items-center justify-between p-2 bg-glass-100/30 rounded-lg">
                              <div className="flex items-center space-x-2">
                                {material.type === 'video' ? (
                                  <Video className="w-4 h-4 text-red-400" />
                                ) : (
                                  <FileText className="w-4 h-4 text-blue-400" />
                                )}
                                <span className="text-white text-sm">{material.name}</span>
                                <span className="text-gray-400 text-xs">{material.size}</span>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDownloadMaterial(material.id, material.name)}
                                className="p-1 text-gray-400 hover:text-white transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Assignments Section */}
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                          <BookMarked className="w-4 h-4" />
                          <span>Assignments</span>
                        </h4>
                        <div className="space-y-2">
                          {classItem.assignments.map((assignment) => (
                            <div key={assignment.id} className="flex items-center justify-between p-2 bg-glass-100/30 rounded-lg">
                              <div>
                                <p className="text-white text-sm font-medium">{assignment.title}</p>
                                <p className="text-gray-400 text-xs">Due: {assignment.dueDate}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-300 text-sm">{assignment.points} pts</span>
                                {assignment.status === 'completed' && assignment.score && (
                                  <span className="text-green-400 text-sm">{assignment.score}/{assignment.points}</span>
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  assignment.status === 'completed' 
                                    ? 'bg-green-400/20 text-green-400' 
                                    : 'bg-yellow-400/20 text-yellow-400'
                                }`}>
                                  {assignment.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 p-2 bg-glass-100/30 rounded-lg text-white text-sm hover:bg-glass-200/30 transition-all duration-300"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Contact Teacher</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 p-2 bg-glass-100/30 rounded-lg text-white text-sm hover:bg-glass-200/30 transition-all duration-300"
                        >
                          <BarChart3 className="w-4 h-4" />
                          <span>View Grades</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-glass-100/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No classes found</h3>
            <p className="text-gray-300">Try adjusting your search or filters</p>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <GlassCard className="p-6">
            <h3 className="text-white font-semibold mb-4">Class Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{mockClasses.length}</p>
                <p className="text-gray-300 text-sm">Total Classes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {Math.round(mockClasses.reduce((acc, c) => acc + c.progress, 0) / mockClasses.length)}%
                </p>
                <p className="text-gray-300 text-sm">Average Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {mockClasses.filter(c => c.progress >= 80).length}
                </p>
                <p className="text-gray-300 text-sm">High Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {mockClasses.reduce((acc, c) => acc + c.assignments.filter(a => a.status === 'pending').length, 0)}
                </p>
                <p className="text-gray-300 text-sm">Pending Assignments</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}; 