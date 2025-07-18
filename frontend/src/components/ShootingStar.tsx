import React, { useEffect, useRef } from 'react';

const STAR_COLOR = 'rgba(255, 255, 224, 0.98)'; // Soft gold/white
const TRAIL_COLOR = 'rgba(255, 255, 224, 0.18)';
const STAR_SIZE = 1.7;
const TRAIL_LENGTH = 110; // Half the length (was 220)
const STAR_INTERVAL = 1800; // ms
const SPARKLE_CHANCE = 0.18;
const SPARKLE_COLOR = 'rgba(255,255,255,0.85)';
const SPARKLE_SIZE = 1.2;

// Rainbow colors for the tail
const RAINBOW_COLORS = [
  '#ff0000', // Red
  '#ff7f00', // Orange
  '#ffff00', // Yellow
  '#00ff00', // Green
  '#0000ff', // Blue
  '#4b0082', // Indigo
  '#9400d3'  // Violet
];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const ShootingStar: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<any[]>([]);
  const sparkles = useRef<any[]>([]);

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
      const angle = random(Math.PI / 7, Math.PI / 3); // 25-60 deg
      const speed = random(21, 33); // 3 times faster (was 14-22)
      // For a bezier-like tail, add a slight curve
      const curve = random(-0.04, 0.04);
      stars.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        curve,
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
        // Draw trail as a smooth bezier with rainbow colors
        ctx.save();
        ctx.beginPath();
        if (star.trail.length > 2) {
          ctx.moveTo(star.x, star.y);
          for (let i = 1; i < star.trail.length; i += 4) { // More frequent points for smoother curve
            const t = star.trail[i];
            ctx.lineTo(t.x, t.y);
          }
          // Create rainbow gradient for the tail
          const gradient = ctx.createLinearGradient(star.x, star.y, star.trail[star.trail.length - 1]?.x || star.x, star.trail[star.trail.length - 1]?.y || star.y);
          RAINBOW_COLORS.forEach((color, index) => {
            gradient.addColorStop(index / (RAINBOW_COLORS.length - 1), color);
          });
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2.2;
          ctx.shadowColor = STAR_COLOR;
          ctx.shadowBlur = 16;
          ctx.globalAlpha = 0.8;
          ctx.stroke();
        }
        ctx.restore();
        // Draw sparkles along the tail
        for (let i = 0; i < star.trail.length; i += 9) { // More sparkles for shorter tail
          if (Math.random() < SPARKLE_CHANCE) {
            const t = star.trail[i];
            sparkles.current.push({
              x: t.x + random(-2, 2),
              y: t.y + random(-2, 2),
              size: SPARKLE_SIZE + random(-0.5, 0.7),
              alpha: 1,
              decay: random(0.01, 0.03)
            });
          }
        }
        // Draw star head
        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, STAR_SIZE, 0, Math.PI * 2);
        ctx.fillStyle = STAR_COLOR;
        ctx.globalAlpha = 1;
        ctx.shadowColor = STAR_COLOR;
        ctx.shadowBlur = 40;
        ctx.fill();
        ctx.restore();
      });
      // Draw and update sparkles
      sparkles.current.forEach((s, idx) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = SPARKLE_COLOR;
        ctx.globalAlpha = s.alpha;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
        s.alpha -= s.decay;
      });
      sparkles.current = sparkles.current.filter(s => s.alpha > 0.05);
      // Update positions with smoother interpolation
      stars.current.forEach(star => {
        // Add a slight curve for bezier effect
        star.vx += star.curve;
        star.trail.unshift({ x: star.x, y: star.y });
        if (star.trail.length > TRAIL_LENGTH) star.trail.pop();
        star.x += star.vx;
        star.y += star.vy;
        star.life++;
      });
      // Remove stars that are out of bounds
      stars.current = stars.current.filter(star =>
        star.x < width + 100 && star.y < height + 100 && star.life < 120 // Shorter life for faster stars
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