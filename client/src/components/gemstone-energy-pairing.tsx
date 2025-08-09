import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Heart, 
  Zap, 
  Shield, 
  Target, 
  Brain, 
  Star,
  Home,
  X,
  Info,
  Wand2,
  Gem
} from "lucide-react";
import { Link } from "wouter";

interface GemstonePairing {
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
  pairsWith: string[];
  avoidWith: string[];
  wearingGuidance: string;
  chargingMethod: string;
  zodiacAffinity: string[];
  lifePathNumbers: number[];
  moonPhaseOptimal: string;
  timeOfDay: string;
  bodyPlacement: string;
  intentionFocus: string;
}

interface EnergyVisualizationProps {
  onClose: () => void;
  birthData?: any;
}

const gemstoneDatabase: GemstonePairing[] = [
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
    benefits: ["Enhanced meditation", "Psychic protection", "Stress relief", "Spiritual clarity"],
    pairsWith: ["Clear Quartz", "Moonstone", "Labradorite"],
    avoidWith: ["Hematite", "Black Tourmaline"],
    wearingGuidance: "Wear close to head or heart, avoid during intense physical activity",
    chargingMethod: "Moonlight charging, selenite cleansing",
    zodiacAffinity: ["Pisces", "Aquarius", "Capricorn"],
    lifePathNumbers: [7, 9, 11],
    moonPhaseOptimal: "Full Moon",
    timeOfDay: "Evening meditation",
    bodyPlacement: "Forehead, throat, or heart area",
    intentionFocus: "Spiritual growth and intuitive development"
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    color: "hsl(60, 10%, 96%)",
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
    benefits: ["Self-love cultivation", "Relationship harmony", "Emotional healing", "Compassion enhancement"],
    pairsWith: ["Green Aventurine", "Moonstone", "Clear Quartz"],
    avoidWith: ["Red Jasper", "Carnelian"],
    wearingGuidance: "Wear continuously, especially during emotional healing work",
    chargingMethod: "Dawn sunlight, water cleansing",
    zodiacAffinity: ["Taurus", "Libra", "Cancer"],
    lifePathNumbers: [2, 6, 9],
    moonPhaseOptimal: "New Moon",
    timeOfDay: "Morning self-care rituals",
    bodyPlacement: "Over heart chakra or carried in pocket",
    intentionFocus: "Love, forgiveness, and emotional healing"
  },
  {
    id: "citrine",
    name: "Citrine",
    color: "hsl(44, 45%, 65%)",
    energyType: "manifestation",
    chakra: "Solar Plexus",
    element: "Fire",
    planetaryRuler: "Sun",
    emotionalResonance: 85,
    spiritualAlignment: 80,
    physicalVitality: 95,
    mentalClarity: 90,
    energyFlow: 92,
    description: "Merchant's stone of abundance and personal power manifestation",
    benefits: ["Wealth attraction", "Confidence boost", "Mental clarity", "Creative energy"],
    pairsWith: ["Pyrite", "Tiger's Eye", "Clear Quartz"],
    avoidWith: ["Amethyst", "Moonstone"],
    wearingGuidance: "Wear during business meetings and creative projects",
    chargingMethod: "Direct sunlight charging",
    zodiacAffinity: ["Leo", "Gemini", "Aries"],
    lifePathNumbers: [1, 3, 8],
    moonPhaseOptimal: "Waxing Moon",
    timeOfDay: "Morning energy work",
    bodyPlacement: "Solar plexus area or dominant hand",
    intentionFocus: "Abundance, success, and personal power"
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
    spiritualAlignment: 85,
    physicalVitality: 88,
    mentalClarity: 75,
    energyFlow: 80,
    description: "Master protector against negative energies and electromagnetic fields",
    benefits: ["Psychic protection", "Energy grounding", "Anxiety relief", "EMF shielding"],
    pairsWith: ["Hematite", "Smoky Quartz", "Red Jasper"],
    avoidWith: ["Amethyst", "Clear Quartz"],
    wearingGuidance: "Carry in pocket or wear as jewelry for continuous protection",
    chargingMethod: "Earth burying, sage cleansing",
    zodiacAffinity: ["Capricorn", "Scorpio", "Virgo"],
    lifePathNumbers: [4, 8, 22],
    moonPhaseOptimal: "Dark Moon",
    timeOfDay: "Before challenging situations",
    bodyPlacement: "Left pocket or root chakra area",
    intentionFocus: "Protection, grounding, and energy clearing"
  },
  {
    id: "clear-quartz",
    name: "Clear Quartz",
    color: "hsl(60, 10%, 96%)",
    energyType: "amplifying",
    chakra: "All Chakras",
    element: "All Elements",
    planetaryRuler: "Moon",
    emotionalResonance: 85,
    spiritualAlignment: 95,
    physicalVitality: 85,
    mentalClarity: 95,
    energyFlow: 98,
    description: "Master healer and universal amplifier of all energies",
    benefits: ["Energy amplification", "Clarity enhancement", "Spiritual connection", "Healing acceleration"],
    pairsWith: ["All stones", "Amplifies any combination"],
    avoidWith: ["None - universal connector"],
    wearingGuidance: "Can be worn continuously, enhances other stones",
    chargingMethod: "All methods - sun, moon, earth, water",
    zodiacAffinity: ["All signs"],
    lifePathNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33],
    moonPhaseOptimal: "All phases",
    timeOfDay: "Anytime - universal timing",
    bodyPlacement: "Anywhere - adapts to intention",
    intentionFocus: "Amplification of any positive intention"
  },
  {
    id: "labradorite",
    name: "Labradorite",
    color: "hsl(180, 25%, 55%)",
    energyType: "intuitive",
    chakra: "Third Eye & Throat",
    element: "Air & Water",
    planetaryRuler: "Uranus",
    emotionalResonance: 80,
    spiritualAlignment: 92,
    physicalVitality: 75,
    mentalClarity: 85,
    energyFlow: 88,
    description: "Stone of magic and transformation, awakening psychic abilities",
    benefits: ["Psychic awakening", "Aura protection", "Transformation catalyst", "Inner magic activation"],
    pairsWith: ["Moonstone", "Amethyst", "Fluorite"],
    avoidWith: ["Heavy grounding stones"],
    wearingGuidance: "Wear during spiritual work and creative endeavors",
    chargingMethod: "Moonlight, especially during aurora activity",
    zodiacAffinity: ["Scorpio", "Sagittarius", "Leo"],
    lifePathNumbers: [7, 11, 29],
    moonPhaseOptimal: "Full Moon",
    timeOfDay: "Twilight hours",
    bodyPlacement: "Third eye or throat area",
    intentionFocus: "Psychic development and magical awakening"
  }
];

