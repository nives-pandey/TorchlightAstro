import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartResults from "@/components/chart-results";
import { Link } from "wouter";
import { Home, User, Calendar, Stars } from "lucide-react";

export default function DemoChart() {
  const [showChart, setShowChart] = useState(false);

  // Demo data to show chart functionality
  const demoData = {
    firstName: "Maria",
    lastName: "Santos", 
    birthDate: "1995-05-15",
    birthTime: "14:30",
    birthCity: "Manila",
    timezone: "Asia/Manila",
    gender: "female",
    generated: new Date().toISOString(),
    systems: {
      western: {
        sign: "Taurus",
        element: "Earth",
        analysis: "Complete natal chart analysis with planetary aspects and house positions"
      },
      vedic: {
        rashi: "Aries", 
        nakshatra: "Rohini",
        analysis: "Detailed Jyotish analysis with dasha periods and remedies"
      },
      chinese: {
        animal: "Pig",
        element: "Wood",
        analysis: "Five element theory with compatibility and fortune insights"
      },
      numerology: {
        lifePath: 8,
        destiny: 11,
        analysis: "Complete numerological profile with personal year cycles"
      },
      humanDesign: {
        type: "Generator",
        strategy: "Respond to life",
        analysis: "Energy type analysis with decision-making strategy"
      }
    },
    predictions: {
      love: "Strong romantic connections and emotional growth opportunities ahead",
      career: "Leadership opportunities and creative projects will flourish", 
      health: "Focus on balance and stress management for optimal well-being",
      finances: "Steady growth through careful planning and wise investments"
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              ✨ Chart Output Demo ✨
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              This demonstrates the comprehensive astrological analysis you get after completing the birth form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-purple-800/40 border-purple-400/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Info
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200">
                <p>Name: {demoData.firstName} {demoData.lastName}</p>
                <p>Birth: {new Date(demoData.birthDate).toLocaleDateString()}</p>
                <p>Location: {demoData.birthCity}</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-800/40 border-purple-400/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Systems Analyzed
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200">
                <p>• Western Astrology</p>
                <p>• Vedic (Jyotish)</p>
                <p>• Chinese Zodiac</p>
                <p>• Numerology</p>
                <p>• Human Design</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-800/40 border-purple-400/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Stars className="mr-2 h-5 w-5" />
                  Results Include
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200">
                <p>• Personality Analysis</p>
                <p>• Love & Relationships</p>
                <p>• Career Guidance</p>
                <p>• Health Insights</p>
                <p>• Future Predictions</p>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={() => setShowChart(true)}
            className="cosmic-button text-lg px-8 py-4"
          >
            View Sample Chart Results
          </Button>

          <p className="text-gray-400 mt-4 text-sm">
            This is what you'll see after completing the birth form on the main page.
          </p>
        </div>
      </main>

      {showChart && (
        <ChartResults 
          data={demoData} 
          onClose={() => setShowChart(false)}
        />
      )}
    </div>
  );
}