import React from 'react';

// =============================================================================
// The Official Logo Component
// =============================================================================
const TorchlightLogo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: { width: 150, height: 108, fontSize: 28 },
    md: { width: 250, height: 180, fontSize: 48 },
    lg: { width: 350, height: 252, fontSize: 68 },
  };
  const selectedSize = sizes[size];

  return (
    <svg 
      width={selectedSize.width} 
      height={selectedSize.height} 
      viewBox="0 0 250 180" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Torchlight Logo"
    >
      <defs>
        <style>
          {`
            .polished-gold { fill: #D4B35B; }
            .off-white { fill: #F5F5DC; }
            .wordmark {
                font-family: 'Montserrat', sans-serif;
                font-weight: 600;
                text-anchor: middle;
            }
          `}
        </style>
      </defs>
      <g transform="translate(75, 0)">
        <rect className="polished-gold" x="45" y="40" width="10" height="45" rx="2" />
        <path className="polished-gold" d="M50 35 C 40 35, 35 25, 50 15 C 65 25, 60 35, 50 35 Z" />
        <path className="polished-gold" d="M50 0 L53 7 L60 10 L53 13 L50 20 L47 13 L40 10 L47 7 Z" />
      </g>
      <text x="50%" y="150" className="wordmark off-white" style={{ fontSize: `${selectedSize.fontSize}px` }}>
        Torchlight
      </text>
    </svg>
  );
};

export default TorchlightLogo;