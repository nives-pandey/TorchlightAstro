import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars, Sparkles, Users, Calendar, Moon, Sun } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Clean Header */}
      <header className="clean-nav fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Stars className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Torchlight
            </h1>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="clean-button px-6 py-2 text-sm"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Clean Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-semibold mb-6 text-gray-900 dark:text-white leading-tight">
            Your Complete<br />Cosmic Guide
          </h2>
          <p className="text-lg md:text-xl mb-12 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            <strong className="text-blue-600 dark:text-blue-400">Torchlight</strong> illuminates your path with authentic insights from Western, Vedic, Chinese, Human Design, and Numerology systems. We provide comprehensive guidance while empowering you to make your own decisions.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 text-sm font-medium">
              Western Astrology
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 text-sm font-medium">
              Vedic Wisdom
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 text-sm font-medium">
              Chinese Zodiac
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 text-sm font-medium">
              Human Design
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 text-sm font-medium">
              Numerology
            </Badge>
          </div>
          
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="clean-button px-8 py-4 text-base font-medium"
          >
            Begin Your Journey
          </Button>
        </div>
      </section>

      {/* What is Torchlight Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-3xl md:text-4xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
            What is Torchlight?
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            A comprehensive astrological guidance system combining ancient wisdom with modern precision
          </p>
          
          <div className="clean-card p-8 md:p-12 mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
              <strong className="text-blue-600 dark:text-blue-400">Torchlight</strong> combines the wisdom of multiple ancient traditions with modern astronomical precision. Like a torch illuminating a path, we provide insights to help you navigate life's journey while preserving your autonomy to choose your direction.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Our Philosophy</h4>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong className="text-gray-900 dark:text-white">Illumination, not direction:</strong> We light your path but you choose where to walk</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong className="text-gray-900 dark:text-white">Multiple perspectives:</strong> Five ancient systems provide complete cosmic insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong className="text-gray-900 dark:text-white">Authentic calculations:</strong> Precise astronomical data, not generic horoscopes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong className="text-gray-900 dark:text-white">Personal responsibility:</strong> You maintain full control over your decisions</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">The Science</h4>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong className="text-gray-900 dark:text-white">Mathematical precision:</strong> Swiss Ephemeris calculations for accuracy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong className="text-gray-900 dark:text-white">4,000+ years of study:</strong> Time-tested patterns and correlations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong className="text-gray-900 dark:text-white">Cross-cultural validation:</strong> Consistent findings across civilizations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong className="text-gray-900 dark:text-white">No paid APIs:</strong> 100% open-source knowledge base for unlimited access</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700 dark:text-gray-300 italic text-center">
                "Astrology is not fortune-telling, but rather the illumination of natural patterns and potential paths. Your free will remains the most powerful force in shaping your destiny."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
            Comprehensive Cosmic Guidance
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Professional-grade tools for deep cosmic insights and personal growth
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Sun className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Natal Chart Analysis</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Deep insights from multiple astrological systems with authentic astronomical calculations
                </p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Planetary positions & aspects
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  House interpretations
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Cross-system comparisons
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Personality insights
                </li>
              </ul>
            </div>

            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Compatibility Analysis</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Relationship insights across all astrological systems
                </p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Multi-person compatibility
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Strengths & challenges
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Communication guidance
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Relationship timing
                </li>
              </ul>
            </div>

            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Daily Guidance</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Personalized daily insights with optimal timing recommendations
                </p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Daily horoscopes
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Lucky numbers & colors
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Optimal timing
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Auspicious activities
                </li>
              </ul>
            </div>

            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Assistant & Numerology</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Interactive cosmic guidance with complete numerology calculations
                </p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Conversational AI guidance
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Complete numerology profiles
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Life path and destiny numbers
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Personality analysis
                </li>
              </ul>
            </div>

            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Moon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lifestyle Recommendations</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Comprehensive guidance for career, health, and personal growth
                </p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Career path guidance
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Health recommendations
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Personal development
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Timing for decisions
                </li>
              </ul>
            </div>

            <div className="clean-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <Stars className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Educational Content</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Learn about astrology's scientific foundations and methodology
                </p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Scientific background
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Multiple traditions
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Calculation methods
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Historical context
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
            Ready to illuminate your path?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join thousands who have discovered deeper insights into their cosmic blueprint with Torchlight's comprehensive astrological guidance.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="clean-button px-8 py-4 text-base font-medium"
          >
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
}