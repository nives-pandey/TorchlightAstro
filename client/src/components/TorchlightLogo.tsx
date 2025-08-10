// client/src/components/TorchlightLogo.tsx
import React from 'react';

// This component uses Tailwind CSS classes for styling.
// It assumes the global CSS variables for colors are set.
export const TorchlightLogo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: { container: 'h-8', icon: 30, text: 'text-xl' },
    md: { container: 'h-12', icon: 50, text: 'text-3xl' },
    lg: { container: 'h-16', icon: 60, text: 'text-4xl' },
  };
  const selected = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${selected.container}`}>
      <svg 
        width={selected.icon} 
        height={selected.icon} 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        className="fill-primary"
      >
        <rect x="45" y="40" width="10" height="45" rx="2" />
        <path d="M50 35 C 40 35, 35 25, 50 15 C 65 25, 60 35, 50 35 Z" />
        <path d="M50 0 L53 7 L60 10 L53 13 L50 20 L47 13 L40 10 L47 7 Z" />
      </svg>
      <span className={`font-sans font-semibold text-foreground ${selected.text}`}>
        Torchlight
      </span>
    </div>
  );
};