import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Calendar, BookOpen, Target, Settings, X, Plus, Edit3, Trash2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { playNotificationSound } from '../utils/soundEffects';

interface StudyReminder {
  id: string;
  title: string;
  message: string;
  type: 'exam' | 'study' | 'break' | 'goal';
  priority: 'low' | 'medium' | 'high';
  scheduledTime: Date;
  isActive: boolean;
  isRepeating: boolean;
  repeatInterval: 'daily' | 'weekly' | 'monthly' | null;
  subject?: string;
  targetHours?: number;
  completed: boolean;
}

interface SmartNotificationsProps {
  onClose?: () => void;
}

export const SmartNotifications: React.FC<SmartNotificationsProps> = ({ onClose }) => {
  const [reminders, setReminders] = useState<StudyReminder[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<StudyReminder | null>(null);
  const [newReminder, setNewReminder] = useState({
    title: '',
    message: '',
    type: 'study' as const,
    priority: 'medium' as const,
    scheduledTime: new Date(),
    isRepeating: false,
    repeatInterval: null as any,
    subject: '',
    targetHours: 1
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<StudyReminder | null>(null);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Check for due reminders
  useEffect(() => {
    const dueReminders = reminders.filter(reminder => 
      reminder.isActive && 
      !reminder.completed && 
      reminder.scheduledTime <= currentTime &&
      reminder.scheduledTime > new Date(currentTime.getTime() - 5 * 60 * 1000) // Within last 5 minutes
    );

    if (dueReminders.length > 0) {
      const reminder = dueReminders[0];
      setCurrentNotification(reminder);
      setShowNotification(true);
      playNotificationSound();

      // Auto-hide notification after 10 seconds
      setTimeout(() => {
        setShowNotification(false);
        setCurrentNotification(null);
      }, 10000);
    }
  }, [currentTime, reminders]);

  const handleAddReminder = () => {
    if (newReminder.title.trim()) {
      const reminder: StudyReminder = {
        id: Date.now().toString(),
        ...newReminder,
        isActive: true,
        completed: false
      };

      setReminders(prev => [...prev, reminder]);
      setNewReminder({
        title: '',
        message: '',
        type: 'study',
        priority: 'medium',
        scheduledTime: new Date(),
        isRepeating: false,
        repeatInterval: null,
        subject: '',
        targetHours: 1
      });
      setShowAddModal(false);
    }
  };

  const handleEditReminder = () => {
    if (editingReminder && newReminder.title.trim()) {
      setReminders(prev => prev.map(reminder => 
        reminder.id === editingReminder.id 
          ? { ...reminder, ...newReminder }
          : reminder
      ));
      setEditingReminder(null);
      setShowAddModal(false);
    }
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const handleToggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    ));
  };

  const handleCompleteReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: true }
        : reminder
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return <Target className="w-4 h-4" />;
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'break': return <Clock className="w-4 h-4" />;
      case 'goal': return <Target className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} from now`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} from now`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} from now`;
    return 'Due now';
  };

  const activeReminders = reminders.filter(r => r.isActive && !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Smart Notifications</h1>
              <p className="text-gray-300">Context-aware study reminders and notifications</p>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="p-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg text-white hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
              {onClose && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 bg-glass-100/30 rounded-lg text-white hover:bg-glass-200/30 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <GlassCard className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{activeReminders.length}</div>
              <div className="text-gray-300 text-sm">Active Reminders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{completedReminders.length}</div>
              <div className="text-gray-300 text-sm">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {reminders.filter(r => r.type === 'exam').length}
              </div>
              <div className="text-gray-300 text-sm">Exam Reminders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {reminders.filter(r => r.isRepeating).length}
              </div>
              <div className="text-gray-300 text-sm">Repeating</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Active Reminders */}
      <div className="mb-6">
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Active Reminders</h2>
          
          {activeReminders.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300">No active reminders. Add one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeReminders.map(reminder => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-glass-100/30 hover:bg-glass-100/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(reminder.type)}
                          <h3 className="text-white font-medium">{reminder.title}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                          {reminder.priority}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{reminder.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(reminder.scheduledTime)}</span>
                        </span>
                        {reminder.subject && (
                          <span className="flex items-center space-x-1">
                            <BookOpen className="w-3 h-3" />
                            <span>{reminder.subject}</span>
                          </span>
                        )}
                        {reminder.isRepeating && (
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{reminder.repeatInterval}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCompleteReminder(reminder.id)}
                        className="p-2 bg-green-500 rounded-lg text-white"
                      >
                        <Target className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEditingReminder(reminder);
                          setNewReminder({
                            title: reminder.title,
                            message: reminder.message,
                            type: reminder.type,
                            priority: reminder.priority,
                            scheduledTime: reminder.scheduledTime,
                            isRepeating: reminder.isRepeating,
                            repeatInterval: reminder.repeatInterval,
                            subject: reminder.subject || '',
                            targetHours: reminder.targetHours || 1
                          });
                          setShowAddModal(true);
                        }}
                        className="p-2 bg-blue-500 rounded-lg text-white"
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="p-2 bg-red-500 rounded-lg text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="mb-6">
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Completed Reminders</h2>
            <div className="space-y-2">
              {completedReminders.slice(0, 5).map(reminder => (
                <div key={reminder.id} className="p-3 rounded-lg bg-glass-100/20 opacity-60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium line-through">{reminder.title}</h4>
                      <p className="text-gray-400 text-sm">{reminder.message}</p>
                    </div>
                    <span className="text-green-400 text-sm">✓ Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-6 w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-white mb-4">
                  {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={newReminder.title}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 rounded-lg bg-glass-100/50 border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      placeholder="Enter reminder title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Message</label>
                    <textarea
                      value={newReminder.message}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full p-3 rounded-lg bg-glass-100/50 border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
                      rows={3}
                      placeholder="Enter reminder message..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Type</label>
                      <select
                        value={newReminder.type}
                        onChange={(e) => setNewReminder(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full p-3 rounded-lg bg-glass-100/50 border border-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      >
                        <option value="study">Study</option>
                        <option value="exam">Exam</option>
                        <option value="break">Break</option>
                        <option value="goal">Goal</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Priority</label>
                      <select
                        value={newReminder.priority}
                        onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full p-3 rounded-lg bg-glass-100/50 border border-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Scheduled Time</label>
                    <input
                      type="datetime-local"
                      value={newReminder.scheduledTime.toISOString().slice(0, 16)}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, scheduledTime: new Date(e.target.value) }))}
                      className="w-full p-3 rounded-lg bg-glass-100/50 border border-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="repeating"
                      checked={newReminder.isRepeating}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, isRepeating: e.target.checked }))}
                      className="w-4 h-4 text-blue-400 bg-glass-200 border-glass-300 focus:ring-blue-400"
                    />
                    <label htmlFor="repeating" className="text-gray-300">Repeating</label>
                  </div>

                  {newReminder.isRepeating && (
                    <div>
                      <label className="block text-gray-300 mb-2">Repeat Interval</label>
                      <select
                        value={newReminder.repeatInterval || ''}
                        onChange={(e) => setNewReminder(prev => ({ ...prev, repeatInterval: e.target.value as any }))}
                        className="w-full p-3 rounded-lg bg-glass-100/50 border border-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={editingReminder ? handleEditReminder : handleAddReminder}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      {editingReminder ? 'Update' : 'Add'} Reminder
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingReminder(null);
                      }}
                      className="flex-1 px-4 py-2 bg-glass-100/50 rounded-lg text-white font-semibold hover:bg-glass-200/50 transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Notification */}
      <AnimatePresence>
        {showNotification && currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 300 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 300 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <GlassCard className="p-4 max-w-sm">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    {getTypeIcon(currentNotification.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{currentNotification.title}</h4>
                  <p className="text-gray-300 text-sm">{currentNotification.message}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleCompleteReminder(currentNotification.id);
                        setShowNotification(false);
                      }}
                      className="px-3 py-1 bg-green-500 rounded text-white text-xs font-medium"
                    >
                      Complete
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowNotification(false)}
                      className="px-3 py-1 bg-glass-100/50 rounded text-white text-xs font-medium"
                    >
                      Dismiss
                    </motion.button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 