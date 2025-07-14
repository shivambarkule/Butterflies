import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
// TODO: Import ExamList or similar component if available

const mockExams = [
  { id: 1, name: 'Mathematics Final', date: '2024-07-10', status: 'Completed' },
  { id: 2, name: 'Physics Quiz', date: '2024-07-15', status: 'Upcoming' },
  { id: 3, name: 'Chemistry Midterm', date: '2024-07-20', status: 'Upcoming' },
  { id: 4, name: 'English Literature', date: '2024-06-30', status: 'Completed' },
];

const TotalExamsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="min-h-screen p-6 bg-gradient-to-br from-blue-100/60 to-purple-100/60 flex flex-col items-center"
    >
      <h1 className="text-3xl font-bold mb-6 text-purple-700 drop-shadow-lg">All Exams</h1>
      <div className="w-full max-w-3xl grid gap-6">
        {mockExams.map((exam) => (
          <motion.div
            key={exam.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <GlassCard className="flex justify-between items-center p-6 cursor-pointer hover:bg-purple-100/40 transition">
              <div>
                <div className="text-xl font-semibold text-blue-800">{exam.name}</div>
                <div className="text-sm text-gray-500">Date: {exam.date}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${exam.status === 'Upcoming' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{exam.status}</span>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TotalExamsPage; 