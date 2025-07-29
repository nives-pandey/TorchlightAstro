import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Sun, 
  Moon, 
  Globe, 
  Zap, 
  BookOpen, 
  Heart, 
  Compass,
  Calendar,
  Clock,
  MapPin,
  User,
  Info
} from 'lucide-react';

interface AstrologySystem {
  id: string;
  name: string;
  icon: React.ReactNode;
  origin: string;
  description: string;
  detailedDescription: string;
  predictions: string[];
  inputs: {
    birthDate: boolean;
    birthTime: boolean;
    birthPlace: boolean;
    name: boolean;
  };
  specialFeatures: string[];
  accuracy: 'High' | 'Very High' | 'Moderate';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeRange: string;
  category: 'Traditional' | 'Modern' | 'Ancient';
}

const astrologySystem: AstrologySystem[] = [
  {
    id: 'western',
    name: 'Western Astrology',
    icon: <Sun className="w-5 h-5" />,
    origin: 'Ancient Greece & Rome',
    description: 'The most popular astrology system worldwide, based on 12 zodiac signs and planetary positions.',
    detailedDescription: 'Western astrology uses the tropical zodiac and focuses on the positions of celestial bodies at birth. It emphasizes personality traits, relationships, and life events through 12 zodiac signs, houses, and planetary aspects. This system is excellent for understanding personality, compatibility, and general life themes.',
    predictions: [
      'Personality traits and character analysis',
      'Love and relationship compatibility',
      'Career guidance and life purpose',
      'Daily, weekly, and monthly forecasts',
      'Life transitions and major events'
    ],
    inputs: {
      birthDate: true,
      birthTime: true,
      birthPlace: true,
      name: false
    },
    specialFeatures: [
      'Natal chart interpretation',
      'Transit predictions',
      'Synastry compatibility',
      'Solar return charts',
      'Progressive astrology'
    ],
    accuracy: 'High',
    difficulty: 'Beginner',
    timeRange: '2,000+ years',
    category: 'Traditional'
  },
  {
    id: 'vedic',
    name: 'Vedic Astrology (Jyotish)',
    icon: <Star className="w-5 h-5" />,
    origin: 'Ancient India',
    description: 'Ancient Indian system using sidereal zodiac with precise timing predictions through Dasha periods.',
    detailedDescription: 'Vedic astrology, or Jyotish, is a sophisticated system from ancient India using the sidereal zodiac and 27 Nakshatras (lunar mansions). It provides incredibly detailed timing predictions through Dasha periods and focuses on karma, dharma, and spiritual growth alongside material predictions.',
    predictions: [
      'Precise life event timing (Dasha periods)',
      'Karmic patterns and spiritual purpose',
      'Health and wellness guidance',
      'Marriage and relationship timing',
      'Career and financial predictions',
      'Remedial measures and solutions'
    ],
    inputs: {
      birthDate: true,
      birthTime: true,
      birthPlace: true,
      name: true
    },
    specialFeatures: [
      'Nakshatra analysis',
      'Dasha and Bhukti periods',
      'Sade Sati predictions',
      'Varshphal (annual predictions)',
      'Gem and mantra recommendations'
    ],
    accuracy: 'Very High',
    difficulty: 'Advanced',
    timeRange: '5,000+ years',
    category: 'Ancient'
  },
  {
    id: 'chinese',
    name: 'Chinese Astrology',
    icon: <Globe className="w-5 h-5" />,
    origin: 'Ancient China',
    description: 'Based on 12-year animal cycles and five elements, with detailed BaZi (Four Pillars) analysis.',
    detailedDescription: 'Chinese astrology combines a 12-year animal cycle with five elements (Wood, Fire, Earth, Metal, Water). The advanced BaZi system uses four pillars representing year, month, day, and hour of birth to provide detailed life analysis and timing predictions.',
    predictions: [
      'Personality based on animal signs',
      'Annual and monthly forecasts',
      'Compatibility between signs',
      'BaZi life path analysis',
      'Elemental balance and harmony',
      'Feng Shui recommendations'
    ],
    inputs: {
      birthDate: true,
      birthTime: true,
      birthPlace: true,
      name: false
    },
    specialFeatures: [
      '12 animal signs analysis',
      'Five elements theory',
      'BaZi Four Pillars system',
      'Chinese calendar calculations',
      'Elemental compatibility'
    ],
    accuracy: 'High',
    difficulty: 'Intermediate',
    timeRange: '4,000+ years',
    category: 'Traditional'
  },
  {
    id: 'human-design',
    name: 'Human Design',
    icon: <Zap className="w-5 h-5" />,
    origin: 'Modern Synthesis (1987)',
    description: 'Modern system combining astrology, I Ching, Kabbalah, and chakras for energy type identification.',
    detailedDescription: 'Human Design is a revolutionary modern system that synthesizes astrology, I Ching, Kabbalah, and chakra systems. It creates a unique BodyGraph showing your energy type, decision-making authority, and life strategy for optimal living and relationships.',
    predictions: [
      'Energy type and life strategy',
      'Decision-making authority',
      'Relationship dynamics',
      'Career and life purpose',
      'Health and well-being patterns',
      'Conditioning and authenticity'
    ],
    inputs: {
      birthDate: true,
      birthTime: true,
      birthPlace: true,
      name: false
    },
    specialFeatures: [
      'BodyGraph analysis',
      'Energy centers and gates',
      'Type and strategy guidance',
      'Authority determination',
      'Profile and incarnation cross'
    ],
    accuracy: 'High',
    difficulty: 'Intermediate',
    timeRange: '35+ years',
    category: 'Modern'
  },
  {
    id: 'kp',
    name: 'KP Astrology',
    icon: <Compass className="w-5 h-5" />,
    origin: 'Modern India (1960s)',
    description: 'Refined Vedic system using sub-lord theory for precise event timing and horary predictions.',
    detailedDescription: 'Krishnamurti Paddhati (KP) is a modern refinement of Vedic astrology developed by Prof. K.S. Krishnamurti. It uses the sub-lord theory and unequal house divisions for extremely precise event timing and accurate predictions.',
    predictions: [
      'Precise event timing',
      'Horary question answers',
      'Yes/no predictions',
      'Marriage and career timing',
      'Financial predictions',
      'Health and wellness timing'
    ],
    inputs: {
      birthDate: true,
      birthTime: true,
      birthPlace: true,
      name: false
    },
    specialFeatures: [
      'Sub-lord theory',
      'Cuspal sub-lords',
      'Horary astrology',
      'Significator analysis',
      'Ruling planet technique'
    ],
    accuracy: 'Very High',
    difficulty: 'Advanced',
    timeRange: '60+ years',
    category: 'Modern'
  },
  {
    id: 'lal-kitab',
    name: 'Lal Kitab',
    icon: <BookOpen className="w-5 h-5" />,
    origin: 'India (19th Century)',
    description: 'Unique system combining astrology and palmistry with practical remedies for planetary influences.',
    detailedDescription: 'Lal Kitab (Red Book) is a distinctive Indian astrological system that combines traditional astrology with palmistry. It focuses on practical remedies, charitable acts, and simple solutions to neutralize negative planetary influences.',
    predictions: [
      'Planetary influences and effects',
      'Practical remedial measures',
      'Life challenges and solutions',
      'Charitable and spiritual guidance',
      'Family and relationship dynamics',
      'Financial and career guidance'
    ],
    inputs: {
      birthDate: true,
      birthTime: true,
      birthPlace: true,
      name: true
    },
    specialFeatures: [
      'Unique chart interpretation',
      'Practical remedies',
      'Palmistry integration',
      'Charitable solutions',
      'Simple yet effective measures'
    ],
    accuracy: 'High',
    difficulty: 'Intermediate',
    timeRange: '200+ years',
    category: 'Traditional'
  },
  {
    id: 'hellenistic',
    name: 'Hellenistic Astrology',
    icon: <Moon className="w-5 h-5" />,
    origin: 'Ancient Greece',
    description: 'Original Western astrology system with time-lord techniques and sect (day/night) considerations.',
    detailedDescription: 'Hellenistic astrology is the foundational system of Western astrology from ancient Greece. It uses sophisticated time-lord techniques, sect considerations (day vs night charts), and authentic ancient methods for detailed life analysis.',
    predictions: [
      'Time-lord periods and phases',
      'Sect-based interpretations',
      'Ancient predictive techniques',
      'Profections and transits',
      'Natal chart analysis',
      'Annual solar returns'
    ],
    inputs: {
      birthDate: true,
      birthTime: true,
      birthPlace: true,
      name: false
    },
    specialFeatures: [
      'Time-lord systems',
      'Sect analysis',
      'Ancient techniques',
      'Profections',
      'Traditional dignities'
    ],
    accuracy: 'High',
    difficulty: 'Advanced',
    timeRange: '2,500+ years',
    category: 'Ancient'
  },
  {
    id: 'numerology',
    name: 'Numerology',
    icon: <Calendar className="w-5 h-5" />,
    origin: 'Ancient Babylon',
    description: 'Number-based system using birth date and name to reveal life path, destiny, and personality.',
    detailedDescription: 'Numerology is an ancient metaphysical system that uses the vibrations and meanings of numbers derived from your birth date and name. It reveals your life path, destiny number, soul urge, and personality characteristics through mathematical calculations.',
    predictions: [
      'Life path and destiny',
      'Personality characteristics',
      'Soul purpose and mission',
      'Compatibility and relationships',
      'Personal year cycles',
      'Name meaning and vibration'
    ],
    inputs: {
      birthDate: true,
      birthTime: false,
      birthPlace: false,
      name: true
    },
    specialFeatures: [
      'Life path calculation',
      'Destiny number analysis',
      'Soul urge and personality',
      'Personal year predictions',
      'Name numerology'
    ],
    accuracy: 'Moderate',
    difficulty: 'Beginner',
    timeRange: '4,000+ years',
    category: 'Ancient'
  },
  {
    id: 'vaastu',
    name: 'Vaastu Shastra',
    icon: <Compass className="w-5 h-5" />,
    origin: 'Ancient India',
    description: 'Sacred Indian architecture system aligning living spaces with cosmic energies and directions.',
    detailedDescription: 'Vaastu Shastra is an ancient Indian architectural science that harmonizes buildings with natural elements and cosmic forces. It uses directional energy flow, elemental balance (Panchamahabhuta), and sacred geometry to create spaces that support health, prosperity, and spiritual well-being.',
    predictions: [
      'Home and office energy optimization',
      'Health and wellness through space design',
      'Financial prosperity and abundance',
      'Relationship harmony in living spaces',
      'Career and business success enhancement',
      'Spiritual growth and peace'
    ],
    inputs: {
      birthDate: false,
      birthTime: false,
      birthPlace: true,
      name: false
    },
    specialFeatures: [
      'Directional energy analysis',
      'Five element balancing',
      'Sacred geometry principles',
      'Room placement guidelines',
      'Remedial space corrections'
    ],
    accuracy: 'High',
    difficulty: 'Intermediate',
    timeRange: '5,000+ years',
    category: 'Ancient'
  },
  {
    id: 'feng-shui',
    name: 'Feng Shui',
    icon: <Globe className="w-5 h-5" />,
    origin: 'Ancient China',
    description: 'Chinese geomancy system optimizing energy flow (Chi) in spaces for harmony and prosperity.',
    detailedDescription: 'Feng Shui is an ancient Chinese practice that optimizes the flow of energy (Chi) in living and working spaces. It combines compass directions, five elements theory, and environmental factors to create harmonious spaces that support health, wealth, relationships, and personal growth.',
    predictions: [
      'Chi energy flow optimization',
      'Wealth and prosperity enhancement',
      'Love and relationship attraction',
      'Career advancement and recognition',
      'Health and vitality improvement',
      'Family harmony and protection'
    ],
    inputs: {
      birthDate: true,
      birthTime: false,
      birthPlace: true,
      name: false
    },
    specialFeatures: [
      'Bagua map analysis',
      'Five elements balancing',
      'Compass school methods',
      'Flying star calculations',
      'Form school landscape reading'
    ],
    accuracy: 'High',
    difficulty: 'Intermediate',
    timeRange: '4,000+ years',
    category: 'Traditional'
  }
];

