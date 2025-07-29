import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Orbit, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  EyeOff, 
  Sparkles,
  Circle,
  Triangle,
  Square,
  Hexagon
} from 'lucide-react';

interface Planet {
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  color: string;
  size: number;
  speed: number;
  x?: number;
  y?: number;
  z?: number;
}

interface Aspect {
  planet1: string;
  planet2: string;
  angle: number;
  type: string;
  orb: number;
  strength: number;
  color: string;
}

interface AdvancedPlanetaryAspectsProps {
  planets: Planet[];
  aspects: Aspect[];
  width?: number;
  height?: number;
}

const AdvancedPlanetaryAspects: React.FC<AdvancedPlanetaryAspectsProps> = ({
  planets,
  aspects,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isAnimating, setIsAnimating] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showAspects, setShowAspects] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedAspects, setSelectedAspects] = useState<string[]>(['conjunction', 'opposition', 'trine', 'square', 'sextile']);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [aspectStrength, setAspectStrength] = useState([0.3]);

  const aspectTypes = [
    { name: 'conjunction', color: '#FF0000', angle: 0, symbol: '☌' },
    { name: 'opposition', color: '#FF4500', angle: 180, symbol: '☍' },
    { name: 'trine', color: '#00FF00', angle: 120, symbol: '△' },
    { name: 'square', color: '#FF1493', angle: 90, symbol: '□' },
    { name: 'sextile', color: '#00CED1', angle: 60, symbol: '⚹' },
    { name: 'quincunx', color: '#9370DB', angle: 150, symbol: '⚺' },
    { name: 'semisextile', color: '#DDA0DD', angle: 30, symbol: '⚻' }
  ];

  useEffect(() => {
    if (isAnimating) {
      startAnimation();
    } else {
      stopAnimation();
      drawChart(); // Draw once when animation stops
    }
    return () => stopAnimation();
  }, [isAnimating, planets, aspects, zoom, showAspects, showOrbits, selectedAspects, viewMode, aspectStrength]);

  // Initial draw when component mounts or data changes
  useEffect(() => {
    console.log('AdvancedPlanetaryAspects - planets:', planets, 'aspects:', aspects);
    if (planets.length > 0) {
      drawChart();
    }
  }, [planets, aspects]);

  const startAnimation = () => {
    const animate = () => {
      setRotation(prev => prev + 0.5);
      drawChart();
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with feminine cosmic background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    gradient.addColorStop(0, '#1a0b2e');
    gradient.addColorStop(0.3, '#2d1b4e');
    gradient.addColorStop(0.6, '#44267a');
    gradient.addColorStop(0.8, '#5b2c87');
    gradient.addColorStop(1, '#6b2c91');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add starfield
    drawStarfield(ctx);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.35 * zoom;

    // Draw zodiac wheel background
    drawZodiacWheel(ctx, centerX, centerY, maxRadius);

    // Calculate planet positions
    const calculatedPlanets = planets.map(planet => {
      const angle = (planet.longitude + rotation) * Math.PI / 180;
      const radius = maxRadius * (0.8 + planet.distance * 0.05);
      
      if (viewMode === '3d') {
        const z = Math.sin(angle * 0.5) * 50;
        const adjustedRadius = radius + z * 0.3;
        return {
          ...planet,
          x: centerX + Math.cos(angle) * adjustedRadius,
          y: centerY + Math.sin(angle) * adjustedRadius,
          z: z
        };
      } else {
        return {
          ...planet,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          z: 0
        };
      }
    });

    // Draw orbital paths
    if (showOrbits) {
      drawOrbitalPaths(ctx, centerX, centerY, maxRadius);
    }

    // Draw aspects first (behind planets)
    if (showAspects) {
      drawAspects(ctx, calculatedPlanets);
    }

    // Draw planets
    drawPlanets(ctx, calculatedPlanets);

    // Draw labels
    if (showLabels) {
      drawLabels(ctx, calculatedPlanets);
    }

    // Draw cosmic effects
    drawCosmicEffects(ctx, centerX, centerY, maxRadius);
  };

  const drawStarfield = (ctx: CanvasRenderingContext2D) => {
    // Feminine starfield with soft, twinkling stars
    const starColors = ['#ffd1dc', '#ffb6c1', '#dda0dd', '#e6e6fa', '#f0e68c', '#ffffff'];
    
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 3 + 0.5;
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      
      // Create twinkling effect
      const alpha = 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.4;
      ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add soft glow
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  const drawZodiacWheel = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, maxRadius: number) => {
    const zodiacSigns = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const zodiacColors = [
      '#ff7eb3', '#ff65a3', '#ff9a8b', '#ffa726', '#ffb74d', '#aed581',
      '#81c784', '#4dd0e1', '#42a5f5', '#ab47bc', '#7e57c2', '#5c6bc0'
    ];

    // Draw elegant zodiac sectors with flowing gradients
    for (let i = 0; i < 12; i++) {
      const startAngle = (i * 30 - 90) * Math.PI / 180;
      const endAngle = ((i + 1) * 30 - 90) * Math.PI / 180;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius * 1.15, startAngle, endAngle);
      ctx.closePath();
      
      const gradient = ctx.createRadialGradient(centerX, centerY, maxRadius * 0.7, centerX, centerY, maxRadius * 1.15);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.7, zodiacColors[i] + '15');
      gradient.addColorStop(1, zodiacColors[i] + '30');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw elegant zodiac sign with soft glow
      const signAngle = (i * 30 + 15 - 90) * Math.PI / 180;
      const signX = centerX + Math.cos(signAngle) * maxRadius * 1.25;
      const signY = centerY + Math.sin(signAngle) * maxRadius * 1.25;
      
      // Add soft glow effect
      ctx.shadowColor = zodiacColors[i];
      ctx.shadowBlur = 8;
      ctx.fillStyle = zodiacColors[i];
      ctx.font = 'bold 24px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(zodiacSigns[i], signX, signY);
      ctx.shadowBlur = 0;
    }

    // Draw delicate degree markers
    ctx.strokeStyle = 'rgba(255, 182, 193, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 360; i += 30) {
      const angle = (i - 90) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * maxRadius * 0.9, centerY + Math.sin(angle) * maxRadius * 0.9);
      ctx.lineTo(centerX + Math.cos(angle) * maxRadius * 1.1, centerY + Math.sin(angle) * maxRadius * 1.1);
      ctx.stroke();
    }
  };

  const drawOrbitalPaths = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, maxRadius: number) => {
    const distances = planets.map(p => p.distance);
    const uniqueDistances = Array.from(new Set(distances)).sort();
    
    uniqueDistances.forEach((distance, index) => {
      const radius = maxRadius * (0.6 + distance * 0.03);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      
      // Flowing orbital paths with gradient strokes
      const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
      gradient.addColorStop(0, 'rgba(255, 192, 203, 0.2)');
      gradient.addColorStop(0.5, 'rgba(221, 160, 221, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 192, 203, 0.2)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 10]);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  };

  const drawAspects = (ctx: CanvasRenderingContext2D, calculatedPlanets: Planet[]) => {
    aspects.forEach(aspect => {
      if (!selectedAspects.includes(aspect.type) || aspect.strength < aspectStrength[0]) return;

      const planet1 = calculatedPlanets.find(p => p.name === aspect.planet1);
      const planet2 = calculatedPlanets.find(p => p.name === aspect.planet2);

      if (planet1 && planet2 && planet1.x && planet1.y && planet2.x && planet2.y) {
        // Draw flowing aspect connections with feminine curves
        const gradient = ctx.createLinearGradient(planet1.x, planet1.y, planet2.x, planet2.y);
        gradient.addColorStop(0, aspect.color + '60');
        gradient.addColorStop(0.5, aspect.color + 'CC');
        gradient.addColorStop(1, aspect.color + '60');

        // Soft flowing glow effect
        ctx.shadowColor = aspect.color;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(2, aspect.strength * 6);
        
        ctx.beginPath();
        ctx.moveTo(planet1.x, planet1.y);
        
        // Create elegant flowing curves
        const midX = (planet1.x + planet2.x) / 2;
        const midY = (planet1.y + planet2.y) / 2;
        const curve = Math.sin(rotation * 0.01) * 30;
        const controlX = midX + curve;
        const controlY = midY + curve * 0.5;
        
        ctx.quadraticCurveTo(controlX, controlY, planet2.x, planet2.y);
        ctx.stroke();
        
        ctx.shadowBlur = 0;

        // Draw elegant aspect symbol with soft background
        const aspectType = aspectTypes.find(a => a.name === aspect.type);
        if (aspectType) {
          // Soft circular background
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.beginPath();
          ctx.arc(midX, midY, 12, 0, Math.PI * 2);
          ctx.fill();
          
          // Glowing symbol
          ctx.shadowColor = aspect.color;
          ctx.shadowBlur = 8;
          ctx.fillStyle = aspect.color;
          ctx.font = 'bold 16px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(aspectType.symbol, midX, midY);
          ctx.shadowBlur = 0;
        }
      }
    });
  };

  const drawPlanets = (ctx: CanvasRenderingContext2D, calculatedPlanets: Planet[]) => {
    calculatedPlanets.forEach(planet => {
      if (!planet.x || !planet.y) return;

      const size = planet.size * zoom * (viewMode === '3d' ? (1 + (planet.z || 0) * 0.01) : 1) * 0.6;
      
      // Draw soft, feminine planet glow
      const glowGradient = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, size * 3);
      glowGradient.addColorStop(0, planet.color + 'FF');
      glowGradient.addColorStop(0.3, planet.color + 'AA');
      glowGradient.addColorStop(0.7, planet.color + '44');
      glowGradient.addColorStop(1, planet.color + '00');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw elegant planet body with soft lighting
      const planetGradient = ctx.createRadialGradient(
        planet.x - size * 0.4, 
        planet.y - size * 0.4, 
        0, 
        planet.x, 
        planet.y, 
        size
      );
      planetGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      planetGradient.addColorStop(0.4, planet.color);
      planetGradient.addColorStop(0.8, planet.color + 'CC');
      planetGradient.addColorStop(1, planet.color + '66');
      
      ctx.fillStyle = planetGradient;
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Draw planet ring (for Saturn-like effect)
      if (planet.name === 'Saturn') {
        ctx.beginPath();
        ctx.ellipse(planet.x, planet.y, size * 1.8, size * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = planet.color + '60';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  const drawLabels = (ctx: CanvasRenderingContext2D, calculatedPlanets: Planet[]) => {
    calculatedPlanets.forEach(planet => {
      if (!planet.x || !planet.y) return;

      const labelX = planet.x + planet.size * zoom + 10;
      const labelY = planet.y - 5;

      // Draw label background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(labelX - 5, labelY - 12, planet.name.length * 8 + 10, 20);

      // Draw label text
      ctx.fillStyle = planet.color;
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(planet.name, labelX, labelY);

      // Draw degree
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px Arial';
      ctx.fillText(`${Math.round(planet.longitude)}°`, labelX, labelY + 12);
    });
  };

  const drawCosmicEffects = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, maxRadius: number) => {
    // Draw energy field
    const energyGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 1.2);
    energyGradient.addColorStop(0, 'rgba(138, 43, 226, 0.1)');
    energyGradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.05)');
    energyGradient.addColorStop(1, 'rgba(25, 25, 112, 0.02)');
    
    ctx.fillStyle = energyGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Draw cosmic particles
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * maxRadius * 1.3;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 80%)`;
      ctx.globalAlpha = Math.random() * 0.3;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const toggleAspectType = (aspectType: string) => {
    setSelectedAspects(prev => 
      prev.includes(aspectType) 
        ? prev.filter(a => a !== aspectType)
        : [...prev, aspectType]
    );
  };

  return (
    <div className="space-y-8">
      {/* Elegant Controls Panel */}
      <Card className="bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-rose-900/40 border-0 rounded-3xl backdrop-blur-md shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-rose-300 flex items-center gap-3 text-xl font-light">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Cosmic Visualization Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          {/* Elegant View Controls */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-2xl border border-pink-300/20">
                <label className="text-rose-200 font-medium">Flowing Animation</label>
                <Switch checked={isAnimating} onCheckedChange={setIsAnimating} />
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-2xl border border-pink-300/20">
                <label className="text-rose-200 font-medium">Sacred Connections</label>
                <Switch checked={showAspects} onCheckedChange={setShowAspects} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-2xl border border-pink-300/20">
                <label className="text-rose-200 font-medium">Celestial Orbits</label>
                <Switch checked={showOrbits} onCheckedChange={setShowOrbits} />
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-2xl border border-pink-300/20">
                <label className="text-rose-200 font-medium">Planet Names</label>
                <Switch checked={showLabels} onCheckedChange={setShowLabels} />
              </div>
            </div>
          </div>

          {/* Elegant Zoom Control */}
          <div className="space-y-4">
            <label className="text-rose-200 font-medium">Cosmic Zoom</label>
            <div className="flex items-center gap-4 p-4 bg-purple-900/20 rounded-2xl border border-pink-300/20">
              <Button 
                size="sm" 
                className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 border-0 hover:from-pink-600 hover:to-rose-600" 
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={0.5}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <Button 
                size="sm" 
                className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 border-0 hover:from-pink-600 hover:to-rose-600" 
                onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Elegant Aspect Strength Filter */}
          <div className="space-y-4">
            <label className="text-rose-200 font-medium">Connection Sensitivity</label>
            <div className="p-4 bg-purple-900/20 rounded-2xl border border-pink-300/20">
              <Slider
                value={aspectStrength}
                onValueChange={setAspectStrength}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-rose-300 mt-2">
                <span>Gentle</span>
                <span>Powerful</span>
              </div>
            </div>
          </div>

          {/* Elegant View Mode */}
          <div className="space-y-3">
            <label className="text-rose-200 font-medium">Dimensional View</label>
            <div className="flex gap-3">
              <Button 
                className={`rounded-full px-6 py-3 transition-all duration-300 ${
                  viewMode === '2d' 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
                    : 'bg-purple-800/40 text-rose-300 border border-pink-300/30 hover:bg-purple-700/50'
                }`}
                onClick={() => setViewMode('2d')}
              >
                Flat View
              </Button>
              <Button 
                className={`rounded-full px-6 py-3 transition-all duration-300 ${
                  viewMode === '3d' 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
                    : 'bg-purple-800/40 text-rose-300 border border-pink-300/30 hover:bg-purple-700/50'
                }`}
                onClick={() => setViewMode('3d')}
              >
                Cosmic Depth
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sacred Aspect Connections */}
      <Card className="bg-gradient-to-br from-rose-900/40 via-purple-900/30 to-pink-900/40 border-0 rounded-3xl backdrop-blur-md shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-rose-300 flex items-center gap-3 text-xl font-light">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <Circle className="w-4 h-4 text-white" />
            </div>
            Sacred Geometric Connections
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {aspectTypes.map(aspectType => (
              <Button
                key={aspectType.name}
                className={`rounded-2xl p-4 h-auto flex flex-col items-center gap-2 transition-all duration-300 ${
                  selectedAspects.includes(aspectType.name)
                    ? 'bg-gradient-to-br from-pink-500/30 to-rose-500/30 border-2 border-pink-400/50 shadow-lg scale-105'
                    : 'bg-purple-900/20 border border-pink-300/20 hover:bg-purple-800/40 hover:border-pink-400/30'
                }`}
                onClick={() => toggleAspectType(aspectType.name)}
              >
                <span className="text-2xl" style={{ color: aspectType.color }}>
                  {aspectType.symbol}
                </span>
                <span className="text-sm text-rose-200 capitalize font-medium">
                  {aspectType.name}
                </span>
                <span className="text-xs text-rose-300/70">
                  {aspectType.angle}°
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Celestial Mandala Visualization */}
      <Card className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/40 border-0 rounded-3xl backdrop-blur-md shadow-2xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-rose-300 flex items-center gap-3 text-xl font-light">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Your Celestial Mandala
          </CardTitle>
          <p className="text-rose-200/70 text-sm mt-2">
            A beautiful representation of your cosmic blueprint and planetary relationships
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border border-pink-300/20">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="w-full h-auto rounded-3xl"
              style={{ background: 'transparent' }}
            />
            {/* Flowing overlay effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 via-transparent to-purple-900/20 pointer-events-none rounded-3xl"></div>
          </div>
        </CardContent>
      </Card>

      {/* Elegant Cosmic Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-0 rounded-2xl backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Circle className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-light text-blue-300 mb-1">{planets.length}</div>
            <div className="text-sm text-blue-200">Celestial Bodies</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-rose-900/30 to-pink-900/30 border-0 rounded-2xl backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Triangle className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-light text-rose-300 mb-1">
              {aspects.filter(a => selectedAspects.includes(a.type) && a.strength >= aspectStrength[0]).length}
            </div>
            <div className="text-sm text-rose-200">Sacred Connections</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-0 rounded-2xl backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-light text-purple-300 mb-1">{Math.round(zoom * 100)}%</div>
            <div className="text-sm text-purple-200">Cosmic Focus</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedPlanetaryAspects;