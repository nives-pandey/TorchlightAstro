import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Satellite, 
  Clock, 
  Star, 
  Moon, 
  Heart,
  Briefcase,
  Dumbbell,
  Lightbulb,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

interface DailyGuidanceProps {
  guidance: {
    date: string;
    horoscope: {
      overall: string;
      love: string;
      career: string;
      health: string;
      growth: string;
    };
    transits: Array<{
      planet: string;
      sign?: string;
      aspect?: string;
      timing: string;
      influence: string;
    }>;
    optimalTiming: {
      best: string;
      avoid: string;
      social: string;
    };
    luckyElements: {
      colors: string[];
      numbers: number[];
      direction: string;
      element: string;
    };
  };
  compact?: boolean;
}

export default function DailyGuidance({ guidance, compact = false }: DailyGuidanceProps) {
  const lifeAreas = [
    {
      icon: Heart,
      title: "Love & Relationships",
      content: guidance.horoscope.love,
      color: "text-pink-400"
    },
    {
      icon: Briefcase,
      title: "Career & Finance",
      content: guidance.horoscope.career,
      color: "text-green-400"
    },
    {
      icon: Dumbbell,
      title: "Health & Wellness",
      content: guidance.horoscope.health,
      color: "text-blue-400"
    },
    {
      icon: Lightbulb,
      title: "Personal Growth",
      content: guidance.horoscope.growth,
      color: "text-purple-400"
    }
  ];

  if (compact) {
    return (
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="text-purple-500 text-lg">Today's Cosmic Energy</CardTitle>
          <CardDescription className="text-gray-400">
            {new Date(guidance.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            {guidance.horoscope.overall}
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {lifeAreas.slice(0, 4).map((area, index) => (
              <div key={index} className="text-center">
                <area.icon className={`h-5 w-5 mx-auto mb-1 ${area.color}`} />
                <div className="text-white text-xs font-medium">{area.title.split(' ')[0]}</div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs">
            <div>
              <span className="text-gray-400">Best Time:</span>
              <span className="text-purple-500 ml-1">{guidance.optimalTiming.best}</span>
            </div>
            <div>
              <span className="text-gray-400">Lucky:</span>
              <span className="text-purple-500 ml-1">{guidance.luckyElements.numbers[0]}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Transits */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="text-purple-500 flex items-center">
            <Satellite className="mr-2 h-5 w-5" />
            Active Planetary Transits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {guidance.transits.map((transit, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-purple-500/10">
                <div className="flex-1">
                  <div className="text-white font-medium">
                    {transit.planet} {transit.sign} {transit.aspect}
                  </div>
                  <div className="text-gray-400 text-sm">{transit.influence}</div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`ml-3 ${
                    transit.timing.includes('peak') ? 'border-purple-500 text-purple-500' :
                    transit.timing.includes('continuing') ? 'border-blue-400 text-blue-400' :
                    transit.timing.includes('waning') ? 'border-gray-500 text-gray-500' :
                    'border-green-400 text-green-400'
                  }`}
                >
                  {transit.timing}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Life Areas Horoscope */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="text-purple-500">Daily Life Areas</CardTitle>
          <CardDescription className="text-gray-400">
            Cosmic guidance for different aspects of your day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {lifeAreas.map((area, index) => (
              <div key={index} className="space-y-2">
                <h4 className="text-white font-medium flex items-center">
                  <area.icon className={`mr-2 h-4 w-4 ${area.color}`} />
                  {area.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed pl-6">
                  {area.content}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timing and Lucky Elements Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Optimal Timing */}
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="text-purple-500 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Optimal Timing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <div>
                <div className="text-white font-medium">Best: {guidance.optimalTiming.best}</div>
                <div className="text-gray-400 text-sm">Important decisions & meetings</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <div>
                <div className="text-white font-medium">Avoid: {guidance.optimalTiming.avoid}</div>
                <div className="text-gray-400 text-sm">Conflicts & major purchases</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Heart className="h-4 w-4 text-pink-400" />
              <div>
                <div className="text-white font-medium">Social: {guidance.optimalTiming.social}</div>
                <div className="text-gray-400 text-sm">Networking & communication</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lucky Elements */}
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="text-purple-500 flex items-center">
              <Star className="mr-2 h-5 w-5" />
              Lucky Elements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-white font-medium mb-2">Beneficial Colors</div>
              <div className="flex space-x-2">
                {guidance.luckyElements.colors.map((color, index) => (
                  <div 
                    key={index}
                    className={`w-6 h-6 rounded-full border border-purple-500/30 ${
                      color === 'blue' ? 'bg-blue-600' :
                      color === 'gold' || color === 'yellow' ? 'bg-purple-500' :
                      color === 'green' ? 'bg-green-600' :
                      color === 'red' ? 'bg-red-600' :
                      color === 'purple' ? 'bg-purple-600' :
                      color === 'white' ? 'bg-purple-100/20 border-purple-400/30' :
                      'bg-gray-600'
                    }`}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white font-medium">Numbers</div>
                <div className="text-purple-500">{guidance.luckyElements.numbers.join(', ')}</div>
              </div>
              <div>
                <div className="text-white font-medium">Direction</div>
                <div className="text-purple-500">{guidance.luckyElements.direction}</div>
              </div>
            </div>
            <div>
              <div className="text-white font-medium">Element Focus</div>
              <div className="text-purple-500">{guidance.luckyElements.element}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
