import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Moon, 
  Heart,
  Briefcase,
  Shield,
  Sparkles,
  Clock,
  Palette,
  Gem,
  Target
} from "lucide-react";

interface GeminiGuidanceData {
  guidance: {
    overview: string;
    love: string;
    career: string;
    health: string;
    spiritual: string;
  };
  lucky: {
    numbers: number[];
    colors: string[];
    gemstone: string;
  };
  planetary: {
    significantTransits: string[];
    moonPhase: string;
    recommendation: string;
  };
  systems: {
    western?: string;
    vedic?: string;
    numerology?: string;
    chinese?: string;
  };
}

interface GeminiDailyDisplayProps {
  data: {
    success: boolean;
    source: string;
    type: string;
    data: GeminiGuidanceData;
  };
}

export default function GeminiDailyDisplay({ data }: GeminiDailyDisplayProps) {
  const guidance = data.data;
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const lifeAreas = [
    {
      icon: Heart,
      title: "Love & Relationships",
      content: guidance.guidance.love,
      color: "text-pink-400"
    },
    {
      icon: Briefcase,
      title: "Career & Purpose",
      content: guidance.guidance.career,
      color: "text-green-400"
    },
    {
      icon: Shield,
      title: "Health & Wellness",
      content: guidance.guidance.health,
      color: "text-blue-400"
    },
    {
      icon: Sparkles,
      title: "Spiritual Growth",
      content: guidance.guidance.spiritual,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 cosmic-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Moon className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-teal-200 to-pink-200 bg-clip-text text-transparent">
              Today's Cosmic Guidance
            </h1>
          </div>
          <p className="text-gray-300 text-lg mb-2">{today}</p>
          <Badge variant="secondary" className="bg-teal-900/30 text-teal-300 border-teal-500/50">
            Powered by {data.source} • {data.type}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Guidance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card className="sanctuary-card border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Cosmic Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {guidance.guidance.overview}
                </p>
              </CardContent>
            </Card>

            {/* Life Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              {lifeAreas.map((area, index) => (
                <Card key={index} className="sanctuary-card border-teal-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                      <area.icon className={`h-5 w-5 ${area.color}`} />
                      {area.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      {area.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Insights */}
            <Card className="sanctuary-card border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Multi-System Perspectives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {guidance.systems.western && (
                    <div className="p-4 bg-teal-900/20 rounded-lg border border-teal-500/30">
                      <h4 className="font-semibold text-teal-300 mb-2">Western Astrology</h4>
                      <p className="text-gray-300 text-sm">{guidance.systems.western}</p>
                    </div>
                  )}
                  {guidance.systems.vedic && (
                    <div className="p-4 bg-orange-900/20 rounded-lg border border-orange-500/30">
                      <h4 className="font-semibold text-orange-300 mb-2">Vedic Wisdom</h4>
                      <p className="text-gray-300 text-sm">{guidance.systems.vedic}</p>
                    </div>
                  )}
                  {guidance.systems.numerology && (
                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                      <h4 className="font-semibold text-purple-300 mb-2">Numerology</h4>
                      <p className="text-gray-300 text-sm">{guidance.systems.numerology}</p>
                    </div>
                  )}
                  {guidance.systems.chinese && (
                    <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                      <h4 className="font-semibold text-red-300 mb-2">Chinese Astrology</h4>
                      <p className="text-gray-300 text-sm">{guidance.systems.chinese}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lucky Elements */}
            <Card className="sanctuary-card border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-yellow-400" />
                  Lucky Elements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Numbers */}
                <div>
                  <h4 className="font-medium text-gray-200 mb-2 flex items-center gap-2">
                    <span className="text-blue-400">#</span>
                    Lucky Numbers
                  </h4>
                  <div className="flex gap-2">
                    {guidance.lucky.numbers.map((num, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-blue-900/30 text-blue-300">
                        {num}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h4 className="font-medium text-gray-200 mb-2 flex items-center gap-2">
                    <Palette className="h-4 w-4 text-pink-400" />
                    Beneficial Colors
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {guidance.lucky.colors.map((color, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-pink-900/30 text-pink-300">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Gemstone */}
                <div>
                  <h4 className="font-medium text-gray-200 mb-2 flex items-center gap-2">
                    <Gem className="h-4 w-4 text-green-400" />
                    Power Stone
                  </h4>
                  <Badge variant="secondary" className="bg-green-900/30 text-green-300">
                    {guidance.lucky.gemstone}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Planetary Insights */}
            <Card className="sanctuary-card border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Moon className="h-5 w-5 text-purple-400" />
                  Cosmic Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-200 mb-2">Moon Phase</h4>
                  <p className="text-gray-300 text-sm">{guidance.planetary.moonPhase}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-200 mb-2">Key Transits</h4>
                  <div className="space-y-1">
                    {guidance.planetary.significantTransits.map((transit, idx) => (
                      <p key={idx} className="text-gray-300 text-sm">• {transit}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-200 mb-2">Cosmic Recommendation</h4>
                  <p className="text-gray-300 text-sm font-medium">
                    {guidance.planetary.recommendation}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Card className="sanctuary-card border-teal-500/20">
              <CardContent className="p-6 text-center">
                <Button className="w-full sanctuary-button mb-3">
                  <Clock className="mr-2 h-4 w-4" />
                  Get Weekly Outlook
                </Button>
                <p className="text-gray-400 text-xs">
                  Powered by Gemini AI • Generated with authentic astronomical data
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}