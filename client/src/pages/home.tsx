import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ModernBirthForm from "@/components/modern-birth-form";
import PlanetarySymbols from "@/components/planetary-symbols";
import { Star, Shield, Users, Clock, Heart, Briefcase, Dumbbell, Lightbulb, Globe, User, BookOpen, Stars, Sparkles, Sun, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [showBirthForm, setShowBirthForm] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [showSystemDialog, setShowSystemDialog] = useState(false);

  const personalSystems = [
    {
      icon: "☉",
      title: "Western Astrology",
      description: "12 zodiac signs, planetary aspects, house systems with precise Swiss Ephemeris calculations.",
      features: ["Complete natal chart analysis", "Planetary dignities & aspects", "Transit predictions"]
    },
    {
      icon: "ॐ",
      title: "Vedic (Jyotish)",
      description: "Ancient Indian astrology with 27 Nakshatras, Dasha periods, and Ayurvedic connections.",
      features: ["Nakshatra analysis", "Planetary periods (Dasha)", "Dosha constitution"]
    },
    {
      icon: "☯",
      title: "Chinese Zodiac",
      description: "12 animal signs with Five Element theory for personality insights and compatibility.",
      features: ["Animal sign characteristics", "Five element integration", "Annual predictions"]
    },
    {
      icon: "◊",
      title: "Human Design",
      description: "Modern synthesis system with energy types, strategy, and authority for decision-making.",
      features: ["Energy type analysis", "Strategy & Authority", "Centers & channels"]
    },
    {
      icon: "∞",
      title: "Numerology",
      description: "Ancient number science revealing life patterns, destiny, and personal cycles through birth data.",
      features: ["Life path calculation", "Destiny number analysis", "Personal year cycles"]
    }
  ];

  const spaceSystems = [
    {
      icon: "⚹",
      title: "Vaastu Shastra",
      description: "Sacred Indian architecture aligning living spaces with cosmic energies and directional flow.",
      features: ["Directional energy analysis", "Five element balancing", "Sacred geometry principles"]
    },
    {
      icon: "☰",
      title: "Feng Shui",
      description: "Chinese geomancy optimizing Chi energy flow in spaces for harmony and prosperity.",
      features: ["Chi energy optimization", "Bagua map analysis", "Five elements balancing"]
    }
  ];

  const dailyAreas = [
    { icon: Heart, title: "Love & Relationships", color: "text-pink-400" },
    { icon: Briefcase, title: "Career & Finance", color: "text-green-400" },
    { icon: Dumbbell, title: "Health & Wellness", color: "text-blue-400" },
    { icon: Lightbulb, title: "Personal Growth", color: "text-purple-400" }
  ];

  const systemDetails = {
    "Western Astrology": {
      icon: "☉",
      origin: "Ancient Mesopotamia, Greece",
      timeRange: "4,000+ years",
      accuracy: "High",
      difficulty: "Beginner",
      requirements: ["Birth date", "Birth time", "Birth location"],
      overview: "The most popular astrological system in the Western world, based on the tropical zodiac and focusing on personality traits, life events, and timing.",
      keyFeatures: [
        "12 zodiac signs with detailed personality analysis",
        "Planetary aspects and their meanings",
        "House systems for life area predictions",
        "Transit analysis for timing",
        "Compatibility through synastry charts"
      ],
      predictions: [
        "Personality traits and behavioral patterns",
        "Career and life purpose guidance",
        "Relationship compatibility analysis",
        "Timing for major life decisions",
        "Monthly and yearly forecasts"
      ],
      route: "/chart"
    },
    "Vedic (Jyotish)": {
      icon: "ॐ",
      origin: "Ancient India",
      timeRange: "5,000+ years", 
      accuracy: "Very High",
      difficulty: "Advanced",
      requirements: ["Birth date", "Birth time", "Birth location"],
      overview: "The ancient Indian system of astrology that uses the sidereal zodiac and includes detailed timing techniques and spiritual guidance.",
      keyFeatures: [
        "27 Nakshatras (lunar mansions) analysis", 
        "Dasha periods for precise timing",
        "Ayurvedic constitution connections",
        "Spiritual evolution and karma",
        "Detailed remedial measures"
      ],
      predictions: [
        "Life purpose and spiritual path",
        "Career and financial prospects", 
        "Health and Ayurvedic guidance",
        "Marriage and relationship timing",
        "Spiritual practices and remedies"
      ],
      route: "/chart"
    },
    "Chinese Zodiac": {
      icon: "☯",
      origin: "Ancient China",
      timeRange: "4,000+ years",
      accuracy: "Moderate",
      difficulty: "Beginner",
      requirements: ["Birth date", "Birth time (optional)"],
      overview: "The Chinese astrological system based on 12-year cycles with animal signs, five elements, and yin-yang principles.",
      keyFeatures: [
        "12 animal signs with unique characteristics",
        "Five element theory (Wood, Fire, Earth, Metal, Water)",
        "Yin-Yang balance analysis",
        "Annual predictions and cycles",
        "Compatibility between different signs"
      ],
      predictions: [
        "Personality traits and behavioral tendencies",
        "Annual fortune and opportunities",
        "Career and business guidance",
        "Relationship and marriage compatibility",
        "Health and wellness recommendations"
      ],
      route: "/compatibility"
    },
    "Human Design": {
      icon: "◊",
      origin: "Modern (1987)",
      timeRange: "37+ years",
      accuracy: "High",
      difficulty: "Intermediate",
      requirements: ["Birth date", "Birth time", "Birth location"],
      overview: "A modern synthesis system combining astrology, I Ching, Kabbalah, and chakras to reveal your energy type and decision-making strategy.",
      keyFeatures: [
        "4 main energy types (Generator, Projector, Manifestor, Reflector)",
        "Strategy and Authority for decision-making",
        "Centers and channels analysis",
        "Profile lines and life themes",
        "Gates and genetic codes"
      ],
      predictions: [
        "Optimal decision-making strategy",
        "Energy management and workflow",
        "Relationship dynamics and compatibility",
        "Career and life purpose alignment",
        "Personal growth and deconditioning"
      ],
      route: "/personal"
    },
    "Numerology": {
      icon: "∞",
      origin: "Ancient Babylon, Greece",
      timeRange: "4,000+ years",
      accuracy: "Moderate",
      difficulty: "Beginner",
      requirements: ["Birth date", "Full name"],
      overview: "The ancient science of numbers that reveals life patterns, destiny, and personal cycles through mathematical calculations based on your birth date and name.",
      keyFeatures: [
        "Life path number for core personality",
        "Destiny number for life purpose",
        "Soul urge number for inner desires",
        "Personality number for outer image",
        "Personal year cycles for timing"
      ],
      predictions: [
        "Core personality traits and life themes",
        "Life purpose and career guidance",
        "Relationship compatibility through numbers",
        "Annual cycles and timing predictions",
        "Personal strengths and challenges"
      ],
      route: "/numerology"
    },
    "Vaastu Shastra": {
      icon: "⚹",
      origin: "Ancient India",
      timeRange: "5,000+ years",
      accuracy: "High",
      difficulty: "Intermediate",
      requirements: ["Birth place", "Building location"],
      overview: "Sacred Indian architectural science that harmonizes buildings with natural elements and cosmic forces through directional energy flow and elemental balance.",
      keyFeatures: [
        "Directional energy analysis",
        "Five element balancing (Panchamahabhuta)",
        "Sacred geometry principles",
        "Room placement guidelines",
        "Remedial space corrections"
      ],
      predictions: [
        "Home and office energy optimization",
        "Health and wellness through space design",
        "Financial prosperity and abundance",
        "Relationship harmony in living spaces",
        "Career and business success enhancement"
      ],
      route: "/spaces"
    },
    "Feng Shui": {
      icon: "☰",
      origin: "Ancient China",
      timeRange: "4,000+ years",
      accuracy: "High",
      difficulty: "Intermediate",
      requirements: ["Birth date", "Building location"],
      overview: "Ancient Chinese practice that optimizes the flow of energy (Chi) in living and working spaces through compass directions, five elements theory, and environmental factors.",
      keyFeatures: [
        "Chi energy flow optimization",
        "Bagua map analysis",
        "Five elements balancing",
        "Compass school methods",
        "Flying star calculations"
      ],
      predictions: [
        "Chi energy flow optimization",
        "Wealth and prosperity enhancement",
        "Love and relationship attraction",
        "Career advancement and recognition",
        "Health and vitality improvement"
      ],
      route: "/spaces"
    }
  } as const;

  const handleSystemClick = (systemName: string) => {
    setSelectedSystem(systemName);
    setShowSystemDialog(true);
  };

  return (
    <div 
      className="min-h-screen text-white overflow-hidden" 
      style={{background: 'var(--cosmic-gradient-1)'}}
    >
      {/* Floating particles background - match landing page */}
      <div 
        className="fixed inset-0 overflow-hidden pointer-events-none"
      >
        {/* Static celestial background elements - same as landing page */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-pink-400 rounded-full opacity-60" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full opacity-80" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50" />
        <div className="absolute top-1/2 right-10 w-1 h-1 bg-rose-400 rounded-full opacity-70" />
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-gold-400 rounded-full opacity-60" />
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-indigo-400 rounded-full opacity-40" />
      </div>

      {/* Header - Match Landing Page */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Stars className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Torchlight
            </h1>
          </div>
          <Button 
            onClick={() => window.location.href = '/landing'}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 text-sm backdrop-blur-sm"
          >
            Landing Page
          </Button>
        </div>
      </header>

      {/* Hero Section - Match Landing Page Structure */}
      <main className="relative z-10 px-4 pt-8 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline - Match Landing Page */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
              <span 
                style={{
                  background: 'linear-gradient(135deg, hsl(275, 70%, 65%) 0%, hsl(285, 80%, 75%) 50%, hsl(51, 100%, 70%) 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Illuminating Your
              </span>
              <br />
              <span 
                className="block mt-2"
                style={{
                  color: 'hsl(240, 100%, 94%)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                Cosmic Blueprint
              </span>
            </h1>
            
            {/* Enhanced subheadline */}
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 font-light" 
               style={{
                 color: 'hsl(240, 100%, 94%)', 
                 opacity: 0.95,
                 textShadow: '0 1px 4px rgba(0,0,0,0.2)'
               }}>
              Authentic ancient wisdom meets modern precision. Discover your complete astrological profile across{" "}
              <span 
                className="font-medium"
                style={{
                  color: 'hsl(51, 100%, 65%)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}
              >
                Western, Vedic, Chinese & Human Design
              </span> systems.
            </p>
          </div>

          {/* Astrology Systems Grid - Match Landing Page */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center justify-center gap-2 font-accent" style={{color: 'var(--cosmic-lavender)'}}>
              <Sparkles className="w-5 h-5" style={{color: 'var(--cosmic-gold)'}} />
              Explore Ancient Wisdom
            </h3>
            
            {/* Planetary Symbols Row */}
            <PlanetarySymbols />
          </div>

          {/* Features Preview - Match Landing Page */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-400" />
                  Personal Readings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pink-200/80 text-sm">
                  Complete natal chart analysis across all systems with authentic astronomical calculations
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pink-200/80 text-sm">
                  Relationship insights and compatibility analysis across multiple astrological traditions
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Daily Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pink-200/80 text-sm">
                  Personalized daily insights with optimal timing recommendations
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons - Simplified to Match Landing Page */}
          <div className="text-center mb-12">
            <Button 
              onClick={() => setShowBirthForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-xl transition-all duration-300"
            >
              Begin Your Cosmic Journey
            </Button>
          </div>
        </div>
      </main>

      {/* Birth Data Collection Modal */}
      {showBirthForm && (
        <ModernBirthForm onClose={() => setShowBirthForm(false)} />
      )}

      {/* System Information Dialog */}
      <Dialog open={showSystemDialog} onOpenChange={setShowSystemDialog}>
        <DialogContent className="cosmic-card max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedSystem && systemDetails[selectedSystem as keyof typeof systemDetails] && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl">
                  <span className="text-3xl">{systemDetails[selectedSystem as keyof typeof systemDetails].icon}</span>
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {selectedSystem}
                  </span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Overview */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Overview</h4>
                  <p className="text-gray-300 leading-relaxed">
                    {systemDetails[selectedSystem as keyof typeof systemDetails].overview}
                  </p>
                </div>

                {/* System Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-400">Origin</span>
                    </div>
                    <p className="text-white">{systemDetails[selectedSystem as keyof typeof systemDetails].origin}</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-400">Heritage</span>
                    </div>
                    <p className="text-white">{systemDetails[selectedSystem as keyof typeof systemDetails].timeRange}</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-400">Accuracy</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {systemDetails[selectedSystem as keyof typeof systemDetails].accuracy}
                    </Badge>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-400">Difficulty</span>
                    </div>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {systemDetails[selectedSystem as keyof typeof systemDetails].difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {systemDetails[selectedSystem as keyof typeof systemDetails].requirements.map((req, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {systemDetails[selectedSystem as keyof typeof systemDetails].keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Predictions */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">What You'll Discover</h4>
                  <ul className="space-y-2">
                    {systemDetails[selectedSystem as keyof typeof systemDetails].predictions.map((prediction, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{prediction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-700">
                  <Link href={systemDetails[selectedSystem as keyof typeof systemDetails].route}>
                    <Button className="cosmic-button flex-1">
                      Explore {selectedSystem}
                    </Button>
                  </Link>
                  <Link href="/astrology-guide">
                    <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Complete Guide
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Features Overview */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-accent" style={{color: 'var(--cosmic-lavender)'}}>
              Comprehensive Astrological Systems
            </h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--cosmic-lavender)', opacity: 0.9}}>
              The only platform integrating authentic calculations across multiple ancient wisdom traditions with modern precision.
            </p>
          </div>
          
          {/* Personal Systems */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6" style={{color: 'var(--cosmic-gold)'}} />
                <h3 className="text-2xl font-semibold font-accent" style={{color: 'var(--cosmic-lavender)'}}>Personal Systems</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {personalSystems.map((system, index) => (
                <div 
                  key={index} 
                  onClick={() => handleSystemClick(system.title)}
                  className="group cursor-pointer"
                >
                  <div 
                    style={{background: 'var(--cosmic-gradient-1)', opacity: 0.8}} 
                    className="backdrop-blur-sm border border-pink-300/30 rounded-2xl p-4 sm:p-6 text-center hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-pink-500/20"
                  >
                    <div className="text-3xl sm:text-4xl mb-3">
                      {system.icon}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1 transition-colors font-accent" style={{color: 'var(--cosmic-lavender)'}}>
                      {system.title}
                    </h3>
                    <p className="text-xs leading-relaxed mb-3" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                      {system.description}
                    </p>
                    <ul className="space-y-1 text-xs">
                      {system.features.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2" style={{color: 'var(--cosmic-lavender)', opacity: 0.7}}>
                          <span className="w-1 h-1 bg-pink-400 rounded-full mt-1.5 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Space Systems */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6" style={{color: 'var(--cosmic-purple)'}} />
                <h3 className="text-2xl font-semibold font-accent" style={{color: 'var(--cosmic-lavender)'}}>Space & Environment Systems</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {spaceSystems.map((system, index) => (
                <div 
                  key={index} 
                  onClick={() => handleSystemClick(system.title)}
                  className="group cursor-pointer"
                >
                  <div 
                    style={{background: 'var(--cosmic-gradient-1)', opacity: 0.8}} 
                    className="backdrop-blur-sm border border-pink-300/30 rounded-2xl p-6 text-center hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
                  >
                    <div className="text-4xl mb-4">
                      {system.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 transition-colors font-accent" style={{color: 'var(--cosmic-lavender)'}}>
                      {system.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                      {system.description}
                    </p>
                    <ul className="space-y-2 text-sm">
                      {system.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2" style={{color: 'var(--cosmic-lavender)', opacity: 0.7}}>
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Synthesis Feature */}
          <div className="mt-16">
            <div 
              style={{background: 'var(--cosmic-gradient-1)', opacity: 0.9}} 
              className="backdrop-blur-sm border border-pink-300/30 rounded-2xl p-8 text-center shadow-lg"
            >
              <div className="text-5xl mb-6">🌟</div>
              <h3 className="font-semibold text-2xl mb-4 font-accent" style={{color: 'var(--cosmic-gold)'}}>Unique Cross-System Synthesis</h3>
              <p className="text-lg mb-6 max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--cosmic-lavender)', opacity: 0.9}}>
                Our proprietary synthesis engine identifies universal patterns across all systems, providing unified recommendations that resolve conflicts and highlight consistent themes.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-lg font-medium mb-2" style={{color: 'var(--cosmic-gold)'}}>Pattern Detection</div>
                  <p className="text-sm" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>Identifies consistent themes across all systems</p>
                </div>
                <div>
                  <div className="text-lg font-medium mb-2" style={{color: 'var(--cosmic-gold)'}}>Conflict Resolution</div>
                  <p className="text-sm" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>Harmonizes contradictory recommendations</p>
                </div>
                <div>
                  <div className="text-lg font-medium mb-2" style={{color: 'var(--cosmic-gold)'}}>Priority Ranking</div>
                  <p className="text-sm" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>Orders guidance by importance and timing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Guidance Preview */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-accent" style={{color: 'var(--cosmic-lavender)'}}>
              Daily Cosmic Guidance
            </h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--cosmic-lavender)', opacity: 0.9}}>
              Personalized insights based on current planetary transits and your unique astrological blueprint.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dailyAreas.map((area, index) => (
              <div key={index}>
                <div 
                  style={{background: 'var(--cosmic-gradient-1)', opacity: 0.8}} 
                  className="backdrop-blur-sm border border-pink-300/30 rounded-2xl p-6 text-center hover:opacity-100 transition-all duration-300 shadow-lg"
                >
                  <area.icon className={`h-12 w-12 mx-auto mb-4 ${area.color}`} />
                  <h3 className="font-medium mb-2 font-accent" style={{color: 'var(--cosmic-lavender)'}}>
                    {area.title}
                  </h3>
                  <p className="text-sm" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                    Personalized guidance for your {area.title.toLowerCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              className="font-semibold px-8 py-4 rounded-2xl text-lg shadow-2xl transition-all duration-300 font-accent"
              style={{
                background: 'var(--cosmic-gradient-2)',
                color: 'var(--cosmic-lavender)',
                border: 'none'
              }}
            >
              <Clock className="mr-2 h-5 w-5" />
              View Today's Guidance
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 border-t border-pink-300/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold" style={{color: 'var(--cosmic-gold)'}}>☉</span>
                </div>
                <span className="text-xl font-semibold font-accent" style={{color: 'var(--cosmic-gold)'}}>Torchlight</span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                Illuminating your cosmic blueprint through authentic ancient wisdom for practical modern living.
              </p>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="font-semibold mb-4 font-accent" style={{color: 'var(--cosmic-gold)'}}>Features</h4>
              <ul className="space-y-2 text-sm" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                <li>Natal Charts</li>
                <li>Compatibility Analysis</li>
                <li>Daily Horoscopes</li>
                <li>Transit Tracking</li>
                <li>Multi-System Analysis</li>
              </ul>
            </div>
            
            {/* Systems */}
            <div>
              <h4 className="font-semibold mb-4 font-accent" style={{color: 'var(--cosmic-gold)'}}>Astrological Systems</h4>
              <ul className="space-y-2 text-sm" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                <li>Western Astrology</li>
                <li>Vedic (Jyotish)</li>
                <li>Chinese Zodiac</li>
                <li>Human Design</li>
                <li>Cross-System Synthesis</li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4 font-accent" style={{color: 'var(--cosmic-gold)'}}>Support</h4>
              <ul className="space-y-2 text-sm" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact Us</li>
                <li>API Documentation</li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-pink-300/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
              © 2024 Torchlight. Illuminating cosmic wisdom for 25,000+ years of human observation.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4 text-sm" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
              <span>Powered by Swiss Ephemeris</span>
              <span>•</span>
              <span>Authentic Ancient Sources</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
