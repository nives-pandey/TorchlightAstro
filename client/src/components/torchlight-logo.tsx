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
          style={{ display: 'block' }}
        >
          {/* The 'T' Stem (Torch Handle) */}
          <rect fill="#D4B35B" x="40" y="35" width="20" height="50" rx="3" />

          {/* The Flame (Top of the 'T') */}
          <path fill="#D4B35B" d="M50 30 C 35 30, 25 15, 50 5 C 75 15, 65 30, 50 30 Z" />

          {/* The Guiding Star */}
          <path fill="#D4B35B" d="M50 0 L55 10 L65 15 L55 20 L50 30 L45 20 L35 15 L45 10 Z" />
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