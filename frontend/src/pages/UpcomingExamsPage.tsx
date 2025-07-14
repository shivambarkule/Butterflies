import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';

const mockUpcomingExams = [
  { id: 2, name: 'Physics Quiz', date: '2024-07-15', status: 'Upcoming' },
  { id: 3, name: 'Chemistry Midterm', date: '2024-07-20', status: 'Upcoming' },
];

const getCountdown = (dateStr: string) => {
  const examDate = new Date(dateStr);
  const now = new Date();
  const diff = examDate.getTime() - now.getTime();
  if (diff <= 0) return 'Started';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days}d ${hours}h`;
};

const UpcomingExamsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="min-h-screen p-6 bg-gradient-to-br from-green-100/60 to-blue-100/60 flex flex-col items-center"
    >
      <h1 className="text-3xl font-bold mb-6 text-green-700 drop-shadow-lg">Upcoming Exams</h1>
      <div className="w-full max-w-2xl grid gap-6">
        {mockUpcomingExams.map((exam) => (
          <motion.div
            key={exam.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <GlassCard className="flex justify-between items-center p-6 cursor-pointer hover:bg-green-100/40 transition">
              <div>
                <div className="text-xl font-semibold text-blue-800">{exam.name}</div>
                <div className="text-sm text-gray-500">Date: {exam.date}</div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-200 text-yellow-800 animate-pulse">
                {getCountdown(exam.date)}
              </span>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UpcomingExamsPage; 