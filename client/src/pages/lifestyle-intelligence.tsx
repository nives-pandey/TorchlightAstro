import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  Home, 
  MapPin, 
  Palette, 
  Utensils, 
  Dumbbell, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  ThermometerSun,
  Plane,
  Users,
  Heart,
  Star,
  Info,
  Clock,
  Target
} from "lucide-react";

interface LifestyleRecommendation {
  category: string;
  title: string;
  description: string;
  reasoning: string;
  actionItems: string[];
  timeframe: string;
  confidence: number;
}

export default function LifestyleIntelligence() {
  const [activeTab, setActiveTab] = useState("travel");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<LifestyleRecommendation[]>([]);

  // Get user profile for personalized recommendations
  useEffect(() => {
    const storedProfile = localStorage.getItem('userBirthData');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setUserProfile(profile);
      generateLifestyleRecommendations(profile);
    }
  }, []);

  const generateLifestyleRecommendations = (profile: any) => {
    const recs: LifestyleRecommendation[] = [];

    // Travel Destinations based on astrological profile
    if (profile.systems?.western?.sign) {
      const sign = profile.systems.western.sign;
      
      // Fire signs
      if (['Aries', 'Leo', 'Sagittarius'].includes(sign)) {
        recs.push({
          category: "travel",
          title: "Adventure & Cultural Destinations",
          description: "Fire signs thrive in energetic, culturally rich destinations with outdoor activities and vibrant nightlife.",
          reasoning: `As a ${sign}, you're naturally drawn to dynamic environments that match your fiery energy and love for adventure.`,
          actionItems: [
            "Plan active vacations: hiking, adventure sports, cultural festivals",
            "Consider destinations: Bali, Costa Rica, Morocco, New Zealand",
            "Book trips during your solar return month for maximum energy",
            "Choose accommodations with outdoor spaces and social areas"
          ],
          timeframe: "Best months: Spring and Summer seasons",
          confidence: 92
        });
      }

      // Earth signs  
      if (['Taurus', 'Virgo', 'Capricorn'].includes(sign)) {
        recs.push({
          category: "travel",
          title: "Luxury & Nature Retreats",
          description: "Earth signs prefer comfortable, well-planned trips to beautiful natural locations with excellent food and accommodation.",
          reasoning: `${sign} energy seeks grounding through nature, comfort, and sensory experiences.`,
          actionItems: [
            "Book luxury eco-resorts and wellness retreats",
            "Consider destinations: Switzerland, Japan, Tuscany, Napa Valley",
            "Plan detailed itineraries with high-quality accommodations",
            "Include spa treatments and farm-to-table dining experiences"
          ],
          timeframe: "Best months: Autumn and late Spring",
          confidence: 94
        });
      }

      // Air signs
      if (['Gemini', 'Libra', 'Aquarius'].includes(sign)) {
        recs.push({
          category: "travel",
          title: "Cultural & Intellectual Destinations",
          description: "Air signs enjoy destinations rich in art, culture, learning opportunities, and social connections.",
          reasoning: `${sign} thrives on mental stimulation, cultural exchange, and meeting new people.`,
          actionItems: [
            "Visit museums, art galleries, and cultural centers",
            "Consider destinations: Paris, London, Tokyo, Amsterdam",
            "Plan trips around festivals, conferences, or educational tours",
            "Stay in areas with good public transport and social hubs"
          ],
          timeframe: "Year-round, especially during Mercury direct periods",
          confidence: 89
        });
      }

      // Water signs
      if (['Cancer', 'Scorpio', 'Pisces'].includes(sign)) {
        recs.push({
          category: "travel",
          title: "Coastal & Spiritual Destinations",
          description: "Water signs are drawn to oceanfront locations, spiritual sites, and emotionally enriching experiences.",
          reasoning: `${sign} energy is nourished by water elements and spiritual/emotional depth.`,
          actionItems: [
            "Choose coastal destinations and water-based activities",
            "Consider destinations: Santorini, Maldives, Bali, Big Sur",
            "Include spiritual sites, meditation retreats, or healing centers",
            "Plan intimate accommodations with ocean or lake views"
          ],
          timeframe: "Best during water sign seasons and full moons",
          confidence: 91
        });
      }
    }

    // Color Therapy based on birth chart
    if (profile.systems?.western?.element) {
      const element = profile.systems.western.element;
      
      recs.push({
        category: "colors",
        title: `${element} Element Color Palette`,
        description: `Colors that harmonize with your ${element} elemental energy for optimal well-being and success.`,
        reasoning: `Your ${element} element responds positively to specific color frequencies that enhance your natural energy.`,
        actionItems: element === 'Fire' ? [
          "Power colors: Red, orange, gold, bright yellow",
          "Accent colors: Purple, magenta for depth",
          "Avoid: Too much blue or black (dampening)",
          "Wear fire colors during important meetings or creative work"
        ] : element === 'Earth' ? [
          "Power colors: Brown, beige, forest green, terracotta",
          "Accent colors: Gold, cream for luxury",
          "Avoid: Too much bright orange or electric blue",
          "Use earth tones in home decor and professional wardrobe"
        ] : element === 'Air' ? [
          "Power colors: Light blue, yellow, silver, white",
          "Accent colors: Lavender, mint green for clarity",
          "Avoid: Heavy dark colors that feel restrictive", 
          "Incorporate air colors in workspace and communication tools"
        ] : [
          "Power colors: Deep blue, teal, silver, sea green",
          "Accent colors: Purple, soft pink for emotional balance",
          "Avoid: Too much red or orange (overstimulating)",
          "Use water colors in meditation spaces and bedrooms"
        ],
        timeframe: "Daily application for optimal results",
        confidence: 88
      });
    }

    // Career & Professional Life
    if (profile.systems?.numerology?.lifePath) {
      const lifePath = profile.systems.numerology.lifePath;
      
      let careerGuidance = "";
      let careerActions: string[] = [];
      
      if ([1, 8].includes(lifePath)) {
        careerGuidance = "Leadership and entrepreneurship are your natural calling paths.";
        careerActions = [
          "Seek leadership roles and management positions",
          "Consider starting your own business or consultancy",
          "Develop public speaking and executive presence skills",
          "Network with other successful entrepreneurs and leaders"
        ];
      } else if ([2, 6].includes(lifePath)) {
        careerGuidance = "Service, healing, and collaborative work environments suit you best.";
        careerActions = [
          "Explore careers in healthcare, counseling, or social work",
          "Look for team-based roles and collaborative projects",
          "Develop your natural counseling and listening skills",
          "Consider non-profit or mission-driven organizations"
        ];
      } else if ([3, 5].includes(lifePath)) {
        careerGuidance = "Creative expression and communication are key to your professional fulfillment.";
        careerActions = [
          "Pursue careers in arts, media, writing, or entertainment",
          "Develop multiple income streams and creative projects",
          "Build your personal brand and social media presence",
          "Network in creative and innovative industries"
        ];
      } else {
        careerGuidance = "Your life path suggests success through sustained effort and systematic approaches.";
        careerActions = [
          "Focus on building expertise in specialized fields",
          "Create systematic approaches to skill development",
          "Look for stable organizations with growth potential",
          "Develop both technical and leadership capabilities"
        ];
      }

      recs.push({
        category: "career",
        title: `Life Path ${lifePath} Career Optimization`,
        description: careerGuidance,
        reasoning: `Your numerological life path indicates natural talents and career directions that align with your soul's purpose.`,
        actionItems: careerActions,
        timeframe: "Long-term career planning (2-5 years)",
        confidence: 85
      });
    }

    // Health & Wellness based on constitution
    recs.push({
      category: "wellness",
      title: "Personalized Health & Fitness Plan",
      description: "Exercise and wellness routines that complement your astrological constitution and energy patterns.",
      reasoning: "Your birth chart indicates specific physical and energetic needs for optimal health.",
      actionItems: [
        "Morning routine: 15-minute meditation or breathwork",
        "Exercise: Combination of cardio and strength training 4x/week",
        "Nutrition: Emphasize seasonal, local foods that match your element",
        "Sleep: Maintain consistent sleep schedule aligned with lunar cycles",
        "Stress management: Regular nature connection and creative outlets"
      ],
      timeframe: "Daily implementation with weekly adjustments",
      confidence: 87
    });

    // Timing & Planning
    recs.push({
      category: "timing",
      title: "Optimal Timing for Major Decisions",
      description: "Astrological timing guidance for important life events and decisions.",
      reasoning: "Planetary cycles and your personal astrological calendar affect success probability of major initiatives.",
      actionItems: [
        "Launch new projects during your solar return month",
        "Make major purchases during Venus favorable periods",
        "Schedule important meetings during Mercury direct periods",
        "Plan relationship conversations during harmonious moon phases",
        "Avoid major commitments during eclipse seasons"
      ],
      timeframe: "Monthly planning with seasonal adjustments",
      confidence: 82
    });

    setRecommendations(recs);
  };

  const tabConfig = [
    { id: "travel", name: "Travel", icon: <Plane className="h-4 w-4" />, color: "bg-blue-500" },
    { id: "colors", name: "Colors", icon: <Palette className="h-4 w-4" />, color: "bg-purple-500" },
    { id: "career", name: "Career", icon: <Briefcase className="h-4 w-4" />, color: "bg-green-500" },
    { id: "wellness", name: "Wellness", icon: <Dumbbell className="h-4 w-4" />, color: "bg-red-500" },
    { id: "timing", name: "Timing", icon: <Calendar className="h-4 w-4" />, color: "bg-yellow-500" }
  ];

  const getRecommendationsForTab = (tabId: string) => {
    return recommendations.filter(rec => rec.category === tabId);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <Card className="bg-black/40 border-purple-500/30 max-w-md mx-4">
          <CardContent className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-purple-300 mb-2">
              Create Your Chart First
            </h3>
            <p className="text-purple-400 mb-6">
              Generate your birth chart to receive personalized lifestyle intelligence based on your complete astrological profile.
            </p>
            <Link href="/home">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Create Chart
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Lifestyle Intelligence
                </h1>
                <p className="text-purple-300">Personalized guidance for optimal living</p>
              </div>
            </div>
            <Link href="/home">
              <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Summary */}
        <Card className="bg-black/40 border-purple-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Your Cosmic Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-purple-400">Western Sign</p>
                <p className="text-lg font-semibold text-purple-300">
                  {userProfile.systems?.western?.sign || 'Unknown'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-400">Element</p>
                <p className="text-lg font-semibold text-purple-300">
                  {userProfile.systems?.western?.element || 'Unknown'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-400">Chinese Animal</p>
                <p className="text-lg font-semibold text-purple-300">
                  {userProfile.systems?.chinese?.animal || 'Unknown'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-400">Life Path</p>
                <p className="text-lg font-semibold text-purple-300">
                  {userProfile.systems?.numerology?.lifePath || 'Unknown'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/40 border-purple-500/30">
            {tabConfig.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-300"
              >
                <div className="flex items-center space-x-2">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.name}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          {tabConfig.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <div className="space-y-6">
                {getRecommendationsForTab(tab.id).map((rec, index) => (
                  <Card key={index} className="bg-black/40 border-purple-500/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-purple-300 flex items-center">
                          {tab.icon}
                          <span className="ml-2">{rec.title}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-500/20 text-green-300">
                            {rec.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                      <p className="text-purple-400">{rec.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Reasoning */}
                      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Info className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-purple-300 font-semibold mb-1">Why This Works For You</h4>
                            <p className="text-purple-400 text-sm">{rec.reasoning}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Items */}
                      <div>
                        <h4 className="text-purple-300 font-semibold mb-3 flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          Action Steps
                        </h4>
                        <div className="space-y-2">
                          {rec.actionItems.map((action, actionIndex) => (
                            <div key={actionIndex} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-purple-300 text-sm">{action}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timeframe */}
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-purple-400" />
                        <span className="text-purple-400">Timeframe:</span>
                        <span className="text-purple-300">{rec.timeframe}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {getRecommendationsForTab(tab.id).length === 0 && (
                  <Card className="bg-black/40 border-purple-500/30">
                    <CardContent className="text-center py-12">
                      <div className="text-purple-400 mb-4">
                        {tab.icon}
                      </div>
                      <p className="text-purple-300">
                        Generating personalized {tab.name.toLowerCase()} recommendations...
                      </p>
                      <p className="text-purple-400 text-sm mt-2">
                        More detailed guidance will be available as we enhance your profile.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Stats */}
        <Card className="bg-black/40 border-purple-500/30 mt-8">
          <CardHeader>
            <CardTitle className="text-purple-300">Recommendation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {tabConfig.map((tab) => {
                const count = getRecommendationsForTab(tab.id).length;
                const avgConfidence = count > 0 
                  ? Math.round(getRecommendationsForTab(tab.id).reduce((sum, rec) => sum + rec.confidence, 0) / count)
                  : 0;
                
                return (
                  <div key={tab.id} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {tab.icon}
                    </div>
                    <p className="text-sm text-purple-400">{tab.name}</p>
                    <p className="text-lg font-semibold text-purple-300">{count} tips</p>
                    {avgConfidence > 0 && (
                      <p className="text-xs text-purple-400">{avgConfidence}% avg confidence</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}