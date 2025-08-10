import { GoogleGenerativeAI } from '@google/generative-ai';

interface DailyGuidanceRequest {
  userId?: string;
  birthData?: {
    birthDate: string;
    birthTime?: string;
    city?: string;
  };
  systems?: string[];
  guidanceType?: 'daily' | 'weekly' | 'monthly';
}

interface DailyGuidanceResponse {
  date: string;
  guidance: {
    overview: string;
    love: string;
    career: string;
    health: string;
    spiritual: string;
    lucky: {
      numbers: number[];
      colors: string[];
      gemstone: string;
    };
  };
  planetary: {
    significantTransits: string[];
    moonPhase: string;
    recommendation: string;
  };
  systems: {
    western?: string;
    vedic?: string;
    numerology?: string;
    chinese?: string;
  };
}

export class GeminiDailyGuidance {
  private gemini: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found. Set GOOGLE_API_KEY or GEMINI_API_KEY environment variable.');
    }
    
    this.gemini = new GoogleGenerativeAI(apiKey);
    this.model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-pro' });
  }

  async generateDailyGuidance(request: DailyGuidanceRequest): Promise<DailyGuidanceResponse> {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    const prompt = this.buildDailyGuidancePrompt(request, dateString);
    
    try {
      const result = await this.model.generateContent({
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      });

      const response = await result.response;
      const jsonResponse = JSON.parse(response.text());
      
      return {
        date: dateString,
        ...jsonResponse
      };
    } catch (error) {
      console.error('Gemini daily guidance generation failed:', error);
      throw new Error('Failed to generate daily guidance via Gemini AI');
    }
  }

  async generatePersonalizedGuidance(birthData: any): Promise<DailyGuidanceResponse> {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    const personalizedPrompt = this.buildPersonalizedPrompt(birthData, dateString);
    
    try {
      const result = await this.model.generateContent({
        contents: [{
          role: "user",
          parts: [{ text: personalizedPrompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      });

      const response = await result.response;
      const jsonResponse = JSON.parse(response.text());
      
      return {
        date: dateString,
        ...jsonResponse
      };
    } catch (error) {
      console.error('Gemini personalized guidance failed:', error);
      throw new Error('Failed to generate personalized guidance via Gemini AI');
    }
  }

  private buildDailyGuidancePrompt(request: DailyGuidanceRequest, date: string): string {
    const currentDay = new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `You are Lyra, a master astrologer with deep wisdom. Generate comprehensive daily guidance for ${currentDay}.

**Context:**
- Date: ${date}
- Current planetary transits and moon phase
- Universal energetic themes for today

**Task:** Create personalized astrological guidance in JSON format with the following structure:

{
  "guidance": {
    "overview": "A warm, encouraging overview of today's cosmic energy (2-3 sentences)",
    "love": "Guidance for relationships and emotional connections today",
    "career": "Professional and creative opportunities to focus on",
    "health": "Physical and mental wellness recommendations",
    "spiritual": "Spiritual practices and inner work suggestions"
  },
  "lucky": {
    "numbers": [3 lucky numbers between 1-99],
    "colors": ["2-3 beneficial colors for today"],
    "gemstone": "One recommended gemstone for today's energy"
  },
  "planetary": {
    "significantTransits": ["2-3 key planetary influences today"],
    "moonPhase": "Current moon phase and its meaning",
    "recommendation": "One key astrological recommendation for today"
  },
  "systems": {
    "western": "Western astrology insight for today",
    "vedic": "Vedic astrology perspective",
    "numerology": "Numerological significance of today's date",
    "chinese": "Chinese astrology element and energy"
  }
}

**Voice:** Speak as Lyra with warmth, wisdom, and gentle guidance. Use inclusive language that welcomes all seekers. Focus on empowerment and practical wisdom.

Generate the complete JSON response now.`;
  }

  private buildPersonalizedPrompt(birthData: any, date: string): string {
    const currentDay = new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `You are Lyra, a master astrologer. Create personalized daily guidance for ${currentDay}.

**Personal Birth Information:**
- Birth Date: ${birthData.birthDate || 'Not provided'}
- Birth Time: ${birthData.birthTime || 'Not provided'}
- Birth Location: ${birthData.city || 'Not provided'}

**Current Date:** ${date}

**Task:** Generate deeply personalized astrological guidance based on their birth chart and today's planetary transits.

{
  "guidance": {
    "overview": "Personal cosmic weather report based on their birth chart (2-3 sentences)",
    "love": "Relationship guidance specific to their Venus and Mars placements",
    "career": "Professional guidance based on their Midheaven and 10th house",
    "health": "Wellness advice considering their 6th house and current transits",
    "spiritual": "Spiritual practices aligned with their natal chart themes"
  },
  "lucky": {
    "numbers": [3 numbers derived from their birth date numerology],
    "colors": ["Colors harmonious with their astrological signature"],
    "gemstone": "Gemstone specifically beneficial for their chart today"
  },
  "planetary": {
    "significantTransits": ["Current transits affecting their personal planets"],
    "moonPhase": "How today's moon phase interacts with their natal moon",
    "recommendation": "One key personalized astrological action for today"
  },
  "systems": {
    "western": "Western astrology transit analysis for their chart",
    "vedic": "Vedic dasha or transit relevant to their birth details",
    "numerology": "Personal year/day number calculations and meaning",
    "chinese": "Chinese zodiac year interaction with current energy"
  }
}

**Voice:** Speak directly to them as their personal astrologer with deep knowledge of their cosmic blueprint. Be specific and actionable while maintaining Lyra's warm, wise tone.

Generate the complete personalized JSON response now.`;
  }

  async generateWeeklyOutlook(): Promise<any> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7);

    const prompt = `You are Lyra, master astrologer. Create a weekly astrological outlook from ${startDate.toDateString()} to ${endDate.toDateString()}.

Focus on:
- Major planetary aspects and transits this week
- Daily highlights and challenges
- Best days for different activities (business, love, creativity)
- Moon phase changes and their significance
- Weekly lucky numbers, colors, and gemstones

Return as JSON with detailed weekly guidance structure.`;

    try {
      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      });

      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Weekly outlook generation failed:', error);
      throw new Error('Failed to generate weekly outlook');
    }
  }
}