import { useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { Link } from "wouter";
import ContributionSection from "@/components/contribution-section";

// Initialize Stripe
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const ContributeForm = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Payment system not ready",
        description: "Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/contribution-success',
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "Something went wrong with your payment.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thank You!",
          description: "Your generous contribution has been processed successfully.",
        });
      }
    } catch (err) {
      toast({
        title: "Payment Error", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
          Contributing ${amount.toFixed(2)}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Your contribution helps keep ancient wisdom accessible to everyone worldwide.
        </p>
      </div>
      
      <PaymentElement />
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold"
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            <span>Processing...</span>
          </div>
        ) : (
          <>
            <Heart className="h-5 w-5 mr-2" />
            Complete Contribution
          </>
        )}
      </Button>
    </form>
  );
};

export default function ContributePage() {
  const [clientSecret, setClientSecret] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleContributeAmount = async (amount: number) => {
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      toast({
        title: "Thank You for Your Interest!",
        description: "Payment system is being configured. For now, please share Torchlight with others who might benefit from ancient wisdom.",
        variant: "default",
      });
      return;
    }

    setIsLoading(true);
    setSelectedAmount(amount);

    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", { 
        amount: amount,
        description: `Torchlight Contribution - $${amount}`
      });
      
      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error("Failed to create payment intent");
      }
    } catch (error) {
      console.error("Payment setup error:", error);
      toast({
        title: "Payment Setup Failed",
        description: "Unable to set up payment. Please try again later.",
        variant: "destructive",
      });
      setSelectedAmount(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
            <p className="text-gray-600">Setting up your contribution...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (clientSecret && selectedAmount && stripePromise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => {
                setClientSecret("");
                setSelectedAmount(null);
              }}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contribution Options
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Complete Your Contribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#7c3aed',
                    }
                  }
                }}
              >
                <ContributeForm amount={selectedAmount} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Torchlight
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <ContributionSection onContribute={handleContributeAmount} />

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm">
            Torchlight is committed to keeping ancient wisdom accessible to all. 
            Your support helps us maintain this mission while covering essential costs.
          </p>
        </div>
      </div>
    </div>
  );
}