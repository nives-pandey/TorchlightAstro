import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars, Sparkles, Users, Calendar, Moon, Sun } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Stars className="h-8 w-8 text-yellow-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Torchlight
          </h1>
        </div>
        <Button 
          onClick={() => window.location.href = '/api/login'}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Sign In
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Complete Cosmic Guide
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-purple-200">
            Discover authentic insights from Western, Vedic, Chinese, and Human Design astrology 
            with comprehensive lifestyle recommendations for personal growth and decision-making.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge variant="outline" className="border-yellow-400 text-yellow-400 px-4 py-2">
              Western Astrology
            </Badge>
            <Badge variant="outline" className="border-purple-400 text-purple-400 px-4 py-2">
              Vedic Wisdom
            </Badge>
            <Badge variant="outline" className="border-pink-400 text-pink-400 px-4 py-2">
              Chinese Zodiac
            </Badge>
            <Badge variant="outline" className="border-blue-400 text-blue-400 px-4 py-2">
              Human Design
            </Badge>
          </div>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 text-lg"
          >
            Begin Your Journey
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          Comprehensive Cosmic Guidance
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-purple-800/30 border-purple-600 backdrop-blur-sm">
            <CardHeader>
              <Sun className="h-12 w-12 text-yellow-400 mb-4" />
              <CardTitle className="text-white">Natal Chart Analysis</CardTitle>
              <CardDescription className="text-purple-200">
                Deep insights from multiple astrological systems with authentic astronomical calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-purple-100">
              <ul className="space-y-2">
                <li>• Planetary positions & aspects</li>
                <li>• House interpretations</li>
                <li>• Cross-system comparisons</li>
                <li>• Personality insights</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-800/30 border-blue-600 backdrop-blur-sm">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Compatibility Analysis</CardTitle>
              <CardDescription className="text-blue-200">
                Relationship insights across all four astrological systems
              </CardDescription>
            </CardHeader>
            <CardContent className="text-blue-100">
              <ul className="space-y-2">
                <li>• Multi-person compatibility</li>
                <li>• Strengths & challenges</li>
                <li>• Communication guidance</li>
                <li>• Relationship timing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-pink-800/30 border-pink-600 backdrop-blur-sm">
            <CardHeader>
              <Calendar className="h-12 w-12 text-pink-400 mb-4" />
              <CardTitle className="text-white">Daily Guidance</CardTitle>
              <CardDescription className="text-pink-200">
                Personalized daily insights with optimal timing recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-pink-100">
              <ul className="space-y-2">
                <li>• Daily horoscopes</li>
                <li>• Lucky numbers & colors</li>
                <li>• Optimal timing</li>
                <li>• Auspicious activities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-green-800/30 border-green-600 backdrop-blur-sm">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-green-400 mb-4" />
              <CardTitle className="text-white">Lifestyle Recommendations</CardTitle>
              <CardDescription className="text-green-200">
                Comprehensive guidance for career, health, and personal growth
              </CardDescription>
            </CardHeader>
            <CardContent className="text-green-100">
              <ul className="space-y-2">
                <li>• Career guidance</li>
                <li>• Beneficial foods & stones</li>
                <li>• Lucky numbers & dates</li>
                <li>• Items to avoid</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-orange-800/30 border-orange-600 backdrop-blur-sm">
            <CardHeader>
              <Moon className="h-12 w-12 text-orange-400 mb-4" />
              <CardTitle className="text-white">System Comparisons</CardTitle>
              <CardDescription className="text-orange-200">
                Find common patterns and unique insights across all traditions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-orange-100">
              <ul className="space-y-2">
                <li>• Cross-system analysis</li>
                <li>• Common patterns</li>
                <li>• Unique perspectives</li>
                <li>• Synthesized wisdom</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-indigo-800/30 border-indigo-600 backdrop-blur-sm">
            <CardHeader>
              <Stars className="h-12 w-12 text-indigo-400 mb-4" />
              <CardTitle className="text-white">Life Guidance</CardTitle>
              <CardDescription className="text-indigo-200">
                Comprehensive support for anyone seeking authentic astrological insights
              </CardDescription>
            </CardHeader>
            <CardContent className="text-indigo-100">
              <ul className="space-y-2">
                <li>• Career and life direction</li>
                <li>• Personal balance</li>
                <li>• Decision timing</li>
                <li>• Stress management</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-4xl font-bold mb-6">
            Start Your Cosmic Journey Today
          </h3>
          <p className="text-xl text-purple-200 mb-8">
            Join thousands who trust Torchlight for authentic astrological guidance 
            that integrates seamlessly with modern life and personal growth.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-purple-800">
        <div className="flex justify-center items-center">
          <p className="text-purple-300">
            © 2025 Torchlight. Authentic cosmic guidance for personal enlightenment and growth.
          </p>
        </div>
      </footer>
    </div>
  );
}