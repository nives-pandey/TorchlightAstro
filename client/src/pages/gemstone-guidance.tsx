import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  Home, 
  Gem, 
  Heart, 
  Shield, 
  DollarSign, 
  Brain, 
  Star, 
  Sun, 
  Moon,
  Crown,
  Sparkles,
  Clock
} from "lucide-react";

interface GemstoneSuggestion {
  name: string;
  purpose: string;
  chakra: string;
  planet: string;
  benefits: string[];
  wearingInstructions: string;
  cleansing: string;
  color: string;
  hardness: string;
  element: string;
}

export default function GemstoneGuidance() {
  const [activeCategory, setActiveCategory] = useState("protection");
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneSuggestion | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Get user profile for personalized recommendations
  useEffect(() => {
    const storedProfile = localStorage.getItem('userBirthData');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  }, []);

  // Comprehensive gemstone database
  const gemstoneDatabase: Record<string, GemstoneSuggestion[]> = {
    protection: [
      {
        name: "Black Tourmaline",
        purpose: "Psychic Protection & Grounding",
        chakra: "Root Chakra",
        planet: "Saturn",
        benefits: ["Blocks negative energy", "EMF protection", "Grounding", "Anxiety relief"],
        wearingInstructions: "Wear on left wrist or carry in pocket. Most effective during stressful situations.",
        cleansing: "Moonlight cleansing monthly. Sage smoke weekly.",
        color: "Deep Black",
        hardness: "7-7.5",
        element: "Earth"
      },
      {
        name: "Hematite",
        purpose: "Mental Protection & Focus",
        chakra: "Root Chakra",
        planet: "Mars",
        benefits: ["Mental clarity", "Confidence", "Blood circulation", "Courage"],
        wearingInstructions: "Ring on dominant hand or bracelet on right wrist.",
        cleansing: "Running water and sunlight. Avoid salt water.",
        color: "Metallic Silver-Black",
        hardness: "5-6",
        element: "Fire/Earth"
      },
      {
        name: "Obsidian",
        purpose: "Spiritual Protection & Truth",
        chakra: "Root Chakra",
        planet: "Pluto",
        benefits: ["Reveals truth", "Protective shield", "Emotional healing", "Past life recall"],
        wearingInstructions: "Pendant near heart or carried during meditation.",
        cleansing: "Earth burial for 24 hours monthly.",
        color: "Deep Black",
        hardness: "5-5.5",
        element: "Fire/Earth"
      }
    ],
    healing: [
      {
        name: "Rose Quartz",
        purpose: "Heart Healing & Self-Love",
        chakra: "Heart Chakra",
        planet: "Venus",
        benefits: ["Unconditional love", "Emotional healing", "Self-compassion", "Relationship harmony"],
        wearingInstructions: "Pendant over heart or sleep with under pillow.",
        cleansing: "Moonlight and rose petals monthly.",
        color: "Soft Pink",
        hardness: "7",
        element: "Water"
      },
      {
        name: "Green Aventurine",
        purpose: "Physical & Emotional Healing",
        chakra: "Heart Chakra",
        planet: "Mercury",
        benefits: ["Heart health", "Emotional balance", "Luck", "Stress relief"],
        wearingInstructions: "Bracelet on receiving hand (left) during healing work.",
        cleansing: "Running water and green plants energy.",
        color: "Soft Green",
        hardness: "7",
        element: "Earth"
      },
      {
        name: "Amethyst",
        purpose: "Spiritual Healing & Intuition",
        chakra: "Crown/Third Eye",
        planet: "Jupiter",
        benefits: ["Spiritual protection", "Intuition", "Sobriety", "Peace"],
        wearingInstructions: "Crown of head during meditation or third eye placement.",
        cleansing: "Full moon energy and clear quartz amplification.",
        color: "Purple Violet",
        hardness: "7",
        element: "Air/Water"
      }
    ],
    prosperity: [
      {
        name: "Citrine",
        purpose: "Abundance & Financial Success",
        chakra: "Solar Plexus",
        planet: "Sun",
        benefits: ["Wealth attraction", "Confidence", "Creativity", "Success"],
        wearingInstructions: "Left pocket or wallet. Ring on middle finger of dominant hand.",
        cleansing: "Sunlight charging. Self-cleansing stone.",
        color: "Golden Yellow",
        hardness: "7",
        element: "Fire"
      },
      {
        name: "Pyrite",
        purpose: "Manifestation & Business Success",
        chakra: "Solar Plexus",
        planet: "Mars",
        benefits: ["Business success", "Manifestation", "Willpower", "Confidence"],
        wearingInstructions: "Office desk or carry during business meetings.",
        cleansing: "Dry brushing with soft cloth. Avoid water.",
        color: "Metallic Gold",
        hardness: "6-6.5",
        element: "Fire/Earth"
      },
      {
        name: "Green Jade",
        purpose: "Prosperity & Good Fortune",
        chakra: "Heart Chakra",
        planet: "Venus",
        benefits: ["Good luck", "Prosperity", "Harmony", "Wisdom"],
        wearingInstructions: "Bracelet on left wrist or pendant near heart.",
        cleansing: "Moonlight and incense smoke.",
        color: "Rich Green",
        hardness: "6-7",
        element: "Earth"
      }
    ],
    wisdom: [
      {
        name: "Lapis Lazuli",
        purpose: "Wisdom & Truth Communication",
        chakra: "Throat/Third Eye",
        planet: "Jupiter",
        benefits: ["Truth speaking", "Wisdom", "Psychic abilities", "Communication"],
        wearingInstructions: "Throat chakra pendant or third eye placement during study.",
        cleansing: "Star light and sage smoke.",
        color: "Deep Blue with Gold",
        hardness: "5-5.5",
        element: "Air/Water"
      },
      {
        name: "Sodalite",
        purpose: "Logic & Rational Thinking",
        chakra: "Throat Chakra",
        planet: "Mercury",
        benefits: ["Logical thinking", "Communication", "Truth", "Objectivity"],
        wearingInstructions: "During study sessions or important communications.",
        cleansing: "Cool water and moonlight.",
        color: "Blue with White",
        hardness: "5.5-6",
        element: "Air"
      },
      {
        name: "Clear Quartz",
        purpose: "Amplification & Clarity",
        chakra: "Crown Chakra",
        planet: "Moon",
        benefits: ["Energy amplification", "Clarity", "Healing boost", "Meditation"],
        wearingInstructions: "With other stones to amplify their effects.",
        cleansing: "All methods work. Sunlight and moonlight preferred.",
        color: "Clear Transparent",
        hardness: "7",
        element: "All Elements"
      }
    ]
  };

  // Personalized recommendations based on birth data
  const getPersonalizedRecommendations = () => {
    if (!userProfile) return [];

    const recommendations = [];
    
    // Western astrology based recommendations
    if (userProfile.systems?.western?.sign) {
      const sign = userProfile.systems.western.sign;
      
      // Fire signs
      if (['Aries', 'Leo', 'Sagittarius'].includes(sign)) {
        recommendations.push({
          name: "Carnelian",
          purpose: "Fire Sign Energy Enhancement",
          chakra: "Sacral Chakra",
          planet: "Mars",
          benefits: ["Courage boost", "Creative energy", "Motivation", "Leadership"],
          wearingInstructions: "Ring on right hand or pendant during active work.",
          cleansing: "Sunlight charging and fire element rituals.",
          color: "Orange-Red",
          hardness: "7",
          element: "Fire",
          personalNote: `Perfect for ${sign} energy enhancement`
        });
      }
      
      // Earth signs
      if (['Taurus', 'Virgo', 'Capricorn'].includes(sign)) {
        recommendations.push({
          name: "Moss Agate",
          purpose: "Earth Sign Grounding",
          chakra: "Root Chakra", 
          planet: "Earth",
          benefits: ["Grounding", "Nature connection", "Stability", "Growth"],
          wearingInstructions: "Touch to earth regularly. Carry during nature walks.",
          cleansing: "Earth burial and plant energy.",
          color: "Green with Moss Patterns",
          hardness: "7",
          element: "Earth",
          personalNote: `Enhances natural ${sign} earth energy`
        });
      }
      
      // Air signs
      if (['Gemini', 'Libra', 'Aquarius'].includes(sign)) {
        recommendations.push({
          name: "Blue Lace Agate",
          purpose: "Air Sign Communication",
          chakra: "Throat Chakra",
          planet: "Mercury",
          benefits: ["Clear communication", "Peaceful expression", "Calm mind", "Truth"],
          wearingInstructions: "Throat area during speaking or writing.",
          cleansing: "Wind and incense smoke.",
          color: "Soft Blue with White",
          hardness: "7",
          element: "Air",
          personalNote: `Supports ${sign} communication gifts`
        });
      }
      
      // Water signs
      if (['Cancer', 'Scorpio', 'Pisces'].includes(sign)) {
        recommendations.push({
          name: "Moonstone",
          purpose: "Water Sign Intuition",
          chakra: "Crown/Third Eye",
          planet: "Moon",
          benefits: ["Intuition enhancement", "Emotional balance", "Psychic abilities", "Feminine energy"],
          wearingInstructions: "During full moon and meditation practices.",
          cleansing: "Moonlight and sea water.",
          color: "Creamy White with Blue Flash",
          hardness: "6-6.5",
          element: "Water",
          personalNote: `Amplifies natural ${sign} intuitive abilities`
        });
      }
    }

    // Numerology based recommendations
    if (userProfile.systems?.numerology?.lifePath) {
      const lifePath = userProfile.systems.numerology.lifePath;
      
      if ([1, 8].includes(lifePath)) {
        recommendations.push({
          name: "Tiger's Eye",
          purpose: "Leadership Life Path",
          chakra: "Solar Plexus",
          planet: "Sun",
          benefits: ["Leadership confidence", "Decision making", "Protection", "Prosperity"],
          wearingInstructions: "Right hand ring or dominant wrist during leadership activities.",
          cleansing: "Solar energy and gold element rituals.",
          color: "Golden Brown with Chatoyancy",
          hardness: "7",
          element: "Fire/Earth",
          personalNote: `Perfect for Life Path ${lifePath} leadership energy`
        });
      }
    }

    return recommendations;
  };

  const personalizedGems = getPersonalizedRecommendations();

  const categories = [
    { id: "personalized", name: "For You", icon: <Star className="h-4 w-4" />, color: "bg-yellow-600" },
    { id: "protection", name: "Protection", icon: <Shield className="h-4 w-4" />, color: "bg-red-500" },
    { id: "healing", name: "Healing", icon: <Heart className="h-4 w-4" />, color: "bg-green-500" },
    { id: "prosperity", name: "Prosperity", icon: <DollarSign className="h-4 w-4" />, color: "bg-yellow-500" },
    { id: "wisdom", name: "Wisdom", icon: <Brain className="h-4 w-4" />, color: "bg-blue-500" }
  ];

  const getCurrentGemstones = () => {
    if (activeCategory === "personalized") return personalizedGems;
    return gemstoneDatabase[activeCategory] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-yellow-600/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Gem className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-pink-400 bg-clip-text text-transparent">
                  Gemstone Guidance
                </h1>
                <p className="text-purple-300">Discover crystals aligned with your cosmic energy</p>
              </div>
            </div>
            <Link href="/home">
              <Button variant="outline" className="border-yellow-600/30 text-purple-300 hover:bg-yellow-600/20">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Selection */}
          <div className="lg:col-span-1">
            <Card className="bg-black/40 border-yellow-600/30">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeCategory === category.id 
                        ? `${category.color} text-white` 
                        : "text-purple-300 hover:bg-yellow-600/20"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.icon}
                    <span className="ml-2">{category.name}</span>
                    {category.id === "personalized" && personalizedGems.length > 0 && (
                      <Badge className="ml-auto bg-yellow-500 text-black text-xs">
                        {personalizedGems.length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Reference */}
            <Card className="bg-black/40 border-yellow-600/30 mt-6">
              <CardHeader>
                <CardTitle className="text-purple-300 text-sm">Quick Reference</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-center text-purple-300">
                  <Crown className="h-4 w-4 mr-2" />
                  Crown Chakra: Spiritual
                </div>
                <div className="flex items-center text-blue-300">
                  <Brain className="h-4 w-4 mr-2" />
                  Third Eye: Intuition
                </div>
                <div className="flex items-center text-cyan-300">
                  <span className="w-4 h-4 mr-2 rounded-full bg-cyan-500"></span>
                  Throat: Communication
                </div>
                <div className="flex items-center text-green-300">
                  <Heart className="h-4 w-4 mr-2" />
                  Heart: Love & Healing
                </div>
                <div className="flex items-center text-yellow-300">
                  <Sun className="h-4 w-4 mr-2" />
                  Solar Plexus: Power
                </div>
                <div className="flex items-center text-orange-300">
                  <span className="w-4 h-4 mr-2 rounded-full bg-orange-500"></span>
                  Sacral: Creativity
                </div>
                <div className="flex items-center text-red-300">
                  <span className="w-4 h-4 mr-2 rounded-full bg-red-500"></span>
                  Root: Grounding
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gemstone Grid */}
          <div className="lg:col-span-3">
            {activeCategory === "personalized" && personalizedGems.length === 0 && (
              <Card className="bg-black/40 border-yellow-600/30">
                <CardContent className="text-center py-12">
                  <Gem className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">
                    Create Your Chart First
                  </h3>
                  <p className="text-yellow-500 mb-6">
                    Generate your birth chart to receive personalized gemstone recommendations based on your astrological profile.
                  </p>
                  <Link href="/home">
                    <Button className="bg-yellow-600 hover:bg-purple-700">
                      Create Chart
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {getCurrentGemstones().map((gemstone, index) => (
                <Card 
                  key={index}
                  className="bg-black/40 border-yellow-600/30 hover:border-yellow-500/50 transition-all cursor-pointer transform hover:scale-105"
                  onClick={() => setSelectedGemstone(gemstone)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-purple-300">{gemstone.name}</CardTitle>
                      <div className={`w-6 h-6 rounded-full border-2 border-white/30 ${
                        gemstone.color.includes('Black') ? 'bg-black' :
                        gemstone.color.includes('Pink') ? 'bg-pink-400' :
                        gemstone.color.includes('Green') ? 'bg-green-400' :
                        gemstone.color.includes('Purple') ? 'bg-yellow-500' :
                        gemstone.color.includes('Blue') ? 'bg-blue-400' :
                        gemstone.color.includes('Yellow') || gemstone.color.includes('Gold') ? 'bg-yellow-400' :
                        gemstone.color.includes('Orange') ? 'bg-orange-400' :
                        gemstone.color.includes('Red') ? 'bg-red-400' :
                        gemstone.color.includes('Clear') ? 'bg-white' :
                        'bg-gray-400'
                      }`}></div>
                    </div>
                    <p className="text-sm text-yellow-500">{gemstone.purpose}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-300">Chakra:</span>
                        <span className="text-yellow-500">{gemstone.chakra}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-300">Planet:</span>
                        <span className="text-yellow-500">{gemstone.planet}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-300">Element:</span>
                        <span className="text-yellow-500">{gemstone.element}</span>
                      </div>
                      
                      {/* Benefits */}
                      <div className="space-y-1">
                        <p className="text-sm text-purple-300">Benefits:</p>
                        <div className="flex flex-wrap gap-1">
                          {gemstone.benefits.slice(0, 3).map((benefit, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-yellow-600/20 text-purple-300">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Personal note for personalized recommendations */}
                      {(gemstone as any).personalNote && (
                        <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
                          <p className="text-xs text-yellow-300">{(gemstone as any).personalNote}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Gemstone Modal */}
      {selectedGemstone && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-black/90 border-yellow-600/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full border-2 border-white/30 ${
                    selectedGemstone.color.includes('Black') ? 'bg-black' :
                    selectedGemstone.color.includes('Pink') ? 'bg-pink-400' :
                    selectedGemstone.color.includes('Green') ? 'bg-green-400' :
                    selectedGemstone.color.includes('Purple') ? 'bg-yellow-500' :
                    selectedGemstone.color.includes('Blue') ? 'bg-blue-400' :
                    selectedGemstone.color.includes('Yellow') || selectedGemstone.color.includes('Gold') ? 'bg-yellow-400' :
                    selectedGemstone.color.includes('Orange') ? 'bg-orange-400' :
                    selectedGemstone.color.includes('Red') ? 'bg-red-400' :
                    selectedGemstone.color.includes('Clear') ? 'bg-white' :
                    'bg-gray-400'
                  }`}></div>
                  <div>
                    <CardTitle className="text-xl text-purple-300">{selectedGemstone.name}</CardTitle>
                    <p className="text-yellow-500">{selectedGemstone.purpose}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedGemstone(null)}
                  className="text-purple-300 hover:bg-yellow-600/20"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Properties */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-purple-300">Chakra</p>
                  <p className="text-yellow-500">{selectedGemstone.chakra}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-purple-300">Ruling Planet</p>
                  <p className="text-yellow-500">{selectedGemstone.planet}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-purple-300">Element</p>
                  <p className="text-yellow-500">{selectedGemstone.element}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-purple-300">Hardness</p>
                  <p className="text-yellow-500">{selectedGemstone.hardness}</p>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="text-purple-300 font-semibold mb-3 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Benefits
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedGemstone.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center text-sm text-yellow-500">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Wearing Instructions */}
              <div>
                <h4 className="text-purple-300 font-semibold mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  How to Wear
                </h4>
                <p className="text-yellow-500 text-sm leading-relaxed">
                  {selectedGemstone.wearingInstructions}
                </p>
              </div>

              {/* Cleansing */}
              <div>
                <h4 className="text-purple-300 font-semibold mb-3 flex items-center">
                  <Moon className="h-4 w-4 mr-2" />
                  Cleansing & Charging
                </h4>
                <p className="text-yellow-500 text-sm leading-relaxed">
                  {selectedGemstone.cleansing}
                </p>
              </div>

              {/* Personal note for personalized recommendations */}
              {(selectedGemstone as any).personalNote && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <h4 className="text-yellow-300 font-semibold mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Personal Recommendation
                  </h4>
                  <p className="text-yellow-300 text-sm">{(selectedGemstone as any).personalNote}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}