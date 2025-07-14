import React, { useEffect, useRef, useState } from 'react';

interface GoldenPointerProps {
  isDark?: boolean;
}

const TRAIL_LENGTH = 28; // Fewer segments for less clutter
const HEAD_SIZE = 8; // Smaller head
const TAIL_SIZE = 6; // Smaller tail
const TRAIL_COLORS_GOLD = [
  'rgba(255, 180, 0, 1)',      // deeper gold
  'rgba(255, 220, 40, 0.85)', // bright gold
  'rgba(255, 255, 0, 0.7)',   // yellow
  'rgba(255, 255, 120, 0.5)', // pale yellow
  'rgba(40, 40, 40, 0.25)'    // dark for contrast
];
const TRAIL_COLORS_BLUEGREEN = [
  'rgba(0, 200, 255, 1)',      // bright blue
  'rgba(0, 120, 255, 0.85)',  // blue
  'rgba(0, 255, 200, 0.7)',   // aqua
  'rgba(120, 255, 255, 0.5)', // pale blue
  'rgba(40, 40, 40, 0.25)'    // dark for contrast
];
const INTERPOLATION = 0.45; // Faster, snappier movement

const isClickable = (el: Element | null) => {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (['button', 'a', 'input', 'select', 'textarea', 'label'].includes(tag)) return true;
  const style = window.getComputedStyle(el);
  return style.cursor === 'pointer';
};

