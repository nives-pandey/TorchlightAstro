import { useAuth } from "@/hooks/useAuth";
import AIChat from "@/components/ai-chat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles, Brain, Star } from "lucide-react";

export default function AIAssistant() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Bot className="h-12 w-12 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
              AI Astrological Assistant
            </h1>
            <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your personal cosmic guide powered by authentic astrological knowledge from multiple ancient traditions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* AI Chat Interface */}
          <div className="lg:col-span-2">
            <AIChat />
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            {/* About AI Assistant */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="text-yellow-500 flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>How It Works</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <p className="text-sm">
                  Our AI assistant analyzes your complete astrological profile across four ancient systems:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• <span className="text-yellow-400">Western:</span> Planets, houses, aspects</li>
                  <li>• <span className="text-purple-400">Vedic:</span> Nakshatras, doshas, dharma</li>
                  <li>• <span className="text-pink-400">Chinese:</span> Animals, elements, compatibility</li>
                  <li>• <span className="text-blue-400">Human Design:</span> Type, strategy, authority</li>
                </ul>
                <p className="text-sm text-gray-400">
                  Responses are generated using comprehensive astrological knowledge bases and authentic astronomical calculations.
                </p>
              </CardContent>
            </Card>

            {/* Sample Questions */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Ask About</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2">Personality & Life Purpose</h4>
                    <ul className="text-sm space-y-1 text-gray-400">
                      <li>• "What are my core strengths?"</li>
                      <li>• "What's my life purpose?"</li>
                      <li>• "How do others see me?"</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-purple-400 font-medium mb-2">Career & Work</h4>
                    <ul className="text-sm space-y-1 text-gray-400">
                      <li>• "What career suits me best?"</li>
                      <li>• "When should I make job changes?"</li>
                      <li>• "How can I improve at work?"</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-pink-400 font-medium mb-2">Relationships</h4>
                    <ul className="text-sm space-y-1 text-gray-400">
                      <li>• "What do I need in relationships?"</li>
                      <li>• "How can I improve communication?"</li>
                      <li>• "What's my romantic style?"</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-blue-400 font-medium mb-2">Health & Wellness</h4>
                    <ul className="text-sm space-y-1 text-gray-400">
                      <li>• "What health areas should I focus on?"</li>
                      <li>• "What wellness practices suit me?"</li>
                      <li>• "How can I manage stress better?"</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Info */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="text-green-400 text-sm">Real-Time Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="text-sm">
                  Each response involves deep analysis of your birth chart data, 
                  cross-referencing multiple astrological traditions, and 
                  calculating current planetary transits for personalized timing guidance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}