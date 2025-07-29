import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  Star, 
  Download, 
  Mail, 
  Users, 
  Zap, 
  Crown, 
  Infinity,
  Target,
  Calendar,
  Heart,
  BarChart3
} from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limits: string[];
  badge?: string;
  popular?: boolean;
  icon: any;
  buttonText: string;
  buttonVariant: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
}

export default function PricingTiers() {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const tiers: PricingTier[] = [
    {
      name: "Cosmic Explorer",
      price: "Free",
      period: "Forever",
      description: "Perfect for discovering your astrological blueprint across all systems",
      icon: Star,
      buttonText: "Start Free Journey",
      buttonVariant: "outline",
      features: [
        "Complete birth chart analysis (Western, Vedic, Chinese)",
        "AI chat assistant with all 7 astrological systems",
        "Daily cosmic weather and guidance",
        "Personality insights from multiple traditions",
        "Basic compatibility with 1 partner",
        "Educational content about all systems",
        "Swiss Ephemeris precision calculations"
      ],
      limits: [
        "View results on screen only",
        "5 AI conversations per day",
        "1 birth chart saved",
        "Basic system comparisons"
      ]
    },
    {
      name: "Cosmic Navigator",
      price: selectedPeriod === 'monthly' ? "$9" : "$79",
      period: selectedPeriod === 'monthly' ? "/month" : "/year",
      description: "Enhanced guidance with professional reports and unlimited access",
      icon: Target,
      buttonText: "Upgrade to Navigator",
      buttonVariant: "default",
      popular: true,
      badge: "Most Popular",
      features: [
        "Everything in Cosmic Explorer",
        "Unlimited AI conversations and analysis",
        "PDF reports with MyTorchlight branding",
        "Email delivery of personalized reports",
        "Advanced compatibility analysis (unlimited partners)",
        "System comparison charts and accuracy ratings",
        "Priority customer support",
        "Monthly cosmic planning guides"
      ],
      limits: [
        "Download up to 10 reports per month",
        "Email delivery included",
        "Advanced timing analysis"
      ]
    },
    {
      name: "Cosmic Professional",
      price: selectedPeriod === 'monthly' ? "$29" : "$299",
      period: selectedPeriod === 'monthly' ? "/month" : "/year",
      description: "Complete professional platform for serious practitioners and consultants",
      icon: Crown,
      buttonText: "Go Professional",
      buttonVariant: "default",
      badge: "Best Value",
      features: [
        "Everything in Cosmic Navigator",
        "Unlimited professional PDF reports",
        "White-label options for practitioners",
        "Advanced multi-person compatibility (groups, families)",
        "Detailed system accuracy comparisons",
        "Predictive timing analysis and life cycles",
        "API access for integration",
        "Custom branding options",
        "Priority consultation scheduling"
      ],
      limits: [
        "Unlimited everything",
        "Professional consultation tools",
        "Custom report templates"
      ]
    }
  ];

  const comparisonFeatures = [
    {
      category: "Core Analysis",
      features: [
        { name: "Birth Chart Generation", free: true, navigator: true, professional: true },
        { name: "All 7 Astrological Systems", free: true, navigator: true, professional: true },
        { name: "Swiss Ephemeris Precision", free: true, navigator: true, professional: true },
        { name: "AI Chat Assistant", free: "5/day", navigator: "Unlimited", professional: "Unlimited" },
        { name: "System Comparisons", free: "Basic", navigator: "Advanced", professional: "Complete" }
      ]
    },
    {
      category: "Reports & Downloads",
      features: [
        { name: "Screen Viewing", free: true, navigator: true, professional: true },
        { name: "PDF Downloads", free: false, navigator: "10/month", professional: "Unlimited" },
        { name: "Email Delivery", free: false, navigator: true, professional: true },
        { name: "Custom Branding", free: false, navigator: false, professional: true },
        { name: "White-label Options", free: false, navigator: false, professional: true }
      ]
    },
    {
      category: "Compatibility & Relationships",
      features: [
        { name: "Partner Compatibility", free: "1 partner", navigator: "Unlimited", professional: "Unlimited" },
        { name: "Astro-Matching Analysis", free: "Basic", navigator: "Advanced", professional: "Complete" },
        { name: "Group Compatibility", free: false, navigator: false, professional: true },
        { name: "Family Dynamics", free: false, navigator: "Limited", professional: "Complete" }
      ]
    },
    {
      category: "Professional Tools",
      features: [
        { name: "API Access", free: false, navigator: false, professional: true },
        { name: "Consultation Tools", free: false, navigator: false, professional: true },
        { name: "Client Management", free: false, navigator: false, professional: true },
        { name: "Custom Templates", free: false, navigator: false, professional: true }
      ]
    }
  ];

  const formatFeatureValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? <Check className="h-4 w-4 text-green-400" /> : <span className="text-gray-500">−</span>;
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div className="space-y-8">
      {/* Pricing Toggle */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-400 mb-4">Choose Your Cosmic Journey</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Unlock the wisdom of 7+ ancient astrological systems with modern AI precision. 
          From free exploration to professional practice tools.
        </p>
        
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm ${selectedPeriod === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setSelectedPeriod(selectedPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-purple-400 transition-transform ${
                selectedPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${selectedPeriod === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
            Yearly
          </span>
          {selectedPeriod === 'yearly' && (
            <Badge className="bg-green-600 text-white">Save 25%</Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {tiers.map((tier, index) => (
          <Card key={tier.name} className={`cosmic-card relative ${tier.popular ? 'ring-2 ring-yellow-400' : ''}`}>
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-500 text-black font-medium px-3 py-1">
                  {tier.badge}
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-3">
                <tier.icon className="h-8 w-8 text-purple-400" />
              </div>
              <CardTitle className="text-xl text-purple-400">{tier.name}</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white">{tier.price}</span>
                <span className="text-gray-400 ml-1">{tier.period}</span>
              </div>
              <CardDescription className="text-gray-300 mt-2">
                {tier.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button 
                className={`w-full cosmic-button ${tier.buttonVariant === 'outline' ? 'cosmic-button-outline' : ''}`}
                variant={tier.buttonVariant}
              >
                {tier.buttonText}
              </Button>

              <Separator className="bg-gray-700" />

              <div>
                <h4 className="text-sm font-medium text-green-400 mb-3">What's Included:</h4>
                <ul className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {tier.limits.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Limits:</h4>
                  <ul className="space-y-1">
                    {tier.limits.map((limit, i) => (
                      <li key={i} className="text-xs text-gray-500">
                        • {limit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="text-purple-400 text-center">Complete Feature Comparison</CardTitle>
          <CardDescription className="text-center">
            Detailed breakdown of features across all pricing tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Features</th>
                  <th className="text-center py-3 px-4 text-gray-300">Cosmic Explorer</th>
                  <th className="text-center py-3 px-4 text-purple-400">Cosmic Navigator</th>
                  <th className="text-center py-3 px-4 text-purple-400">Cosmic Professional</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((category) => (
                  <>
                    <tr key={category.category} className="border-b border-gray-700">
                      <td colSpan={4} className="py-3 px-4 text-cyan-400 font-medium text-sm bg-gray-800/50">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature, i) => (
                      <tr key={i} className="border-b border-gray-800">
                        <td className="py-2 px-4 text-gray-300 text-sm">{feature.name}</td>
                        <td className="py-2 px-4 text-center">{formatFeatureValue(feature.free)}</td>
                        <td className="py-2 px-4 text-center">{formatFeatureValue(feature.navigator)}</td>
                        <td className="py-2 px-4 text-center">{formatFeatureValue(feature.professional)}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Personal Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm mb-4">
              Perfect for individuals exploring their cosmic blueprint and seeking authentic self-understanding.
            </p>
            <div className="space-y-2">
              <div className="text-xs text-gray-400">Recommended: <span className="text-white">Cosmic Explorer (Free)</span></div>
              <div className="text-xs text-gray-400">Upgrade for: PDF reports and unlimited conversations</div>
            </div>
          </CardContent>
        </Card>

        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Relationships & Couples</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm mb-4">
              Ideal for couples seeking compatibility analysis and relationship guidance across multiple traditions.
            </p>
            <div className="space-y-2">
              <div className="text-xs text-gray-400">Recommended: <span className="text-white">Cosmic Navigator</span></div>
              <div className="text-xs text-gray-400">Features: Unlimited compatibility, PDF reports</div>
            </div>
          </CardContent>
        </Card>

        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Professional Practice</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm mb-4">
              Complete toolkit for astrologers, coaches, and consultants offering services to clients.
            </p>
            <div className="space-y-2">
              <div className="text-xs text-gray-400">Recommended: <span className="text-white">Cosmic Professional</span></div>
              <div className="text-xs text-gray-400">Features: White-label, API access, client tools</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}