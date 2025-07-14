import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Bell, CheckCircle, AlertCircle, Trophy } from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'exam', message: 'Upcoming Physics Quiz on July 15!', date: '2024-07-10', read: false, icon: <AlertCircle className="text-yellow-400" /> },
  { id: 2, type: 'achievement', message: 'You unlocked the "Quiz Master" badge!', date: '2024-07-09', read: false, icon: <Trophy className="text-pink-400" /> },
  { id: 3, type: 'class', message: 'New assignment posted in Advanced Mathematics.', date: '2024-07-08', read: true, icon: <CheckCircle className="text-green-400" /> },
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="min-h-screen p-6 bg-gradient-to-br from-blue-100/60 to-pink-100/60 flex flex-col items-center"
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-700 drop-shadow-lg flex items-center gap-2">
        <Bell className="w-7 h-7 text-blue-400" /> Notifications
      </h1>
      <div className="w-full max-w-2xl grid gap-6">
        {notifications.length === 0 && (
          <GlassCard className="p-8 text-center text-gray-400 text-lg">No notifications yet!</GlassCard>
        )}
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <GlassCard className={`flex items-center gap-4 p-6 ${!n.read ? 'border-2 border-blue-300 shadow-lg' : ''}` }>
              <div className="text-2xl">{n.icon}</div>
              <div className="flex-1">
                <div className={`text-base font-semibold ${!n.read ? 'text-blue-800' : 'text-gray-500'}`}>{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">{n.date}</div>
              </div>
              {!n.read && (
                <button onClick={() => markAsRead(n.id)} className="ml-4 px-3 py-1 rounded-full bg-blue-200 text-blue-800 text-xs font-bold hover:bg-blue-300 transition">Mark as read</button>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationsPage; 