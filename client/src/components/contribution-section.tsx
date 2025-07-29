import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Users, 
  Clock, 
  BookOpen, 
  Star, 
  Globe, 
  Gift,
  Sparkles,
  Crown,
  Coffee
} from "lucide-react";

interface ContributionSectionProps {
  onContribute?: (amount: number) => void;
}

export default function ContributionSection({ onContribute }: ContributionSectionProps) {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const predefinedAmounts = [
    { amount: 5, label: "Coffee", icon: Coffee, description: "Buy us a coffee" },
    { amount: 10, label: "Gratitude", icon: Heart, description: "Small token of thanks" },
    { amount: 25, label: "Supporter", icon: Star, description: "Meaningful support" },
    { amount: 50, label: "Advocate", icon: Users, description: "Strong believer" },
    { amount: 100, label: "Champion", icon: Crown, description: "Generous patron" },
    { amount: 500, label: "Guardian", icon: Sparkles, description: "Wisdom keeper" },
    { amount: 1000, label: "Luminary", icon: Globe, description: "Light bearer" }
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleContribute = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (amount && amount > 0 && onContribute) {
      onContribute(amount);
    }
  };

  const getContributionAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0;
  };

  return (
    <Card 
      className="border-purple-400/30 backdrop-blur-sm"
      style={{
        background: 'linear-gradient(135deg, rgba(30, 80, 90, 0.95) 0%, rgba(40, 120, 140, 0.9) 30%, rgba(50, 140, 160, 0.85) 70%, rgba(60, 160, 180, 0.95) 100%)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(64, 224, 208, 0.5)'
      }}
    >
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
            <Heart className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <CardTitle className="text-2xl font-bold text-white">
          Illuminating Ancient Wisdom for Everyone
        </CardTitle>
        
        <div className="text-purple-200 leading-relaxed space-y-3">
          <p>
            This project represents <strong>thousands of hours</strong> of dedicated work, drawing from 
            <strong> centuries of cumulative wisdom</strong> from master astrologers, numerologists, and ancient scholars.
          </p>
          
          <p>
            We've collaborated with <strong>volunteers and experts</strong> worldwide to make authentic astrological 
            knowledge accessible to everyone, breaking down barriers that have kept this wisdom exclusive for too long.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Mission Statement */}
        <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-400/50">
          <div className="flex items-start space-x-3">
            <Globe className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-purple-200 mb-2">Our Commitment</h4>
              <p className="text-sm text-purple-100">
                We want to keep Torchlight <strong>free for the world</strong> as long as we can. 
                However, maintaining servers, supporting volunteers, and expanding our knowledge base requires resources.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-200">1000+</div>
            <div className="text-xs text-purple-300">Hours of Work</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-200">100+</div>
            <div className="text-xs text-purple-300">Years of Wisdom</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-200">10+</div>
            <div className="text-xs text-purple-300">Ancient Systems</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-200">∞</div>
            <div className="text-xs text-purple-300">Free Access</div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Contribution Appeal */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Be the Torchlight in Someone's Journey
          </h3>
          
          <p className="text-sm text-purple-200 leading-relaxed">
            Your contribution helps us keep this ancient knowledge accessible to seekers worldwide. 
            Every donation, no matter the size, helps us illuminate more paths and reach more souls.
          </p>
        </div>

        {/* Contribution Amounts */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {predefinedAmounts.map(({ amount, label, icon: Icon, description }) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "outline"}
                onClick={() => handleAmountSelect(amount)}
                className={`h-auto p-3 flex flex-col items-center space-y-2 ${
                  selectedAmount === amount 
                    ? "bg-purple-600 hover:bg-purple-700 text-white" 
                    : "border-purple-400/50 hover:border-purple-300 hover:bg-purple-800/30 text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-semibold">${amount}</div>
                  <div className="text-xs opacity-80">{label}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200">
              Or choose your own amount:
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300">$</span>
                <Input
                  type="number"
                  placeholder="25.00"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="pl-8 border-purple-400/50 focus:border-purple-300 bg-purple-800/20 text-white"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Button */}
        <div className="space-y-4">
          <Button
            onClick={handleContribute}
            disabled={getContributionAmount() <= 0}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg"
          >
            <Gift className="h-5 w-5 mr-2" />
            Contribute ${getContributionAmount().toFixed(2)} with Love
          </Button>

          {/* No Pressure Message */}
          <div className="text-center">
            <p className="text-xs text-purple-300">
              Can't contribute right now? No worries! Sharing Torchlight with others who might benefit is equally valuable. ✨
            </p>
          </div>
        </div>

        {/* What Your Contribution Supports */}
        <div className="bg-purple-800/30 rounded-lg p-4 space-y-3 border border-purple-400/30">
          <h4 className="font-semibold text-purple-200 flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Your Contribution Supports:
          </h4>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-purple-100">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-purple-500" />
              <span>Ancient text research & translations</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-indigo-500" />
              <span>Expert astrologer consultations</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-purple-500" />
              <span>Free global accessibility</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-indigo-500" />
              <span>24/7 server maintenance</span>
            </div>
          </div>
        </div>

        {/* Gratitude Message */}
        <div className="text-center p-4 bg-purple-800/40 rounded-lg border border-purple-400/50">
          <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-purple-100">
            Thank you for being part of our mission to illuminate ancient wisdom for the modern world. 
            Your support helps us be the torchlight in someone's spiritual journey.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}