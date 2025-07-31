// Multi-AI Manager for Torchlight Astrology Platform
// Manages OpenAI and Grok AI providers with intelligent fallback

import { openaiAI } from './openai-integration';
import { grokAI } from './grok-integration';
import { geminiAI } from './gemini-integration';

export class MultiAIManager {
  async generateWesternInterpretation(chartData: any): Promise<any> {
    // Try OpenAI first
    let result = await openaiAI.generateWesternInterpretation(chartData);
    if (result) return { ...result, provider: 'OpenAI' };

    // Fallback to Grok
    result = await grokAI.generateWesternInterpretation(chartData);
    if (result) return { ...result, provider: 'Grok' };

    // Final fallback to Gemini
    result = await geminiAI.generateWesternInterpretation(chartData);
    if (result) return { ...result, provider: 'Gemini' };

    return null;
  }

  async generateCrossSystemSynthesis(systemsData: any): Promise<any> {
    let result = await openaiAI.generateCrossSystemSynthesis(systemsData);
    if (result) return { ...result, provider: 'OpenAI' };

    result = await grokAI.generateCrossSystemSynthesis(systemsData);
    if (result) return { ...result, provider: 'Grok' };

    result = await geminiAI.generateCrossSystemSynthesis(systemsData);
    if (result) return { ...result, provider: 'Gemini' };

    return null;
  }

  async generatePersonalizedGuidance(birthData: any, question: string): Promise<string | null> {
    let result = await openaiAI.generatePersonalizedGuidance(birthData, question);
    if (result) return result;

    result = await grokAI.generatePersonalizedGuidance(birthData, question);
    if (result) return result;

    return await geminiAI.generatePersonalizedGuidance(birthData, question);
  }

  async enhanceNumerologyInterpretation(numerologyData: any): Promise<string | null> {
    let result = await openaiAI.enhanceNumerologyInterpretation(numerologyData);
    if (result) return result;

    result = await grokAI.enhanceNumerologyInterpretation(numerologyData);
    if (result) return result;

    return await geminiAI.enhanceNumerologyInterpretation(numerologyData);
  }

  async generateAstrologyEducation(topic: string): Promise<string | null> {
    let result = await openaiAI.generateAstrologyEducation(topic);
    if (result) return result;

    result = await grokAI.generateAstrologyEducation(topic);
    if (result) return result;

    return await geminiAI.generateAstrologyEducation(topic);
  }

  getStatus() {
    const openaiStatus = {
      available: openaiAI.isAPIAvailable(),
      status: openaiAI.getStatus()
    };
    
    const grokStatus = grokAI.getStatus();
    const geminiStatus = geminiAI.getStatus();
    
    return {
      openai: openaiStatus,
      grok: grokStatus,
      gemini: geminiStatus,
      features: {
        personalizedInterpretations: openaiStatus.available || grokStatus.available || geminiStatus.available,
        crossSystemSynthesis: openaiStatus.available || grokStatus.available || geminiStatus.available,
        conversationalGuidance: openaiStatus.available || grokStatus.available || geminiStatus.available,
        educationalContent: openaiStatus.available || grokStatus.available || geminiStatus.available
      }
    };
  }
}

export const multiAI = new MultiAIManager();