// client/src/components/EnergyExchange.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Facebook, Twitter, Mail, MessageCircle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  { category: 'Vedic & Eastern Tiers', amount: 27, name: 'The Nakshatra', significance: 'Represents the 27 lunar mansions of Vedic astrology.' },
  { category: 'Vedic & Eastern Tiers', amount: 54, name: 'The Mantra', significance: 'Half the sacred number 108, used in Japa meditation cycles.' },
  { category: 'Vedic & Eastern Tiers', amount: 108, name: 'The Sacred Mala', significance: 'A highly sacred number representing the wholeness of existence.' },
  { category: 'Patron Tiers', amount: 369, name: 'The Divine Code', significance: 'Associated with Nikola Tesla\'s "key to the universe."' },
  { category: 'Patron Tiers', amount: 786, name: 'The Cosmic Blessing', significance: 'A number of profound significance in Islamic numerology.' },
  { category: 'Patron Tiers', amount: 1008, name: 'The Abundant Universe', significance: 'Signifying immense abundance and spiritual completion.' },
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
      <path d="M0 4C0 1.79086 1.79086 0 4 0H116C118.209 0 120 1.79086 120 4V74C120 76.2091 118.209 78 116 78H4C1.79086 78 0 76.2091 0 74V4Z" fill="#FFC439"/>
      <path d="M60.84 49.56C60.56 50.8 59.4 51.6 58.08 51.6H54.48L52.8 61.8C52.64 62.88 51.8 63.6 50.76 63.6H44.24C43.36 63.6 42.64 63.04 42.48 62.2L36.24 22.92C36.08 21.96 36.8 21.24 37.76 21.24H45.24C46.2 21.24 46.96 21.96 47.12 22.92L49.32 36.12H52.92C54.24 36.12 55.4 35.32 55.68 34.08L60.84 49.56Z" fill="white"/>
    </svg>
  ),
  card: ( 
    <svg width="48" height="30" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="40" rx="4" fill="#4A5568"/>
      <rect y="8" width="64" height="8" fill="#718096"/>
      <rect x="6" y="26" width="24" height="4" rx="2" fill="#A0AEC0"/>
    </svg> 
  )
};

interface PaymentGatewayIconsProps {
  methods: string[];
}

const PaymentGatewayIcons: React.FC<PaymentGatewayIconsProps> = ({ methods }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 0' }}>
    <p style={{ fontSize: '0.875rem', color: 'var(--border-muted)', marginRight: '8px', fontFamily: 'Lora, serif' }}>We accept:</p>
    {methods.map((method) => ( 
      <div key={method}>{paymentIcons[method]}</div> 
    ))}
  </div>
);

// --- Sub-Component 2: CosmicWheel with ANIMATION ---
interface CosmicWheelProps {
  onSpinComplete: (amount: number) => void;
}

