import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartWheelProps {
  chartData: {
    sun: string;
    moon: string;
    rising: string;
    planets?: Record<string, { sign: string; house: number; degrees: number }>;
    houses?: Record<number, string>;
  };
}

export default function ChartWheel({ chartData }: ChartWheelProps) {
  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const planetSymbols: Record<string, string> = {
    sun: "☉",
    moon: "☽",
    mercury: "☿",
    venus: "♀",
    mars: "♂",
    jupiter: "♃",
    saturn: "♄",
    uranus: "♅",
    neptune: "♆",
    pluto: "♇"
  };

  return (
    <Card className="sanctuary-card">
      <CardHeader>
        <CardTitle className="text-yellow-600">Birth Chart Wheel</CardTitle>
        <CardDescription className="text-gray-400">
          Your cosmic blueprint at the moment of birth
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="relative w-80 h-80">
          {/* Outer circle - Zodiac signs */}
          <div className="absolute inset-0 rounded-full border-2 border-yellow-600/30 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            {/* Zodiac wheel segments */}
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {zodiacSigns.map((sign, index) => {
                const angle = (index * 30) - 90; // Start from top
                const x = 100 + 85 * Math.cos((angle * Math.PI) / 180);
                const y = 100 + 85 * Math.sin((angle * Math.PI) / 180);
                
                return (
                  <g key={sign}>
                    {/* Zodiac sign division lines */}
                    <line
                      x1="100"
                      y1="100"
                      x2={100 + 90 * Math.cos((angle * Math.PI) / 180)}
                      y2={100 + 90 * Math.sin((angle * Math.PI) / 180)}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="0.5"
                    />
                    
                    {/* Zodiac sign names */}
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-xs"
                      transform={`rotate(${angle > 90 && angle < 270 ? angle + 180 : angle}, ${x}, ${y})`}
                    >
                      {sign.slice(0, 3)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Inner circle - Houses */}
          <div className="absolute inset-4 rounded-full border border-yellow-600/50 bg-black/30">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {Array.from({ length: 12 }, (_, index) => {
                const houseNumber = index + 1;
                const angle = (index * 30) - 90;
                const x = 100 + 60 * Math.cos((angle * Math.PI) / 180);
                const y = 100 + 60 * Math.sin((angle * Math.PI) / 180);
                
                return (
                  <g key={houseNumber}>
                    {/* House division lines */}
                    <line
                      x1="100"
                      y1="100"
                      x2={100 + 75 * Math.cos((angle * Math.PI) / 180)}
                      y2={100 + 75 * Math.sin((angle * Math.PI) / 180)}
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="1"
                    />
                    
                    {/* House numbers */}
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-yellow-500 text-sm font-bold"
                    >
                      {houseNumber}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center circle - Key planets */}
          <div className="absolute inset-16 rounded-full border border-yellow-600 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 flex flex-col items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-yellow-600 text-2xl">☉</div>
              <div className="text-white text-xs">{chartData.sun}</div>
              <div className="text-yellow-500 text-xl">☽</div>
              <div className="text-white text-xs">{chartData.moon}</div>
              <div className="text-blue-400 text-lg">↗</div>
              <div className="text-white text-xs">{chartData.rising}</div>
            </div>
          </div>

          {/* Floating planet positions */}
          {chartData.planets && Object.entries(chartData.planets).map(([planet, data]) => {
            const signIndex = zodiacSigns.findIndex(sign => 
              sign.toLowerCase() === data.sign.toLowerCase()
            );
            if (signIndex === -1) return null;
            
            const baseAngle = signIndex * 30;
            const degreesInSign = data.degrees || 15; // Default to middle of sign
            const angle = baseAngle + (degreesInSign / 30) * 30 - 90;
            
            const radius = 70; // Position between houses and zodiac
            const x = 160 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 160 + radius * Math.sin((angle * Math.PI) / 180);
            
            return (
              <div
                key={planet}
                className="absolute w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-black text-sm font-bold shadow-lg"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={`${planet} in ${data.sign} (House ${data.house})`}
              >
                {planetSymbols[planet.toLowerCase()] || planet.charAt(0).toUpperCase()}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}