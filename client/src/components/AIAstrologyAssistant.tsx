import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Send, Bot, User, BookOpen, Stars, Lightbulb } from 'lucide-react';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  aiEnhanced?: boolean;
}

interface AIAstrologyAssistantProps {
  birthData?: any;
  className?: string;
}

export function AIAstrologyAssistant({ birthData, className = '' }: AIAstrologyAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAIStatus] = useState<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check AI API status on mount
  useEffect(() => {
    checkAIStatus();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const checkAIStatus = async () => {
    try {
      const response = await apiRequest('GET', '/api/ai-status') as any;
      setAIStatus(response);
    } catch (error) {
      console.error('Failed to check AI status:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/astrology-assistant', {
        question: userMessage.content,
        birthData
      }) as any;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response,
        timestamp: new Date(),
        aiEnhanced: response.aiEnhanced
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      toast({
        title: "Assistant Unavailable",
        description: "The AI assistant is temporarily unavailable. Please try again later.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm currently having technical difficulties. Please try asking your question again later, or consult traditional astrological resources for guidance.",
        timestamp: new Date(),
        aiEnhanced: false
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What does my sun sign reveal about my personality?",
    "How do my Western and Vedic charts compare?",
    "What are my strongest planetary aspects?",
    "When is the best time for new beginnings?",
    "What career path suits my astrological profile?",
    "How can I work with my challenging aspects?"
  ];

  const askSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const explainConcept = async (concept: string) => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/astrology-education', {
        topic: concept
      }) as any;

      const educationMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `**About ${concept}:**\n\n${response.explanation}`,
        timestamp: new Date(),
        aiEnhanced: response.aiEnhanced
      };

      setMessages(prev => [...prev, educationMessage]);

    } catch (error) {
      toast({
        title: "Education Feature Unavailable",
        description: "Unable to provide educational content at this time.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`h-[600px] flex flex-col cosmic-gradient border-purple-300/30 ${className}`}>
      <CardHeader className="flex-shrink-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          AI Astrology Assistant
          {aiStatus?.openai?.available && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              AI Enhanced
            </Badge>
          )}
        </CardTitle>
        
        {!aiStatus?.openai?.available && (
          <div className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4" />
              <span className="font-medium">Traditional Mode</span>
            </div>
            AI features require OpenAI integration. Using traditional astrological guidance.
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 border border-purple-300/20 rounded-lg" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-purple-200 py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <p className="text-lg font-medium mb-2">Welcome to your AI Astrology Assistant!</p>
                <p className="text-sm opacity-75">
                  Ask me anything about your astrological chart, planetary influences, or cosmic guidance.
                </p>
              </div>
            )}

            {messages.map(message => (
              <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-yellow-500 text-black'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white/10 text-white border border-purple-300/20'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/20">
                      <span className="text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      
                      {message.aiEnhanced && (
                        <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Enhanced
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white/10 text-white border border-purple-300/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-200"></div>
                      </div>
                      <span className="text-sm">Consulting the cosmic wisdom...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-purple-200">
              <Stars className="h-4 w-4" />
              <span>Suggested questions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-white/5 border-purple-300/20 text-purple-200 hover:bg-white/10"
                  onClick={() => askSuggestedQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Education Links */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-purple-200">
            <BookOpen className="h-4 w-4" />
            <span>Learn about:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Houses', 'Aspects', 'Transits', 'Retrograde'].map((concept) => (
              <Button
                key={concept}
                variant="ghost"
                size="sm"
                className="text-xs text-purple-200 hover:bg-white/10"
                onClick={() => explainConcept(concept)}
                disabled={isLoading}
              >
                {concept}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-purple-300/20" />

        {/* Input Area */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your chart, relationships, timing, or get cosmic guidance..."
              className="bg-white/10 border-purple-300/20 text-white placeholder:text-purple-200/60 min-h-[44px] max-h-[120px] resize-none"
              disabled={isLoading}
              rows={1}
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-yellow-600 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AIAstrologyAssistant;