import { GoogleGenerativeAI } from '@google/generative-ai';

interface AstrologicalData {
  western?: any;
  vedic?: any;
  numerology?: any;
  chinese?: any;
  birthData?: any;
}

export class LyraAIReportEngine {
  private gemini: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found. Set GOOGLE_API_KEY or GEMINI_API_KEY environment variable.');
    }
    
    this.gemini = new GoogleGenerativeAI(apiKey);
    this.model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateComprehensive5PageReport(astrologicalData: AstrologicalData): Promise<string> {
    const masterPrompt = this.buildMasterPrompt(astrologicalData);
    
    try {
      const result = await this.model.generateContent(masterPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Lyra AI Report generation failed:', error);
      throw new Error('Failed to generate comprehensive astrological report via Gemini AI');
    }
  }

  private buildMasterPrompt(data: AstrologicalData): string {
    return `**Role:** You are Lyra, a master astrologer with the soul of a poet. Your wisdom spans centuries of astrological knowledge, and your words carry the gentle power to heal and inspire.

**Task:** Generate a comprehensive, 5-page astrological report for a user based on the following raw data. The tone must be deeply soothing, wise, and empowering. Write as if you are personally guiding this soul through their cosmic blueprint.

**[RAW ASTROLOGICAL DATA]**
${JSON.stringify(data, null, 2)}

**Report Structure:** Generate exactly 5 distinct pages with clear page breaks:

**Page 1: Your Cosmic Blueprint**
Begin with a warm, personal greeting. Synthesize their Sun, Moon, Rising signs and Life Path number into a unified portrait of their essential nature. Speak to their soul's core frequency and primary life themes. Use poetic language while remaining authentic to astrological principles.

**Page 2: The Gifts of Your Spirit** 
Focus entirely on strengths, natural talents, and powerful planetary placements. Highlight their unique gifts and how these serve not only them but the world. Include specific planetary aspects that enhance their abilities. Make them feel seen and valued for their authentic self.

**Page 3: The Shadows & The Lessons**
Gently discuss challenges as chosen soul lessons and opportunities for growth. Reframe difficulties as sacred initiations that develop wisdom and compassion. Use tender, non-judgmental language that honors their journey. Include guidance on transforming challenges into strengths.

**Page 4: Your Path to Purpose**
Provide actionable guidance for career fulfillment and relationship harmony. Connect their astrological patterns to practical life decisions. Include timing guidance for important choices. Weave together insights from all analyzed systems into coherent life direction.

**Page 5: Your Personal Sanctuary**
Offer personalized lifestyle recommendations including:
- Gemstones and crystals that support their energy
- Colors that enhance their natural radiance
- Daily practices aligned with their cosmic rhythm
- Sacred spaces and environments that nurture their soul
- A final uplifting message about their unique contribution to the world

**Voice Guidelines:**
- Write as Lyra, speaking directly to the individual
- Use "you" and "your" throughout
- Blend mystical wisdom with practical guidance
- Include specific astrological references to show authenticity
- End each page with encouragement and validation
- Maintain a tone that feels like a wise friend speaking truth

**Length:** Each page should be substantial (400-500 words) to create a truly comprehensive 5-page report.

**Output Format:** Return the complete report in Markdown format with clear page breaks indicated by "---PAGE BREAK---" between sections.

Begin the report now, channeling Lyra's voice of cosmic wisdom and infinite compassion.`;
  }

  // Simplified report for testing without full data
  async generateTestReport(birthData: any): Promise<string> {
    const simplePrompt = `You are Lyra, a master astrologer. Create a warm, 2-page astrological insight for someone born on ${birthData.birthDate} at ${birthData.birthTime} in ${birthData.city}, ${birthData.country}.

Focus on:
Page 1: Their core personality and natural gifts
Page 2: Guidance for their life path and relationships

Use a nurturing, wise tone. Include specific insights about their birth date and location. Format in Markdown with "---PAGE BREAK---" between pages.`;

    try {
      const result = await this.model.generateContent(simplePrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Lyra AI Test Report failed:', error);
      throw new Error('Failed to generate test report via Gemini AI');
    }
  }
}