import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { 
  CreditCard,
  Wallet,
  Globe,
  Smartphone,
  Bitcoin,
  DollarSign,
  QrCode,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Banknote
} from "lucide-react";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  regions: string[];
  processingTime: string;
  fees: string;
  popularity: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "stripe",
    name: "Credit/Debit Cards",
    icon: <CreditCard className="w-5 h-5" />,
    description: "Visa, Mastercard, American Express - worldwide acceptance",
    regions: ["Global"],
    processingTime: "Instant",
    fees: "2.9% + $0.30",
    popularity: "32% global share"
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <Wallet className="w-5 h-5" />,
    description: "Digital wallet with 432M users, 200+ countries",
    regions: ["Global"],
    processingTime: "Instant",
    fees: "2.9% + $0.30",
    popularity: "47% online share"
  },
  {
    id: "apple_pay",
    name: "Apple Pay",
    icon: <Smartphone className="w-5 h-5" />,
    description: "Touch ID/Face ID payments, 90% US retailer acceptance",
    regions: ["78+ countries"],
    processingTime: "Instant",
    fees: "Same as card",
    popularity: "14% global share"
  },
  {
    id: "google_pay",
    name: "Google Pay",
    icon: <Globe className="w-5 h-5" />,
    description: "Android wallet, 250M users, 86 countries",
    regions: ["86 countries"],
    processingTime: "Instant",
    fees: "Same as card",
    popularity: "9% global share"
  },
  {
    id: "usdt_crypto",
    name: "USDT (Crypto)",
    icon: <Bitcoin className="w-5 h-5" />,
    description: "Stable cryptocurrency, $0.01 fees, global access",
    regions: ["Worldwide"],
    processingTime: "1-5 minutes",
    fees: "$0.01 (TRC-20)",
    popularity: "70% stablecoin share"
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: <Banknote className="w-5 h-5" />,
    description: "Direct bank transfers, SEPA, ACH, UPI, PIX",
    regions: ["Regional"],
    processingTime: "1-3 days",
    fees: "Low/Free",
    popularity: "7% global share"
  }
];

const cryptoOptions = [
  {
    symbol: "USDT",
    name: "Tether (TRC-20)",
    network: "Tron",
    address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", // Demo address
    fees: "$0.01",
    confirmations: "1-2 minutes",
    recommended: true
  },
  {
    symbol: "USDT",
    name: "Tether (ERC-20)",
    network: "Ethereum",
    address: "0x742d35cc6634C0532925a3b8d0c3E3c4c4c0aB0a", // Demo address
    fees: "$5-20",
    confirmations: "2-10 minutes",
    recommended: false
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    network: "Bitcoin",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", // Demo address
    fees: "$5-50",
    confirmations: "10-60 minutes",
    recommended: false
  }
];

interface UniversalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  purpose: string;
}

