import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Home, MapPin, Palette, Gem, Thermometer, Plane, Calendar, Star } from "lucide-react";

export default function LifestyleIntelligence() {
  const [activeTab, setActiveTab] = useState("travel");

  // Sample lifestyle intelligence data
  const lifestyleData = {
    travel: {
      optimal: [
        {
          destination: "Bali, Indonesia",
          season: "April-June, September-October", 
          avgTemp: "26-29°C",
          reason: "Venus in Taurus loves earthy luxury. Your fire element thrives in warm, spiritual environments.",
          activities: ["Yoga retreats", "Temple visits", "Art workshops", "Healing ceremonies"]
        },
        {
          destination: "Tuscany, Italy",
          season: "May-July, September",
          avgTemp: "22-28°C", 
          reason: "Taurus energy resonates with wine country. Earth element finds grounding in countryside.",
          activities: ["Wine tasting", "Cooking classes", "Art appreciation", "Countryside walks"]
        },
        {
          destination: "Kyoto, Japan",
          season: "March-May, October-November",
          avgTemp: "15-25°C",
          reason: "Your Wood element (Chinese) harmonizes with Japanese aesthetic philosophy.",
          activities: ["Temple meditation", "Garden walks", "Tea ceremonies", "Traditional crafts"]
        }
      ],
      avoid: [
        {
          destination: "Northern Alaska",
          reason: "Extreme cold conflicts with your fire/earth elemental balance",
          season: "November-March"
        },
        {
          destination: "Las Vegas, Nevada", 
          reason: "Overstimulating environment clashes with Taurus need for natural beauty",
          season: "Year-round"
        }
      ]
    },
    colors: {
      power: {
        primary: "#8B4513", // Saddle Brown
        secondary: "#228B22", // Forest Green
        accent: "#FFD700", // Gold
        reason: "Earth signs (Taurus) benefit from browns and greens. Gold enhances Jupiter influences."
      },
      daily: {
        monday: "#4169E1", // Royal Blue (Mercury day)
        tuesday: "#DC143C", // Crimson (Mars day)
        wednesday: "#32CD32", // Lime Green (Mercury day)
        thursday: "#FFD700", // Gold (Jupiter day)
        friday: "#FF69B4", // Hot Pink (Venus day)
        saturday: "#800080", // Purple (Saturn day)
        sunday: "#FFA500"  // Orange (Sun day)
      },
      seasonal: {
        spring: "#90EE90", // Light Green
        summer: "#FF6347", // Tomato
        autumn: "#D2691E", // Chocolate
        winter: "#4682B4"  // Steel Blue
      }
    },
    gemstones: {
      primary: {
        name: "Emerald",
        purpose: "Heart chakra activation and Venus enhancement",
        wearing: "Ring finger or heart chakra pendant",
        timing: "Venus hours: Friday mornings, Venus days"
      },
      secondary: {
        name: "Rose Quartz", 
        purpose: "Emotional healing and love attraction",
        wearing: "Left wrist or bedroom placement",
        timing: "New moon and full moon ceremonies"
      },
      protection: {
        name: "Black Tourmaline",
        purpose: "Grounding and electromagnetic protection", 
        wearing: "Left pocket or workspace",
        timing: "During stressful periods or technology use"
      },
      healing: {
        name: "Amethyst",
        purpose: "Spiritual protection and intuition enhancement",
        wearing: "Third eye chakra or meditation space",
        timing: "Full moon cleansing and daily meditation"
      },
      prosperity: {
        name: "Citrine",
        purpose: "Abundance attraction and solar plexus activation",
        wearing: "Wallet or business area",
        timing: "New moon manifestation and Jupiter hours"
      },
      love: {
        name: "Rose Quartz",
        purpose: "Heart chakra opening and self-love cultivation",
        wearing: "Heart area or bedroom",
        timing: "Venus days and relationship work"
      }
    }
  };

  return (
    <div className="min-h-screen cosmic-gradient">
      {/* Home Button */}
      <Link href="/">
        <Button className="home-button">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </Link>

      <main className="relative z-10 px-4 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              🌟 Lifestyle Intelligence
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Personalized recommendations based on your complete astrological profile
            </p>
            <Badge variant="outline" className="text-white border-purple-400 text-lg px-4 py-2">
              Value: $200+ Professional Consultation
            </Badge>
          </div>

          {/* System Synthesis Explanation */}
          <Card className="bg-white/10 border-purple-400/30 backdrop-blur-md mb-8">
            <CardHeader>
              <CardTitle className="text-white text-xl">
                <Star className="inline mr-2" />
                AI Cross-System Synthesis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-200">
              <p className="mb-4">
                These recommendations combine insights from all systems in your profile:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <strong className="text-purple-300">Western:</strong> Taurus Sun, Earth element
                </div>
                <div>
                  <strong className="text-orange-300">Vedic:</strong> Aries Rashi, Rohini Nakshatra
                </div>
                <div>
                  <strong className="text-red-300">Chinese:</strong> Wood Pig, Earth element
                </div>
                <div>
                  <strong className="text-green-300">Numerology:</strong> Life Path 8, Destiny 11
                </div>
                <div>
                  <strong className="text-blue-300">Human Design:</strong> Generator type
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10">
              <TabsTrigger value="travel" className="text-white data-[state=active]:bg-blue-500">
                <MapPin className="mr-2 h-4 w-4" />
                Travel Destinations
              </TabsTrigger>
              <TabsTrigger value="colors" className="text-white data-[state=active]:bg-purple-500">
                <Palette className="mr-2 h-4 w-4" />
                Color Therapy
              </TabsTrigger>
              <TabsTrigger value="gemstones" className="text-white data-[state=active]:bg-emerald-500">
                <Gem className="mr-2 h-4 w-4" />
                Gemstone Guidance
              </TabsTrigger>
            </TabsList>

            {/* Travel Intelligence */}
            <TabsContent value="travel" className="mt-6">
              <div className="space-y-6">
                <Card className="bg-white/10 border-blue-400/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Plane className="mr-2 h-5 w-5" />
                      Optimal Travel Destinations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lifestyleData.travel.optimal.map((dest, index) => (
                      <Card key={index} className="bg-white/5 border-blue-300/20">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-semibold text-blue-300">{dest.destination}</h4>
                            <div className="flex items-center text-sm text-gray-300">
                              <Thermometer className="mr-1 h-3 w-3" />
                              {dest.avgTemp}
                            </div>
                          </div>
                          <div className="flex items-center mb-2 text-sm text-gray-300">
                            <Calendar className="mr-1 h-3 w-3" />
                            Best time: {dest.season}
                          </div>
                          <p className="text-gray-200 mb-3 text-sm">{dest.reason}</p>
                          <div className="flex flex-wrap gap-2">
                            {dest.activities.map((activity, i) => (
                              <Badge key={i} variant="outline" className="text-xs border-blue-400/50 text-blue-200">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-red-400/30">
                  <CardHeader>
                    <CardTitle className="text-white">Destinations to Avoid</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lifestyleData.travel.avoid.map((dest, index) => (
                      <div key={index} className="p-3 bg-red-500/10 border border-red-400/30 rounded">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-red-300">{dest.destination}</span>
                          <span className="text-xs text-gray-400">{dest.season}</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{dest.reason}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Color Intelligence */}
            <TabsContent value="colors" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/10 border-purple-400/30">
                  <CardHeader>
                    <CardTitle className="text-white">Power Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full" style={{backgroundColor: lifestyleData.colors.power.primary}}></div>
                      <div>
                        <div className="text-white font-medium">Primary</div>
                        <div className="text-xs text-gray-400">Grounding & Stability</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full" style={{backgroundColor: lifestyleData.colors.power.secondary}}></div>
                      <div>
                        <div className="text-white font-medium">Secondary</div>
                        <div className="text-xs text-gray-400">Growth & Prosperity</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full" style={{backgroundColor: lifestyleData.colors.power.accent}}></div>
                      <div>
                        <div className="text-white font-medium">Accent</div>
                        <div className="text-xs text-gray-400">Success & Abundance</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 mt-3">{lifestyleData.colors.power.reason}</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-purple-400/30">
                  <CardHeader>
                    <CardTitle className="text-white">Daily Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(lifestyleData.colors.daily).map(([day, color]) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-white capitalize text-sm">{day}</span>
                        <div className="w-6 h-6 rounded-full" style={{backgroundColor: color}}></div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-purple-400/30">
                  <CardHeader>
                    <CardTitle className="text-white">Seasonal Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(lifestyleData.colors.seasonal).map(([season, color]) => (
                      <div key={season} className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full" style={{backgroundColor: color}}></div>
                        <span className="text-white capitalize">{season}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Gemstone Intelligence */}
            <TabsContent value="gemstones" className="mt-6">
              <div className="space-y-6">
                {/* Primary Recommendations */}
                <Card className="bg-white/10 border-emerald-400/30">
                  <CardHeader>
                    <CardTitle className="text-white">Personalized Gemstone Recommendations</CardTitle>
                    <p className="text-gray-300 text-sm">Based on your complete astrological profile synthesis</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(lifestyleData.gemstones).map(([type, stone]) => (
                        <Card key={type} className="bg-emerald-500/10 border-emerald-400/20">
                          <CardContent className="p-4">
                            <div className="text-center mb-3">
                              <h4 className="text-lg font-semibold text-emerald-300 capitalize">{type}</h4>
                              <h5 className="text-xl font-bold text-white">{stone.name}</h5>
                            </div>
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="text-emerald-400 font-medium">Purpose:</span>
                                <p className="text-gray-200">{stone.purpose}</p>
                              </div>
                              <div>
                                <span className="text-emerald-400 font-medium">How to wear:</span>
                                <p className="text-gray-200">{stone.wearing}</p>
                              </div>
                              <div>
                                <span className="text-emerald-400 font-medium">Best timing:</span>
                                <p className="text-gray-200">{stone.timing}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Planetary Gemstones */}
                <Card className="bg-white/10 border-emerald-400/30">
                  <CardHeader>
                    <CardTitle className="text-white">Planetary Gemstone System</CardTitle>
                    <p className="text-gray-300 text-sm">Traditional Jyotish recommendations based on your chart</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { planet: "Sun", stone: "Ruby", finger: "Ring finger", day: "Sunday", color: "#DC143C" },
                        { planet: "Moon", stone: "Pearl", finger: "Little finger", day: "Monday", color: "#F8F8FF" },
                        { planet: "Venus", stone: "Diamond", finger: "Middle finger", day: "Friday", color: "#E6E6FA" },
                        { planet: "Jupiter", stone: "Yellow Sapphire", finger: "Index finger", day: "Thursday", color: "#FFD700" },
                        { planet: "Mercury", stone: "Emerald", finger: "Little finger", day: "Wednesday", color: "#50C878" },
                        { planet: "Mars", stone: "Red Coral", finger: "Ring finger", day: "Tuesday", color: "#FF7F50" },
                        { planet: "Saturn", stone: "Blue Sapphire", finger: "Middle finger", day: "Saturday", color: "#0F52BA" },
                        { planet: "Rahu", stone: "Hessonite", finger: "Middle finger", day: "Saturday", color: "#B87333" }
                      ].map((gem, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg border border-emerald-400/20">
                          <div className="text-center">
                            <div className="w-6 h-6 rounded-full mx-auto mb-2" style={{backgroundColor: gem.color}}></div>
                            <h5 className="font-semibold text-white">{gem.planet}</h5>
                            <p className="text-emerald-300 text-sm">{gem.stone}</p>
                            <p className="text-xs text-gray-400">{gem.finger}</p>
                            <p className="text-xs text-gray-400">{gem.day}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Cleansing & Care Instructions */}
                <Card className="bg-white/10 border-emerald-400/30">
                  <CardHeader>
                    <CardTitle className="text-white">Gemstone Care & Activation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-emerald-300 font-semibold mb-3">Cleansing Methods</h4>
                        <ul className="space-y-2 text-gray-200 text-sm">
                          <li>• Running water (except pearls/opals)</li>
                          <li>• Full moon moonlight (all stones)</li>
                          <li>• Sea salt water (hard stones only)</li>
                          <li>• Sage smoke cleansing</li>
                          <li>• Crystal cluster charging</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-emerald-300 font-semibold mb-3">Activation Timing</h4>
                        <ul className="space-y-2 text-gray-200 text-sm">
                          <li>• New moon for new intentions</li>
                          <li>• Planetary hours for planet stones</li>
                          <li>• Thursday for Jupiter stones</li>
                          <li>• Friday for Venus stones</li>
                          <li>• Sunday morning for all stones</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-emerald-300 font-semibold mb-3">Wearing Guidelines</h4>
                        <ul className="space-y-2 text-gray-200 text-sm">
                          <li>• Right hand for giving energy</li>
                          <li>• Left hand for receiving energy</li>
                          <li>• Direct skin contact preferred</li>
                          <li>• Metal settings: gold/silver per planet</li>
                          <li>• Remove during sleep initially</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Chakra Alignment */}
                <Card className="bg-white/10 border-emerald-400/30">
                  <CardHeader>
                    <CardTitle className="text-white">Chakra Gemstone Alignment</CardTitle>
                    <p className="text-gray-300 text-sm">Balance your energy centers with targeted crystal therapy</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { chakra: "Root", stone: "Red Jasper", color: "#DC143C", location: "Base of spine" },
                        { chakra: "Sacral", stone: "Carnelian", color: "#FF8C00", location: "Below navel" },
                        { chakra: "Solar Plexus", stone: "Citrine", color: "#FFD700", location: "Upper abdomen" },
                        { chakra: "Heart", stone: "Rose Quartz", color: "#FFB6C1", location: "Center of chest" },
                        { chakra: "Throat", stone: "Blue Lace Agate", color: "#87CEEB", location: "Throat area" },
                        { chakra: "Third Eye", stone: "Amethyst", color: "#9370DB", location: "Between eyebrows" },
                        { chakra: "Crown", stone: "Clear Quartz", color: "#F8F8FF", location: "Top of head" }
                      ].map((chakra, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-lg border border-emerald-400/20">
                          <div className="text-center">
                            <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{backgroundColor: chakra.color}}></div>
                            <h5 className="font-semibold text-white">{chakra.chakra}</h5>
                            <p className="text-emerald-300 text-sm">{chakra.stone}</p>
                            <p className="text-xs text-gray-400">{chakra.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Educational Value Proposition */}
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 mt-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                💎 Educational Value: $25,000+ in Specialized Knowledge
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-purple-300 font-semibold mb-2">What You Learn:</h4>
                  <ul className="text-gray-200 text-sm space-y-1">
                    <li>• Authentic methodology behind each system</li>
                    <li>• Why systems agree or disagree on recommendations</li>
                    <li>• Progressive disclosure from beginner to advanced</li>
                    <li>• Scientific temperature data for travel planning</li>
                    <li>• Traditional color and gemstone principles</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-pink-300 font-semibold mb-2">vs. Other Platforms:</h4>
                  <ul className="text-gray-200 text-sm space-y-1">
                    <li>• Entertainment vs. Education</li>
                    <li>• Single system vs. Cross-system synthesis</li>
                    <li>• Generic advice vs. Personalized intelligence</li>
                    <li>• No methodology vs. Transparent calculations</li>
                    <li>• Limited depth vs. Progressive learning</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}