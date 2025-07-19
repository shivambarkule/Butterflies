import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Trophy, Plus } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { FloatingShapes } from '../components/FloatingShapes';
import { Helmet } from 'react-helmet-async';

export const RecentAchievementsPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Recent Achievements - Butterflies</title>
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
          <h1 className="text-3xl font-bold text-white mb-2">Recent Achievements</h1>
          <p className="text-gray-300">Track your accomplishments and milestones</p>
        </motion.div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center py-16"
        >
          <GlassCard className="p-12 max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">No Achievements Yet</h3>
            <p className="text-gray-300 mb-8">
              Start taking exams and completing tasks to earn achievements and badges. Your accomplishments will appear here!
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-400">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Take exams to earn achievements</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}; 