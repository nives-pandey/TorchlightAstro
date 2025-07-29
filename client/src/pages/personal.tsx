import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Calculator, Calendar, User } from "lucide-react";

export default function Personal() {
  return (
    <div className="min-h-screen bg-cosmic-gradient">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Personal Astrology
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Discover your complete cosmic blueprint with insights from Western, Vedic, Chinese astrology, Human Design, and Numerology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Natal Chart Analysis */}
          <Card className="clean-card p-6 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Sun className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Natal Chart Analysis</CardTitle>
              <CardDescription className="text-purple-200">
                Complete birth chart interpretation across multiple systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Western tropical astrology</li>
                <li>• Vedic sidereal calculations</li>
                <li>• Chinese zodiac integration</li>
                <li>• Planetary aspects & houses</li>
              </ul>
              <Badge className="mt-4 bg-purple-400/20 text-purple-300 border-purple-400/30">
                Swiss Ephemeris Precision
              </Badge>
            </CardContent>
          </Card>

          {/* Complete Numerology */}
          <Card className="clean-card p-6 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Complete Numerology</CardTitle>
              <CardDescription className="text-purple-200">
                Life path, destiny, soul urge, and personality analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Life path number calculation</li>
                <li>• Destiny number insights</li>
                <li>• Soul urge revelations</li>
                <li>• Personality number traits</li>
              </ul>
              <Badge className="mt-4 bg-purple-400/20 text-purple-300 border-purple-400/30">
                Traditional Methods
              </Badge>
            </CardContent>
          </Card>

          {/* Daily Guidance */}
          <Card className="clean-card p-6 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Daily Guidance</CardTitle>
              <CardDescription className="text-purple-200">
                Personalized daily insights with optimal timing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Daily planetary transits</li>
                <li>• Lucky numbers & colors</li>
                <li>• Optimal activity timing</li>
                <li>• Energy flow forecasts</li>
              </ul>
              <Badge className="mt-4 bg-pink-400/20 text-pink-300 border-pink-400/30">
                Real-time Updates
              </Badge>
            </CardContent>
          </Card>

          {/* Human Design */}
          <Card className="clean-card p-6 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <User className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white">Human Design</CardTitle>
              <CardDescription className="text-purple-200">
                Complete Human Design chart with strategy and authority
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Type and strategy identification</li>
                <li>• Authority decision-making</li>
                <li>• Centers and channels</li>
                <li>• Profile and incarnation cross</li>
              </ul>
              <Badge className="mt-4 bg-green-400/20 text-green-300 border-green-400/30">
                Modern Synthesis
              </Badge>
            </CardContent>
          </Card>

        </div>

        <div className="mt-16 text-center">
          <div className="p-8 bg-black/30 rounded-xl border border-purple-400/20">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to explore your cosmic blueprint?</h3>
            <p className="text-purple-200 mb-6">Get comprehensive personal insights across all major astrological systems</p>
            <button className="clean-button px-8 py-3">
              Create Your Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}