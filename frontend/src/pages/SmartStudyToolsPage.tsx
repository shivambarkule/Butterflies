import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { FloatingShapes } from '../components/FloatingShapes';
import { Helmet } from 'react-helmet-async';
import { FlashcardMode } from '../components/FlashcardMode';
import { StudyTimer } from '../components/StudyTimer';
import { MindMappingTool } from '../components/MindMappingTool';
import { VoiceNotes } from '../components/VoiceNotes';
import { SmartNotifications } from '../components/SmartNotifications';
import { BreakTimeGames } from '../components/BreakTimeGames';
import { AchievementSystem } from '../components/AchievementSystem';
import { MagneticElement } from '../components/MagneticElement';
import { 
  BookOpen, 
  Clock, 
  Brain, 
  Mic, 
  Bell, 
  Target,
  TrendingUp,
  Zap,
  Lightbulb,
  Gamepad2,
  Trophy
} from 'lucide-react';

type ToolType = 'flashcards' | 'timer' | 'mindmap' | 'voicenotes' | 'notifications' | 'games' | 'achievements' | null;

export const SmartStudyToolsPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(null);

  const tools = [
    {
      id: 'flashcards',
      title: 'Flashcard Mode',
      description: 'Swipeable cards with flip animations for active recall',
      icon: BookOpen,
      color: 'from-blue-400 to-purple-400',
      features: ['Swipe gestures', 'Flip animations', 'Progress tracking', 'Shuffle mode']
    },
    {
      id: 'timer',
      title: 'Study Timer',
      description: 'Pomodoro technique with 25/5 minute cycles and break reminders',
      icon: Clock,
      color: 'from-green-400 to-emerald-400',
      features: ['25/5 cycles', 'Visual timer', 'Break reminders', 'Session tracking']
    },
    {
      id: 'mindmap',
      title: 'Mind Mapping',
      description: 'Interactive concept maps for visual learning and organization',
      icon: Brain,
      color: 'from-purple-400 to-pink-400',
      features: ['Drag & drop', 'Visual connections', 'Color coding', 'Export options']
    },
    {
      id: 'voicenotes',
      title: 'Voice Notes',
      description: 'Record study notes with real-time waveform visualization',
      icon: Mic,
      color: 'from-orange-400 to-red-400',
      features: ['Audio recording', 'Waveform display', 'Playback controls', 'Note organization']
    },
    {
      id: 'notifications',
      title: 'Smart Notifications',
      description: 'Context-aware study reminders and intelligent scheduling',
      icon: Bell,
      color: 'from-cyan-400 to-blue-400',
      features: ['Smart scheduling', 'Priority levels', 'Repeating reminders', 'Progress tracking']
    },
    {
      id: 'games',
      title: 'Break Time Games',
      description: 'Fun mini-games to keep your mind sharp during study breaks',
      icon: Gamepad2,
      color: 'from-yellow-400 to-orange-400',
      features: ['Memory Match', 'Word Scramble', 'Math Puzzles', 'Color Sorting', 'Typing Speed']
    },
    {
      id: 'achievements',
      title: 'Achievement System',
      description: 'Track your progress with streaks, mastery, and study achievements',
      icon: Trophy,
      color: 'from-yellow-400 to-amber-400',
      features: ['Login Streaks', 'Subject Mastery', 'Speed Achievements', 'Perfect Scores', 'Study Warrior']
    }
  ];

  const handleToolSelect = (toolId: ToolType) => {
    setActiveTool(toolId);
  };

  const handleCloseTool = () => {
    setActiveTool(null);
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'flashcards':
        return <FlashcardMode onClose={handleCloseTool} />;
      case 'timer':
        return <StudyTimer onClose={handleCloseTool} />;
      case 'mindmap':
        return <MindMappingTool onClose={handleCloseTool} />;
      case 'voicenotes':
        return <VoiceNotes onClose={handleCloseTool} />;
      case 'notifications':
        return <SmartNotifications onClose={handleCloseTool} />;
      case 'games':
        return <BreakTimeGames onClose={handleCloseTool} />;
      case 'achievements':
        return <AchievementSystem />;
      default:
        return null;
    }
  };

  if (activeTool) {
    return renderActiveTool();
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Smart Study Tools - Butterflies</title>
      </Helmet>
      
      <AnimatedBackground />
      <FloatingShapes />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <MagneticElement strength={0.1}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <GlassCard className="p-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Lightbulb className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Smart Study Tools
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 max-w-2xl mx-auto"
              >
                Enhance your learning experience with our collection of intelligent study tools. 
                From interactive flashcards to voice notes, everything you need to study smarter.
              </motion.p>
            </div>
          </GlassCard>
        </motion.div>
        </MagneticElement>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tools.map((tool, index) => (
            <MagneticElement key={tool.id} strength={0.2}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassCard className="p-6 h-full cursor-pointer transition-all duration-300 hover:bg-glass-200/30">
                  <div 
                    className="text-center"
                    onClick={() => handleToolSelect(tool.id as ToolType)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <tool.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">{tool.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{tool.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {tool.features.slice(0, 4).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-1 text-gray-400">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </MagneticElement>
          ))}
        </div>

        {/* Study Tips */}
        <MagneticElement strength={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Study Smart, Not Hard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Set Clear Goals</h3>
                <p className="text-gray-300 text-sm">Define specific, achievable study objectives for each session</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Track Progress</h3>
                <p className="text-gray-300 text-sm">Monitor your learning progress and celebrate small victories</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Stay Consistent</h3>
                <p className="text-gray-300 text-sm">Regular, shorter study sessions are more effective than cramming</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
        </MagneticElement>
      </div>
    </div>
  );
}; 