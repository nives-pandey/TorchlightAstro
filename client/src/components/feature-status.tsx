import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Star, 
  Users, 
  Download,
  Mail,
  Sparkles,
  BarChart3,
  Heart,
  Calendar,
  Bot,
  Zap
} from "lucide-react";

interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'complete' | 'partial' | 'planned';
  completion: number;
  icon: any;
  category: 'core' | 'analysis' | 'reports' | 'social';
  comingSoon?: boolean;
}

export default function FeatureStatus() {
  const features: Feature[] = [
    // 100% Complete Features (Show First)
    {
      id: 'ai-chat',
      name: 'AI Cosmic Assistant',
      description: '8-section intelligent analysis with cross-system synthesis',
      status: 'complete',
      completion: 100,
      icon: Bot,
      category: 'core'
    },
    {
      id: 'birth-charts',
      name: 'Multi-System Birth Charts',
      description: 'Western, Vedic, Chinese, Human Design, Numerology analysis',
      status: 'complete',
      completion: 100,
      icon: Star,
      category: 'analysis'
    },
    {
      id: 'swiss-ephemeris',
      name: 'Swiss Ephemeris Calculations',
      description: 'Professional astronomical precision for all planetary positions',
      status: 'complete',
      completion: 100,
      icon: Zap,
      category: 'core'
    },
    {
      id: 'system-comparison',
      name: 'Cross-System Analysis',
      description: 'Accuracy ratings and comparative insights across traditions',
      status: 'complete',
      completion: 100,
      icon: BarChart3,
      category: 'analysis'
    },
    {
      id: '3d-charts',
      name: '3D Planetary Visualization',
      description: 'Interactive cosmic environment with real planetary positions',
      status: 'complete',
      completion: 100,
      icon: Sparkles,
      category: 'analysis'
    },
    {
      id: 'daily-guidance',
      name: 'Daily Cosmic Weather',
      description: 'Personalized daily insights and planetary influence tracking',
      status: 'complete',
      completion: 100,
      icon: Calendar,
      category: 'core'
    },
    {
      id: 'compatibility',
      name: 'Basic Compatibility Analysis',
      description: 'Two-person relationship analysis across primary systems',
      status: 'complete',
      completion: 100,
      icon: Heart,
      category: 'social'
    },
    {
      id: 'screen-reports',
      name: 'Screen Viewing Reports',
      description: 'Interactive color-coded analysis with conversation flow',
      status: 'complete',
      completion: 100,
      icon: CheckCircle,
      category: 'reports'
    },

    // Partial Features (85-95% Complete)
    {
      id: 'pdf-reports',
      name: 'PDF Report Generation',
      description: 'Professional downloadable reports with MyTorchlight branding',
      status: 'partial',
      completion: 95,
      icon: Download,
      category: 'reports'
    },
    {
      id: 'email-delivery',
      name: 'Email Report Delivery',
      description: 'Automated email delivery with attachments and scheduling',
      status: 'partial',
      completion: 90,
      icon: Mail,
      category: 'reports'
    },
    {
      id: 'multi-partner',
      name: 'Multi-Partner Compatibility',
      description: 'Group compatibility analysis for families and teams',
      status: 'partial',
      completion: 85,
      icon: Users,
      category: 'social'
    },

    // Planned Features (Future Development)
    {
      id: 'white-label',
      name: 'White-Label Reports',
      description: 'Custom branding options for professional practitioners',
      status: 'planned',
      completion: 30,
      icon: Star,
      category: 'reports',
      comingSoon: true
    },
    {
      id: 'api-access',
      name: 'Professional API',
      description: 'Developer API for integration with other platforms',
      status: 'planned',
      completion: 15,
      icon: Zap,
      category: 'core',
      comingSoon: true
    },
    {
      id: 'mobile-app',
      name: 'Native Mobile Apps',
      description: 'iOS and Android apps with offline chart viewing',
      status: 'planned',
      completion: 25,
      icon: Sparkles,
      category: 'core',
      comingSoon: true
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'partial':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'planned':
        return <AlertCircle className="h-5 w-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'border-green-400 bg-green-400/10';
      case 'partial':
        return 'border-yellow-400 bg-yellow-400/10';
      case 'planned':
        return 'border-blue-400 bg-blue-400/10';
      default:
        return 'border-gray-400 bg-gray-400/10';
    }
  };

  const categorizedFeatures = {
    complete: features.filter(f => f.status === 'complete'),
    partial: features.filter(f => f.status === 'partial'),
    planned: features.filter(f => f.status === 'planned')
  };

  const overallCompletion = Math.round(
    features.reduce((sum, f) => sum + f.completion, 0) / features.length
  );

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span>MyTorchlight Development Status</span>
          </CardTitle>
          <CardDescription>
            Current feature completion and roadmap for the comprehensive astrology platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {categorizedFeatures.complete.length}
              </div>
              <div className="text-sm text-gray-400">Features Complete</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                {categorizedFeatures.partial.length}
              </div>
              <div className="text-sm text-gray-400">In Development</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {overallCompletion}%
              </div>
              <div className="text-sm text-gray-400">Overall Complete</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-yellow-400 h-4 rounded-full transition-all duration-500"
              style={{ width: `${overallCompletion}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 text-center">
            Platform readiness for comprehensive astrological analysis
          </p>
        </CardContent>
      </Card>

      {/* 100% Complete Features (Priority Display) */}
      <div>
        <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center space-x-2">
          <CheckCircle className="h-6 w-6" />
          <span>Fully Functional Features</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorizedFeatures.complete.map((feature) => (
            <Card key={feature.id} className={`cosmic-card border-2 ${getStatusColor(feature.status)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <feature.icon className="h-8 w-8 text-yellow-400" />
                  <Badge className="bg-green-500 text-white">
                    {feature.completion}%
                  </Badge>
                </div>
                <CardTitle className="text-lg text-white">{feature.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-3">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    Ready to Use
                  </Badge>
                  {getStatusIcon(feature.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Partial Features */}
      <div>
        <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center space-x-2">
          <Clock className="h-6 w-6" />
          <span>In Active Development</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorizedFeatures.partial.map((feature) => (
            <Card key={feature.id} className={`cosmic-card border-2 ${getStatusColor(feature.status)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <feature.icon className="h-8 w-8 text-yellow-400" />
                  <Badge className="bg-yellow-500 text-black">
                    {feature.completion}%
                  </Badge>
                </div>
                <CardTitle className="text-lg text-white">{feature.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-3">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    Nearly Ready
                  </Badge>
                  {getStatusIcon(feature.status)}
                </div>
                <div className="mt-3">
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${feature.completion}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Planned Features */}
      <div>
        <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center space-x-2">
          <AlertCircle className="h-6 w-6" />
          <span>Coming Soon</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorizedFeatures.planned.map((feature) => (
            <Card key={feature.id} className={`cosmic-card border-2 ${getStatusColor(feature.status)} opacity-75`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <feature.icon className="h-8 w-8 text-blue-400" />
                  <Badge className="bg-blue-500 text-white">
                    {feature.completion}%
                  </Badge>
                </div>
                <CardTitle className="text-lg text-white">{feature.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-3">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {feature.comingSoon ? 'Coming Soon' : 'Planned'}
                  </Badge>
                  {getStatusIcon(feature.status)}
                </div>
                <div className="mt-3">
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${feature.completion}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ready to Use Call-to-Action */}
      <Card className="cosmic-card border-2 border-green-400 bg-green-400/5">
        <CardContent className="text-center py-8">
          <h3 className="text-2xl font-bold text-green-400 mb-4">Ready for Full Astrological Analysis</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            With 8 core features fully functional, MyTorchlight provides comprehensive astrological analysis 
            rivaling $25,000+ professional software. Experience multi-system synthesis with Swiss Ephemeris precision.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="cosmic-button">
              <Star className="h-4 w-4 mr-2" />
              Start Your Analysis
            </Button>
            <Button variant="outline" className="cosmic-button-outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View System Comparison
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}