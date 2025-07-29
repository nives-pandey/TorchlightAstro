import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ChartWheel from "@/components/chart-wheel";
import { LifestyleRecommendations } from "@/components/lifestyle-recommendations";
import { Star, Eye, Home, Zap, Target } from "lucide-react";

export default function Chart() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock chart data - in real app this would come from API
  const chartData = {
    user: { name: "John Doe", birthDate: "Jan 15, 1990", location: "New York, NY" },
    planets: {
      sun: { sign: "Capricorn", degree: 25.5, house: 4, symbol: "☉" },
      moon: { sign: "Pisces", degree: 12.3, house: 7, symbol: "☽" },
      mercury: { sign: "Aquarius", degree: 8.7, house: 6, symbol: "☿" },
      venus: { sign: "Sagittarius", degree: 18.2, house: 3, symbol: "♀" },
      mars: { sign: "Aries", degree: 22.1, house: 8, symbol: "♂" },
      jupiter: { sign: "Taurus", degree: 15.9, house: 9, symbol: "♃" },
      saturn: { sign: "Capricorn", degree: 28.4, house: 4, symbol: "♄" },
      uranus: { sign: "Capricorn", degree: 6.7, house: 4, symbol: "♅" },
      neptune: { sign: "Capricorn", degree: 13.1, house: 4, symbol: "♆" },
      pluto: { sign: "Scorpio", degree: 16.8, house: 2, symbol: "♇" }
    },
    houses: {
      first: { sign: "Virgo", degree: 15.0 },
      fourth: { sign: "Sagittarius", degree: 15.0 },
      seventh: { sign: "Pisces", degree: 15.0 },
      tenth: { sign: "Gemini", degree: 15.0 }
    }
  };

  const keyInsights = [
    {
      planet: "☉",
      title: "Sun in Capricorn (4th House)",
      description: "Strong foundation-building energy with focus on security and achievement.",
      color: "text-purple-500"
    },
    {
      planet: "☽",
      title: "Moon in Pisces (7th House)",
      description: "Intuitive emotional nature seeks harmony in partnerships.",
      color: "text-blue-400"
    },
    {
      planet: "☿",
      title: "Mercury in Aquarius (6th House)",
      description: "Innovative thinking applied to daily routines and service.",
      color: "text-purple-400"
    }
  ];

  const aspects = [
    { planets: "Sun ☉ Trine Jupiter ♃", strength: "Strong", orb: 2.3, description: "Natural optimism and expansion" },
    { planets: "Moon ☽ Sextile Venus ♀", strength: "Moderate", orb: 1.8, description: "Emotional harmony in relationships" },
    { planets: "Mercury ☿ Square Mars ♂", strength: "Weak", orb: 3.2, description: "Quick thinking with occasional impulsiveness" }
  ];

  const systemAnalysis = [
    {
      system: "Western Astrology",
      features: [
        { label: "Primary Modality", value: "Cardinal", description: "Leadership and initiative" },
        { label: "Strongest Aspect", value: "Sun Trine Jupiter", description: "Natural optimism and expansion" },
        { label: "Chart Pattern", value: "Bowl", description: "Focused energy toward specific goals" }
      ]
    },
    {
      system: "Vedic (Jyotish)",
      features: [
        { label: "Moon Nakshatra", value: "Uttara Bhadrapada", description: "Deep wisdom and spiritual insight" },
        { label: "Current Dasha", value: "Venus/Mercury", description: "Creative communication period" },
        { label: "Dosha Constitution", value: "Kapha-Vata", description: "Stability with creative flow" }
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Professional Natal Chart Analysis
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Swiss Ephemeris-powered calculations provide exact planetary positions, dignities, and authentic interpretations across multiple astrological systems.
          </p>
        </div>

        {/* Chart Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black/30 border border-purple-500/20 rounded-lg p-1 mb-8">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-300 data-[state=active]:text-black text-gray-400"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="planets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-300 data-[state=active]:text-black text-gray-400"
            >
              Planets
            </TabsTrigger>
            <TabsTrigger 
              value="houses"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-300 data-[state=active]:text-black text-gray-400"
            >
              Houses
            </TabsTrigger>
            <TabsTrigger 
              value="aspects"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-300 data-[state=active]:text-black text-gray-400"
            >
              Aspects
            </TabsTrigger>
            <TabsTrigger 
              value="lifestyle"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-300 data-[state=active]:text-black text-gray-400"
            >
              Lifestyle
            </TabsTrigger>
            <TabsTrigger 
              value="interpretations"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-300 data-[state=active]:text-black text-gray-400"
            >
              Interpretations
            </TabsTrigger>
          </TabsList>

          {/* Chart Content Area */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart Visualization */}
            <div className="lg:col-span-1">
              <ChartWheel chartData={chartData} />
            </div>

            {/* Chart Analysis Details */}
            <div className="lg:col-span-2">
              <TabsContent value="overview" className="space-y-6">
                {/* Key Insights Card */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-purple-500 flex items-center">
                      <Star className="mr-2 h-5 w-5" />
                      Key Cosmic Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {keyInsights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className={`text-2xl font-medium ${insight.color}`}>{insight.planet}</span>
                        <div>
                          <div className="text-white font-medium">{insight.title}</div>
                          <div className="text-gray-400 text-sm">{insight.description}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Multi-System Analysis */}
                <div className="grid md:grid-cols-2 gap-6">
                  {systemAnalysis.map((system, index) => (
                    <Card key={index} className="cosmic-card">
                      <CardHeader>
                        <CardTitle className="text-purple-500">{system.system}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {system.features.map((feature, idx) => (
                          <div key={idx}>
                            <div className="text-white font-medium">{feature.label}: {feature.value}</div>
                            <div className="text-gray-400 text-sm">{feature.description}</div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Priority Recommendations */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-purple-500 flex items-center">
                      <Target className="mr-2 h-5 w-5" />
                      Priority Life Guidance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-purple-500 text-2xl mb-2">🌅</div>
                        <div className="text-white font-medium">Best Times</div>
                        <div className="text-gray-400 text-sm">Early morning (6-8 AM)</div>
                      </div>
                      <div>
                        <div className="text-purple-500 text-2xl mb-2">🧭</div>
                        <div className="text-white font-medium">Favorable Direction</div>
                        <div className="text-gray-400 text-sm">Northeast (Jupiter)</div>
                      </div>
                      <div>
                        <div className="text-purple-500 text-2xl mb-2">💎</div>
                        <div className="text-white font-medium">Beneficial Colors</div>
                        <div className="text-gray-400 text-sm">Deep blue, Gold</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="planets" className="space-y-6">
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-purple-500">Planetary Positions</CardTitle>
                    <CardDescription className="text-gray-400">
                      Exact degrees and house placements with dignities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(chartData.planets).map(([planet, data]) => (
                        <div key={planet} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-purple-500/10">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{data.symbol}</span>
                            <div>
                              <div className="text-white font-medium capitalize">{planet}</div>
                              <div className="text-gray-400 text-sm">{data.sign} {data.degree.toFixed(1)}°</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-purple-500 font-medium">House {data.house}</div>
                            <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-500">
                              {data.degree > 20 ? "Strong" : "Moderate"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="houses" className="space-y-6">
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-purple-500">House System</CardTitle>
                    <CardDescription className="text-gray-400">
                      Life areas and their ruling signs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {[
                        { house: 1, area: "Identity & Appearance", ruler: "Virgo", icon: "👤" },
                        { house: 2, area: "Values & Resources", ruler: "Libra", icon: "💰" },
                        { house: 3, area: "Communication & Learning", ruler: "Scorpio", icon: "💬" },
                        { house: 4, area: "Home & Family", ruler: "Sagittarius", icon: "🏠" },
                        { house: 5, area: "Creativity & Romance", ruler: "Capricorn", icon: "❤️" },
                        { house: 6, area: "Work & Health", ruler: "Aquarius", icon: "⚕️" },
                        { house: 7, area: "Partnerships", ruler: "Pisces", icon: "🤝" },
                        { house: 8, area: "Transformation", ruler: "Aries", icon: "🔄" },
                        { house: 9, area: "Wisdom & Travel", ruler: "Taurus", icon: "🌍" },
                        { house: 10, area: "Career & Reputation", ruler: "Gemini", icon: "🎯" },
                        { house: 11, area: "Friendships & Goals", ruler: "Cancer", icon: "👥" },
                        { house: 12, area: "Spirituality & Subconscious", ruler: "Leo", icon: "🔮" }
                      ].map((house) => (
                        <div key={house.house} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-purple-500/10">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{house.icon}</span>
                            <div>
                              <div className="text-white font-medium">House {house.house}: {house.area}</div>
                              <div className="text-gray-400 text-sm">Ruled by {house.ruler}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="aspects" className="space-y-6">
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-purple-500">Planetary Aspects</CardTitle>
                    <CardDescription className="text-gray-400">
                      Angular relationships between planets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aspects.map((aspect, index) => (
                        <div key={index} className="p-4 bg-black/20 rounded-lg border border-purple-500/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-white font-medium">{aspect.planets}</div>
                            <Badge 
                              variant="outline" 
                              className={`${
                                aspect.strength === "Strong" ? "border-green-500 text-green-500" :
                                aspect.strength === "Moderate" ? "border-purple-500 text-purple-500" :
                                "border-gray-500 text-gray-500"
                              }`}
                            >
                              {aspect.strength} (±{aspect.orb}°)
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm">{aspect.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interpretations" className="space-y-6">
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="text-purple-500">Detailed Interpretations</CardTitle>
                    <CardDescription className="text-gray-400">
                      In-depth analysis of your cosmic blueprint
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-white font-medium mb-3">Personality Core</h4>
                      <p className="text-gray-400 leading-relaxed">
                        Your Capricorn Sun in the 4th house reveals a deep need for security and solid foundations. 
                        You approach life with patience and determination, building your success gradually and methodically. 
                        The 4th house placement emphasizes the importance of home, family, and emotional security in your identity.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">Emotional Nature</h4>
                      <p className="text-gray-400 leading-relaxed">
                        With your Moon in Pisces in the 7th house, you possess a highly intuitive and empathetic emotional nature. 
                        You seek harmony in relationships and may often put others' needs before your own. This placement 
                        suggests you find emotional fulfillment through meaningful partnerships and helping others.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">Communication Style</h4>
                      <p className="text-gray-400 leading-relaxed">
                        Mercury in Aquarius in the 6th house indicates an innovative and progressive communication style. 
                        You excel at finding unique solutions to everyday problems and may be drawn to technology or 
                        humanitarian causes. Your thinking is often ahead of its time.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">Life Path Guidance</h4>
                      <p className="text-gray-400 leading-relaxed">
                        The combination of your earth-heavy chart with Pisces Moon suggests a path that balances 
                        practical achievement with spiritual or creative fulfillment. Consider careers that allow 
                        you to build something lasting while helping others or expressing your artistic nature.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Lifestyle Tab */}
              <TabsContent value="lifestyle" className="space-y-6">
                <LifestyleRecommendations 
                  recommendations={{
                    luckyNumbers: [3, 7, 9, 21, 25],
                    luckyColors: ["Deep Blue", "Silver", "Emerald Green", "Royal Purple"],
                    favorableStones: ["Sapphire", "Moonstone", "Garnet", "Amethyst"],
                    careerGuidance: "Your Capricorn Sun and Pisces Moon combination suggests careers in counseling, architecture, or healing professions. You excel in structured environments where you can help others while building lasting foundations.",
                    subjects: ["Psychology", "Architecture", "Finance", "Art Therapy", "Real Estate"],
                    personalityTraits: ["Intuitive", "Practical", "Empathetic", "Determined", "Creative"],
                    foods: ["Root vegetables", "Fish", "Whole grains", "Herbal teas", "Dark leafy greens"],
                    avoidItems: ["Excessive caffeine", "Spicy foods late at night", "Overstimulating environments"],
                    auspiciousDates: ["10th, 15th, 25th of each month", "New Moon in Earth signs", "Venus-Jupiter conjunctions"],
                    dailyPractices: ["Morning meditation", "Evening journaling", "Nature walks", "Structured goal-setting"]
                  }}
                  systemComparison={{
                    westernTraits: ["Ambitious", "Security-focused", "Intuitive partnerships"],
                    vedicTraits: ["Spiritual wisdom", "Creative communication", "Stable foundation"],
                    chineseTraits: ["Strategic thinking", "Family-oriented", "Patient approach"],
                    humanDesignTraits: ["Generator energy", "Emotional authority", "Manifesting type"],
                    commonPatterns: ["Leadership potential", "Creative expression", "Service orientation"],
                    uniqueInsights: {
                      western: "Strong focus on building security through structured achievement",
                      vedic: "Spiritual wisdom combined with practical application in daily life",
                      chinese: "Patient, methodical approach to long-term success",
                      humanDesign: "Natural ability to respond to life with emotional clarity"
                    },
                    synthesizedGuidance: {
                      strengths: ["Natural leadership abilities", "Strong intuition", "Practical wisdom"],
                      challenges: ["Tendency to be overly cautious", "Emotional sensitivity", "Perfectionist tendencies"],
                      recommendations: ["Trust your intuition in business decisions", "Create structured routines for creativity", "Balance ambition with emotional well-being"]
                    }
                  }}
                />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
