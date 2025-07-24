import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, User, Send, Sparkles, Clock, Target, Calendar, Star, CheckCircle, MessageCircle, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  insights?: string[];
  recommendations?: string[];
  timing?: string[];
  processingTime?: number;
  personalityHighlights?: string[];
  cosmicWeather?: string;
  actionItems?: string[];
  followUpQuestions?: string[];
}

interface ProcessingState {
  stage: string;
  message: string;
}

const PROCESSING_STAGES = [
  { stage: "analyzing", message: "Analyzing your astrological charts..." },
  { stage: "calculating", message: "Calculating planetary positions and aspects..." },
  { stage: "synthesizing", message: "Synthesizing insights across all systems..." },
  { stage: "personalizing", message: "Creating personalized guidance..." },
  { stage: "complete", message: "Cosmic wisdom ready!" }
];

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [processingState, setProcessingState] = useState<ProcessingState | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, processingState]);

  // Welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content: `🌟 Welcome to your enhanced AI Astrological Assistant! I'm here to provide interactive cosmic guidance through personalized insights from your complete celestial blueprint.

I now offer:
✨ **Personality Highlights** - Your unique cosmic profile across multiple systems
🌙 **Cosmic Weather** - Today's planetary influences and optimal timing
🎯 **Action Steps** - Practical guidance you can apply immediately
💭 **Smart Follow-ups** - Deeper conversation paths tailored to your interests

I analyze your birth chart across Western, Vedic, Chinese, Human Design, and Numerology systems to provide comprehensive guidance.

Ready to explore your cosmic potential? Try asking:
• "What are my core strengths and how can I use them today?"
• "What does today's cosmic weather mean for me?"
• "How can I improve my relationships based on my chart?"

How can I illuminate your path today?`,
        timestamp: new Date(),
        personalityHighlights: [
          "Your cosmic journey begins with understanding your unique astrological blueprint",
          "Multiple ancient systems reveal different aspects of your personality and potential",
          "Today's planetary energies offer specific opportunities for growth and action"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  const aiMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", "/api/ai-chat", { 
        question,
        conversationHistory: messages.slice(-5) // Send last 5 messages for context
      });
      return response.json();
    },
    onMutate: () => {
      // Start processing animation
      setProcessingState(PROCESSING_STAGES[0]);
      
      // Simulate processing stages
      let stageIndex = 0;
      const stageInterval = setInterval(() => {
        stageIndex++;
        if (stageIndex < PROCESSING_STAGES.length - 1) {
          setProcessingState(PROCESSING_STAGES[stageIndex]);
        } else {
          clearInterval(stageInterval);
        }
      }, 800);
    },
    onSuccess: (data) => {
      setProcessingState(PROCESSING_STAGES[PROCESSING_STAGES.length - 1]);
      
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: data.response,
          insights: data.insights,
          recommendations: data.recommendations,
          timing: data.timing,
          processingTime: data.processingTime,
          personalityHighlights: data.personalityHighlights,
          cosmicWeather: data.cosmicWeather,
          actionItems: data.actionItems,
          followUpQuestions: data.followUpQuestions,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setProcessingState(null);
      }, 500);
    },
    onError: (error: any) => {
      setProcessingState(null);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      console.error("AI Chat error:", error);
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    aiMutation.mutate(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="cosmic-card h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-t-lg">
        <CardTitle className="text-white flex items-center space-x-2">
          <Bot className="h-6 w-6 text-yellow-500" />
          <span>Cosmic AI Assistant</span>
          <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${message.role === "user" ? "bg-yellow-600" : "bg-gray-800"} rounded-lg p-3`}>
                  <div className="flex items-start space-x-2">
                    {message.role === "assistant" ? (
                      <Bot className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <User className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      
                      {/* AI Insights */}
                      {message.insights && message.insights.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-1">
                            <Sparkles className="h-4 w-4 text-yellow-400" />
                            <span className="text-yellow-400 text-xs font-medium">Key Insights</span>
                          </div>
                          {message.insights.map((insight, index) => (
                            <Badge key={index} variant="outline" className="border-yellow-400/50 text-yellow-300 text-xs">
                              {insight}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* AI Recommendations */}
                      {message.recommendations && message.recommendations.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-400 text-xs font-medium">Recommendations</span>
                          </div>
                          <div className="space-y-1">
                            {message.recommendations.map((rec, index) => (
                              <p key={index} className="text-purple-300 text-xs">• {rec}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timing Information */}
                      {message.timing && message.timing.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-400 text-xs font-medium">Optimal Timing</span>
                          </div>
                          <div className="space-y-1">
                            {message.timing.map((time, index) => (
                              <p key={index} className="text-blue-300 text-xs">• {time}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Personality Highlights */}
                      {message.personalityHighlights && message.personalityHighlights.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-pink-400" />
                            <span className="text-pink-400 text-xs font-medium">Your Cosmic Profile</span>
                          </div>
                          <div className="space-y-1">
                            {message.personalityHighlights.map((highlight, index) => (
                              <p key={index} className="text-pink-300 text-xs">• {highlight}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cosmic Weather */}
                      {message.cosmicWeather && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-1">
                            <Zap className="h-4 w-4 text-cyan-400" />
                            <span className="text-cyan-400 text-xs font-medium">Today's Cosmic Weather</span>
                          </div>
                          <p className="text-cyan-300 text-xs">{message.cosmicWeather}</p>
                        </div>
                      )}

                      {/* Action Items */}
                      {message.actionItems && message.actionItems.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 text-xs font-medium">Action Steps</span>
                          </div>
                          <div className="space-y-1">
                            {message.actionItems.map((action, index) => (
                              <p key={index} className="text-green-300 text-xs">• {action}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up Questions */}
                      {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4 text-orange-400" />
                            <span className="text-orange-400 text-xs font-medium">Continue Our Conversation</span>
                          </div>
                          <div className="space-y-1">
                            {message.followUpQuestions.map((question, index) => (
                              <button
                                key={index}
                                onClick={() => setInputValue(question)}
                                className="block text-left text-orange-300 text-xs hover:text-orange-200 transition-colors p-1 rounded hover:bg-orange-400/10"
                              >
                                • {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Processing Time */}
                      {message.processingTime && (
                        <div className="mt-2 flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-gray-500 text-xs">
                            Processed in {(message.processingTime / 1000).toFixed(1)}s
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Processing Animation */}
            {processingState && (
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-yellow-400 animate-pulse" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="cosmic-spinner"></div>
                        <p className="text-yellow-400 text-sm">{processingState.message}</p>
                      </div>
                      <div className="flex space-x-1 mt-2">
                        {[...Array(8)].map((_, i) => (
                          <div 
                            key={i}
                            className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        {/* Input Area */}
        <div className="p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your cosmic blueprint..."
              className="cosmic-input flex-1"
              disabled={aiMutation.isPending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || aiMutation.isPending}
              className="cosmic-button"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              "What are my natural strengths?",
              "What career path suits me?",
              "How can I improve my relationships?",
              "What's my spiritual purpose?"
            ].map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(question)}
                className="text-xs border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                disabled={aiMutation.isPending}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}