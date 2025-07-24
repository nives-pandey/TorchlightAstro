import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Chart3DVisualization from '@/components/3d-chart-visualization';
import ThreeChartEngine from '@/components/three-chart-engine';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Orbit, Eye, Zap } from 'lucide-react';

interface Planet {
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  color: string;
  size: number;
  speed: number;
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

export default function Chart3D() {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [aspects, setAspects] = useState<Aspect[]>([]);
  const [selectedChart, setSelectedChart] = useState<'natal' | 'transit' | 'synastry'>('natal');

  // Load demo chart data for 3D visualization
  useEffect(() => {
    loadDemoChart();
  }, []);

  const loadDemoChart = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/demo-chart');
      setChartData(response);
      
      // Convert chart data to 3D visualization format
      if (response.chart?.westernChart?.planets) {
        const convertedPlanets = convertPlanetsTo3D(response.chart.westernChart.planets);
        setPlanets(convertedPlanets);
      }
      
      if (response.chart?.westernChart?.aspects) {
        const convertedAspects = convertAspectsTo3D(response.chart.westernChart.aspects);
        setAspects(convertedAspects);
      }
    } catch (error) {
      console.error('Error loading chart:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertPlanetsTo3D = (chartPlanets: any[]): Planet[] => {
    const planetColors: Record<string, string> = {
      Sun: '#FFA500',
      Moon: '#C0C0C0', 
      Mercury: '#8C7853',
      Venus: '#FFC649',
      Mars: '#CD5C5C',
      Jupiter: '#D2691E',
      Saturn: '#FAD5A5',
      Uranus: '#4FD0E7',
      Neptune: '#4169E1',
      Pluto: '#8B4513'
    };

    return chartPlanets.map(planet => ({
      name: planet.name,
      longitude: planet.degree || Math.random() * 360,
      latitude: 0,
      distance: getPlanetDistance(planet.name),
      color: planetColors[planet.name] || '#FFFFFF',
      size: getPlanetSize(planet.name),
      speed: getPlanetSpeed(planet.name)
    }));
  };

  const convertAspectsTo3D = (chartAspects: any[]): Aspect[] => {
    const aspectColors: Record<string, string> = {
      conjunction: '#FF0000',
      opposition: '#FF4500', 
      trine: '#00FF00',
      square: '#FF1493',
      sextile: '#00CED1',
      quincunx: '#9370DB',
      semisextile: '#DDA0DD'
    };

    return chartAspects.map(aspect => ({
      planet1: aspect.planet1,
      planet2: aspect.planet2,
      angle: getAspectAngle(aspect.aspect),
      type: aspect.aspect.toLowerCase(),
      orb: aspect.orb || 0,
      strength: aspect.exactness || 0.5,
      color: aspectColors[aspect.aspect.toLowerCase()] || '#FFFFFF'
    }));
  };

  const getPlanetDistance = (planetName: string): number => {
    const distances: Record<string, number> = {
      Sun: 0,
      Moon: 0.38,
      Mercury: 0.39,
      Venus: 0.72,
      Mars: 1.52,
      Jupiter: 5.20,
      Saturn: 9.54,
      Uranus: 19.19,
      Neptune: 30.07,
      Pluto: 39.48
    };
    return distances[planetName] || 1;
  };

  const getPlanetSize = (planetName: string): number => {
    const sizes: Record<string, number> = {
      Sun: 20,
      Moon: 12,
      Mercury: 8,
      Venus: 10,
      Mars: 9,
      Jupiter: 18,
      Saturn: 16,
      Uranus: 14,
      Neptune: 14,
      Pluto: 6
    };
    return sizes[planetName] || 10;
  };

  const getPlanetSpeed = (planetName: string): number => {
    const speeds: Record<string, number> = {
      Sun: 0.9856,
      Moon: 13.1764,
      Mercury: 1.6071,
      Venus: 1.1767,
      Mars: 0.5240,
      Jupiter: 0.0831,
      Saturn: 0.0334,
      Uranus: 0.0117,
      Neptune: 0.0060,
      Pluto: 0.0040
    };
    return speeds[planetName] || 0.1;
  };

  const getAspectAngle = (aspectName: string): number => {
    const angles: Record<string, number> = {
      conjunction: 0,
      opposition: 180,
      trine: 120,
      square: 90,
      sextile: 60,
      quincunx: 150,
      semisextile: 30
    };
    return angles[aspectName.toLowerCase()] || 0;
  };

  const generateTransitChart = async () => {
    setLoading(true);
    try {
      // Generate current transit positions
      const transitPlanets = planets.map(planet => ({
        ...planet,
        longitude: (planet.longitude + Math.random() * 30 - 15) % 360,
        name: `${planet.name} (T)`
      }));
      
      setPlanets([...planets, ...transitPlanets]);
      setSelectedChart('transit');
    } catch (error) {
      console.error('Error generating transits:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSynastryChart = async () => {
    setLoading(true);
    try {
      // Generate partner chart positions  
      const partnerPlanets = planets.map(planet => ({
        ...planet,
        longitude: (planet.longitude + Math.random() * 60 - 30) % 360,
        name: `${planet.name} (P)`,
        color: adjustColorBrightness(planet.color, -0.3)
      }));
      
      setPlanets([...planets, ...partnerPlanets]);
      setSelectedChart('synastry');
    } catch (error) {
      console.error('Error generating synastry:', error);
    } finally {
      setLoading(false);
    }
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

  const resetToNatal = () => {
    if (chartData?.chart?.westernChart?.planets) {
      const convertedPlanets = convertPlanetsTo3D(chartData.chart.westernChart.planets);
      setPlanets(convertedPlanets);
      setSelectedChart('natal');
    }
  };

  if (loading && !chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading cosmic visualization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent mb-4">
            3D Cosmic Chart Visualization
          </h1>
          <p className="text-gray-300 text-lg">
            Advanced planetary aspect mapping with immersive 3D cosmic visualization
          </p>
        </div>

        {/* Chart Type Controls */}
        <Card className="cosmic-card mb-6">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Orbit className="w-5 h-5" />
              Chart Types & Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={resetToNatal}
                  variant={selectedChart === 'natal' ? 'default' : 'outline'}
                  className={selectedChart === 'natal' ? 'bg-orange-500' : 'border-orange-400'}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Natal Chart
                </Button>
                <Button
                  onClick={generateTransitChart}
                  variant={selectedChart === 'transit' ? 'default' : 'outline'}
                  className={selectedChart === 'transit' ? 'bg-purple-500' : 'border-purple-400'}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                  Current Transits
                </Button>
                <Button
                  onClick={generateSynastryChart}
                  variant={selectedChart === 'synastry' ? 'default' : 'outline'}
                  className={selectedChart === 'synastry' ? 'bg-pink-500' : 'border-pink-400'}
                  disabled={loading}
                >
                  <Orbit className="w-4 h-4 mr-2" />
                  Synastry Chart
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-orange-400 border-orange-400">
                  Planets: {planets.length}
                </Badge>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  Aspects: {aspects.length}
                </Badge>
                <Badge variant="outline" className="text-pink-400 border-pink-400">
                  Mode: {selectedChart.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3D Visualization Tabs */}
        <Tabs defaultValue="canvas" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="canvas">Canvas 2D</TabsTrigger>
            <TabsTrigger value="threejs">Three.js 3D</TabsTrigger>
          </TabsList>
          
          <TabsContent value="canvas" className="mt-6">
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <Orbit className="w-5 h-5" />
                  Interactive Canvas Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Chart3DVisualization
                  planets={planets}
                  aspects={aspects}
                  chartType={selectedChart}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="threejs" className="mt-6">
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Advanced Three.js Cosmic Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ThreeChartEngine
                  planets={planets}
                  aspects={aspects}
                  width={800}
                  height={600}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Chart Analysis */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="text-orange-400">Planetary Energies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {planets.slice(0, 10).map((planet, index) => (
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
              <CardTitle className="text-orange-400">Active Aspects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aspects.slice(0, 8).map((aspect, index) => (
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

        {/* Usage Instructions */}
        <Card className="cosmic-card mt-6">
          <CardHeader>
            <CardTitle className="text-orange-400">3D Navigation Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Mouse Controls</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Click planets to select and view details</li>
                  <li>• Use sliders to rotate the cosmic view</li>
                  <li>• Zoom in/out with zoom controls</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-300 mb-2">View Modes</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <strong>Cosmic:</strong> Immersive space visualization</li>
                  <li>• <strong>Geometric:</strong> Clean mathematical view</li>
                  <li>• <strong>Traditional:</strong> Classic zodiac wheel</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Chart Types</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <strong>Natal:</strong> Birth chart positions</li>
                  <li>• <strong>Transit:</strong> Current planetary influences</li>
                  <li>• <strong>Synastry:</strong> Relationship compatibility</li>
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
  if (strength > 0.6) return 'text-yellow-400 border-yellow-400';
  if (strength > 0.4) return 'text-orange-400 border-orange-400';
  return 'text-red-400 border-red-400';
}