// Gemini AI Integration for Torchlight Astrology Platform
// Third AI provider for astrological interpretations

import * as fs from "fs";
import { GoogleGenAI, Modality } from "@google/genai";

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

interface Sentiment {
  rating: number;
  confidence: number;
}

class GeminiAstrologyIntegration {
  private ai: GoogleGenAI | null = null;
  private isAvailable: boolean = false;

  constructor() {
    if (process.env.GEMINI_API_KEY) {
      this.ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY 
      });
      this.isAvailable = true;
      console.log('✅ Gemini AI integration initialized for astrological analysis');
    } else {
      console.log('⚠️ Gemini API key not provided - Gemini AI disabled');
    }
  }

  async generateWesternInterpretation(chartData: any): Promise<AstrologicalInterpretation | null> {
    if (!this.isAvailable || !this.ai) return null;

    try {
      const sunPlanet = chartData.planets?.find((p: any) => p.planet === 'Sun');
      const moonPlanet = chartData.planets?.find((p: any) => p.planet === 'Moon');
      
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: `You are a professional astrologer with expertise in Western tropical astrology. 
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
          }`,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              personalityCore: { type: "string" },
              lifeThemes: { type: "array", items: { type: "string" } },
              strengths: { type: "array", items: { type: "string" } },
              challenges: { type: "array", items: { type: "string" } },
              currentInfluences: { type: "string" },
              guidance: { type: "string" },
              synthesis: { type: "string" }
            },
            required: ["personalityCore", "lifeThemes", "strengths", "challenges", "currentInfluences", "guidance", "synthesis"]
          }
        },
        contents: `Analyze this Western astrological chart:
        Sun: ${sunPlanet?.sign} at ${sunPlanet?.degree}° in house ${sunPlanet?.house}
        Moon: ${moonPlanet?.sign} at ${moonPlanet?.degree}° in house ${moonPlanet?.house}
        Rising Sign: ${chartData.houses?.[0]?.sign}
        
        Chart Data: ${JSON.stringify(chartData, null, 2)}
        
        Provide a comprehensive Western astrological interpretation focusing on personality, life themes, and practical guidance.`
      });

      const result = JSON.parse(response.text || '{}');
      return result as AstrologicalInterpretation;

    } catch (error) {
      console.error('Gemini Western interpretation failed:', error);
      return null;
    }
  }

  async generateCrossSystemSynthesis(systemsData: any): Promise<CrossSystemAnalysis | null> {
    if (!this.isAvailable || !this.ai) return null;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: `You are an expert in multiple astrological traditions including Western, Vedic, Chinese, and Human Design. 
          Analyze multiple astrological traditions to identify consensus, conflicts, and provide synthesis.
          Focus on practical guidance where systems agree and honest acknowledgment of differences.
          Respond with JSON in this exact format: {
            "consensus": ["string array of areas where systems agree"],
            "conflicts": ["string array of areas where systems disagree"],
            "recommendations": "string with practical guidance",
            "confidenceLevel": number between 0 and 1
          }`,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              consensus: { type: "array", items: { type: "string" } },
              conflicts: { type: "array", items: { type: "string" } },
              recommendations: { type: "string" },
              confidenceLevel: { type: "number" }
            },
            required: ["consensus", "conflicts", "recommendations", "confidenceLevel"]
          }
        },
        contents: `Analyze these astrological systems for consensus and conflicts:
        ${JSON.stringify(systemsData, null, 2)}
        
        Identify where different traditions agree (consensus) and where they provide different guidance (conflicts).
        Provide practical recommendations focusing on areas of agreement.`
      });

      const result = JSON.parse(response.text || '{}');
      return result as CrossSystemAnalysis;

    } catch (error) {
      console.error('Gemini cross-system synthesis failed:', error);
      return null;
    }
  }

  async generatePersonalizedGuidance(birthData: any, question: string): Promise<string | null> {
    if (!this.isAvailable || !this.ai) return null;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: `You are a compassionate astrological guide. Provide personalized, practical guidance 
          based on astrological principles while emphasizing personal empowerment and free will.
          Keep responses warm, insightful, and actionable.`
        },
        contents: `Birth details: ${birthData.firstName} born ${birthData.birthDate} at ${birthData.birthTime} in ${birthData.location?.city}
        Question: ${question}
        
        Provide personalized astrological guidance that is practical and empowering.`
      });

      return response.text || null;

    } catch (error) {
      console.error('Gemini personalized guidance failed:', error);
      return null;
    }
  }

  async enhanceNumerologyInterpretation(numerologyData: any): Promise<string | null> {
    if (!this.isAvailable || !this.ai) return null;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: `You are a numerology expert. Provide insightful interpretations of numerological profiles
          that are practical, positive, and focused on personal development and life path guidance.`
        },
        contents: `Analyze this numerology profile:
        Life Path: ${numerologyData.pythagorean?.lifePath}
        Destiny: ${numerologyData.pythagorean?.destiny}
        Soul Urge: ${numerologyData.pythagorean?.soulUrge}
        Personality: ${numerologyData.pythagorean?.personality}
        Personal Year: ${numerologyData.personalYear}
        
        Provide a comprehensive interpretation focusing on life purpose, talents, and current year influences.`
      });

      return response.text || null;

    } catch (error) {
      console.error('Gemini numerology enhancement failed:', error);
      return null;
    }
  }

  async generateAstrologyEducation(topic: string): Promise<string | null> {
    if (!this.isAvailable || !this.ai) return null;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: `You are an astrological educator. Explain astrological concepts clearly and accurately,
          making them accessible to both beginners and advanced students. Focus on authentic traditional principles
          while being practical and inspiring.`
        },
        contents: `Explain the astrological concept: "${topic}"
        
        Provide a comprehensive educational explanation that is both informative and practical.
        Include historical context, modern applications, and how this concept can be used for personal growth.`
      });

      return response.text || null;

    } catch (error) {
      console.error('Gemini astrology education failed:', error);
      return null;
    }
  }

  getStatus() {
    return {
      available: this.isAvailable,
      status: this.isAvailable ? "Active (Gemini AI third provider enabled)" : "Unavailable"
    };
  }
}

export const geminiAI = new GeminiAstrologyIntegration();