import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Compass, Clock, Sparkles } from "lucide-react";

export default function Spaces() {
  return (
    <div className="min-h-screen bg-cosmic-gradient">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Homes & Business Harmony
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Create harmonious living and working spaces with ancient Vastu Shastra and Feng Shui principles
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Vastu Shastra */}
          <Card className="clean-card p-6 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Home className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Vastu Shastra</CardTitle>
              <CardDescription className="text-purple-200">
                Ancient Indian architectural principles for harmonious spaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Directional energy analysis</li>
                <li>• Room placement guidance</li>
                <li>• Element balance assessment</li>
                <li>• Sacred geometry principles</li>
              </ul>
              <Badge className="mt-4 bg-orange-400/20 text-orange-300 border-orange-400/30">
                Ancient Wisdom
              </Badge>
            </CardContent>
          </Card>

          {/* Feng Shui */}
          <Card className="clean-card p-6 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Feng Shui</CardTitle>
              <CardDescription className="text-purple-200">
                Chinese geomancy for optimal energy flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Chi energy flow mapping</li>
                <li>• Bagua area enhancement</li>
                <li>• Five element balancing</li>
                <li>• Prosperity corner activation</li>
              </ul>
              <Badge className="mt-4 bg-green-400/20 text-green-300 border-green-400/30">
                Energy Harmony
              </Badge>
            </CardContent>
          </Card>

          {/* Auspicious Timing */}
          <Card className="clean-card p-6 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Auspicious Timing</CardTitle>
              <CardDescription className="text-purple-200">
                Best times for moving, renovating, or starting ventures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Muhurta calculations</li>
                <li>• Planetary transit timing</li>
                <li>• Lunar phase optimization</li>
                <li>• Business launch timing</li>
              </ul>
              <Badge className="mt-4 bg-blue-400/20 text-blue-300 border-blue-400/30">
                Perfect Timing
              </Badge>
            </CardContent>
          </Card>

          {/* Space Remedies */}
          <Card className="clean-card p-6 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Space Remedies</CardTitle>
              <CardDescription className="text-purple-200">
                Color, crystal, and placement recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Color therapy guidance</li>
                <li>• Crystal placement maps</li>
                <li>• Plant & mirror positioning</li>
                <li>• Sound & light healing</li>
              </ul>
              <Badge className="mt-4 bg-yellow-500/20 text-purple-300 border-yellow-500/30">
                Holistic Healing
              </Badge>
            </CardContent>
          </Card>

        </div>

        <div className="mt-16 text-center">
          <div className="p-8 bg-black/30 rounded-xl border border-green-400/20">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to harmonize your space?</h3>
            <p className="text-purple-200 mb-6">Get comprehensive guidance for creating balanced, prosperous living and working environments</p>
            <button className="clean-button px-8 py-3">
              Analyze Your Space
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}