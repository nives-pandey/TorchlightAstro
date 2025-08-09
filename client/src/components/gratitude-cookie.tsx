import React, { useState } from 'react';

export const GratitudeCookie: React.FC = () => {
  const [revealed, setRevealed] = useState(false);
  
  const messages = [
    "Your generosity creates ripples of light in the universe...",
    "An open hand is the first step to receiving...",
    "The energy you give is the energy you receive...",
    "Ancient wisdom flows through modern hearts like yours...",
    "Every contribution honors the sacred chain of knowledge...",
    "Your support illuminates the path for fellow seekers...",
    "In giving, you align with the cosmic flow of abundance...",
    "The universe recognizes and amplifies generous spirits..."
  ];
  
  const [message] = useState(messages[Math.floor(Math.random() * messages.length)]);

  return (
    <div className="text-center p-8 sanctuary-card">
      <h2 className="text-2xl font-bold mb-4 text-primary">A Message of Gratitude</h2>
      
      <div 
        className="cursor-pointer transition-transform hover:scale-105" 
        onClick={() => setRevealed(true)}
      >
        <div className="text-6xl mb-2">
          {revealed ? '🥠' : '🍪'}
        </div>
        <p className="text-muted-foreground font-body">
          {revealed ? 'Your message:' : 'Tap to reveal your message'}
        </p>
      </div>
      
      {revealed && (
        <div className="mt-6 p-4 rounded-lg bg-card border border-border">
          <p className="italic font-body text-lg leading-relaxed">
            "{message}"
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-1 h-1 rounded-full bg-primary opacity-60"></div>
            <div className="w-1 h-1 rounded-full bg-primary opacity-30"></div>
          </div>
        </div>
      )}
      
      {revealed && (
        <div className="mt-6 text-sm text-muted-foreground font-body">
          Your contribution flows into the eternal cycle of wisdom sharing.
          Thank you for being part of this sacred exchange.
        </div>
      )}
    </div>
  );
};