export default function PlanetarySymbols() {
  const symbols = ["☉", "☽", "☿", "♀", "♂", "♃", "♄", "♅", "♆", "♇"];
  
  return (
    <div className="flex justify-center items-center space-x-6 mb-12">
      {symbols.map((symbol, index) => (
        <span 
          key={index}
          className="planet-symbol text-2xl md:text-3xl"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
}
