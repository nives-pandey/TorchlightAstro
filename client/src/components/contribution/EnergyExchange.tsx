// client/src/components/contribution/EnergyExchange.tsx
import React, { useState } from 'react';
import { sacredTiers } from '@/lib/contributionTiers';
import CosmicWheel from './CosmicWheel';
import PaymentGatewayIcons from './PaymentGatewayIcons';

const EnergyExchange: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number | null>(11); // Default to popular tier
  const [customAmount, setCustomAmount] = useState('');

  const handleSpinComplete = (amount: number) => {
    setSelectedTier(amount);
    setCustomAmount('');
  };

  const handleTierSelect = (amount: number) => {
    setSelectedTier(amount);
    setCustomAmount('');
  }

  const handleCustomSelect = () => {
    setSelectedTier(null);
  }

  return (
    <div className="bg-warm-charcoal text-warm-off-white p-4 max-w-md mx-auto rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brushed-gold">Join the Energy Exchange</h2>
        <p className="text-warm-gray mt-2">"Ancient wisdom belongs to humanity, not corporations. We're committed to keeping authentic astrological knowledge accessible to all seekers, free forever."</p>
      </div>
      
      <CosmicWheel onSpinComplete={handleSpinComplete} />
      
      <div className="mt-6">
        {sacredTiers.map((tier) => (
          <div
            key={tier.amount}
            className={`p-4 border rounded-lg mb-2 cursor-pointer transition-all ${
              selectedTier === tier.amount
                ? 'border-brushed-gold shadow-lg shadow-brushed-gold/20 bg-white/5'
                : 'border-warm-gray/30'
            }`}
            onClick={() => handleTierSelect(tier.amount)}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-warm-off-white">{tier.name}</span>
              <span className="font-bold text-brushed-gold">${tier.amount}</span>
            </div>
            <p className="text-sm text-warm-gray mt-1">{tier.significance}</p>
          </div>
        ))}

        {/* Custom Amount */}
        <div 
          className={`p-4 border rounded-lg mb-4 cursor-pointer transition-all ${
            selectedTier === null
              ? 'border-brushed-gold shadow-lg shadow-brushed-gold/20 bg-white/5'
              : 'border-warm-gray/30'
          }`}
          onClick={handleCustomSelect}
        >
          <p className="font-bold text-warm-off-white">Custom Amount</p>
          <input
            type="number"
            placeholder="Contribute your lucky number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            onClick={handleCustomSelect}
            className="w-full bg-transparent border-b border-warm-gray/50 mt-2 py-1 text-warm-off-white focus:outline-none focus:border-brushed-gold"
          />
        </div>
      </div>

      <div className="mt-6">
        <button className="w-full bg-brushed-gold text-warm-charcoal font-bold py-3 px-6 rounded-lg text-lg">
          Contribute Now
        </button>
      </div>

      <PaymentGatewayIcons methods={['applePay', 'googlePay', 'payPal', 'card']} />

      <div className="text-center mt-4">
        <h3 className="font-semibold text-warm-off-white">Why Your Support Matters</h3>
        <p className="text-sm text-warm-gray mt-2">
          Your contribution supports our small team of researchers and developers, covers server and AI costs, and allows us to maintain the highest standards of authenticity, keeping this sanctuary ad-free forever.
        </p>
      </div>
    </div>
  );
};

export default EnergyExchange;