// In server/ai-synthesizer-service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with your API key from Replit Secrets
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getSynthesizedCompatibility(person1Data: any, person2Data: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const prompt = `
    **Role:** You are a master astrologer with deep expertise in Western, Vedic, Chinese, Numerology, and Human Design systems. You specialize in synthesizing multi-system compatibility analysis.
    
    **[Persona 1: Chart Data]**
    ${JSON.stringify(person1Data)}
    
    **[Persona 2: Chart Data]**
    ${JSON.stringify(person2Data)}
    
    **Your Task:** Synthesize these charts across all astrological systems to provide a comprehensive compatibility reading. Focus on:
    
    1. **Western Astrology Compatibility**: Sun, Moon, Rising sign compatibility, Venus-Mars dynamics, composite aspects
    2. **Vedic Analysis**: Nakshatra compatibility, dosha balance, planetary periods alignment
    3. **Chinese Zodiac**: Animal sign harmony, element compatibility, annual cycle synchronization
    4. **Numerology Synthesis**: Life path numbers, destiny numbers, relationship cycles
    5. **Human Design**: Energy type compatibility, authority alignment, center connections
    
    **Output Format**: Provide a warm, insightful, and actionable compatibility reading that:
    - Highlights natural harmonies and growth opportunities
    - Addresses potential challenges with constructive guidance
    - Offers practical relationship advice
    - Maintains the sanctuary tone consistent with Torchlight's premium experience
    
    **Length**: Comprehensive 800-1200 words with clear sections for each system.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Return this synthesized text to the user in the app
    return text;
  } catch (error) {
    console.error('AI Synthesizer Error:', error);
    throw new Error('Failed to generate compatibility analysis');
  }
}

export async function getSynthesizedPersonalReading(personalData: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const prompt = `
    **Role:** You are a master astrologer providing comprehensive personal guidance across multiple ancient wisdom systems.
    
    **[Personal Chart Data]**
    ${JSON.stringify(personalData)}
    
    **Your Task:** Create a synthesized personal reading that integrates insights from all available astrological systems. Include:
    
    1. **Core Identity**: Sun, Moon, Rising synthesis with Vedic perspectives
    2. **Life Purpose**: Numerology life path integration with Human Design strategy
    3. **Timing Guidance**: Current planetary transits, Chinese year influences, numerology cycles
    4. **Lifestyle Recommendations**: 
       - Career and financial guidance
       - Relationship patterns and compatibility
       - Health and wellness aligned with constitution
       - Spiritual growth opportunities
    
    **Tone**: Warm, empowering, actionable guidance that feels like personal consultation with a trusted advisor.
    **Length**: 1000-1500 words with clear practical applications.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('AI Synthesizer Error:', error);
    throw new Error('Failed to generate personal reading');
  }
}