import { useState } from 'react';
import { Heart, Sparkles, Users, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CosmicWheel } from '@/components/cosmic-wheel';
import { GratitudeCookie } from '@/components/gratitude-cookie';
import { sacredTiers, getTiersByCategory } from '@/lib/contributionTiers';

interface EnergyExchangeAppealProps {
  trigger: 'initial-reveal' | 'daily-insight' | 'deep-dive' | 'chart-generated';
  onDismiss?: () => void;
  onContribute?: (amount?: number) => void;
}

export function EnergyExchangeAppeal({ trigger, onDismiss, onContribute }: EnergyExchangeAppealProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(11);
  const [showCustom, setShowCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [showWheel, setShowWheel] = useState(false);
  const [contributionComplete, setContributionComplete] = useState(false);

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'initial-reveal':
        return {
          title: "Your cosmic blueprint revealed ✨",
          message: "Did this personal insight resonate with your soul?",
          subtitle: "Your Big Three just unlocked - this moment felt magical to you"
        };
      case 'daily-insight':
        return {
          title: "Today's guidance spoke to you 🌟",
          message: "Was this daily wisdom exactly what you needed?",
          subtitle: "Personalized cosmic weather that aligns with your energy"
        };
      case 'deep-dive':
        return {
          title: "You've discovered something profound 🔮",
          message: "These deeper insights illuminate your path",
          subtitle: "You've spent meaningful time exploring your cosmic design"
        };
      case 'chart-generated':
        return {
          title: "Your complete cosmic map is ready ⭐",
          message: "This comprehensive analysis reveals your true nature",
          subtitle: "Across 10 ancient systems - a depth no other app provides"
        };
    }
  };

  const { title, message, subtitle } = getTriggerMessage();

  const contributionAmounts = [5, 11, 22, 33];
  const categorizedTiers = getTiersByCategory();

  const handleContribute = (amount?: number) => {
    setContributionComplete(true);
    onContribute?.(amount || selectedAmount || (customAmount ? parseInt(customAmount) : undefined));
  };

  const handleSpinComplete = (amount: number) => {
    setSelectedAmount(amount);
    setShowCustom(false);
    setCustomAmount('');
  };

  if (contributionComplete) {
    return <GratitudeCookie />;
  }

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-md mx-4 mb-4">
      <CardContent className="p-6">
        {/* Gratitude & Mission Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400/20 to-teal-400/20 flex items-center justify-center">
              <Heart className="w-6 h-6" style={{color: 'hsl(44, 45%, 65%)'}} />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-white/80 text-sm">{message}</p>
          <p className="text-white/60 text-xs mt-1">{subtitle}</p>
        </div>

        {/* Cosmic Wheel Section */}
        {showWheel && (
          <div className="mb-6">
            <CosmicWheel onSpinComplete={handleSpinComplete} />
          </div>
        )}

        {/* Mission Statement */}
        <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 mt-0.5" style={{color: 'hsl(180, 25%, 55%)'}} />
            <div>
              <h4 className="text-white font-medium text-sm mb-1">Our Sacred Mission</h4>
              <p className="text-white/70 text-xs leading-relaxed">
                Torchlight is built by volunteers who've dedicated thousands of hours to preserve 
                ancient wisdom for the modern world. We believe spiritual guidance should be free, 
                but technology costs real money to maintain.
              </p>
            </div>
          </div>
        </div>

        {/* Value Exchange Philosophy */}
        <div className="text-center mb-6">
          <h4 className="text-white font-medium text-sm mb-3">Energy Exchange</h4>
          <p className="text-white/70 text-xs mb-4">
            If this guidance brought you clarity, peace, or insight, you're invited to return 
            that energy to help us illuminate the path for others seeking their cosmic truth.
          </p>
          
          {/* Cosmic Wheel Trigger */}
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 mb-3"
              onClick={() => setShowWheel(!showWheel)}
            >
              {showWheel ? 'Hide Cosmic Wheel' : '🎰 Let the Universe Decide'}
            </Button>
          </div>

          {/* Sacred Number Amounts */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {contributionAmounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "outline"}
                size="sm"
                className={`text-xs h-8 ${
                  selectedAmount === amount 
                    ? 'bg-amber-600/80 border-amber-500/50 text-white' 
                    : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                }`}
                onClick={() => {
                  setSelectedAmount(amount);
                  setShowWheel(false);
                }}
              >
                ${amount}
              </Button>
            ))}
          </div>

          {/* Sacred Number Meanings */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <Badge variant="outline" className="text-xs px-1 py-0.5 border-white/30 text-white/60">
                Mercury
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="text-xs px-1 py-0.5 border-white/30 text-white/60">
                Intuition
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="text-xs px-1 py-0.5 border-white/30 text-white/60">
                Balance
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="text-xs px-1 py-0.5 border-white/30 text-white/60">
                Mastery
              </Badge>
            </div>
          </div>

          {/* Custom Amount Option */}
          {!showCustom ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-white/60 hover:text-white/80"
              onClick={() => setShowCustom(true)}
            >
              Choose your own amount
            </Button>
          ) : (
            <div className="flex gap-2 justify-center items-center">
              <span className="text-white/70 text-sm">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0"
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm w-16 text-center"
                min="1"
                max="999"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
            onClick={onDismiss}
          >
            Continue Free
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white border-0 hover:from-amber-500 hover:to-amber-400"
            onClick={() => handleContribute(selectedAmount || undefined)}
            disabled={showCustom && !customAmount}
          >
            <Gift className="w-4 h-4 mr-2" />
            Share Energy
          </Button>
        </div>

        {/* Community Impact */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
            <Users className="w-4 h-4" />
            <span>Join 50,000+ souls supporting spiritual accessibility</span>
          </div>
        </div>

        {/* Can't Pay Alternative */}
        <div className="mt-4 text-center">
          <p className="text-white/50 text-xs mb-2">Can't contribute right now?</p>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-white/60 hover:text-white/80 p-0 h-auto"
          >
            Share Torchlight with friends who'd love this guidance ✨
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}