const CosmicWheel: React.FC<CosmicWheelProps> = ({ onSpinComplete }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const randomRotations = 3 + Math.floor(Math.random() * 3);
    const finalAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (randomRotations * 360) + finalAngle;
    setRotation(totalRotation);

    setTimeout(() => {
      const segmentAngle = 360 / wheelTiers.length;
      const normalizedAngle = (totalRotation % 360);
      const selectedIndex = Math.floor(normalizedAngle / segmentAngle);
      const selectedAmount = wheelTiers[selectedIndex];
      onSpinComplete(selectedAmount);
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <div style={{ textAlign: 'center', padding: '16px', borderBottom: '1px solid rgba(176, 169, 164, 0.2)' }}>
      <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Let the Universe Guide You</h3>
      <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 16px' }}>
        <div 
          style={{
            width: '100%', height: '100%', border: '4px solid var(--border-muted)', borderRadius: '50%',
            transition: 'transform 4s cubic-bezier(0.25, 1, 0.5, 1)', transform: `rotate(${rotation}deg)`,
            background: 'conic-gradient(var(--background) 0deg 51deg, #4a4542 51deg 102deg, var(--background) 102deg 153deg, #4a4542 153deg 204deg, var(--background) 204deg 255deg, #4a4542 255deg 306deg, var(--background) 306deg 360deg)'
          }}
        />
        <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', color: 'var(--primary-accent)', fontSize: '24px' }}>▼</div>
      </div>
      <button onClick={handleSpin} disabled={isSpinning} style={{ backgroundColor: 'var(--primary-accent)', color: 'var(--background)', fontWeight: 600, padding: '8px 24px', borderRadius: '12px', border: 'none', cursor: isSpinning ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat, sans-serif', opacity: isSpinning ? 0.7 : 1 }}>
        {isSpinning ? 'Spinning...' : 'Spin the Wheel of Intention'}
      </button>
    </div>
  );
};

// --- Sub-Component 3: GratitudeCookie ---
const GratitudeCookie: React.FC = () => {
  const [revealed, setRevealed] = useState(false);
  const messages = [ 
    "Your generosity creates ripples of light in the universe...", 
    "An open hand is the first step to receiving...", 
    "The energy you give is the energy you receive..." 
  ];
  const [message] = useState(messages[Math.floor(Math.random() * messages.length)]);
  
  return (
    <div style={{ textAlign: 'center', padding: '32px', backgroundColor: 'var(--background)', borderRadius: '12px' }}>
      <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>A Message of Gratitude</h2>
      <div style={{ cursor: 'pointer' }} onClick={() => setRevealed(true)}>
        <div style={{ fontSize: '4rem', color: 'var(--primary-accent)' }}>{revealed ? '🥠' : '🍪'}</div>
        <p style={{ color: 'var(--border-muted)', marginTop: '8px', fontFamily: 'Lora, serif' }}>{revealed ? 'Your message:' : 'Tap to reveal your message'}</p>
      </div>
      {revealed && ( 
        <p style={{ color: 'var(--text-primary)', marginTop: '16px', fontStyle: 'italic', fontFamily: 'Lora, serif' }}>"{message}"</p> 
      )}
    </div>
  );
};

// --- Sub-Component 4: ShareModal ---
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const websiteUrl = window.location.origin;
  const shareText = "Discover your cosmic blueprint with Torchlight - authentic astrology across 10+ ancient systems! ✨";
  const shareTitle = "Torchlight - Ancient Wisdom for Modern Lives";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(websiteUrl);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(websiteUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: shareTitle,
            text: shareText,
            url: websiteUrl,
          }).catch(console.error);
          return;
        }
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const shareOptions = [
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => handleShare('facebook')
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: Twitter, 
      color: 'bg-sky-500 hover:bg-sky-600',
      onClick: () => handleShare('twitter')
    },
    { 
      id: 'whatsapp', 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => handleShare('whatsapp')
    },
    { 
      id: 'email', 
      name: 'Email', 
      icon: Mail, 
      color: 'bg-gray-600 hover:bg-gray-700',
      onClick: () => handleShare('email')
    },
    { 
      id: 'copy', 
      name: 'Copy Link', 
      icon: Copy, 
      color: 'bg-teal-600 hover:bg-teal-700',
      onClick: handleCopyLink
    }
  ];

  // Add native share if available
  if (navigator.share) {
    shareOptions.unshift({
      id: 'native',
      name: 'Share',
      icon: Share2,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => handleShare('native')
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Share the Love 💜</DialogTitle>
          <DialogDescription className="text-gray-300 text-sm text-center">
            Help others discover authentic ancient wisdom! Choose how you'd like to share Torchlight:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => (
              <Button
                key={option.id}
                onClick={option.onClick}
                className={`${option.color} text-white flex items-center gap-2 justify-center py-3 transition-colors`}
              >
                <option.icon className="w-4 h-4" />
                {option.name}
              </Button>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-400 text-xs mb-2">Preview:</p>
            <p className="text-white text-sm">{shareText}</p>
            <p className="text-teal-400 text-sm mt-1">{websiteUrl}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Component: EnergyExchange.tsx ---
interface EnergyExchangeProps {
  onContribute?: () => void;
}

const EnergyExchange: React.FC<EnergyExchangeProps> = ({ onContribute }) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(11);
  const [customAmount, setCustomAmount] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const handleSpinComplete = (amount: number) => { 
    setSelectedTier(amount); 
    setCustomAmount(''); 
  };
  
  const handleTierSelect = (amount: number) => { 
    setSelectedTier(amount); 
    setCustomAmount(''); 
  };
  
  const handleCustomSelect = () => { 
    setSelectedTier(null); 
  };

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', backgroundColor: 'var(--background)', color: 'var(--text-primary)', padding: '16px', maxWidth: '448px', margin: 'auto', borderRadius: '12px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Montserrat, sans-serif' }}>Why Your Support Matters</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--border-muted)', marginTop: '8px', fontFamily: 'Lora, serif' }}>
          "Ancient wisdom belongs to humanity, not corporations. Your contribution supports our small team, covers server and AI costs, and allows us to maintain the highest standards of authenticity, keeping this sanctuary ad-free forever."
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-accent)' }}>Join the Energy Exchange</h2>
      </div>
      
      <CosmicWheel onSpinComplete={handleSpinComplete} />
      
      <div style={{ marginTop: '24px' }}>
        {sacredTiers.map((tier) => (
          <div
            key={tier.amount}
            style={{ 
              padding: '16px', 
              border: '1px solid', 
              borderRadius: '12px', 
              marginBottom: '8px', 
              cursor: 'pointer', 
              transition: 'all 0.3s', 
              borderColor: selectedTier === tier.amount ? 'var(--primary-accent)' : 'rgba(176, 169, 164, 0.3)', 
              boxShadow: selectedTier === tier.amount ? `0 0 15px var(--primary-accent)33` : 'none', 
              backgroundColor: selectedTier === tier.amount ? 'rgba(212, 179, 91, 0.1)' : 'transparent' 
            }}
            onClick={() => handleTierSelect(tier.amount)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{tier.name}</span>
              <span style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>${tier.amount}</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--border-muted)', marginTop: '4px', fontFamily: 'Lora, serif' }}>{tier.significance}</p>
          </div>
        ))}
        <div 
          style={{ 
            padding: '16px', 
            border: '1px solid', 
            borderRadius: '12px', 
            marginBottom: '16px', 
            cursor: 'pointer', 
            transition: 'all 0.3s', 
            borderColor: selectedTier === null ? 'var(--primary-accent)' : 'rgba(176, 169, 164, 0.3)', 
            boxShadow: selectedTier === null ? `0 0 15px var(--primary-accent)33` : 'none', 
            backgroundColor: selectedTier === null ? 'rgba(212, 179, 91, 0.1)' : 'transparent' 
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
              background: 'transparent', 
              border: 'none', 
              borderBottom: '1px solid rgba(176, 169, 164, 0.5)', 
              marginTop: '8px', 
              padding: '4px 0', 
              color: 'var(--text-primary)', 
              outline: 'none' 
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <button 
          onClick={onContribute} 
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
            fontFamily: 'Montserrat, sans-serif' 
          }}
        >
          Contribute Now
        </button>
      </div>

      <PaymentGatewayIcons methods={['applePay', 'googlePay', 'payPal', 'card']} />

      <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid rgba(176, 169, 164, 0.2)' }}>
        <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Montserrat, sans-serif' }}>Can't contribute right now? No problem!</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--border-muted)', marginTop: '8px', fontFamily: 'Lora, serif' }}>
          Just Share the Love! 💜 Your support in spreading ancient wisdom is just as valuable.
        </p>
        <button 
          onClick={() => setShowShareModal(true)}
          style={{ 
            marginTop: '16px', 
            backgroundColor: 'var(--secondary-accent)', 
            color: 'var(--text-primary)', 
            fontWeight: 600, 
            padding: '12px 24px', 
            borderRadius: '12px', 
            border: 'none', 
            cursor: 'pointer', 
            fontFamily: 'Montserrat, sans-serif',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-accent)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--secondary-accent)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Share the Love 💜
        </button>
      </div>
      
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
    </div>
  );
};

// --- Demo Component for testing ---
export function EnergyExchangeDemo() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleContribute = () => {
    console.log("Payment processing...");
    setTimeout(() => {
      console.log("Payment successful!");
      setPaymentSuccess(true);
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: '#1a1817', padding: '20px' }}>
      {paymentSuccess ? (
        <GratitudeCookie />
      ) : (
        <EnergyExchange onContribute={handleContribute} />
      )}
    </div>
  );
}

export default EnergyExchange;
export { GratitudeCookie };