const GoldenPointer: React.FC<GoldenPointerProps> = ({ isDark }) => {
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [colorLerp, setColorLerp] = useState(0); // 0 = gold, 1 = bluegreen
  const headRef = useRef({ x: 0, y: 0 });
  const tailRefs = useRef<Array<{ x: number; y: number }>>([]);
  const [, forceRerender] = useState(0);
  const animRef = useRef<number>();

  useEffect(() => {
    // Always hide the cursor, even on clickable elements
    document.body.style.cursor = 'none';
    const style = document.createElement('style');
    style.innerHTML = '* { cursor: none !important; }';
    document.head.appendChild(style);
    return () => {
      document.body.style.cursor = '';
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      headRef.current = { x: e.clientX, y: e.clientY };
      if (!active) setActive(true);
    }
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [active]);

  useEffect(() => {
    function handleOver(e: MouseEvent) {
      let el = e.target as Element | null;
      setHovering(isClickable(el));
    }
    function handleOut() {
      setHovering(false);
    }
    window.addEventListener('mouseover', handleOver);
    window.addEventListener('mouseout', handleOut);
    return () => {
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseout', handleOut);
    };
  }, []);

  // Smoothly interpolate colorLerp for subtle color transitions
  useEffect(() => {
    let anim: number;
    function lerpColor() {
      setColorLerp(l => {
        const target = hovering ? 1 : 0;
        const speed = 0.08;
        if (Math.abs(l - target) < 0.01) return target;
        return l + (target - l) * speed;
      });
      anim = requestAnimationFrame(lerpColor);
    }
    anim = requestAnimationFrame(lerpColor);
    return () => cancelAnimationFrame(anim);
  }, [hovering]);

  useEffect(() => {
    function animate() {
      const head = headRef.current;
      if (tailRefs.current.length === 0) {
        tailRefs.current = Array.from({ length: TRAIL_LENGTH }, () => ({ x: head.x, y: head.y }));
      } else {
        let prev = { x: head.x, y: head.y };
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          const t = tailRefs.current[i];
          tailRefs.current[i] = {
            x: t.x + (prev.x - t.x) * INTERPOLATION,
            y: t.y + (prev.y - t.y) * INTERPOLATION
          };
          prev = tailRefs.current[i];
        }
      }
      forceRerender(v => v + 1);
      animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  if (!active) return null;

  const head = headRef.current;

  // Interpolate between gold and bluegreen colors for smooth transition
  function lerpColorArr(arr1: string[], arr2: string[], t: number) {
    // t: 0 = arr1, 1 = arr2
    return arr1.map((c1, i) => {
      const c2 = arr2[i];
      // Parse rgba(r,g,b,a)
      const m = c1.match(/rgba?\(([^)]+)\)/);
      const n = c2.match(/rgba?\(([^)]+)\)/);
      if (!m || !n) return c1;
      const a1 = m[1].split(',').map(Number);
      const a2 = n[1].split(',').map(Number);
      const r = Math.round(a1[0] + (a2[0] - a1[0]) * t);
      const g = Math.round(a1[1] + (a2[1] - a1[1]) * t);
      const b = Math.round(a1[2] + (a2[2] - a1[2]) * t);
      const a = (a1[3] ?? 1) + ((a2[3] ?? 1) - (a1[3] ?? 1)) * t;
      return `rgba(${r},${g},${b},${a})`;
    });
  }

  const TRAIL_COLORS = lerpColorArr(TRAIL_COLORS_GOLD, TRAIL_COLORS_BLUEGREEN, colorLerp);
  const HEAD_GRADIENT = colorLerp < 0.5
    ? `radial-gradient(circle at 40% 40%, #fff 60%, #ff9800 100%)`
    : `radial-gradient(circle at 40% 40%, #fff 60%, #00ffd0 100%)`;
  const HEAD_SHADOW = colorLerp < 0.5
    ? '0 0 32px 8px #ff9800cc, 0 0 64px 16px #fff7'
    : '0 0 32px 8px #00ffd0cc, 0 0 64px 16px #fff7';

  // Moon mode: gray/white with dark spots
  const MOON_BASE = 'radial-gradient(circle at 40% 40%, #fff 60%, #b0b0b0 100%)';
  const MOON_SHADOW = '0 0 32px 8px #b0b0b0cc, 0 0 64px 16px #fff7';
  // Generate random dark spots for the moon
  function renderMoonSpots(x: number, y: number) {
    // Fixed spots for consistency
    const spots = [
      { dx: -2, dy: 2, r: 2, o: 0.18 },
      { dx: 3, dy: -1, r: 1.5, o: 0.22 },
      { dx: 1, dy: 3, r: 1.2, o: 0.15 },
      { dx: -3, dy: -2, r: 1.7, o: 0.13 },
      { dx: 0, dy: -3, r: 1.1, o: 0.19 },
    ];
    return spots.map((s, i) => (
      <div
        key={i}
        style={{
          position: 'fixed',
          left: x + s.dx - s.r,
          top: y + s.dy - s.r,
          width: s.r * 2,
          height: s.r * 2,
          borderRadius: '50%',
          background: '#444',
          opacity: s.o,
          pointerEvents: 'none',
          zIndex: 10001,
          filter: 'blur(0.5px)',
        }}
      />
    ));
  }

  // Render tail segments
  const tail = [];
  for (let i = 1; i < TRAIL_LENGTH; i++) {
    const t = tailRefs.current[i] || head;
    const opacity = 0.08 + 0.5 * (1 - i / TRAIL_LENGTH); // softer
    const color = TRAIL_COLORS[i % TRAIL_COLORS.length];
    tail.push(
      <div
        key={i}
        style={{
          position: 'fixed',
          left: t.x - TAIL_SIZE / 2,
          top: t.y - TAIL_SIZE / 2,
          width: TAIL_SIZE,
          height: TAIL_SIZE,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 48px 24px ${color}, 0 0 0 2px #222b` , // more blur, dark outline
          opacity,
          pointerEvents: 'none',
          zIndex: 9999,
          filter: 'blur(8px)', // more blur
          transition: 'background 0.3s, box-shadow 0.3s',
        }}
      />
    );
  }

  // Glowing star head or moon
  return (
    <>
      {tail}
      {isDark ? (
        <>
          <div
            style={{
              position: 'fixed',
              left: head.x - HEAD_SIZE / 2,
              top: head.y - HEAD_SIZE / 2,
              width: HEAD_SIZE,
              height: HEAD_SIZE,
              borderRadius: '50%',
              background: MOON_BASE,
              boxShadow: `${MOON_SHADOW}, 0 0 0 2px #222b`,
              pointerEvents: 'none',
              zIndex: 10000,
              filter: 'blur(2.5px)',
              transition: 'background 0.3s, box-shadow 0.3s',
            }}
          />
          {renderMoonSpots(head.x, head.y)}
        </>
      ) : (
        <div
          style={{
            position: 'fixed',
            left: head.x - HEAD_SIZE / 2,
            top: head.y - HEAD_SIZE / 2,
            width: HEAD_SIZE,
            height: HEAD_SIZE,
            borderRadius: '50%',
            background: HEAD_GRADIENT,
            boxShadow: `${HEAD_SHADOW}, 0 0 0 2px #222b`,
            pointerEvents: 'none',
            zIndex: 10000,
            filter: 'blur(2.5px)',
            transition: 'background 0.3s, box-shadow 0.3s',
          }}
        />
      )}
    </>
  );
};

export default GoldenPointer; 