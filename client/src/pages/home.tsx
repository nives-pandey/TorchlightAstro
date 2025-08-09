import { useState } from "react";
import { Button } from "@/components/ui/button";
import DonationModal from "@/components/donation-modal";
import { useDonationModal } from "@/hooks/useDonationModal";
import EnergyExchange from "@/components/EnergyExchange";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SimpleBirthForm from "@/components/simple-birth-form";
import ChartResults from "@/components/chart-results";

import FeatureHoverCard from "@/components/feature-hover-card";
import Navigation from "@/components/navigation";
import { Star, Shield, Users, Clock, Heart, Briefcase, Dumbbell, Lightbulb, Globe, User, BookOpen, Stars, Sparkles, Sun, Calendar, ArrowLeft, Home as HomeIcon, Coffee, Coins, Building2, UserCircle, Award } from "lucide-react";
import { Link } from "wouter";
import { TorchlightLogo } from "@/components/torchlight-logo";

export default function Home() {
  const [showBirthForm, setShowBirthForm] = useState(false);
  const { isOpen, trigger, showModal, closeModal } = useDonationModal();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [showSystemDialog, setShowSystemDialog] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Force component update for cache clearing - v2024.1.31
  const [, forceUpdate] = useState({});

  // Organized from oldest to latest (historical chronological order)
  const personalSystems = [
    {
      icon: "ॐ",
      title: "Vedic (Jyotish)",
      description: "Ancient Indian astrology with 27 Nakshatras, Dasha periods, and Ayurvedic connections.",
      features: ["Nakshatra analysis", "Planetary periods (Dasha)", "Dosha constitution"]
    },
    {
      icon: "☯",
      title: "Chinese Zodiac", 
      description: "Ancient system with 12 animal signs and Five Element theory for personality insights.",
      features: ["Animal sign characteristics", "Five element integration", "Annual predictions"]
    },
    {
      icon: "∞",
      title: "Numerology",
      description: "Ancient Pythagorean number science revealing life patterns, destiny, and personal cycles through birth data.",
      features: ["Life path calculation", "Destiny number analysis", "Personal year cycles"]
    },
    {
      icon: "☉",
      title: "Western Astrology",
      description: "12 zodiac signs, planetary aspects, house systems with precise Swiss Ephemeris calculations.",
      features: ["Complete natal chart analysis", "Planetary dignities & aspects", "Transit predictions"]
    },
    {
      icon: "◊",
      title: "Human Design",
      description: "Modern synthesis system with energy types, strategy, and authority for decision-making.",
      features: ["Energy type analysis", "Strategy & Authority", "Centers & channels"]
    }
  ];

  // Space systems organized by age
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
    { icon: Heart, title: "Love & Relationships", color: "text-gray-400" },
    { icon: Briefcase, title: "Career & Finance", color: "text-gray-400" },
    { icon: Dumbbell, title: "Health & Wellness", color: "text-emerald-400" },
    { icon: Lightbulb, title: "Personal Growth", color: "text-yellow-500" }
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
        "Personalized gemstone recommendations",
        "Detailed remedial measures"
      ],
      predictions: [
        "Life purpose and spiritual path",
        "Career and financial prospects", 
        "Health and Ayurvedic guidance",
        "Marriage and relationship timing",
        "Gemstone therapy and remedies"
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
    ...(process.env.NODE_ENV === 'development' ? {
      "Human Design": {
        icon: "◊",
        origin: "Modern (1987) - Development Only",
        timeRange: "37+ years",
        accuracy: "Under Review",
        difficulty: "Intermediate",
        requirements: ["Birth date", "Birth time", "Birth location"],
        overview: "⚠️ DEVELOPMENT MODE: System calculations under authenticity review. Modern synthesis combining astrology, I Ching, Kabbalah, and chakras.",
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
      }
    } : {}),
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
    >
      {/* Floating particles background - match landing page */}
      <div 
        className="fixed inset-0 overflow-hidden pointer-events-none"
      >
        {/* Static celestial background elements - same as landing page */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-pink-400 rounded-full opacity-60" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-teal-300 rounded-full opacity-80" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-yellow-500 rounded-full opacity-50" />
        <div className="absolute top-1/2 right-10 w-1 h-1 bg-rose-400 rounded-full opacity-70" />
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-gold-400 rounded-full opacity-60" />
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-yellow-500 rounded-full opacity-40" />
      </div>

      {/* Header - Match Landing Page */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-yellow-600 rounded-full flex items-center justify-center">
              <Stars className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Torchlight
            </h1>
          </div>
          <div className="text-sm text-teal-200/70">
            Welcome to Torchlight ✨
          </div>
        </div>
      </header>

      {/* Hero Section - Match Landing Page Structure */}
      <main className="relative z-10 px-4 pt-8 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline - Match Landing Page */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight sm:leading-[1.1] tracking-tight font-heading px-2">
              <span 
                style={{
                  background: 'linear-gradient(135deg, hsl(44, 45%, 65%) 0%, hsl(180, 25%, 55%) 50%, hsl(30, 8%, 18%) 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Illuminating Your
              </span>
              <br />
              <span 
                className="block mt-1 sm:mt-2"
                style={{
                  color: 'hsl(60, 10%, 96%)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                Cosmic Blueprint
              </span>
            </h1>
            
            {/* Enhanced subheadline */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 font-body px-4" 
               style={{
                 color: 'hsl(60, 10%, 96%)', 
                 opacity: 0.95,
                 textShadow: '0 1px 4px rgba(0,0,0,0.2)'
               }}>
              Authentic ancient wisdom meets modern precision. Discover your complete astrological profile across{" "}
              <span 
                className="font-medium"
                style={{
                  color: 'var(--primary-accent)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}
              >
                Western, Vedic, Chinese, Human Design, Numerology, Vaastu, Feng Shui, Color & Gemstone
              </span> systems with personalized gemstone recommendations based on Vedic traditions.
            </p>
            
            {/* Primary CTA - Expert Recommended Modal Approach */}
            <div className="text-center mb-8 sm:mb-12">
              <Button 
                onClick={() => setShowBirthForm(true)}
                className="text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(44, 45%, 65%) 0%, hsl(180, 25%, 55%) 50%, hsl(30, 8%, 18%) 100%)',
                  border: 'none',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  boxShadow: '0 8px 32px rgba(197, 165, 90, 0.3)'
                }}
              >
                <Stars className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                Begin Your Cosmic Journey Now ✨
              </Button>
              <p className="text-teal-200/70 text-sm mt-3">
                Create your complete astrological profile in minutes
              </p>
            </div>
          </div>

          {/* Core Features Grid - The 4 main sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 px-2">
            <FeatureHoverCard
              title="Personal Astrology"
              status="available"
              description="Comprehensive individual astrological analysis combining Western, Vedic, Chinese, Numerology, and Human Design systems for complete self-understanding."
              expectedDate="Available Now"
              features={[
                "Complete Western natal chart",
                "Vedic birth chart & dashas",
                "Chinese zodiac & Five Elements",
                "Numerology life path analysis",
                "Human Design bodygraph"
              ]}
            >
              <Link href="/personal">
                <Card className="mobile-card hover:scale-105 transition-all duration-300 cursor-pointer min-h-[120px] sm:min-h-[140px]">
                  <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                    <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2 leading-tight">
                      <UserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
                      <span className="truncate">Personal Astrology</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <CardDescription className="text-teal-100/80 text-xs sm:text-sm leading-relaxed">
                      Deep individual insights across multiple astrological traditions
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </FeatureHoverCard>

            <FeatureHoverCard
              title="Relationships"
              status="coming-soon"
              description="Deep relationship compatibility analysis combining Western, Vedic, Chinese, and Numerology systems for comprehensive partnership insights."
              expectedDate="Coming Soon"
              features={[
                "Synastry chart analysis",
                "Composite relationship charts", 
                "Cross-system compatibility scoring",
                "Relationship timing predictions",
                "Soul mate indicators"
              ]}
            >
              <Link href="/compatibility">
                <Card className="sanctuary-card bg-gradient-to-br from-gray-800/50 to-gray-900/70 border-gray-500/30 backdrop-blur-sm rounded-2xl cursor-pointer transition-all duration-300 opacity-75">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-300 text-lg flex items-center gap-2">
                      <Heart className="w-6 h-6 text-gray-400" />
                      Relationships
                      <span className="ml-auto text-xs bg-gray-600/30 text-gray-400 px-2 py-1 rounded-full">COMING SOON</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400/80 text-sm">
                      Relationship insights and compatibility analysis across multiple astrological traditions
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </FeatureHoverCard>

            <FeatureHoverCard
              title="Homes & Spaces"
              status="in-development"
              description="Sacred space optimization using Vaastu Shastra and Feng Shui principles for harmonious living and working environments."
              expectedDate="Coming Soon"
              
              features={[
                "Vaastu Shastra analysis",
                "Feng Shui energy mapping",
                "Sacred geometry alignment",
                "Five elements balancing",
                "Directional energy optimization"
              ]}
            >
              <Link href="/spaces">
                <Card className="sanctuary-card bg-gradient-to-br from-gray-800/50 to-gray-900/70 border-gray-500/30 backdrop-blur-sm rounded-2xl cursor-pointer transition-all duration-300 opacity-75">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-300 text-lg flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-gray-400" />
                      Homes & Spaces
                      <span className="ml-auto text-xs bg-gray-600/30 text-gray-400 px-2 py-1 rounded-full">COMING SOON</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400/80 text-sm">
                      Sacred space optimization using ancient Vaastu and Feng Shui principles
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </FeatureHoverCard>

            <FeatureHoverCard
              title="Business Analysis"
              status="coming-soon"
              description="Business astrology combining multiple systems for optimal timing, partnerships, and strategic decision-making in professional ventures."
              expectedDate="Coming Soon"
              features={[
                "Business launch timing",
                "Partnership compatibility",
                "Financial forecast analysis",
                "Market timing insights",
                "Strategic decision support"
              ]}
            >
              <Link href="/business">
                <Card className="sanctuary-card bg-gradient-to-br from-gray-800/50 to-gray-900/70 border-gray-500/30 backdrop-blur-sm rounded-2xl cursor-pointer transition-all duration-300 opacity-75">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-300 text-lg flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-blue-400" />
                      Business Analysis
                      <span className="ml-auto text-xs bg-gray-600/30 text-gray-400 px-2 py-1 rounded-full">COMING SOON</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400/80 text-sm">
                      Professional astrology for optimal business timing and strategic decisions
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </FeatureHoverCard>
          </div>

          {/* Explore Ancient Wisdom Section */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center justify-center gap-2 font-heading" style={{color: 'var(--sage-teal)'}}>
              <Sparkles className="w-5 h-5" style={{color: 'var(--brushed-gold)'}} />
              Explore Ancient Wisdom
            </h3>
            
            {/* 5 Astrological Systems Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {personalSystems.map((system, index) => (
                <Card key={index} className="sanctuary-card bg-gradient-to-br from-gray-800/50 to-gray-900/70 border-gray-500/30 backdrop-blur-sm rounded-xl cursor-pointer transition-all duration-300 opacity-75">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm text-center flex flex-col items-center gap-2">
                      <span className="text-2xl">{system.icon}</span>
                      {system.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-teal-100/80 text-xs text-center">
                      {system.description.length > 80 ? system.description.substring(0, 80) + "..." : system.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Demo and Report Buttons - Moved here from below */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <FeatureHoverCard
                title="Sample Chart Output"
                status="available"
                description="View comprehensive multi-system astrological analysis with real chart examples and lifestyle intelligence."
                features={[
                  "Complete Western & Vedic analysis",
                  "Chinese zodiac & Five Elements",
                  "Numerology & Human Design",
                  "Lifestyle recommendations",
                  "Cross-system synthesis"
                ]}
              >
                <Link href="/demo-chart">
                  <Button 
                    variant="outline"
                    className="sanctuary-card w-full bg-gradient-to-br from-gray-800/50 to-gray-900/70 border-gray-500/30 hover:border-teal-300/50 text-white font-semibold px-4 py-3 rounded-xl transform hover:scale-105 transition-all duration-300"
                  >
                    🔮 3D Cosmos
                  </Button>
                </Link>
              </FeatureHoverCard>
              
              <Link href="/comprehensive-report">
                <Button 
                  variant="outline"
                  className="sanctuary-card w-full bg-gradient-to-br from-gray-800/50 to-gray-900/70 border-gray-500/30 hover:border-teal-300/50 text-white font-semibold px-4 py-3 rounded-xl transform hover:scale-105 transition-all duration-300"
                >
                  📊 5-Page Report
                </Button>
              </Link>

              <FeatureHoverCard
                title="Lifestyle Intelligence"
                status="available"
                description="Personalized lifestyle recommendations including travel destinations, color therapy, and Vedic-based gemstone guidance."
                features={[
                  "Travel destination recommendations",
                  "Personalized color therapy",
                  "Vedic gemstone & crystal guidance",
                  "Feng Shui & Vaastu principles",
                  "Health & wellness insights"
                ]}
              >
                <Link href="/lifestyle-intelligence">
                  <Button 
                    variant="outline"
                    className="sanctuary-card w-full bg-gradient-to-br from-gray-800/50 to-gray-900/70 border-gray-500/30 hover:border-teal-300/50 text-white font-semibold px-4 py-3 rounded-xl transform hover:scale-105 transition-all duration-300"
                  >
                    🌟 Lifestyle
                  </Button>
                </Link>
              </FeatureHoverCard>

              <Link href="/gemstone-lifestyle-pairing">
                <Button 
                  variant="outline"
                  className="sanctuary-card w-full bg-gradient-to-br from-gray-800/50 to-gray-900/70 border-gray-500/30 hover:border-teal-300/50 text-white font-semibold px-4 py-3 rounded-xl transform hover:scale-105 transition-all duration-300"
                >
                  💎 Gemstone Analysis
                </Button>
              </Link>
            </div>
          </div>

          {/* Ancient Wisdom For Everyone */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Ancient Wisdom For Everyone</h2>
            <p className="text-teal-200/80 max-w-3xl mx-auto mb-8">
              Illuminating the cosmic connections between celestial movements and human experience through authentic calculations and traditional interpretations
            </p>
          </div>

          {/* Main CTA - Enhanced */}
          <div className="text-center mb-12 space-y-6">
            <Button 
              onClick={() => setShowBirthForm(true)}
              className="sanctuary-button text-xl px-12 py-6 bg-gradient-to-r from-yellow-600 to-gray-600 hover:from-yellow-600 hover:to-gray-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Begin Your Cosmic Journey Now ✨
            </Button>
            
            <p className="text-gray-400 text-sm mt-2">
              See comprehensive chart analysis + personalized lifestyle recommendations ($200+ value)
            </p>
          </div>

          {/* Core Features Grid - Enhanced with Proper Icons and Consistent Styling */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FeatureHoverCard
              title="Personal Astrology"
              status="available"
              description="Complete natal chart analysis across Western, Vedic, Chinese, Human Design, and Numerology systems with Swiss Ephemeris precision."
              features={[
                "Multi-system natal chart analysis",
                "Swiss Ephemeris astronomical calculations",
                "Cross-system personality insights",
                "Life path and destiny analysis",
                "PDF report generation"
              ]}
            >
              <Link href="/personal">
                <Card className="sanctuary-card bg-gradient-to-br from-emerald-900/70 to-teal-800/70 border-emerald-400/40 backdrop-blur-sm rounded-2xl cursor-pointer hover:from-emerald-800/80 hover:to-teal-700/80 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-300 text-lg flex items-center gap-2">
                      <UserCircle className="w-6 h-6 text-emerald-400" />
                      Personal Astrology
                      <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">ACTIVE</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-emerald-100/90 text-sm">
                      Complete natal chart analysis across all ancient systems with authentic astronomical calculations
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </FeatureHoverCard>

            <FeatureHoverCard
              title="Relationships"
              status="coming-soon"
              description="Deep relationship compatibility analysis combining Western, Vedic, Chinese, and Numerology systems for comprehensive partnership insights."
              expectedDate="Coming Soon"
              features={[
                "Synastry chart analysis",
                "Composite relationship charts", 
                "Cross-system compatibility scoring",
                "Relationship timing predictions",
                "Soul mate indicators"
              ]}
            >
              <Link href="/compatibility">
                <Card className="sanctuary-card bg-gradient-to-br from-gray-800/50 to-gray-900/70 border-gray-500/30 backdrop-blur-sm rounded-2xl cursor-pointer transition-all duration-300 opacity-75">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-300 text-lg flex items-center gap-2">
                      <Heart className="w-6 h-6 text-gray-400" />
                      Relationships
                      <span className="ml-auto text-xs bg-gray-600/30 text-gray-400 px-2 py-1 rounded-full">COMING SOON</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400/80 text-sm">
                      Relationship insights and compatibility analysis across multiple astrological traditions
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </FeatureHoverCard>

            <FeatureHoverCard
              title="Homes & Spaces"
              status="in-development"
              description="Sacred space optimization using Vaastu Shastra and Feng Shui principles for harmonious living and working environments."
              expectedDate="Coming Soon"
              
              features={[
                "Vaastu Shastra analysis",
                "Feng Shui energy mapping",
                "Sacred geometry alignment",
                "Five elements balancing",
                "Directional energy optimization"
              ]}
            >
              <Link href="/spaces">
                <Card className="sanctuary-card bg-gradient-to-br from-gray-800/50 to-gray-900/70 border-gray-500/30 backdrop-blur-sm rounded-2xl cursor-pointer transition-all duration-300 opacity-75">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-300 text-lg flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-gray-400" />
                      Homes & Spaces
                      <span className="ml-auto text-xs bg-gray-600/30 text-gray-400 px-2 py-1 rounded-full">COMING SOON</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400/80 text-sm">
                      Sacred space optimization using ancient Vaastu and Feng Shui principles
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </FeatureHoverCard>

            <FeatureHoverCard
              title="Business Analysis"
              status="coming-soon"
              description="Business astrology combining multiple systems for optimal timing, partnerships, and strategic decision-making in professional ventures."
              expectedDate="Coming Soon"
              features={[
                "Business launch timing",
                "Partnership compatibility",
                "Financial forecast analysis",
                "Market timing insights",
                "Strategic decision support"
              ]}
            >
              <Link href="/business">
                <Card className="sanctuary-card bg-gradient-to-br from-gray-800/50 to-gray-900/70 border-gray-500/30 backdrop-blur-sm rounded-2xl cursor-pointer transition-all duration-300 opacity-75">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-300 text-lg flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-blue-400" />
                      Business Analysis
                      <span className="ml-auto text-xs bg-gray-600/30 text-gray-400 px-2 py-1 rounded-full">COMING SOON</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400/80 text-sm">
                      Professional astrology for optimal business timing and strategic decisions
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </FeatureHoverCard>
          </div>

          {/* Ancient Wisdom For Everyone */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Ancient Wisdom For Everyone</h2>
            <p className="text-teal-200/80 max-w-3xl mx-auto mb-8">
              Illuminating the cosmic connections between celestial movements and human experience through authentic calculations and traditional interpretations
            </p>
          </div>

          {/* Main CTA - Enhanced */}
          <div className="text-center mb-12 space-y-6">
            <Button 
              onClick={() => setShowBirthForm(true)}
              className="sanctuary-button text-xl px-12 py-6 bg-gradient-to-r from-yellow-600 to-gray-600 hover:from-yellow-600 hover:to-gray-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Begin Your Cosmic Journey Now ✨
            </Button>
            
            <p className="text-gray-400 text-sm mt-2">
              See comprehensive chart analysis + personalized lifestyle recommendations ($200+ value)
            </p>
          </div>

          {/* Sacred Energy Exchange - Expert Implementation */}
          <div className="text-center mb-12">
            <div className="max-w-4xl mx-auto">
              <EnergyExchange onContribute={() => console.log('Payment initiated')} />
            </div>
          </div>

        </div>
      </main>

      {/* Birth Data Collection Modal */}
      {showBirthForm && (
        <SimpleBirthForm 
          onClose={() => setShowBirthForm(false)} 
          onComplete={(data) => {
            setChartData(data);
            setShowResults(true);
            // Show donation modal after chart generation with delay
            setTimeout(() => {
              showModal({ type: 'chart_generated', delay: 3000 });
            }, 1000);
            setShowBirthForm(false);
          }}
        />
      )}

      {showResults && chartData && (
        <ChartResults 
          data={chartData} 
          onClose={() => {
            setShowResults(false);
            setChartData(null);
          }}
        />
      )}

      {/* System Information Dialog */}
      <Dialog open={showSystemDialog} onOpenChange={setShowSystemDialog}>
        <DialogContent className="bg-teal-900/30 backdrop-blur-lg border border-pink-300/30 max-w-2xl max-h-[80vh] overflow-y-auto">
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
                  <h4 className="text-lg font-semibold mb-2" 
                      style={{
                        color: 'hsl(60, 10%, 96%)',
                        textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }}>Overview</h4>
                  <p className="leading-relaxed" 
                     style={{
                       color: 'hsl(60, 10%, 96%)', 
                       opacity: 0.9
                     }}>
                    {systemDetails[selectedSystem as keyof typeof systemDetails].overview}
                  </p>
                </div>

                {/* System Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-teal-900/30 backdrop-blur-sm rounded-lg border border-pink-300/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4" style={{color: 'hsl(30, 8%, 18%)'}} />
                      <span className="text-sm font-medium" style={{color: 'hsl(60, 10%, 96%)', opacity: 0.7}}>Origin</span>
                    </div>
                    <p style={{color: 'hsl(60, 10%, 96%)'}}>{systemDetails[selectedSystem as keyof typeof systemDetails].origin}</p>
                  </div>
                  <div className="p-4 bg-teal-900/30 backdrop-blur-sm rounded-lg border border-pink-300/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" style={{color: 'hsl(30, 8%, 18%)'}} />
                      <span className="text-sm font-medium" style={{color: 'hsl(60, 10%, 96%)', opacity: 0.7}}>Heritage</span>
                    </div>
                    <p style={{color: 'hsl(60, 10%, 96%)'}}>{systemDetails[selectedSystem as keyof typeof systemDetails].timeRange}</p>
                  </div>
                  <div className="p-4 bg-teal-900/30 backdrop-blur-sm rounded-lg border border-pink-300/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4" style={{color: 'hsl(30, 8%, 18%)'}} />
                      <span className="text-sm font-medium" style={{color: 'hsl(60, 10%, 96%)', opacity: 0.7}}>Accuracy</span>
                    </div>
                    <Badge variant="outline" className="text-gray-400 border-green-400">
                      {systemDetails[selectedSystem as keyof typeof systemDetails].accuracy}
                    </Badge>
                  </div>
                  <div className="p-4 bg-teal-900/30 backdrop-blur-sm rounded-lg border border-pink-300/20">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" style={{color: 'hsl(30, 8%, 18%)'}} />
                      <span className="text-sm font-medium" style={{color: 'hsl(60, 10%, 96%)', opacity: 0.7}}>Difficulty</span>
                    </div>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      {systemDetails[selectedSystem as keyof typeof systemDetails].difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {systemDetails[selectedSystem as keyof typeof systemDetails].requirements.map((req, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-yellow-600/20 text-teal-300">
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
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
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
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{prediction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-700">
                  <Link href={systemDetails[selectedSystem as keyof typeof systemDetails].route}>
                    <Button className="sanctuary-button flex-1">
                      Explore {selectedSystem}
                    </Button>
                  </Link>
                  <Link href="/astrology-guide">
                    <Button variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white">
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

      {/* Features Overview - Match Landing Page Background */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              <span 
                style={{
                  background: 'linear-gradient(135deg, hsl(44, 45%, 65%) 0%, hsl(180, 25%, 55%) 50%, hsl(30, 8%, 18%) 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Comprehensive Astrological Systems
              </span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed" 
               style={{
                 color: 'hsl(60, 10%, 96%)', 
                 opacity: 0.95,
                 textShadow: '0 1px 4px rgba(0,0,0,0.2)'
               }}>
              The only platform integrating authentic calculations across multiple ancient wisdom traditions with{" "}
              <span 
                className="font-medium"
                style={{
                  color: 'var(--primary-accent)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}
              >
                modern precision
              </span>.
            </p>
          </div>
          
          {/* Personal Systems */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6" style={{color: 'var(--brushed-gold)'}} />
                <h3 className="text-2xl font-semibold" 
                    style={{
                      color: 'hsl(60, 10%, 96%)',
                      textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}>Personal Systems</h3>
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
                    className="bg-teal-900/30 backdrop-blur-sm border border-pink-300/30 rounded-2xl p-4 sm:p-6 text-center hover:bg-teal-800/40 transition-all duration-300 shadow-lg hover:shadow-pink-500/20"
                  >
                    <div className="text-3xl sm:text-4xl mb-3">
                      {system.icon}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1 transition-colors" 
                        style={{
                          color: 'hsl(60, 10%, 96%)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}>
                      {system.title}
                    </h3>
                    <p className="text-xs leading-relaxed mb-3" 
                       style={{
                         color: 'hsl(60, 10%, 96%)', 
                         opacity: 0.85
                       }}>
                      {system.description}
                    </p>
                    <ul className="space-y-1 text-xs">
                      {system.features.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2" 
                            style={{
                              color: 'hsl(60, 10%, 96%)', 
                              opacity: 0.75
                            }}>
                          <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" 
                                style={{backgroundColor: 'hsl(44, 45%, 65%)'}}></span>
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
                <Globe className="h-6 w-6" style={{color: 'var(--sage-teal)'}} />
                <h3 className="text-2xl font-semibold" 
                    style={{
                      color: 'hsl(60, 10%, 96%)',
                      textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}>Space & Environment Systems</h3>
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
                    className="bg-teal-900/30 backdrop-blur-sm border border-pink-300/30 rounded-2xl p-6 text-center hover:bg-teal-800/40 transition-all duration-300 shadow-lg hover:shadow-yellow-600/20"
                  >
                    <div className="text-4xl mb-4">
                      {system.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 transition-colors" 
                        style={{
                          color: 'hsl(60, 10%, 96%)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}>
                      {system.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" 
                       style={{
                         color: 'hsl(60, 10%, 96%)', 
                         opacity: 0.85
                       }}>
                      {system.description}
                    </p>
                    <ul className="space-y-2 text-sm">
                      {system.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2" 
                            style={{
                              color: 'hsl(60, 10%, 96%)', 
                              opacity: 0.75
                            }}>
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" 
                                style={{backgroundColor: 'hsl(44, 45%, 65%)'}}></span>
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
              className="bg-teal-900/30 backdrop-blur-sm border border-pink-300/30 rounded-2xl p-8 text-center shadow-lg"
            >
              <div className="text-5xl mb-6">🌟</div>
              <h3 className="font-semibold text-2xl mb-4" 
                  style={{
                    background: 'linear-gradient(135deg, hsl(44, 45%, 65%) 0%, hsl(180, 25%, 55%) 50%, hsl(30, 8%, 18%) 100%)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>Unique Cross-System Synthesis</h3>
              <p className="text-lg mb-6 max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--sage-teal)', opacity: 0.9}}>
                Our proprietary synthesis engine identifies universal patterns across all systems, providing unified recommendations that resolve conflicts and highlight consistent themes.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-lg font-medium mb-2" style={{color: 'var(--brushed-gold)'}}>Pattern Detection</div>
                  <p className="text-sm" style={{color: 'var(--sage-teal)', opacity: 0.8}}>Identifies consistent themes across all systems</p>
                </div>
                <div>
                  <div className="text-lg font-medium mb-2" style={{color: 'var(--brushed-gold)'}}>Conflict Resolution</div>
                  <p className="text-sm" style={{color: 'var(--sage-teal)', opacity: 0.8}}>Harmonizes contradictory recommendations</p>
                </div>
                <div>
                  <div className="text-lg font-medium mb-2" style={{color: 'var(--brushed-gold)'}}>Priority Ranking</div>
                  <p className="text-sm" style={{color: 'var(--sage-teal)', opacity: 0.8}}>Orders guidance by importance and timing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Guidance Preview - Match Landing Page Background */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              <span 
                style={{
                  background: 'linear-gradient(135deg, hsl(44, 45%, 65%) 0%, hsl(180, 25%, 55%) 50%, hsl(30, 8%, 18%) 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Daily Cosmic Guidance
              </span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed" 
               style={{
                 color: 'hsl(60, 10%, 96%)', 
                 opacity: 0.95,
                 textShadow: '0 1px 4px rgba(0,0,0,0.2)'
               }}>
              Personalized insights based on current planetary transits and your{" "}
              <span 
                className="font-medium"
                style={{
                  color: 'var(--primary-accent)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  fontWeight: '600'
                }}
              >
                unique astrological blueprint
              </span>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dailyAreas.map((area, index) => (
              <div key={index}>
                <div 
                  className="bg-teal-900/30 backdrop-blur-sm border border-pink-300/30 rounded-2xl p-6 text-center hover:bg-teal-800/40 transition-all duration-300 shadow-lg"
                >
                  <area.icon className={`h-12 w-12 mx-auto mb-4 ${area.color}`} />
                  <h3 className="font-medium mb-2 font-accent" style={{color: 'var(--sage-teal)'}}>
                    {area.title}
                  </h3>
                  <p className="text-sm" style={{color: 'var(--sage-teal)', opacity: 0.8}}>
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
                color: 'var(--sage-teal)',
                border: 'none'
              }}
            >
              <Clock className="mr-2 h-5 w-5" />
              View Today's Guidance
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Match Landing Page Background */}
      <footer className="relative z-10 py-16 border-t border-pink-300/20" style={{background: 'var(--cosmic-gradient-1)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <TorchlightLogo size="sm" />
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{color: 'var(--sage-teal)', opacity: 0.8}}>
                Illuminating your cosmic blueprint through authentic ancient wisdom for practical modern living.
              </p>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="font-semibold mb-4 font-accent" style={{color: 'var(--brushed-gold)'}}>Features</h4>
              <ul className="space-y-2 text-sm" style={{color: 'var(--sage-teal)', opacity: 0.8}}>
                <li>Natal Charts</li>
                <li>Compatibility Analysis</li>
                <li>Daily Horoscopes</li>
                <li>Transit Tracking</li>
                <li>Multi-System Analysis</li>
              </ul>
            </div>
            
            {/* Systems */}
            <div>
              <h4 className="font-semibold mb-4 font-accent" style={{color: 'var(--brushed-gold)'}}>Astrological Systems</h4>
              <ul className="space-y-2 text-sm" style={{color: 'var(--sage-teal)', opacity: 0.8}}>
                <li>Western Astrology</li>
                <li>Vedic (Jyotish)</li>
                <li>Chinese Zodiac</li>
                <li>Human Design</li>
                <li>Cross-System Synthesis</li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4 font-accent" style={{color: 'var(--brushed-gold)'}}>Support</h4>
              <ul className="space-y-2 text-sm" style={{color: 'var(--sage-teal)', opacity: 0.8}}>
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
            <p className="text-sm" style={{color: 'var(--sage-teal)', opacity: 0.8}}>
              © 2024 Torchlight. Illuminating cosmic wisdom for 25,000+ years of human observation.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4 text-sm" style={{color: 'var(--sage-teal)', opacity: 0.8}}>
              <span>Powered by Swiss Ephemeris</span>
              <span>•</span>
              <span>Authentic Ancient Sources</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Donation Modal */}
      <DonationModal
        isOpen={isOpen}
        onClose={closeModal}
        trigger={trigger}
      />
    </div>
  );
}
