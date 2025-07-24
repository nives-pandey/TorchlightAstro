import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, Sun, Moon, Calendar, MapPin, Clock, 
  Heart, Briefcase, Shield, Zap, Target, 
  TrendingUp, Users, Home 
} from "lucide-react";

// Krishna Raj's Profile Data
const profileData = {
  name: "Krishna Raj",
  birthDate: "June 14, 1975",
  birthTime: "9:18 AM",
  location: "Manipal, India",
  age: 49,
  coordinates: { lat: 13.3415, lng: 74.7421 }
};

// Calculated Astrological Data for Krishna Raj
const astrologyData = {
  western: {
    sunSign: "Gemini",
    moonSign: "Scorpio", 
    ascendant: "Leo",
    elements: { air: 40, water: 30, fire: 20, earth: 10 },
    qualities: { cardinal: 30, fixed: 40, mutable: 30 },
    planets: {
      sun: { sign: "Gemini", house: 11, degree: "23°42'" },
      moon: { sign: "Scorpio", house: 4, degree: "8°15'" },
      mercury: { sign: "Gemini", house: 11, degree: "15°33'" },
      venus: { sign: "Taurus", house: 10, degree: "2°18'" },
      mars: { sign: "Cancer", house: 12, degree: "19°45'" }
    },
    traits: [
      "Intellectually curious and communicative",
      "Deep emotional intensity beneath surface charm", 
      "Natural leadership presence and charisma",
      "Strong intuition combined with analytical mind",
      "Versatile but may struggle with consistency"
    ]
  },
  vedic: {
    rashi: "Mithuna (Gemini)",
    nakshatra: "Punarvasu",
    pada: 3,
    ascendant: "Simha (Leo)",
    moonNakshatra: "Anuradha",
    dasha: "Venus Mahadasha",
    doshas: { vata: 40, pitta: 35, kapha: 25 },
    traits: [
      "Quick learning ability with strong communication skills",
      "Emotionally resilient with deep transformation capacity",
      "Good fortune in partnerships and collaborations", 
      "Strong spiritual inclinations in later life",
      "Success through creative and intellectual pursuits"
    ]
  },
  chinese: {
    animal: "Rabbit",
    element: "Wood",
    yinYang: "Yin",
    lunarAge: 49,
    compatibility: ["Goat", "Pig", "Dog"],
    traits: [
      "Gentle, diplomatic, and peace-loving nature",
      "Strong aesthetic sense and appreciation for beauty",
      "Cautious decision-maker who values security",
      "Excellent at maintaining harmony in relationships",
      "Natural talent for creating comfortable environments"
    ]
  },
  humanDesign: {
    type: "Manifesting Generator",
    strategy: "Respond then Inform",
    authority: "Sacral",
    profile: "3/5 Experimenter/Heretic", 
    definition: "Split Definition",
    centers: {
      defined: ["Sacral", "Solar Plexus", "Spleen"],
      undefined: ["Head", "Ajna", "Throat", "G", "Heart", "Root"]
    },
    traits: [
      "Multi-passionate with sustainable life force energy",
      "Natural ability to find efficient shortcuts to success",
      "Emotional decision-making with intuitive timing",
      "Learning through trial and error experimentation",
      "Natural teacher and guide for others' transformation"
    ]
  },
  numerology: {
    lifePath: 6,
    destiny: 8, 
    soulUrge: 3,
    personality: 5,
    birthDay: 14,
    traits: [
      "Life Path 6: Natural nurturer and responsible caretaker",
      "Destiny 8: Material success through leadership and organization", 
      "Soul Urge 3: Creative expression and joyful communication",
      "Personality 5: Adventurous spirit with magnetic charm",
      "Strong family orientation with business acumen"
    ]
  }
};

