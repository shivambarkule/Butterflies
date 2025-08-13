import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useTheme } from '../contexts/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '',
  hover = true,
  onClick
}) => {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      className={cn(
        'glass-card relative overflow-hidden',
        onClick && 'cursor-pointer',
        className
      )}
      whileHover={hover ? { 
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br pointer-events-none",
        isDark ? "from-white/5 to-transparent" : "from-gray-50/50 to-transparent"
      )} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shimmer effect */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
        isDark ? "via-white/10" : "via-gray-200/20"
      )} />
    </motion.div>
  );
}; 