import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ContributionSection from "@/components/contribution-section";
import { TorchlightLogo } from "@/components/torchlight-logo";
import Navigation from "@/components/navigation";
import { Stars, Sparkles, Sun, Moon, Eye, Heart, Calendar, ArrowRight, Play } from "lucide-react";
import { Link } from "wouter";

// Beautiful System Badge Component
function SystemBadge({ system, onClick }: { system: any; onClick: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          onClick={onClick}
          className="group cursor-pointer"
        >
          <div style={{background: 'var(--cosmic-gradient-1)', opacity: 0.8}} className="backdrop-blur-sm border border-pink-300/30 rounded-2xl p-4 sm:p-6 text-center hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-pink-500/20">
            <div className="text-3xl sm:text-4xl mb-3">
              {system.icon}
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-1 transition-colors font-accent" style={{color: 'var(--cosmic-lavender)'}}>
              {system.title}
            </h3>
            <p className="text-xs leading-relaxed" style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
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
            <div className="bg-purple-800/40 rounded-xl p-3 border border-pink-300/20">
              <div className="text-xs text-rose-300 uppercase tracking-wide">Origin</div>
              <div className="text-white text-sm font-medium">{system.origin}</div>
            </div>
            <div className="bg-purple-800/40 rounded-xl p-3 border border-pink-300/20">
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
    <div 
      className="min-h-screen text-white overflow-hidden" 
      style={{background: 'var(--cosmic-gradient-1)'}}
    >
      <Navigation />
      {/* Floating particles background */}
      <div 
        className="fixed inset-0 overflow-hidden pointer-events-none"
      >
        {/* Static celestial background elements - no animation */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-pink-400 rounded-full opacity-60" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-300 rounded-full opacity-80" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50" />
        <div className="absolute top-1/2 right-10 w-1 h-1 bg-rose-400 rounded-full opacity-70" />
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-gold-400 rounded-full opacity-60" />
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-indigo-400 rounded-full opacity-40" />
      </div>

      {/* Clear User Flow Guidance */}
      <div className="relative z-10 px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <div className="bg-purple-900/50 backdrop-blur-md border border-purple-300/30 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Play className="h-6 w-6 text-purple-400" />
              Ready to Get Started?
            </h2>
            <p className="text-purple-200 mb-6">
              Choose your path to cosmic insight. You can start your journey from any point below:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/home">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Generate Your Chart
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" className="w-full border-purple-300/50 text-purple-200 hover:bg-purple-500/20 py-3 px-6 rounded-xl">
                  Explore All Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 px-4 pt-8 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
              <span 
                style={{
                  background: 'linear-gradient(135deg, hsl(275, 70%, 65%) 0%, hsl(285, 80%, 75%) 50%, hsl(51, 100%, 70%) 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Your Complete
              </span>
              <br />
              <span 
                className="block mt-2"
                style={{
                  color: 'hsl(240, 100%, 94%)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                Cosmic Guide
              </span>
            </h2>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 font-light" 
               style={{
                 color: 'hsl(240, 100%, 94%)', 
                 opacity: 0.95,
                 textShadow: '0 1px 4px rgba(0,0,0,0.2)'
               }}>
              Illuminate your path with authentic insights from{" "}
              <span 
                className="font-medium"
                style={{
                  color: 'hsl(51, 100%, 65%)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}
              >
                five ancient wisdom traditions
              </span>
            </p>
          </div>

          {/* Astrology Systems Grid */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center justify-center gap-2 font-accent" style={{color: 'var(--cosmic-lavender)'}}>
              <Sparkles className="w-5 h-5" style={{color: 'var(--cosmic-gold)'}} />
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
            <Card className="bg-purple-800/40 border-white/20 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Sun className="w-5 h-5 text-purple-400" />
                  Personal Readings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pink-200/80 text-sm">
                  Complete natal chart analysis across all systems with authentic astronomical calculations
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-purple-800/40 border-white/20 backdrop-blur-sm rounded-2xl">
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

            <Card className="bg-purple-800/40 border-white/20 backdrop-blur-sm rounded-2xl sm:col-span-2 lg:col-span-1">
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
            <div>
              <Button 
                onClick={() => window.location.href = '/home'}
                size="lg"
                className="font-semibold px-8 py-4 rounded-2xl text-lg shadow-2xl transition-all duration-300 font-accent"
                style={{
                  background: 'var(--cosmic-gradient-2)',
                  color: 'var(--cosmic-lavender)',
                  border: 'none'
                }}
              >
                Begin Your Cosmic Journey
                <div className="inline-block ml-2">
                  <Stars className="w-5 h-5" style={{color: 'var(--cosmic-gold)'}} />
                </div>
              </Button>
            </div>
            <p 
              className="text-sm mt-4"
              style={{color: 'var(--cosmic-lavender)', opacity: 0.6}}
            >
              Free forever • No signup required • Start exploring immediately
            </p>
          </div>

          {/* Contribution Section */}
          <div 
            className="max-w-4xl mx-auto mt-16"
            style={{
              background: 'transparent',
              backgroundColor: 'transparent'
            }}
          >
            <ContributionSection onContribute={(amount) => {
              // Redirect to contribution page with selected amount
              window.location.href = `/contribute?amount=${amount}`;
            }} />
          </div>
        </div>
      </main>
    </div>
  );
}