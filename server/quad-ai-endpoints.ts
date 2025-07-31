import type { Express } from "express";
import OpenAIIntegration from "./openai-integration";
import { multiAI } from "./multi-ai-manager";

export function setupQuadAIEndpoints(app: Express) {
  // Initialize AI provider
  const openaiIntegration = new OpenAIIntegration();

  // Test endpoint for specific AI provider
  app.post('/api/ai-interpret/:provider', async (req, res) => {
    try {
      const { provider } = req.params;
      const { birthDate, birthTime, birthPlace, question } = req.body;

      const prompt = `Provide astrological interpretation for someone born on ${birthDate} at ${birthTime} in ${birthPlace}. Question: ${question}`;

      let result;
      const startTime = Date.now();

      // Use the multi-AI manager to get interpretation from specific provider
      result = await multiAI.generateInterpretation(prompt, provider.toLowerCase());

      const endTime = Date.now();

      res.json({
        provider: provider.toUpperCase(),
        interpretation: result,
        responseTime: endTime - startTime,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error(`Error with ${req.params.provider} AI:`, error);
      res.status(500).json({ 
        error: `${req.params.provider.toUpperCase()} AI interpretation failed`,
        fallback: "Traditional astrological interpretation available"
      });
    }
  });

  // Quad-AI comparison endpoint
  app.post('/api/quad-ai-compare', async (req, res) => {
    try {
      const { birthDate, birthTime, birthPlace, question } = req.body;
      const prompt = `Provide astrological interpretation for someone born on ${birthDate} at ${birthTime} in ${birthPlace}. Question: ${question}`;

      const providers = ['openai', 'grok', 'gemini', 'llama'];

      // Test all providers simultaneously
      const promises = providers.map(async (provider) => {
        try {
          const startTime = Date.now();
          const interpretation = await multiAI.generateInterpretation(prompt, provider);
          const endTime = Date.now();
          
          return {
            provider: provider.toUpperCase(),
            interpretation,
            responseTime: endTime - startTime,
            success: true
          };
        } catch (error: any) {
          return {
            provider: provider.toUpperCase(),
            interpretation: `${provider.toUpperCase()} unavailable - failover active`,
            responseTime: 0,
            success: false,
            error: error?.message || 'Unknown error'
          };
        }
      });

      const allResults = await Promise.all(promises);
      res.json({
        results: allResults,
        summary: {
          totalProviders: providers.length,
          successfulProviders: allResults.filter(r => r.success).length,
          avgResponseTime: allResults.reduce((sum, r) => sum + r.responseTime, 0) / allResults.length
        }
      });

    } catch (error: any) {
      console.error('Quad-AI comparison error:', error);
      res.status(500).json({ error: 'Quad-AI comparison failed' });
    }
  });

  // AI provider health check
  app.get('/api/ai-health-check', async (req, res) => {
    const healthChecks = [];
    const providers = ['openai', 'grok', 'gemini', 'llama'];

    for (const provider of providers) {
      try {
        const startTime = Date.now();
        await multiAI.generateInterpretation("Test health check", provider);
        const endTime = Date.now();
        
        healthChecks.push({
          provider: provider.toUpperCase(),
          status: 'healthy',
          responseTime: endTime - startTime,
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        healthChecks.push({
          provider: provider.toUpperCase(),
          status: 'unhealthy',
          error: error?.message || 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    }

    const healthyCount = healthChecks.filter(check => check.status === 'healthy').length;
    
    res.json({
      healthChecks,
      summary: {
        totalProviders: providers.length,
        healthyProviders: healthyCount,
        healthPercentage: (healthyCount / providers.length) * 100,
        systemStatus: healthyCount > 0 ? 'operational' : 'degraded'
      }
    });
  });
}