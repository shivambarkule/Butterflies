import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Calculator, 
  PenTool, 
  Star, 
  Cloud, 
  CloudRain,
  Sparkles,
  Zap,
  Heart,
  Brain,
  Atom,
  Code,
  Music,
  Palette,
  Camera,
  Globe,
  Rocket,
  Target,
  Trophy,
  Crown,
  Gem,
  Diamond,
  Flower,
  Trees,
  Sun,
  Moon,
  CloudLightning,
  CloudSnow,
  Wind,
  Droplets,
  Waves,
  Mountain,
  Leaf,
  Bug,
  Bird,
  Fish,
  Lightbulb,
  Key,
  Lock,
  Shield,
  Sword,
  Castle,
  Flag,
  Compass,
  Map,
  Navigation,
  Home,
  Settings,
  Plus,
  Minus,
  Edit,
  Trash,
  Eye,
  EyeOff,
  Share,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Timer,
  Hourglass,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarRange,
  CalendarSearch,
  CalendarClock,
  CalendarHeart,
  X,
  MessageCircle,
  Phone,
  Video,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera as CameraIcon,
  CameraOff,
  Monitor,
  MonitorOff,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Bell,
  BellOff,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Link,
  Unlink,
  Lock as LockIcon,
  Unlock,
  Key as KeyIcon,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  UserCog,
  UserCheck2,
  UserX2,
  Users2,
  UserRound,
  UserSquare,
  UserCircle,
  Flame
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface FloatingElement {
  id: string;
  icon: React.ComponentType<any>;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  speed: number;
  direction: { x: number; y: number };
  type: 'book' | 'calculator' | 'pen' | 'star' | 'particle' | 'cloud' | 'constellation';
  color: string;
  size: number;
  isInteractive: boolean;
  clickCount: number;
  lastClick: number;
  animation: 'float' | 'bounce' | 'spin' | 'pulse' | 'wave' | 'rainbow' | 'sparkle';
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  symbol: string;
  type: 'math' | 'letter' | 'number' | 'emoji';
}

interface Constellation {
  id: string;
  stars: { x: number; y: number; brightness: number }[];
  connections: { from: number; to: number }[];
  pattern: string;
  isVisible: boolean;
  animation: 'twinkle' | 'connect' | 'orbit' | 'pulse';
}

interface InteractiveBackgroundsProps {
  isActive: boolean;
  intensity?: 'low' | 'medium' | 'high';
  theme?: 'study' | 'creative' | 'nature' | 'space' | 'ocean' | 'forest' | 'desert' | 'arctic';
}

