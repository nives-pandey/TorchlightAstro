import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars, Sparkles, Users, Calendar, Moon, Sun, Zap, Eye, Heart, Compass } from "lucide-react";
import InteractiveExpandableCard from "./interactive-expandable-card";

export default function ColorEnhancedLanding() {
  return (
    <div className="min-h-screen bg-cosmic-gradient">
      {/* Enhanced Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="relative">
            {/* Cosmic Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-1/4 w-2 h-2 bg-yellow-500 rounded-full cosmic-pulse"></div>
              <div className="absolute top-20 right-1/3 w-1 h-1 bg-yellow-500 rounded-full cosmic-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-10 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full cosmic-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 cosmic-glow">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-pink-400 bg-clip-text text-transparent">
                Cosmic Insights
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl mb-12 text-teal-200 max-w-3xl mx-auto leading-relaxed">
            Discover your cosmic blueprint through 10+ ancient wisdom traditions
          </p>
          
          {/* Interactive System Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { name: "Western", color: "from-yellow-400 to-orange-400", icon: "🌟" },
              { name: "Vedic", color: "from-orange-400 to-red-400", icon: "🕉️" },
              { name: "Chinese", color: "from-red-400 to-pink-400", icon: "🐉" },
              { name: "Human Design", color: "from-blue-400 to-yellow-500", icon: "⚡" },
              { name: "Numerology", color: "from-green-400 to-blue-400", icon: "🔢" }
            ].map((system, index) => (
              <Badge 
                key={system.name}
                className={`px-4 py-2 bg-gradient-to-r ${system.color} text-white border-none hover:scale-110 transition-all duration-300 cursor-pointer font-medium`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="mr-2">{system.icon}</span>
                {system.name}
              </Badge>
            ))}
          </div>
          
          <Button className="sanctuary-button px-10 py-4 text-lg font-semibold cosmic-pulse">
            Begin Your Journey
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Interactive Feature Cards */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 cosmic-glow">
            <span className="bg-gradient-to-r from-yellow-500 to-pink-400 bg-clip-text text-transparent">
              Discover What's Hidden Below
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <InteractiveExpandableCard
              title="Personal Cosmic Analysis"
              description="Your complete astrological profile"
              preview="Discover your natal chart, personality insights, life path, and cosmic influences..."
              icon={<Eye className="h-5 w-5 text-yellow-500" />}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-yellow-600/10 to-pink-500/10 rounded-lg border border-yellow-500/20">
                    <h4 className="font-semibold text-teal-300 mb-2">Natal Chart</h4>
                    <p className="text-sm text-gray-300">Planetary positions at your birth moment</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-yellow-600/10 rounded-lg border border-blue-400/20">
                    <h4 className="font-semibold text-blue-300 mb-2">Life Path</h4>
                    <p className="text-sm text-gray-300">Your numerological destiny number</p>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-400/20">
                  <h4 className="font-semibold text-green-300 mb-2">Human Design</h4>
                  <p className="text-sm text-gray-300">Your energetic blueprint and decision-making strategy</p>
                </div>
              </div>
            </InteractiveExpandableCard>

            <InteractiveExpandableCard
              title="Relationship Compatibility"
              description="Multi-system compatibility analysis"
              preview="Compare cosmic energies, synastry charts, Chinese zodiac matches, and numerology..."
              icon={<Heart className="h-5 w-5 text-pink-400" />}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-lg border border-pink-400/20">
                    <h4 className="font-semibold text-pink-300 mb-2">Synastry Analysis</h4>
                    <p className="text-sm text-gray-300">How your planets interact with your partner's</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg border border-red-400/20">
                    <h4 className="font-semibold text-red-300 mb-2">Chinese Compatibility</h4>
                    <p className="text-sm text-gray-300">Animal sign compatibility and element harmony</p>
                  </div>
                </div>
              </div>
            </InteractiveExpandableCard>

            <InteractiveExpandableCard
              title="Daily Cosmic Weather"
              description="Personalized daily guidance"
              preview="Get daily insights based on current planetary transits, moon phases, and your personal chart..."
              icon={<Compass className="h-5 w-5 text-yellow-500" />}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                    <h4 className="font-semibold text-teal-300 mb-2">Planetary Transits</h4>
                    <p className="text-sm text-gray-300">Current cosmic influences on your chart</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-yellow-600/10 rounded-lg border border-blue-400/20">
                    <h4 className="font-semibold text-blue-300 mb-2">Moon Phases</h4>
                    <p className="text-sm text-gray-300">Lunar energy and optimal timing</p>
                  </div>
                </div>
              </div>
            </InteractiveExpandableCard>

            <InteractiveExpandableCard
              title="3D Cosmic Visualization"
              description="Interactive planetary mapping"
              preview="Explore your chart in 3D space with real planetary positions and aspect patterns..."
              icon={<Zap className="h-5 w-5 text-cyan-400" />}
            >
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-400/20">
                  <h4 className="font-semibold text-cyan-300 mb-2">3D Chart Wheel</h4>
                  <p className="text-sm text-gray-300">Interactive planetary positions in cosmic space</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-yellow-600/10 to-pink-500/10 rounded-lg border border-yellow-500/20">
                  <h4 className="font-semibold text-teal-300 mb-2">Aspect Patterns</h4>
                  <p className="text-sm text-gray-300">Visual representation of planetary relationships</p>
                </div>
              </div>
            </InteractiveExpandableCard>
          </div>
        </div>
      </section>

      {/* Color Palette Showcase */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-bold mb-8 cosmic-glow">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Powered by Swiss Ephemeris Precision
            </span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { name: "Cosmic Purple", color: "bg-gradient-to-br from-yellow-600 to-yellow-600", description: "Mystical insights" },
              { name: "Celestial Pink", color: "bg-gradient-to-br from-pink-500 to-pink-600", description: "Love & relationships" },
              { name: "Solar Gold", color: "bg-gradient-to-br from-yellow-400 to-yellow-500", description: "Personal power" },
              { name: "Lunar Blue", color: "bg-gradient-to-br from-blue-500 to-blue-600", description: "Intuitive wisdom" },
              { name: "Earth Green", color: "bg-gradient-to-br from-green-500 to-green-600", description: "Growth & healing" }
            ].map((color, index) => (
              <div 
                key={color.name}
                className="group cursor-pointer"
              >
                <div className={`${color.color} h-20 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg`}></div>
                <p className="text-xs text-gray-300 group-hover:text-white transition-colors">{color.description}</p>
              </div>
            ))}
          </div>
          
          <p className="text-teal-200 max-w-2xl mx-auto">
            Our color-coded system helps you intuitively understand different aspects of your cosmic profile, 
            making complex astrological information accessible and beautiful.
          </p>
        </div>
      </section>
    </div>
  );
}