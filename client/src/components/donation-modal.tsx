import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { 
  Heart, 
  Star, 
  Globe, 
  BookOpen, 
  Users, 
  Sparkles, 
  Gift,
  Clock,
  Target,
  Zap,
  Shield,
  Award
} from "lucide-react";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string; // What triggered the modal (e.g., 'chart_generated', 'feature_used', 'time_spent')
}

// Inspirational messaging based on trigger
const getTriggerMessage = (trigger?: string) => {
  switch (trigger) {
    case 'chart_generated':
      return {
        title: "Your Cosmic Journey Has Begun ✨",
        subtitle: "You just experienced ancient wisdom that took centuries to develop",
        icon: <Sparkles className="w-6 h-6 text-yellow-400" />
      };
    case 'feature_used':
      return {
        title: "The Universe Is Speaking to You 🌟",
        subtitle: "Thousands of hours of research brought you this insight",
        icon: <Star className="w-6 h-6 text-purple-400" />
      };
    case 'time_spent':
      return {
        title: "You're Part of Something Beautiful 🌍",
        subtitle: "Join seekers worldwide making ancient knowledge accessible",
        icon: <Globe className="w-6 h-6 text-blue-400" />
      };
    default:
      return {
        title: "Be the Torchlight in Someone's Journey 🕯️",
        subtitle: "Help us keep this wisdom free for everyone, everywhere",
        icon: <Heart className="w-6 h-6 text-pink-400" />
      };
  }
};

// Suggested amounts with psychological framing
const donationTiers = [
  {
    amount: 5,
    label: "Cosmic Coffee",
    description: "Powers our servers for a day",
    icon: <Gift className="w-4 h-4" />,
    color: "from-blue-400 to-cyan-400"
  },
  {
    amount: 25,
    label: "Wisdom Keeper",
    description: "Supports volunteer researchers",
    icon: <BookOpen className="w-4 h-4" />,
    color: "from-purple-400 to-pink-400"
  },
  {
    amount: 50,
    label: "Light Bearer",
    description: "Enables mobile app development",
    icon: <Zap className="w-4 h-4" />,
    color: "from-yellow-400 to-orange-400"
  },
  {
    amount: 100,
    label: "Cosmic Guardian",
    description: "Funds ancient text digitization",
    icon: <Shield className="w-4 h-4" />,
    color: "from-green-400 to-emerald-400"
  },
  {
    amount: 250,
    label: "Universal Guide",
    description: "Supports expert astrological research",
    icon: <Target className="w-4 h-4" />,
    color: "from-indigo-400 to-purple-400"
  },
  {
    amount: 500,
    label: "Celestial Patron",
    description: "Enables free access for entire communities",
    icon: <Award className="w-4 h-4" />,
    color: "from-pink-400 to-rose-400"
  }
];

// Impact statistics
const impactStats = [
  { icon: <Users className="w-5 h-5" />, stat: "50,000+", label: "Lives Touched" },
  { icon: <Globe className="w-5 h-5" />, stat: "127", label: "Countries Reached" },
  { icon: <Clock className="w-5 h-5" />, stat: "5,000+", label: "Hours Invested" },
  { icon: <BookOpen className="w-5 h-5" />, stat: "2,000+", label: "Years of Wisdom" }
];

function PaymentForm({ 
  amount, 
  onSuccess, 
  onCancel 
}: { 
  amount: number; 
  onSuccess: () => void; 
  onCancel: () => void; 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/contribute?success=true",
      },
    });

    if (error) {
      toast({
        title: "Payment Issue",
        description: error.message,
        variant: "destructive",
      });
    } else {
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-purple-800/30 p-4 rounded-xl border border-purple-400/50">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            ${amount}
          </div>
          <div className="text-sm text-purple-600/80 dark:text-purple-400/80">
            Your contribution makes ancient wisdom accessible
          </div>
        </div>
        
        <PaymentElement 
          options={{
            layout: "tabs"
          }}
        />
      </div>
      
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Maybe Later
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isLoading ? "Processing..." : `Contribute $${amount}`}
        </Button>
      </div>
    </form>
  );
}

