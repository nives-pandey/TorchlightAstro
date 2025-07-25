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
    }
    return () => stopAnimation();
  }, [isAnimating, planets, aspects, zoom, showAspects, showOrbits, selectedAspects, viewMode, aspectStrength]);

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

    // Clear canvas with cosmic background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    gradient.addColorStop(0, '#0a0a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawZodiacWheel = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, maxRadius: number) => {
    const zodiacSigns = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const zodiacColors = [
      '#FF4500', '#8FBC8F', '#FFD700', '#87CEEB', '#FF6347', '#DDA0DD',
      '#FFB6C1', '#DC143C', '#9370DB', '#2E8B57', '#00CED1', '#4682B4'
    ];

    // Draw zodiac sectors
    for (let i = 0; i < 12; i++) {
      const startAngle = (i * 30 - 90) * Math.PI / 180;
      const endAngle = ((i + 1) * 30 - 90) * Math.PI / 180;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius * 1.1, startAngle, endAngle);
      ctx.closePath();
      
      const gradient = ctx.createRadialGradient(centerX, centerY, maxRadius * 0.8, centerX, centerY, maxRadius * 1.1);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(1, zodiacColors[i] + '20');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw zodiac sign
      const signAngle = (i * 30 + 15 - 90) * Math.PI / 180;
      const signX = centerX + Math.cos(signAngle) * maxRadius * 1.15;
      const signY = centerY + Math.sin(signAngle) * maxRadius * 1.15;
      
      ctx.fillStyle = zodiacColors[i];
      ctx.font = 'bold 20px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(zodiacSigns[i], signX, signY);
    }

    // Draw degree markers
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 360; i += 30) {
      const angle = (i - 90) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * maxRadius * 0.95, centerY + Math.sin(angle) * maxRadius * 0.95);
      ctx.lineTo(centerX + Math.cos(angle) * maxRadius * 1.05, centerY + Math.sin(angle) * maxRadius * 1.05);
      ctx.stroke();
    }
  };

  const drawOrbitalPaths = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, maxRadius: number) => {
    const distances = planets.map(p => p.distance);
    const uniqueDistances = Array.from(new Set(distances)).sort();
    
    uniqueDistances.forEach(distance => {
      const radius = maxRadius * (0.8 + distance * 0.05);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  const drawAspects = (ctx: CanvasRenderingContext2D, calculatedPlanets: Planet[]) => {
    aspects.forEach(aspect => {
      if (!selectedAspects.includes(aspect.type) || aspect.strength < aspectStrength[0]) return;

      const planet1 = calculatedPlanets.find(p => p.name === aspect.planet1);
      const planet2 = calculatedPlanets.find(p => p.name === aspect.planet2);

      if (planet1 && planet2 && planet1.x && planet1.y && planet2.x && planet2.y) {
        // Draw aspect line with glow effect
        const gradient = ctx.createLinearGradient(planet1.x, planet1.y, planet2.x, planet2.y);
        gradient.addColorStop(0, aspect.color + '80');
        gradient.addColorStop(0.5, aspect.color + 'FF');
        gradient.addColorStop(1, aspect.color + '80');

        // Glow effect
        ctx.shadowColor = aspect.color;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(1, aspect.strength * 4);
        
        ctx.beginPath();
        ctx.moveTo(planet1.x, planet1.y);
        
        // Create curved aspect lines for visual appeal
        const midX = (planet1.x + planet2.x) / 2;
        const midY = (planet1.y + planet2.y) / 2;
        const controlX = midX + (Math.random() - 0.5) * 20;
        const controlY = midY + (Math.random() - 0.5) * 20;
        
        ctx.quadraticCurveTo(controlX, controlY, planet2.x, planet2.y);
        ctx.stroke();
        
        ctx.shadowBlur = 0;

        // Draw aspect symbol at midpoint
        const aspectType = aspectTypes.find(a => a.name === aspect.type);
        if (aspectType) {
          ctx.fillStyle = aspect.color;
          ctx.font = '12px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(aspectType.symbol, midX, midY);
        }
      }
    });
  };

  const drawPlanets = (ctx: CanvasRenderingContext2D, calculatedPlanets: Planet[]) => {
    calculatedPlanets.forEach(planet => {
      if (!planet.x || !planet.y) return;

      const size = planet.size * zoom * (viewMode === '3d' ? (1 + (planet.z || 0) * 0.01) : 1);
      
      // Draw planet glow
      const glowGradient = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, size * 2);
      glowGradient.addColorStop(0, planet.color + 'FF');
      glowGradient.addColorStop(0.5, planet.color + '80');
      glowGradient.addColorStop(1, planet.color + '00');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, size * 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw planet body
      const planetGradient = ctx.createRadialGradient(
        planet.x - size * 0.3, 
        planet.y - size * 0.3, 
        0, 
        planet.x, 
        planet.y, 
        size
      );
      planetGradient.addColorStop(0, '#FFFFFF');
      planetGradient.addColorStop(0.3, planet.color);
      planetGradient.addColorStop(1, '#000000');
      
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
    <div className="space-y-6">
      {/* Controls Panel */}
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <Orbit className="w-5 h-5" />
            Advanced Cosmic Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* View Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Animation</label>
              <Switch checked={isAnimating} onCheckedChange={setIsAnimating} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Aspects</label>
              <Switch checked={showAspects} onCheckedChange={setShowAspects} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Orbits</label>
              <Switch checked={showOrbits} onCheckedChange={setShowOrbits} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Labels</label>
              <Switch checked={showLabels} onCheckedChange={setShowLabels} />
            </div>
          </div>

          {/* Zoom Control */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Zoom Level</label>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}>
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
              <Button size="sm" variant="outline" onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Aspect Strength Filter */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Minimum Aspect Strength</label>
            <Slider
              value={aspectStrength}
              onValueChange={setAspectStrength}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={viewMode === '2d' ? 'default' : 'outline'}
              onClick={() => setViewMode('2d')}
            >
              2D View
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === '3d' ? 'default' : 'outline'}
              onClick={() => setViewMode('3d')}
            >
              3D View
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Aspect Type Filters */}
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400">Aspect Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {aspectTypes.map(aspectType => (
              <Button
                key={aspectType.name}
                size="sm"
                variant={selectedAspects.includes(aspectType.name) ? 'default' : 'outline'}
                onClick={() => toggleAspectType(aspectType.name)}
                className="flex items-center gap-2"
                style={{
                  backgroundColor: selectedAspects.includes(aspectType.name) ? aspectType.color + '40' : 'transparent',
                  borderColor: aspectType.color + '60',
                  color: selectedAspects.includes(aspectType.name) ? '#FFFFFF' : aspectType.color
                }}
              >
                <span>{aspectType.symbol}</span>
                <span className="text-xs capitalize">{aspectType.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Visualization */}
      <Card className="bg-slate-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Advanced Planetary Aspect Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full h-auto border-0 rounded-lg"
            style={{ background: 'transparent' }}
          />
        </CardContent>
      </Card>

      {/* Statistics Panel */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{planets.length}</div>
            <div className="text-sm text-gray-400">Active Planets</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-green-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {aspects.filter(a => selectedAspects.includes(a.type) && a.strength >= aspectStrength[0]).length}
            </div>
            <div className="text-sm text-gray-400">Visible Aspects</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{Math.round(zoom * 100)}%</div>
            <div className="text-sm text-gray-400">Zoom Level</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedPlanetaryAspects;