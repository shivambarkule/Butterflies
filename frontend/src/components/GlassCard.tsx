import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

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
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-glass-200 bg-glass-100/20 backdrop-blur-xl shadow-glass',
        hover && 'hover:bg-glass-200/30 hover:border-glass-300 transition-all duration-300',
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
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </motion.div>
  );
}; 