export default function AstrologySystemsGuide() {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [category, setCategory] = useState<'all' | 'Traditional' | 'Modern' | 'Ancient'>('all');

  const filteredSystems = category === 'all' 
    ? astrologySystem 
    : astrologySystem.filter(system => system.category === category);

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case 'Very High': return 'bg-green-100 text-green-800 border-green-300';
      case 'High': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Moderate': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="w-full">
      <TooltipProvider>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Complete Guide to Astrology Systems
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Discover the rich diversity of astrological traditions from around the world. Each system offers unique insights 
            into personality, relationships, timing, life purpose, and living spaces through different methodologies and cultural perspectives.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">10</div>
              <div className="text-sm text-gray-400">Complete Systems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">5,000+</div>
              <div className="text-sm text-gray-400">Years Heritage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">3</div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <Tabs value={category} onValueChange={(value: any) => setCategory(value)} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="all">All Systems</TabsTrigger>
              <TabsTrigger value="Ancient">Ancient</TabsTrigger>
              <TabsTrigger value="Traditional">Traditional</TabsTrigger>
              <TabsTrigger value="Modern">Modern</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Systems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredSystems.map((system) => (
            <HoverCard key={system.id}>
              <HoverCardTrigger asChild>
                <Card 
                  className={`cosmic-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedSystem === system.id ? 'ring-2 ring-orange-400' : ''
                  }`}
                  onClick={() => setSelectedSystem(selectedSystem === system.id ? null : system.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          {system.icon}
                        </div>
                        <div>
                          <CardTitle className="text-orange-400 text-lg">{system.name}</CardTitle>
                          <p className="text-sm text-gray-400">{system.origin}</p>
                        </div>
                      </div>
                      <Info className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-4">{system.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={`text-xs ${getAccuracyColor(system.accuracy)}`}>
                        {system.accuracy} Accuracy
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(system.difficulty)}`}>
                        {system.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-purple-300 border-purple-400">
                        {system.timeRange}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{system.inputs.birthDate ? '✓' : '✗'}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Birth Date Required</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{system.inputs.birthTime ? '✓' : '✗'}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Birth Time Required</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{system.inputs.birthPlace ? '✓' : '✗'}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Birth Place Required</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{system.inputs.name ? '✓' : '✗'}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Name Used</TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-96 bg-slate-800 border-slate-600">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-orange-400 mb-2">About {system.name}</h4>
                    <p className="text-sm text-gray-300">{system.detailedDescription}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-purple-300 mb-2">Key Predictions:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {system.predictions.slice(0, 3).map((prediction, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-400 mt-1">•</span>
                          {prediction}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-purple-300 mb-2">Special Features:</h5>
                    <div className="flex flex-wrap gap-1">
                      {system.specialFeatures.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-gray-300 border-gray-500">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>

        {/* Detailed System View */}
        {selectedSystem && (
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="text-orange-400 text-2xl flex items-center gap-3">
                {filteredSystems.find(s => s.id === selectedSystem)?.icon}
                {filteredSystems.find(s => s.id === selectedSystem)?.name} - Complete Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const system = filteredSystems.find(s => s.id === selectedSystem);
                if (!system) return null;
                
                return (
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-purple-300 mb-3">System Overview</h4>
                        <p className="text-gray-300">{system.detailedDescription}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-300 mb-3">What This System Predicts</h4>
                        <ul className="space-y-2">
                          {system.predictions.map((prediction, index) => (
                            <li key={index} className="flex items-start gap-3 text-gray-300">
                              <Heart className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                              {prediction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-purple-300 mb-3">Required Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className={`p-3 rounded-lg border ${system.inputs.birthDate ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            <Calendar className="w-5 h-5 mb-2" />
                            <div className="text-sm">
                              <div className="font-medium">Birth Date</div>
                              <div className="text-gray-400">{system.inputs.birthDate ? 'Required' : 'Not needed'}</div>
                            </div>
                          </div>
                          
                          <div className={`p-3 rounded-lg border ${system.inputs.birthTime ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            <Clock className="w-5 h-5 mb-2" />
                            <div className="text-sm">
                              <div className="font-medium">Birth Time</div>
                              <div className="text-gray-400">{system.inputs.birthTime ? 'Required' : 'Not needed'}</div>
                            </div>
                          </div>
                          
                          <div className={`p-3 rounded-lg border ${system.inputs.birthPlace ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            <MapPin className="w-5 h-5 mb-2" />
                            <div className="text-sm">
                              <div className="font-medium">Birth Place</div>
                              <div className="text-gray-400">{system.inputs.birthPlace ? 'Required' : 'Not needed'}</div>
                            </div>
                          </div>
                          
                          <div className={`p-3 rounded-lg border ${system.inputs.name ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            <User className="w-5 h-5 mb-2" />
                            <div className="text-sm">
                              <div className="font-medium">Full Name</div>
                              <div className="text-gray-400">{system.inputs.name ? 'Used in analysis' : 'Not needed'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-300 mb-3">Special Features & Techniques</h4>
                        <div className="flex flex-wrap gap-2">
                          {system.specialFeatures.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-purple-300 border-purple-400">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                          <div className="text-lg font-bold text-orange-400">{system.accuracy}</div>
                          <div className="text-sm text-gray-400">Accuracy</div>
                        </div>
                        <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                          <div className="text-lg font-bold text-purple-400">{system.difficulty}</div>
                          <div className="text-sm text-gray-400">Difficulty</div>
                        </div>
                        <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                          <div className="text-lg font-bold text-pink-400">{system.timeRange}</div>
                          <div className="text-sm text-gray-400">Heritage</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Quick Comparison */}
        <Card className="cosmic-card mt-8">
          <CardHeader>
            <CardTitle className="text-orange-400">Quick Comparison Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-purple-300 mb-2">For Beginners:</h4>
                <div className="flex gap-2">
                  {astrologySystem.filter(s => s.difficulty === 'Beginner').map(system => (
                    <Badge key={system.id} className="bg-green-500/20 text-green-300 border-green-500/30">
                      {system.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Highest Accuracy:</h4>
                <div className="flex gap-2">
                  {astrologySystem.filter(s => s.accuracy === 'Very High').map(system => (
                    <Badge key={system.id} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {system.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Ancient Wisdom:</h4>
                <div className="flex gap-2">
                  {astrologySystem.filter(s => s.category === 'Ancient').map(system => (
                    <Badge key={system.id} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {system.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
}