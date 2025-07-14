import React, { useRef, useEffect } from 'react';

const SNOWFLAKES = 80;
const COLORS = ['#fff', '#e0e7ff', '#f3f4f6'];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const Snowfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakes = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function createSnowflakes() {
      snowflakes.current = Array.from({ length: SNOWFLAKES }, () => ({
        x: random(0, width),
        y: random(0, height),
        r: random(1, 3.5),
        d: random(1, 2),
        color: COLORS[Math.floor(random(0, COLORS.length))],
        speed: random(0.5, 1.5)
      }));
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      snowflakes.current.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fillStyle = flake.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      update();
      requestAnimationFrame(draw);
    }

    function update() {
      snowflakes.current.forEach(flake => {
        flake.y += flake.speed;
        if (flake.y > height) {
          flake.x = random(0, width);
          flake.y = -flake.r;
        }
      });
    }

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
      createSnowflakes();
    }

    createSnowflakes();
    draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
        zIndex: 1,
      }}
    />
  );
};

export default Snowfall; 