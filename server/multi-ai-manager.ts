// Multi-AI Manager for Torchlight Astrology Platform
// Manages OpenAI and Grok AI providers with intelligent fallback

import { openaiAI } from './openai-integration';
import { grokAI } from './grok-integration';

export class MultiAIManager {
  async generateWesternInterpretation(chartData: any): Promise<any> {
    // Try OpenAI first
    let result = await openaiAI.generateWesternInterpretation(chartData);
    if (result) return { ...result, provider: 'OpenAI' };

    // Fallback to Grok
    result = await grokAI.generateWesternInterpretation(chartData);
    if (result) return { ...result, provider: 'Grok' };

    return null;
  }

  async generateCrossSystemSynthesis(systemsData: any): Promise<any> {
    let result = await openaiAI.generateCrossSystemSynthesis(systemsData);
    if (result) return { ...result, provider: 'OpenAI' };

    result = await grokAI.generateCrossSystemSynthesis(systemsData);
    if (result) return { ...result, provider: 'Grok' };

    return null;
  }

  async generatePersonalizedGuidance(birthData: any, question: string): Promise<string | null> {
    let result = await openaiAI.generatePersonalizedGuidance(birthData, question);
    if (result) return result;

    return await grokAI.generatePersonalizedGuidance(birthData, question);
  }

  async enhanceNumerologyInterpretation(numerologyData: any): Promise<string | null> {
    let result = await openaiAI.enhanceNumerologyInterpretation(numerologyData);
    if (result) return result;

    return await grokAI.enhanceNumerologyInterpretation(numerologyData);
  }

  async generateAstrologyEducation(topic: string): Promise<string | null> {
    let result = await openaiAI.generateAstrologyEducation(topic);
    if (result) return result;

    return await grokAI.generateAstrologyEducation(topic);
  }

  getStatus() {
    const openaiStatus = {
      available: openaiAI.isAPIAvailable(),
      status: openaiAI.getStatus()
    };
    
    const grokStatus = grokAI.getStatus();
    
    return {
      openai: openaiStatus,
      grok: grokStatus,
      features: {
        personalizedInterpretations: openaiStatus.available || grokStatus.available,
        crossSystemSynthesis: openaiStatus.available || grokStatus.available,
        conversationalGuidance: openaiStatus.available || grokStatus.available,
        educationalContent: openaiStatus.available || grokStatus.available
      }
    };
  }
}

export const multiAI = new MultiAIManager();