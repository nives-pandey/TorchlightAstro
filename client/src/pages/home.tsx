import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BirthDataForm from "@/components/birth-data-form";
import PlanetarySymbols from "@/components/planetary-symbols";
import { Star, Shield, Users, Clock, Heart, Briefcase, Dumbbell, Lightbulb } from "lucide-react";

export default function Home() {
  const [showBirthForm, setShowBirthForm] = useState(false);

  const features = [
    {
      icon: "♈",
      title: "Western Astrology",
      description: "12 zodiac signs, planetary aspects, house systems with precise Swiss Ephemeris calculations.",
      features: ["Complete natal chart analysis", "Planetary dignities & aspects", "Transit predictions"]
    },
    {
      icon: "🕉",
      title: "Vedic (Jyotish)",
      description: "Ancient Indian astrology with 27 Nakshatras, Dasha periods, and Ayurvedic connections.",
      features: ["Nakshatra analysis", "Planetary periods (Dasha)", "Dosha constitution"]
    },
    {
      icon: "🐉",
      title: "Chinese Zodiac",
      description: "12 animal signs with Five Element theory for personality insights and compatibility.",
      features: ["Animal sign characteristics", "Five element integration", "Annual predictions"]
    },
    {
      icon: "⚡",
      title: "Human Design",
      description: "Modern synthesis system with energy types, strategy, and authority for decision-making.",
      features: ["Energy type analysis", "Strategy & Authority", "Centers & channels"]
    }
  ];

  const dailyAreas = [
    { icon: Heart, title: "Love & Relationships", color: "text-pink-400" },
    { icon: Briefcase, title: "Career & Finance", color: "text-green-400" },
    { icon: Dumbbell, title: "Health & Wellness", color: "text-blue-400" },
    { icon: Lightbulb, title: "Personal Growth", color: "text-purple-400" }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Cosmic Background Elements */}
        <div className="absolute inset-0 nebula opacity-40"></div>
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-500 rounded-full star-animation"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full star-animation" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-purple-500 rounded-full star-animation" style={{animationDelay: '2s'}}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">
              <span className="text-white">Illuminating Your</span><br/>
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                Cosmic Blueprint
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Authentic ancient wisdom meets modern precision. Discover your complete astrological profile across{" "}
              <span className="text-yellow-500">Western, Vedic, Chinese & Human Design</span> systems.
            </p>
            
            {/* Planetary Symbols Row */}
            <PlanetarySymbols />
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                onClick={() => setShowBirthForm(true)}
                className="cosmic-button px-8 py-4 text-lg h-auto"
              >
                Create Your Chart
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-yellow-500 text-yellow-500 px-8 py-4 text-lg h-auto hover:bg-yellow-500 hover:text-black"
              >
                Explore Demo
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Swiss Ephemeris Precision</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-yellow-500" />
                <span>25,000+ Year Heritage</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-yellow-500" />
                <span>Multi-System Integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Birth Data Collection Modal */}
      {showBirthForm && (
        <BirthDataForm onClose={() => setShowBirthForm(false)} />
      )}

      {/* Features Overview */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Comprehensive Astrological Systems
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              The only platform integrating authentic calculations across multiple ancient wisdom traditions with modern precision.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="cosmic-card hover:cosmic-glow transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-yellow-500 text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Synthesis Feature */}
          <Card className="mt-16 cosmic-card cosmic-glow">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="text-5xl mb-6">🌟</div>
                <h3 className="text-yellow-500 font-semibold text-2xl mb-4">Unique Cross-System Synthesis</h3>
                <p className="text-white text-lg mb-6 max-w-3xl mx-auto">
                  Our proprietary synthesis engine identifies universal patterns across all systems, providing unified recommendations that resolve conflicts and highlight consistent themes.
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-yellow-500 text-lg font-medium mb-2">Pattern Detection</div>
                    <p className="text-gray-400 text-sm">Identifies consistent themes across all systems</p>
                  </div>
                  <div>
                    <div className="text-yellow-500 text-lg font-medium mb-2">Conflict Resolution</div>
                    <p className="text-gray-400 text-sm">Harmonizes contradictory recommendations</p>
                  </div>
                  <div>
                    <div className="text-yellow-500 text-lg font-medium mb-2">Priority Ranking</div>
                    <p className="text-gray-400 text-sm">Orders guidance by importance and timing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Daily Guidance Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Daily Cosmic Guidance
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Personalized insights based on current planetary transits and your unique astrological blueprint.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dailyAreas.map((area, index) => (
              <Card key={index} className="cosmic-card">
                <CardContent className="p-6 text-center">
                  <area.icon className={`h-12 w-12 mx-auto mb-4 ${area.color}`} />
                  <h3 className="text-white font-medium mb-2">{area.title}</h3>
                  <p className="text-gray-400 text-sm">
                    Personalized guidance for your {area.title.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="cosmic-button px-8 py-4 text-lg h-auto">
              <Clock className="mr-2 h-5 w-5" />
              View Today's Guidance
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-black border-t border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 cosmic-gradient rounded-full cosmic-glow flex items-center justify-center">
                  <span className="text-yellow-500 text-xl font-bold">☉</span>
                </div>
                <span className="text-xl font-serif font-semibold text-yellow-500">Torchlight</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Illuminating your cosmic blueprint through authentic ancient wisdom for practical modern living.
              </p>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="text-yellow-500 font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Natal Charts</li>
                <li>Compatibility Analysis</li>
                <li>Daily Horoscopes</li>
                <li>Transit Tracking</li>
                <li>Multi-System Analysis</li>
              </ul>
            </div>
            
            {/* Systems */}
            <div>
              <h4 className="text-yellow-500 font-semibold mb-4">Astrological Systems</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Western Astrology</li>
                <li>Vedic (Jyotish)</li>
                <li>Chinese Zodiac</li>
                <li>Human Design</li>
                <li>Cross-System Synthesis</li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-yellow-500 font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact Us</li>
                <li>API Documentation</li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-yellow-500/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Torchlight. Illuminating cosmic wisdom for 25,000+ years of human observation.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4 text-gray-400 text-sm">
              <span>Powered by Swiss Ephemeris</span>
              <span>•</span>
              <span>Authentic Ancient Sources</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
