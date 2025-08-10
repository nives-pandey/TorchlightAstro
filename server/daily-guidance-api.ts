import type { Express } from "express";
import { GeminiDailyGuidance } from './gemini-daily-guidance';

// Initialize Gemini Daily Guidance
const guidanceEngine = new GeminiDailyGuidance();

export function registerDailyGuidanceAPI(app: Express) {

  // Get today's general guidance
  app.get("/api/guidance/today", async (req, res) => {
    try {
      console.log('🌟 Generating today\'s guidance via Gemini AI...');
      
      const guidance = await guidanceEngine.generateDailyGuidance({
        guidanceType: 'daily',
        systems: ['western', 'vedic', 'numerology', 'chinese']
      });
      
      console.log('✅ Daily guidance generated successfully');
      
      res.json({
        success: true,
        source: "Gemini AI",
        type: "Daily Universal Guidance",
        data: guidance
      });

    } catch (error) {
      console.error('Daily guidance generation failed:', error);
      res.status(500).json({ 
        error: "Failed to generate today's guidance",
        details: error.message 
      });
    }
  });

  // Get personalized daily guidance
  app.post("/api/guidance/personal", async (req, res) => {
    try {
      const { birthData } = req.body;
      
      if (!birthData?.birthDate) {
        return res.status(400).json({ 
          error: "Birth date is required for personalized guidance" 
        });
      }

      console.log('🌟 Generating personalized guidance via Gemini AI...');
      
      const guidance = await guidanceEngine.generatePersonalizedGuidance(birthData);
      
      console.log('✅ Personalized guidance generated successfully');
      
      res.json({
        success: true,
        source: "Gemini AI",
        type: "Personalized Daily Guidance",
        birthDate: birthData.birthDate,
        data: guidance
      });

    } catch (error) {
      console.error('Personalized guidance generation failed:', error);
      res.status(500).json({ 
        error: "Failed to generate personalized guidance",
        details: error.message 
      });
    }
  });

  // Get weekly outlook
  app.get("/api/guidance/weekly", async (req, res) => {
    try {
      console.log('🌟 Generating weekly outlook via Gemini AI...');
      
      const weeklyOutlook = await guidanceEngine.generateWeeklyOutlook();
      
      console.log('✅ Weekly outlook generated successfully');
      
      res.json({
        success: true,
        source: "Gemini AI",
        type: "Weekly Astrological Outlook",
        data: weeklyOutlook
      });

    } catch (error) {
      console.error('Weekly outlook generation failed:', error);
      res.status(500).json({ 
        error: "Failed to generate weekly outlook",
        details: error.message 
      });
    }
  });

  // Get guidance for specific date
  app.post("/api/guidance/date", async (req, res) => {
    try {
      const { date, birthData } = req.body;
      
      if (!date) {
        return res.status(400).json({ 
          error: "Date is required" 
        });
      }

      console.log(`🌟 Generating guidance for ${date} via Gemini AI...`);
      
      const request = {
        guidanceType: 'daily' as const,
        systems: ['western', 'vedic', 'numerology', 'chinese'],
        ...(birthData && { birthData })
      };
      
      const guidance = birthData 
        ? await guidanceEngine.generatePersonalizedGuidance(birthData)
        : await guidanceEngine.generateDailyGuidance(request);
      
      console.log('✅ Date-specific guidance generated successfully');
      
      res.json({
        success: true,
        source: "Gemini AI",
        type: birthData ? "Personalized Date Guidance" : "Universal Date Guidance",
        requestedDate: date,
        data: guidance
      });

    } catch (error) {
      console.error('Date-specific guidance generation failed:', error);
      res.status(500).json({ 
        error: "Failed to generate guidance for specified date",
        details: error.message 
      });
    }
  });

  // Test Gemini connection
  app.get("/api/guidance/test", async (req, res) => {
    try {
      console.log('🧪 Testing Gemini AI connection for guidance...');
      
      const testGuidance = await guidanceEngine.generateDailyGuidance({
        guidanceType: 'daily',
        systems: ['western']
      });
      
      res.json({
        success: true,
        message: "Gemini AI connection successful",
        source: "Gemini AI",
        test: true,
        sample: testGuidance
      });

    } catch (error) {
      console.error('Gemini guidance test failed:', error);
      res.status(500).json({ 
        error: "Gemini AI connection test failed",
        details: error.message 
      });
    }
  });

  console.log('✅ Gemini Daily Guidance API registered');
  console.log('📍 Available endpoints:');
  console.log('   GET  /api/guidance/today - Universal daily guidance');
  console.log('   POST /api/guidance/personal - Personalized guidance (requires birthData)');
  console.log('   GET  /api/guidance/weekly - Weekly astrological outlook');
  console.log('   POST /api/guidance/date - Guidance for specific date');
  console.log('   GET  /api/guidance/test - Test Gemini connection');
}