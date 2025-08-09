import React from 'react';

interface TorchlightLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
}

export const TorchlightLogo: React.FC<TorchlightLogoProps> = ({ 
  className = '', 
  size = 'md',
  showIcon = true 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20'
  };

  const iconSize = {
    sm: { width: 30, height: 30, viewBox: "0 0 100 100" },
    md: { width: 50, height: 50, viewBox: "0 0 100 100" },
    lg: { width: 60, height: 60, viewBox: "0 0 100 100" },
    xl: { width: 80, height: 80, viewBox: "0 0 100 100" }
  };

  const textSize = {
    sm: 20,
    md: 32,
    lg: 40,
    xl: 48
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showIcon && (
        <svg 
          width={iconSize[size].width}
          height={iconSize[size].height}
          viewBox={iconSize[size].viewBox}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <style>
              {`.polished-gold { fill: #D4B35B; }`}
            </style>
          </defs>

          {/* The 'T' Stem (Torch Handle) */}
          <rect className="polished-gold" x="45" y="40" width="10" height="45" rx="2" />

          {/* The Flame (Top of the 'T') */}
          <path className="polished-gold" d="M50 35 C 40 35, 35 25, 50 15 C 65 25, 60 35, 50 35 Z" />

          {/* The Guiding Star */}
          <path className="polished-gold" d="M50 0 L53 7 L60 10 L53 13 L50 20 L47 13 L40 10 L47 7 Z" />
        </svg>
      )}
      
      <span 
        className="font-semibold"
        style={{ 
          fontFamily: "'Montserrat', sans-serif", 
          fontWeight: 600,
          fontSize: `${textSize[size]}px`,
          color: '#F5F5DC' // Off-White
        }}
      >
        Torchlight
      </span>
    </div>
  );
};

export default TorchlightLogo;