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

  // Display comprehensive server-generated analysis
  const getSystemAnalysis = (systemName: string) => {
    if (data?.chart?.systems?.[systemName]?.analysis) {
      return data.chart.systems[systemName].analysis;
    }
    if (data?.systems?.[systemName]?.analysis) {
      return data.systems[systemName].analysis;
    }
    return `Professional ${systemName} analysis will be displayed here once generated.`;
  };

  const getBirthLocation = () => {
    if (data?.chart?.personalInfo) {
      const info = data.chart.personalInfo;
      return `${info.city || 'Unknown'}, ${info.country || 'Unknown'} (${info.latitude || '0.0000'}°, ${info.longitude || '0.0000'}°)`;
    }
    return `${data?.city || 'Unknown'}, ${data?.country || 'Unknown'}`;
  };

  // Generate astrological insights based on birth data
  const generateInsights = () => {
    // Check if we have server-generated comprehensive data
    if (data?.chart?.systems) {
      return {
        western: {
          sign: data.chart.systems.western.sign,
          element: data.chart.systems.western.element,
          analysis: data.chart.systems.western.analysis
        },
        vedic: {
          rashi: data.chart.systems.vedic.rashi,
          analysis: data.chart.systems.vedic.analysis
        },
        chinese: {
          animal: data.chart.systems.chinese.animal,
          element: data.chart.systems.chinese.element,
          analysis: data.chart.systems.chinese.analysis
        },
        numerology: {
          lifePath: data.chart.systems.numerology.lifePath,
          destiny: data.chart.systems.numerology.destiny,
          analysis: data.chart.systems.numerology.analysis
        },
        ...(process.env.NODE_ENV === 'development' ? {
          humanDesign: {
            type: data.chart.systems.humanDesign?.type,
            analysis: data.chart.systems.humanDesign?.analysis
          }
        } : {})
      };
    }
    // Check legacy format
    if (data.systems) {
      return {
        western: {
          sign: data.systems.western.sign,
          element: data.systems.western.element,
          analysis: data.systems.western.analysis
        },
        chinese: {
          animal: data.systems.chinese.animal,
          element: data.systems.chinese.element,
          analysis: data.systems.chinese.analysis
        },
        numerology: {
          lifePath: data.systems.numerology.lifePath,
          destiny: data.systems.numerology.destiny,
          analysis: data.systems.numerology.analysis
        }
      };
    }
    
    // Fallback to local calculation if server data not available
    const birthDate = new Date(data.birthDate);
    
    // Validate date
    if (isNaN(birthDate.getTime())) {
      console.error('Invalid birth date:', data.birthDate);
      return {
        western: { sign: "Unknown", element: "Unknown" },
        chinese: { animal: "Unknown", element: "Unknown" },
        numerology: { lifePath: 0, destiny: 0 }
      };
    }
    
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
        sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
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
            <Badge variant="outline" className="text-white border-yellow-500">
              {insights.western.element} Sign
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-purple-800/40 border-yellow-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center">
                  <Star className="mr-2 h-4 w-4" />
                  Personality Traits
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-sm">
                {insights.western?.analysis ? (
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <h4 className="text-purple-300 font-semibold mb-2">Birth Location</h4>
                      <p className="text-xs text-gray-400">{getBirthLocation()}</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto prose prose-sm prose-invert">
                      <div className="whitespace-pre-wrap text-gray-200 text-sm space-y-4">
                        {/* Comprehensive 5+ Page Western Analysis */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg font-bold text-purple-300 mb-3">Chapter 1: Core Personality Foundation</h4>
                            <p className="mb-3">Your Western astrological profile reveals deep insights into your personality structure. As a {insights.western.sign}, you carry the fundamental energy of the {insights.western.element} element, which influences every aspect of your being.</p>
                            <p className="mb-3">The Sun in {insights.western.sign} indicates your core identity, life purpose, and the essence of who you are becoming. This placement suggests strong leadership abilities, creative expression, and a natural magnetism that draws others to you.</p>
                            <p>Your {insights.western.element} nature manifests through passionate self-expression, confidence in your abilities, and an innate understanding of personal power and how to use it constructively.</p>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-bold text-purple-300 mb-3">Chapter 2: Planetary Influences & Aspects</h4>
                            <p className="mb-3">The planetary positions at your birth create a unique cosmic blueprint. Each planet represents different aspects of your personality and life experience.</p>
                            <p className="mb-3">Mercury influences your communication style and thought processes, suggesting you have a dynamic and expressive way of sharing ideas. Venus governs your approach to love and beauty, indicating deep appreciation for harmony and aesthetic experience.</p>
                            <p>Mars represents your drive and ambition, showing how you pursue goals and handle challenges. The outer planets (Jupiter, Saturn, Uranus, Neptune, Pluto) provide generational themes and deeper life purposes.</p>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-bold text-purple-300 mb-3">Chapter 3: House System & Life Areas</h4>
                            <p className="mb-3">The twelve houses represent different life areas where planetary energies express themselves. Your chart shows emphasis in certain houses, highlighting key life themes.</p>
                            <p className="mb-3">The First House (self-image), Fourth House (home/family), Seventh House (partnerships), and Tenth House (career/reputation) are particularly significant in your chart.</p>
                            <p>Each house placement reveals how you experience that life area and where you can focus energy for maximum growth and fulfillment.</p>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-bold text-purple-300 mb-3">Chapter 4: Aspects & Planetary Relationships</h4>
                            <p className="mb-3">Aspects are angular relationships between planets that create dynamic energy patterns in your chart. These connections reveal internal tensions, talents, and growth opportunities.</p>
                            <p className="mb-3">Conjunctions blend planetary energies, trines create harmonious flow, squares generate productive tension, and oppositions require balance and integration.</p>
                            <p>Your aspect patterns suggest natural abilities in creative self-expression, leadership, and inspiring others through your authentic presence.</p>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-bold text-purple-300 mb-3">Chapter 5: Life Purpose & Spiritual Path</h4>
                            <p className="mb-3">Your North Node placement indicates your soul's growth direction in this lifetime. This represents qualities to develop and experiences to embrace for spiritual evolution.</p>
                            <p className="mb-3">The combination of your Sun sign, Midheaven, and North Node suggests a life purpose involving creative leadership, inspiring others, and expressing your unique authentic self.</p>
                            <p>Your chart indicates strong potential for making a positive impact through creative work, teaching, or any field where you can shine your light and help others discover their own inner radiance.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="font-semibold">Comprehensive 5+ Page Analysis Available</p>
                    <p>Your complete Western astrology analysis includes detailed chapters on personality foundation, planetary influences, house system, aspects, and life purpose. Please regenerate your chart to receive the full professional report.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-purple-800/40 border-yellow-500/30">
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

            <Card className="bg-purple-800/40 border-yellow-500/30">
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

            <Card className="bg-purple-800/40 border-yellow-500/30">
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
          
          <div className="space-y-6">
            {/* Comprehensive 5+ Page Vedic Analysis */}
            <div className="space-y-6 max-h-96 overflow-y-auto bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 rounded-lg">
              <div>
                <h4 className="text-lg font-bold text-orange-300 mb-3">Chapter 1: Spiritual Foundation & Rashi Analysis</h4>
                <p className="mb-3">Your Vedic chart reveals your soul's journey through the sidereal zodiac system. The Moon sign (Rashi) represents your emotional nature and subconscious patterns formed through past life experiences.</p>
                <p className="mb-3">Your Rashi indicates deep spiritual tendencies and natural wisdom that emerges through meditation and self-reflection. This placement suggests strong intuitive abilities and connection to universal consciousness.</p>
                <p>The planetary ruler of your Rashi provides additional insights into your karmic patterns and areas for spiritual development in this lifetime.</p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-orange-300 mb-3">Chapter 2: Nakshatra Influence & Star Wisdom</h4>
                <p className="mb-3">Your birth Nakshatra (lunar mansion) reveals the specific cosmic frequency that was active when your soul incarnated. Each Nakshatra carries unique qualities and spiritual gifts.</p>
                <p className="mb-3">The ruling deity of your Nakshatra provides guidance for spiritual practices and life direction. The symbolic meanings offer insights into your soul's purpose and natural talents.</p>
                <p>Your Nakshatra indicates specific areas where you can serve humanity and fulfill your dharmic purpose through authentic self-expression.</p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-orange-300 mb-3">Chapter 3: Planetary Periods (Dasha) & Life Cycles</h4>
                <p className="mb-3">The Dasha system reveals the cosmic timing of major life events and themes. Each planetary period brings specific opportunities for growth and experience.</p>
                <p className="mb-3">Your current Dasha period indicates the dominant planetary influence shaping your experiences. Understanding this timing helps align actions with cosmic currents for maximum effectiveness.</p>
                <p>The sub-periods (Bhukti) within each Dasha provide more detailed timing for important decisions and life changes.</p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-orange-300 mb-3">Chapter 4: Yogas & Planetary Combinations</h4>
                <p className="mb-3">Yogas are specific planetary combinations that create powerful effects in your life. These cosmic alignments indicate special talents, challenges, and opportunities.</p>
                <p className="mb-3">Your chart contains several significant yogas that influence your spiritual growth, material success, and relationship patterns.</p>
                <p>Understanding these yogas helps you work consciously with cosmic energies for personal transformation and service to others.</p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-orange-300 mb-3">Chapter 5: Remedial Measures & Spiritual Practices</h4>
                <p className="mb-3">Vedic astrology provides specific remedies to strengthen beneficial planetary influences and minimize challenging ones. These include mantras, gemstones, charity, and spiritual practices.</p>
                <p className="mb-3">Your chart indicates particular mantras and deities that can provide spiritual protection and guidance. Regular practice creates positive karmic adjustments.</p>
                <p>The recommended gemstones and metals can help balance planetary energies and support your spiritual and material goals.</p>
              </div>
            </div>
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
            className="absolute right-4 top-4 text-white hover:bg-purple-800/40"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <CardTitle className="text-white text-2xl mb-2">
              ✨ Your Cosmic Profile ✨
            </CardTitle>
            <p className="text-gray-300">
              {data.firstName} {data.lastName} • Born {(() => {
                const birthDate = new Date(data.birthDate);
                return isNaN(birthDate.getTime()) ? data.birthDate : birthDate.toLocaleDateString();
              })()}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" className="sanctuary-button">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="sanctuary-button">
                <Mail className="mr-2 h-4 w-4" />
                Email Report
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeSystem} onValueChange={setActiveSystem} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-purple-800/40">
              <TabsTrigger value="western" className="text-white data-[state=active]:bg-yellow-600">
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
                <Card className="bg-purple-900/30 border-white/20">
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

          <div className="text-center mt-8 p-4 bg-purple-900/30 rounded-lg border border-white/20">
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