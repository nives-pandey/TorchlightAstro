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
    <Card className="cosmic-card">
      <CardHeader>
        <CardTitle className="text-yellow-500">Planetary Symbols</CardTitle>
        <CardDescription className="text-gray-400">
          Understanding the cosmic influences in your chart
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {planets.map((planet) => (
            <div key={planet.name} className="flex items-center space-x-3 p-2 rounded-lg bg-black/20">
              <div className="text-2xl text-yellow-500">{planet.symbol}</div>
              <div>
                <div className="text-white font-medium">{planet.name}</div>
                <div className="text-gray-400 text-sm">{planet.meaning}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}