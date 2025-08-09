import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { wheelTiers, getTierByAmount } from '@/lib/contributionTiers';

interface CosmicWheelProps {
  onSpinComplete: (amount: number) => void;
}

export const CosmicWheel: React.FC<CosmicWheelProps> = ({ onSpinComplete }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinResult, setSpinResult] = useState<number | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    
    setSpinResult(null);
    setIsSpinning(true);
    
    // Generate random spin with multiple rotations
    const randomRotations = 4 + Math.floor(Math.random() * 4);
    const finalAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (randomRotations * 360) + finalAngle;
    
    setRotation(totalRotation);

    setTimeout(() => {
      const segmentAngle = 360 / wheelTiers.length;
      const normalizedAngle = 360 - (totalRotation % 360);
      const selectedIndex = Math.floor(normalizedAngle / segmentAngle);
      const selectedAmount = wheelTiers[selectedIndex];
      
      onSpinComplete(selectedAmount);
      setSpinResult(selectedAmount);
      setIsSpinning(false);
    }, 4000);
  };

  const segmentAngle = 360 / wheelTiers.length;

  return (
    <div className="text-center p-6 border-b border-border">
      <h3 className="text-lg font-semibold mb-4 text-primary">Let the Universe Guide You</h3>
      
      <div className="relative w-56 h-56 mx-auto mb-4">
        <div 
          className="w-full h-full transition-transform duration-[4000ms] ease-out"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          <svg viewBox="0 0 220 220" className="w-full h-full">
            <defs>
              <path id="circlePath" d="M 110, 110 m -90, 0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" />
            </defs>
            
            {/* Background circle */}
            <circle cx="110" cy="110" r="110" fill="var(--warm-charcoal)" />
            
            {/* Wheel segments */}
            {wheelTiers.map((tier, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;
              const largeArcFlag = segmentAngle > 180 ? 1 : 0;
              
              const x1 = 110 + 110 * Math.cos(Math.PI * startAngle / 180);
              const y1 = 110 + 110 * Math.sin(Math.PI * startAngle / 180);
              const x2 = 110 + 110 * Math.cos(Math.PI * endAngle / 180);
              const y2 = 110 + 110 * Math.sin(Math.PI * endAngle / 180);
              
              return (
                <g key={tier}>
                  <path 
                    d={`M110,110 L${x1},${y1} A110,110 0 ${largeArcFlag},1 ${x2},${y2} z`}
                    fill={index % 2 === 0 ? 'hsl(30, 8%, 28%)' : 'var(--warm-charcoal)'}
                    stroke="var(--sage-teal)"
                    strokeWidth="1"
                  />
                  <text>
                    <textPath 
                      href="#circlePath" 
                      startOffset={`${(index * segmentAngle + segmentAngle / 2) / 360 * 100}%`}
                      className="text-sm font-semibold fill-current"
                      style={{ 
                        textAnchor: 'middle',
                        fill: 'var(--off-white)'
                      }}
                    >
                      ${tier}
                    </textPath>
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Pointer */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 text-2xl"
          style={{ color: 'var(--primary-accent)' }}
        >
          ▼
        </div>
      </div>

      <Button 
        onClick={handleSpin} 
        disabled={isSpinning}
        className="sanctuary-button disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel of Intention'}
      </Button>

      {spinResult && (
        <p className="text-muted-foreground text-sm mt-4 font-body">
          The wheel suggests an energy exchange of{' '}
          <span className="font-semibold" style={{ color: 'var(--primary-accent)' }}>
            ${spinResult}
          </span>
          . This is just a guide—please choose this or any other amount that feels right for your journey.
        </p>
      )}
    </div>
  );
};