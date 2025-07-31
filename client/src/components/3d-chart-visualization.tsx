import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Planet, AspectType } from '@shared/schema';
import { RotateCcw, ZoomIn, ZoomOut, Play, Pause, Eye, Orbit } from 'lucide-react';

// Using AspectType from shared schema instead of local interface

interface Chart3DVisualizationProps {
  planets: Planet[];
  aspects: AspectType[];
  chartType: 'natal' | 'transit' | 'synastry';
}

export default function Chart3DVisualization({ planets, aspects, chartType }: Chart3DVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [aspectFilter, setAspectFilter] = useState<string[]>(['all']);
  const [viewMode, setViewMode] = useState<'cosmic' | 'geometric' | 'traditional'>('cosmic');

  // 3D Engine State
  const [camera, setCamera] = useState({
    x: 0, y: 0, z: 500,
    rotX: 0, rotY: 0, rotZ: 0
  });

  // Planet colors and sizes
  const planetData: Record<string, { color: string; size: number; orbitRadius: number }> = {
    Sun: { color: '#FFA500', size: 20, orbitRadius: 0 },
    Moon: { color: '#C0C0C0', size: 12, orbitRadius: 80 },
    Mercury: { color: '#8C7853', size: 8, orbitRadius: 120 },
    Venus: { color: '#FFC649', size: 10, orbitRadius: 160 },
    Mars: { color: '#CD5C5C', size: 9, orbitRadius: 200 },
    Jupiter: { color: '#D2691E', size: 18, orbitRadius: 280 },
    Saturn: { color: '#FAD5A5', size: 16, orbitRadius: 360 },
    Uranus: { color: '#4FD0E7', size: 14, orbitRadius: 440 },
    Neptune: { color: '#4169E1', size: 14, orbitRadius: 520 },
    Pluto: { color: '#8B4513', size: 6, orbitRadius: 600 }
  };

  // Aspect types and their visual properties
  const aspectTypes: Record<string, { color: string; lineStyle: string; strength: number }> = {
    conjunction: { color: '#FF0000', lineStyle: 'solid', strength: 1.0 },
    opposition: { color: '#FF4500', lineStyle: 'solid', strength: 0.9 },
    trine: { color: '#00FF00', lineStyle: 'solid', strength: 0.8 },
    square: { color: '#FF1493', lineStyle: 'dashed', strength: 0.7 },
    sextile: { color: '#00CED1', lineStyle: 'dotted', strength: 0.6 },
    quincunx: { color: '#9370DB', lineStyle: 'dotted', strength: 0.4 },
    semisextile: { color: '#DDA0DD', lineStyle: 'dotted', strength: 0.3 }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    drawChart(ctx);
  }, [planets, aspects, rotation, zoom, selectedPlanet, aspectFilter, viewMode, camera]);

  const drawChart = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / (2 * window.devicePixelRatio);
    const centerY = ctx.canvas.height / (2 * window.devicePixelRatio);

    // Clear canvas with cosmic background
    drawCosmicBackground(ctx);

    // Apply 3D transformations
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(zoom, zoom);

    // Draw zodiac wheel if in traditional mode
    if (viewMode === 'traditional') {
      drawZodiacWheel(ctx);
    }

    // Draw planetary orbits if in cosmic mode
    if (viewMode === 'cosmic') {
      drawPlanetaryOrbits(ctx);
    }

    // Draw aspect lines
    drawAspects(ctx);

    // Draw planets
    drawPlanets(ctx);

    // Draw 3D effect layers
    if (viewMode === 'cosmic') {
      drawCosmicEffects(ctx);
    }

    ctx.restore();

    // Draw UI overlays
    drawPlanetInfo(ctx);
    drawAspectLegend(ctx);
  };

  const drawCosmicBackground = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width / window.devicePixelRatio;
    const height = ctx.canvas.height / window.devicePixelRatio;

    // Create cosmic gradient
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    gradient.addColorStop(0, 'rgba(30, 20, 60, 1)');
    gradient.addColorStop(0.3, 'rgba(20, 10, 40, 1)');
    gradient.addColorStop(0.7, 'rgba(10, 5, 25, 1)');
    gradient.addColorStop(1, 'rgba(5, 2, 15, 1)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    drawStars(ctx, width, height);

    // Draw nebula effects
    drawNebula(ctx, width, height);
  };

  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 0.5;
      const opacity = Math.random() * 0.8 + 0.2;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add twinkling effect
      if (Math.random() > 0.8) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = size * 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    ctx.restore();
  };

  const drawNebula = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.globalAlpha = 0.3;
    
    // Create nebula clouds
    const cloudCount = 5;
    for (let i = 0; i < cloudCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 150 + 50;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      const colors = ['rgba(138, 43, 226, 0.3)', 'rgba(75, 0, 130, 0.2)', 'rgba(255, 20, 147, 0.2)'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const drawZodiacWheel = (ctx: CanvasRenderingContext2D) => {
    const outerRadius = 300;
    const innerRadius = 250;
    
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    
    const signColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
      '#F8B500', '#FF7675', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E'
    ];

    ctx.save();
    
    for (let i = 0; i < 12; i++) {
      const startAngle = (i * 30 - 90) * Math.PI / 180;
      const endAngle = ((i + 1) * 30 - 90) * Math.PI / 180;
      
      // Draw zodiac segment
      ctx.beginPath();
      ctx.arc(0, 0, outerRadius, startAngle, endAngle);
      ctx.arc(0, 0, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      
      ctx.fillStyle = `${signColors[i]}20`;
      ctx.fill();
      ctx.strokeStyle = `${signColors[i]}80`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw sign label
      const labelAngle = startAngle + (endAngle - startAngle) / 2;
      const labelRadius = (outerRadius + innerRadius) / 2;
      const labelX = Math.cos(labelAngle) * labelRadius;
      const labelY = Math.sin(labelAngle) * labelRadius;
      
      ctx.fillStyle = signColors[i];
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(signs[i], labelX, labelY);
    }
    
    ctx.restore();
  };

  const drawPlanetaryOrbits = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    Object.values(planetData).forEach(planet => {
      if (planet.orbitRadius > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, planet.orbitRadius * zoom, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    
    ctx.restore();
  };

  const drawPlanets = (ctx: CanvasRenderingContext2D) => {
    planets.forEach(planet => {
      const planetInfo = planetData[planet.name];
      if (!planetInfo) return;

      // Calculate 3D position
      const angle = (planet.longitude + rotation.z) * Math.PI / 180;
      const orbitRadius = planetInfo.orbitRadius;
      
      // Apply 3D transformations
      let x = Math.cos(angle) * orbitRadius;
      let y = Math.sin(angle) * orbitRadius;
      let z = 0;

      // Apply rotation
      const rotX = rotation.x * Math.PI / 180;
      const rotY = rotation.y * Math.PI / 180;
      
      // Rotate around X axis
      const newY = y * Math.cos(rotX) - z * Math.sin(rotX);
      z = y * Math.sin(rotX) + z * Math.cos(rotX);
      y = newY;
      
      // Rotate around Y axis
      const newX = x * Math.cos(rotY) + z * Math.sin(rotY);
      z = -x * Math.sin(rotY) + z * Math.cos(rotY);
      x = newX;

      // Project to 2D
      const scale = 300 / (300 + z);
      const projectedX = x * scale;
      const projectedY = y * scale;

      // Draw planet
      ctx.save();
      
      const size = planetInfo.size * scale;
      const isSelected = selectedPlanet === planet.name;
      
      // Planet glow effect
      if (isSelected || viewMode === 'cosmic') {
        ctx.shadowColor = planetInfo.color;
        ctx.shadowBlur = size * 2;
      }
      
      // Planet body
      ctx.fillStyle = planetInfo.color;
      ctx.beginPath();
      ctx.arc(projectedX, projectedY, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Planet highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(projectedX - size/3, projectedY - size/3, size/3, 0, Math.PI * 2);
      ctx.fill();
      
      // Planet ring (for Saturn)
      if (planet.name === 'Saturn') {
        ctx.strokeStyle = `${planetInfo.color}80`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(projectedX, projectedY, size * 1.8, size * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Planet label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(planet.name, projectedX, projectedY + size + 15);
      
      // Planet degree
      ctx.font = '8px Arial';
      ctx.fillText(`${Math.round(planet.longitude)}°`, projectedX, projectedY + size + 25);
      
      ctx.restore();
      
      // Store planet position for aspect drawing
      planet.projectedX = projectedX;
      planet.projectedY = projectedY;
    });
  };

  const drawAspects = (ctx: CanvasRenderingContext2D) => {
    aspects.forEach(aspect => {
      if (!aspectFilter.includes('all') && !aspectFilter.includes(aspect.type)) return;
      
      const planet1 = planets.find(p => p.name === aspect.planet1);
      const planet2 = planets.find(p => p.name === aspect.planet2);
      
      if (!planet1 || !planet2 || !planet1.projectedX || !planet2.projectedX) return;
      
      const aspectStyle = aspectTypes[aspect.type];
      if (!aspectStyle) return;
      
      ctx.save();
      
      // Set line style
      ctx.strokeStyle = `${aspectStyle.color}${Math.round(aspect.strength * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2 + aspect.strength * 2;
      
      if (aspectStyle.lineStyle === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (aspectStyle.lineStyle === 'dotted') {
        ctx.setLineDash([2, 3]);
      }
      
      // Draw aspect line with glow
      ctx.shadowColor = aspectStyle.color;
      ctx.shadowBlur = 5;
      
      ctx.beginPath();
      ctx.moveTo(planet1.projectedX!, planet1.projectedY!);
      ctx.lineTo(planet2.projectedX!, planet2.projectedY!);
      ctx.stroke();
      
      // Draw aspect symbol at midpoint
      const midX = (planet1.projectedX! + planet2.projectedX!) / 2;
      const midY = (planet1.projectedY! + planet2.projectedY!) / 2;
      
      ctx.fillStyle = aspectStyle.color;
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const aspectSymbols: Record<string, string> = {
        conjunction: '☌',
        opposition: '☍',
        trine: '△',
        square: '□',
        sextile: '⚹',
        quincunx: '⚻',
        semisextile: '⚺'
      };
      
      ctx.fillText(aspectSymbols[aspect.type] || '●', midX, midY);
      
      ctx.restore();
    });
  };

  const drawCosmicEffects = (ctx: CanvasRenderingContext2D) => {
    // Energy field visualization
    ctx.save();
    ctx.globalAlpha = 0.2;
    
    planets.forEach(planet => {
      if (!planet.projectedX || !planet.projectedY) return;
      
      const planetInfo = planetData[planet.name];
      if (!planetInfo) return;
      
      // Draw energy field
      const gradient = ctx.createRadialGradient(
        planet.projectedX!, planet.projectedY!, 0,
        planet.projectedX!, planet.projectedY!, planetInfo.size * 4
      );
      
      gradient.addColorStop(0, `${planetInfo.color}40`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(planet.projectedX!, planet.projectedY!, planetInfo.size * 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  };

  const drawPlanetInfo = (ctx: CanvasRenderingContext2D) => {
    if (!selectedPlanet) return;
    
    const planet = planets.find(p => p.name === selectedPlanet);
    if (!planet) return;
    
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 200, 120);
    
    ctx.strokeStyle = planetData[planet.name]?.color || '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 120);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(planet.name, 20, 30);
    
    ctx.font = '12px Arial';
    ctx.fillText(`Longitude: ${Math.round(planet.longitude)}°`, 20, 50);
    ctx.fillText(`Distance: ${planet.distance.toFixed(2)} AU`, 20, 70);
    ctx.fillText(`Speed: ${planet.speed.toFixed(4)}°/day`, 20, 90);
    
    const sign = getZodiacSign(planet.longitude);
    ctx.fillText(`Sign: ${sign}`, 20, 110);
    
    ctx.restore();
  };

  const drawAspectLegend = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width / window.devicePixelRatio;
    
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(width - 150, 10, 140, 200);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(width - 150, 10, 140, 200);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Aspects', width - 140, 30);
    
    let y = 50;
    Object.entries(aspectTypes).forEach(([type, style]) => {
      ctx.strokeStyle = style.color;
      ctx.lineWidth = 2;
      
      if (style.lineStyle === 'dashed') {
        ctx.setLineDash([3, 3]);
      } else if (style.lineStyle === 'dotted') {
        ctx.setLineDash([1, 2]);
      } else {
        ctx.setLineDash([]);
      }
      
      ctx.beginPath();
      ctx.moveTo(width - 140, y);
      ctx.lineTo(width - 120, y);
      ctx.stroke();
      
      ctx.fillStyle = style.color;
      ctx.font = '10px Arial';
      ctx.fillText(type, width - 115, y + 3);
      
      y += 20;
    });
    
    ctx.restore();
  };

  const getZodiacSign = (longitude: number): string => {
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    return signs[Math.floor(longitude / 30)];
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    
    // Find clicked planet
    for (const planet of planets) {
      if (!planet.projectedX || !planet.projectedY) continue;
      
      const distance = Math.sqrt(
        Math.pow(x / zoom - planet.projectedX, 2) + 
        Math.pow(y / zoom - planet.projectedY, 2)
      );
      
      const planetInfo = planetData[planet.name];
      if (planetInfo && distance <= planetInfo.size) {
        setSelectedPlanet(planet.name === selectedPlanet ? null : planet.name);
        return;
      }
    }
    
    setSelectedPlanet(null);
  };

  const startAnimation = () => {
    if (animationRef.current) return;
    
    setIsAnimating(true);
    
    const animate = () => {
      setRotation(prev => ({
        ...prev,
        y: prev.y + 0.5
      }));
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    setIsAnimating(false);
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0, z: 0 });
    setZoom(1);
    setCamera({ x: 0, y: 0, z: 500, rotX: 0, rotY: 0, rotZ: 0 });
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-purple-900 rounded-lg overflow-hidden">
      {/* Controls */}
      <div className="p-4 bg-black/50 border-b border-purple-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={isAnimating ? stopAnimation : startAnimation}
              className="border-purple-400"
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isAnimating ? 'Pause' : 'Animate'}
            </Button>
            
            <Button variant="outline" size="sm" onClick={resetView} className="border-purple-400">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                className="border-purple-400"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-white text-sm">{Math.round(zoom * 100)}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                className="border-purple-400"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">View:</span>
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <TabsList className="bg-slate-800">
                <TabsTrigger value="cosmic">Cosmic</TabsTrigger>
                <TabsTrigger value="geometric">Geometric</TabsTrigger>
                <TabsTrigger value="traditional">Traditional</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Rotation Controls */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <label className="text-white text-sm">X Rotation</label>
            <Slider
              value={[rotation.x]}
              onValueChange={([value]) => setRotation(prev => ({ ...prev, x: value }))}
              min={-180}
              max={180}
              step={1}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-white text-sm">Y Rotation</label>
            <Slider
              value={[rotation.y]}
              onValueChange={([value]) => setRotation(prev => ({ ...prev, y: value }))}
              min={-180}
              max={180}
              step={1}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-white text-sm">Z Rotation</label>
            <Slider
              value={[rotation.z]}
              onValueChange={([value]) => setRotation(prev => ({ ...prev, z: value }))}
              min={-180}
              max={180}
              step={1}
              className="mt-1"
            />
          </div>
        </div>
      </div>
      
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-96 cursor-crosshair"
        onClick={handleCanvasClick}
        style={{ height: '500px' }}
      />
      
      {/* Status Bar */}
      <div className="p-2 bg-black/50 border-t border-purple-500/30 text-white text-sm flex justify-between">
        <span>Chart Type: {chartType.toUpperCase()}</span>
        <span>Planets: {planets.length} | Aspects: {aspects.length}</span>
        {selectedPlanet && <span>Selected: {selectedPlanet}</span>}
      </div>
    </div>
  );
}