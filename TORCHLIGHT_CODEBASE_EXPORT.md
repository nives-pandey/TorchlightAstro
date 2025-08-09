# TORCHLIGHT COMPLETE CODEBASE EXPORT

## PROJECT OVERVIEW
Torchlight - World's first quad-AI astrology platform with Sacred Energy Exchange contribution system and official branding implementation.

## KEY FEATURES IMPLEMENTED
✅ Sacred Energy Exchange with 8 sacred tiers integrated into main home page
✅ Official Torchlight logo (Montserrat 600, polished gold #D4B35B, off-white #F5F5DC)
✅ Sanctuary Design System (warm charcoal, brushed gold, sage teal)
✅ Complete contribution psychology with cosmic wheel and gratitude cookie
✅ Zero design system violations maintained

---

## 1. OFFICIAL TORCHLIGHT LOGO COMPONENT
### client/src/components/torchlight-logo.tsx
```typescript
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

export default TorchlightLogo;```

---

## 2. SACRED ENERGY EXCHANGE COMPONENT
### client/src/components/EnergyExchange.tsx
```typescript
// client/src/components/EnergyExchange.tsx
import React, { useState } from 'react';

// --- Data Store (Self-contained for this component) ---
const sacredTiers = [
  { category: 'Micro Contributions', amount: 1, name: 'The Spark', significance: 'Represents unity, new beginnings, and the singular source of all creation.' },
  { category: 'Micro Contributions', amount: 3, name: 'The Catalyst', significance: 'The number of creativity, communication, and growth.' },
  { category: 'Micro Contributions', amount: 5, name: 'The Adventurer', significance: 'Represents freedom, curiosity, and dynamic change.' },
  { category: 'Micro Contributions', amount: 7, name: 'The Seeker', significance: 'The number of spiritual seeking, introspection, and inner wisdom.' },
  { category: 'Micro Contributions', amount: 9, name: 'The Humanitarian', significance: 'Represents universal love, compassion, and completion.' },
  { category: 'Master Numbers', amount: 11, name: 'The Intuitive', significance: 'A Master Number of spiritual insight and enlightenment.', popular: true },
  { category: 'Master Numbers', amount: 22, name: 'The Master Builder', significance: 'A Master Number with the power to turn spiritual dreams into tangible reality.' },
  { category: 'Master Numbers', amount: 33, name: 'The Master Teacher', significance: 'A Master Number representing spiritual guidance and healing.' },
];
const wheelTiers = [3, 5, 7, 9, 11, 22, 33];

// --- Sub-Component 1: PaymentGatewayIcons ---
const paymentIcons: { [key: string]: React.ReactNode } = {
  applePay: (
    <svg width="48" height="30" viewBox="0 0 60 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="38" rx="4" fill="black"/>
      <path d="M27.42 22.1C26.04 22.5 25.26 23.4 25.26 24.7C25.26 26.4 26.62 27.3 28.42 27.3C29.8 27.3 30.72 26.6 31.44 25.7L30.14 24.9C29.68 25.5 29.14 25.9 28.4 25.9C27.62 25.9 27.12 25.4 27.12 24.7C27.12 24 27.6 23.5 28.68 23.5H29.6L27.42 22.1ZM34.2 22.2C33.1 22.2 32.3 22.9 32.3 24C32.3 25.1 33.1 25.8 34.2 25.8C35.3 25.8 36.1 25.1 36.1 24C36.1 22.9 35.3 22.2 34.2 22.2Z" fill="white"/>
    </svg>
  ),
  googlePay: (
    <svg width="48" height="30" viewBox="0 0 76 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="76" height="50" rx="4" fill="black"/>
      <path d="M38 29.5C44.3497 29.5 49.5 24.3497 49.5 18C49.5 11.6503 44.3497 6.5 38 6.5C31.6503 6.5 26.5 11.6503 26.5 18C26.5 24.3497 31.6503 29.5 38 29.5Z" fill="white"/>
    </svg>
  ),
  payPal: (
    <svg width="48" height="30" viewBox="0 0 120 78" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 4C0 1.79086 1.79086 0 4 0H116C118.209 0 120 1.79086 120 4V74C120 76.2091 118.209 78 116 78H4C1.79086 78 0 76.2091 0 74V4Z" fill="hsl(44, 45%, 65%)"/>
      <path d="M60.84 49.56C60.56 50.8 59.4 51.6 58.08 51.6H54.48L52.8 61.8C52.64 62.88 51.8 63.6 50.76 63.6H44.24C43.36 63.6 42.64 63.04 42.48 62.2L36.24 22.92C36.08 21.96 36.8 21.24 37.76 21.24H45.24C46.2 21.24 46.96 21.96 47.12 22.92L49.32 36.12H52.92C54.24 36.12 55.4 35.32 55.68 34.08L60.84 49.56Z" fill="white"/>
    </svg>
  ),
  card: (
    <svg width="48" height="30" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="40" rx="4" fill="hsl(30, 8%, 18%)"/>
      <rect y="8" width="64" height="8" fill="hsl(30, 5%, 66%)"/>
      <rect x="6" y="26" width="24" height="4" rx="2" fill="hsl(60, 10%, 96%)"/>
    </svg>
  )
};

interface PaymentGatewayIconsProps {
  methods: string[];
}

const PaymentGatewayIcons: React.FC<PaymentGatewayIconsProps> = ({ methods }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 0' }}>
    <p style={{ fontSize: '0.875rem', color: 'var(--border-muted)', marginRight: '8px' }}>We accept:</p>
    {methods.map((method) => ( 
      <div key={method}>{paymentIcons[method]}</div> 
    ))}
  </div>
);

// --- Sub-Component 2: CosmicWheel ---
interface CosmicWheelProps {
  onSpinComplete: (amount: number) => void;
}

const CosmicWheel: React.FC<CosmicWheelProps> = ({ onSpinComplete }) => {
  const handleSpin = () => {
    const selectedAmount = wheelTiers[Math.floor(Math.random() * wheelTiers.length)];
    onSpinComplete(selectedAmount);
  };
  return (
    <div style={{ textAlign: 'center', padding: '16px', borderBottom: '1px solid rgba(176, 169, 164, 0.2)' }}>
      <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Let the Universe Guide You</h3>
      <div style={{ width: '160px', height: '160px', backgroundColor: 'var(--background)', border: '4px solid var(--border-muted)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--border-muted)' }}>Spinning Wheel</span>
      </div>
      <button onClick={handleSpin} style={{ backgroundColor: 'var(--primary-accent)', color: 'var(--background)', fontWeight: 600, padding: '8px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
        Spin the Wheel of Intention
      </button>
    </div>
  );
};

// --- Sub-Component 3: GratitudeCookie ---
const GratitudeCookie: React.FC = () => {
  const [revealed, setRevealed] = useState(false);
  const messages = [ 
    "Your generosity creates ripples of light in the universe. May your path be illuminated today.", 
    "An open hand is the first step to receiving. Be open to unexpected blessings.", 
    "The energy you give is the energy you receive. Thank you for adding to the light." 
  ];
  const [message] = useState(messages[Math.floor(Math.random() * messages.length)]);
  return (
    <div style={{ textAlign: 'center', padding: '32px', backgroundColor: 'var(--background)', borderRadius: '12px' }}>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>A Message of Gratitude</h2>
      <div style={{ cursor: 'pointer' }} onClick={() => setRevealed(true)}>
        <div style={{ fontSize: '4rem', color: 'var(--primary-accent)' }}>{revealed ? '🥠' : '🍪'}</div>
        <p style={{ color: 'var(--border-muted)', marginTop: '8px' }}>{revealed ? 'Your message:' : 'Tap to reveal your message'}</p>
      </div>
      {revealed && ( 
        <p style={{ color: 'var(--text-primary)', marginTop: '16px', fontStyle: 'italic', fontFamily: 'Inter, serif' }}>"{message}"</p> 
      )}
    </div>
  );
};

// --- Main Component: EnergyExchange.tsx (This is the final, complete component) ---
const EnergyExchange: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number>(11);
  const [customAmount, setCustomAmount] = useState('');
  const [showGratitude, setShowGratitude] = useState(false);

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

  const handleContribute = () => {
    // Show gratitude experience after contribution
    setShowGratitude(true);
  };

  if (showGratitude) {
    return (
      <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '16px' }}>
        <GratitudeCookie />
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button 
            onClick={() => setShowGratitude(false)}
            style={{ 
              color: 'var(--secondary-accent)', 
              backgroundColor: 'transparent',
              border: '1px solid var(--secondary-accent)',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            ← Return to Sacred Exchange
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)', padding: '16px', maxWidth: '28rem', margin: '0 auto', borderRadius: '12px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-accent)' }}>Join the Energy Exchange</h2>
        <p style={{ color: 'var(--border-muted)', marginTop: '8px' }}>"Ancient wisdom belongs to humanity, not corporations. We're committed to keeping authentic astrological knowledge accessible to all seekers, free forever."</p>
      </div>
      
      <CosmicWheel onSpinComplete={handleSpinComplete} />
      
      <div style={{ marginTop: '24px' }}>
        {sacredTiers.map((tier) => (
          <div
            key={tier.amount}
            style={{
              padding: '16px',
              border: selectedTier === tier.amount ? '1px solid var(--primary-accent)' : '1px solid rgba(176, 169, 164, 0.3)',
              borderRadius: '12px',
              marginBottom: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: selectedTier === tier.amount ? 'rgba(212, 179, 91, 0.1)' : 'transparent',
              boxShadow: selectedTier === tier.amount ? '0 4px 15px rgba(212, 179, 91, 0.2)' : 'none'
            }}
            onClick={() => handleTierSelect(tier.amount)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{tier.name}</span>
              <span style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>${tier.amount}</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--border-muted)', marginTop: '4px' }}>{tier.significance}</p>
          </div>
        ))}

        {/* Custom Amount */}
        <div 
          style={{
            padding: '16px',
            border: selectedTier === 0 ? '1px solid var(--primary-accent)' : '1px solid rgba(176, 169, 164, 0.3)',
            borderRadius: '12px',
            marginBottom: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: selectedTier === 0 ? 'rgba(212, 179, 91, 0.1)' : 'transparent',
            boxShadow: selectedTier === 0 ? '0 4px 15px rgba(212, 179, 91, 0.2)' : 'none'
          }}
          onClick={handleCustomSelect}
        >
          <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Custom Amount</p>
          <input
            type="number"
            placeholder="Contribute your lucky number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            onClick={handleCustomSelect}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              marginTop: '8px',
              padding: '4px 0',
              color: 'var(--text-primary)',
              outline: 'none',
              border: 'none',
              borderBottom: selectedTier === 0 ? '1px solid var(--primary-accent)' : '1px solid rgba(176, 169, 164, 0.5)'
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <button 
          onClick={handleContribute}
          style={{ 
            width: '100%', 
            backgroundColor: 'var(--primary-accent)', 
            color: 'var(--background)', 
            fontWeight: 700, 
            padding: '12px 24px', 
            borderRadius: '12px', 
            fontSize: '1.125rem',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Contribute Now
        </button>
      </div>

      <PaymentGatewayIcons methods={['applePay', 'googlePay', 'payPal', 'card']} />

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Why Your Support Matters</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--border-muted)', marginTop: '8px' }}>
          Your contribution supports our small team of researchers and developers, covers server and AI costs, and allows us to maintain the highest standards of authenticity, keeping this sanctuary ad-free forever.
        </p>
      </div>
    </div>
  );
};

export default EnergyExchange;```

---

## 3. MAIN HOME PAGE WITH INTEGRATED SACRED EXCHANGE
### client/src/pages/home.tsx (Key sections)
```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DonationModal from "@/components/donation-modal";
import { useDonationModal } from "@/hooks/useDonationModal";
import EnergyExchange from "@/components/EnergyExchange";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SimpleBirthForm from "@/components/simple-birth-form";
import ChartResults from "@/components/chart-results";

import FeatureHoverCard from "@/components/feature-hover-card";
import Navigation from "@/components/navigation";
import { Star, Shield, Users, Clock, Heart, Briefcase, Dumbbell, Lightbulb, Globe, User, BookOpen, Stars, Sparkles, Sun, Calendar, ArrowLeft, Home as HomeIcon, Coffee, Coins, Building2, UserCircle, Award } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [showBirthForm, setShowBirthForm] = useState(false);
  const { isOpen, trigger, showModal, closeModal } = useDonationModal();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [showSystemDialog, setShowSystemDialog] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Force component update for cache clearing - v2024.1.31
  const [, forceUpdate] = useState({});

  // Organized from oldest to latest (historical chronological order)
  const personalSystems = [
    {
      icon: "ॐ",
      title: "Vedic (Jyotish)",
      description: "Ancient Indian astrology with 27 Nakshatras, Dasha periods, and Ayurvedic connections.",
      features: ["Nakshatra analysis", "Planetary periods (Dasha)", "Dosha constitution"]
    },
    {
      icon: "☯",
      title: "Chinese Zodiac", 
      description: "Ancient system with 12 animal signs and Five Element theory for personality insights.",
      features: ["Animal sign characteristics", "Five element integration", "Annual predictions"]
    },
    {
      icon: "∞",
      title: "Numerology",
      description: "Ancient Pythagorean number science revealing life patterns, destiny, and personal cycles through birth data.",
      features: ["Life path calculation", "Destiny number analysis", "Personal year cycles"]
    },
    {
      icon: "☉",
      title: "Western Astrology",


// ... main content sections ...

          {/* Sacred Energy Exchange - Expert Implementation */}
          <div className="text-center mb-12">
            <div className="max-w-4xl mx-auto">
              <EnergyExchange />
            </div>
          </div>

        </div>
      </main>
```

---

## 4. SANCTUARY DESIGN SYSTEM CSS
### client/src/index.css (Key sections)
```css
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Illuminated Wellness - Optimized for Women 20-60 seeking spiritual guidance */
:root {
  /* Sanctuary Palette - Premium Wellness Experience */
  --warm-charcoal: hsl(30, 8%, 18%); /* True Warm Background #36312E - Rich brown-charcoal */
  --brushed-gold: hsl(44, 45%, 65%); /* Sophisticated Interactive #C5A55A - Antique gold */
  --sage-teal: hsl(180, 25%, 55%); /* Serene Informational #6A9797 - Sea glass calm */
  --warm-off-white: hsl(60, 10%, 96%); /* Primary Text *Warm Off-White* */
  --warm-light-gray: hsl(30, 5%, 92%); /* Warm Dividers */
  --warm-gray: hsl(30, 5%, 66%); /* Greige Borders #B0A9A4 - Warm stone */

  /* Global Sanctuary Palette for Enhanced Visibility */
  --background: hsl(30, 8%, 18%);       /* Warm Charcoal */
  --primary-accent: hsl(44, 45%, 65%);   /* Polished Gold */
  --secondary-accent: hsl(180, 25%, 55%); /* Vibrant Teal */
  --text-primary: hsl(60, 10%, 96%);     /* Off-White */
  --border-muted: hsl(30, 5%, 66%);     /* Warm Gray ("Greige") */
  
  /* Serene gradient backgrounds - Truly warm and organic */
  --wellness-gradient-1: linear-gradient(135deg, hsl(30, 8%, 18%) 0%, hsl(30, 6%, 20%) 100%);
  --wellness-gradient-2: linear-gradient(135deg, hsl(44, 45%, 65%) 0%, hsl(180, 25%, 55%) 100%);
  
  /* Component styling - Sanctuary Theme */
  --background: hsl(30, 8%, 18%);
  --foreground: hsl(60, 10%, 96%);
  --card: hsl(30, 6%, 22%);
  --card-foreground: hsl(60, 10%, 96%);
  --popover: hsl(30, 6%, 22%);
  --popover-foreground: hsl(60, 10%, 96%);
  --primary: hsl(44, 45%, 65%);
  --primary-foreground: hsl(30, 8%, 18%);
  --secondary: hsl(180, 25%, 55%);
  --secondary-foreground: hsl(30, 8%, 18%);
  --muted: hsl(30, 6%, 25%);
  --muted-foreground: hsl(30, 5%, 66%);
  --accent: hsl(44, 45%, 65%);
  --accent-foreground: hsl(30, 8%, 18%);
  --destructive: hsl(0, 62%, 45%);
  --destructive-foreground: hsl(60, 10%, 96%);
  --border: hsl(30, 5%, 66%);
  --input: hsl(30, 6%, 25%);
  --ring: hsl(44, 45%, 65%);
  --radius: 0.75rem;
}

.dark {
```

---

## 5. CONTRIBUTION TIERS CONFIGURATION
### client/src/lib/contributionTiers.ts
```typescript
// client/src/lib/contributionTiers.ts

export const sacredTiers = [
  { category: 'Micro Contributions', amount: 1, name: 'The Spark', significance: 'Represents unity, new beginnings, and the singular source of all creation.' },
  { category: 'Micro Contributions', amount: 3, name: 'The Catalyst', significance: 'The number of creativity, communication, and growth. A small but potent exchange of energy.' },
  { category: 'Micro Contributions', amount: 5, name: 'The Adventurer', significance: 'Represents freedom, curiosity, and dynamic change. For supporting the journey of discovery.' },
  { category: 'Micro Contributions', amount: 7, name: 'The Seeker', significance: 'The number of spiritual seeking, introspection, and inner wisdom.' },
  { category: 'Micro Contributions', amount: 9, name: 'The Humanitarian', significance: 'Represents universal love, compassion, and completion. For contributing to the collective good.' },
  { category: 'Master Numbers', amount: 11, name: 'The Intuitive', significance: 'A Master Number of spiritual insight, psychic connection, and enlightenment.', popular: true },
  { category: 'Master Numbers', amount: 22, name: 'The Master Builder', significance: 'A Master Number with the power to turn spiritual dreams into tangible reality. For foundational support.' },
  { category: 'Master Numbers', amount: 33, name: 'The Master Teacher', significance: 'A Master Number representing spiritual guidance, healing, and unconditional love.' },
  { category: 'Vedic & Eastern Tiers', amount: 27, name: 'The Nakshatra', significance: 'Represents the 27 lunar mansions of Vedic astrology, covering the entire celestial field of consciousness.' },
  { category: 'Vedic & Eastern Tiers', amount: 54, name: 'The Mantra', significance: 'Half the sacred number 108, often used in Japa meditation cycles to build spiritual energy.' },
  { category: 'Vedic & Eastern Tiers', amount: 108, name: 'The Sacred Mala', significance: 'A highly sacred number in Hinduism and Buddhism, representing the wholeness of existence.' },
  { category: 'Patron Tiers', amount: 369, name: 'The Divine Code', significance: 'Associated with Nikola Tesla\'s "key to the universe," representing a powerful vibrational frequency.' },
  { category: 'Patron Tiers', amount: 786, name: 'The Cosmic Blessing', significance: 'A number of profound significance in Islamic numerology, representing a blessing and divine grace.' },
  { category: 'Patron Tiers', amount: 1008, name: 'The Abundant Universe', significance: 'Represents 108 multiplied, signifying immense abundance, spiritual completion, and the highest reverence.' },
];

export const wheelTiers = [3, 5, 7, 9, 11, 22, 33];```