// Comprehensive synthesis across all systems
const comprehensiveAnalysis = {
  corePersonality: [
    "Intellectually gifted communicator with deep emotional wisdom",
    "Natural leader who guides through teaching and example", 
    "Balances analytical thinking with intuitive decision-making",
    "Strong family values combined with material ambition",
    "Diplomatic nature that creates harmony in all relationships"
  ],
  strengths: [
    "Exceptional communication and teaching abilities",
    "Strong emotional intelligence and empathy",
    "Natural leadership and organizational skills", 
    "Creative problem-solving and innovation",
    "Ability to balance multiple interests successfully"
  ],
  challenges: [
    "May scatter energy across too many projects",
    "Tendency to overthink emotional decisions",
    "Balancing personal needs with family responsibilities",
    "Managing high expectations from self and others",
    "Finding consistency in ever-changing interests"
  ],
  lifeThemes: [
    "Service to family and community through knowledge sharing",
    "Building material security while maintaining spiritual values",
    "Creative expression as a path to personal fulfillment", 
    "Transforming challenges into wisdom for helping others",
    "Harmonizing opposing forces in life and relationships"
  ],
  currentPhase: {
    age: "49 - Peak manifestation period across all systems",
    focus: "Venus Mahadasha emphasizes relationships, creativity, and material comfort",
    opportunities: "Strong period for teaching, mentoring, and creative projects",
    guidance: "Trust intuitive responses while maintaining practical planning"
  }
};

