import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeatureStatus from "@/components/feature-status";
import MobileBirthForm from "@/components/mobile-birth-form";
import { 
  CheckCircle, 
  Star, 
  Users, 
  Download,
  Mail,
  Sparkles,
  BarChart3,
  Heart,
  Calendar,
  Bot,
  Zap,
  Crown,
  Gift,
  Play,
  Gem,
  Music
} from "lucide-react";

export default function FeatureDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showBirthForm, setShowBirthForm] = useState(false);

  const handleFormComplete = (data: any) => {
    console.log("Birth form completed:", data);
    // In production, this would save the data and redirect to analysis
    alert("Chart creation successful! (This would redirect to your analysis)");
    setShowBirthForm(false);
  };

  if (showBirthForm) {
    return <MobileBirthForm onComplete={handleFormComplete} />;
  }

  const readyFeatures = [
    {
      id: 'ai-chat',
      name: 'AI Cosmic Assistant',
      description: '8-section intelligent analysis with cross-system synthesis',
      icon: Bot,
      action: 'Try AI Chat',
      link: '/ai-assistant'
    },
    {
      id: 'birth-charts',
      name: 'Multi-System Birth Charts',
      description: 'Western, Vedic, Chinese, Human Design, Numerology analysis',
      icon: Star,
      action: 'Create Chart',
      link: '/personal'
    },
    {
      id: 'compatibility',
      name: 'Relationship Compatibility',
      description: 'Two-person analysis across all astrological systems',
      icon: Heart,
      action: 'Check Compatibility',
      link: '/compatibility'
    },
    {
      id: '3d-charts',
      name: '3D Cosmic Visualization',
      description: 'Interactive planetary positions in 3D space',
      icon: Sparkles,
      action: 'Explore 3D',
      link: '/3d-demo'
    },
    {
      id: 'daily-guidance',
      name: 'Daily Cosmic Weather',
      description: 'Personalized daily insights and planetary tracking',
      icon: Calendar,
      action: 'Get Daily Reading',
      link: '/daily'
    },
    {
      id: 'system-comparison',
      name: 'Cross-System Analysis',
      description: 'Compare accuracy and insights across traditions',
      icon: BarChart3,
      action: 'Compare Systems',
      link: '/analysis'
    },
    {
      id: 'gemstone-energy',
      name: 'Gemstone Energy Pairing',
      description: 'Intuitive crystal matching with cosmic energy alignment',
      icon: Gem,
      action: 'Discover Crystals',
      link: '/gemstone-energy-pairing'
    },
    {
      id: 'astral-soundtrack',
      name: 'Astral Soundtrack Generator',
      description: 'Personalized cosmic music based on birth chart and planetary transits',
      icon: Music,
      action: 'Generate Soundtrack',
      link: '/astral-soundtrack'
    }
  ];

  const premiumFeatures = [
    {
      id: 'pdf-reports',
      name: 'PDF Report Generation',
      description: 'Professional downloadable reports with branding',
      status: 'partial',
      completion: 95,
      icon: Download
    },
    {
      id: 'email-delivery',
      name: 'Email Report Delivery',
      description: 'Automated delivery with scheduling options',
      status: 'partial',
      completion: 90,
      icon: Mail
    },
    {
      id: 'multi-partner',
      name: 'Multi-Partner Analysis',
      description: 'Group compatibility for families and teams',
      status: 'partial',
      completion: 85,
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="elegant-container">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="elegant-heading mb-4">MyTorchlight Features</h1>
          <p className="elegant-subheading">
            Comprehensive astrological analysis with 100% functional core features
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 rounded-2xl p-1">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-purple-500">
              Overview
            </TabsTrigger>
            <TabsTrigger value="ready" className="rounded-xl data-[state=active]:bg-purple-500">
              Ready to Use
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-purple-500">
              All Features
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Start */}
            <Card className="mobile-optimized-card premium-glow">
              <CardHeader className="text-center">
                <CardTitle className="elegant-heading text-2xl mb-2">
                  <Crown className="inline w-8 h-8 mr-2 text-purple-400" />
                  Start Your Cosmic Journey
                </CardTitle>
                <CardDescription className="elegant-body">
                  Get your complete astrological analysis across 7 ancient systems in minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">7+</div>
                    <div className="text-sm text-gray-400">Systems</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">96%</div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">Free</div>
                    <div className="text-sm text-gray-400">Forever</div>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowBirthForm(true)}
                  className="elegant-button w-full"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Create My Birth Chart
                </Button>
                <p className="text-xs text-gray-400">
                  Swiss Ephemeris precision • Cross-system synthesis • Instant analysis
                </p>
              </CardContent>
            </Card>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="mobile-optimized-card">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center">
                    <Gift className="w-6 h-6 mr-2" />
                    100% Functional Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 elegant-body">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      AI-powered cosmic analysis
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Multi-system birth charts
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      3D planetary visualization
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Daily cosmic guidance
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Relationship compatibility
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mobile-optimized-card">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center">
                    <Zap className="w-6 h-6 mr-2" />
                    Premium Features (95% Ready)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 elegant-body">
                    <li className="flex items-center">
                      <Download className="w-4 h-4 text-purple-400 mr-2" />
                      PDF report generation
                    </li>
                    <li className="flex items-center">
                      <Mail className="w-4 h-4 text-purple-400 mr-2" />
                      Email delivery system
                    </li>
                    <li className="flex items-center">
                      <Users className="w-4 h-4 text-purple-400 mr-2" />
                      Multi-partner analysis
                    </li>
                  </ul>
                  <Badge className="status-partial mt-3">Nearly Complete</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ready Features Tab */}
          <TabsContent value="ready" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readyFeatures.map((feature) => (
                <Card key={feature.id} className="mobile-optimized-card">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <feature.icon className="w-8 h-8 text-purple-400" />
                      <Badge className="status-complete">Ready</Badge>
                    </div>
                    <CardTitle className="text-white text-lg">{feature.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="elegant-body text-sm mb-4">{feature.description}</p>
                    <Button 
                      className="elegant-button-outline w-full"
                      onClick={() => window.location.href = feature.link}
                    >
                      {feature.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* All Features Tab */}
          <TabsContent value="all" className="space-y-6">
            <FeatureStatus />
          </TabsContent>
        </Tabs>

        {/* Mobile-optimized CTA Footer */}
        <Card className="mobile-optimized-card mt-8 border-2 border-purple-400/50">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">
              Experience Complete Astrological Analysis
            </h3>
            <p className="elegant-body mb-6 max-w-2xl mx-auto">
              MyTorchlight delivers professional-grade insights across 7+ ancient systems 
              with Swiss Ephemeris precision. Start your cosmic journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowBirthForm(true)}
                className="elegant-button"
              >
                <Star className="w-5 h-5 mr-2" />
                Create Birth Chart
              </Button>
              <Button 
                variant="outline" 
                className="elegant-button-outline"
                onClick={() => window.location.href = '/ai-assistant'}
              >
                <Bot className="w-5 h-5 mr-2" />
                Try AI Assistant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}