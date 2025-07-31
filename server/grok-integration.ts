// Grok (xAI) Integration for Torchlight Astrology Platform
// Backup AI provider for astrological interpretations

import OpenAI from "openai";

interface AstrologicalInterpretation {
  personalityCore: string;
  lifeThemes: string[];
  strengths: string[];
  challenges: string[];
  currentInfluences: string;
  guidance: string;
  synthesis: string;
}

interface CrossSystemAnalysis {
  consensus: string[];
  conflicts: string[];
  recommendations: string;
  confidenceLevel: number;
}

class GrokAstrologyIntegration {
  private grok: OpenAI | null = null;
  private isAvailable: boolean = false;

  constructor() {
    if (process.env.XAI_API_KEY) {
      this.grok = new OpenAI({ 
        baseURL: "https://api.x.ai/v1",
        apiKey: process.env.XAI_API_KEY 
      });
      this.isAvailable = true;
      console.log('✅ Grok AI integration initialized for astrological analysis');
    } else {
      console.log('⚠️ Grok API key not provided - backup AI disabled');
    }
  }

  async generateWesternInterpretation(chartData: any): Promise<AstrologicalInterpretation | null> {
    if (!this.isAvailable || !this.grok) return null;

    try {
      const sunPlanet = chartData.planets?.find((p: any) => p.planet === 'Sun');
      const moonPlanet = chartData.planets?.find((p: any) => p.planet === 'Moon');
      
      const response = await this.grok.chat.completions.create({
        model: "grok-2-1212",
        messages: [
          {
            role: "system",
            content: `You are a professional astrologer with expertise in Western tropical astrology. 
            Analyze the birth chart data and provide insightful, personalized interpretations. 
            Focus on practical guidance and authentic astrological principles.
            Respond with JSON in this exact format: {
              "personalityCore": "string",
              "lifeThemes": ["string array"],
              "strengths": ["string array"], 
              "challenges": ["string array"],
              "currentInfluences": "string",
              "guidance": "string",
              "synthesis": "string"
            }`
          },
          {
            role: "user",
            content: `Analyze this Western astrological chart:
            Sun: ${sunPlanet?.sign} at ${sunPlanet?.degree}° in house ${sunPlanet?.house}
            Moon: ${moonPlanet?.sign} at ${moonPlanet?.degree}° in house ${moonPlanet?.house}
            Rising Sign: ${chartData.houses?.[0]?.sign}
            
            Chart Data: ${JSON.stringify(chartData, null, 2)}
            
            Provide a comprehensive Western astrological interpretation focusing on personality, life themes, and practical guidance.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result as AstrologicalInterpretation;

    } catch (error) {
      console.error('Grok Western interpretation failed:', error);
      return null;
    }
  }

  async generateCrossSystemSynthesis(systemsData: any): Promise<CrossSystemAnalysis | null> {
    if (!this.isAvailable || !this.grok) return null;

    try {
      const response = await this.grok.chat.completions.create({
        model: "grok-2-1212",
        messages: [
          {
            role: "system",
            content: `You are an expert in multiple astrological traditions including Western, Vedic, Chinese, and Human Design. 
            Analyze multiple astrological traditions to identify consensus, conflicts, and provide synthesis.
            Focus on practical guidance where systems agree and honest acknowledgment of differences.
            Respond with JSON in this exact format: {
              "consensus": ["string array of areas where systems agree"],
              "conflicts": ["string array of areas where systems disagree"],
              "recommendations": "string with practical guidance",
              "confidenceLevel": number between 0 and 1
            }`
          },
          {
            role: "user",
            content: `Analyze these astrological systems for consensus and conflicts:
            ${JSON.stringify(systemsData, null, 2)}
            
            Identify where different traditions agree (consensus) and where they provide different guidance (conflicts).
            Provide practical recommendations focusing on areas of agreement.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 600
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result as CrossSystemAnalysis;

    } catch (error) {
      console.error('Grok cross-system synthesis failed:', error);
      return null;
    }
  }

  async generatePersonalizedGuidance(birthData: any, question: string): Promise<string | null> {
    if (!this.isAvailable || !this.grok) return null;

    try {
      const response = await this.grok.chat.completions.create({
        model: "grok-2-1212",
        messages: [
          {
            role: "system",
            content: `You are a compassionate astrological guide. Provide personalized, practical guidance 
            based on astrological principles while emphasizing personal empowerment and free will.
            Keep responses warm, insightful, and actionable.`
          },
          {
            role: "user",
            content: `Birth details: ${birthData.firstName} born ${birthData.birthDate} at ${birthData.birthTime} in ${birthData.location?.city}
            Question: ${question}
            
            Provide personalized astrological guidance that is practical and empowering.`
          }
        ],
        max_tokens: 400
      });

      return response.choices[0].message.content;

    } catch (error) {
      console.error('Grok personalized guidance failed:', error);
      return null;
    }
  }

  async enhanceNumerologyInterpretation(numerologyData: any): Promise<string | null> {
    if (!this.isAvailable || !this.grok) return null;

    try {
      const response = await this.grok.chat.completions.create({
        model: "grok-2-1212",
        messages: [
          {
            role: "system",
            content: `You are a numerology expert. Provide insightful interpretations of numerological profiles
            that are practical, positive, and focused on personal development and life path guidance.`
          },
          {
            role: "user", 
            content: `Analyze this numerology profile:
            Life Path: ${numerologyData.pythagorean?.lifePath}
            Destiny: ${numerologyData.pythagorean?.destiny}
            Soul Urge: ${numerologyData.pythagorean?.soulUrge}
            Personality: ${numerologyData.pythagorean?.personality}
            Personal Year: ${numerologyData.personalYear}
            
            Provide a comprehensive interpretation focusing on life purpose, talents, and current year influences.`
          }
        ],
        max_tokens: 500
      });

      return response.choices[0].message.content;

    } catch (error) {
      console.error('Grok numerology enhancement failed:', error);
      return null;
    }
  }

  async generateAstrologyEducation(topic: string): Promise<string | null> {
    if (!this.isAvailable || !this.grok) return null;

    try {
      const response = await this.grok.chat.completions.create({
        model: "grok-2-1212",
        messages: [
          {
            role: "system",
            content: `You are an astrological educator. Explain astrological concepts clearly and accurately,
            making them accessible to both beginners and advanced students. Focus on authentic traditional principles
            while being practical and inspiring.`
          },
          {
            role: "user",
            content: `Explain the astrological concept: "${topic}"
            
            Provide a comprehensive educational explanation that is both informative and practical.
            Include historical context, modern applications, and how this concept can be used for personal growth.`
          }
        ],
        max_tokens: 500
      });

      return response.choices[0].message.content;

    } catch (error) {
      console.error('Grok astrology education failed:', error);
      return null;
    }
  }

  getStatus() {
    return {
      available: this.isAvailable,
      status: this.isAvailable ? "Active (Grok AI backup enabled)" : "Unavailable"
    };
  }
}

export const grokAI = new GrokAstrologyIntegration();