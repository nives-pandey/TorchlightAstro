import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sun, Moon, ArrowUp, Calendar, Heart, Briefcase, Gem, Users, Star, TrendingUp, Eye } from "lucide-react";
import { Link } from "wouter";
import MobileNavigation from "@/components/mobile-navigation";

interface PersonalizedDashboardProps {
  chartData: any;
  userData: any;
}

export default function PersonalizedDashboard({ chartData, userData }: PersonalizedDashboardProps) {
  const [selectedSystem, setSelectedSystem] = useState('western');

  // Extract key information from chart data
  const getPersonalizedGreeting = () => {
    const timeOfDay = new Date().getHours();
    const greeting = timeOfDay < 12 ? "Good morning" : timeOfDay < 18 ? "Good afternoon" : "Good evening";
    return `${greeting}, ${userData?.firstName || 'Beautiful Soul'}`;
  };

  const getBigThree = () => {
    if (!chartData?.systems?.western) return null;
    return {
      sun: chartData.systems.western.sign || 'Leo',
      moon: chartData.systems.western.moonSign || 'Cancer', 
      rising: chartData.systems.western.ascendant || 'Virgo'
    };
  };

  const getDailyGuidance = () => {
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return {
      date: today,
      message: `The Moon is in Aries today, activating your house of transformation. You may feel a surge of creative energy and desire for new beginnings. Trust your intuition and take inspired action.`,
      energy: 85,
      focus: "Creative Expression",
      luckyColor: "Deep Teal",
      crystalRecommendation: "Amethyst"
    };
  };

  const bigThree = getBigThree();
  const dailyGuidance = getDailyGuidance();

  return (
    <>
      <MobileNavigation />
      <div className="min-h-screen p-4 pt-20" style={{background: 'var(--wellness-gradient-1)'}}>
        <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Personalized Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {getPersonalizedGreeting()} ✨
          </h1>
          <p className="text-white/70 text-sm md:text-base">
            Your personal cosmic dashboard • Updated daily with fresh insights
          </p>
        </div>

        {/* Big Three Section */}
        {bigThree && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5" style={{color: 'hsl(44, 45%, 65%)'}} />
                Your Cosmic Big Three
              </CardTitle>
              <CardDescription className="text-white/60">
                The core of your astrological identity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-white/5 rounded-lg border border-white/20">
                  <Sun className="w-6 h-6 mx-auto mb-2" style={{color: 'hsl(180, 25%, 55%)'}} />
                  <h3 className="font-medium text-white text-sm">Sun Sign</h3>
                  <p className="text-lg font-semibold text-white">{bigThree.sun}</p>
                  <p className="text-xs text-white/60">Core identity</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg border border-white/20">
                  <Moon className="w-6 h-6 mx-auto mb-2" style={{color: 'hsl(180, 25%, 55%)'}} />
                  <h3 className="font-medium text-white text-sm">Moon Sign</h3>
                  <p className="text-lg font-semibold text-white">{bigThree.moon}</p>
                  <p className="text-xs text-white/60">Emotional nature</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg border border-white/20">
                  <ArrowUp className="w-6 h-6 mx-auto mb-2" style={{color: 'hsl(180, 25%, 55%)'}} />
                  <h3 className="font-medium text-white text-sm">Rising Sign</h3>
                  <p className="text-lg font-semibold text-white">{bigThree.rising}</p>
                  <p className="text-xs text-white/60">How others see you</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Cosmic Weather */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{color: 'hsl(44, 45%, 65%)'}} />
              Today's Cosmic Weather
            </CardTitle>
            <CardDescription className="text-white/60">
              {dailyGuidance.date} • Personalized for your chart
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white leading-relaxed">
              {dailyGuidance.message}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-xs text-white/60 uppercase tracking-wide">Energy Level</p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={dailyGuidance.energy} className="flex-1" />
                  <span className="text-white font-bold">{dailyGuidance.energy}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/60 uppercase tracking-wide">Focus Area</p>
                <p className="text-white font-medium">{dailyGuidance.focus}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/60 uppercase tracking-wide">Lucky Color</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: 'hsl(180, 25%, 55%)'}}></div>
                  <span className="text-white font-medium">{dailyGuidance.luckyColor}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/60 uppercase tracking-wide">Crystal</p>
                <p className="text-white font-medium">{dailyGuidance.crystalRecommendation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Teasers - Guided Exploration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link href="/gemstone-energy-pairing">
            <Card className="group cursor-pointer bg-white/5 border-white/10 backdrop-blur-md hover:border-teal-400/50 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <Gem className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" style={{color: 'hsl(180, 25%, 55%)'}} />
                <h3 className="font-medium text-white mb-1 text-sm">Gemstone Guidance</h3>
                <p className="text-xs text-white/60">Discover your perfect crystal matches</p>
                <Badge variant="outline" className="mt-2 border-white/30 text-xs" style={{color: 'hsl(44, 45%, 65%)'}}>
                  Explore Now
                </Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/compatibility">
            <Card className="group cursor-pointer bg-white/5 border-white/10 backdrop-blur-md hover:border-teal-400/50 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" style={{color: 'hsl(180, 25%, 55%)'}} />
                <h3 className="font-medium text-white mb-1 text-sm">Love Compatibility</h3>
                <p className="text-xs text-white/60">Explore relationship harmony</p>
                <Badge variant="outline" className="mt-2 border-white/30 text-xs" style={{color: 'hsl(44, 45%, 65%)'}}>
                  Find Love
                </Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/business">
            <Card className="group cursor-pointer bg-white/5 border-white/10 backdrop-blur-md hover:border-teal-400/50 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <Briefcase className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" style={{color: 'hsl(180, 25%, 55%)'}} />
                <h3 className="font-medium text-white mb-1 text-sm">Career Insights</h3>
                <p className="text-xs text-white/60">Unlock your professional path</p>
                <Badge variant="outline" className="mt-2 border-white/30 text-xs" style={{color: 'hsl(44, 45%, 65%)'}}>
                  Grow Career
                </Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/system-comparison">
            <Card className="group cursor-pointer bg-white/5 border-white/10 backdrop-blur-md hover:border-teal-400/50 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" style={{color: 'hsl(180, 25%, 55%)'}} />
                <h3 className="font-medium text-white mb-1 text-sm">Deep Analysis</h3>
                <p className="text-xs text-white/60">Compare all 10 systems</p>
                <Badge variant="outline" className="mt-2 border-white/30 text-xs" style={{color: 'hsl(44, 45%, 65%)'}}>
                  Deep Dive
                </Badge>
              </CardContent>
            </Card>
          </Link>

        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm"
          >
            <TrendingUp className="w-4 h-4 mr-2" style={{color: 'hsl(44, 45%, 65%)'}} />
            View Full Report
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm"
          >
            <Users className="w-4 h-4 mr-2" style={{color: 'hsl(44, 45%, 65%)'}} />
            Share with Friends
          </Button>
        </div>

        {/* Tomorrow's Preview */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardContent className="p-4 text-center">
            <h3 className="text-white font-medium mb-2 text-sm">Tomorrow's Preview</h3>
            <p className="text-white/80 text-sm">
              Venus enters your 5th house of creativity. Expect increased artistic inspiration and romantic opportunities.
            </p>
            <p className="text-xs text-white/60 mt-2">
              Come back tomorrow for your fresh cosmic weather report ✨
            </p>
          </CardContent>
        </Card>

        </div>
      </div>
    </>
  );
}