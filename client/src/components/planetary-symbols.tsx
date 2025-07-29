import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlanetarySymbols() {
  const planets = [
    { name: "Sun", symbol: "☉", meaning: "Self, ego, vitality" },
    { name: "Moon", symbol: "☽", meaning: "Emotions, instincts, subconscious" },
    { name: "Mercury", symbol: "☿", meaning: "Communication, intellect, logic" },
    { name: "Venus", symbol: "♀", meaning: "Love, beauty, relationships" },
    { name: "Mars", symbol: "♂", meaning: "Action, courage, aggression" },
    { name: "Jupiter", symbol: "♃", meaning: "Expansion, wisdom, luck" },
    { name: "Saturn", symbol: "♄", meaning: "Structure, discipline, lessons" },
    { name: "Uranus", symbol: "♅", meaning: "Innovation, rebellion, change" },
    { name: "Neptune", symbol: "♆", meaning: "Dreams, spirituality, illusion" },
    { name: "Pluto", symbol: "♇", meaning: "Transformation, power, rebirth" }
  ];

  return (
    <div className="bg-purple-900/30 backdrop-blur-sm border border-pink-300/30 rounded-2xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2" 
            style={{
              color: 'hsl(51, 100%, 65%)',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}>Planetary Symbols</h3>
        <p className="text-sm" 
           style={{
             color: 'hsl(240, 100%, 94%)', 
             opacity: 0.8
           }}>
          Understanding the cosmic influences in your chart
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {planets.map((planet) => (
          <div key={planet.name} className="flex items-center space-x-3 p-2 rounded-lg bg-purple-900/30">
            <div className="text-2xl" style={{color: 'hsl(51, 100%, 65%)'}}>{planet.symbol}</div>
            <div>
              <div className="font-medium text-sm" style={{color: 'hsl(240, 100%, 94%)'}}>{planet.name}</div>
              <div className="text-xs" style={{color: 'hsl(240, 100%, 94%)', opacity: 0.7}}>{planet.meaning}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}