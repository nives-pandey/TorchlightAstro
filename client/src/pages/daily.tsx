import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DailyGuidance from "@/components/daily-guidance";
import { 
  Satellite, 
  Scroll, 
  Clock, 
  Star, 
  Moon, 
  Eye,
  Calendar,
  Bell,
  Heart,
  Briefcase,
  Dumbbell,
  Lightbulb
} from "lucide-react";

export default function Daily() {
  const [selectedUserId] = useState(1); // In real app, get from auth context
  const today = new Date().toISOString().split('T')[0];

  const { data: dailyGuidance, isLoading, error } = useQuery({
    queryKey: ['/api/daily-guidance', selectedUserId, today],
    enabled: !!selectedUserId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4 bg-gray-800" />
            <Skeleton className="h-6 w-[600px] mx-auto bg-gray-800" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 bg-gray-800" />
              <Skeleton className="h-64 bg-gray-800" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 bg-gray-800" />
              <Skeleton className="h-32 bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="sanctuary-card border-red-500/20">
            <CardContent className="p-8 text-center">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Daily Guidance</h2>
              <p className="text-gray-400 mb-6">
                We couldn't retrieve your cosmic guidance for today. Please ensure your birth data is complete.
              </p>
              <Button className="sanctuary-button">
                Update Birth Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!dailyGuidance) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="sanctuary-card">
            <CardContent className="p-8 text-center">
              <div className="text-yellow-600 text-6xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold text-white mb-4">Create Your Birth Chart First</h2>
              <p className="text-gray-400 mb-6">
                To receive personalized daily guidance, we need your birth information to calculate your cosmic profile.
              </p>
              <Button className="sanctuary-button">
                Create Birth Chart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const lifeAreas = [
    {
      icon: Heart,
      title: "Love & Relationships",
      content: dailyGuidance.horoscope.love,
      color: "text-pink-400"
    },
    {
      icon: Briefcase,
      title: "Career & Finance",
      content: dailyGuidance.horoscope.career,
      color: "text-green-400"
    },
    {
      icon: Dumbbell,
      title: "Health & Wellness", 
      content: dailyGuidance.horoscope.health,
      color: "text-blue-400"
    },
    {
      icon: Lightbulb,
      title: "Personal Growth",
      content: dailyGuidance.horoscope.growth,
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Daily Cosmic Guidance
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-4">
            Personalized insights based on current planetary transits and your unique astrological blueprint.
          </p>
          <div className="text-yellow-600 font-medium">{currentDate}</div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Transits */}
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-yellow-600 flex items-center">
                  <Satellite className="mr-2 h-5 w-5" />
                  Current Planetary Transits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {dailyGuidance.transits.map((transit: any, index: number) => (
                    <div key={index} className="bg-black/30 rounded-lg p-4 border border-yellow-600/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{transit.planet} {transit.sign}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            transit.timing === 'peak today' ? 'border-yellow-600 text-yellow-600' :
                            transit.timing === 'continuing' ? 'border-blue-400 text-blue-400' :
                            'border-gray-500 text-gray-500'
                          }`}
                        >
                          {transit.timing}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{transit.influence}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Daily Horoscope */}
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-yellow-600 flex items-center">
                  <Scroll className="mr-2 h-5 w-5" />
                  Your Daily Horoscope
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* General Overview */}
                <div>
                  <h4 className="text-white font-medium mb-3">Overall Energy</h4>
                  <p className="text-gray-400 leading-relaxed">
                    {dailyGuidance.horoscope.overall}
                  </p>
                </div>
                
                {/* Life Areas */}
                <div className="grid md:grid-cols-2 gap-6">
                  {lifeAreas.map((area, index) => (
                    <div key={index}>
                      <h4 className="text-yellow-600 font-medium mb-3 flex items-center">
                        <area.icon className={`mr-2 h-4 w-4 ${area.color}`} />
                        {area.title}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {area.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Today's Sidebar */}
          <div className="space-y-6">
            {/* Optimal Timing */}
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-yellow-600 flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Optimal Timing Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Best Time</div>
                      <div className="text-gray-400 text-sm">Important decisions</div>
                    </div>
                    <div className="text-yellow-600 font-bold">{dailyGuidance.optimalTiming.best}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Avoid</div>
                      <div className="text-gray-400 text-sm">Conflicts, purchases</div>
                    </div>
                    <div className="text-red-400 font-bold">{dailyGuidance.optimalTiming.avoid}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Social</div>
                      <div className="text-gray-400 text-sm">Networking, calls</div>
                    </div>
                    <div className="text-green-400 font-bold">{dailyGuidance.optimalTiming.social}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Lucky Elements */}
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-yellow-600 flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Today's Lucky Elements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-white font-medium mb-2">Colors</div>
                    <div className="flex space-x-2">
                      {dailyGuidance.luckyElements.colors.map((color: string, index: number) => (
                        <div 
                          key={index}
                          className={`w-6 h-6 rounded-full border border-yellow-600/30 ${
                            color === 'blue' ? 'bg-blue-600' :
                            color === 'gold' ? 'bg-yellow-600' :
                            color === 'green' ? 'bg-green-600' :
                            color === 'red' ? 'bg-red-600' :
                            color === 'purple' ? 'bg-yellow-600' :
                            'bg-gray-600'
                          }`}
                          title={color}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">Numbers</div>
                    <div className="text-yellow-600">{dailyGuidance.luckyElements.numbers.join(', ')}</div>
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">Direction</div>
                    <div className="text-yellow-600">{dailyGuidance.luckyElements.direction}</div>
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">Element Focus</div>
                    <div className="text-yellow-600">{dailyGuidance.luckyElements.element}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Moon Phase */}
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-yellow-600 flex items-center">
                  <Moon className="mr-2 h-5 w-5" />
                  Current Moon Phase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl mb-2">🌗</div>
                  <div className="text-white font-medium">Last Quarter</div>
                  <div className="text-gray-400 text-sm mb-4">62% Illuminated</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Time for release and letting go. Perfect for clearing out what no longer serves you 
                    and making space for new opportunities.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-yellow-600">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-yellow-600/20 hover:border-yellow-600 hover:bg-yellow-600/10"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="text-white font-medium">View Full Chart</div>
                      <div className="text-gray-400 text-sm">Complete natal analysis</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-yellow-600/20 hover:border-yellow-600 hover:bg-yellow-600/10"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="text-white font-medium">Weekly Forecast</div>
                      <div className="text-gray-400 text-sm">7-day cosmic outlook</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-yellow-600/20 hover:border-yellow-600 hover:bg-yellow-600/10"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="text-white font-medium">Transit Alerts</div>
                      <div className="text-gray-400 text-sm">Important upcoming aspects</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
