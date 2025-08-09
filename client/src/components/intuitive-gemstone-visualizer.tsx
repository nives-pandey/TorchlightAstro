import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Heart, 
  Zap, 
  Shield, 
  Target, 
  Brain, 
  Star,
  Gem,
  Wand2,
  Eye,
  Palette,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Info,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw
} from "lucide-react";

interface GemstoneEnergy {
  id: string;
  name: string;
  color: string;
  energyType: 'amplifying' | 'balancing' | 'protective' | 'manifestation' | 'healing' | 'intuitive';
  chakra: string;
  element: string;
  planetaryRuler: string;
  emotionalResonance: number;
  spiritualAlignment: number;
  physicalVitality: number;
  mentalClarity: number;
  energyFlow: number;
  description: string;
  benefits: string[];
  resonanceScore?: number;
  x?: number;
  y?: number;
  size?: number;
  intensity?: number;
}

interface EnergyConnection {
  from: string;
  to: string;
  strength: number;
  type: 'synergy' | 'amplification' | 'balance' | 'transformation';
  color: string;
}

interface VisualizerProps {
  userProfile?: any;
  selectedGemstones?: GemstoneEnergy[];
  onGemstoneSelect?: (gemstone: GemstoneEnergy) => void;
  onEnergyChange?: (energyMap: any) => void;
}

const energyTypeConfig = {
  amplifying: { icon: Zap, color: "hsl(44, 45%, 65%)", pulse: true },
  balancing: { icon: Target, color: "hsl(180, 25%, 55%)", pulse: false },
  protective: { icon: Shield, color: "hsl(30, 8%, 18%)", pulse: false },
  manifestation: { icon: Wand2, color: "hsl(44, 45%, 65%)", pulse: true },
  healing: { icon: Heart, color: "hsl(44, 45%, 65%)", pulse: true },
  intuitive: { icon: Brain, color: "hsl(180, 25%, 55%)", pulse: true }
};

const gemstoneDatabase: GemstoneEnergy[] = [
  {
    id: "amethyst",
    name: "Amethyst",
    color: "hsl(180, 25%, 55%)",
    energyType: "intuitive",
    chakra: "Crown & Third Eye",
    element: "Air",
    planetaryRuler: "Jupiter",
    emotionalResonance: 95,
    spiritualAlignment: 98,
    physicalVitality: 70,
    mentalClarity: 88,
    energyFlow: 85,
    description: "Master stone of spiritual awakening and intuitive enhancement",
    benefits: ["Enhanced meditation", "Psychic protection", "Stress relief", "Spiritual clarity"]
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    color: "hsl(44, 45%, 65%)",
    energyType: "healing",
    chakra: "Heart",
    element: "Water",
    planetaryRuler: "Venus",
    emotionalResonance: 98,
    spiritualAlignment: 75,
    physicalVitality: 80,
    mentalClarity: 70,
    energyFlow: 90,
    description: "Universal stone of unconditional love and emotional healing",
    benefits: ["Self-love cultivation", "Relationship harmony", "Emotional healing", "Compassion enhancement"]
  },
  {
    id: "clear-quartz",
    name: "Clear Quartz",
    color: "hsl(60, 10%, 96%)",
    energyType: "amplifying",
    chakra: "All Chakras",
    element: "Fire",
    planetaryRuler: "Sun",
    emotionalResonance: 85,
    spiritualAlignment: 90,
    physicalVitality: 95,
    mentalClarity: 95,
    energyFlow: 100,
    description: "Master healer and energy amplifier for all intentions",
    benefits: ["Amplifies other stones", "Clarity enhancement", "Energy purification", "Intention manifestation"]
  },
  {
    id: "black-tourmaline",
    name: "Black Tourmaline",
    color: "hsl(30, 8%, 18%)",
    energyType: "protective",
    chakra: "Root",
    element: "Earth",
    planetaryRuler: "Saturn",
    emotionalResonance: 70,
    spiritualAlignment: 80,
    physicalVitality: 90,
    mentalClarity: 75,
    energyFlow: 65,
    description: "Powerful protection against negative energies and electromagnetic fields",
    benefits: ["Psychic protection", "Grounding", "EMF shielding", "Anxiety relief"]
  },
  {
    id: "citrine",
    name: "Citrine",
    color: "hsl(44, 45%, 65%)",
    energyType: "manifestation",
    chakra: "Solar Plexus",
    element: "Fire",
    planetaryRuler: "Jupiter",
    emotionalResonance: 80,
    spiritualAlignment: 85,
    physicalVitality: 88,
    mentalClarity: 90,
    energyFlow: 92,
    description: "Stone of abundance, manifestation, and personal power",
    benefits: ["Abundance attraction", "Confidence boost", "Mental clarity", "Success manifestation"]
  },
  {
    id: "green-aventurine",
    name: "Green Aventurine",
    color: "hsl(180, 25%, 55%)",
    energyType: "balancing",
    chakra: "Heart",
    element: "Earth",
    planetaryRuler: "Venus",
    emotionalResonance: 88,
    spiritualAlignment: 82,
    physicalVitality: 85,
    mentalClarity: 78,
    energyFlow: 80,
    description: "Stone of opportunity, luck, and emotional balance",
    benefits: ["Emotional balance", "Good luck", "Heart healing", "Opportunity attraction"]
  }
];

