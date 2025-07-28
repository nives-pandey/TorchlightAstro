import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Stars, Sparkles, Sun, Moon, Eye, Heart, Calendar } from "lucide-react";

// Beautiful System Badge Component
function SystemBadge({ system, onClick }: { system: any; onClick: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          onClick={onClick}
          className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
        >
          <div className="bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-rose-500/20 backdrop-blur-sm border border-pink-300/30 rounded-2xl p-4 sm:p-6 text-center hover:from-pink-400/30 hover:via-purple-400/30 hover:to-rose-400/30 transition-all duration-300 shadow-lg hover:shadow-pink-500/20">
            <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {system.icon}
            </div>
            <h3 className="text-white font-semibold text-sm sm:text-base mb-1 group-hover:text-pink-200 transition-colors">
              {system.title}
            </h3>
            <p className="text-pink-200/80 text-xs leading-relaxed">
              {system.shortDesc}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-purple-900/95 via-pink-900/90 to-rose-900/95 border-pink-300/30 backdrop-blur-md max-w-lg mx-4">
        <DialogHeader>
          <DialogTitle className="text-rose-300 flex items-center gap-3 text-xl">
            <span className="text-2xl">{system.icon}</span>
            {system.title}
          </DialogTitle>
          <DialogDescription className="text-rose-200/80">
            {system.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* System Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3 border border-pink-300/20">
              <div className="text-xs text-rose-300 uppercase tracking-wide">Origin</div>
              <div className="text-white text-sm font-medium">{system.origin}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-pink-300/20">
              <div className="text-xs text-rose-300 uppercase tracking-wide">Heritage</div>
              <div className="text-white text-sm font-medium">{system.timeRange}</div>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-rose-300 font-semibold mb-2 flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4" />
              Key Features
            </h4>
            <ul className="space-y-1">
              {system.keyFeatures.slice(0, 3).map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-rose-100 text-sm">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* What It Reveals */}
          <div>
            <h4 className="text-rose-300 font-semibold mb-2 flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4" />
              What It Reveals
            </h4>
            <ul className="space-y-1">
              {system.predictions.slice(0, 3).map((prediction: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-rose-100 text-sm">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  {prediction}
                </li>
              ))}
            </ul>
          </div>

          {/* Call to Action */}
          <div className="pt-3 border-t border-pink-300/20">
            <Button 
              onClick={() => window.location.href = '/home'}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2.5"
            >
              Explore {system.title}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Landing() {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  const astrologySystemsInfo = {
    western: {
      title: "Western Astrology",
      icon: "☉",
      shortDesc: "12 zodiac signs & planetary wisdom",
      origin: "Ancient Greece",
      timeRange: "2,000+ years",
      description: "The most popular astrology system worldwide, based on 12 zodiac signs and planetary positions.",
      keyFeatures: [
        "12 zodiac signs (Aries to Pisces)",
        "Planetary aspects and house systems",
        "Birth chart interpretation",
        "Transit predictions"
      ],
      predictions: [
        "Personality traits and characteristics",
        "Life patterns and potential challenges",
        "Relationship compatibility insights",
        "Career and life direction guidance"
      ]
    },
    vedic: {
      title: "Vedic Astrology",
      icon: "ॐ",
      shortDesc: "Ancient Indian cosmic wisdom",
      origin: "Ancient India",
      timeRange: "5,000+ years",
      description: "Ancient Indian astrology system using sidereal zodiac with 27 Nakshatras and planetary periods.",
      keyFeatures: [
        "Sidereal zodiac system",
        "27 Nakshatras (lunar mansions)",
        "Planetary periods (Mahadasha)",
        "Divisional charts analysis"
      ],
      predictions: [
        "Life events and precise timing",
        "Career and spiritual path",
        "Health and longevity insights",
        "Karmic patterns and remedies"
      ]
    },
    chinese: {
      title: "Chinese Zodiac",
      icon: "☯",
      shortDesc: "12 animals & five elements",
      origin: "Ancient China",
      timeRange: "4,000+ years",
      description: "Traditional Chinese system using 12 animal signs with Five Element theory for personality insights.",
      keyFeatures: [
        "12 animal zodiac signs",
        "Five elements theory",
        "Yin-Yang balance analysis",
        "Chinese calendar calculations"
      ],
      predictions: [
        "Personality based on animal signs",
        "Annual and monthly forecasts",
        "Compatibility between signs",
        "Elemental balance and harmony"
      ]
    },
    humanDesign: {
      title: "Human Design",
      icon: "◊",
      shortDesc: "Energy types & life strategy",
      origin: "Modern Synthesis",
      timeRange: "35+ years",
      description: "Modern system combining astrology, I Ching, Kabbalah, and chakras for energy type identification.",
      keyFeatures: [
        "4 energy types identification",
        "BodyGraph visualization",
        "Decision-making authority",
        "Strategy for optimal living"
      ],
      predictions: [
        "Energy type and life strategy",
        "Decision-making process",
        "Relationship dynamics",
        "Career and life purpose"
      ]
    },
    numerology: {
      title: "Numerology",
      icon: "∞",
      shortDesc: "Numbers reveal life patterns",
      origin: "Ancient Civilizations",
      timeRange: "4,000+ years",
      description: "Mathematical analysis of names and birth dates to reveal personality traits and life patterns.",
      keyFeatures: [
        "Life Path Number calculation",
        "Destiny and Soul Urge numbers",
        "Personality Number analysis",
        "Personal year cycles"
      ],
      predictions: [
        "Life purpose and spiritual path",
        "Personality traits and talents",
        "Compatible relationships",
        "Career and life direction"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 text-white overflow-hidden">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-1 h-1 bg-rose-400 rounded-full animate-ping"></div>
      </div>

      {/* Header */}
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
            onClick={() => window.location.href = '/home'}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 text-sm backdrop-blur-sm"
          >
            Enter App
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-4 pt-8 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Your Complete
              </span>
              <br />
              <span className="text-white">
                Cosmic Guide
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-pink-200/90 max-w-2xl mx-auto leading-relaxed">
              Illuminate your path with authentic insights from five ancient wisdom traditions
            </p>
          </div>

          {/* Astrology Systems Grid */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              Explore Ancient Wisdom
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {Object.entries(astrologySystemsInfo).map(([key, system]) => (
                <SystemBadge
                  key={key}
                  system={system}
                  onClick={() => setSelectedSystem(key)}
                />
              ))}
            </div>
          </div>

          {/* Features Preview */}
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

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Moon className="w-5 h-5 text-purple-400" />
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

          {/* Call to Action */}
          <div className="text-center">
            <Button 
              onClick={() => window.location.href = '/home'}
              size="lg"
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 hover:from-pink-600 hover:via-purple-600 hover:to-rose-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300"
            >
              Begin Your Cosmic Journey
              <Stars className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-pink-200/60 text-sm mt-4">
              Free forever • No signup required • Start exploring immediately
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}