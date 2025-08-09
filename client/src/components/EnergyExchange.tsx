import React, { useState } from 'react';
import clsx from 'clsx';
import CosmicWheel from '@/components/cosmic-wheel';

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

interface EnergyExchangeProps {
  onContribute: () => void;
}

const EnergyExchange: React.FC<EnergyExchangeProps> = ({ onContribute }) => {
  const [selectedTier, setSelectedTier] = useState(11);
  const [customAmount, setCustomAmount] = useState('');

  const handleSpinComplete = (amount: number) => { 
    setSelectedTier(amount); 
    setCustomAmount(''); 
  };
  
  const handleTierSelect = (amount: number) => { 
    setSelectedTier(amount); 
    setCustomAmount(''); 
  };
  
  const handleCustomSelect = () => { 
    setSelectedTier(0); 
  };

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