// Multi-AI Manager for Torchlight Astrology Platform
// Manages OpenAI, Grok, Gemini, and LLaMA AI providers with intelligent fallback

import { openaiAI } from './openai-integration';
import { grokAI } from './grok-integration';
import { geminiAI } from './gemini-integration';
import { llamaAI } from './llama-integration';

export class MultiAIManager {
  async generateWesternInterpretation(chartData: any, preferredProvider?: string): Promise<any> {
    // If specific provider requested, try that first
    if (preferredProvider) {
      let result;
      switch (preferredProvider.toLowerCase()) {
        case 'openai':
          result = await openaiAI.generateWesternInterpretation(chartData);
          if (result) return { ...result, provider: 'OpenAI' };
          break;
        case 'grok':
          result = await grokAI.generateWesternInterpretation(chartData);
          if (result) return { ...result, provider: 'Grok' };
          break;
        case 'gemini':
          result = await geminiAI.generateWesternInterpretation(chartData);
          if (result) return { ...result, provider: 'Gemini' };
          break;
        case 'llama':
          result = await llamaAI.generateWesternInterpretation(chartData);
          if (result) return { ...result, provider: 'LLaMA 3.1' };
          break;
      }
    }

    // Standard failover: Try OpenAI first
    let result = await openaiAI.generateWesternInterpretation(chartData);
    if (result) return { ...result, provider: 'OpenAI' };

    // Fallback to Grok
    result = await grokAI.generateWesternInterpretation(chartData);
    if (result) return { ...result, provider: 'Grok' };

    // Third fallback to Gemini
    result = await geminiAI.generateWesternInterpretation(chartData);
    if (result) return { ...result, provider: 'Gemini' };

    // Final AI fallback to LLaMA
    result = await llamaAI.generateWesternInterpretation(chartData);
    if (result) return { ...result, provider: 'LLaMA 3.1' };

    return null;
  }

  async generateCrossSystemSynthesis(systemsData: any): Promise<any> {
    let result = await openaiAI.generateCrossSystemSynthesis(systemsData);
    if (result) return { ...result, provider: 'OpenAI' };

    result = await grokAI.generateCrossSystemSynthesis(systemsData);
    if (result) return { ...result, provider: 'Grok' };

    result = await geminiAI.generateCrossSystemSynthesis(systemsData);
    if (result) return { ...result, provider: 'Gemini' };

    result = await llamaAI.generateCrossSystemSynthesis(systemsData);
    if (result) return { ...result, provider: 'LLaMA 3.1' };

    return null;
  }

  async generatePersonalizedGuidance(birthData: any, question: string): Promise<string | null> {
    let result = await openaiAI.generatePersonalizedGuidance(birthData, question);
    if (result) return result;

    result = await grokAI.generatePersonalizedGuidance(birthData, question);
    if (result) return result;

    result = await geminiAI.generatePersonalizedGuidance(birthData, question);
    if (result) return result;

    return await llamaAI.generatePersonalizedGuidance(birthData, question);
  }

  async enhanceNumerologyInterpretation(numerologyData: any): Promise<string | null> {
    let result = await openaiAI.enhanceNumerologyInterpretation(numerologyData);
    if (result) return result;

    result = await grokAI.enhanceNumerologyInterpretation(numerologyData);
    if (result) return result;

    result = await geminiAI.enhanceNumerologyInterpretation(numerologyData);
    if (result) return result;

    return await llamaAI.enhanceNumerologyInterpretation(numerologyData);
  }

  async generateAstrologyEducation(topic: string): Promise<string | null> {
    let result = await openaiAI.generateAstrologyEducation(topic);
    if (result) return result;

    result = await grokAI.generateAstrologyEducation(topic);
    if (result) return result;

    result = await geminiAI.generateAstrologyEducation(topic);
    if (result) return result;

    return await llamaAI.generateAstrologyEducation(topic);
  }

  getStatus() {
    const openaiStatus = {
      available: openaiAI.isAPIAvailable(),
      status: openaiAI.getStatus()
    };
    
    const grokStatus = grokAI.getStatus();
    const geminiStatus = geminiAI.getStatus();
    const llamaStatus = llamaAI.getStatus();
    
    return {
      openai: openaiStatus,
      grok: grokStatus,
      gemini: geminiStatus,
      llama: llamaStatus,
      features: {
        personalizedInterpretations: openaiStatus.available || grokStatus.available || geminiStatus.available || llamaStatus.available,
        crossSystemSynthesis: openaiStatus.available || grokStatus.available || geminiStatus.available || llamaStatus.available,
        conversationalGuidance: openaiStatus.available || grokStatus.available || geminiStatus.available || llamaStatus.available,
        educationalContent: openaiStatus.available || grokStatus.available || geminiStatus.available || llamaStatus.available
      }
    };
  }
}

export const multiAI = new MultiAIManager();