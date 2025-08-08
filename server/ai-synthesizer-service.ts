// AI Synthesizer Service - Cross-System Compatibility Analysis
// Combines authentic astrological analyses into unified insights

interface SystemAnalysis {
  system: string;
  analysis: any;
  confidence: number;
  authenticity: 'authentic' | 'fabricated';
}

interface SynthesisResult {
  success: boolean;
  synthesizedInsight?: string;
  coreThemes?: string[];
  harmonies?: string[];
  tensions?: string[];
  actionableAdvice?: string;
  error?: string;
}

export class AISynthesizerService {
  
  /**
   * Synthesize compatibility analysis across multiple astrological systems
   */
  static async synthesizeCompatibility(
    person1Analyses: SystemAnalysis[],
    person2Analyses: SystemAnalysis[],
    userQuestion: string,
    aiService: 'openai' | 'gemini' | 'grok' = 'gemini'
  ): Promise<SynthesisResult> {
    
    // Filter out fabricated systems for authentic synthesis
    const authenticPerson1 = person1Analyses.filter(a => a.authenticity === 'authentic');
    const authenticPerson2 = person2Analyses.filter(a => a.authenticity === 'authentic');
    
    if (authenticPerson1.length === 0 || authenticPerson2.length === 0) {
      return {
        success: false,
        error: 'Insufficient authentic astrological data for synthesis'
      };
    }
    
    const masterPrompt = this.buildSynthesisPrompt(
      authenticPerson1,
      authenticPerson2,
      userQuestion
    );
    
    try {
      const synthesizedInsight = await this.callAIService(masterPrompt, aiService);
      const structuredResult = this.parseAIResponse(synthesizedInsight);
      
      return {
        success: true,
        synthesizedInsight: structuredResult.narrative,
        coreThemes: structuredResult.themes,
        harmonies: structuredResult.harmonies,
        tensions: structuredResult.tensions,
        actionableAdvice: structuredResult.advice
      };
    } catch (error) {
      console.error('AI Synthesis failed:', error);
      return {
        success: false,
        error: 'Failed to synthesize compatibility analysis'
      };
    }
  }
  
  /**
   * Build comprehensive synthesis prompt
   */
  private static buildSynthesisPrompt(
    person1Analyses: SystemAnalysis[],
    person2Analyses: SystemAnalysis[],
    userQuestion: string
  ): string {
    return `**Role:** You are a master astrologer with expertise in synthesizing multiple astrological systems into unified insights.

**Context:** Analyzing compatibility between two individuals using authentic astrological calculations from multiple systems.

**Person 1 Authentic Analyses:**
${person1Analyses.map(a => `// ${a.system} (Confidence: ${a.confidence}%):\n${JSON.stringify(a.analysis, null, 2)}`).join('\n\n')}

**Person 2 Authentic Analyses:**
${person2Analyses.map(a => `// ${a.system} (Confidence: ${a.confidence}%):\n${JSON.stringify(a.analysis, null, 2)}`).join('\n\n')}

**User Question:** "${userQuestion}"

**Your Task:**
1. **Identify Core Themes:** Find major harmony and tension patterns across systems
2. **Cross-System Synthesis:** Weave findings into coherent narrative (don't list systems separately)
3. **Answer Directly:** Address the specific user question
4. **Provide Action:** Include practical relationship advice

**Output Format (JSON):**
{
  "narrative": "Warm, insightful paragraph-based response",
  "themes": ["core theme 1", "core theme 2"],
  "harmonies": ["harmony point 1", "harmony point 2"],
  "tensions": ["challenge area 1", "challenge area 2"], 
  "advice": "Single actionable recommendation"
}`;
  }
  
  /**
   * Call appropriate AI service
   */
  private static async callAIService(prompt: string, service: 'openai' | 'gemini' | 'grok'): Promise<string> {
    switch (service) {
      case 'openai':
        return this.callOpenAI(prompt);
      case 'gemini':
        return this.callGemini(prompt);
      case 'grok':
        return this.callGrok(prompt);
      default:
        throw new Error(`Unsupported AI service: ${service}`);
    }
  }
  
  /**
   * OpenAI integration
   */
  private static async callOpenAI(prompt: string): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }
    
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });
    
    return response.choices[0].message.content || '';
  }
  
  /**
   * Gemini integration
   */
  private static async callGemini(prompt: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }
    
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      },
      contents: prompt
    });
    
    return response.text || '';
  }
  
  /**
   * Grok integration  
   */
  private static async callGrok(prompt: string): Promise<string> {
    if (!process.env.XAI_API_KEY) {
      throw new Error('Grok API key not configured');
    }
    
    const OpenAI = (await import('openai')).default;
    const grok = new OpenAI({ 
      baseURL: 'https://api.x.ai/v1',
      apiKey: process.env.XAI_API_KEY 
    });
    
    const response = await grok.chat.completions.create({
      model: 'grok-2-1212',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });
    
    return response.choices[0].message.content || '';
  }
  
  /**
   * Parse AI response into structured format
   */
  private static parseAIResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      
      // Fallback: extract insights from text response
      return {
        narrative: response,
        themes: [],
        harmonies: [],
        tensions: [],
        advice: 'Consider the insights provided for relationship guidance.'
      };
    }
  }
  
  /**
   * Generate lifestyle synthesis across systems
   */
  static async synthesizeLifestyleRecommendations(
    userProfile: any,
    requestedCategory: 'gemstones' | 'colors' | 'timing' | 'travel' | 'all',
    specificGoal: string,
    aiService: 'openai' | 'gemini' | 'grok' = 'gemini'
  ): Promise<SynthesisResult> {
    
    const lifestylePrompt = this.buildLifestylePrompt(userProfile, requestedCategory, specificGoal);
    
    try {
      const synthesizedGuidance = await this.callAIService(lifestylePrompt, aiService);
      const structuredResult = this.parseAIResponse(synthesizedGuidance);
      
      return {
        success: true,
        synthesizedInsight: structuredResult.guidance,
        coreThemes: structuredResult.principles,
        actionableAdvice: structuredResult.recommendations
      };
    } catch (error) {
      console.error('Lifestyle synthesis failed:', error);
      return {
        success: false,
        error: 'Failed to synthesize lifestyle recommendations'
      };
    }
  }
  
  /**
   * Build lifestyle recommendation prompt
   */
  private static buildLifestylePrompt(
    userProfile: any,
    category: string,
    goal: string
  ): string {
    return `**Role:** Master lifestyle astrologer specializing in practical guidance.

**User Astrological Profile:**
${JSON.stringify(userProfile, null, 2)}

**Category Focus:** ${category}
**User Goal:** "${goal}"

**Your Task:**
Provide authentic astrological lifestyle guidance based on the user's multi-system profile.
Focus on practical recommendations that synthesize insights across systems.

**Output Format (JSON):**
{
  "guidance": "Comprehensive lifestyle guidance paragraph",
  "principles": ["core principle 1", "core principle 2"],
  "recommendations": "Specific actionable steps"
}`;
  }
}