export default function DonationModal({ isOpen, onClose, trigger }: DonationModalProps) {
  const [step, setStep] = useState<'inspiration' | 'amount' | 'payment'>('inspiration');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { toast } = useToast();

  const triggerMessage = getTriggerMessage(trigger);

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setStep('inspiration');
      setSelectedAmount(null);
      setCustomAmount("");
      setClientSecret(null);
    }
  }, [isOpen]);

  const handleAmountSelect = async (amount: number) => {
    setSelectedAmount(amount);
    setStep('payment');
    
    // For demo purposes, show the payment selection
    // In production, this could redirect to universal payment modal

    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount,
        description: `Torchlight Contribution - $${amount}`
      });

      if (response.ok) {
        const data = await response.json();
        setClientSecret(data.clientSecret);
        setStep('payment');
      } else {
        throw new Error('Payment intent creation failed');
      }
    } catch (error) {
      toast({
        title: "Thank You for Your Interest!",
        description: "There was an issue setting up payment. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleCustomAmount = () => {
    const amount = parseFloat(customAmount);
    if (amount >= 1) {
      handleAmountSelect(amount);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "You Are Now a Torchlight! ✨",
      description: "Your contribution helps keep ancient wisdom accessible to everyone. Thank you for lighting the way!",
      variant: "default",
    });
    onClose();
  };

  const renderInspirationStep = () => (
    <div className="space-y-6">
      {/* Hero Message */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          {triggerMessage.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {triggerMessage.title}
          </h2>
          <p className="text-purple-200 mt-2">
            {triggerMessage.subtitle}
          </p>
        </div>
      </div>

      {/* Impact Statistics */}
      <div className="grid grid-cols-2 gap-4">
        {impactStats.map((stat, index) => (
          <div key={index} className="text-center p-3 bg-gradient-to-br from-purple-800/20 to-pink-800/20 rounded-xl border border-purple-400/30">
            <div className="flex justify-center text-purple-400 mb-1">
              {stat.icon}
            </div>
            <div className="font-bold text-lg text-purple-200">
              {stat.stat}
            </div>
            <div className="text-xs text-purple-300">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-purple-800/20 to-pink-800/20 p-6 rounded-xl border border-purple-400/30">
        <div className="text-center space-y-3">
          <div className="text-purple-200 font-semibold">
            Our Sacred Mission
          </div>
          <p className="text-sm text-purple-100 leading-relaxed">
            For thousands of years, ancient wisdom was locked away in temples and libraries. 
            Today, we're making it freely accessible to anyone with curiosity and an internet connection. 
            Your contribution ensures this knowledge remains free for seekers worldwide.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Continue Exploring
        </Button>
        <Button
          onClick={() => setStep('amount')}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Light the Way
        </Button>
      </div>
    </div>
  );

  const renderAmountStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">
          Choose Your Contribution
        </h2>
        <p className="text-purple-200 text-sm">
          Every amount helps keep ancient wisdom accessible to all
        </p>
      </div>

      {/* Donation Tiers */}
      <div className="grid grid-cols-2 gap-3">
        {donationTiers.map((tier) => (
          <Card
            key={tier.amount}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-300"
            onClick={() => handleAmountSelect(tier.amount)}
          >
            <CardContent className="p-4 text-center">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${tier.color} text-white mb-2`}>
                {tier.icon}
              </div>
              <div className="font-bold text-lg">${tier.amount}</div>
              <div className="text-xs font-medium text-purple-200 mb-1">
                {tier.label}
              </div>
              <div className="text-xs text-purple-300">
                {tier.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Amount */}
      <div className="space-y-3">
        <div className="text-center text-sm text-purple-200">
          Or choose your own amount
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300">$</span>
            <Input
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="pl-8"
              min="1"
              step="0.01"
            />
          </div>
          <Button
            onClick={handleCustomAmount}
            disabled={!customAmount || parseFloat(customAmount) < 1}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Contribute
          </Button>
        </div>
      </div>

      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => setStep('inspiration')}
        className="w-full"
      >
        ← Back
      </Button>
    </div>
  );

  const renderPaymentStep = () => {
    if (!clientSecret || !stripePromise) {
      return (
        <div className="text-center py-8">
          <div className="text-purple-200">
            Setting up secure payment...
          </div>
        </div>
      );
    }

    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm
          amount={selectedAmount!}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setStep('amount')}
        />
      </Elements>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader className="text-center">
          <DialogTitle className="sr-only">Contribution Modal</DialogTitle>
        </DialogHeader>
        
        {step === 'inspiration' && renderInspirationStep()}
        {step === 'amount' && renderAmountStep()}
        {step === 'payment' && renderPaymentStep()}
      </DialogContent>
    </Dialog>
  );
}