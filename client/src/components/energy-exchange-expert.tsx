import React, { useState } from 'react';
import clsx from 'clsx';

// =============================================================================
// The Complete Contribution Component
// =============================================================================

// --- Data Store ---
const sacredTiers = [
  { amount: 1, name: 'The Spark', significance: 'Represents unity, new beginnings, and the singular source of all creation.' },
  { amount: 3, name: 'The Catalyst', significance: 'The number of creativity, communication, and growth.' },
  { amount: 5, name: 'The Adventurer', significance: 'Represents freedom, curiosity, and dynamic change.' },
  { amount: 7, name: 'The Seeker', significance: 'The number of spiritual seeking, introspection, and inner wisdom.' },
  { amount: 9, name: 'The Humanitarian', significance: 'Represents universal love, compassion, and completion.' },
  { amount: 11, name: 'The Intuitive', significance: 'A Master Number of spiritual insight and enlightenment.', popular: true },
  { amount: 22, name: 'The Master Builder', significance: 'A Master Number with the power to turn spiritual dreams into tangible reality.' },
  { amount: 33, name: 'The Master Teacher', significance: 'A Master Number representing spiritual guidance and healing.' },
  { amount: 108, name: 'The Sacred Mala', significance: 'A highly sacred number representing the wholeness of existence.' },
  { amount: 1008, name: 'The Abundant Universe', significance: 'Signifying immense abundance and spiritual completion.' },
];
const wheelTiers = [3, 5, 7, 9, 11, 22, 33];

// --- Sub-Components ---
const CosmicWheel = ({ onSpinComplete }: { onSpinComplete: (amount: number) => void }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinResult, setSpinResult] = useState<number | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    setSpinResult(null);
    setIsSpinning(true);

    // More rotations for a better visual effect
    const randomRotations = 5 + Math.floor(Math.random() * 5); 
    const finalAngle = Math.floor(Math.random() * 360);
    const totalRotation = (randomRotations * 360) + finalAngle;
    
    // Set the visual rotation immediately
    setRotation(totalRotation);

    // After the animation, calculate the result based on the final angle
    setTimeout(() => {
      const segmentAngle = 360 / wheelTiers.length;
      
      // The pointer is at the top (270 degrees in SVG's coordinate system).
      // We need to find which segment lands at the pointer.
      // The angle of the segment that lands at the top is `(360 - (totalRotation % 360)) % 360`.
      // We add 270 and normalize to align with SVG's 0-degree point at the right.
      const landingAngle = (270 + (360 - (totalRotation % 360))) % 360;

      const selectedIndex = Math.floor(landingAngle / segmentAngle);
      const selectedAmount = wheelTiers[selectedIndex];
      
      onSpinComplete(selectedAmount);
      setSpinResult(selectedAmount);
      setIsSpinning(false);
    }, 4000); // This must match the CSS animation duration
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", x, y,
        "Z"
    ].join(" ");
    return d;       
  };

  const segmentAngle = 360 / wheelTiers.length;

  return (
    <div className="text-center p-4 border-b border-border/20">
      <h3 className="text-lg font-semibold mb-4">Let the Universe Guide You</h3>
      <div className="relative w-[220px] h-[220px] mx-auto mb-4">
        <div 
          className="absolute inset-0 transition-transform duration-[4000ms] ease-[cubic-bezier(0.25,1,0.5,1)]" 
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 220 220" className="w-full h-full">
            {wheelTiers.map((tier, index) => {
              const textAngle = (index * segmentAngle) + (segmentAngle / 2);
              const textPosition = polarToCartesian(110, 110, 80, textAngle);
              return (
                <g key={tier}>
                  <path 
                    d={describeArc(110, 110, 110, index * segmentAngle, (index + 1) * segmentAngle)} 
                    className={clsx(index % 2 === 0 ? 'fill-card' : 'fill-background', 'stroke-muted-foreground/50')} 
                  />
                  <text 
                    x={textPosition.x} 
                    y={textPosition.y}
                    transform={`rotate(${textAngle + 90}, ${textPosition.x}, ${textPosition.y})`}
                    className="fill-foreground font-semibold text-base" 
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    ${tier}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 text-primary text-2xl">▼</div>
      </div>
      <button onClick={handleSpin} disabled={isSpinning} className="bg-primary text-primary-foreground font-semibold py-2 px-6 rounded-xl disabled:opacity-70">
        {isSpinning ? 'Spinning...' : 'Spin the Wheel of Intention'}
      </button>
      {spinResult && (
        <p className="text-muted-foreground text-sm mt-4 font-serif">
          The wheel suggests an energy exchange of <strong className="text-primary">${spinResult}</strong>. This is just a guide—please choose any amount that feels right.
        </p>
      )}
    </div>
  );
};

const EnergyExchange = ({ onContribute }: { onContribute: () => void }) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(11);
  const [customAmount, setCustomAmount] = useState('');

  const handleSpinComplete = (amount: number) => { setSelectedTier(amount); setCustomAmount(''); };
  const handleTierSelect = (amount: number) => { setSelectedTier(amount); setCustomAmount(''); };
  const handleCustomSelect = () => { setSelectedTier(null); };

  return (
    <div className="max-w-md mx-auto p-4 rounded-xl bg-background">
      <div className="text-center mb-6">
        <h3 className="font-semibold text-foreground">Why Your Support Matters</h3>
        <div className="text-muted-foreground text-sm mt-2 font-serif space-y-4">
            <p>From ancient times, wisdom was shared freely. Those who found value would contribute based on their ability, creating a sacred exchange. We are bringing this philosophy forward. <strong>Torchlight will always be free.</strong></p>
            <p>If you find value in our work, your contribution honors the thousands of hours our small team invests in research and technology. It allows us to keep this sanctuary independent and ad-free for generations to come.</p>
        </div>
      </div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Join the Energy Exchange</h2>
      </div>
      <CosmicWheel onSpinComplete={handleSpinComplete} />
      <div className="mt-6 space-y-2">
        {sacredTiers.map((tier) => (
          <div
            key={tier.amount}
            className={clsx(
              'p-4 border rounded-xl cursor-pointer transition-all',
              selectedTier === tier.amount
                ? 'border-primary shadow-lg shadow-primary/20 bg-card'
                : 'border-border/30'
            )}
            onClick={() => handleTierSelect(tier.amount)}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground">{tier.name}</span>
              <span className="font-bold text-primary">${tier.amount}</span>
            </div>
            <p className="text-muted-foreground text-sm mt-1 font-serif">{tier.significance}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button onClick={onContribute} className="w-full bg-primary text-primary-foreground font-bold py-3 text-lg rounded-xl">
          Contribute Now
        </button>
      </div>
      <div className="text-center mt-8 pt-4 border-t border-border/20">
        <h3 className="font-semibold text-foreground">Can't contribute right now? No problem!</h3>
        <p className="text-muted-foreground text-sm mt-2 font-serif">
          Just Share the Love! 💜 Your support in spreading ancient wisdom is just as valuable.
        </p>
        <button className="mt-4 bg-secondary text-secondary-foreground font-semibold py-2 px-6 rounded-xl">
          Share the Love
        </button>
      </div>
    </div>
  );
};

export default EnergyExchange;