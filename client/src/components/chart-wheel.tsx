import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartWheelProps {
  chartData: {
    user: {
      name: string;
      birthDate: string;
      location: string;
    };
    planets: Record<string, {
      sign: string;
      degree: number;
      house: number;
      symbol: string;
    }>;
    houses: Record<string, {
      sign: string;
      degree: number;
    }>;
  };
}

export default function ChartWheel({ chartData }: ChartWheelProps) {
  const planetPositions = [
    { symbol: "☉", position: "top-2 left-1/2 transform -translate-x-1/2", color: "text-yellow-500" },
    { symbol: "☽", position: "top-6 right-6", color: "text-blue-300" },
    { symbol: "☿", position: "right-2 top-1/2 transform -translate-y-1/2", color: "text-yellow-400" },
    { symbol: "♀", position: "bottom-6 right-6", color: "text-pink-400" },
    { symbol: "♂", position: "bottom-2 left-1/2 transform -translate-x-1/2", color: "text-red-400" },
    { symbol: "♃", position: "bottom-6 left-6", color: "text-yellow-500" },
    { symbol: "♄", position: "left-2 top-1/2 transform -translate-y-1/2", color: "text-gray-400" },
    { symbol: "♅", position: "top-6 left-6", color: "text-purple-400" },
  ];

  return (
    <Card className="cosmic-card cosmic-glow">
      <CardHeader>
        <CardTitle className="text-yellow-500 text-center">Natal Chart Wheel</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chart Wheel Visualization */}
        <div className="aspect-square bg-black/50 rounded-full border border-yellow-500/30 flex items-center justify-center relative overflow-hidden mb-6">
          {/* Chart rings */}
          <div className="absolute inset-4 border border-yellow-500/20 rounded-full"></div>
          <div className="absolute inset-8 border border-yellow-500/10 rounded-full"></div>
          
          {/* Planetary positions around the wheel */}
          {planetPositions.map((planet, index) => (
            <div 
              key={index}
              className={`absolute ${planet.position} ${planet.color} text-xl font-bold`}
              title={`${planet.symbol} - Planet position`}
            >
              {planet.symbol}
            </div>
          ))}
          
          {/* Center information */}
          <div className="text-center z-10 bg-black/60 rounded-full p-4">
            <div className="text-yellow-500 font-medium text-lg">{chartData.user.name}</div>
            <div className="text-gray-400 text-sm">{chartData.user.birthDate}</div>
            <div className="text-gray-400 text-xs">{chartData.user.location}</div>
          </div>
        </div>
        
        {/* Chart Statistics */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Sun Sign:</span>
            <span className="text-yellow-500">Capricorn ♑</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Moon Sign:</span>
            <span className="text-blue-300">Pisces ♓</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Rising Sign:</span>
            <span className="text-purple-400">Virgo ♍</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Dominant Element:</span>
            <span className="text-yellow-500">Earth</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
