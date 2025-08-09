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

  const textSizes = {
    sm: '24',
    md: '36',
    lg: '48',
    xl: '60'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showIcon && (
        <svg 
          className={`${sizeClasses[size]} w-auto`}
          viewBox="0 0 60 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Torch base */}
          <rect 
            x="26" 
            y="35" 
            width="8" 
            height="20" 
            rx="4" 
            fill="url(#torchGradient)"
          />
          
          {/* Flame */}
          <path 
            d="M30 5C25 8 22 15 25 25C28 20 32 20 35 25C38 15 35 8 30 5Z" 
            fill="url(#flameGradient)"
          />
          
          {/* Inner flame */}
          <path 
            d="M30 10C27 12 26 16 27.5 22C29 19 31 19 32.5 22C34 16 33 12 30 10Z" 
            fill="url(#innerFlameGradient)"
          />
          
          {/* Sanctuary sparkles - warm gold tones */}
          <circle cx="20" cy="15" r="1.5" fill="#C5A55A" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="40" cy="12" r="1" fill="#C5A55A" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="15" cy="25" r="0.8" fill="#C5A55A" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite"/>
          </circle>
          <circle cx="45" cy="22" r="1.2" fill="#C5A55A" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.2s" repeatCount="indefinite"/>
          </circle>
          
          {/* Sanctuary-aligned gradient definitions */}
          <defs>
            <linearGradient id="torchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B0A9A4" />
              <stop offset="50%" stopColor="#C5A55A" />
              <stop offset="100%" stopColor="#B0A9A4" />
            </linearGradient>
            
            <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5F5DC" />
              <stop offset="30%" stopColor="#C5A55A" />
              <stop offset="70%" stopColor="#6A9797" />
              <stop offset="100%" stopColor="#C5A55A" />
            </linearGradient>
            
            <linearGradient id="innerFlameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5F5DC" />
              <stop offset="50%" stopColor="#C5A55A" />
              <stop offset="100%" stopColor="#C5A55A" />
            </linearGradient>
          </defs>
        </svg>
      )}
      
      <svg 
        className={`${sizeClasses[size]} w-auto`}
        viewBox="0 0 300 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main text with gradient and glow */}
        <text 
          x="10" 
          y="55" 
          fontSize={textSizes[size]}
          fontFamily="'Playfair Display', serif"
          fontWeight="700"
          fontStyle="italic"
          fill="url(#textGradient)"
          filter="url(#glow)"
        >
          Torchlight
        </text>
        
        {/* Text shadow for depth */}
        <text 
          x="12" 
          y="57" 
          fontSize={textSizes[size]}
          fontFamily="'Playfair Display', serif"
          fontWeight="700"
          fontStyle="italic"
          fill="rgba(0,0,0,0.3)"
          style={{ zIndex: -1 }}
        >
          Torchlight
        </text>
        
        {/* Sanctuary text gradient - sophisticated gold */}
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C5A55A" />
            <stop offset="25%" stopColor="#F5F5DC" />
            <stop offset="50%" stopColor="#C5A55A" />
            <stop offset="75%" stopColor="#B0A9A4" />
            <stop offset="100%" stopColor="#C5A55A" />
          </linearGradient>
          
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Subtle sanctuary sparkles over text */}
        <circle cx="50" cy="25" r="1" fill="#C5A55A" opacity="0">
          <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="0s"/>
        </circle>
        <circle cx="150" cy="30" r="0.8" fill="#F5F5DC" opacity="0">
          <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" begin="1s"/>
        </circle>
        <circle cx="240" cy="20" r="1.2" fill="#C5A55A" opacity="0">
          <animate attributeName="opacity" values="0;1;0" dur="2.8s" repeatCount="indefinite" begin="0.5s"/>
        </circle>
      </svg>
    </div>
  );
};

export default TorchlightLogo;