export default function ComprehensiveAnalysis() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-cosmic-gradient p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Profile Header */}
        <Card className="cosmic-card cosmic-glow mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-yellow-500 mb-2">{profileData.name}</CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Complete Astrological Profile Analysis
            </CardDescription>
            
            {/* Birth Details */}
            <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{profileData.birthDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{profileData.birthTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{profileData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Age {profileData.age}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Analysis Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black/40 border border-yellow-500/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="western" className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Western
            </TabsTrigger>
            <TabsTrigger value="vedic" className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Vedic
            </TabsTrigger>
            <TabsTrigger value="chinese" className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Chinese
            </TabsTrigger>
            <TabsTrigger value="human-design" className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Human Design
            </TabsTrigger>
            <TabsTrigger value="numerology" className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Numerology
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Comprehensive Analysis */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Core Personality */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-yellow-500 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Core Personality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {comprehensiveAnalysis.corePersonality.map((trait, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{trait}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Current Life Phase */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-yellow-500 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Current Life Phase
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Age & Timing</h4>
                    <p className="text-gray-300 text-sm">{comprehensiveAnalysis.currentPhase.age}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Current Focus</h4>
                    <p className="text-gray-300 text-sm">{comprehensiveAnalysis.currentPhase.focus}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Key Opportunities</h4>
                    <p className="text-gray-300 text-sm">{comprehensiveAnalysis.currentPhase.opportunities}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Guidance</h4>
                    <p className="text-gray-300 text-sm">{comprehensiveAnalysis.currentPhase.guidance}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-green-500 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Core Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {comprehensiveAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Life Themes */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-purple-500 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Life Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {comprehensiveAnalysis.lifeThemes.map((theme, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <Star className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{theme}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Western Astrology Tab */}
          <TabsContent value="western" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Basic Chart Info */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-yellow-500 flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    Western Chart Basics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-yellow-500 font-medium">Sun Sign</div>
                      <div className="text-white text-lg">{astrologyData.western.sunSign}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-medium">Moon Sign</div>
                      <div className="text-white text-lg">{astrologyData.western.moonSign}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-400 font-medium">Ascendant</div>
                      <div className="text-white text-lg">{astrologyData.western.ascendant}</div>
                    </div>
                  </div>

                  {/* Element Distribution */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Elemental Balance</h4>
                    <div className="space-y-2">
                      {Object.entries(astrologyData.western.elements).map(([element, percentage]) => (
                        <div key={element} className="flex items-center justify-between">
                          <span className="text-gray-300 capitalize">{element}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-white text-sm w-8">{percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Western Traits */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-yellow-500">Western Astrology Traits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {astrologyData.western.traits.map((trait, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{trait}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vedic Astrology Tab */}
          <TabsContent value="vedic" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Vedic Chart Info */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-orange-500 flex items-center gap-2">
                    🕉 Vedic Chart Basics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-orange-400 font-medium">Rashi (Moon Sign)</div>
                      <div className="text-white">{astrologyData.vedic.rashi}</div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-medium">Nakshatra</div>
                      <div className="text-white">{astrologyData.vedic.nakshatra}</div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-medium">Current Dasha</div>
                      <div className="text-white">{astrologyData.vedic.dasha}</div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-medium">Pada</div>
                      <div className="text-white">{astrologyData.vedic.pada}</div>
                    </div>
                  </div>

                  {/* Dosha Balance */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Ayurvedic Constitution</h4>
                    <div className="space-y-2">
                      {Object.entries(astrologyData.vedic.doshas).map(([dosha, percentage]) => (
                        <div key={dosha} className="flex items-center justify-between">
                          <span className="text-gray-300 capitalize">{dosha}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-orange-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-white text-sm w-8">{percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vedic Traits */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-orange-500">Vedic Astrology Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {astrologyData.vedic.traits.map((trait, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <Star className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{trait}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chinese Zodiac Tab */}
          <TabsContent value="chinese" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Chinese Chart Info */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-red-500 flex items-center gap-2">
                    🐉 Chinese Zodiac
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-2">🐰</div>
                    <div className="text-red-400 text-xl font-medium">{astrologyData.chinese.animal}</div>
                    <div className="text-green-400">{astrologyData.chinese.element} Element</div>
                    <div className="text-gray-400">{astrologyData.chinese.yinYang} Energy</div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">Best Compatibility</h4>
                    <div className="flex gap-2">
                      {astrologyData.chinese.compatibility.map((animal) => (
                        <Badge key={animal} variant="outline" className="border-red-500 text-red-400">
                          {animal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chinese Traits */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-red-500">Chinese Zodiac Traits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {astrologyData.chinese.traits.map((trait, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <Star className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{trait}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Human Design Tab */}
          <TabsContent value="human-design" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Human Design Info */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-purple-500 flex items-center gap-2">
                    ⚡ Human Design Chart
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-purple-400 font-medium">Type</div>
                      <div className="text-white">{astrologyData.humanDesign.type}</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-medium">Strategy</div>
                      <div className="text-white text-sm">{astrologyData.humanDesign.strategy}</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-medium">Authority</div>
                      <div className="text-white">{astrologyData.humanDesign.authority}</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-medium">Profile</div>
                      <div className="text-white text-sm">{astrologyData.humanDesign.profile}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">Defined Centers</h4>
                    <div className="flex flex-wrap gap-2">
                      {astrologyData.humanDesign.centers.defined.map((center) => (
                        <Badge key={center} className="bg-purple-500 text-white">
                          {center}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Human Design Traits */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-purple-500">Human Design Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {astrologyData.humanDesign.traits.map((trait, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <Star className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{trait}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Numerology Tab */}
          <TabsContent value="numerology" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Numerology Chart */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-green-500 flex items-center gap-2">
                    🔢 Numerology Chart
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-black/20 rounded-lg">
                      <div className="text-green-400 font-medium">Life Path</div>
                      <div className="text-white text-2xl font-bold">{astrologyData.numerology.lifePath}</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-lg">
                      <div className="text-green-400 font-medium">Destiny</div>
                      <div className="text-white text-2xl font-bold">{astrologyData.numerology.destiny}</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-lg">
                      <div className="text-green-400 font-medium">Soul Urge</div>
                      <div className="text-white text-2xl font-bold">{astrologyData.numerology.soulUrge}</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-lg">
                      <div className="text-green-400 font-medium">Personality</div>
                      <div className="text-white text-2xl font-bold">{astrologyData.numerology.personality}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Numerology Traits */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-green-500">Numerology Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {astrologyData.numerology.traits.map((trait, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <Star className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{trait}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button className="cosmic-button">
            <Heart className="mr-2 h-4 w-4" />
            Generate Compatibility Report
          </Button>
          <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
            <Calendar className="mr-2 h-4 w-4" />
            View Daily Guidance
          </Button>
          <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white">
            <Target className="mr-2 h-4 w-4" />
            Life Coaching Session
          </Button>
        </div>
      </div>
    </div>
  );
}