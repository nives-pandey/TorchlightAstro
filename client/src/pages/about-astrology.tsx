import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Calculator, 
  BookOpen, 
  Eye, 
  Hand, 
  Brain, 
  Heart,
  Compass,
  Lightbulb,
  Shield,
  Clock,
  Users
} from "lucide-react";

export default function AboutAstrology() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Star className="h-12 w-12 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
              Understanding Astrology
            </h1>
            <Star className="h-12 w-12 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover the ancient science that combines mathematics, astronomy, and human psychology 
            to provide insights into personality, relationships, and life patterns.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Scientific Foundation */}
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="text-yellow-500 flex items-center space-x-2">
                <Calculator className="h-6 w-6" />
                <span>The Science Behind Astrology</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Mathematical Precision</h4>
                <p className="text-sm">
                  Astrology is built on precise astronomical calculations. Every planetary position, 
                  house cusp, and aspect is calculated using complex mathematical formulas that account 
                  for celestial mechanics, orbital periods, and gravitational influences.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Astronomical Foundation</h4>
                <p className="text-sm">
                  Based on actual positions of celestial bodies at the moment of birth. Modern astrology 
                  uses ephemeris data (astronomical tables) and sophisticated algorithms to determine 
                  exact planetary coordinates, accounting for precession and other astronomical phenomena.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">Historical Research</h4>
                <p className="text-sm">
                  Over 4,000 years of documented observations, correlations, and pattern recognition 
                  across cultures worldwide. Ancient civilizations developed these systems through 
                  careful observation of celestial cycles and their correlation with human behavior.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Years of Study Required */}
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center space-x-2">
                <BookOpen className="h-6 w-6" />
                <span>Mastery Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400">Basic Competency:</span>
                  <Badge variant="outline" className="border-yellow-400 text-yellow-300">2-3 Years</Badge>
                </div>
                <p className="text-xs text-gray-400">
                  Understanding zodiac signs, planets, houses, and basic chart reading
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-purple-400">Professional Level:</span>
                  <Badge variant="outline" className="border-purple-400 text-purple-300">5-7 Years</Badge>
                </div>
                <p className="text-xs text-gray-400">
                  Advanced techniques, predictive methods, client consultation skills
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-400">Master Practitioner:</span>
                  <Badge variant="outline" className="border-blue-400 text-blue-300">10+ Years</Badge>
                </div>
                <p className="text-xs text-gray-400">
                  Multiple systems, research, teaching, specialized techniques
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-green-400">Lifetime Study:</span>
                  <Badge variant="outline" className="border-green-400 text-green-300">Continuous</Badge>
                </div>
                <p className="text-xs text-gray-400">
                  Astrology is a vast field requiring continuous learning and refinement
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Different Types of Astrological Arts */}
        <Card className="cosmic-card mb-12">
          <CardHeader>
            <CardTitle className="text-yellow-500 text-center text-2xl">
              Branches of Astrological Arts
            </CardTitle>
            <p className="text-gray-400 text-center">
              Multiple divination systems working together to provide comprehensive insights
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Horoscope Reading */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <h4 className="text-white font-semibold">Horoscope Reading</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Birth chart analysis using planetary positions, houses, and aspects. 
                  The foundation of all astrological work, requiring precise birth data.
                </p>
                <div className="text-xs text-gray-400">
                  <strong>Study Time:</strong> 3-5 years for proficiency
                </div>
              </div>

              {/* Palmistry */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Hand className="h-5 w-5 text-purple-400" />
                  <h4 className="text-white font-semibold">Palmistry (Hasta Samudrika)</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Hand analysis revealing personality traits, health patterns, and life potential 
                  through palm lines, mounts, and finger characteristics.
                </p>
                <div className="text-xs text-gray-400">
                  <strong>Study Time:</strong> 2-4 years for accurate readings
                </div>
              </div>

              {/* Face Reading */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-400" />
                  <h4 className="text-white font-semibold">Face Reading (Samudrika Shastra)</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Facial feature analysis to understand personality, character traits, 
                  and life tendencies based on ancient physiognomy principles.
                </p>
                <div className="text-xs text-gray-400">
                  <strong>Study Time:</strong> 3-6 years including cultural variations
                </div>
              </div>

              {/* Anjana (Third Eye Reading) */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-pink-400" />
                  <h4 className="text-white font-semibold">Anjana (Intuitive Reading)</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Psychic and intuitive insights combining astrological knowledge with 
                  spiritual perception for deeper understanding of karmic patterns.
                </p>
                <div className="text-xs text-gray-400">
                  <strong>Study Time:</strong> 5-10 years including meditation practice
                </div>
              </div>

              {/* Kavade (Energetic Analysis) */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-400" />
                  <h4 className="text-white font-semibold">Kavade (Energy Reading)</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Energetic field analysis to understand emotional patterns, relationship 
                  dynamics, and spiritual development through aura perception.
                </p>
                <div className="text-xs text-gray-400">
                  <strong>Study Time:</strong> 4-8 years with energy work training
                </div>
              </div>

              {/* Numerology */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-green-400" />
                  <h4 className="text-white font-semibold">Numerology</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Number vibration analysis using birth dates and names to reveal 
                  life path, personality traits, and timing of important events.
                </p>
                <div className="text-xs text-gray-400">
                  <strong>Study Time:</strong> 1-3 years for different systems
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What is Torchlight */}
        <Card className="cosmic-card mb-12">
          <CardHeader>
            <CardTitle className="text-yellow-500 flex items-center justify-center space-x-3 text-2xl">
              <Lightbulb className="h-8 w-8" />
              <span>What is Torchlight?</span>
              <Compass className="h-8 w-8" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6">
            <div className="text-center mb-8">
              <p className="text-lg leading-relaxed">
                <strong className="text-yellow-400">Torchlight</strong> serves as your personal cosmic illuminator, 
                providing clarity and direction when you seek guidance about life's important decisions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-white font-semibold text-lg flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-400" />
                  <span>Illumination, Not Determination</span>
                </h4>
                <p className="text-sm">
                  Like a torch that lights the path in darkness, Torchlight reveals possibilities, 
                  patterns, and potential outcomes. It illuminates the landscape of your choices 
                  but never decides which path you should take.
                </p>
                
                <h4 className="text-white font-semibold text-lg flex items-center space-x-2">
                  <Compass className="h-5 w-5 text-blue-400" />
                  <span>Guidance for Self-Discovery</span>
                </h4>
                <p className="text-sm">
                  Our comprehensive analysis across multiple astrological systems provides you 
                  with deep insights into your personality, strengths, challenges, and timing. 
                  This knowledge helps you make informed decisions aligned with your true nature.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold text-lg flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <span>Personal Responsibility</span>
                </h4>
                <p className="text-sm">
                  While Torchlight provides valuable insights and recommendations, 
                  <strong className="text-yellow-400"> all final decisions remain entirely yours</strong>. 
                  We believe in empowering you with knowledge while respecting your free will and personal choice.
                </p>
                
                <h4 className="text-white font-semibold text-lg flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-400" />
                  <span>Timing and Preparation</span>
                </h4>
                <p className="text-sm">
                  Understanding cosmic timing helps you prepare for opportunities and challenges. 
                  Torchlight shows you when energies are favorable for different activities, 
                  helping you work with natural rhythms rather than against them.
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="text-center p-6 bg-gradient-to-r from-yellow-900/20 to-purple-900/20 rounded-lg border border-yellow-500/20">
              <Shield className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">Our Commitment</h4>
              <p className="text-sm text-gray-300">
                Torchlight provides educational insights and guidance based on traditional astrological principles. 
                We do not take responsibility for personal decisions made using this information. 
                Always consider multiple perspectives and trust your own judgment when making important life choices.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Astrology Works */}
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="text-purple-400 text-center text-2xl">
              The Effectiveness of Astrological Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Calculator className="h-8 w-8 text-yellow-400" />
                </div>
                <h4 className="text-white font-semibold">Mathematical Precision</h4>
                <p className="text-sm">
                  Based on exact astronomical calculations and thousands of years of 
                  observed correlations between celestial events and human behavior patterns.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="h-8 w-8 text-purple-400" />
                </div>
                <h4 className="text-white font-semibold">Psychological Insight</h4>
                <p className="text-sm">
                  Provides a framework for understanding personality patterns, 
                  relationship dynamics, and personal growth opportunities through symbolic language.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Compass className="h-8 w-8 text-blue-400" />
                </div>
                <h4 className="text-white font-semibold">Life Navigation</h4>
                <p className="text-sm">
                  Offers timing guidance and perspective on life cycles, 
                  helping individuals align their actions with natural rhythms and opportunities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}