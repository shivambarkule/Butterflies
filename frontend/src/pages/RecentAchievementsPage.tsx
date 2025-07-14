import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';

const mockAchievements = [
  { id: 1, title: 'Quiz Master', desc: 'Scored 100% in Physics Quiz', date: '2024-07-15', icon: '🏆' },
  { id: 2, title: 'Streak Star', desc: 'Completed 5 exams in a row', date: '2024-07-10', icon: '🌟' },
  { id: 3, title: 'Speedster', desc: 'Finished Math Final in record time', date: '2024-07-01', icon: '⚡' },
];

const RecentAchievementsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="min-h-screen p-6 bg-gradient-to-br from-yellow-100/60 to-pink-100/60 flex flex-col items-center"
    >
      <h1 className="text-3xl font-bold mb-6 text-pink-700 drop-shadow-lg">Recent Achievements</h1>
      <div className="w-full max-w-2xl grid gap-6">
        {mockAchievements.map((ach) => (
          <motion.div
            key={ach.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <GlassCard className="flex items-center gap-4 p-6 cursor-pointer hover:bg-pink-100/40 transition">
              <span className="text-3xl animate-bounce">{ach.icon}</span>
              <div>
                <div className="text-lg font-semibold text-pink-800">{ach.title}</div>
                <div className="text-sm text-gray-500">{ach.desc}</div>
                <div className="text-xs text-gray-400 mt-1">{ach.date}</div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentAchievementsPage; 