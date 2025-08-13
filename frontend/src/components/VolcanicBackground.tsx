import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  type: 'ash' | 'flame';
  opacity: number;
  rotation: number;
}

export const VolcanicBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      const body = document.body;
      const isDark = body.classList.contains('theme-dark');
      setIsActive(isDark);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Generate initial particles
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -Math.random() * window.innerHeight,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 2 + 1,
          type: Math.random() > 0.7 ? 'flame' : 'ash',
          opacity: Math.random() * 0.8 + 0.2,
          rotation: Math.random() * 360,
        });
      }

      setParticles(newParticles);
    };

    generateParticles();

    // Animation loop
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y + particle.speed,
          x: particle.x + (Math.random() - 0.5) * 0.5, // Slight horizontal drift
          rotation: particle.rotation + 1,
          opacity: particle.y > window.innerHeight * 0.8 ? 
            particle.opacity * 0.98 : particle.opacity,
        })).filter(particle => particle.y < window.innerHeight + 100)
      );
    };

    const interval = setInterval(animateParticles, 50);

    // Add new particles periodically
    const addParticlesInterval = setInterval(() => {
      if (particles.length < 80) {
        setParticles(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: Math.random() * window.innerWidth,
            y: -10,
            size: Math.random() * 4 + 1,
            speed: Math.random() * 2 + 1,
            type: Math.random() > 0.7 ? 'flame' : 'ash',
            opacity: Math.random() * 0.8 + 0.2,
            rotation: Math.random() * 360,
          }
        ]);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(addParticlesInterval);
    };
  }, [isActive, particles.length]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Volcanic gradient background */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: 'linear-gradient(135deg, #1a0a0a 0%, #2d1b0a 25%, #4a1a0a 50%, #6b1a0a 75%, #8b1a0a 100%)',
        }}
      />
      
      {/* Volcanic glow effect */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(255, 69, 0, 0.3) 0%, rgba(255, 140, 0, 0.2) 30%, transparent 70%)',
        }}
      />

      {/* Ash and flame particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{ 
              x: particle.x, 
              y: particle.y,
              opacity: 0,
              scale: 0,
              rotate: particle.rotation
            }}
            animate={{ 
              x: particle.x,
              y: particle.y,
              opacity: particle.opacity,
              scale: 1,
              rotate: particle.rotation + 360
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut"
            }}
            style={{
              width: particle.size,
              height: particle.size,
            }}
          >
            {particle.type === 'ash' ? (
              <div 
                className="w-full h-full rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(169, 169, 169, 0.8) 0%, rgba(105, 105, 105, 0.6) 50%, rgba(47, 79, 79, 0.4) 100%)',
                  boxShadow: '0 0 4px rgba(169, 169, 169, 0.5)',
                }}
              />
            ) : (
              <div 
                className="w-full h-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 69, 0, 0.9) 0%, rgba(255, 140, 0, 0.7) 40%, rgba(255, 215, 0, 0.5) 70%, transparent 100%)',
                  boxShadow: '0 0 8px rgba(255, 69, 0, 0.6), 0 0 16px rgba(255, 140, 0, 0.4)',
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Volcanic eruption effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-32"
          animate={{
            scaleY: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(255, 69, 0, 0.8) 0%, rgba(255, 140, 0, 0.6) 40%, rgba(255, 215, 0, 0.4) 70%, transparent 100%)',
            borderRadius: '50% 50% 0 0',
          }}
        />
      </div>

      {/* Floating ember particles */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
        animate={{
          y: [0, -20, -40, -60],
          x: [0, 10, -10, 0],
          opacity: [1, 0.8, 0.6, 0],
          scale: [1, 1.2, 1.5, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 69, 0, 1) 0%, rgba(255, 140, 0, 0.8) 50%, transparent 100%)',
          boxShadow: '0 0 10px rgba(255, 69, 0, 0.8)',
        }}
      />
    </div>
  );
};