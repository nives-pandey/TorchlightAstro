// client/src/components/contribution/PaymentGatewayIcons.tsx
import React from 'react';

const icons: { [key: string]: React.ReactNode } = {
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
  methods: ('applePay' | 'googlePay' | 'payPal' | 'card')[];
}

const PaymentGatewayIcons: React.FC<PaymentGatewayIconsProps> = ({ methods }) => {
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <p className="text-sm text-warm-gray mr-2">We accept:</p>
      {methods.map((method) => (
        <div key={method} className="rounded-md overflow-hidden bg-white/10 flex items-center justify-center w-12 h-8">
          {icons[method]}
        </div>
      ))}
    </div>
  );
};

export default PaymentGatewayIcons;