export const InteractiveBackgrounds: React.FC<InteractiveBackgroundsProps> = ({
  isActive,
  intensity = 'medium',
  theme = 'study'
}) => {
  const { isDark } = useTheme();
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [clouds, setClouds] = useState<FloatingElement[]>([]);
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const [isRaining, setIsRaining] = useState(false);
  const [rainDrops, setRainDrops] = useState<{ x: number; y: number; speed: number }[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [interactionCount, setInteractionCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Theme configurations
  const themeConfigs = {
    study: {
      elements: [BookOpen, Calculator, PenTool, Brain, Lightbulb, Target, Trophy],
      particles: ['∑', 'π', '∞', '∫', '√', '±', '×', '÷', '=', '≠', '≤', '≥'],
      colors: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'],
      gradient: ['#1E293B', '#334155', '#475569', '#64748B']
    },
    creative: {
      elements: [Palette, Music, Camera, Sparkles, Heart, Gem, Diamond],
      particles: ['🎨', '🎵', '📷', '✨', '💖', '💎', '🌟', '🎭', '🎪', '🎯'],
      colors: ['#EC4899', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#8B5CF6'],
      gradient: ['#581C87', '#7C3AED', '#A855F7', '#C084FC']
    },
    nature: {
      elements: [Trees, Flower, Leaf, Bird, Fish, Bug],
      particles: ['🌿', '🌸', '🍃', '🦋', '🐦', '🐠', '🐝', '🌺', '🌻', '🌼'],
      colors: ['#16A34A', '#22C55E', '#84CC16', '#EAB308', '#F59E0B', '#F97316'],
      gradient: ['#064E3B', '#065F46', '#047857', '#059669']
    },
    space: {
      elements: [Star, Globe, Rocket, Atom, Globe, Moon, Sun],
      particles: ['⭐', '🌍', '🚀', '⚛️', '🌎', '🌙', '☀️', '🌌', '🪐', '💫'],
      colors: ['#1E293B', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1'],
      gradient: ['#0F172A', '#1E293B', '#334155', '#475569']
    },
    ocean: {
      elements: [Waves, Fish, Droplets, Globe, CloudRain],
      particles: ['🌊', '🐠', '💧', '🌊', '🌍', '☔', '🌧️', '🌊', '🐋', '🐙'],
      colors: ['#0EA5E9', '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63'],
      gradient: ['#0C4A6E', '#075985', '#0369A1', '#0284C7']
    },
    forest: {
      elements: [Trees, Leaf, Bug, Bird, Flower, Mountain],
      particles: ['🌲', '🍃', '🐛', '🐦', '🦋', '🌸', '⛰️', '🌿', '🌳', '🍄'],
      colors: ['#166534', '#16A34A', '#22C55E', '#84CC16', '#EAB308', '#F59E0B'],
      gradient: ['#14532D', '#166534', '#16A34A', '#22C55E']
    },
    desert: {
      elements: [Sun, Mountain, Wind, Cloud],
      particles: ['☀️', '⛰️', '🌵', '🏜️', '💨', '☁️', '🌅', '🌄', '🏔️', '🌋'],
      colors: ['#F59E0B', '#F97316', '#EA580C', '#DC2626', '#B91C1C', '#991B1B'],
      gradient: ['#92400E', '#B45309', '#D97706', '#F59E0B']
    },
    arctic: {
      elements: [CloudSnow, Wind, Mountain, Cloud],
      particles: ['❄️', '🧊', '🌨️', '💨', '⛰️', '☁️', '🌨️', '❄️', '🏔️', '🌊'],
      colors: ['#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#475569'],
      gradient: ['#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1']
    }
  };

  const currentConfig = themeConfigs[theme];

  // Generate floating elements
  const generateFloatingElements = useCallback(() => {
    const elements: FloatingElement[] = [];
    const elementCount = intensity === 'low' ? 5 : intensity === 'medium' ? 12 : 20;

    for (let i = 0; i < elementCount; i++) {
      const IconComponent = currentConfig.elements[Math.floor(Math.random() * currentConfig.elements.length)];
      const color = currentConfig.colors[Math.floor(Math.random() * currentConfig.colors.length)];
      
      elements.push({
        id: `element-${i}`,
        icon: IconComponent,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1,
        opacity: 0.3 + Math.random() * 0.7,
        speed: 0.5 + Math.random() * 2,
        direction: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        },
        type: ['book', 'calculator', 'pen', 'star'][Math.floor(Math.random() * 4)] as any,
        color,
        size: 20 + Math.random() * 40,
        isInteractive: Math.random() > 0.7,
        clickCount: 0,
        lastClick: 0,
        animation: ['float', 'bounce', 'spin', 'pulse', 'wave', 'rainbow', 'sparkle'][Math.floor(Math.random() * 7)] as any
      });
    }

    setFloatingElements(elements);
  }, [intensity, theme, currentConfig]);

  // Generate particles
  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    const particleCount = intensity === 'low' ? 10 : intensity === 'medium' ? 25 : 50;

    for (let i = 0; i < particleCount; i++) {
      const symbol = currentConfig.particles[Math.floor(Math.random() * currentConfig.particles.length)];
      const color = currentConfig.colors[Math.floor(Math.random() * currentConfig.colors.length)];
      
      newParticles.push({
        id: `particle-${i}`,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 8 + Math.random() * 16,
        color,
        opacity: 0.3 + Math.random() * 0.7,
        life: 100 + Math.random() * 200,
        maxLife: 100 + Math.random() * 200,
        symbol,
        type: ['math', 'letter', 'number', 'emoji'][Math.floor(Math.random() * 4)] as any
      });
    }

    setParticles(newParticles);
  }, [intensity, theme, currentConfig]);

  // Generate constellations
  const generateConstellations = useCallback(() => {
    const constellations: Constellation[] = [];
    const constellationCount = intensity === 'low' ? 2 : intensity === 'medium' ? 4 : 6;

          const patterns = [
        { name: 'Big Dipper', stars: 7, connections: [{from: 0, to: 1}, {from: 1, to: 2}, {from: 2, to: 3}, {from: 3, to: 4}, {from: 4, to: 5}, {from: 5, to: 6}] },
        { name: 'Little Dipper', stars: 7, connections: [{from: 0, to: 1}, {from: 1, to: 2}, {from: 2, to: 3}, {from: 3, to: 4}, {from: 4, to: 5}, {from: 5, to: 6}] },
        { name: 'Orion', stars: 8, connections: [{from: 0, to: 1}, {from: 1, to: 2}, {from: 2, to: 3}, {from: 3, to: 4}, {from: 4, to: 5}, {from: 5, to: 6}, {from: 6, to: 7}] },
        { name: 'Cassiopeia', stars: 5, connections: [{from: 0, to: 1}, {from: 1, to: 2}, {from: 2, to: 3}, {from: 3, to: 4}] },
        { name: 'Ursa Major', stars: 7, connections: [{from: 0, to: 1}, {from: 1, to: 2}, {from: 2, to: 3}, {from: 3, to: 4}, {from: 4, to: 5}, {from: 5, to: 6}] },
        { name: 'Ursa Minor', stars: 7, connections: [{from: 0, to: 1}, {from: 1, to: 2}, {from: 2, to: 3}, {from: 3, to: 4}, {from: 4, to: 5}, {from: 5, to: 6}] }
      ];

    for (let i = 0; i < constellationCount; i++) {
      const pattern = patterns[i % patterns.length];
      const stars = [];
      
      for (let j = 0; j < pattern.stars; j++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          brightness: 0.5 + Math.random() * 0.5
        });
      }

      constellations.push({
        id: `constellation-${i}`,
        stars,
        connections: pattern.connections,
        pattern: pattern.name,
        isVisible: Math.random() > 0.3,
        animation: ['twinkle', 'connect', 'orbit', 'pulse'][Math.floor(Math.random() * 4)] as any
      });
    }

    setConstellations(constellations);
  }, [intensity]);

  // Generate clouds
  const generateClouds = useCallback(() => {
    const clouds: FloatingElement[] = [];
    const cloudCount = intensity === 'low' ? 3 : intensity === 'medium' ? 6 : 10;

    for (let i = 0; i < cloudCount; i++) {
      clouds.push({
        id: `cloud-${i}`,
        icon: Math.random() > 0.7 ? CloudRain : Cloud,
        x: Math.random() * window.innerWidth,
        y: 50 + Math.random() * 200,
        rotation: 0,
        scale: 1 + Math.random() * 2,
        opacity: 0.4 + Math.random() * 0.4,
        speed: 0.2 + Math.random() * 0.8,
        direction: { x: 1, y: 0 },
        type: 'cloud',
        color: '#E2E8F0',
        size: 60 + Math.random() * 80,
        isInteractive: true,
        clickCount: 0,
        lastClick: 0,
        animation: 'float'
      });
    }

    setClouds(clouds);
  }, [intensity]);

  // Generate dynamic gradients
  const generateGradients = useCallback(() => {
    setGradientColors(currentConfig.gradient);
  }, [currentConfig]);

  // Handle mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Handle element clicks
  const handleElementClick = useCallback((element: FloatingElement) => {
    if (Date.now() - element.lastClick < 1000) return; // Prevent spam

    setInteractionCount(prev => prev + 1);
    
    // Update element
    setFloatingElements(prev => prev.map(el => 
      el.id === element.id 
        ? { ...el, clickCount: el.clickCount + 1, lastClick: Date.now() }
        : el
    ));

    // Special effects based on element type
    if (element.type === 'cloud') {
      setIsRaining(true);
      setTimeout(() => setIsRaining(false), 3000);
    }

    // Create particle burst
    const burstParticles: Particle[] = [];
    for (let i = 0; i < 10; i++) {
      burstParticles.push({
        id: `burst-${Date.now()}-${i}`,
        x: element.x,
        y: element.y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        size: 5 + Math.random() * 10,
        color: element.color,
        opacity: 1,
        life: 50,
        maxLife: 50,
        symbol: '✨',
        type: 'emoji'
      });
    }
    setParticles(prev => [...prev, ...burstParticles]);
  }, []);

  // Handle cloud clicks for rain
  const handleCloudClick = useCallback((cloud: FloatingElement) => {
    if (Date.now() - cloud.lastClick < 2000) return;

    setIsRaining(true);
    setInteractionCount(prev => prev + 1);

    // Generate rain drops
    const drops = [];
    for (let i = 0; i < 50; i++) {
      drops.push({
        x: cloud.x + (Math.random() - 0.5) * cloud.size,
        y: cloud.y + cloud.size / 2,
        speed: 2 + Math.random() * 3
      });
    }
    setRainDrops(drops);

    setTimeout(() => {
      setIsRaining(false);
      setRainDrops([]);
    }, 3000);

    setClouds(prev => prev.map(c => 
      c.id === cloud.id 
        ? { ...c, clickCount: c.clickCount + 1, lastClick: Date.now() }
        : c
    ));
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    // Animate floating elements
    setFloatingElements(prev => prev.map(element => {
      const newX = element.x + element.direction.x * element.speed;
      const newY = element.y + element.direction.y * element.speed;

      // Bounce off walls
      let newDirectionX = element.direction.x;
      let newDirectionY = element.direction.y;

      if (newX <= 0 || newX >= window.innerWidth) {
        newDirectionX = -element.direction.x;
      }
      if (newY <= 0 || newY >= window.innerHeight) {
        newDirectionY = -element.direction.y;
      }

      return {
        ...element,
        x: Math.max(0, Math.min(window.innerWidth, newX)),
        y: Math.max(0, Math.min(window.innerHeight, newY)),
        direction: { x: newDirectionX, y: newDirectionY },
        rotation: element.rotation + (element.animation === 'spin' ? 2 : 0)
      };
    }));

    // Animate particles
    setParticles(prev => prev
      .map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1,
        opacity: particle.life / particle.maxLife
      }))
      .filter(particle => particle.life > 0)
    );

    // Animate clouds
    setClouds(prev => prev.map(cloud => {
      const newX = cloud.x + cloud.direction.x * cloud.speed;
      return {
        ...cloud,
        x: newX > window.innerWidth + 100 ? -100 : newX
      };
    }));

    // Animate rain drops
    if (isRaining) {
      setRainDrops(prev => prev
        .map(drop => ({
          ...drop,
          y: drop.y + drop.speed
        }))
        .filter(drop => drop.y < window.innerHeight)
      );
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isRaining]);

  // Initialize
  useEffect(() => {
    if (isActive) {
      generateFloatingElements();
      generateParticles();
      generateConstellations();
      generateClouds();
      generateGradients();
      window.addEventListener('mousemove', handleMouseMove);
      animate();
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, intensity, theme, generateFloatingElements, generateParticles, generateConstellations, generateClouds, generateGradients, handleMouseMove, animate]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Gradient Background */}
      <div 
        className="absolute inset-0 transition-all duration-5000"
        style={{
          background: `linear-gradient(45deg, ${gradientColors.join(', ')})`,
          filter: `hue-rotate(${interactionCount * 10}deg)`
        }}
      />

      {/* Floating Elements */}
      <AnimatePresence>
        {floatingElements.map((element) => {
          const IconComponent = element.icon;
          return (
            <motion.div
              key={element.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: element.x,
                top: element.y,
                transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
                opacity: element.opacity,
                color: element.color,
                fontSize: element.size
              }}
              onClick={() => handleElementClick(element)}
              whileHover={{ 
                scale: element.scale * 1.2,
                rotate: element.rotation + 10,
                transition: { duration: 0.2 }
              }}
              animate={{
                y: element.animation === 'bounce' ? [0, -20, 0] : 0,
                scale: element.animation === 'pulse' ? [element.scale, element.scale * 1.1, element.scale] : element.scale,
                rotate: element.animation === 'spin' ? [0, 360] : element.rotation
              }}
              transition={{
                duration: element.animation === 'bounce' ? 2 : element.animation === 'pulse' ? 1 : element.animation === 'spin' ? 3 : 0,
                repeat: element.animation === 'bounce' || element.animation === 'pulse' || element.animation === 'spin' ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <IconComponent size={element.size} />
              {element.clickCount > 0 && (
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -20 }}
                  exit={{ opacity: 0 }}
                  style={{ color: element.color }}
                >
                  +{element.clickCount}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Interactive Clouds */}
      <AnimatePresence>
        {clouds.map((cloud) => {
          const IconComponent = cloud.icon;
          return (
            <motion.div
              key={cloud.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: cloud.x,
                top: cloud.y,
                transform: `scale(${cloud.scale})`,
                opacity: cloud.opacity,
                color: cloud.color,
                fontSize: cloud.size
              }}
              onClick={() => handleCloudClick(cloud)}
              whileHover={{ 
                scale: cloud.scale * 1.1,
                transition: { duration: 0.2 }
              }}
              animate={{
                y: [0, -10, 0],
                x: [0, 5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <IconComponent size={cloud.size} />
              {cloud.clickCount > 0 && (
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -20 }}
                  exit={{ opacity: 0 }}
                  style={{ color: cloud.color }}
                >
                  ☔ {cloud.clickCount}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Rain Drops */}
      <AnimatePresence>
        {isRaining && rainDrops.map((drop, index) => (
          <motion.div
            key={`rain-${index}`}
            className="absolute pointer-events-none"
            style={{
              left: drop.x,
              top: drop.y,
              width: 2,
              height: 20,
              background: 'linear-gradient(to bottom, transparent, #60A5FA)',
              borderRadius: '50%'
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </AnimatePresence>

      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none text-center"
            style={{
              left: particle.x,
              top: particle.y,
              fontSize: particle.size,
              color: particle.color,
              opacity: particle.opacity,
              transform: `translate(-50%, -50%)`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: particle.opacity,
              scale: 1,
              x: particle.vx * 10,
              y: particle.vy * 10
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1 }}
          >
            {particle.symbol}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Constellations */}
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {constellations.map((constellation) => (
          <g key={constellation.id}>
            {/* Stars */}
            {constellation.stars.map((star, index) => (
              <motion.circle
                key={`star-${constellation.id}-${index}`}
                cx={star.x}
                cy={star.y}
                r={3 + star.brightness * 4}
                fill="#FCD34D"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: constellation.isVisible ? 0.8 : 0,
                  scale: constellation.isVisible ? 1 : 0,
                  r: constellation.animation === 'twinkle' ? [3, 6, 3] : 3 + star.brightness * 4
                }}
                transition={{
                  duration: constellation.animation === 'twinkle' ? 2 : 1,
                  repeat: constellation.animation === 'twinkle' ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Connections */}
            {constellation.connections.map((connection, index) => {
              const fromStar = constellation.stars[connection.from];
              const toStar = constellation.stars[connection.to];
              
              return (
                <motion.line
                  key={`connection-${constellation.id}-${index}`}
                  x1={fromStar.x}
                  y1={fromStar.y}
                  x2={toStar.x}
                  y2={toStar.y}
                  stroke="#FCD34D"
                  strokeWidth={1}
                  strokeOpacity={0.6}
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: constellation.isVisible ? 1 : 0,
                    opacity: constellation.isVisible ? 0.6 : 0
                  }}
                  transition={{
                    duration: 2,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </g>
        ))}
      </svg>

      {/* Mouse Trail Effect */}
      <motion.div
        className="absolute pointer-events-none w-4 h-4 rounded-full"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          background: `radial-gradient(circle, ${currentConfig.colors[0]}40, transparent)`,
          zIndex: 10
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Interaction Counter */}
      <motion.div
        className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm font-bold pointer-events-none"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Interactions: {interactionCount}
      </motion.div>
    </div>
  );
}; 