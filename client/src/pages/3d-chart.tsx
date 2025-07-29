import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Chart3DVisualization from '@/components/3d-chart-visualization';
import ThreeChartEngine from '@/components/three-chart-engine';
import Advanced3DEngine from '@/components/advanced-3d-engine';
import AdvancedPlanetaryAspects from '@/components/advanced-planetary-aspects';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Orbit, Eye, Zap, Download, Share, Settings, Link, Mail, FileText, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  // Load demo chart data for 3D visualization
  useEffect(() => {
    loadDemoChart();
  }, []);

  const loadDemoChart = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/demo-chart') as any;
      console.log('Demo chart response:', response);
      setChartData(response);
      
      // Convert chart data to 3D visualization format
      if (response?.chart?.westernChart?.planets) {
        const convertedPlanets = convertPlanetsTo3D(response.chart.westernChart.planets);
        console.log('Converted planets:', convertedPlanets);
        setPlanets(convertedPlanets);
      }
      
      if (response?.chart?.westernChart?.aspects) {
        const convertedAspects = convertAspectsTo3D(response.chart.westernChart.aspects);
        console.log('Converted aspects:', convertedAspects);
        setAspects(convertedAspects);
      }
    } catch (error) {
      console.error('Error loading chart:', error);
      // Load demo data for testing
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    console.log('Loading demo data for 3D visualization');
    // Demo planets for testing 3D visualization
    const demoPlanets = [
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

    const demoAspects = [
      { planet1: 'Sun', planet2: 'Mercury', angle: 8, type: 'conjunction', orb: 8, strength: 0.9, color: '#FF0000' },
      { planet1: 'Moon', planet2: 'Mars', angle: 43, type: 'semisextile', orb: 13, strength: 0.4, color: '#DDA0DD' },
      { planet1: 'Venus', planet2: 'Jupiter', angle: 23, type: 'semisextile', orb: 7, strength: 0.6, color: '#DDA0DD' },
      { planet1: 'Mars', planet2: 'Saturn', angle: 67, type: 'sextile', orb: 7, strength: 0.8, color: '#00CED1' },
      { planet1: 'Jupiter', planet2: 'Uranus', angle: 82, type: 'square', orb: 8, strength: 0.7, color: '#FF1493' },
      { planet1: 'Saturn', planet2: 'Neptune', angle: 55, type: 'sextile', orb: 5, strength: 0.9, color: '#00CED1' }
    ];

    setPlanets(demoPlanets);
    setAspects(demoAspects);
  };

  const convertPlanetsTo3D = (chartPlanets: any[]): Planet[] => {
    console.log('Converting planets:', chartPlanets);
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
      longitude: planet.degree || planet.longitude || Math.random() * 360,
      latitude: 0,
      distance: getPlanetDistance(planet.name),
      color: planetColors[planet.name] || '#FFFFFF',
      size: getPlanetSize(planet.name),
      speed: getPlanetSpeed(planet.name)
    }));
  };

  const convertAspectsTo3D = (chartAspects: any[]): Aspect[] => {
    console.log('Converting aspects:', chartAspects);
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

  // Sharing Functions
  const exportToPDF = async () => {
    try {
      const response = await fetch('/api/export-chart-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chartData,
          planets,
          aspects,
          chartType: selectedChart
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cosmic-mandala-${selectedChart}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "PDF Exported ✨",
          description: "Your cosmic mandala has been saved as a beautiful PDF",
        });
      } else {
        throw new Error('PDF export failed');
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to create PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareViaEmail = async () => {
    const subject = encodeURIComponent("Your Cosmic Mandala from Torchlight ✨");
    const body = encodeURIComponent(`
I wanted to share my beautiful cosmic mandala with you! 

This is my ${selectedChart} chart visualization created with Torchlight's advanced astrological system.

View it here: ${window.location.href}

Discover your own cosmic blueprint at Torchlight! 🌟
    `);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
    
    toast({
      title: "Email Ready",
      description: "Opening your email client to share your cosmic mandala",
    });
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied ✨",
        description: "Share this cosmic visualization with anyone",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the URL manually",
        variant: "destructive"
      });
    }
  };

  const exportAsImage = async () => {
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `cosmic-mandala-${selectedChart}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        toast({
          title: "Image Saved ✨",
          description: "Your cosmic mandala has been saved as an image",
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to save image. Please try again.",
        variant: "destructive"
      });
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
        {/* Header with Share Options */}
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Your Celestial Mandala
          </h1>
          <p className="text-gray-300 text-lg mb-4">
            A beautiful visualization of your cosmic blueprint and planetary relationships
          </p>
          
          {/* Share Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                <Share className="w-4 h-4 mr-2" />
                Share Your Mandala
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-purple-900/95 via-pink-900/90 to-rose-900/95 border-pink-300/30 backdrop-blur-md">
              <DialogHeader>
                <DialogTitle className="text-rose-300 flex items-center gap-2">
                  <Share className="w-5 h-5" />
                  Share Your Cosmic Mandala
                </DialogTitle>
                <DialogDescription className="text-rose-200/70">
                  Share your beautiful astrological visualization with friends and family
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button 
                  onClick={exportAsImage}
                  className="rounded-2xl p-6 h-auto flex flex-col items-center gap-3 bg-white/10 hover:bg-white/20 border border-pink-300/30"
                >
                  <Image className="w-6 h-6 text-pink-300" />
                  <span className="text-sm text-rose-200">Save as Image</span>
                </Button>
                
                <Button 
                  onClick={exportToPDF}
                  className="rounded-2xl p-6 h-auto flex flex-col items-center gap-3 bg-white/10 hover:bg-white/20 border border-pink-300/30"
                >
                  <FileText className="w-6 h-6 text-purple-300" />
                  <span className="text-sm text-rose-200">Export PDF</span>
                </Button>
                
                <Button 
                  onClick={copyShareLink}
                  className="rounded-2xl p-6 h-auto flex flex-col items-center gap-3 bg-white/10 hover:bg-white/20 border border-pink-300/30"
                >
                  <Link className="w-6 h-6 text-blue-300" />
                  <span className="text-sm text-rose-200">Copy Link</span>
                </Button>
                
                <Button 
                  onClick={shareViaEmail}
                  className="rounded-2xl p-6 h-auto flex flex-col items-center gap-3 bg-white/10 hover:bg-white/20 border border-pink-300/30"
                >
                  <Mail className="w-6 h-6 text-green-300" />
                  <span className="text-sm text-rose-200">Email Share</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
        <Tabs defaultValue="planetary-aspects" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="planetary-aspects">Planetary Aspects</TabsTrigger>
            <TabsTrigger value="advanced">Advanced 3D</TabsTrigger>
            <TabsTrigger value="canvas">Canvas 2D</TabsTrigger>
            <TabsTrigger value="threejs">Three.js Engine</TabsTrigger>
          </TabsList>
          
          <TabsContent value="planetary-aspects" className="mt-6">
            <AdvancedPlanetaryAspects
              planets={planets}
              aspects={aspects}
              width={800}
              height={600}
            />
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Advanced Planetary Aspect Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 relative">
                <Advanced3DEngine
                  planets={planets}
                  aspects={aspects}
                  width={800}
                  height={600}
                />
              </CardContent>
            </Card>
          </TabsContent>

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
  if (strength > 0.6) return 'text-purple-400 border-purple-400';
  if (strength > 0.4) return 'text-orange-400 border-orange-400';
  return 'text-red-400 border-red-400';
}