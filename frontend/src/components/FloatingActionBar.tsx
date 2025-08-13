import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Lightbulb, LogOut, BookOpen, Target, Sparkles, Trophy, Users
} from 'lucide-react';

const ICONS = [
  {
    key: 'notifications',
    icon: Bell,
    label: 'Notifications',
    badge: true,
  },
  {
    key: 'ideas',
    icon: Lightbulb,
    label: 'Ideas',
  },
  {
    key: 'logout',
    icon: LogOut,
    label: 'Logout',
  },
  {
    key: 'materials',
    icon: BookOpen,
    label: 'Study Materials',
  },
  {
    key: 'goals',
    icon: Target,
    label: 'Goals',
  },
  {
    key: 'smart',
    icon: Sparkles,
    label: 'Smart Study Tools',
  },
  {
    key: 'achievements',
    icon: Trophy,
    label: 'Achievements',
  },
  {
    key: 'friends',
    icon: Users,
    label: 'Friends',
  },
];

const MODALS = {
  notifications: 'Notifications Modal',
  ideas: 'Ideas Modal',
  logout: 'Logout Modal',
  materials: 'Study Materials Modal',
  goals: 'Goals Modal',
  smart: 'Smart Study Tools Modal',
  achievements: 'Achievements Modal',
  friends: 'Friends Modal',
};

export const FloatingActionBar: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [notificationCount] = useState(2); // Replace with real data if needed

  return (
    <Draggable bounds="body" defaultPosition={{x: 0, y: 0}}>
      <div className="fixed top-8 right-8 z-[9999] flex space-x-3 bg-glass-100/70 backdrop-blur-lg px-4 py-3 rounded-full shadow-2xl border border-glass-200 cursor-move select-none">
        {ICONS.map(({ key, icon: Icon, label, badge }) => (
          <motion.button
            key={key}
            whileTap={{ scale: 1.2 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setActiveModal(key)}
            className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group bg-white/10 hover:bg-white/20 shadow-lg`}
            title={label}
            style={{ outline: 'none' }}
          >
            <Icon className="w-6 h-6 text-white" />
            {badge && notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full px-1.5 py-0.5 font-bold shadow-md">
                {notificationCount}
              </span>
            )}
            <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none bg-black/80 text-white text-xs rounded px-2 py-1 transition-all duration-200">
              {label}
            </span>
          </motion.button>
        ))}
        {/* Modals */}
        <AnimatePresence>
          {activeModal && (
            <motion.div
              key={activeModal}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40"
              onClick={() => setActiveModal(null)}
            >
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                className="bg-glass-100 p-8 rounded-2xl shadow-2xl min-w-[320px] max-w-[90vw] max-h-[80vh] overflow-y-auto relative"
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
                  onClick={() => setActiveModal(null)}
                  aria-label="Close"
                >
                  ×
                </button>
                <div className="text-white text-lg font-bold mb-2">{ICONS.find(i => i.key === activeModal)?.label}</div>
                <div className="text-gray-200">
                  {/* Replace with actual modal content for each feature */}
                  {MODALS[activeModal as keyof typeof MODALS]}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Draggable>
  );
};

export default FloatingActionBar; 