import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'slide' | 'fade' | 'morph' | 'zoom' | 'flip' | 'bounce';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'slide',
  direction = 'right',
  duration = 0.5,
  delay = 0
}) => {
  const location = useLocation();

  const getTransitionVariants = () => {
    const baseVariants = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    };

    switch (type) {
      case 'slide':
        const slideVariants = {
          initial: { x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0, y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0, opacity: 0 },
          animate: { x: 0, y: 0, opacity: 1 },
          exit: { x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0, y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0, opacity: 0 }
        };
        return slideVariants;

      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };

      case 'morph':
        return {
          initial: { 
            opacity: 0, 
            scale: 0.8, 
            rotateY: -15,
            filter: 'blur(10px)'
          },
          animate: { 
            opacity: 1, 
            scale: 1, 
            rotateY: 0,
            filter: 'blur(0px)'
          },
          exit: { 
            opacity: 0, 
            scale: 1.2, 
            rotateY: 15,
            filter: 'blur(10px)'
          }
        };

      case 'zoom':
        return {
          initial: { scale: 0.5, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.5, opacity: 0 }
        };

      case 'flip':
        return {
          initial: { rotateY: -90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          exit: { rotateY: 90, opacity: 0 }
        };

      case 'bounce':
        return {
          initial: { y: -50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 50, opacity: 0 }
        };

      default:
        return baseVariants;
    }
  };

  const variants = getTransitionVariants();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{
          duration,
          delay,
          ease: type === 'bounce' ? 'easeOut' : 'easeInOut'
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Specialized transition components
export const SlideTransition = ({ children, direction = 'right' }: { children: React.ReactNode; direction?: 'left' | 'right' | 'up' | 'down' }) => (
  <PageTransition type="slide" direction={direction}>
    {children}
  </PageTransition>
);

export const FadeTransition = ({ children }: { children: React.ReactNode }) => (
  <PageTransition type="fade">
    {children}
  </PageTransition>
);

export const MorphTransition = ({ children }: { children: React.ReactNode }) => (
  <PageTransition type="morph">
    {children}
  </PageTransition>
);

export const ZoomTransition = ({ children }: { children: React.ReactNode }) => (
  <PageTransition type="zoom">
    {children}
  </PageTransition>
);

export const FlipTransition = ({ children }: { children: React.ReactNode }) => (
  <PageTransition type="flip">
    {children}
  </PageTransition>
);

export const BounceTransition = ({ children }: { children: React.ReactNode }) => (
  <PageTransition type="bounce">
    {children}
  </PageTransition>
); 