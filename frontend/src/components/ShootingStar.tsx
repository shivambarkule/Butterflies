import React, { useEffect, useRef } from 'react';

const STAR_COLOR = 'rgba(255, 215, 0, 0.95)'; // Gold
const TRAIL_COLOR = 'rgba(255, 215, 0, 0.3)';
const STAR_SIZE = 3.5;
const TRAIL_LENGTH = 80;
const STAR_INTERVAL = 1800; // ms

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const ShootingStar: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function spawnStar() {
      // Start from a random top position, shoot diagonally down
      const startX = random(0, width * 0.8);
      const startY = random(0, height * 0.3);
      const angle = random(Math.PI / 6, Math.PI / 3); // 30-60 deg
      const speed = random(8, 14);
      stars.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        trail: [],
        life: 0
      });
    }

    let lastSpawn = Date.now();
    let anim: number;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Draw and update stars
      stars.current.forEach(star => {
        // Draw trail
        for (let i = 0; i < star.trail.length; i++) {
          const t = star.trail[i];
          ctx.beginPath();
          ctx.arc(t.x, t.y, STAR_SIZE + (i / TRAIL_LENGTH) * 6, 0, Math.PI * 2);
          ctx.fillStyle = TRAIL_COLOR;
          ctx.globalAlpha = 0.18 * (1 - i / TRAIL_LENGTH);
          ctx.shadowColor = STAR_COLOR;
          ctx.shadowBlur = 12;
          ctx.fill();
        }
        // Draw star head
        ctx.beginPath();
        ctx.arc(star.x, star.y, STAR_SIZE, 0, Math.PI * 2);
        ctx.fillStyle = STAR_COLOR;
        ctx.globalAlpha = 1;
        ctx.shadowColor = STAR_COLOR;
        ctx.shadowBlur = 32;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });
      // Update positions
      stars.current.forEach(star => {
        star.trail.unshift({ x: star.x, y: star.y });
        if (star.trail.length > TRAIL_LENGTH) star.trail.pop();
        star.x += star.vx;
        star.y += star.vy;
        star.life++;
      });
      // Remove stars that are out of bounds
      stars.current = stars.current.filter(star =>
        star.x < width + 100 && star.y < height + 100 && star.life < 120
      );
      // Spawn new star at interval
      if (Date.now() - lastSpawn > STAR_INTERVAL) {
        spawnStar();
        lastSpawn = Date.now();
      }
      anim = requestAnimationFrame(draw);
    }
    draw();
    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(anim);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
};

export default ShootingStar; 