import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to StudyHub!',
      message: 'Your personalized study environment is ready. Start exploring your dashboard.',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false
    },
    {
      id: '2',
      title: 'Study Session Complete',
      message: 'Great job! You\'ve completed your 2-hour study session. Take a break!',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      action: {
        label: 'View Progress',
        onClick: () => console.log('View progress clicked')
      }
    },
    {
      id: '3',
      title: 'Upcoming Exam Reminder',
      message: 'Your Mathematics exam is scheduled for tomorrow at 10:00 AM.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      action: {
        label: 'View Details',
        onClick: () => console.log('View exam details clicked')
      }
    },
    {
      id: '4',
      title: 'New Study Material Available',
      message: 'New flashcards have been added to your Physics course.',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Auto-add some notifications periodically for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddNotification = Math.random() < 0.1; // 10% chance every interval
      if (shouldAddNotification && notifications.length < 10) {
        const demoNotifications = [
          {
            title: 'Study Break Reminder',
            message: 'You\'ve been studying for a while. Consider taking a short break!',
            type: 'info' as const
          },
          {
            title: 'Achievement Unlocked!',
            message: 'Congratulations! You\'ve earned the "Consistent Learner" badge.',
            type: 'success' as const,
            action: {
              label: 'View Badge',
              onClick: () => console.log('View badge clicked')
            }
          },
          {
            title: 'New Course Available',
            message: 'Advanced Calculus course is now available for enrollment.',
            type: 'info' as const,
            action: {
              label: 'Learn More',
              onClick: () => console.log('Learn more clicked')
            }
          }
        ];
        
        const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)];
        addNotification(randomNotification);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [notifications.length]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}; 