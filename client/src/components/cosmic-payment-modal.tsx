import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard,
  Wallet,
  Globe,
  Smartphone,
  Bitcoin,
  QrCode,
  ArrowRight,
  Check,
  Copy,
  Banknote
} from "lucide-react";

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
    icon: <CreditCard className="w-5 h-5 text-purple-300" />,
    description: "Visa, Mastercard, American Express - worldwide acceptance",
    regions: ["Global"],
    processingTime: "Instant",
    fees: "2.9% + $0.30",
    popularity: "32% global share"
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <Wallet className="w-5 h-5 text-purple-300" />,
    description: "Digital wallet with 432M users, 200+ countries",
    regions: ["Global"],
    processingTime: "Instant", 
    fees: "2.9% + $0.30",
    popularity: "47% online share"
  },
  {
    id: "apple_pay",
    name: "Apple Pay",
    icon: <Smartphone className="w-5 h-5 text-purple-300" />,
    description: "Touch ID/Face ID payments, 90% US retailer acceptance",
    regions: ["78+ countries"],
    processingTime: "Instant",
    fees: "Same as card",
    popularity: "14% global share"
  },
  {
    id: "google_pay",
    name: "Google Pay",
    icon: <Globe className="w-5 h-5 text-purple-300" />,
    description: "Android wallet, 250M users, 86 countries",
    regions: ["86 countries"],
    processingTime: "Instant",
    fees: "Same as card",
    popularity: "9% global share"
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

interface CosmicPaymentModalProps {
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
        <h3 className="text-xl font-bold text-white mb-2">
          Send {selectedCrypto.symbol} Payment
        </h3>
        <p className="text-purple-200">
          Send exactly <span className="font-bold text-yellow-400">${amount} USDT</span> to the address below
        </p>
      </div>

      {/* Payment Details */}
      <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 p-6 rounded-xl border border-yellow-500/50">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-purple-200">Amount:</span>
            <span className="font-bold text-lg text-white">${amount} USDT</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-purple-200">Network:</span>
            <Badge variant="outline" className="text-purple-300 border-yellow-500">
              {selectedCrypto.network}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-purple-200">Network Fee:</span>
            <span className="text-green-400 font-medium">{selectedCrypto.fees}</span>
          </div>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-purple-200">
          Send to this {selectedCrypto.symbol} address:
        </label>
        <div className="flex gap-2">
          <Input
            value={selectedCrypto.address}
            readOnly
            className="font-mono text-sm bg-purple-800/40 border-yellow-500/50 text-white"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={copyAddress}
            className="flex-shrink-0 border-yellow-500/50 text-white hover:bg-yellow-600"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* QR Code Placeholder */}
      <div className="bg-purple-800/40 p-8 rounded-xl border-2 border-dashed border-yellow-500/50">
        <div className="text-center space-y-3">
          <QrCode className="w-16 h-16 mx-auto text-purple-300" />
          <p className="text-sm text-purple-200">
            QR Code for mobile wallet scanning
          </p>
          <p className="text-xs text-purple-300">
            (QR generation requires backend integration)
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-400/50">
        <div className="text-sm space-y-2">
          <p className="font-medium text-yellow-200">Important Instructions:</p>
          <ul className="list-disc list-inside space-y-1 text-yellow-300">
            <li>Send exactly ${amount} USDT on {selectedCrypto.network} network</li>
            <li>Allow {selectedCrypto.confirmations} for confirmation</li>
            <li>Double-check the address before sending</li>
            <li>Contact support if payment doesn't appear in 30 minutes</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex-1 border-yellow-500/50 text-white hover:bg-yellow-600"
        >
          ← Choose Different Method
        </Button>
        <Button 
          onClick={onComplete} 
          className="flex-1 bg-gradient-to-r from-yellow-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          I've Sent Payment
        </Button>
      </div>
    </div>
  );
}

export default function CosmicPaymentModal({ 
  isOpen, 
  onClose, 
  amount, 
  purpose 
}: CosmicPaymentModalProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<typeof cryptoOptions[0] | null>(null);
  const [step, setStep] = useState<'select' | 'crypto'>('select');
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setSelectedCrypto(null);
      setStep('select');
    }
  }, [isOpen]);

  const handleMethodSelect = (methodId: string) => {
    if (methodId === 'paypal') {
      window.open(`https://paypal.me/torchlight/${amount}`, '_blank');
      toast({
        title: "Redirecting to PayPal",
        description: "You'll be taken to PayPal to complete your contribution",
      });
      onClose();
    } else {
      toast({
        title: "Coming Soon!",
        description: `${paymentMethods.find(m => m.id === methodId)?.name} integration is being finalized. For now, please use PayPal or crypto.`,
        variant: "default",
      });
    }
  };

  const handleCryptoSelect = (crypto: typeof cryptoOptions[0]) => {
    setSelectedCrypto(crypto);
    setStep('crypto');
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
        <TabsList className="grid w-full grid-cols-2 bg-purple-800/40">
          <TabsTrigger value="popular" className="text-white">Most Popular</TabsTrigger>
          <TabsTrigger value="crypto" className="text-white">Cryptocurrency</TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="space-y-3 mt-6">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 border-yellow-500/30 hover:border-purple-300 bg-purple-800/40 backdrop-blur-sm"
              onClick={() => handleMethodSelect(method.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-yellow-600/50 to-pink-600/50 rounded-full flex items-center justify-center">
                    {method.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">
                        {method.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs bg-yellow-600/50 text-purple-200">
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
                  : 'border-yellow-500/30 hover:border-purple-300'
              }`}
              onClick={() => handleCryptoSelect(crypto)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <Bitcoin className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{crypto.name}</h3>
                      {crypto.recommended && (
                        <Badge className="text-xs bg-green-500 text-white">Recommended</Badge>
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
                  <ArrowRight className="w-5 h-5 text-purple-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-4 bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl border border-yellow-500/30 shadow-2xl max-h-[90vh] overflow-y-auto text-white">
        <DialogHeader>
          <DialogTitle className="sr-only">Cosmic Payment Options</DialogTitle>
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