import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI for testing
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AstrologyAnalysisInput {
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  systems: string[];
  userAge?: number;
  userPreferences?: string[];
}

export interface GeminiAnalysisOutput {
  interpretation: string;
  visualInsights: string;
  recommendations: string[];
  confidence: number;
  businessInsights: string;
  uxSuggestions: string;
}

export async function testGeminiAstrologyAnalysis(input: AstrologyAnalysisInput): Promise<GeminiAnalysisOutput> {
  try {
    const prompt = `As an expert UI/UX designer and business strategist for premium wellness apps, analyze this astrology user profile:

Birth Data: ${input.birthDate} at ${input.birthTime} in ${input.birthLocation}
Systems: ${input.systems.join(', ')}
User Context: ${input.userAge ? `Age ${input.userAge}` : 'Unknown age'}, Preferences: ${input.userPreferences?.join(', ') || 'None specified'}

Please provide expert analysis in the following areas:

1. ASTROLOGICAL INTERPRETATION (as a spiritual advisor):
   - Provide meaningful insights about this birth chart
   - Focus on personality, strengths, and life path guidance
   - Use warm, nurturing language appropriate for wellness seekers

2. VISUAL UX INSIGHTS (as a UI/UX expert):
   - How should our Sanctuary color palette (Brushed Gold #C5A55A, Sage Teal #6A9797, Warm Charcoal #36312E) be applied to this user's dashboard?
   - What visual elements would resonate most with this astrological profile?
   - Suggest specific icon placements, card layouts, or personalization touches

3. BUSINESS RECOMMENDATIONS (as a wellness app strategist):
   - What premium features would this user profile most likely purchase?
   - How should we position our freemium-to-premium conversion for this demographic?
   - What daily engagement features would maintain long-term retention?

4. MOBILE OPTIMIZATION SUGGESTIONS:
   - Specific recommendations for thumb-friendly navigation
   - How to maintain mystical aesthetic while ensuring accessibility
   - Touch target sizing and gesture recommendations

5. PERSONALIZATION STRATEGY:
   - What content should be prioritized in their daily cosmic weather?
   - How to customize the Big Three presentation for maximum emotional impact?
   - Suggested onboarding flow optimizations

Respond in JSON format with clear sections for each area of expertise.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            interpretation: { type: "string" },
            visualInsights: { type: "string" },
            recommendations: { 
              type: "array", 
              items: { type: "string" } 
            },
            confidence: { type: "number" },
            businessInsights: { type: "string" },
            uxSuggestions: { type: "string" }
          },
          required: ["interpretation", "visualInsights", "recommendations", "confidence", "businessInsights", "uxSuggestions"]
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      interpretation: result.interpretation || "Unable to generate interpretation",
      visualInsights: result.visualInsights || "No visual insights available",
      recommendations: result.recommendations || [],
      confidence: Math.max(0, Math.min(1, result.confidence || 0.8)),
      businessInsights: result.businessInsights || "No business insights available",
      uxSuggestions: result.uxSuggestions || "No UX suggestions available"
    };

  } catch (error) {
    console.error("Gemini AI Analysis Error:", error);
    throw new Error(`Failed to get Gemini analysis: ${error}`);
  }
}

export async function testGeminiUIUXExpertise(): Promise<string> {
  try {
    const prompt = `You are an expert UI/UX designer specializing in premium wellness apps for women aged 15-75. 

Analyze our Torchlight astrology app's current design system:

CURRENT IMPLEMENTATION:
- Sanctuary Color Palette: Brushed Gold (#C5A55A), Sage Teal (#6A9797), Warm Charcoal (#36312E)
- Mobile-first responsive design with clamp() typography
- Card-based layout with white transparency overlays
- Interactive elements in gold, informational icons in teal
- "Value first" onboarding: Instant preview → Magical loading → Big Three reveal

QUESTIONS FOR YOUR EXPERTISE:

1. Color Psychology Assessment:
   - Does our palette effectively create emotional safety across all age demographics?
   - Are the contrast ratios optimal for both accessibility and mystical atmosphere?
   - Should we introduce any accent colors for specific user actions?

2. Mobile Experience Optimization:
   - How can we improve thumb-friendly navigation for our card grid layout?
   - What's the optimal touch target size for mystical app aesthetics?
   - Should we implement gesture-based interactions for chart exploration?

3. Conversion Flow Analysis:
   - Is our "instant value → magical reveal → premium upsell" psychologically effective?
   - What micro-interactions would increase emotional engagement?
   - How should we position the paywall without breaking trust?

4. Cross-Generational Appeal:
   - Will teenagers find the Sanctuary palette appealing or too mature?
   - Do women 50+ prefer this aesthetic over brighter alternatives?
   - Should we offer theme customization options?

5. Premium Positioning:
   - Does our visual design communicate $25-50/month value proposition?
   - What visual cues separate us from free astrology apps?
   - How do we maintain accessibility while appearing luxurious?

Please provide specific, actionable recommendations with rationale for each area.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    return response.text || "No expert insights available";

  } catch (error) {
    console.error("Gemini UI/UX Expert Error:", error);
    throw new Error(`Failed to get UI/UX expertise: ${error}`);
  }
}

export async function testGeminiBusinessStrategy(): Promise<string> {
  try {
    const prompt = `You are a business strategist specializing in premium wellness and astrology apps with deep market knowledge.

Analyze Torchlight's business positioning:

CURRENT STRATEGY:
- World's first quad-AI astrology platform (OpenAI + Gemini + Grok + LLaMA)
- 10+ integrated astrological systems (Western, Vedic, Chinese, Human Design, etc.)
- Target: Women 15-75 seeking spiritual guidance and personal development
- Model: Freemium with $25-50 premium tiers
- USP: Authentic astronomical calculations + AI interpretations

MARKET CONTEXT:
- Co-Star: $5M+ revenue, basic Western astrology
- The Pattern: Personality-focused, younger demographic
- Astro.com: Professional, complex interface
- Sanctuary: Wellness-focused, limited AI

STRATEGIC QUESTIONS:

1. Market Differentiation:
   - How do we communicate quad-AI advantage without confusing users?
   - What's our strongest competitive moat against venture-backed competitors?
   - Should we emphasize "10 systems" or "AI-powered insights" as primary differentiator?

2. Pricing Strategy:
   - Is $25-50 too aggressive for astrology app market?
   - Should we offer system-specific tiers ($10 Western, $25 All Systems, $50 AI Premium)?
   - What features justify premium pricing in wellness segment?

3. User Acquisition:
   - Which demographic segment should we prioritize for initial growth?
   - What content marketing strategy leverages our AI expertise?
   - How do we compete with TikTok astrology influencers?

4. Retention & Engagement:
   - What daily features keep users engaged without overwhelming them?
   - How do we balance educational content with entertainment?
   - Should we gamify astrology learning or maintain serious wellness tone?

5. Expansion Strategy:
   - International markets: Which cultures/countries align with our 10-system approach?
   - Platform expansion: Should we prioritize iOS app, Android, or web-first?
   - Partnership opportunities: Wellness brands, meditation apps, spiritual retailers?

Provide data-driven recommendations with specific tactics and timeline suggestions.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    return response.text || "No business strategy insights available";

  } catch (error) {
    console.error("Gemini Business Strategy Error:", error);
    throw new Error(`Failed to get business strategy: ${error}`);
  }
}

// Test data for demonstration
export const testUserProfiles = [
  {
    name: "Sarah, 28, Creative Professional",
    birthDate: "1996-07-22",
    birthTime: "09:15",
    birthLocation: "Los Angeles, CA",
    systems: ["western", "vedic", "human-design"],
    userAge: 28,
    userPreferences: ["creativity", "relationships", "career-growth"]
  },
  {
    name: "Maria, 45, Wellness Seeker", 
    birthDate: "1979-11-08",
    birthTime: "14:30",
    birthLocation: "Miami, FL",
    systems: ["western", "chinese", "numerology"],
    userAge: 45,
    userPreferences: ["spirituality", "health", "family-harmony"]
  },
  {
    name: "Emma, 19, Student",
    birthDate: "2005-03-15",
    birthTime: "20:45", 
    birthLocation: "Austin, TX",
    systems: ["western", "chinese"],
    userAge: 19,
    userPreferences: ["personal-growth", "friendships", "future-planning"]
  }
];