import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Plus } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { FloatingShapes } from '../components/FloatingShapes';
import { Helmet } from 'react-helmet-async';
import { MagneticElement } from '../components/MagneticElement';

export const ExamListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Exams - Butterflies</title>
      </Helmet>
      
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
        <MagneticElement strength={0.1}>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-glass-100/50 backdrop-blur-md rounded-xl border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
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
          </GlassCard>
        </motion.div>
        </MagneticElement>

        {/* Empty State */}
        <MagneticElement strength={0.15}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-16"
          >
            <GlassCard className="p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">No Exams Available</h3>
              <p className="text-gray-300 mb-8">
                You don't have any exams scheduled yet. Exams will appear here once you join classes and teachers assign them.
              </p>
              <div className="flex items-center justify-center space-x-2 text-blue-400">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Join classes to see available exams</span>
              </div>
            </GlassCard>
          </motion.div>
        </MagneticElement>
      </div>
    </div>
  );
}; 