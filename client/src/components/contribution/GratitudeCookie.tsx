// client/src/components/contribution/GratitudeCookie.tsx
import React, { useState } from 'react';

const messages = [
  "Your generosity creates ripples of light in the universe. May your path be illuminated today.",
  "An open hand is the first step to receiving. Be open to unexpected blessings.",
  "The energy you give is the energy you receive. Thank you for adding to the light.",
  "A single act of kindness can change a universe. Your act has been felt.",
  "May the clarity you seek find you with ease and grace."
];

const GratitudeCookie: React.FC = () => {
  const [revealed, setRevealed] = useState(false);
  const [message] = useState(messages[Math.floor(Math.random() * messages.length)]);

  return (
    <div className="text-center p-8 bg-warm-charcoal rounded-lg">
      <h2 className="text-2xl font-bold text-warm-off-white mb-4">A Message of Gratitude</h2>
      <div className="cursor-pointer" onClick={() => setRevealed(true)}>
        <div className="text-6xl text-brushed-gold">{revealed ? '🥠' : '🍪'}</div>
        <p className="text-warm-gray mt-2">{revealed ? 'Your message:' : 'Tap to reveal your message'}</p>
      </div>
      {revealed && (
        <p className="text-warm-off-white mt-4 italic">"{message}"</p>
      )}
    </div>
  );
};

export default GratitudeCookie;