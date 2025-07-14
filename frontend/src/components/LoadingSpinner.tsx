import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-border animate-pulse"></div>
        
        {/* Inner ring */}
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-border"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        ></motion.div>
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-r from-white to-gray-100 shadow-lg"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        ></motion.div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/20 via-purple-400/20 to-pink-400/20 blur-sm animate-pulse"></div>
      </motion.div>
      
      {/* Floating particles */}
      <motion.div
        className="absolute w-2 h-2 bg-neon-blue rounded-full"
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{ left: '60%', top: '20%' }}
      />
      <motion.div
        className="absolute w-1 h-1 bg-neon-pink rounded-full"
        animate={{
          x: [0, -15, 0],
          y: [0, 15, 0],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5
        }}
        style={{ left: '30%', top: '70%' }}
      />
      <motion.div
        className="absolute w-1.5 h-1.5 bg-neon-green rounded-full"
        animate={{
          x: [0, 10, 0],
          y: [0, -10, 0],
          opacity: [0.4, 1, 0.4]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
        style={{ left: '80%', top: '60%' }}
      />
    </div>
  );
}; 