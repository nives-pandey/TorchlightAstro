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
  Briefcase, 
  Plane, 
  Palette, 
  Calendar, 
  Star,
  MapPin,
  Dumbbell,
  Clock,
  Target,
  Sparkles,
  Info,
  Crown,
  Moon,
  Sun,
  Shield,
  TrendingUp
} from "lucide-react";

interface GemstoneLifestylePairing {
  category: string;
  title: string;
  primaryGemstone: {
    name: string;
    purpose: string;
    chakra: string;
    color: string;
    benefits: string[];
    wearingInstructions: string;
  };
  supportingGemstones: {
    name: string;
    purpose: string;
    timing: string;
  }[];
  lifestyleGuidance: {
    area: string;
    recommendations: string[];
    timing: string;
    confidence: number;
  }[];
  synergy: {
    description: string;
    enhancementTips: string[];
    optimalTiming: string;
  };
  personalNote?: string;
}

export default function GemstoneLifestylePairing() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [pairings, setPairings] = useState<GemstoneLifestylePairing[]>([]);
  const [activePairing, setActivePairing] = useState<string>("career");
  const [selectedPairing, setSelectedPairing] = useState<GemstoneLifestylePairing | null>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('userBirthData');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setUserProfile(profile);
      generateGemstoneLifestylePairings(profile);
    }
  }, []);

  const generateGemstoneLifestylePairings = (profile: any) => {
    const generatedPairings: GemstoneLifestylePairing[] = [];

    // Career Success Pairing
    if (profile.systems?.numerology?.lifePath) {
      const lifePath = profile.systems.numerology.lifePath;
      let careerGemstone = "Citrine";
      let careerPurpose = "Success & Abundance";
      let careerGuidance: string[] = [];

      if ([1, 8].includes(lifePath)) {
        careerGemstone = "Tiger's Eye";
        careerPurpose = "Leadership Confidence";
        careerGuidance = [
          "Schedule important meetings on Tuesdays (Mars energy)",
          "Wear Tiger's Eye during negotiations and presentations",
          "Focus on leadership development and executive training",
          "Network with other successful entrepreneurs and CEOs"
        ];
      } else if ([3, 5].includes(lifePath)) {
        careerGemstone = "Carnelian";
        careerPurpose = "Creative Expression";
        careerGuidance = [
          "Plan creative projects during Mercury favorable periods",
          "Wear Carnelian when brainstorming or presenting ideas",
          "Build your personal brand through social media presence",
          "Collaborate with other creative professionals"
        ];
      } else {
        careerGuidance = [
          "Focus on steady skill development and expertise building",
          "Wear Citrine during financial planning and investment decisions",
          "Set long-term career goals with systematic approaches",
          "Invest in professional development and certifications"
        ];
      }

      generatedPairings.push({
        category: "career",
        title: "Career Success & Prosperity",
        primaryGemstone: {
          name: careerGemstone,
          purpose: careerPurpose,
          chakra: "Solar Plexus",
          color: careerGemstone === "Tiger's Eye" ? "Golden Brown" : careerGemstone === "Carnelian" ? "Orange-Red" : "Golden Yellow",
          benefits: ["Professional confidence", "Financial success", "Leadership abilities", "Decision-making clarity"],
          wearingInstructions: "Ring on dominant hand or pendant during work hours. Most powerful on Sundays and Thursdays."
        },
        supportingGemstones: [
          { name: "Pyrite", purpose: "Business manifestation", timing: "During important meetings" },
          { name: "Green Aventurine", purpose: "Opportunity attraction", timing: "When seeking new positions" },
          { name: "Clear Quartz", purpose: "Goal amplification", timing: "During planning sessions" }
        ],
        lifestyleGuidance: [
          {
            area: "Professional Development",
            recommendations: careerGuidance,
            timing: "Ongoing implementation",
            confidence: 87
          },
          {
            area: "Financial Planning",
            recommendations: [
              "Review investments during Venus favorable periods",
              "Make major purchases during waxing moon phases",
              "Avoid financial decisions during Mercury retrograde",
              "Set up automatic savings aligned with your life path number"
            ],
            timing: "Monthly financial reviews",
            confidence: 82
          }
        ],
        synergy: {
          description: "Combining career-focused gemstones with strategic timing creates optimal conditions for professional advancement and financial growth.",
          enhancementTips: [
            "Cleanse career gemstones monthly with sage smoke",
            "Place Pyrite on your desk facing the entrance",
            "Meditate with your primary gemstone before important decisions",
            "Create a prosperity altar with all supporting stones"
          ],
          optimalTiming: "New moon for new opportunities, full moon for completion of projects"
        },
        personalNote: `Optimized for Life Path ${lifePath} career advancement`
      });
    }

    // Love & Relationships Pairing
    if (profile.systems?.western?.sign) {
      const sign = profile.systems.western.sign;
      let loveGemstone = "Rose Quartz";
      let loveGuidance: string[] = [];

      if (['Cancer', 'Scorpio', 'Pisces'].includes(sign)) {
        loveGemstone = "Moonstone";
        loveGuidance = [
          "Plan romantic conversations during water sign seasons",
          "Wear Moonstone during full moons for emotional clarity",
          "Choose intimate, water-view locations for important talks",
          "Express feelings through creative or artistic means"
        ];
      } else if (['Aries', 'Leo', 'Sagittarius'].includes(sign)) {
        loveGemstone = "Garnet";
        loveGuidance = [
          "Plan adventures and active dates during fire seasons",
          "Wear Garnet for passion and relationship energy",
          "Be direct and honest in communication",
          "Choose exciting, dynamic locations for romantic meetings"
        ];
      } else {
        loveGuidance = [
          "Focus on building emotional intimacy gradually",
          "Wear Rose Quartz for self-love and compassion",
          "Practice active listening and emotional support",
          "Create beautiful, harmonious environments for connection"
        ];
      }

      generatedPairings.push({
        category: "love",
        title: "Love & Relationship Harmony",
        primaryGemstone: {
          name: loveGemstone,
          purpose: "Heart healing & love attraction",
          chakra: "Heart Chakra",
          color: loveGemstone === "Moonstone" ? "Creamy White" : loveGemstone === "Garnet" ? "Deep Red" : "Soft Pink",
          benefits: ["Emotional healing", "Love attraction", "Relationship harmony", "Self-compassion"],
          wearingInstructions: "Heart chakra pendant or bracelet on receiving hand. Most powerful during Venus hours (Friday evenings)."
        },
        supportingGemstones: [
          { name: "Green Aventurine", purpose: "Heart healing", timing: "After relationship conflicts" },
          { name: "Rhodochrosite", purpose: "Self-love development", timing: "During personal growth periods" },
          { name: "Prehnite", purpose: "Unconditional love", timing: "Before important conversations" }
        ],
        lifestyleGuidance: [
          {
            area: "Relationship Communication",
            recommendations: loveGuidance,
            timing: "Ongoing practice",
            confidence: 89
          },
          {
            area: "Self-Care & Attraction",
            recommendations: [
              "Practice daily self-love affirmations with your gemstone",
              "Create a beautiful personal space that reflects your values",
              "Engage in activities that bring you joy and fulfillment",
              "Maintain healthy boundaries while staying open to love"
            ],
            timing: "Daily self-care practices",
            confidence: 91
          }
        ],
        synergy: {
          description: "Heart-centered gemstones combined with relationship-focused lifestyle practices create magnetic energy for love and harmony.",
          enhancementTips: [
            "Sleep with love gemstones under your pillow",
            "Create a love altar with pink and green stones",
            "Meditate with heart chakra stones during Venus transits",
            "Gift matching gemstones to strengthen partnerships"
          ],
          optimalTiming: "Venus favorable periods, full moons in water signs, and your Venus return"
        },
        personalNote: `Personalized for ${sign} love expression style`
      });
    }

    // Health & Wellness Pairing
    generatedPairings.push({
      category: "wellness",
      title: "Health & Vitality Enhancement",
      primaryGemstone: {
        name: "Bloodstone",
        purpose: "Physical vitality & healing",
        chakra: "Root & Heart Chakras",
        color: "Dark Green with Red Spots",
        benefits: ["Physical strength", "Blood purification", "Immune support", "Grounding energy"],
        wearingInstructions: "Pendant over heart or carried in pocket. Most effective during Mars hours (Tuesday mornings)."
      },
      supportingGemstones: [
        { name: "Amethyst", purpose: "Stress relief", timing: "During meditation" },
        { name: "Turquoise", purpose: "Overall healing", timing: "When feeling unwell" },
        { name: "Hematite", purpose: "Grounding & circulation", timing: "During exercise" }
      ],
      lifestyleGuidance: [
        {
          area: "Physical Fitness",
          recommendations: [
            "Exercise during your most energetic planetary hours",
            "Practice grounding activities like yoga or walking in nature",
            "Align workouts with lunar cycles (building during waxing moon)",
            "Include both cardiovascular and strength training"
          ],
          timing: "4-5 times per week",
          confidence: 85
        },
        {
          area: "Nutrition & Healing",
          recommendations: [
            "Eat foods that match your elemental constitution",
            "Stay hydrated with crystal-infused water",
            "Practice intermittent fasting aligned with moon phases",
            "Include anti-inflammatory foods and herbs in your diet"
          ],
          timing: "Daily nutritional awareness",
          confidence: 88
        }
      ],
      synergy: {
        description: "Healing gemstones amplify wellness practices, creating a holistic approach to physical and energetic health.",
        enhancementTips: [
          "Create gem-infused water for daily hydration",
          "Place healing stones around your exercise space",
          "Wear grounding stones during outdoor activities",
          "Use crystal healing layouts during rest and recovery"
        ],
        optimalTiming: "New moon for detox, full moon for energy building, Mars transits for strength"
      }
    });

    // Travel & Adventure Pairing
    if (profile.systems?.western?.element) {
      const element = profile.systems.western.element;
      let travelGemstone = "Turquoise";
      let travelDestinations: string[] = [];

      if (element === 'Fire') {
        travelGemstone = "Red Jasper";
        travelDestinations = [
          "Plan adventure trips to volcanic regions (Hawaii, Iceland)",
          "Visit sunny, energetic destinations during fire seasons",
          "Include active sports and outdoor adventures",
          "Choose accommodations with vibrant social scenes"
        ];
      } else if (element === 'Earth') {
        travelGemstone = "Green Jade";
        travelDestinations = [
          "Visit mountain regions and natural healing centers",
          "Plan trips to places known for excellent food and comfort",
          "Include spa treatments and wellness retreats",
          "Choose luxury accommodations with beautiful gardens"
        ];
      } else if (element === 'Air') {
        travelGemstone = "Sodalite";
        travelDestinations = [
          "Visit cultural centers and intellectual destinations",
          "Plan trips around festivals, museums, and learning experiences",
          "Include social activities and networking opportunities",
          "Choose cities with excellent public transportation"
        ];
      } else {
        travelDestinations = [
          "Choose coastal destinations and water-based activities",
          "Visit spiritual sites and healing centers",
          "Include meditation retreats and emotional healing work",
          "Select accommodations with water views and peaceful settings"
        ];
      }

      generatedPairings.push({
        category: "travel",
        title: "Travel & Adventure Enhancement",
        primaryGemstone: {
          name: travelGemstone,
          purpose: "Protection & adventure",
          chakra: "Throat Chakra",
          color: travelGemstone === "Red Jasper" ? "Deep Red" : travelGemstone === "Green Jade" ? "Rich Green" : travelGemstone === "Sodalite" ? "Deep Blue" : "Blue-Green",
          benefits: ["Travel protection", "Adventure confidence", "Cultural connection", "Safe journeys"],
          wearingInstructions: "Necklace or bracelet while traveling. Carry in luggage for protection during journeys."
        },
        supportingGemstones: [
          { name: "Moonstone", purpose: "Emotional balance", timing: "During long journeys" },
          { name: "Malachite", purpose: "Jetlag prevention", timing: "When crossing time zones" },
          { name: "Labradorite", purpose: "Magic & synchronicity", timing: "In new environments" }
        ],
        lifestyleGuidance: [
          {
            area: "Travel Planning",
            recommendations: travelDestinations,
            timing: "Seasonal travel planning",
            confidence: 86
          },
          {
            area: "Adventure Preparation",
            recommendations: [
              "Research local customs and spiritual practices",
              "Pack travel gemstones for protection and grounding",
              "Plan activities that align with your elemental nature",
              "Create travel intentions and manifestation practices"
            ],
            timing: "Pre-travel preparation",
            confidence: 83
          }
        ],
        synergy: {
          description: "Travel gemstones provide protection and enhance your natural connection to new places and experiences.",
          enhancementTips: [
            "Cleanse travel stones before each journey",
            "Create a travel altar in your accommodation",
            "Use gemstones for grounding in new time zones",
            "Collect local stones as souvenirs for future travel magic"
          ],
          optimalTiming: "Plan major trips during Jupiter favorable periods and your solar return season"
        },
        personalNote: `Optimized for ${element} element travel preferences`
      });
    }

    setPairings(generatedPairings);
  };

  const pairingCategories = [
    { id: "career", name: "Career", icon: <Briefcase className="h-4 w-4" />, color: "bg-green-500" },
    { id: "love", name: "Love", icon: <Heart className="h-4 w-4" />, color: "bg-pink-500" },
    { id: "wellness", name: "Wellness", icon: <Dumbbell className="h-4 w-4" />, color: "bg-blue-500" },
    { id: "travel", name: "Travel", icon: <Plane className="h-4 w-4" />, color: "bg-yellow-600" }
  ];

  const getCurrentPairings = () => {
    return pairings.filter(pairing => pairing.category === activePairing);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <Card className="bg-black/40 border-yellow-600/30 max-w-md mx-4">
          <CardContent className="text-center py-12">
            <Gem className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold text-purple-300 mb-2">
              Create Your Chart First
            </h3>
            <p className="text-yellow-500 mb-6">
              Generate your birth chart to receive personalized gemstone-lifestyle pairings based on your complete astrological profile.
            </p>
            <Link href="/home">
              <Button className="bg-yellow-600 hover:bg-purple-700">
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
      <div className="border-b border-yellow-600/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <TrendingUp className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-pink-400 bg-clip-text text-transparent">
                  Gemstone Lifestyle Pairing
                </h1>
                <p className="text-purple-300">Integrated crystal therapy & lifestyle optimization</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link href="/gemstone-guidance">
                <Button variant="outline" className="border-yellow-600/30 text-purple-300 hover:bg-yellow-600/20 text-sm">
                  <Gem className="h-4 w-4 mr-1" />
                  Gems
                </Button>
              </Link>
              <Link href="/lifestyle-intelligence">
                <Button variant="outline" className="border-yellow-600/30 text-purple-300 hover:bg-yellow-600/20 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  Lifestyle
                </Button>
              </Link>
              <Link href="/home">
                <Button variant="outline" className="border-yellow-600/30 text-purple-300 hover:bg-yellow-600/20">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Summary */}
        <Card className="bg-black/40 border-yellow-600/30 mb-8">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Personalized Pairing Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-yellow-500">Western Sign</p>
                <p className="text-lg font-semibold text-purple-300">
                  {userProfile.systems?.western?.sign || 'Unknown'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-yellow-500">Element</p>
                <p className="text-lg font-semibold text-purple-300">
                  {userProfile.systems?.western?.element || 'Unknown'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-yellow-500">Life Path</p>
                <p className="text-lg font-semibold text-purple-300">
                  {userProfile.systems?.numerology?.lifePath || 'Unknown'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-yellow-500">Pairings</p>
                <p className="text-lg font-semibold text-purple-300">
                  {pairings.length} Sets
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Navigation */}
        <Tabs value={activePairing} onValueChange={setActivePairing} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 border-yellow-600/30">
            {pairingCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white text-purple-300"
              >
                <div className="flex items-center space-x-2">
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Pairing Content */}
          {pairingCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="space-y-6">
                {getCurrentPairings().map((pairing, index) => (
                  <Card key={index} className="bg-black/40 border-yellow-600/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-purple-300 flex items-center">
                          {category.icon}
                          <span className="ml-2">{pairing.title}</span>
                        </CardTitle>
                        <Button 
                          onClick={() => setSelectedPairing(pairing)}
                          className="bg-yellow-600 hover:bg-purple-700 text-sm"
                        >
                          View Details
                        </Button>
                      </div>
                      {pairing.personalNote && (
                        <Badge className="bg-yellow-500/20 text-yellow-300 w-fit">
                          {pairing.personalNote}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Primary Gemstone */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-6 h-6 rounded-full border-2 border-white/30 ${
                              pairing.primaryGemstone.color.includes('Red') ? 'bg-red-400' :
                              pairing.primaryGemstone.color.includes('Green') ? 'bg-green-400' :
                              pairing.primaryGemstone.color.includes('Blue') ? 'bg-blue-400' :
                              pairing.primaryGemstone.color.includes('Yellow') || pairing.primaryGemstone.color.includes('Golden') ? 'bg-yellow-400' :
                              pairing.primaryGemstone.color.includes('Pink') ? 'bg-pink-400' :
                              pairing.primaryGemstone.color.includes('Purple') ? 'bg-yellow-500' :
                              pairing.primaryGemstone.color.includes('Orange') ? 'bg-orange-400' :
                              pairing.primaryGemstone.color.includes('White') || pairing.primaryGemstone.color.includes('Creamy') ? 'bg-white' :
                              'bg-gray-400'
                            }`}></div>
                            <div>
                              <h4 className="text-purple-300 font-semibold">{pairing.primaryGemstone.name}</h4>
                              <p className="text-yellow-500 text-sm">{pairing.primaryGemstone.purpose}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-yellow-500">Chakra:</span>
                              <span className="text-purple-300">{pairing.primaryGemstone.chakra}</span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-yellow-500">Benefits:</p>
                              <div className="flex flex-wrap gap-1">
                                {pairing.primaryGemstone.benefits.slice(0, 3).map((benefit, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs bg-yellow-600/20 text-purple-300">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Supporting Gemstones */}
                        <div className="space-y-3">
                          <h4 className="text-purple-300 font-semibold">Supporting Stones</h4>
                          {pairing.supportingGemstones.map((stone, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-black/20 rounded">
                              <div>
                                <p className="text-purple-300 font-medium text-sm">{stone.name}</p>
                                <p className="text-yellow-500 text-xs">{stone.purpose}</p>
                              </div>
                              <p className="text-yellow-500 text-xs">{stone.timing}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lifestyle Guidance Preview */}
                      <div>
                        <h4 className="text-purple-300 font-semibold mb-3 flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          Integrated Lifestyle Guidance
                        </h4>
                        <div className="grid gap-3">
                          {pairing.lifestyleGuidance.map((guidance, i) => (
                            <div key={i} className="p-3 bg-black/20 rounded border-l-4 border-yellow-600">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-purple-300 font-medium">{guidance.area}</h5>
                                <Badge className="bg-green-500/20 text-green-300 text-xs">
                                  {guidance.confidence}% confidence
                                </Badge>
                              </div>
                              <p className="text-yellow-500 text-sm">{guidance.recommendations[0]}</p>
                              <p className="text-yellow-500 text-xs mt-1">+{guidance.recommendations.length - 1} more recommendations</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Synergy Preview */}
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <h4 className="text-yellow-300 font-semibold mb-2 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Synergy Effect
                        </h4>
                        <p className="text-yellow-300 text-sm">{pairing.synergy.description}</p>
                        <div className="flex items-center space-x-2 mt-2 text-xs">
                          <Clock className="h-3 w-3 text-yellow-400" />
                          <span className="text-yellow-400">Best timing: {pairing.synergy.optimalTiming}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {getCurrentPairings().length === 0 && (
                  <Card className="bg-black/40 border-yellow-600/30">
                    <CardContent className="text-center py-12">
                      <div className="text-yellow-500 mb-4">
                        {category.icon}
                      </div>
                      <p className="text-purple-300">
                        Generating personalized {category.name.toLowerCase()} pairings...
                      </p>
                      <p className="text-yellow-500 text-sm mt-2">
                        Complete profile analysis in progress.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Detailed Pairing Modal */}
      {selectedPairing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-black/90 border-yellow-600/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-purple-300">{selectedPairing.title}</CardTitle>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedPairing(null)}
                  className="text-purple-300 hover:bg-yellow-600/20"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Complete Gemstone Information */}
              <div>
                <h3 className="text-purple-300 font-semibold text-lg mb-4">Primary Gemstone</h3>
                <div className="p-6 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-full border-2 border-white/30 ${
                      selectedPairing.primaryGemstone.color.includes('Red') ? 'bg-red-400' :
                      selectedPairing.primaryGemstone.color.includes('Green') ? 'bg-green-400' :
                      selectedPairing.primaryGemstone.color.includes('Blue') ? 'bg-blue-400' :
                      selectedPairing.primaryGemstone.color.includes('Yellow') || selectedPairing.primaryGemstone.color.includes('Golden') ? 'bg-yellow-400' :
                      selectedPairing.primaryGemstone.color.includes('Pink') ? 'bg-pink-400' :
                      selectedPairing.primaryGemstone.color.includes('Purple') ? 'bg-yellow-500' :
                      selectedPairing.primaryGemstone.color.includes('Orange') ? 'bg-orange-400' :
                      selectedPairing.primaryGemstone.color.includes('White') || selectedPairing.primaryGemstone.color.includes('Creamy') ? 'bg-white' :
                      'bg-gray-400'
                    }`}></div>
                    <div>
                      <h4 className="text-xl text-purple-300">{selectedPairing.primaryGemstone.name}</h4>
                      <p className="text-yellow-500">{selectedPairing.primaryGemstone.purpose}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-yellow-500 text-sm">Chakra Association</p>
                      <p className="text-purple-300">{selectedPairing.primaryGemstone.chakra}</p>
                    </div>
                    <div>
                      <p className="text-yellow-500 text-sm">Color Energy</p>
                      <p className="text-purple-300">{selectedPairing.primaryGemstone.color}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-yellow-500 text-sm mb-2">Benefits</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedPairing.primaryGemstone.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center text-sm text-purple-300">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-yellow-500 text-sm mb-2">Wearing Instructions</p>
                    <p className="text-purple-300 text-sm">{selectedPairing.primaryGemstone.wearingInstructions}</p>
                  </div>
                </div>
              </div>

              {/* Complete Lifestyle Guidance */}
              <div>
                <h3 className="text-purple-300 font-semibold text-lg mb-4">Integrated Lifestyle Guidance</h3>
                <div className="space-y-4">
                  {selectedPairing.lifestyleGuidance.map((guidance, i) => (
                    <div key={i} className="p-4 bg-black/20 border border-yellow-600/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-purple-300 font-semibold">{guidance.area}</h4>
                        <Badge className="bg-green-500/20 text-green-300">
                          {guidance.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {guidance.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-purple-300 text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 mt-3 text-xs">
                        <Clock className="h-3 w-3 text-yellow-500" />
                        <span className="text-yellow-500">{guidance.timing}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Synergy Details */}
              <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h3 className="text-yellow-300 font-semibold text-lg mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Synergy Enhancement
                </h3>
                <p className="text-yellow-300 mb-4">{selectedPairing.synergy.description}</p>
                <div className="mb-4">
                  <h4 className="text-yellow-300 font-semibold mb-2">Enhancement Tips</h4>
                  <div className="space-y-2">
                    {selectedPairing.synergy.enhancementTips.map((tip, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-yellow-300 text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400">Optimal timing: {selectedPairing.synergy.optimalTiming}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}