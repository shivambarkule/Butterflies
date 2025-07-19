import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { FileText, Trophy, CheckCircle } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { FloatingShapes } from '../components/FloatingShapes';
import { Helmet } from 'react-helmet-async';
import { InteractiveExam } from '../components/InteractiveExam';

export const ExamPage: React.FC = () => {
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResults, setExamResults] = useState<any>(null);

  const handleExamComplete = (answers: any) => {
    setExamResults(answers);
    setExamCompleted(true);
  };

  const handleRetakeExam = () => {
    setExamCompleted(false);
    setExamResults(null);
  };

  if (examCompleted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Helmet>
          <title>Exam Completed - Butterflies</title>
        </Helmet>
        
        <AnimatedBackground />
        <FloatingShapes />
        
        <div className="relative z-10 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center min-h-[calc(100vh-3rem)]"
          >
            <GlassCard className="p-12 max-w-2xl w-full text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-white mb-4"
              >
                Exam Completed!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-300 mb-8"
              >
                Congratulations! You have successfully completed the exam. Your answers have been submitted and will be reviewed.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <div className="bg-glass-100/30 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Exam Summary</h3>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>Questions Answered: {Object.keys(examResults || {}).length}</p>
                    <p>Total Questions: 5</p>
                    <p>Completion Time: ~{Math.floor(Math.random() * 20) + 30} minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetakeExam}
                    className="px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Retake Exam
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.history.back()}
                    className="px-6 py-3 bg-glass-100/50 rounded-xl text-white font-semibold hover:bg-glass-200/50 transition-all duration-300"
                  >
                    Back to Exams
                  </motion.button>
                </div>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Interactive Exam - Butterflies</title>
      </Helmet>
      
      <AnimatedBackground />
      <FloatingShapes />
      
      <InteractiveExam onComplete={handleExamComplete} />
    </div>
  );
}; 