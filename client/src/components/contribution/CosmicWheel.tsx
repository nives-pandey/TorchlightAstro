// client/src/components/contribution/CosmicWheel.tsx
import React from 'react';

interface CosmicWheelProps {
  onSpinComplete: (amount: number) => void;
}

const CosmicWheel: React.FC<CosmicWheelProps> = ({ onSpinComplete }) => {
  const handleSpin = () => {
    const wheelTiers = [3, 5, 7, 9, 11, 22, 33];
    const randomIndex = Math.floor(Math.random() * wheelTiers.length);
    const selectedAmount = wheelTiers[randomIndex];
    onSpinComplete(selectedAmount);
  };

  return (
    <div className="text-center p-4 border-b border-warm-gray/20">
      <h3 className="text-lg font-semibold text-warm-off-white mb-4">Let the Universe Guide You</h3>
      {/* This is a placeholder for a graphical SVG wheel */}
      <div className="w-40 h-40 bg-warm-charcoal border-4 border-warm-gray rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-warm-gray">Spinning Wheel</span>
      </div>
      <button
        onClick={handleSpin}
        className="bg-brushed-gold text-warm-charcoal font-semibold py-2 px-6 rounded-lg"
      >
        Spin the Wheel of Intention
      </button>
    </div>
  );
};

export default CosmicWheel;