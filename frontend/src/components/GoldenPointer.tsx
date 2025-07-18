import React, { useEffect, useRef, useState } from 'react';

interface GoldenPointerProps {
  isDark?: boolean;
}

const GoldenPointer: React.FC<GoldenPointerProps> = ({ isDark }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number; y: number; opacity: number; targetX: number; targetY: number }>>([]);
  const [speed, setSpeed] = useState(0);
  const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; opacity: number; life: number }>>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastMoveTime = useRef<number>(Date.now());

  useEffect(() => {
    // Hide the default cursor
    document.body.style.cursor = 'none';
    
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      const currentTime = Date.now();
      const timeDelta = currentTime - lastMoveTime.current;
      
      // Calculate speed based on distance and time
      const dx = newPosition.x - previousPosition.x;
      const dy = newPosition.y - previousPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const currentSpeed = timeDelta > 0 ? distance / timeDelta : 0;
      
      // Balanced speed calculation
      setSpeed(prevSpeed => prevSpeed * 0.6 + currentSpeed * 0.4);
      setPreviousPosition(newPosition);
      setPosition(newPosition);
      lastMoveTime.current = currentTime;
      
      // Add new position to trail with smooth initialization
      setTrail(prev => {
        const newTrail = [
          { 
            x: newPosition.x, 
            y: newPosition.y, 
            opacity: 1,
            targetX: newPosition.x,
            targetY: newPosition.y
          },
          ...prev.slice(0, 24) // Keep last 25 positions
        ];
        
        // Ensure all trail elements have valid positions
        return newTrail.map((pos, index) => ({
          ...pos,
          x: pos.x || newPosition.x,
          y: pos.y || newPosition.y,
          targetX: pos.targetX || newPosition.x,
          targetY: pos.targetY || newPosition.y
        }));
      });
      
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Animation function for continuous trail movement
    const animateTrail = () => {
      // Balanced speed decay when not moving
      const timeSinceLastMove = Date.now() - lastMoveTime.current;
      if (timeSinceLastMove > 12) { // If more than 12ms since last move
        setSpeed(prevSpeed => Math.max(0, prevSpeed * 0.93)); // Balanced decay
      }
      
      // Update rotation and pulse effects
      setRotation(prev => prev + 2);
      setPulse(prev => (prev + 0.1) % (Math.PI * 2));
      
      // Update sparkles
      setSparkles(prev => {
        const updated = prev.map(sparkle => ({
          ...sparkle,
          life: sparkle.life - 0.02,
          opacity: sparkle.opacity * 0.98
        })).filter(sparkle => sparkle.life > 0);
        
        // Add new sparkles randomly
        if (Math.random() < 0.3 && speed > 1) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 20 + Math.random() * 30;
          updated.push({
            x: position.x + Math.cos(angle) * distance,
            y: position.y + Math.sin(angle) * distance,
            opacity: 1,
            life: 1
          });
        }
        
        return updated;
      });
      
      setTrail(prev => 
        prev.map((pos, index) => {
          if (index === 0) {
            // First element stays at current position
            return {
              ...pos,
              x: position.x,
              y: position.y,
              targetX: position.x,
              targetY: position.y
            };
          }
          
          // Calculate target (previous element's position)
          const targetX = index === 1 ? position.x : prev[index - 1]?.x || position.x;
          const targetY = index === 1 ? position.y : prev[index - 1]?.y || position.y;
          
          // Calculate distance to target
          const dx = targetX - pos.x;
          const dy = targetY - pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Faster movement speed for quick convergence
          const baseSpeed = 0.6; // Much faster for quick pull-back
          const distanceFactor = Math.min(3.0, Math.max(0.2, distance / 12)); // Faster distance handling
          const positionFactor = 1 + (index * 0.08); // Faster position factor
          const speed = baseSpeed * distanceFactor * positionFactor;
          
          // Smooth movement with easing
          const moveX = dx * speed;
          const moveY = dy * speed;
          
          // Ensure smooth movement by limiting maximum step size
          const maxStep = 15; // Increased maximum pixels per frame for faster movement
          const actualMoveX = Math.abs(moveX) > maxStep ? (moveX > 0 ? maxStep : -maxStep) : moveX;
          const actualMoveY = Math.abs(moveY) > maxStep ? (moveY > 0 ? maxStep : -maxStep) : moveY;
          
          return {
            ...pos,
            x: pos.x + actualMoveX,
            y: pos.y + actualMoveY,
            targetX: targetX,
            targetY: targetY,
            opacity: Math.max(0, 1 - (index * 0.06)) // Slightly better opacity fade
          };
        })
      );
      
      animationRef.current = requestAnimationFrame(animateTrail);
    };

    // Start animation
    animateTrail();

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, position]);

  if (!isVisible) return null;

  // Calculate glow intensity based on speed - MUCH BRIGHTER
  const maxSpeed = 5; // Maximum expected speed for normalization
  const speedRatio = Math.min(1, speed / maxSpeed);
  const glowMultiplier = 0.6 + (speedRatio * 0.4); // Range from 0.6 to 1.0 - much brighter minimum
  const trailGlowMultiplier = 0.5 + (speedRatio * 0.5); // Trail glows much more dramatically

  return (
    <>
      {/* Sparkles Effect */}
      {sparkles.map((sparkle, index) => (
        <div
          key={`sparkle-${index}`}
          style={{
            position: 'fixed',
            left: sparkle.x,
            top: sparkle.y,
            width: '4px',
            height: '4px',
            backgroundColor: `rgba(255, 255, 255, ${sparkle.opacity})`,
            borderRadius: '50%',
            boxShadow: `
              0 0 8px rgba(255, 255, 255, ${sparkle.opacity}),
              0 0 16px rgba(255, 215, 0, ${sparkle.opacity * 0.8}),
              0 0 24px rgba(255, 165, 0, ${sparkle.opacity * 0.6})
            `,
            pointerEvents: 'none',
            zIndex: 10002,
            transform: 'translate(-50%, -50%)',
            transition: 'none',
            mixBlendMode: 'screen',
          }}
        />
      ))}
      
      {/* Meteor Trail - Gradient Blur Circles */}
      {trail.map((pos, index) => {
        // Calculate gradient colors from golden to violet
        const gradientRatio = index / 24; // 25 elements total (0-24)
        
        // Golden colors (head)
        const goldenOrange = 'rgba(255, 165, 0, 1)';
        const goldenYellow = 'rgba(255, 215, 0, 1)';
        const brightYellow = 'rgba(255, 255, 224, 1)';
        
        // Purple/violet colors (tail)
        const purple = 'rgba(128, 0, 255, 1)';
        const violet = 'rgba(148, 0, 211, 1)';
        const deepViolet = 'rgba(75, 0, 130, 1)';
        
        // Interpolate colors based on position
        const bgColor = `rgba(${
          Math.round(255 * (1 - gradientRatio) + 128 * gradientRatio)
        }, ${
          Math.round(165 * (1 - gradientRatio) + 0 * gradientRatio)
        }, ${
          Math.round(0 * (1 - gradientRatio) + 255 * gradientRatio)
        }, ${pos.opacity * 0.7 * trailGlowMultiplier})`;
        
        const borderColor = `rgba(${
          Math.round(255 * (1 - gradientRatio) + 148 * gradientRatio)
        }, ${
          Math.round(215 * (1 - gradientRatio) + 0 * gradientRatio)
        }, ${
          Math.round(0 * (1 - gradientRatio) + 211 * gradientRatio)
        }, ${pos.opacity * 0.9 * trailGlowMultiplier})`;
        
        const glowColor1 = `rgba(${
          Math.round(255 * (1 - gradientRatio) + 128 * gradientRatio)
        }, ${
          Math.round(165 * (1 - gradientRatio) + 0 * gradientRatio)
        }, ${
          Math.round(0 * (1 - gradientRatio) + 255 * gradientRatio)
        }, ${pos.opacity * 1.2 * trailGlowMultiplier})`;
        
        const glowColor2 = `rgba(${
          Math.round(255 * (1 - gradientRatio) + 148 * gradientRatio)
        }, ${
          Math.round(215 * (1 - gradientRatio) + 0 * gradientRatio)
        }, ${
          Math.round(0 * (1 - gradientRatio) + 211 * gradientRatio)
        }, ${pos.opacity * 1.0 * trailGlowMultiplier})`;
        
        const glowColor3 = `rgba(${
          Math.round(255 * (1 - gradientRatio) + 75 * gradientRatio)
        }, ${
          Math.round(255 * (1 - gradientRatio) + 0 * gradientRatio)
        }, ${
          Math.round(224 * (1 - gradientRatio) + 130 * gradientRatio)
        }, ${pos.opacity * 0.8 * trailGlowMultiplier})`;
        
        return (
          <div
            key={index}
            style={{
              position: 'fixed',
              left: pos.x,
              top: pos.y,
              width: `${30 - index * 0.8}px`,
              height: `${30 - index * 0.8}px`,
              backgroundColor: bgColor,
              borderRadius: '50%',
              border: `4px solid ${borderColor}`,
              boxShadow: `
                0 0 ${20 + index * 4}px ${glowColor1},
                0 0 ${35 + index * 6}px ${glowColor2},
                0 0 ${50 + index * 8}px ${glowColor3},
                0 0 ${65 + index * 10}px ${glowColor1},
                0 0 ${80 + index * 12}px ${glowColor2}
              `,
              filter: `blur(${2 + index * 0.5}px)`,
              pointerEvents: 'none',
              zIndex: 10000 - index,
              transform: 'translate(-50%, -50%)',
              transition: 'none',
              mixBlendMode: 'screen',
            }}
          />
        );
      })}
      
      {/* Green Glow Ring - Outermost */}
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: '140px',
          height: '140px',
          backgroundColor: `rgba(0, 255, 0, ${0.08 * glowMultiplier})`,
          borderRadius: '50%',
          boxShadow: `
            0 0 60px rgba(0, 255, 0, ${0.25 * glowMultiplier}),
            0 0 120px rgba(0, 255, 0, ${0.2 * glowMultiplier}),
            0 0 180px rgba(0, 255, 0, ${0.15 * glowMultiplier}),
            0 0 240px rgba(0, 255, 0, ${0.1 * glowMultiplier})
          `,
          pointerEvents: 'none',
          zIndex: 9997,
          transform: 'translate(-50%, -50%)',
          transition: 'none',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Purple Glow Ring */}
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: '120px',
          height: '120px',
          backgroundColor: `rgba(128, 0, 255, ${0.12 * glowMultiplier})`,
          borderRadius: '50%',
          boxShadow: `
            0 0 50px rgba(128, 0, 255, ${0.3 * glowMultiplier}),
            0 0 100px rgba(128, 0, 255, ${0.25 * glowMultiplier}),
            0 0 150px rgba(128, 0, 255, ${0.2 * glowMultiplier}),
            0 0 200px rgba(128, 0, 255, ${0.15 * glowMultiplier})
          `,
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          transition: 'none',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Outer Aura */}
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: '100px',
          height: '100px',
          backgroundColor: `rgba(255, 215, 0, ${0.15 * glowMultiplier})`,
          borderRadius: '50%',
          boxShadow: `
            0 0 50px rgba(255, 215, 0, ${0.35 * glowMultiplier}),
            0 0 100px rgba(255, 165, 0, ${0.25 * glowMultiplier}),
            0 0 150px rgba(255, 215, 0, ${0.15 * glowMultiplier})
          `,
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'none',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Aura Glow */}
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: '60px',
          height: '60px',
          backgroundColor: `rgba(255, 165, 0, ${0.25 * glowMultiplier})`,
          borderRadius: '50%',
          boxShadow: `
            0 0 40px rgba(255, 165, 0, ${0.5 * glowMultiplier}),
            0 0 80px rgba(255, 215, 0, ${0.4 * glowMultiplier}),
            0 0 120px rgba(255, 255, 224, ${0.3 * glowMultiplier}),
            0 0 160px rgba(255, 165, 0, ${0.2 * glowMultiplier})
          `,
          pointerEvents: 'none',
          zIndex: 10000,
          transform: 'translate(-50%, -50%)',
          transition: 'none',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Main Meteor Head - Gradient Core with Effects */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: `${28 + Math.sin(pulse) * 4}px`,
          height: `${28 + Math.sin(pulse) * 4}px`,
          background: `radial-gradient(circle, 
            rgba(255, 215, 0, ${1.0 * glowMultiplier}) 0%, 
            rgba(255, 165, 0, ${0.9 * glowMultiplier}) 40%, 
            rgba(255, 69, 0, ${0.8 * glowMultiplier}) 70%, 
            rgba(148, 0, 211, ${0.6 * glowMultiplier}) 100%)`,
          borderRadius: '50%',
          border: `4px solid rgba(255, 255, 224, ${1.0 * glowMultiplier})`,
          boxShadow: `
            0 0 ${30 + Math.sin(pulse) * 10}px rgba(255, 215, 0, ${1.2 * glowMultiplier}),
            0 0 ${60 + Math.sin(pulse) * 15}px rgba(255, 165, 0, ${1.0 * glowMultiplier}),
            0 0 ${90 + Math.sin(pulse) * 20}px rgba(255, 69, 0, ${0.8 * glowMultiplier}),
            0 0 ${120 + Math.sin(pulse) * 25}px rgba(148, 0, 211, ${0.6 * glowMultiplier}),
            0 0 ${150 + Math.sin(pulse) * 30}px rgba(75, 0, 130, ${0.4 * glowMultiplier}),
            inset 0 0 30px rgba(255, 255, 224, ${0.5 * glowMultiplier})
          `,
          pointerEvents: 'none',
          zIndex: 10001,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          transition: 'none',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Rotating Energy Rings */}
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: '60px',
          height: '60px',
          border: `2px solid rgba(255, 215, 0, ${0.6 * glowMultiplier})`,
          borderRadius: '50%',
          boxShadow: `
            0 0 20px rgba(255, 215, 0, ${0.4 * glowMultiplier}),
            0 0 40px rgba(255, 165, 0, ${0.3 * glowMultiplier})
          `,
          pointerEvents: 'none',
          zIndex: 10000,
          transform: `translate(-50%, -50%) rotate(${-rotation * 0.5}deg)`,
          transition: 'none',
          mixBlendMode: 'screen',
        }}
      />
      
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: '80px',
          height: '80px',
          border: `1px solid rgba(255, 165, 0, ${0.4 * glowMultiplier})`,
          borderRadius: '50%',
          boxShadow: `
            0 0 15px rgba(255, 165, 0, ${0.3 * glowMultiplier}),
            0 0 30px rgba(255, 69, 0, ${0.2 * glowMultiplier})
          `,
          pointerEvents: 'none',
          zIndex: 9999,
          transform: `translate(-50%, -50%) rotate(${rotation * 0.3}deg)`,
          transition: 'none',
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
};

export default GoldenPointer; 