function CryptoPaymentView({ 
  amount, 
  selectedCrypto, 
  onBack, 
  onComplete 
}: { 
  amount: number; 
  selectedCrypto: typeof cryptoOptions[0]; 
  onBack: () => void;
  onComplete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyAddress = () => {
    navigator.clipboard.writeText(selectedCrypto.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Address Copied!",
      description: "Wallet address has been copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Send {selectedCrypto.symbol} Payment
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Send exactly <span className="font-bold text-purple-600">${amount} USDT</span> to the address below
        </p>
      </div>

      {/* Payment Details */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-xl border border-purple-200/50">
        <div className="space-y-4">
          {/* Amount */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Amount:</span>
            <span className="font-bold text-lg">${amount} USDT</span>
          </div>
          
          {/* Network */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Network:</span>
            <Badge variant="outline" className="text-purple-600">
              {selectedCrypto.network}
            </Badge>
          </div>
          
          {/* Fees */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Network Fee:</span>
            <span className="text-green-600 font-medium">{selectedCrypto.fees}</span>
          </div>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Send to this {selectedCrypto.symbol} address:
        </label>
        <div className="flex gap-2">
          <Input
            value={selectedCrypto.address}
            readOnly
            className="font-mono text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={copyAddress}
            className="flex-shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* QR Code Placeholder */}
      <div className="bg-slate-800/90 p-8 rounded-xl border-2 border-dashed border-purple-400/50">
        <div className="text-center space-y-3">
          <QrCode className="w-16 h-16 mx-auto text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            QR Code for mobile wallet scanning
          </p>
          <p className="text-xs text-gray-500">
            (QR generation requires backend integration)
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg border border-yellow-200/50">
        <div className="text-sm space-y-2">
          <p className="font-medium text-yellow-800 dark:text-yellow-200">Important Instructions:</p>
          <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
            <li>Send exactly ${amount} USDT on {selectedCrypto.network} network</li>
            <li>Allow {selectedCrypto.confirmations} for confirmation</li>
            <li>Double-check the address before sending</li>
            <li>Contact support if payment doesn't appear in 30 minutes</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          ← Choose Different Method
        </Button>
        <Button onClick={onComplete} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
          I've Sent Payment
        </Button>
      </div>
    </div>
  );
}

export default function UniversalPaymentModal({ 
  isOpen, 
  onClose, 
  amount, 
  purpose 
}: UniversalPaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<typeof cryptoOptions[0] | null>(null);
  const [step, setStep] = useState<'select' | 'crypto' | 'stripe'>('select');
  const { toast } = useToast();

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedMethod(null);
      setSelectedCrypto(null);
      setStep('select');
    }
  }, [isOpen]);

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    
    if (methodId === 'usdt_crypto') {
      setStep('crypto');
    } else if (methodId === 'stripe') {
      setStep('stripe');
    } else if (methodId === 'paypal') {
      // Redirect to PayPal
      window.open(`https://paypal.me/torchlight/${amount}`, '_blank');
      toast({
        title: "Redirecting to PayPal",
        description: "You'll be taken to PayPal to complete your contribution",
      });
      onClose();
    } else {
      toast({
        title: "Coming Soon!",
        description: `${paymentMethods.find(m => m.id === methodId)?.name} integration is being finalized. For now, please use cards or crypto.`,
        variant: "default",
      });
    }
  };

  const handleCryptoSelect = (crypto: typeof cryptoOptions[0]) => {
    setSelectedCrypto(crypto);
  };

  const handlePaymentComplete = () => {
    toast({
      title: "Thank You! 🌟",
      description: "Your contribution helps keep ancient wisdom accessible to everyone worldwide.",
      variant: "default",
    });
    onClose();
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Choose Payment Method
        </h2>
        <p className="text-purple-200">
          Contributing <span className="font-bold text-yellow-400">${amount}</span> for {purpose}
        </p>
      </div>

      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="popular">Most Popular</TabsTrigger>
          <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="space-y-3 mt-6">
          {paymentMethods.filter(m => 
            ['stripe', 'paypal', 'apple_pay', 'google_pay'].includes(m.id)
          ).map((method) => (
            <Card
              key={method.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 border-purple-400/30 hover:border-purple-300 bg-purple-800/40 backdrop-blur-sm"
              onClick={() => handleMethodSelect(method.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full flex items-center justify-center">
                    {method.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {method.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {method.popularity}
                      </Badge>
                    </div>
                    <p className="text-sm text-purple-200 mb-2">
                      {method.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-purple-300">
                      <span>⚡ {method.processingTime}</span>
                      <span>💳 {method.fees}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4 mt-6">
          <div className="text-sm text-purple-200 mb-4">
            Cryptocurrency payments are perfect for international contributors with lowest fees.
          </div>
          {cryptoOptions.map((crypto) => (
            <Card
              key={crypto.symbol + crypto.network}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 bg-purple-800/40 backdrop-blur-sm ${
                crypto.recommended 
                  ? 'border-green-400/50 bg-green-500/20' 
                  : 'border-purple-400/30 hover:border-purple-300'
              }`}
              onClick={() => {
                setSelectedCrypto(crypto);
                setStep('crypto');
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <Bitcoin className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{crypto.name}</h3>
                      {crypto.recommended && (
                        <Badge className="text-xs bg-green-500">Recommended</Badge>
                      )}
                    </div>
                    <p className="text-sm text-purple-200 mb-1">
                      Network: {crypto.network}
                    </p>
                    <div className="flex gap-4 text-xs text-purple-300">
                      <span>⚡ {crypto.confirmations}</span>
                      <span>💰 {crypto.fees}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="regional" className="space-y-3 mt-6">
          {paymentMethods.filter(m => m.id === 'bank_transfer').map((method) => (
            <Card
              key={method.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-purple-300"
              onClick={() => handleMethodSelect(method.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full flex items-center justify-center">
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {method.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {method.popularity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {method.description}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>⏱️ {method.processingTime}</span>
                      <span>💸 {method.fees}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="text-center text-sm text-gray-500 mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p>More regional options coming soon:</p>
            <p className="mt-1">UPI (India) • PIX (Brazil) • SEPA (Europe) • WeChat/Alipay (China)</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-4 bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl border border-purple-400/30 shadow-2xl max-h-[90vh] overflow-y-auto text-white">
        <DialogHeader>
          <DialogTitle className="sr-only">Universal Payment Options</DialogTitle>
        </DialogHeader>
        
        {step === 'select' && renderMethodSelection()}
        {step === 'crypto' && selectedCrypto && (
          <CryptoPaymentView
            amount={amount}
            selectedCrypto={selectedCrypto}
            onBack={() => setStep('select')}
            onComplete={handlePaymentComplete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}