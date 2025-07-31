// LLaMA 3.1 AI Integration for Torchlight Astrology Platform
// Fourth AI provider using Together AI's LLaMA 3.1 models

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

class LlamaAstrologyIntegration {
  private baseURL: string = 'https://api.together.xyz/v1';
  private isAvailable: boolean = false;

  constructor() {
    if (process.env.TOGETHER_API_KEY) {
      this.isAvailable = true;
      console.log('✅ LLaMA 3.1 AI integration initialized for astrological analysis');
    } else {
      console.log('⚠️ Together API key not provided - LLaMA 3.1 AI disabled');
    }
  }

  private async makeRequest(messages: any[], model: string = "meta-llama/Meta-Llama-3.1-8B-Instruct"): Promise<string | null> {
    if (!this.isAvailable) return null;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 2048,
          temperature: 0.7,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;

    } catch (error) {
      console.error('LLaMA API request failed:', error);
      return null;
    }
  }

  async generateWesternInterpretation(chartData: any): Promise<AstrologicalInterpretation | null> {
    if (!this.isAvailable) return null;

    try {
      const sunPlanet = chartData.planets?.find((p: any) => p.planet === 'Sun');
      const moonPlanet = chartData.planets?.find((p: any) => p.planet === 'Moon');
      
      const messages = [
        {
          role: "system",
          content: `You are a professional astrologer with deep expertise in Western tropical astrology. 
          Analyze birth chart data and provide insightful, personalized interpretations based on authentic astrological principles.
          Focus on practical guidance and empowering insights. Respond with valid JSON in this exact format:
          {
            "personalityCore": "string describing core personality traits",
            "lifeThemes": ["array", "of", "major", "life", "themes"],
            "strengths": ["array", "of", "natural", "strengths"],
            "challenges": ["array", "of", "growth", "areas"],
            "currentInfluences": "string describing current planetary influences",
            "guidance": "string with practical life guidance",
            "synthesis": "string summarizing overall chart message"
          }`
        },
        {
          role: "user",
          content: `Analyze this Western astrological birth chart:
          
          Sun: ${sunPlanet?.sign} at ${sunPlanet?.degree}° in house ${sunPlanet?.house}
          Moon: ${moonPlanet?.sign} at ${moonPlanet?.degree}° in house ${moonPlanet?.house}
          Rising Sign: ${chartData.houses?.[0]?.sign}
          
          Full Chart Data: ${JSON.stringify(chartData, null, 2)}
          
          Provide a comprehensive Western astrological interpretation focusing on personality development, life purpose, and practical guidance for personal growth.`
        }
      ];

      const response = await this.makeRequest(messages, "meta-llama/Meta-Llama-3.1-8B-Instruct");
      if (!response) return null;

      // Extract JSON from response (LLaMA sometimes includes extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const result = JSON.parse(jsonMatch[0]);
      return result as AstrologicalInterpretation;

    } catch (error) {
      console.error('LLaMA Western interpretation failed:', error);
      return null;
    }
  }

  async generateCrossSystemSynthesis(systemsData: any): Promise<CrossSystemAnalysis | null> {
    if (!this.isAvailable) return null;

    try {
      const messages = [
        {
          role: "system",
          content: `You are an expert in multiple astrological and divination traditions including Western, Vedic, Chinese astrology, Human Design, Numerology, and Tarot.
          Analyze multiple system readings to identify areas of consensus and conflict, then provide practical synthesis.
          Respond with valid JSON in this exact format:
          {
            "consensus": ["areas where systems agree"],
            "conflicts": ["areas where systems disagree or provide different perspectives"],
            "recommendations": "practical guidance based on areas of agreement",
            "confidenceLevel": number between 0 and 1
          }`
        },
        {
          role: "user",
          content: `Analyze these multiple astrological system readings for consensus and conflicts:
          
          ${JSON.stringify(systemsData, null, 2)}
          
          Identify where different traditions provide similar guidance (consensus) and where they offer different perspectives (conflicts). Focus on practical recommendations based on areas of agreement between systems.`
        }
      ];

      const response = await this.makeRequest(messages, "meta-llama/Meta-Llama-3.1-70B-Instruct");
      if (!response) return null;

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const result = JSON.parse(jsonMatch[0]);
      return result as CrossSystemAnalysis;

    } catch (error) {
      console.error('LLaMA cross-system synthesis failed:', error);
      return null;
    }
  }

  async generatePersonalizedGuidance(birthData: any, question: string): Promise<string | null> {
    if (!this.isAvailable) return null;

    try {
      const messages = [
        {
          role: "system",
          content: `You are a wise astrological counselor who provides compassionate, practical guidance based on astrological principles while emphasizing personal empowerment and free will.
          Offer insights that are supportive, actionable, and help people make informed decisions about their lives.`
        },
        {
          role: "user",
          content: `Birth Information: ${birthData.firstName} born ${birthData.birthDate} at ${birthData.birthTime} in ${birthData.location?.city}
          
          Question: ${question}
          
          Please provide personalized astrological guidance that is practical, empowering, and based on authentic astrological principles. Focus on how this person can use their natural strengths and work with current cosmic influences to address their question.`
        }
      ];

      return await this.makeRequest(messages, "meta-llama/Meta-Llama-3.1-8B-Instruct");

    } catch (error) {
      console.error('LLaMA personalized guidance failed:', error);
      return null;
    }
  }

  async enhanceNumerologyInterpretation(numerologyData: any): Promise<string | null> {
    if (!this.isAvailable) return null;

    try {
      const messages = [
        {
          role: "system",
          content: `You are a numerology expert who provides insightful interpretations of numerological profiles.
          Focus on practical applications, personal development insights, and how numbers reveal life patterns and purposes.`
        },
        {
          role: "user",
          content: `Analyze this numerology profile:
          
          Life Path Number: ${numerologyData.pythagorean?.lifePath}
          Destiny Number: ${numerologyData.pythagorean?.destiny}
          Soul Urge Number: ${numerologyData.pythagorean?.soulUrge}
          Personality Number: ${numerologyData.pythagorean?.personality}
          Personal Year: ${numerologyData.personalYear}
          
          Provide a comprehensive numerological interpretation focusing on life purpose, natural talents, relationship patterns, and guidance for the current personal year cycle.`
        }
      ];

      return await this.makeRequest(messages, "meta-llama/Meta-Llama-3.1-8B-Instruct");

    } catch (error) {
      console.error('LLaMA numerology enhancement failed:', error);
      return null;
    }
  }

  async generateAstrologyEducation(topic: string): Promise<string | null> {
    if (!this.isAvailable) return null;

    try {
      const messages = [
        {
          role: "system",
          content: `You are an astrological educator who explains complex concepts clearly and accurately.
          Make astrological knowledge accessible to both beginners and advanced students while maintaining authenticity to traditional principles.
          Include historical context, modern applications, and practical guidance.`
        },
        {
          role: "user",
          content: `Please explain the astrological concept: "${topic}"
          
          Provide a comprehensive educational explanation that includes:
          - Clear definition and core principles
          - Historical context and traditional significance
          - Modern interpretations and applications
          - Practical ways to work with this concept for personal growth
          - Common misconceptions to avoid`
        }
      ];

      return await this.makeRequest(messages, "meta-llama/Meta-Llama-3.1-8B-Instruct");

    } catch (error) {
      console.error('LLaMA astrology education failed:', error);
      return null;
    }
  }

  getStatus() {
    return {
      available: this.isAvailable,
      status: this.isAvailable ? "Active (LLaMA 3.1 fourth AI provider enabled)" : "Unavailable - Missing Together API key"
    };
  }
}

export const llamaAI = new LlamaAstrologyIntegration();