import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Download, Share2, Printer, Star, BarChart3, Users, Zap } from "lucide-react";

interface SystemAnalysis {
  system: string;
  icon: string;
  accuracy: number;
  strengths: string[];
  career: string[];
  relationships: string[];
  health: string[];
  timing: string[];
  compatibility?: number;
}

interface ComparisonProps {
  userChart?: any;
  partnerChart?: any;
  showDownloadOptions?: boolean;
}

export default function SystemComparison({ userChart, partnerChart, showDownloadOptions = true }: ComparisonProps) {
  const [selectedFormat, setSelectedFormat] = useState<'screen' | 'pdf' | 'email'>('screen');

  const systemAnalyses: SystemAnalysis[] = [
    {
      system: "Western Astrology",
      icon: "☉",
      accuracy: 92,
      strengths: ["Psychological depth", "Planetary aspects", "Transit timing"],
      career: ["Leadership roles", "Creative expression", "Public recognition"],
      relationships: ["Venus in harmony", "7th house influences", "Synastry compatibility"],
      health: ["Fire element vitality", "Mars energy management", "Seasonal awareness"],
      timing: ["Mercury retrograde caution", "Jupiter expansion periods", "New moon intentions"],
      compatibility: partnerChart ? 87 : undefined
    },
    {
      system: "Vedic (Jyotish)",
      icon: "ॐ",
      accuracy: 96,
      strengths: ["Precise timing", "Nakshatra wisdom", "Karmic insights"],
      career: ["Teaching & healing", "Spiritual leadership", "Research & analysis"],
      relationships: ["Nakshatra compatibility", "Guna matching", "Dasha timing"],
      health: ["Dosha balance: Vata", "Ayurvedic nutrition", "Seasonal routines"],
      timing: ["Dasha periods optimal", "Rahu-Ketu cycles", "Tithi selection"],
      compatibility: partnerChart ? 94 : undefined
    },
    {
      system: "Chinese Zodiac",
      icon: "☯",
      accuracy: 89,
      strengths: ["Element cycles", "Animal traits", "Seasonal wisdom"],
      career: ["Wood element growth", "Leadership positions", "Creative industries"],
      relationships: ["Dragon-Phoenix harmony", "Element compatibility", "Yin-Yang balance"],
      health: ["Five element diet", "Chi circulation", "Seasonal adjustments"],
      timing: ["Year of personal growth", "Monthly element flow", "Daily Chi cycles"],
      compatibility: partnerChart ? 82 : undefined
    },
    {
      system: "Human Design",
      icon: "◊",
      accuracy: 85,
      strengths: ["Energy strategy", "Decision authority", "Life purpose"],
      career: ["Generator satisfaction", "Authority-based decisions", "Collaborative work"],
      relationships: ["Energy dynamics", "Authority respect", "Channel connections"],
      health: ["Defined center awareness", "Energy management", "Rest cycles"],
      timing: ["Strategy alignment", "Authority timing", "Energy cycles"],
      compatibility: partnerChart ? 91 : undefined
    },
    {
      system: "Numerology",
      icon: "∞",
      accuracy: 78,
      strengths: ["Life path clarity", "Personal cycles", "Name vibrations"],
      career: ["Life Path 3: Communication", "Expression number alignment", "Career cycles"],
      relationships: ["Compatible life paths", "Expression harmony", "Personal year cycles"],
      health: ["Number vibration healing", "Cycle awareness", "Numerical balance"],
      timing: ["Personal year focus", "Monthly themes", "Day number energy"],
      compatibility: partnerChart ? 76 : undefined
    }
  ];

  const handleDownload = (format: 'pdf' | 'email' | 'share') => {
    // This would trigger the download/email functionality
    console.log(`Downloading in ${format} format`);
  };

  const overallCompatibility = partnerChart 
    ? Math.round(systemAnalyses.reduce((sum, s) => sum + (s.compatibility || 0), 0) / systemAnalyses.length)
    : null;

  return (
    <div className="space-y-6">
      {/* Header with Branding */}
      <Card className="sanctuary-card">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="sanctuary-logo">🔆</div>
            <div>
              <CardTitle className="text-2xl text-yellow-500">MyTorchlight</CardTitle>
              <CardDescription className="text-gray-400">
                Comprehensive Astrological Analysis Report
              </CardDescription>
            </div>
          </div>
          
          {partnerChart && overallCompatibility && (
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">{overallCompatibility}%</div>
                <div className="text-sm text-gray-400">Overall Compatibility</div>
              </div>
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
          )}
        </CardHeader>
      </Card>

      {/* System Comparison */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {systemAnalyses.map((analysis, index) => (
              <Card key={analysis.system} className="sanctuary-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{analysis.icon}</span>
                      <div>
                        <CardTitle className="text-lg text-yellow-500">{analysis.system}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={analysis.accuracy} className="w-24 h-2" />
                          <span className="text-sm text-gray-400">{analysis.accuracy}% accuracy</span>
                        </div>
                      </div>
                    </div>
                    {analysis.compatibility && (
                      <Badge variant="outline" className="border-yellow-500 text-purple-300">
                        {analysis.compatibility}% compatible
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="text-cyan-400 font-medium mb-2">Core Strengths</h4>
                      <ul className="space-y-1 text-gray-300">
                        {analysis.strengths.map((strength, i) => (
                          <li key={i}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-green-400 font-medium mb-2">Career Focus</h4>
                      <ul className="space-y-1 text-gray-300">
                        {analysis.career.slice(0, 2).map((career, i) => (
                          <li key={i}>• {career}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-pink-400 font-medium mb-2">Health Insights</h4>
                      <ul className="space-y-1 text-gray-300">
                        {analysis.health.slice(0, 2).map((health, i) => (
                          <li key={i}>• {health}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="career" className="space-y-4">
          <Card className="sanctuary-card">
            <CardHeader>
              <CardTitle className="text-yellow-500 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Career Guidance Across All Systems</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {systemAnalyses.map((analysis) => (
                  <div key={analysis.system}>
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-xl">{analysis.icon}</span>
                      <h3 className="text-lg font-medium text-white">{analysis.system}</h3>
                      <Progress value={analysis.accuracy} className="w-20 h-2" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 ml-8">
                      <div>
                        <h4 className="text-green-400 font-medium mb-2">Recommended Paths</h4>
                        <ul className="space-y-1 text-gray-300 text-sm">
                          {analysis.career.map((path, i) => (
                            <li key={i}>• {path}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-blue-400 font-medium mb-2">Optimal Timing</h4>
                        <ul className="space-y-1 text-gray-300 text-sm">
                          {analysis.timing.slice(0, 2).map((time, i) => (
                            <li key={i}>• {time}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          {partnerChart ? (
            <Card className="sanctuary-card">
              <CardHeader>
                <CardTitle className="text-yellow-500 flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Compatibility Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {systemAnalyses.map((analysis) => analysis.compatibility && (
                    <div key={analysis.system}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{analysis.icon}</span>
                          <h3 className="text-lg font-medium text-white">{analysis.system}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-500">{analysis.compatibility}%</div>
                          <Progress value={analysis.compatibility} className="w-24 h-2 mt-1" />
                        </div>
                      </div>
                      <div className="ml-8">
                        <ul className="space-y-1 text-gray-300 text-sm">
                          {analysis.relationships.map((rel, i) => (
                            <li key={i}>• {rel}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="sanctuary-card">
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">Partner Analysis Available</h3>
                <p className="text-gray-500">Add a partner's birth data to see detailed compatibility analysis across all systems</p>
                <Button className="sanctuary-button mt-4">Add Partner</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card className="sanctuary-card">
            <CardHeader>
              <CardTitle className="text-yellow-500">Detailed System Analysis</CardTitle>
              <CardDescription>
                In-depth breakdown of each astrological system's insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {systemAnalyses.map((analysis) => (
                  <div key={analysis.system} className="border-l-2 border-yellow-500/30 pl-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">{analysis.icon}</span>
                      <h3 className="text-xl font-bold text-yellow-500">{analysis.system}</h3>
                      <Badge variant="outline" className="border-green-400 text-green-300">
                        {analysis.accuracy}% Accurate
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-cyan-400 font-medium mb-2">Core Insights</h4>
                          <ul className="space-y-1 text-gray-300 text-sm">
                            {analysis.strengths.map((strength, i) => (
                              <li key={i}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-green-400 font-medium mb-2">Career Guidance</h4>
                          <ul className="space-y-1 text-gray-300 text-sm">
                            {analysis.career.map((career, i) => (
                              <li key={i}>• {career}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-pink-400 font-medium mb-2">Health & Wellness</h4>
                          <ul className="space-y-1 text-gray-300 text-sm">
                            {analysis.health.map((health, i) => (
                              <li key={i}>• {health}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-blue-400 font-medium mb-2">Timing & Cycles</h4>
                          <ul className="space-y-1 text-gray-300 text-sm">
                            {analysis.timing.map((time, i) => (
                              <li key={i}>• {time}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Download & Sharing Options */}
      {showDownloadOptions && (
        <Card className="sanctuary-card">
          <CardHeader>
            <CardTitle className="text-yellow-500 flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export & Share Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="sanctuary-button-outline"
                onClick={() => handleDownload('pdf')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF Report
              </Button>
              
              <Button 
                variant="outline" 
                className="sanctuary-button-outline"
                onClick={() => handleDownload('email')}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Email Report
              </Button>
              
              <Button 
                variant="outline" 
                className="sanctuary-button-outline"
                onClick={() => handleDownload('share')}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Version
              </Button>
            </div>
            
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">
                <Star className="h-4 w-4 inline mr-1 text-yellow-500" />
                Professional reports include MyTorchlight branding and detailed analysis
              </p>
              <p className="text-xs text-gray-500">
                Free: View on screen • Premium: PDF download • Professional: Email delivery with branding
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}