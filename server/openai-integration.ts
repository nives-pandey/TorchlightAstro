// OpenAI Integration for Torchlight Astrology Platform
// AI-powered astrological interpretations and cross-system synthesis

import OpenAI from "openai";

/*
Follow these instructions when using this blueprint:
1. Note that the newest OpenAI model is "gpt-4o", not "gpt-4". gpt-4o was released after your knowledge cutoff. Always prefer using gpt-4o as it is the latest model. When copying code from this blueprint, ensure you also mention this information verbatim as a comment so that you don't revert it to "gpt-4": `// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user`
2. Use the response_format: { type: "json_object" } option
3. Request output in JSON format in the prompt
*/

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = "gpt-4o";

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

class OpenAIAstrologyIntegration {
  private openai: OpenAI | null = null;
  private isAvailable: boolean = false;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ 
        apiKey: process.env.OPENAI_API_KEY 
      });
      this.isAvailable = true;
      console.log('✅ OpenAI integration initialized for astrological analysis');
    } else {
      console.log('⚠️ OpenAI API key not provided - AI interpretations disabled');
    }
  }

  async generateWesternInterpretation(chartData: any): Promise<AstrologicalInterpretation | null> {
    if (!this.isAvailable || !this.openai) return null;

    try {
      const sunPlanet = chartData.planets?.find((p: any) => p.planet === 'Sun');
      const moonPlanet = chartData.planets?.find((p: any) => p.planet === 'Moon');
      
      const response = await this.openai.chat.completions.create({
        model: DEFAULT_MODEL, // gpt-4o
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
            content: `Analyze this Western astrology chart:
            Sun: ${sunPlanet?.sign || 'Unknown'} ${sunPlanet?.degree_in_sign?.toFixed(1) || ''}°
            Moon: ${moonPlanet?.sign || 'Unknown'} ${moonPlanet?.degree_in_sign?.toFixed(1) || ''}°
            Rising: ${chartData.ascendant?.sign || 'Unknown'} ${chartData.ascendant?.degree_in_sign?.toFixed(1) || ''}°
            Calculation method: ${chartData.calculation_method || 'Professional'}
            Data source: ${chartData.data_source || 'Astronomical calculations'}
            
            Provide a comprehensive interpretation focusing on personality, life themes, and practical guidance.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result as AstrologicalInterpretation;

    } catch (error) {
      console.error('OpenAI Western interpretation failed:', error);
      return null;
    }
  }

  async generateCrossSystemSynthesis(systems: any[]): Promise<CrossSystemAnalysis | null> {
    if (!this.isAvailable || !this.openai || !systems.length) return null;

    try {
      const systemsData = systems.map((s: any) => ({
        name: s.system,
        accuracy: s.accuracy,
        keyInsights: s.interpretation || 'Professional analysis available'
      }));

      const response = await this.openai.chat.completions.create({
        model: DEFAULT_MODEL, // gpt-4o
        messages: [
          {
            role: "system", 
            content: `You are an expert in comparative astrology and metaphysical systems.
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
      console.error('OpenAI cross-system synthesis failed:', error);
      return null;
    }
  }

  async generatePersonalizedGuidance(birthData: any, question: string): Promise<string | null> {
    if (!this.isAvailable || !this.openai) return null;

    try {
      const response = await this.openai.chat.completions.create({
        model: DEFAULT_MODEL, // gpt-4o
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
      console.error('OpenAI personalized guidance failed:', error);
      return null;
    }
  }

  async enhanceNumerologyInterpretation(numerologyData: any): Promise<string | null> {
    if (!this.isAvailable || !this.openai) return null;

    try {
      const response = await this.openai.chat.completions.create({
        model: DEFAULT_MODEL, // gpt-4o
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
      console.error('OpenAI numerology interpretation failed:', error);
      return null;
    }
  }

  async generateAstrologyEducation(topic: string): Promise<string | null> {
    if (!this.isAvailable || !this.openai) return null;

    try {
      const response = await this.openai.chat.completions.create({
        model: DEFAULT_MODEL, // gpt-4o
        messages: [
          {
            role: "system",
            content: `You are an astrological educator. Explain astrological concepts clearly and accurately,
            focusing on the historical context, methodology, and practical applications. 
            Maintain respect for traditional knowledge while being scientifically honest about limitations.`
          },
          {
            role: "user",
            content: `Explain the astrological concept: ${topic}
            
            Provide a clear, educational explanation that covers the traditional meaning, 
            how it's calculated or determined, and its practical applications in modern astrology.`
          }
        ],
        max_tokens: 400
      });

      return response.choices[0].message.content;

    } catch (error) {
      console.error('OpenAI astrology education failed:', error);
      return null;
    }
  }

  isAPIAvailable(): boolean {
    return this.isAvailable;
  }

  getStatus(): string {
    return this.isAvailable 
      ? 'Active (AI-powered interpretations enabled)'
      : 'API key needed (AI interpretations disabled)';
  }
}

export default OpenAIAstrologyIntegration;