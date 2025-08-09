import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Zap, Calculator } from "lucide-react";

export default function Couples() {
  return (
    <div className="min-h-screen bg-cosmic-gradient">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            Relationship Compatibility
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Explore deep compatibility insights across all astrological systems to understand your relationship dynamics
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Synastry Analysis */}
          <Card className="clean-card p-6 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Synastry Analysis</CardTitle>
              <CardDescription className="text-purple-200">
                Deep compatibility analysis across Western and Vedic systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Planet-to-planet aspects</li>
                <li>• House overlays & meanings</li>
                <li>• Karmic connections</li>
                <li>• Attraction & challenge points</li>
              </ul>
              <Badge className="mt-4 bg-pink-400/20 text-pink-300 border-pink-400/30">
                Traditional Synastry
              </Badge>
            </CardContent>
          </Card>

          {/* Composite Charts */}
          <Card className="clean-card p-6 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-indigo-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Composite Charts</CardTitle>
              <CardDescription className="text-purple-200">
                Relationship chart revealing partnership dynamics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Composite sun & moon</li>
                <li>• Relationship purpose</li>
                <li>• Shared challenges</li>
                <li>• Growth opportunities</li>
              </ul>
              <Badge className="mt-4 bg-yellow-500/20 text-purple-300 border-yellow-500/30">
                Partnership Blueprint
              </Badge>
            </CardContent>
          </Card>

          {/* Chinese Compatibility */}
          <Card className="clean-card p-6 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Chinese Compatibility</CardTitle>
              <CardDescription className="text-purple-200">
                Chinese zodiac compatibility with element analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Animal sign compatibility</li>
                <li>• Element interactions</li>
                <li>• Energy flow patterns</li>
                <li>• Yearly cycle harmony</li>
              </ul>
              <Badge className="mt-4 bg-red-400/20 text-red-300 border-red-400/30">
                Ancient Wisdom
              </Badge>
            </CardContent>
          </Card>

          {/* Numerology Compatibility */}
          <Card className="clean-card p-6 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Numerology Compatibility</CardTitle>
              <CardDescription className="text-purple-200">
                Life path and destiny number compatibility analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Life path harmony</li>
                <li>• Destiny alignment</li>
                <li>• Soul urge resonance</li>
                <li>• Communication styles</li>
              </ul>
              <Badge className="mt-4 bg-green-400/20 text-green-300 border-green-400/30">
                Number Patterns
              </Badge>
            </CardContent>
          </Card>

        </div>

        <div className="mt-16 text-center">
          <div className="p-8 bg-black/30 rounded-xl border border-pink-400/20">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to explore your relationship compatibility?</h3>
            <p className="text-purple-200 mb-6">Get comprehensive insights into your partnership across all astrological systems</p>
            <button className="clean-button px-8 py-3">
              Analyze Compatibility
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}