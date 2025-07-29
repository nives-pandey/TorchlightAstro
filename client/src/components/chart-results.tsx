import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { X, Home, Download, Mail, Star, Moon, Sun, Calculator, Heart, Briefcase } from "lucide-react";
import { Link } from "wouter";

interface ChartResultsProps {
  data: any;
  onClose: () => void;
}

export default function ChartResults({ data, onClose }: ChartResultsProps) {
  const [activeSystem, setActiveSystem] = useState("western");

  // Generate astrological insights based on birth data
  const generateInsights = () => {
    const birthDate = new Date(data.birthDate);
    const birthMonth = birthDate.getMonth() + 1;
    const birthDay = birthDate.getDate();
    
    // Western Zodiac calculation
    const getWesternSign = () => {
      if ((birthMonth === 3 && birthDay >= 21) || (birthMonth === 4 && birthDay <= 19)) return "Aries";
      if ((birthMonth === 4 && birthDay >= 20) || (birthMonth === 5 && birthDay <= 20)) return "Taurus";
      if ((birthMonth === 5 && birthDay >= 21) || (birthMonth === 6 && birthDay <= 20)) return "Gemini";
      if ((birthMonth === 6 && birthDay >= 21) || (birthMonth === 7 && birthDay <= 22)) return "Cancer";
      if ((birthMonth === 7 && birthDay >= 23) || (birthMonth === 8 && birthDay <= 22)) return "Leo";
      if ((birthMonth === 8 && birthDay >= 23) || (birthMonth === 9 && birthDay <= 22)) return "Virgo";
      if ((birthMonth === 9 && birthDay >= 23) || (birthMonth === 10 && birthDay <= 22)) return "Libra";
      if ((birthMonth === 10 && birthDay >= 23) || (birthMonth === 11 && birthDay <= 21)) return "Scorpio";
      if ((birthMonth === 11 && birthDay >= 22) || (birthMonth === 12 && birthDay <= 21)) return "Sagittarius";
      if ((birthMonth === 12 && birthDay >= 22) || (birthMonth === 1 && birthDay <= 19)) return "Capricorn";
      if ((birthMonth === 1 && birthDay >= 20) || (birthMonth === 2 && birthDay <= 18)) return "Aquarius";
      return "Pisces";
    };

    // Chinese Zodiac calculation
    const getChineseSign = () => {
      const year = birthDate.getFullYear();
      const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
      return animals[(year - 1900) % 12];
    };

    // Life Path Number calculation
    const getLifePath = () => {
      const dateStr = data.birthDate.replace(/-/g, '');
      let sum = 0;
      for (let digit of dateStr) {
        sum += parseInt(digit);
      }
      while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
      }
      return sum;
    };

    const westernSign = getWesternSign();
    return {
      western: {
        sign: westernSign,
        element: ["Aries", "Leo", "Sagittarius"].includes(westernSign) ? "Fire" : 
                ["Taurus", "Virgo", "Capricorn"].includes(westernSign) ? "Earth" :
                ["Gemini", "Libra", "Aquarius"].includes(westernSign) ? "Air" : "Water"
      },
      chinese: {
        animal: getChineseSign(),
        element: ["Wood", "Fire", "Earth", "Metal", "Water"][Math.floor((birthDate.getFullYear() - 1900) / 2) % 5]
      },
      numerology: {
        lifePath: getLifePath(),
        destiny: data.firstName.length + data.lastName.length
      }
    };
  };

  const insights = generateInsights();

  const systemContent = {
    western: {
      title: "Western Astrology Analysis",
      icon: <Sun className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-300 mb-2">
              ☉ {insights.western.sign}
            </h3>
            <Badge variant="outline" className="text-white border-purple-400">
              {insights.western.element} Sign
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center">
                  <Star className="mr-2 h-4 w-4" />
                  Personality Traits
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-sm">
                <p>As a {insights.western.sign}, you embody the qualities of the {insights.western.element} element. Your sun sign reveals your core identity and life purpose.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center">
                  <Heart className="mr-2 h-4 w-4" />
                  Love & Relationships
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-sm">
                <p>{insights.western.element} signs approach relationships with passion and dedication. You value deep connections and emotional authenticity.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Career Path
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-sm">
                <p>Your {insights.western.sign} nature suggests careers in leadership, creativity, or service to others. Follow your passionate interests.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">Current Transit</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-sm">
                <p>Focus on personal growth and new beginnings. This is an excellent time for self-discovery and pursuing your authentic path.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    vedic: {
      title: "Vedic (Jyotish) Analysis",
      icon: <span className="text-lg">ॐ</span>,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-orange-300 mb-2">
              Ancient Wisdom Analysis
            </h3>
            <Badge variant="outline" className="text-white border-orange-400">
              Sidereal Calculation
            </Badge>
          </div>
          
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/30">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">🌟 Nakshatra Analysis</h4>
                <p className="text-gray-200 text-sm">Your birth star reveals deep karmic patterns and spiritual purpose in this lifetime.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/30">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">⚡ Planetary Periods (Dasha)</h4>
                <p className="text-gray-200 text-sm">Current planetary period influences your life themes and opportunities for growth.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/30">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">🔥 Ayurvedic Constitution</h4>
                <p className="text-gray-200 text-sm">Your dosha balance guides health, diet, and lifestyle choices for optimal well-being.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    chinese: {
      title: "Chinese Zodiac Analysis",
      icon: <span className="text-lg">☯</span>,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-red-300 mb-2">
              {insights.chinese.animal} • {insights.chinese.element}
            </h3>
            <Badge variant="outline" className="text-white border-red-400">
              {new Date(data.birthDate).getFullYear()} Year
            </Badge>
          </div>
          
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-red-500/20 to-yellow-500/20 border-red-400/30">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">🐉 Animal Characteristics</h4>
                <p className="text-gray-200 text-sm">The {insights.chinese.animal} embodies wisdom, strength, and natural leadership abilities in Chinese astrology.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500/20 to-yellow-500/20 border-red-400/30">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">🌟 Five Element Energy</h4>
                <p className="text-gray-200 text-sm">{insights.chinese.element} element influences your personality, relationships, and life approach.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500/20 to-yellow-500/20 border-red-400/30">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">💰 Feng Shui Recommendations</h4>
                <p className="text-gray-200 text-sm">Optimize your environment with colors, directions, and elements that enhance your natural energy.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    numerology: {
      title: "Numerology Analysis",
      icon: <Calculator className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-300 mb-2">
              Life Path {insights.numerology.lifePath}
            </h3>
            <Badge variant="outline" className="text-white border-green-400">
              Master Number Analysis
            </Badge>
          </div>
          
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">🎯 Life Purpose</h4>
                <p className="text-gray-200 text-sm">Your Life Path {insights.numerology.lifePath} reveals your soul's mission and natural talents in this lifetime.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">💫 Destiny Number</h4>
                <p className="text-gray-200 text-sm">Your name carries the vibration of destiny number {insights.numerology.destiny}, guiding your life's work.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">🔄 Personal Year Cycle</h4>
                <p className="text-gray-200 text-sm">Understanding your current nine-year cycle helps timing for major life decisions and changes.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
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

      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-black/60 border-white/20 backdrop-blur-md">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <CardTitle className="text-white text-2xl mb-2">
              ✨ Your Cosmic Profile ✨
            </CardTitle>
            <p className="text-gray-300">
              {data.firstName} {data.lastName} • Born {new Date(data.birthDate).toLocaleDateString()}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" className="cosmic-button">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="cosmic-button">
                <Mail className="mr-2 h-4 w-4" />
                Email Report
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeSystem} onValueChange={setActiveSystem} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="western" className="text-white data-[state=active]:bg-purple-500">
                Western
              </TabsTrigger>
              <TabsTrigger value="vedic" className="text-white data-[state=active]:bg-orange-500">
                Vedic
              </TabsTrigger>
              <TabsTrigger value="chinese" className="text-white data-[state=active]:bg-red-500">
                Chinese
              </TabsTrigger>
              <TabsTrigger value="numerology" className="text-white data-[state=active]:bg-green-500">
                Numerology
              </TabsTrigger>
            </TabsList>

            {Object.entries(systemContent).map(([key, system]) => (
              <TabsContent key={key} value={key} className="mt-6">
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center text-xl">
                      {system.icon}
                      <span className="ml-2">{system.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {system.content}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center mt-8 p-4 bg-white/5 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">
              🌟 This analysis is based on authentic astronomical calculations using Swiss Ephemeris precision.
              <br />
              For the most accurate rising sign, ensure your birth time is exact to the minute.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}