import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Stars, Sparkles, Users, Calendar, Moon, Sun, Globe, Zap, Calculator, Eye, Heart, Home } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n";

// System Information Modal Component
function SystemInfoModal({ system }: { system: any }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-rose-300 flex items-center gap-3 text-2xl">
          {system.icon}
          {system.title}
        </DialogTitle>
        <DialogDescription className="text-rose-200/80 text-base">
          {system.description}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 mt-6">
        {/* System Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 border border-pink-300/20">
            <div className="text-xs text-rose-300 uppercase tracking-wide mb-1">Origin</div>
            <div className="text-white font-medium">{system.origin}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-pink-300/20">
            <div className="text-xs text-rose-300 uppercase tracking-wide mb-1">Heritage</div>
            <div className="text-white font-medium">{system.timeRange}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-pink-300/20">
            <div className="text-xs text-rose-300 uppercase tracking-wide mb-1">Accuracy</div>
            <div className="text-white font-medium">{system.accuracy}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-pink-300/20">
            <div className="text-xs text-rose-300 uppercase tracking-wide mb-1">Difficulty</div>
            <div className="text-white font-medium">{system.difficulty}</div>
          </div>
        </div>

        {/* Key Features */}
        <div>
          <h4 className="text-rose-300 font-semibold mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Key Features
          </h4>
          <ul className="space-y-2">
            {system.keyFeatures.map((feature: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-rose-100 text-sm">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* What It Predicts */}
        <div>
          <h4 className="text-rose-300 font-semibold mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            What It Reveals
          </h4>
          <ul className="space-y-2">
            {system.predictions.map((prediction: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-rose-100 text-sm">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                {prediction}
              </li>
            ))}
          </ul>
        </div>

        {/* Required Information */}
        <div>
          <h4 className="text-rose-300 font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Required Information
          </h4>
          <div className="flex flex-wrap gap-2">
            {system.inputs.map((input: string, index: number) => (
              <Badge key={index} className="bg-white/10 text-rose-200 border-pink-300/30">
                {input}
              </Badge>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="pt-4 border-t border-pink-300/20">
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-3"
          >
            Explore {system.title} Reading
          </Button>
        </div>
      </div>
    </>
  );
}

export default function Landing() {
  const { t } = useTranslation();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  const astrologySystemsInfo = {
    western: {
      title: "Western Astrology",
      icon: <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
        <Sun className="w-5 h-5 text-white" />
      </div>,
      origin: "Ancient Greece & Rome",
      timeRange: "2,000+ years",
      accuracy: "High",
      difficulty: "Beginner",
      description: "The most popular astrology system worldwide, based on 12 zodiac signs and planetary positions.",
      keyFeatures: [
        "12 zodiac signs (Aries to Pisces)",
        "Planetary aspects and house systems",
        "Birth chart interpretation",
        "Compatibility analysis",
        "Daily and transit predictions"
      ],
      predictions: [
        "Personality traits and character analysis",
        "Love and relationship compatibility",
        "Career guidance and life purpose",
        "Daily, weekly, and monthly forecasts",
        "Life transitions and major events"
      ],
      inputs: ["Birth date", "Birth time", "Birth location"]
    },
    vedic: {
      title: "Vedic Wisdom (Jyotish)",
      icon: <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
        <Stars className="w-5 h-5 text-white" />
      </div>,
      origin: "Ancient India",
      timeRange: "5,000+ years",
      accuracy: "Very High",
      difficulty: "Advanced",
      description: "Ancient Indian system using sidereal zodiac with precise timing predictions through Dasha periods.",
      keyFeatures: [
        "Sidereal zodiac system",
        "27 Nakshatras (lunar mansions)",
        "Dasha and Bhukti periods",
        "Karmic and spiritual insights",
        "Remedial measures and solutions"
      ],
      predictions: [
        "Precise life event timing",
        "Karmic patterns and spiritual purpose",
        "Health and wellness guidance",
        "Marriage and relationship timing",
        "Career and financial predictions"
      ],
      inputs: ["Birth date", "Birth time", "Birth location", "Full name"]
    },
    chinese: {
      title: "Chinese Zodiac",
      icon: <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
        <div className="text-white font-bold text-sm">☯</div>
      </div>,
      origin: "Ancient China",
      timeRange: "4,000+ years",
      accuracy: "High",
      difficulty: "Intermediate",
      description: "Based on 12-year animal cycles and five elements, with detailed BaZi (Four Pillars) analysis.",
      keyFeatures: [
        "12 animal signs with unique traits",
        "Five elements theory (Wood, Fire, Earth, Metal, Water)",
        "BaZi Four Pillars system",
        "Yin-Yang balance analysis",
        "Chinese calendar calculations"
      ],
      predictions: [
        "Personality based on animal signs",
        "Annual and monthly forecasts",
        "Compatibility between signs",
        "BaZi life path analysis",
        "Elemental balance and harmony"
      ],
      inputs: ["Birth date", "Birth time (optional)", "Birth location"]
    },
    humanDesign: {
      title: "Human Design",
      icon: <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
        <div className="text-white font-bold text-sm">◊</div>
      </div>,
      origin: "Modern Synthesis (1987)",
      timeRange: "37+ years",
      accuracy: "High",
      difficulty: "Intermediate",
      description: "Modern system combining astrology, I Ching, Kabbalah, and chakras for energy type identification.",
      keyFeatures: [
        "4 energy types (Generator, Manifestor, Projector, Reflector)",
        "BodyGraph visualization",
        "Decision-making authority",
        "Strategy for optimal living",
        "Centers, channels, and gates analysis"
      ],
      predictions: [
        "Energy type and life strategy",
        "Decision-making process",
        "Relationship dynamics",
        "Career and life purpose",
        "Optimal living strategies"
      ],
      inputs: ["Birth date", "Birth time", "Birth location"]
    },
    numerology: {
      title: "Numerology",
      icon: <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
        <div className="text-white font-bold text-sm">∞</div>
      </div>,
      origin: "Ancient Civilizations",
      timeRange: "4,000+ years",
      accuracy: "Moderate",
      difficulty: "Beginner",
      description: "Mathematical analysis of names and birth dates to reveal personality traits and life patterns.",
      keyFeatures: [
        "Life Path Number calculation",
        "Destiny and Soul Urge numbers",
        "Personality Number analysis",
        "Name numerology",
        "Yearly and monthly cycles"
      ],
      predictions: [
        "Life purpose and spiritual path",
        "Personality traits and talents",
        "Compatible relationships",
        "Career and life direction",
        "Personal year cycles"
      ],
      inputs: ["Full name", "Birth date"]
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Clean Header */}
      <header className="clean-nav fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Stars className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Torchlight
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="clean-button px-6 py-2 text-sm"
            >
              {t('nav.signIn')}
            </Button>
          </div>
        </div>
      </header>

      {/* Clean Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-semibold mb-6 bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            {t('landing.title')}
          </h2>
          <p className="text-lg md:text-xl mb-12 text-purple-200 max-w-3xl mx-auto leading-relaxed">
            {t('landing.subtitle')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Dialog>
              <DialogTrigger asChild>
                <Badge 
                  className="cosmic-badge hover:scale-105 transition-transform duration-200 cursor-pointer px-4 py-2"
                  onClick={() => setSelectedSystem('western')}
                >
                  {t('badges.western')}
                </Badge>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-purple-900/95 via-pink-900/90 to-rose-900/95 border-pink-300/30 backdrop-blur-md max-w-2xl">
                <SystemInfoModal system={astrologySystemsInfo.western} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Badge 
                  className="cosmic-badge hover:scale-105 transition-transform duration-200 cursor-pointer px-4 py-2"
                  onClick={() => setSelectedSystem('vedic')}
                >
                  {t('badges.vedic')}
                </Badge>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-purple-900/95 via-pink-900/90 to-rose-900/95 border-pink-300/30 backdrop-blur-md max-w-2xl">
                <SystemInfoModal system={astrologySystemsInfo.vedic} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Badge 
                  className="cosmic-badge hover:scale-105 transition-transform duration-200 cursor-pointer px-4 py-2"
                  onClick={() => setSelectedSystem('chinese')}
                >
                  {t('badges.chinese')}
                </Badge>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-purple-900/95 via-pink-900/90 to-rose-900/95 border-pink-300/30 backdrop-blur-md max-w-2xl">
                <SystemInfoModal system={astrologySystemsInfo.chinese} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Badge 
                  className="cosmic-badge hover:scale-105 transition-transform duration-200 cursor-pointer px-4 py-2"
                  onClick={() => setSelectedSystem('humanDesign')}
                >
                  {t('badges.humanDesign')}
                </Badge>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-purple-900/95 via-pink-900/90 to-rose-900/95 border-pink-300/30 backdrop-blur-md max-w-2xl">
                <SystemInfoModal system={astrologySystemsInfo.humanDesign} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Badge 
                  className="cosmic-badge hover:scale-105 transition-transform duration-200 cursor-pointer px-4 py-2"
                  onClick={() => setSelectedSystem('numerology')}
                >
                  {t('badges.numerology')}
                </Badge>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-purple-900/95 via-pink-900/90 to-rose-900/95 border-pink-300/30 backdrop-blur-md max-w-2xl">
                <SystemInfoModal system={astrologySystemsInfo.numerology} />
              </DialogContent>
            </Dialog>
          </div>
          
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="clean-button px-8 py-4 text-base font-medium"
          >
            {t('landing.startJourney')}
          </Button>
        </div>
      </section>

      {/* What is Torchlight Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            {t('landing.whatIs')}
          </h3>
          <p className="text-center text-purple-200 mb-12 max-w-2xl mx-auto">
            {t('landing.whatIsSubtitle')}
          </p>
          
          <div className="clean-card p-8 md:p-12 mb-8">
            <p className="text-lg text-gray-200 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
              <strong className="text-yellow-400">Torchlight</strong> combines the wisdom of multiple ancient traditions with modern astronomical precision. Like a torch illuminating a path, this system offers insights to help you navigate life's journey while preserving your autonomy to choose your direction.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold mb-4 text-yellow-400">{t('landing.philosophy')}</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('philosophy.illumination')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('philosophy.multiple')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('philosophy.authentic')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('philosophy.responsibility')}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold mb-4 text-purple-400">{t('landing.science')}</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('science.precision')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('science.study')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('science.validation')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('science.openSource')}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-black/30 rounded-lg border-l-4 border-yellow-500">
              <p className="text-gray-300 italic text-center">
                {t('quote.astrology')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Sections */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <h3 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            {t('landing.guidance')}
          </h3>
          <p className="text-center text-purple-200 mb-16 max-w-3xl mx-auto text-lg">
            {t('landing.guidanceSubtitle')}
          </p>

          {/* Three Main Sections */}
          <div className="grid lg:grid-cols-3 gap-12 mb-16">
            
            {/* Personal Astrology Section */}
            <div className="clean-card p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Sun className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">{t('sections.personal')}</h4>
                <p className="text-purple-200">{t('sections.personalDesc')}</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-yellow-400">
                  <h5 className="font-semibold text-white mb-2">{t('personal.natal.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('personal.natal.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-orange-400">
                  <h5 className="font-semibold text-white mb-2">{t('personal.numerology.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('personal.numerology.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-pink-400">
                  <h5 className="font-semibold text-white mb-2">{t('personal.daily.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('personal.daily.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-purple-400">
                  <h5 className="font-semibold text-white mb-2">{t('personal.design.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('personal.design.desc')}</p>
                </div>
              </div>
            </div>

            {/* Couples Section */}
            <div className="clean-card p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">{t('sections.couples')}</h4>
                <p className="text-purple-200">{t('sections.couplesDesc')}</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-pink-400">
                  <h5 className="font-semibold text-white mb-2">{t('couples.synastry.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('couples.synastry.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-rose-400">
                  <h5 className="font-semibold text-white mb-2">{t('couples.composite.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('couples.composite.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-red-400">
                  <h5 className="font-semibold text-white mb-2">{t('couples.chinese.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('couples.chinese.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-purple-400">
                  <h5 className="font-semibold text-white mb-2">{t('couples.numerology.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('couples.numerology.desc')}</p>
                </div>
              </div>
            </div>

            {/* Spaces Section */}
            <div className="clean-card p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Moon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">{t('sections.spaces')}</h4>
                <p className="text-purple-200">{t('sections.spacesDesc')}</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-green-400">
                  <h5 className="font-semibold text-white mb-2">{t('spaces.vastu.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('spaces.vastu.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-emerald-400">
                  <h5 className="font-semibold text-white mb-2">{t('spaces.fengshui.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('spaces.fengshui.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-teal-400">
                  <h5 className="font-semibold text-white mb-2">{t('spaces.timing.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('spaces.timing.desc')}</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-cyan-400">
                  <h5 className="font-semibold text-white mb-2">{t('spaces.remedies.title')}</h5>
                  <p className="text-purple-100 text-sm">{t('spaces.remedies.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Astrological Tools */}
      <section className="py-16 px-6 bg-black/20">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Advanced Astrological Tools & AI Guidance
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* AI Astrological Assistant */}
            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">AI Astrological Assistant</h4>
                <p className="text-purple-200 text-sm mb-4">
                  Conversational AI for personalized birth chart interpretation and cosmic timing guidance
                </p>
              </div>
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Real-time birth chart analysis
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Multi-system astrological synthesis
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Personalized cosmic timing advice
                </li>
              </ul>
            </div>

            {/* Astrological Education & Research */}
            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Stars className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Astrological Education & Research</h4>
                <p className="text-purple-200 text-sm mb-4">
                  Comprehensive learning resources on astronomical calculations and astrological traditions
                </p>
              </div>
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  Swiss Ephemeris calculations explained
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  Historical astrological traditions
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  Cross-cultural astrology comparisons
                </li>
              </ul>
            </div>

            {/* Advanced Astrological Timing */}
            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Advanced Astrological Timing</h4>
                <p className="text-purple-200 text-sm mb-4">
                  Precise planetary transit analysis and electional astrology for optimal decision timing
                </p>
              </div>
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  Planetary transit predictions
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  Electional astrology for events
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                  Vedic Muhurta timing calculations
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            {t('landing.ready')}
          </h3>
          <p className="text-lg text-purple-200 mb-8">
            {t('landing.readySubtitle')}
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="clean-button px-8 py-4 text-base font-medium"
          >
            {t('landing.startJourney')}
          </Button>
        </div>
      </section>
    </div>
  );
}