const energyTypeColors = {
  amplifying: "hsl(44, 45%, 65%)",
  balancing: "hsl(180, 25%, 55%)",
  protective: "hsl(30, 8%, 18%)",
  manifestation: "hsl(44, 45%, 65%)",
  healing: "hsl(44, 45%, 65%)",
  intuitive: "hsl(180, 25%, 55%)"
};

const energyTypeIcons = {
  amplifying: Zap,
  balancing: Target,
  protective: Shield,
  manifestation: Wand2,
  healing: Heart,
  intuitive: Brain
};

export default function GemstoneEnergyPairing({ onClose, birthData }: EnergyVisualizationProps) {
  const [selectedStone, setSelectedStone] = useState<GemstonePairing | null>(null);
  const [energyFilter, setEnergyFilter] = useState<string>("all");
  const [personalizedStones, setPersonalizedStones] = useState<GemstonePairing[]>([]);
  const [activeVisualization, setActiveVisualization] = useState("grid");

  // Calculate personalized recommendations based on birth data
  useEffect(() => {
    if (birthData) {
      const personalized = calculatePersonalizedRecommendations(birthData);
      setPersonalizedStones(personalized);
    }
  }, [birthData]);

  const calculatePersonalizedRecommendations = (data: any) => {
    // Analyze astrological data for gemstone compatibility
    const westernSign = data.systems?.western?.sign || data.sign;
    const lifePathNumber = data.systems?.numerology?.lifePath || calculateLifePath(data.birthDate);
    
    return gemstoneDatabase
      .filter(stone => {
        const signMatch = stone.zodiacAffinity.includes(westernSign);
        const numberMatch = stone.lifePathNumbers.includes(lifePathNumber);
        return signMatch || numberMatch;
      })
      .sort((a, b) => {
        // Sort by energy resonance with birth data
        const aScore = calculateResonanceScore(a, data);
        const bScore = calculateResonanceScore(b, data);
        return bScore - aScore;
      });
  };

  const calculateResonanceScore = (stone: GemstonePairing, data: any) => {
    let score = 0;
    const westernSign = data.systems?.western?.sign || data.sign;
    const lifePathNumber = data.systems?.numerology?.lifePath || 1;
    
    if (stone.zodiacAffinity.includes(westernSign)) score += 30;
    if (stone.lifePathNumbers.includes(lifePathNumber)) score += 25;
    
    // Add birth time energy analysis
    const birthHour = new Date(`1970-01-01T${data.birthTime}`).getHours();
    if (birthHour >= 6 && birthHour <= 12 && stone.timeOfDay.includes("Morning")) score += 15;
    if (birthHour >= 18 && birthHour <= 23 && stone.timeOfDay.includes("Evening")) score += 15;
    
    return score + stone.spiritualAlignment + stone.energyFlow;
  };

  const calculateLifePath = (birthDate: string) => {
    const dateStr = birthDate.replace(/-/g, '');
    let sum = 0;
    for (let digit of dateStr) {
      sum += parseInt(digit);
    }
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return sum;
  };

  const filteredStones = energyFilter === "all" 
    ? gemstoneDatabase 
    : gemstoneDatabase.filter(stone => stone.energyType === energyFilter);

  const getEnergyVisualization = (stone: GemstonePairing) => {
    const energies = [
      { name: "Emotional", value: stone.emotionalResonance, color: "hsl(44, 45%, 65%)" },
      { name: "Spiritual", value: stone.spiritualAlignment, color: "hsl(180, 25%, 55%)" },
      { name: "Physical", value: stone.physicalVitality, color: "hsl(30, 5%, 66%)" },
      { name: "Mental", value: stone.mentalClarity, color: "hsl(180, 25%, 55%)" },
      { name: "Energy Flow", value: stone.energyFlow, color: "hsl(44, 45%, 65%)" }
    ];

    return energies;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      {/* Home Button */}
      <Link href="/">
        <Button className="home-button">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </Link>

      <Card className="w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-black/60 border-white/20 backdrop-blur-md">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:bg-teal-800/40"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <CardTitle className="text-white text-3xl mb-2 flex items-center justify-center">
              <Gem className="mr-3 h-8 w-8 text-yellow-500" />
              Intuitive Gemstone Energy Pairing
              <Sparkles className="ml-3 h-8 w-8 text-yellow-400" />
            </CardTitle>
            <p className="text-gray-300 text-lg">
              Discover your perfect gemstone companions through cosmic energy alignment
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Personalized Recommendations */}
          {personalizedStones.length > 0 && (
            <Card className="bg-gradient-to-r from-teal-900/40 to-pink-900/40 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-400" />
                  Your Cosmic Gemstone Matches
                </CardTitle>
                <p className="text-gray-300 text-sm">
                  Based on your {birthData?.systems?.western?.sign || 'astrological'} profile and life path energy
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {personalizedStones.slice(0, 3).map((stone) => (
                    <Card 
                      key={stone.id}
                      className="bg-black/40 border-yellow-500/30 hover:border-yellow-500/60 transition-all cursor-pointer"
                      onClick={() => setSelectedStone(stone)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <div 
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: stone.color }}
                          />
                          <h3 className="text-white font-medium">{stone.name}</h3>
                        </div>
                        <p className="text-gray-300 text-xs mb-2">{stone.chakra}</p>
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-sm">
                            {calculateResonanceScore(stone, birthData)}% match
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Energy Filter Tabs */}
          <Tabs value={energyFilter} onValueChange={setEnergyFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-teal-900/30">
              <TabsTrigger value="all" className="text-white data-[state=active]:bg-yellow-600">
                All
              </TabsTrigger>
              {Object.entries(energyTypeColors).map(([type, color]) => {
                const Icon = energyTypeIcons[type as keyof typeof energyTypeIcons];
                return (
                  <TabsTrigger 
                    key={type}
                    value={type} 
                    className="text-white data-[state=active]:bg-yellow-600 flex items-center"
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={energyFilter} className="mt-6">
              {/* Gemstone Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStones.map((stone) => {
                  const Icon = energyTypeIcons[stone.energyType];
                  return (
                    <Card 
                      key={stone.id}
                      className="bg-black/40 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 cursor-pointer transform hover:scale-105"
                      onClick={() => setSelectedStone(stone)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg flex items-center">
                            <div 
                              className="w-5 h-5 rounded-full mr-2 shadow-lg"
                              style={{ backgroundColor: stone.color }}
                            />
                            {stone.name}
                          </CardTitle>
                          <Badge 
                            variant="outline" 
                            className="border-yellow-500/50 text-teal-300"
                            style={{ color: energyTypeColors[stone.energyType] }}
                          >
                            <Icon className="w-3 h-3 mr-1" />
                            {stone.energyType}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{stone.chakra} • {stone.element}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-sm mb-4">{stone.description}</p>
                        
                        {/* Energy Visualization */}
                        <div className="space-y-2">
                          {getEnergyVisualization(stone).map((energy) => (
                            <div key={energy.name} className="flex items-center space-x-2">
                              <span className="text-xs text-gray-300 w-16">{energy.name}</span>
                              <Progress 
                                value={energy.value} 
                                className="flex-1 h-2"
                                style={{ 
                                  '--progress-background': energy.color,
                                  '--progress-foreground': energy.color 
                                } as any}
                              />
                              <span className="text-xs text-gray-400">{energy.value}%</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1">
                          {stone.benefits.slice(0, 2).map((benefit) => (
                            <Badge key={benefit} variant="secondary" className="text-xs bg-teal-800/30 text-teal-200">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detailed Stone Modal */}
      {selectedStone && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 z-60">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/80 border-yellow-500/30">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedStone(null)}
                className="absolute right-4 top-4 text-white hover:bg-teal-800/40"
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-full shadow-xl"
                  style={{ backgroundColor: selectedStone.color }}
                />
                <div>
                  <CardTitle className="text-white text-2xl">{selectedStone.name}</CardTitle>
                  <p className="text-gray-300">{selectedStone.description}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Energy Analysis */}
                <Card className="bg-teal-900/20 border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="mr-2 h-5 w-5" />
                      Energy Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {getEnergyVisualization(selectedStone).map((energy) => (
                      <div key={energy.name} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-300 text-sm">{energy.name}</span>
                          <span className="text-gray-400 text-sm">{energy.value}%</span>
                        </div>
                        <Progress 
                          value={energy.value} 
                          className="h-2"
                          style={{ 
                            '--progress-background': energy.color,
                            '--progress-foreground': energy.color 
                          } as any}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Astrological Connections */}
                <Card className="bg-blue-900/20 border-blue-400/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Star className="mr-2 h-5 w-5" />
                      Cosmic Connections
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-gray-300 text-sm font-medium">Zodiac Affinity:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedStone.zodiacAffinity.map((sign) => (
                          <Badge key={sign} variant="outline" className="text-xs border-blue-400/50 text-blue-300">
                            {sign}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-300 text-sm font-medium">Life Path Numbers:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedStone.lifePathNumbers.map((number) => (
                          <Badge key={number} variant="outline" className="text-xs border-blue-400/50 text-blue-300">
                            {number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-300 text-sm font-medium">Planetary Ruler:</span>
                      <p className="text-gray-400 text-sm">{selectedStone.planetaryRuler}</p>
                    </div>
                    <div>
                      <span className="text-gray-300 text-sm font-medium">Optimal Moon Phase:</span>
                      <p className="text-gray-400 text-sm">{selectedStone.moonPhaseOptimal}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Benefits & Usage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-green-900/20 border-green-400/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Heart className="mr-2 h-5 w-5" />
                      Benefits & Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedStone.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                          <span className="text-gray-300 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-900/20 border-orange-400/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Info className="mr-2 h-5 w-5" />
                      Usage Guidance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-gray-300 text-sm font-medium">Wearing:</span>
                      <p className="text-gray-400 text-sm">{selectedStone.wearingGuidance}</p>
                    </div>
                    <div>
                      <span className="text-gray-300 text-sm font-medium">Body Placement:</span>
                      <p className="text-gray-400 text-sm">{selectedStone.bodyPlacement}</p>
                    </div>
                    <div>
                      <span className="text-gray-300 text-sm font-medium">Charging Method:</span>
                      <p className="text-gray-400 text-sm">{selectedStone.chargingMethod}</p>
                    </div>
                    <div>
                      <span className="text-gray-300 text-sm font-medium">Intention Focus:</span>
                      <p className="text-gray-400 text-sm">{selectedStone.intentionFocus}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stone Combinations */}
              <Card className="bg-teal-900/20 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Energy Pairing Combinations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-green-400 text-sm font-medium">Synergistic Pairings:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedStone.pairsWith.map((stone) => (
                          <Badge key={stone} variant="outline" className="text-xs border-green-400/50 text-green-300">
                            {stone}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-red-400 text-sm font-medium">Avoid Combining With:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedStone.avoidWith.map((stone) => (
                          <Badge key={stone} variant="outline" className="text-xs border-red-400/50 text-red-300">
                            {stone}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}