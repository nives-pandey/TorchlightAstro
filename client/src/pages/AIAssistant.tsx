import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Sparkles, Brain, BookOpen, Users, Zap, Info } from 'lucide-react';
import AIAstrologyAssistant from '../components/AIAstrologyAssistant';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';

export function AIAssistant() {
  const [aiStatus, setAIStatus] = useState<any>(null);
  const [userBirthData, setUserBirthData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAIStatus();
    loadUserBirthData();
  }, []);

  const checkAIStatus = async () => {
    try {
      const response = await apiRequest('GET', '/api/ai-status') as any;
      setAIStatus(response);
    } catch (error) {
      console.error('Failed to check AI status:', error);
    }
  };

  const loadUserBirthData = () => {
    // Try to load birth data from localStorage or previous chart generation
    const storedData = localStorage.getItem('torchlight_birth_data');
    if (storedData) {
      try {
        setUserBirthData(JSON.parse(storedData));
      } catch (error) {
        console.error('Failed to parse stored birth data:', error);
      }
    }
  };

  const features = [
    {
      icon: Brain,
      title: "Personalized Chart Analysis",
      description: "Get AI-powered insights about your unique astrological profile with detailed explanations.",
      available: aiStatus?.features?.personalizedInterpretations,
      premium: false
    },
    {
      icon: Zap,
      title: "Cross-System Synthesis",
      description: "Understand how Western, Vedic, Chinese, and Human Design systems align or differ in your chart.",
      available: aiStatus?.features?.crossSystemSynthesis,
      premium: false
    },
    {
      icon: Users,
      title: "Conversational Guidance",
      description: "Ask specific questions about relationships, career, timing, and receive personalized cosmic guidance.",
      available: aiStatus?.features?.conversationalGuidance,
      premium: false
    },
    {
      icon: BookOpen,
      title: "Astrological Education",
      description: "Learn about astrological concepts with clear, personalized explanations tailored to your level.",
      available: aiStatus?.features?.educationalContent,
      premium: false
    }
  ];

  return (
    <div className="min-h-screen cosmic-gradient p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-teal-200 to-pink-200 bg-clip-text text-transparent">
              AI Astrology Assistant
            </h1>
          </div>
          
          <p className="text-teal-200 text-lg max-w-2xl mx-auto">
            Get personalized astrological insights, learn cosmic concepts, and receive guidance powered by advanced AI understanding of traditional astrology.
          </p>

          {/* AI Status */}
          <div className="flex justify-center">
            {aiStatus?.openai?.available ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Enhanced Experience Active
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-2">
                <Info className="h-4 w-4 mr-2" />
                Traditional Mode - AI Features Require OpenAI Integration
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-teal-300/20">
            <TabsTrigger value="chat" className="data-[state=active]:bg-white/20">
              Chat Assistant
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-white/20">
              AI Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <AIAstrologyAssistant 
              birthData={userBirthData}
              className="mx-auto max-w-4xl"
            />
            
            {!userBirthData && (
              <Card className="mt-4 border-amber-500/30 bg-amber-500/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div className="text-sm text-amber-200">
                      <p className="font-medium mb-1">Enhanced Personalization Available</p>
                      <p>
                        Create your natal chart first to receive personalized insights based on your unique astrological profile. 
                        <Button 
                          variant="link" 
                          className="text-amber-300 underline p-0 ml-1 h-auto"
                          onClick={() => window.location.href = '/'}
                        >
                          Generate your chart now
                        </Button>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-teal-300/20 bg-white/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <div className={`p-2 rounded-lg ${
                        feature.available 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span>{feature.title}</span>
                          {feature.available ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                              Requires AI
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-teal-200 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* API Status Details */}
            {aiStatus && (
              <Card className="mt-6 border-teal-300/20 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-white">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-teal-200">OpenAI Integration</span>
                        <Badge className={
                          aiStatus.openai?.available 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }>
                          {aiStatus.openai?.available ? 'Connected' : 'Unavailable'}
                        </Badge>
                      </div>
                      <p className="text-sm text-teal-300">
                        {aiStatus.openai?.status || 'API key needed for AI features'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-teal-200">Traditional Astrology</span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          Always Available
                        </Badge>
                      </div>
                      <p className="text-sm text-teal-300">
                        Core astrological guidance available without AI integration
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AIAssistant;