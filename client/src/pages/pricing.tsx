import PricingTiers from "@/components/pricing-tiers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  Download,
  Mail,
  Check,
  ArrowRight
} from "lucide-react";

export default function Pricing() {
  const advantages = [
    {
      icon: Star,
      title: "Zero-Budget Excellence",
      description: "LLM-powered analysis rivals $25,000+ in specialized API subscriptions",
      color: "text-yellow-400"
    },
    {
      icon: Globe,
      title: "7+ Astrological Systems",
      description: "Western, Vedic, Chinese, Human Design, Numerology, KP, and more integrated",
      color: "text-blue-400"
    },
    {
      icon: Zap,
      title: "Swiss Ephemeris Precision",
      description: "Professional astronomical calculations without expensive software costs",
      color: "text-purple-400"
    },
    {
      icon: Shield,
      title: "Cross-System Synthesis",
      description: "Unique multi-tradition analysis impossible with single-system APIs",
      color: "text-green-400"
    }
  ];

  const outputFormats = [
    {
      format: "Screen Viewing",
      description: "Interactive, color-coded analysis with conversation continuations",
      free: true,
      premium: true,
      professional: true,
      features: [
        "8-section structured output",
        "Interactive follow-up questions", 
        "Color-coded insights",
        "Real-time processing animations"
      ]
    },
    {
      format: "PDF Reports",
      description: "Professional reports with MyTorchlight branding and comprehensive analysis",
      free: false,
      premium: "10/month",
      professional: "Unlimited",
      features: [
        "MyTorchlight logo and branding",
        "Complete system comparisons",
        "Accuracy ratings for each system",
        "Downloadable and printable"
      ]
    },
    {
      format: "Email Delivery",
      description: "Personalized reports delivered directly to your inbox",
      free: false,
      premium: true,
      professional: true,
      features: [
        "Automated email delivery",
        "Custom subject lines",
        "HTML and PDF attachments",
        "Scheduled delivery options"
      ]
    },
    {
      format: "White-Label Reports", 
      description: "Custom branding for professional practitioners",
      free: false,
      premium: false,
      professional: true,
      features: [
        "Your logo and branding",
        "Custom color schemes",
        "Personalized headers/footers",
        "Client-facing professional format"
      ]
    }
  ];

  const comparisonFeatures = [
    {
      category: "System Analysis",
      items: [
        "Western Astrology accuracy comparison",
        "Vedic Jyotish precision ratings",
        "Chinese Five Element synthesis",
        "Human Design strategy alignment",
        "Numerology life path correlation",
        "Cross-system compatibility scoring"
      ]
    },
    {
      category: "Compatibility Matching",
      items: [
        "Multi-partner astro-matching",
        "Group compatibility dynamics",
        "Family constellation analysis",
        "Business partnership guidance",
        "Friendship compatibility scoring",
        "Romantic synastry deep-dive"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="cosmic-logo text-4xl">🔆</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
              MyTorchlight Pricing
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Professional-grade astrological analysis powered by LLM intelligence. 
            Seven ancient systems unified with modern precision.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 mb-8">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Swiss Ephemeris Precision</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>7+ Ancient Systems</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>AI-Powered Cross-System Synthesis</span>
            </div>
          </div>
        </div>

        {/* Competitive Advantages */}
        <Card className="cosmic-card mb-12">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-center">Why MyTorchlight Beats Expensive Alternatives</CardTitle>
            <CardDescription className="text-center">
              Our zero-budget LLM approach provides superior value compared to traditional astrology services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advantages.map((advantage) => (
                <div key={advantage.title} className="text-center">
                  <advantage.icon className={`h-12 w-12 ${advantage.color} mx-auto mb-3`} />
                  <h3 className="font-medium text-white mb-2">{advantage.title}</h3>
                  <p className="text-sm text-gray-400">{advantage.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gray-800/50 rounded-lg text-center">
              <h4 className="text-lg font-medium text-yellow-400 mb-2">Value Comparison</h4>
              <p className="text-gray-300 text-sm mb-4">
                Traditional astrology software and API subscriptions cost $25,000-$50,000 annually. 
                Our LLM approach provides <span className="text-green-400 font-medium">superior cross-system analysis</span> with unlimited usage.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-red-400 font-medium">Traditional APIs</div>
                  <ul className="text-gray-400 text-xs mt-2 space-y-1">
                    <li>• Single system focus</li>
                    <li>• Per-calculation costs</li>
                    <li>• No educational explanations</li>
                    <li>• Limited lifestyle integration</li>
                  </ul>
                </div>
                <div>
                  <div className="text-green-400 font-medium">MyTorchlight LLM</div>
                  <ul className="text-gray-400 text-xs mt-2 space-y-1">
                    <li>• 7+ systems integrated</li>
                    <li>• Unlimited calculations</li>
                    <li>• Educational depth</li>
                    <li>• Complete lifestyle guidance</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Output Formats */}
        <Card className="cosmic-card mb-12">
          <CardHeader>
            <CardTitle className="text-yellow-400">Output Formats & Delivery Options</CardTitle>
            <CardDescription>
              Choose how you want to receive your comprehensive astrological analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              {outputFormats.map((output) => (
                <div key={output.format} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">{output.format}</h3>
                    <div className="flex space-x-2">
                      {output.free && <Badge variant="outline" className="text-green-400 border-green-400">Free</Badge>}
                      {output.premium && typeof output.premium === 'boolean' && (
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400">Premium</Badge>
                      )}
                      {output.premium && typeof output.premium === 'string' && (
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400">{output.premium}</Badge>
                      )}
                      {output.professional && (
                        <Badge variant="outline" className="text-purple-400 border-purple-400">Pro</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{output.description}</p>
                  <ul className="space-y-1">
                    {output.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm text-gray-300">
                        <Check className="h-3 w-3 text-green-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Comparison Features */}
        <Card className="cosmic-card mb-12">
          <CardHeader>
            <CardTitle className="text-yellow-400">Cross-System Analysis & Compatibility</CardTitle>
            <CardDescription>
              Unique multi-system comparisons and astro-matching capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-8">
              {comparisonFeatures.map((category) => (
                <div key={category.category}>
                  <h3 className="text-lg font-medium text-cyan-400 mb-4">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm text-gray-300">
                        <ArrowRight className="h-4 w-4 text-yellow-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Pricing Section */}
        <PricingTiers />

        {/* FAQ / Additional Info */}
        <Card className="cosmic-card mt-12">
          <CardHeader>
            <CardTitle className="text-yellow-400">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">What makes MyTorchlight different?</h4>
                  <p className="text-gray-400 text-sm">
                    We're the only platform that synthesizes 7+ astrological systems using LLM intelligence, 
                    providing educational depth and cross-cultural insights impossible with traditional single-system approaches.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">Is the free tier really unlimited?</h4>
                  <p className="text-gray-400 text-sm">
                    Yes! Free users get complete birth chart analysis across all systems, AI chat assistant, 
                    and educational content forever. Upgrades unlock downloads, unlimited conversations, and professional features.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">How accurate are the calculations?</h4>
                  <p className="text-gray-400 text-sm">
                    We use Swiss Ephemeris for astronomical precision, the same engine powering professional astrology software. 
                    Our accuracy ratings show system reliability and cultural authenticity.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">Can I use this professionally?</h4>
                  <p className="text-gray-400 text-sm">
                    Absolutely! The Professional tier includes white-label options, API access, and client management tools 
                    specifically designed for astrologers, coaches, and consultants.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}