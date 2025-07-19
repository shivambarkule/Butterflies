import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface RainDrop {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface Leaf {
  id: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
  duration: number;
}

export const WeatherEffects: React.FC = () => {
  const { weather, season } = useTheme();

  // Generate rain drops
  const generateRainDrops = (): RainDrop[] => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 2,
    }));
  };

  // Generate snowflakes
  const generateSnowflakes = (): Snowflake[] => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
    }));
  };

  // Generate autumn leaves
  const generateLeaves = (): Leaf[] => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 3,
    }));
  };

  const rainDrops = generateRainDrops();
  const snowflakes = generateSnowflakes();
  const leaves = generateLeaves();

  if (weather === 'rainy') {
    return (
      <div className="fixed inset-0 pointer-events-none z-10">
        {rainDrops.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute w-0.5 bg-blue-400/60 rounded-full"
            style={{
              left: `${drop.x}%`,
              top: `${drop.y}%`,
              height: '20px',
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: '100vh', 
              opacity: [0, 1, 0],
            }}
            transition={{
              delay: drop.delay,
              duration: drop.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    );
  }

  if (weather === 'snowy' || season === 'winter') {
    return (
      <div className="fixed inset-0 pointer-events-none z-10">
        {snowflakes.map((flake) => (
          <motion.div
            key={flake.id}
            className="absolute text-white/80"
            style={{
              left: `${flake.x}%`,
              top: `${flake.y}%`,
              fontSize: `${flake.size}px`,
            }}
            initial={{ y: -10, opacity: 0, rotate: 0 }}
            animate={{ 
              y: '100vh', 
              opacity: [0, 1, 0],
              rotate: 360,
            }}
            transition={{
              delay: flake.delay,
              duration: flake.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            ❄
          </motion.div>
        ))}
      </div>
    );
  }

  if (season === 'autumn') {
    return (
      <div className="fixed inset-0 pointer-events-none z-10">
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            className="absolute text-orange-400/60"
            style={{
              left: `${leaf.x}%`,
              top: `${leaf.y}%`,
              fontSize: '12px',
            }}
            initial={{ 
              y: -20, 
              opacity: 0, 
              rotate: leaf.rotation,
              x: 0 
            }}
            animate={{ 
              y: '100vh', 
              opacity: [0, 1, 0],
              rotate: leaf.rotation + 360,
              x: [0, 50, -30, 20, 0],
            }}
            transition={{
              delay: leaf.delay,
              duration: leaf.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🍂
          </motion.div>
        ))}
      </div>
    );
  }

  if (weather === 'stormy') {
    return (
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Lightning flashes */}
        <motion.div
          className="absolute inset-0 bg-yellow-400/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3 + Math.random() * 5,
          }}
        />
        
        {/* Heavy rain */}
        {rainDrops.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute w-1 bg-gray-400/80 rounded-full"
            style={{
              left: `${drop.x}%`,
              top: `${drop.y}%`,
              height: '30px',
            }}
            initial={{ y: -30, opacity: 0 }}
            animate={{ 
              y: '100vh', 
              opacity: [0, 1, 0],
            }}
            transition={{
              delay: drop.delay,
              duration: drop.duration * 0.7,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    );
  }

  if (weather === 'cloudy') {
    return (
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Floating clouds */}
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/30 text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${20 + Math.random() * 30}%`,
            }}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ 
              x: '100vw', 
              opacity: [0, 0.3, 0],
            }}
            transition={{
              delay: i * 2,
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            ☁
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
}; 