export default function IntuitiveGemstoneVisualizer({
  userProfile,
  selectedGemstones = [],
  onGemstoneSelect,
  onEnergyChange
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [energyIntensity, setEnergyIntensity] = useState(50);
  const [visualMode, setVisualMode] = useState<'energy' | 'chakra' | 'planetary'>('energy');
  const [showConnections, setShowConnections] = useState(true);
  const [selectedStones, setSelectedStones] = useState<GemstoneEnergy[]>([]);
  const [energyConnections, setEnergyConnections] = useState<EnergyConnection[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);

  // Calculate resonance scores based on user profile
  const calculateResonanceScore = (stone: GemstoneEnergy): number => {
    if (!userProfile) return 75; // Default score
    
    let score = 50;
    
    // Zodiac compatibility
    if (userProfile.systems?.western?.sign) {
      const zodiacMap: { [key: string]: string[] } = {
        "Aries": ["citrine", "clear-quartz"],
        "Leo": ["citrine", "clear-quartz"],
        "Sagittarius": ["amethyst", "citrine"],
        "Taurus": ["rose-quartz", "green-aventurine"],
        "Virgo": ["green-aventurine", "clear-quartz"],
        "Capricorn": ["black-tourmaline", "clear-quartz"],
        "Gemini": ["clear-quartz", "amethyst"],
        "Libra": ["rose-quartz", "green-aventurine"],
        "Aquarius": ["amethyst", "clear-quartz"],
        "Cancer": ["rose-quartz", "amethyst"],
        "Scorpio": ["black-tourmaline", "amethyst"],
        "Pisces": ["amethyst", "rose-quartz"]
      };
      
      if (zodiacMap[userProfile.systems.western.sign]?.includes(stone.id)) {
        score += 30;
      }
    }
    
    // Life path compatibility
    if (userProfile.systems?.numerology?.lifePath) {
      const pathMap: { [key: number]: string[] } = {
        1: ["citrine", "clear-quartz"],
        2: ["rose-quartz", "green-aventurine"],
        3: ["citrine", "clear-quartz"],
        4: ["black-tourmaline", "green-aventurine"],
        5: ["clear-quartz", "citrine"],
        6: ["rose-quartz", "green-aventurine"],
        7: ["amethyst", "clear-quartz"],
        8: ["citrine", "black-tourmaline"],
        9: ["amethyst", "rose-quartz"],
        11: ["amethyst", "clear-quartz"],
        22: ["black-tourmaline", "clear-quartz"]
      };
      
      if (pathMap[userProfile.systems.numerology.lifePath]?.includes(stone.id)) {
        score += 25;
      }
    }
    
    return Math.min(100, score);
  };

  // Initialize gemstones with positions and resonance scores
  useEffect(() => {
    const enhancedStones = gemstoneDatabase.map((stone, index) => ({
      ...stone,
      resonanceScore: calculateResonanceScore(stone),
      x: 200 + (index % 3) * 150,
      y: 100 + Math.floor(index / 3) * 120,
      size: 40 + (calculateResonanceScore(stone) / 100) * 20,
      intensity: energyIntensity
    }));
    
    setSelectedStones(enhancedStones.slice(0, 4)); // Start with top 4
  }, [userProfile, energyIntensity]);

  // Generate energy connections between stones
  useEffect(() => {
    const connections: EnergyConnection[] = [];
    
    for (let i = 0; i < selectedStones.length; i++) {
      for (let j = i + 1; j < selectedStones.length; j++) {
        const stone1 = selectedStones[i];
        const stone2 = selectedStones[j];
        
        // Calculate connection strength based on energy compatibility
        let strength = 0;
        let type: EnergyConnection['type'] = 'synergy';
        let color = 'hsl(30, 5%, 66%)';
        
        // Same chakra = strong synergy
        if (stone1.chakra === stone2.chakra) {
          strength = 80;
          type = 'synergy';
          color = 'hsl(44, 45%, 65%)';
        }
        // Complementary elements
        else if (
          (stone1.element === 'Fire' && stone2.element === 'Air') ||
          (stone1.element === 'Water' && stone2.element === 'Earth')
        ) {
          strength = 70;
          type = 'balance';
          color = 'hsl(180, 25%, 55%)';
        }
        // Amplifying stones boost others
        else if (stone1.energyType === 'amplifying' || stone2.energyType === 'amplifying') {
          strength = 60;
          type = 'amplification';
          color = 'hsl(44, 45%, 65%)';
        }
        // Different energy types can create transformation
        else if (stone1.energyType !== stone2.energyType) {
          strength = 40;
          type = 'transformation';
          color = 'hsl(180, 25%, 55%)';
        }
        
        if (strength > 30) {
          connections.push({
            from: stone1.id,
            to: stone2.id,
            strength,
            type,
            color
          });
        }
      }
    }
    
    setEnergyConnections(connections);
  }, [selectedStones]);

  // Animation loop
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      if (isPlaying) {
        setAnimationFrame(prev => prev + 1);
      }
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background energy field
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(197, 165, 90, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (!showConnections) return;
    
    // Draw energy connections
    energyConnections.forEach(connection => {
      const stone1 = selectedStones.find(s => s.id === connection.from);
      const stone2 = selectedStones.find(s => s.id === connection.to);
      
      if (stone1 && stone2 && stone1.x && stone1.y && stone2.x && stone2.y) {
        // Animated energy flow
        const flow = Math.sin(animationFrame * 0.1) * 0.5 + 0.5;
        const alpha = (connection.strength / 100) * flow * (energyIntensity / 100);
        
        ctx.strokeStyle = connection.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 2 + (connection.strength / 100) * 3;
        ctx.beginPath();
        ctx.moveTo(stone1.x, stone1.y);
        ctx.lineTo(stone2.x, stone2.y);
        ctx.stroke();
        
        // Energy particles flowing along connection
        if (isPlaying) {
          const particlePos = (animationFrame * 0.02) % 1;
          const particleX = stone1.x + (stone2.x - stone1.x) * particlePos;
          const particleY = stone1.y + (stone2.y - stone1.y) * particlePos;
          
          ctx.fillStyle = connection.color;
          ctx.beginPath();
          ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  }, [selectedStones, energyConnections, showConnections, animationFrame, energyIntensity, isPlaying]);

  const addGemstone = (stone: GemstoneEnergy) => {
    if (selectedStones.length < 6 && !selectedStones.find(s => s.id === stone.id)) {
      const newStone = {
        ...stone,
        resonanceScore: calculateResonanceScore(stone),
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
        size: 40 + (calculateResonanceScore(stone) / 100) * 20,
        intensity: energyIntensity
      };
      
      setSelectedStones(prev => [...prev, newStone]);
      onGemstoneSelect?.(newStone);
    }
  };

  const removeGemstone = (stoneId: string) => {
    setSelectedStones(prev => prev.filter(s => s.id !== stoneId));
  };

  const resetVisualization = () => {
    setSelectedStones([]);
    setEnergyConnections([]);
    setAnimationFrame(0);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Controls Panel */}
      <Card className="sanctuary-card">
        <CardHeader>
          <CardTitle className="text-yellow-500 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Energy Visualization Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Button
              variant={isPlaying ? "default" : "outline"}
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button
              variant={showConnections ? "default" : "outline"}
              onClick={() => setShowConnections(!showConnections)}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Energy Flow
            </Button>
            
            <Button
              variant="outline"
              onClick={resetVisualization}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-yellow-500" />
              <select 
                value={visualMode}
                onChange={(e) => setVisualMode(e.target.value as any)}
                className="bg-teal-900/30 border border-yellow-500/30 rounded px-2 py-1 text-white text-sm"
              >
                <option value="energy">Energy Type</option>
                <option value="chakra">Chakra Focus</option>
                <option value="planetary">Planetary Ruler</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-teal-200 text-sm mb-2 block">Energy Intensity: {energyIntensity}%</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={energyIntensity}
                onChange={(e) => setEnergyIntensity(Number(e.target.value))}
                className="w-full h-2 bg-teal-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Visualization Canvas */}
      <Card className="sanctuary-card">
        <CardContent className="p-0 relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full h-auto bg-gradient-to-br from-teal-900/20 to-gray-900/20 rounded-lg"
          />
          
          {/* Gemstone nodes overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {selectedStones.map((stone, index) => (
              <motion.div
                key={stone.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: stone.x ? `${(stone.x / 600) * 100}%` : '50%',
                  top: stone.y ? `${(stone.y / 400) * 100}%` : '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{
                  scale: isPlaying ? [1, 1.1, 1] : 1,
                  rotate: isPlaying ? [0, 360] : 0
                }}
                transition={{
                  duration: 3,
                  repeat: isPlaying ? Infinity : 0,
                  ease: "easeInOut"
                }}
                onClick={() => removeGemstone(stone.id)}
              >
                <div 
                  className="relative flex items-center justify-center rounded-full shadow-lg border-2 border-white/20"
                  style={{
                    backgroundColor: stone.color,
                    width: stone.size || 40,
                    height: stone.size || 40,
                    boxShadow: `0 0 ${(stone.intensity || 50) / 10}px ${stone.color}80`
                  }}
                >
                  <Gem className="w-4 h-4 text-white" />
                  
                  {/* Resonance indicator */}
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {stone.resonanceScore}
                  </div>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                  {stone.name} - {stone.chakra}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gemstone Selection Panel */}
      <Card className="sanctuary-card">
        <CardHeader>
          <CardTitle className="text-yellow-500 flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Available Gemstones ({selectedStones.length}/6 selected)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {gemstoneDatabase.map(stone => {
              const isSelected = selectedStones.some(s => s.id === stone.id);
              const resonance = calculateResonanceScore(stone);
              const config = energyTypeConfig[stone.energyType];
              
              return (
                <motion.div
                  key={stone.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-yellow-500 bg-yellow-500/20' 
                      : 'border-yellow-600/30 bg-teal-900/20 hover:bg-teal-800/30'
                  }`}
                  onClick={() => isSelected ? removeGemstone(stone.id) : addGemstone(stone)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/30"
                      style={{ backgroundColor: stone.color }}
                    />
                    <config.icon className="w-4 h-4 text-teal-300" />
                  </div>
                  
                  <h4 className="font-medium text-white text-sm mb-1">{stone.name}</h4>
                  <p className="text-teal-200 text-xs mb-2">{stone.chakra}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className="text-xs border-yellow-500/30 text-teal-300"
                    >
                      {resonance}% match
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0"
                    >
                      {isSelected ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Energy Analysis Panel */}
      {selectedStones.length > 0 && (
        <Card className="sanctuary-card">
          <CardHeader>
            <CardTitle className="text-yellow-500 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Energy Analysis & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Energy Composition */}
              <div>
                <h4 className="font-medium text-white mb-3">Energy Composition</h4>
                <div className="space-y-2">
                  {Object.entries(energyTypeConfig).map(([type, config]) => {
                    const count = selectedStones.filter(s => s.energyType === type).length;
                    const percentage = (count / selectedStones.length) * 100;
                    
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <config.icon className="w-4 h-4" style={{ color: config.color }} />
                        <span className="text-teal-200 text-sm capitalize flex-1">{type}</span>
                        <div className="w-20">
                          <Progress value={percentage} className="h-2" />
                        </div>
                        <span className="text-white text-sm w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Connection Strength */}
              <div>
                <h4 className="font-medium text-white mb-3">Energy Connections</h4>
                <div className="space-y-2">
                  {energyConnections.slice(0, 5).map((connection, index) => {
                    const stone1 = selectedStones.find(s => s.id === connection.from);
                    const stone2 = selectedStones.find(s => s.id === connection.to);
                    
                    return (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: connection.color }}
                        />
                        <span className="text-teal-200">
                          {stone1?.name} ↔ {stone2?.name}
                        </span>
                        <div className="flex-1">
                          <Progress value={connection.strength} className="h-1" />
                        </div>
                        <span className="text-white text-xs">{connection.strength}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Personalized Recommendations */}
            {userProfile && (
              <div className="mt-6 p-4 bg-teal-900/20 rounded-lg border border-yellow-500/30">
                <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Personalized Insights
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-teal-300">Optimal Timing:</span>
                    <p className="text-teal-100">Best used during evening meditation or before sleep</p>
                  </div>
                  <div>
                    <span className="text-teal-300">Placement Suggestion:</span>
                    <p className="text-teal-100">Carry in left pocket or wear as pendant near heart</p>
                  </div>
                  <div>
                    <span className="text-teal-300">Intention Focus:</span>
                    <p className="text-teal-100">Spiritual growth and emotional balance enhancement</p>
                  </div>
                  <div>
                    <span className="text-teal-300">Cleansing Method:</span>
                    <p className="text-teal-100">Moonlight charging with selenite cleansing monthly</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}