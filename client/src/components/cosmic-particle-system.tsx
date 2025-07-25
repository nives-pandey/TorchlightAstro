import { useEffect, useRef } from 'react';

interface CosmicParticleSystemProps {
  width: number;
  height: number;
  particleCount?: number;
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  brightness: number;
  trail: { x: number; y: number; alpha: number }[];
}

export default function CosmicParticleSystem({
  width,
  height,
  particleCount = 200,
  interactive = true
}: CosmicParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    initializeParticles();
    startAnimation();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount]);

  const initializeParticles = () => {
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: getCosmicColor(),
        brightness: Math.random() * 0.8 + 0.2,
        trail: []
      });
    }

    particlesRef.current = particles;
  };

  const getCosmicColor = (): string => {
    const colors = [
      '#ffffff', // White stars
      '#ffffcc', // Warm white
      '#ffddaa', // Yellow
      '#ffaa77', // Orange
      '#aaccff', // Blue-white
      '#ccaaff', // Purple
      '#ffcccc'  // Red
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const updateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    timeRef.current += 0.01;

    particlesRef.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;

      // Gravitational effect towards mouse if interactive
      if (interactive) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150 * 0.002;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      }

      // Apply cosmic drift
      particle.vx += Math.sin(timeRef.current + index) * 0.001;
      particle.vy += Math.cos(timeRef.current + index * 0.5) * 0.001;

      // Wrap around edges
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
      if (particle.z < 0) particle.z = 1000;
      if (particle.z > 1000) particle.z = 0;

      // Update trail
      particle.trail.push({ x: particle.x, y: particle.y, alpha: 0.8 });
      if (particle.trail.length > 10) {
        particle.trail.shift();
      }

      // Update trail alpha
      particle.trail.forEach((point, i) => {
        point.alpha = (i / particle.trail.length) * 0.5;
      });

      // Brightness variation
      particle.brightness = 0.3 + Math.sin(timeRef.current * 2 + index) * 0.3;
    });
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with fade effect
    ctx.fillStyle = 'rgba(0, 0, 8, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Render particles
    particlesRef.current.forEach(particle => {
      // Calculate 3D perspective
      const perspective = 500 / (500 + particle.z);
      const x = particle.x * perspective + (width / 2) * (1 - perspective);
      const y = particle.y * perspective + (height / 2) * (1 - perspective);
      const size = particle.size * perspective;

      // Render trail
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      particle.trail.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();

      // Render particle with glow
      ctx.globalAlpha = particle.brightness;
      
      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core
      ctx.globalAlpha = particle.brightness * 1.5;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  };

  const animate = () => {
    updateParticles();
    render();
    animationRef.current = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (animationRef.current) return;
    animate();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        pointerEvents: interactive ? 'auto' : 'none'
      }}
    />
  );
}