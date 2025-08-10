import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Sun, Stars, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/lib/i18n';

interface WhisperHint {
  id: string;
  text: string;
  type: 'cosmic' | 'planetary' | 'intuitive' | 'energy';
  icon: React.ReactNode;
  duration?: number;
}

const whisperHints: WhisperHint[] = [
  {
    id: 'mercury-insight',
    text: "Mercury's energy flows through communication today... listen deeper",
    type: 'planetary',
    icon: <Sparkles className="w-4 h-4" />,
    duration: 8000
  },
  {
    id: 'lunar-wisdom',
    text: "The moon whispers secrets to those who pause and breathe...",
    type: 'cosmic',
    icon: <Moon className="w-4 h-4" />,
    duration: 7000
  },
  {
    id: 'solar-guidance',
    text: "Your inner light seeks expression... trust your radiance",
    type: 'energy',
    icon: <Sun className="w-4 h-4" />,
    duration: 6000
  },
  {
    id: 'star-connection',
    text: "The stars align when you align with your truth...",
    type: 'cosmic',
    icon: <Stars className="w-4 h-4" />,
    duration: 9000
  },
  {
    id: 'intuitive-moment',
    text: "Your intuition is stronger than you realize... trust the subtle knowing",
    type: 'intuitive',
    icon: <Eye className="w-4 h-4" />,
    duration: 8500
  },
  {
    id: 'heart-wisdom',
    text: "Love's frequency harmonizes all cosmic vibrations...",
    type: 'energy',
    icon: <Heart className="w-4 h-4" />,
    duration: 7500
  },
  {
    id: 'timing-insight',
    text: "Divine timing unfolds... patience reveals perfect moments",
    type: 'cosmic',
    icon: <Sparkles className="w-4 h-4" />,
    duration: 8000
  },
  {
    id: 'transformation',
    text: "Every ending births a new cosmic beginning...",
    type: 'intuitive',
    icon: <Moon className="w-4 h-4" />,
    duration: 7000
  },
  {
    id: 'venus-harmony',
    text: "Venus whispers of beauty in unexpected places... look with soft eyes",
    type: 'planetary',
    icon: <Heart className="w-4 h-4" />,
    duration: 7500
  },
  {
    id: 'jupiter-expansion',
    text: "Jupiter's wisdom: abundance flows when you release control...",
    type: 'planetary',
    icon: <Stars className="w-4 h-4" />,
    duration: 8200
  },
  {
    id: 'saturn-lessons',
    text: "Saturn teaches through gentle boundaries... honor your limits",
    type: 'planetary',
    icon: <Sparkles className="w-4 h-4" />,
    duration: 8800
  },
  {
    id: 'cosmic-breath',
    text: "The universe breathes through you... inhale stardust, exhale gratitude",
    type: 'cosmic',
    icon: <Moon className="w-4 h-4" />,
    duration: 9200
  },
  {
    id: 'shadow-integration',
    text: "Your shadow holds forgotten treasures... embrace with compassion",
    type: 'intuitive',
    icon: <Eye className="w-4 h-4" />,
    duration: 8600
  },
  {
    id: 'elemental-balance',
    text: "Fire, Water, Earth, Air dance within you... which needs attention?",
    type: 'energy',
    icon: <Sun className="w-4 h-4" />,
    duration: 8100
  },
  {
    id: 'soul-frequency',
    text: "Your soul's frequency is unique... let it sing without apology",
    type: 'energy',
    icon: <Heart className="w-4 h-4" />,
    duration: 7800
  },
  {
    id: 'cosmic-timing',
    text: "The cosmos conspires in perfect timing... trust the unfolding",
    type: 'cosmic',
    icon: <Stars className="w-4 h-4" />,
    duration: 8300
  }
];

export default function WhisperMode() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentHint, setCurrentHint] = useState<WhisperHint | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isEnabled) {
      setCurrentHint(null);
      setIsVisible(false);
      return;
    }

    const showRandomHint = () => {
      const randomHint = whisperHints[Math.floor(Math.random() * whisperHints.length)];
      setCurrentHint(randomHint);
      setIsVisible(true);

      // Hide hint after duration
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setCurrentHint(null), 500);
      }, randomHint.duration || 8000);
    };

    // Show first hint after short delay
    const initialDelay = setTimeout(showRandomHint, 3000);

    // Set up interval for subsequent hints (every 15-25 seconds)
    const interval = setInterval(() => {
      if (!currentHint) {
        showRandomHint();
      }
    }, Math.random() * 10000 + 15000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [isEnabled, currentHint]);

  const getHintPosition = () => {
    const positions = [
      'top-20 left-6',
      'top-32 right-8', 
      'bottom-32 left-8',
      'bottom-20 right-6',
      'top-1/2 left-6',
      'top-1/2 right-6'
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cosmic': return 'text-purple-300 border-purple-400/30 bg-purple-900/20';
      case 'planetary': return 'text-blue-300 border-blue-400/30 bg-blue-900/20';
      case 'intuitive': return 'text-indigo-300 border-indigo-400/30 bg-indigo-900/20';
      case 'energy': return 'text-amber-300 border-amber-400/30 bg-amber-900/20';
      default: return 'text-gray-300 border-gray-400/30 bg-gray-900/20';
    }
  };

  return (
    <>
      {/* Whisper Mode Toggle */}
      <div className="flex items-center space-x-2 p-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span className="text-sm text-white/80">Whisper Mode</span>
        <Switch
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
          className="data-[state=checked]:bg-purple-600"
        />
      </div>

      {/* Floating Whisper Hints */}
      <AnimatePresence>
        {currentHint && isVisible && (
          <motion.div
            key={currentHint.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed ${getHintPosition()} z-40 pointer-events-none`}
            style={{ maxWidth: '280px' }}
          >
            <div className={`
              px-4 py-3 rounded-xl border backdrop-blur-md
              shadow-lg shadow-black/20
              ${getTypeColor(currentHint.type)}
            `}>
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-0.5">
                  {currentHint.icon}
                </div>
                <p className="text-sm leading-relaxed font-medium">
                  {currentHint.text}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Particle Effects (when enabled) */}
      {isEnabled && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1.2, 0.5],
                x: [0, Math.random() * 40 - 20, 0],
                y: [0, Math.random() * 40 - 20, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

export { WhisperMode };