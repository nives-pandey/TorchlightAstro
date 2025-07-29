import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Chart3DVisualization from '@/components/3d-chart-visualization';
import { Loader2, Orbit, Eye, Zap, Star } from 'lucide-react';

export default function Chart3DDemo() {
  const [selectedView, setSelectedView] = useState<'natal' | 'transit' | 'synastry'>('natal');

  // Krishna Raj's demo data for 3D visualization
  const krishnaRajPlanets = [
    { name: 'Sun', longitude: 83.45, latitude: 0, distance: 1, color: '#FFA500', size: 20, speed: 0.9856 },
    { name: 'Moon', longitude: 113.24, latitude: 0, distance: 0.38, color: '#C0C0C0', size: 12, speed: 13.1764 },
    { name: 'Mercury', longitude: 75.12, latitude: 0, distance: 0.39, color: '#8C7853', size: 8, speed: 1.6071 },
    { name: 'Venus', longitude: 91.33, latitude: 0, distance: 0.72, color: '#FFC649', size: 10, speed: 1.1767 },
    { name: 'Mars', longitude: 156.78, latitude: 0, distance: 1.52, color: '#CD5C5C', size: 9, speed: 0.5240 },
    { name: 'Jupiter', longitude: 67.89, latitude: 0, distance: 5.20, color: '#D2691E', size: 18, speed: 0.0831 },
    { name: 'Saturn', longitude: 223.45, latitude: 0, distance: 9.54, color: '#FAD5A5', size: 16, speed: 0.0334 },
    { name: 'Uranus', longitude: 345.67, latitude: 0, distance: 19.19, color: '#4FD0E7', size: 14, speed: 0.0117 },
    { name: 'Neptune', longitude: 278.90, latitude: 0, distance: 30.07, color: '#4169E1', size: 14, speed: 0.0060 },
    { name: 'Pluto', longitude: 201.23, latitude: 0, distance: 39.48, color: '#8B4513', size: 6, speed: 0.0040 }
  ];

  const aspects = [
    { planet1: 'Sun', planet2: 'Moon', angle: 30, type: 'semisextile', orb: 2.5, strength: 0.7, color: '#DDA0DD' },
    { planet1: 'Sun', planet2: 'Mercury', angle: 8, type: 'conjunction', orb: 8, strength: 0.9, color: '#FF0000' },
    { planet1: 'Moon', planet2: 'Mars', angle: 43, type: 'semisextile', orb: 13, strength: 0.4, color: '#DDA0DD' },
    { planet1: 'Venus', planet2: 'Jupiter', angle: 23, type: 'semisextile', orb: 7, strength: 0.6, color: '#DDA0DD' },
    { planet1: 'Mars', planet2: 'Saturn', angle: 67, type: 'sextile', orb: 7, strength: 0.8, color: '#00CED1' },
    { planet1: 'Jupiter', planet2: 'Uranus', angle: 82, type: 'square', orb: 8, strength: 0.7, color: '#FF1493' },
    { planet1: 'Saturn', planet2: 'Neptune', angle: 55, type: 'sextile', orb: 5, strength: 0.9, color: '#00CED1' },
    { planet1: 'Uranus', planet2: 'Pluto', angle: 144, type: 'quincunx', orb: 6, strength: 0.5, color: '#9370DB' }
  ];

  const generateTransitData = () => {
    return krishnaRajPlanets.map(planet => ({
      ...planet,
      longitude: (planet.longitude + Math.random() * 60 - 30) % 360,
      name: `${planet.name} (T)`,
      color: adjustColorBrightness(planet.color, 0.3)
    }));
  };

  const generateSynastryData = () => {
    return krishnaRajPlanets.map(planet => ({
      ...planet,
      longitude: (planet.longitude + Math.random() * 90 - 45) % 360,
      name: `${planet.name} (P)`,
      color: adjustColorBrightness(planet.color, -0.2)
    }));
  };

  const adjustColorBrightness = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = (num >> 16) + amt;
    const B = (num >> 8 & 0x00FF) + amt;
    const G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
           (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + 
           (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
  };

  const getCurrentPlanets = () => {
    switch (selectedView) {
      case 'natal':
        return krishnaRajPlanets;
      case 'transit':
        return [...krishnaRajPlanets, ...generateTransitData()];
      case 'synastry':
        return [...krishnaRajPlanets, ...generateSynastryData()];
      default:
        return krishnaRajPlanets;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent mb-4">
            3D Cosmic Visualization Demo
          </h1>
          <p className="text-gray-300 text-lg">
            Advanced planetary aspect mapping with Krishna Raj's verified chart data
          </p>
        </div>

        {/* Test Profile Card */}
        <Card className="cosmic-card mb-6">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Demo Profile: Krishna Raj
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-orange-300 text-sm">Birth Date</div>
                <div className="font-medium">June 14, 1975</div>
              </div>
              <div>
                <div className="text-orange-300 text-sm">Birth Time</div>
                <div className="font-medium">9:18 AM</div>
              </div>
              <div>
                <div className="text-orange-300 text-sm">Location</div>
                <div className="font-medium">Manipal, India</div>
              </div>
              <div>
                <div className="text-orange-300 text-sm">Systems</div>
                <div className="font-medium">Western • Vedic • 3D Cosmos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart Type Controls */}
        <Card className="cosmic-card mb-6">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Orbit className="w-5 h-5" />
              3D Visualization Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setSelectedView('natal')}
                  variant={selectedView === 'natal' ? 'default' : 'outline'}
                  className={selectedView === 'natal' ? 'bg-orange-500' : 'border-orange-400'}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Natal Chart
                </Button>
                <Button
                  onClick={() => setSelectedView('transit')}
                  variant={selectedView === 'transit' ? 'default' : 'outline'}
                  className={selectedView === 'transit' ? 'bg-purple-500' : 'border-purple-400'}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Current Transits
                </Button>
                <Button
                  onClick={() => setSelectedView('synastry')}
                  variant={selectedView === 'synastry' ? 'default' : 'outline'}
                  className={selectedView === 'synastry' ? 'bg-pink-500' : 'border-pink-400'}
                >
                  <Orbit className="w-4 h-4 mr-2" />
                  Synastry Chart
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-orange-400 border-orange-400">
                  Planets: {getCurrentPlanets().length}
                </Badge>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  Aspects: {aspects.length}
                </Badge>
                <Badge variant="outline" className="text-pink-400 border-pink-400">
                  Mode: {selectedView.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3D Canvas Visualization */}
        <Card className="cosmic-card mb-6">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Interactive 3D Cosmic Map
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Chart3DVisualization
              planets={getCurrentPlanets()}
              aspects={aspects}
              chartType={selectedView}
            />
          </CardContent>
        </Card>

        {/* Chart Analysis */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="text-orange-400">Planetary Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {krishnaRajPlanets.map((planet, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: planet.color }}
                      />
                      <span className="font-medium">{planet.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{Math.round(planet.longitude)}°</div>
                      <div className="text-xs text-gray-400">
                        {getZodiacSign(planet.longitude)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="text-orange-400">Major Aspects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {aspects.map((aspect, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: aspect.color }}
                      />
                      <span className="text-sm">
                        {aspect.planet1} {getAspectSymbol(aspect.type)} {aspect.planet2}
                      </span>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getAspectStrengthColor(aspect.strength)}`}
                      >
                        {Math.round(aspect.strength * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Showcase */}
        <Card className="cosmic-card mt-6">
          <CardHeader>
            <CardTitle className="text-orange-400">Advanced 3D Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Canvas 2D Mode</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Interactive planetary positions</li>
                  <li>• Real-time aspect visualization</li>
                  <li>• Custom orbital mechanics</li>
                  <li>• Cosmic background effects</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Chart Types</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <strong>Natal:</strong> Birth chart positions</li>
                  <li>• <strong>Transit:</strong> Current sky overlay</li>
                  <li>• <strong>Synastry:</strong> Relationship compatibility</li>
                  <li>• <strong>Progression:</strong> Future development</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Interactive Controls</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 3D rotation and zoom controls</li>
                  <li>• Planet selection and details</li>
                  <li>• Aspect filtering and highlighting</li>
                  <li>• Animation and time progression</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getZodiacSign(longitude: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return signs[Math.floor(longitude / 30)];
}

function getAspectSymbol(aspectType: string): string {
  const symbols: Record<string, string> = {
    conjunction: '☌',
    opposition: '☍', 
    trine: '△',
    square: '□',
    sextile: '⚹',
    quincunx: '⚻',
    semisextile: '⚺'
  };
  return symbols[aspectType] || '●';
}

function getAspectStrengthColor(strength: number): string {
  if (strength > 0.8) return 'text-green-400 border-green-400';
  if (strength > 0.6) return 'text-purple-400 border-purple-400';
  if (strength > 0.4) return 'text-orange-400 border-orange-400';
  return 'text-red-400 border-red-400';
}