# Payment Configuration Guide for Torchlight Astrology Platform

## Overview
This guide shows you exactly where and how to configure payments in the Torchlight application. The platform supports multiple payment methods and contribution systems.

## Current Payment Implementation Status

### ✅ What's Already Configured
- Stripe integration blueprints available
- Payment processing architecture ready
- Environment variable structure defined
- Database schema for user payments prepared

### ⚠️ What Needs Configuration
- Stripe API keys (currently missing)
- Payment endpoints activation
- Contribution modal integration
- Premium tier pricing setup

---

## 1. Environment Variables Configuration

### Required Environment Variables
Add these to your Replit Secrets or `.env` file:

```bash
# Stripe Configuration (Required for payments)
STRIPE_SECRET_KEY=sk_test_... # or sk_live_... for production
VITE_STRIPE_PUBLIC_KEY=pk_test_... # or pk_live_... for production

# Optional: Stripe Price IDs for subscription tiers
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PREMIUM=price_...
STRIPE_PRICE_ID_PROFESSIONAL=price_...
```

### How to Get Stripe Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your "Publishable key" (starts with `pk_`) → `VITE_STRIPE_PUBLIC_KEY`
3. Copy your "Secret key" (starts with `sk_`) → `STRIPE_SECRET_KEY`

---

## 2. Payment Routes Configuration

### Location: `server/routes.ts`

Add these payment endpoints to your routes file:

```typescript
import Stripe from "stripe";

// Initialize Stripe (add this near the top of routes.ts)
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ Stripe not configured - payments disabled');
} else {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}

// Add these endpoints to your registerRoutes function:

// One-time payment for premium reports
app.post("/api/create-payment-intent", isAuthenticated, async (req, res) => {
  try {
    const { amount, description = "Premium Astrology Report" } = req.body;
    
    if (!stripe) {
      return res.status(503).json({ error: "Payment processing unavailable" });
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      description,
      metadata: {
        userId: req.user.claims.sub,
        type: "premium_report"
      }
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    res.status(500).json({ 
      error: "Error creating payment intent: " + error.message 
    });
  }
});

// Contribution/donation endpoint
app.post("/api/create-contribution", isAuthenticated, async (req, res) => {
  try {
    const { amount, frequency = "one-time" } = req.body;
    
    if (!stripe) {
      return res.status(503).json({ error: "Payment processing unavailable" });
    }
    
    if (frequency === "monthly") {
      // Create subscription for monthly contributions
      const customer = await stripe.customers.create({
        email: req.user.claims.email,
        metadata: { userId: req.user.claims.sub }
      });
      
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price_data: {
          currency: 'usd',
          product_data: { name: 'Monthly Torchlight Contribution' },
          unit_amount: Math.round(amount * 100),
          recurring: { interval: 'month' }
        }}],
        expand: ['latest_invoice.payment_intent']
      });
      
      res.json({ 
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        subscriptionId: subscription.id
      });
    } else {
      // One-time contribution
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        description: "Torchlight Platform Contribution",
        metadata: {
          userId: req.user.claims.sub,
          type: "contribution"
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: "Error processing contribution: " + error.message 
    });
  }
});

// Webhook for payment confirmations
app.post("/api/stripe-webhook", express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'invoice.payment_succeeded':
        // Handle successful subscription payment
        console.log('Subscription payment succeeded:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({received: true});
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

---

## 3. Frontend Payment Components

### Location: `client/src/components/PaymentModal.tsx`

Create this new component for handling payments:

```typescript
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function PaymentForm({ amount, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setProcessing(true);
    
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your contribution!",
      });
      onSuccess();
    }
    
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="flex gap-2">
        <Button 
          type="submit" 
          disabled={!stripe || processing}
          className="flex-1"
        >
          {processing ? "Processing..." : `Pay $${amount}`}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={processing}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  amount, 
  description = "Premium Report"
}: {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description?: string;
}) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const { toast } = useToast();

  const initializePayment = async () => {
    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount,
        description
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment",
        variant: "destructive",
      });
    }
  };

  const handleSuccess = () => {
    onClose();
    // Refresh user data or redirect as needed
  };

  if (!clientSecret && isOpen) {
    initializePayment();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>
        
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <PaymentForm
              amount={amount}
              onSuccess={handleSuccess}
              onCancel={onClose}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

---

## 4. Contribution System Integration

### Location: `client/src/components/ContributionModal.tsx`

Update your existing contribution modal to include payment processing:

```typescript
// Add to your existing ContributionModal component:

const handleContribution = async (amount: number, frequency: 'one-time' | 'monthly') => {
  try {
    const response = await apiRequest("POST", "/api/create-contribution", {
      amount,
      frequency
    });
    const data = await response.json();
    
    // Initialize Stripe payment with the client secret
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);
    
    if (stripe && data.clientSecret) {
      const { error } = await stripe.confirmPayment({
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/contribution-success`,
        },
      });
      
      if (!error) {
        toast({
          title: "Contribution Successful",
          description: `Thank you for your ${frequency} contribution of $${amount}!`,
        });
        onClose();
      }
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to process contribution",
      variant: "destructive",
    });
  }
};
```

---

## 5. Database Schema Updates

### Location: `shared/schema.ts`

Add payment tracking tables:

```typescript
// Add these tables to your schema:

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id").unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("usd"),
  status: varchar("status").notNull(), // 'pending', 'succeeded', 'failed'
  type: varchar("type").notNull(), // 'contribution', 'premium_report', 'subscription'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  stripeSubscriptionId: varchar("stripe_subscription_id").unique(),
  stripeCustomerId: varchar("stripe_customer_id"),
  status: varchar("status").notNull(), // 'active', 'canceled', 'past_due'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  interval: varchar("interval").notNull(), // 'month', 'year'
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

---

## 6. Package Dependencies

### Add to `package.json`:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js stripe
```

---

## 7. Quick Setup Steps

1. **Get Stripe Keys**: Visit https://dashboard.stripe.com/apikeys
2. **Add Environment Variables**: Add `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY` to Replit Secrets
3. **Install Dependencies**: Run `npm install @stripe/stripe-js @stripe/react-stripe-js stripe`
4. **Add Payment Routes**: Copy the routes code to `server/routes.ts`
5. **Create Payment Components**: Create the payment modal components
6. **Update Database**: Run `npm run db:push` to apply schema changes
7. **Test**: Use Stripe test cards to verify payments work

---

## Test Cards for Development

Use these test card numbers in development:
- **Successful Payment**: 4242 4242 4242 4242
- **Declined Payment**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

---

## Current Integration Points

### Where payments are referenced in existing code:
1. **Contribution Modal**: `client/src/hooks/useDonationModal.ts`
2. **Home Page**: Contribution buttons and modal triggers
3. **Personal Page**: Premium report upgrade options
4. **Server Routes**: Payment processing endpoints (need to be added)

### Next Steps:
1. Configure Stripe environment variables
2. Add payment processing routes to server
3. Install Stripe dependencies
4. Test payment flow with test cards
5. Configure webhooks for payment confirmations

The payment system is architecturally ready - it just needs the Stripe configuration and route implementation to become fully functional.