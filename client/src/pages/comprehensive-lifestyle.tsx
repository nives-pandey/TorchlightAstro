import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Thermometer, 
  Calendar, 
  Utensils, 
  Briefcase, 
  Heart, 
  Activity, 
  Palette, 
  Gem, 
  Clock,
  Navigation,
  Sun,
  Moon,
  Star,
  Globe,
  Compass,
  Target,
  AlertTriangle
} from "lucide-react";

export default function ComprehensiveLifestyle() {
  const [selectedCategory, setSelectedCategory] = useState("travel");

  // Sample comprehensive profile data
  const profile = {
    name: "Sample User",
    birthDate: "1990-06-15",
    location: "Paris, France",
    systems: {
      western: { sunSign: "Gemini", moonSign: "Scorpio", ascendant: "Leo", element: "Air" },
      vedic: { rashi: "Karkata", nakshatra: "Pushya", dosha: "Pitta" },
      chinese: { animal: "Horse", element: "Metal", season: "Summer" },
      humanDesign: { type: "Generator", authority: "Sacral", profile: "2/4" },
      numerology: { lifePathNumber: 7, destinyNumber: 3, soulUrge: 9 }
    }
  };

  // Multi-system recommendations
  const lifestyleRecommendations = {
    travel: {
      favorableDestinations: [
        {
          location: "Himalayas, Nepal",
          climate: "Mountain, Cool",
          temperature: "15-25°C",
          bestSeasons: ["March-May", "September-November"],
          benefits: ["Mental clarity", "Spiritual growth", "Air element harmony"],
          systems: ["Western (Air)", "Vedic (Mountain energy)", "Human Design (Generator recharge)"],
          confidence: 92
        },
        {
          location: "Swiss Alps",
          climate: "Alpine, Fresh",
          temperature: "18-24°C", 
          bestSeasons: ["June-September"],
          benefits: ["Grounding", "Health improvement", "Metal element balance"],
          systems: ["Chinese (Metal element)", "Vedic (Pitta cooling)", "Numerology (7 - solitude)"],
          confidence: 88
        },
        {
          location: "Greek Islands",
          climate: "Mediterranean, Breezy",
          temperature: "22-28°C",
          bestSeasons: ["April-June", "September-October"],
          benefits: ["Communication skills", "Emotional healing", "Social connections"],
          systems: ["Western (Gemini)", "Human Design (2/4 profile)"],
          confidence: 85
        }
      ],
      unfavorableDestinations: [
        { location: "Amazon Rainforest", reason: "Excessive humidity aggravates Pitta dosha", systems: ["Vedic"] },
        { location: "Sahara Desert", reason: "Extreme heat conflicts with Metal element", systems: ["Chinese"] }
      ],
      idealClimate: {
        temperature: "18-25°C",
        humidity: "40-60%",  
        description: "Cool to moderate temperatures with fresh air circulation",
        reasoning: [
          "Pitta dosha needs cooling environments",
          "Air element requires good ventilation", 
          "Generator type benefits from energizing but not overstimulating climates"
        ]
      }
    },
    food: {
      beneficialFoods: [
        {
          category: "Cooling Foods (Vedic)",
          items: ["Cucumber", "Coconut water", "Mint", "Cilantro", "Sweet fruits"],
          benefits: ["Reduces Pitta heat", "Improves digestion", "Calms nervous system"],
          timing: "Consume during hot weather or high-stress periods"
        },
        {
          category: "Brain Foods (Western/Numerology)",
          items: ["Blueberries", "Walnuts", "Dark chocolate", "Green tea", "Avocado"],
          benefits: ["Enhances mental clarity", "Supports Gemini quick thinking", "Nourishes Life Path 7 intuition"],
          timing: "Morning and afternoon for peak mental performance"
        },
        {
          category: "Energy Foods (Chinese)",
          items: ["White rice", "Pears", "White fish", "Almonds", "Cauliflower"],
          benefits: ["Supports Metal element", "Enhances lung function", "Balances Horse energy"],
          timing: "Lunch and early dinner"
        }
      ],
      harmfulFoods: [
        { category: "Hot/Spicy", items: ["Chili peppers", "Hot sauce", "Ginger in excess"], reason: "Aggravates Pitta dosha" },
        { category: "Heavy/Oily", items: ["Fried foods", "Heavy meats", "Excessive dairy"], reason: "Slows down Generator energy" }
      ],
      idealDiet: {
        type: "Mediterranean-Ayurvedic Fusion",
        description: "Fresh, cooling foods with emphasis on vegetables, fruits, and moderate proteins",
        principles: [
          "60% cooling vegetables and fruits",
          "25% lean proteins (fish, legumes)",
          "15% healthy fats (olive oil, nuts)"
        ]
      }
    },
    career: {
      idealProfessions: [
        {
          profession: "Data Analyst / Researcher",
          industry: "Technology / Academia",
          match: "95%",
          systems: ["Numerology 7 (research)", "Gemini (analysis)", "Generator (sustained focus)"],
          benefits: ["Uses natural analytical skills", "Satisfies curiosity", "Provides mental stimulation"],
          environment: "Quiet office with flexible hours"
        },
        {
          profession: "Travel Writer / Journalist",
          industry: "Media / Tourism",
          match: "90%",
          systems: ["Gemini (communication)", "Human Design 2/4 (networking)", "Horse (travel)"],
          benefits: ["Combines communication and travel", "Flexible schedule", "Variety in work"],
          environment: "Remote work with travel opportunities"
        },
        {
          profession: "Wellness Consultant",
          industry: "Health / Lifestyle",
          match: "87%",
          systems: ["Pitta dosha (health focus)", "Life Path 7 (spiritual guidance)", "Leo rising (leadership)"],
          benefits: ["Helps others", "Personal growth", "Health-focused"],
          environment: "Healing centers or private practice"
        }
      ],
      unfavorableCareers: [
        { profession: "High-pressure sales", reason: "Conflicts with Pitta temperament and Generator strategy" },
        { profession: "Night shift work", reason: "Disrupts natural circadian rhythm important for Pitta balance" }
      ],
      timing: {
        bestPeriods: ["Spring months", "Morning hours 9-11 AM", "Numbers 7, 3, 9 dates"],
        avoidPeriods: ["Peak summer heat", "Late evening decisions", "Number 8 dates (karmic challenges)"]
      }
    },
    health: {
      vulnerableAreas: [
        {
          area: "Digestive System",
          vulnerability: "Pitta-related acidity and inflammation",
          prevention: ["Cool, fresh foods", "Regular meal times", "Stress management"],
          systems: ["Vedic (Pitta imbalance)", "Western (Gemini nervous digestion)"]
        },
        {
          area: "Nervous System", 
          vulnerability: "Mental overstimulation and anxiety",
          prevention: ["Meditation", "Regular sleep", "Limit caffeine"],
          systems: ["Numerology 7 (sensitive)", "Gemini (mental stress)", "Generator (burnout risk)"]
        },
        {
          area: "Respiratory System",
          vulnerability: "Allergies and breathing issues",
          prevention: ["Clean air environments", "Breathing exercises", "Avoid pollutants"],
          systems: ["Chinese Metal element", "Air sign sensitivity"]
        }
      ],
      strengthAreas: ["Mental agility", "Adaptability", "Communication", "Research abilities"],
      preventiveMeasures: [
        { measure: "Morning pranayama", frequency: "Daily", systems: ["Vedic", "Western Air element"] },
        { measure: "Cool-down meditation", frequency: "Evening", systems: ["Pitta balancing", "Generator decompression"] }
      ]
    },
    relationships: {
      compatibleSigns: [
        { sign: "Aquarius", system: "Western", compatibility: 92, strengths: ["Mental connection", "Freedom-loving"] },
        { sign: "Simha (Leo)", system: "Vedic", compatibility: 88, strengths: ["Complementary energy", "Mutual respect"] },
        { sign: "Tiger", system: "Chinese", compatibility: 85, strengths: ["Adventure compatibility", "Metal-Wood balance"] },
        { sign: "Manifestor", system: "Human Design", compatibility: 90, strengths: ["Complementary strategies", "Balanced interaction"] }
      ],
      challengingSigns: [
        { sign: "Capricorn", reason: "Earth vs Air element conflict", systems: ["Western"] },
        { sign: "Rooster", reason: "Metal-Metal clash can create rigidity", systems: ["Chinese"] }
      ],
      idealPartnerTraits: [
        "Intellectually stimulating",
        "Emotionally balanced", 
        "Respects independence",
        "Shares love of learning",
        "Calm energy (balances Pitta)"
      ]
    },
    lifestyle: {
      colors: {
        lucky: {
          "Daily wear": ["Light blue", "Silver", "White", "Soft green"],
          "Business": ["Navy blue", "Gray", "White"],
          "Home": ["Cool blues", "Whites", "Soft yellows"],
          "Healing": ["Turquoise", "Lavender", "Mint green"]
        },
        unlucky: ["Bright red", "Orange", "Hot pink", "Neon colors"],
        systemBasis: {
          "Pitta cooling": ["Blues", "Whites", "Greens"],
          "Metal element": ["Silver", "White", "Gray"], 
          "Air element": ["Light blues", "Yellows"]
        }
      },
      gemstones: [
        { stone: "Moonstone", purpose: "Emotional balance", wearing: "Ring on little finger", timing: "Monday evenings", systems: ["Vedic", "Western"] },
        { stone: "Clear Quartz", purpose: "Mental clarity", wearing: "Necklace", timing: "During work hours", systems: ["Numerology 7", "Gemini"] },
        { stone: "Aquamarine", purpose: "Communication", wearing: "Throat area", timing: "Before important conversations", systems: ["Western Air", "Human Design 2/4"] }
      ],
      luckyNumbers: [3, 7, 9, 12, 21, 30],
      unluckyNumbers: [8, 13, 18],
      favorableDays: ["Wednesday (Mercury)", "Monday (Moon)", "Days with 3, 7, 9"],
      unfavorableDays: ["Saturday (Saturn stress)", "Days with 8, 13"]
    },
    timing: {
      majorDecisions: [
        { period: "Spring months (Mar-May)", activities: ["Career changes", "New projects", "Travel planning"], reason: "Horse energy peaks, Gemini season approaches" },
        { period: "Mercury-favorable periods", activities: ["Communication", "Learning", "Negotiations"], reason: "Gemini ruler support" },
        { period: "Numbers 7, 21 dates", activities: ["Spiritual pursuits", "Research", "Solitude"], reason: "Life Path number alignment" }
      ],
      avoidPeriods: [
        { period: "Peak summer (Jul-Aug)", activities: ["Stressful decisions", "Conflicts"], reason: "Pitta aggravation period" },
        { period: "Mercury retrograde", activities: ["Communication-heavy tasks", "Travel"], reason: "Gemini ruler challenges" }
      ]
    }
  };

  const categories = [
    { id: "travel", label: "Travel & Climate", icon: MapPin, color: "text-blue-400" },
    { id: "food", label: "Food & Nutrition", icon: Utensils, color: "text-green-400" },
    { id: "career", label: "Career & Work", icon: Briefcase, color: "text-purple-400" },
    { id: "health", label: "Health & Wellness", icon: Activity, color: "text-red-400" },
    { id: "relationships", label: "Relationships", icon: Heart, color: "text-pink-400" },
    { id: "lifestyle", label: "Lifestyle & Colors", icon: Palette, color: "text-yellow-400" },
    { id: "timing", label: "Timing & Decisions", icon: Clock, color: "text-orange-400" }
  ];

  return (
    <div className="min-h-screen bg-cosmic-gradient p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Comprehensive Lifestyle Guidance
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Personalized recommendations from 5 astrological systems: Western, Vedic, Chinese, Human Design, and Numerology
          </p>
        </div>

        {/* Profile Summary */}
        <Card className="cosmic-card mb-8">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center">
              <Star className="mr-2 h-5 w-5" />
              Your Multi-System Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center">
                <h4 className="font-semibold text-white mb-2">Western</h4>
                <div className="text-sm text-gray-300">
                  <div>♊ Gemini Sun</div>
                  <div>♏ Scorpio Moon</div>
                  <div>♌ Leo Rising</div>
                  <div className="text-blue-400">Air Element</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-white mb-2">Vedic</h4>
                <div className="text-sm text-gray-300">
                  <div>Karkata Rashi</div>
                  <div>Pushya Nakshatra</div>
                  <div className="text-red-400">Pitta Dosha</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-white mb-2">Chinese</h4>
                <div className="text-sm text-gray-300">
                  <div>🐎 Horse</div>
                  <div className="text-gray-400">Metal Element</div>
                  <div>Summer Season</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-white mb-2">Human Design</h4>
                <div className="text-sm text-gray-300">
                  <div>Generator Type</div>
                  <div>Sacral Authority</div>
                  <div>2/4 Profile</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-white mb-2">Numerology</h4>
                <div className="text-sm text-gray-300">
                  <div>Life Path: 7</div>
                  <div>Destiny: 3</div>
                  <div>Soul Urge: 9</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                  selectedCategory === category.id 
                    ? 'cosmic-button' 
                    : 'border-purple-400/30 hover:border-purple-400/60'
                }`}
              >
                <IconComponent className={`h-6 w-6 ${category.color}`} />
                <span className="text-xs text-center">{category.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Content Sections */}
        {selectedCategory === "travel" && (
          <div className="space-y-6">
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Favorable Destinations
                </CardTitle>
                <CardDescription>
                  Travel recommendations based on your astrological profile and ideal climate needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lifestyleRecommendations.travel.favorableDestinations.map((dest, index) => (
                    <Card key={index} className="bg-slate-800/50 border-blue-400/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-blue-300 text-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            {dest.location}
                          </div>
                          <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                            {dest.confidence}% match
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center text-sm text-gray-300">
                          <Thermometer className="mr-2 h-4 w-4 text-orange-400" />
                          {dest.temperature} • {dest.climate}
                        </div>
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="mr-2 h-4 w-4 text-green-400" />
                          Best: {dest.bestSeasons.join(", ")}
                        </div>
                        <div>
                          <h5 className="font-medium text-white mb-2">Benefits:</h5>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {dest.benefits.map((benefit, i) => (
                              <li key={i}>• {benefit}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-white mb-2">Astrological Basis:</h5>
                          <div className="flex flex-wrap gap-1">
                            {dest.systems.map((system, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {system}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Climate Preferences */}
                <Card className="mt-6 bg-slate-800/30 border-blue-400/20">
                  <CardHeader>
                    <CardTitle className="text-blue-400 text-lg">Ideal Climate Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-white mb-3">Optimal Conditions</h5>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-center">
                            <Thermometer className="mr-2 h-4 w-4 text-orange-400" />
                            Temperature: {lifestyleRecommendations.travel.idealClimate.temperature}
                          </li>
                          <li className="flex items-center">
                            <Sun className="mr-2 h-4 w-4 text-yellow-400" />
                            Humidity: {lifestyleRecommendations.travel.idealClimate.humidity}
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-white mb-3">Astrological Reasoning</h5>
                        <ul className="space-y-1 text-sm text-gray-300">
                          {lifestyleRecommendations.travel.idealClimate.reasoning.map((reason, i) => (
                            <li key={i}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Unfavorable Destinations */}
                <Card className="mt-4 bg-red-900/20 border-red-400/30">
                  <CardHeader>
                    <CardTitle className="text-red-400 flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      Destinations to Avoid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lifestyleRecommendations.travel.unfavorableDestinations.map((dest, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-red-900/10 rounded-lg">
                          <div>
                            <span className="text-white font-medium">{dest.location}</span>
                            <p className="text-sm text-gray-300">{dest.reason}</p>
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            {dest.systems.join(", ")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Additional category content would be implemented similarly */}
        {selectedCategory !== "travel" && (
          <Card className="cosmic-card">
            <CardContent className="p-8 text-center">
              <div className="text-purple-400 text-6xl mb-4">🚧</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {categories.find(c => c.id === selectedCategory)?.label} Recommendations
              </h3>
              <p className="text-gray-400 mb-6">
                Comprehensive multi-system lifestyle guidance coming soon. This will include detailed recommendations
                from all 5 astrological systems for complete life optimization.
              </p>
              <div className="text-sm text-gray-500">
                • Food recommendations based on doshas, elements, and constitutional types<br/>
                • Career guidance from multiple astrological perspectives<br/>
                • Health prevention based on vulnerable areas and strengths<br/>
                • Relationship compatibility across all systems<br/>
                • Timing guidance for major life decisions
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}