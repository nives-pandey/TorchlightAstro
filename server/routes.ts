import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { astrologyEngine } from "./astrology-engine";
import { kundaliGenerator } from "./kundali-generator";
import { astrologyAI } from "./astrology-ai";
import { 
  insertBirthDataSchema, 
  insertChartSchema,
  insertCompatibilitySchema,
  insertDailyGuidanceSchema,
  insertSystemComparisonSchema
} from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // AI Chat endpoint
  app.post("/api/ai-chat", isAuthenticated, async (req: any, res) => {
    try {
      const { question, conversationHistory = [] } = req.body;
      const userId = req.user.claims.sub;

      if (!question || typeof question !== 'string') {
        return res.status(400).json({ message: "Question is required" });
      }

      // Get user's birth data and charts
      const birthDataList = await storage.getBirthDataByUserId(userId);
      if (birthDataList.length === 0) {
        return res.json({
          response: "I'd love to provide personalized guidance, but I need your birth information first. Please create your astrological chart to unlock detailed insights about your cosmic blueprint!",
          insights: [],
          recommendations: ["Create your birth chart to get started with personalized guidance"],
          timing: [],
          processingTime: 100
        });
      }

      const primaryBirthData = birthDataList[0];
      const charts = await storage.getChartsByBirthDataId(primaryBirthData.id);
      
      // Get system comparison if available
      let systemComparison;
      if (charts.length > 0) {
        systemComparison = await storage.getSystemComparisonByUserAndChart(userId, charts[0].id);
      }

      // Use Swiss Ephemeris for enhanced precision if available
      let enhancedCharts = charts;
      try {
        const swissEph = await import('./swiss-ephemeris');
        const julianDay = swissEph.SwissEphemeris.dateToJulianDay(new Date(primaryBirthData.birthDate));
        const preciseCalculations = await swissEph.swissEph.calculatePlanetaryPositions(
          julianDay, 
          primaryBirthData.latitude || 0, 
          primaryBirthData.longitude || 0
        );
        
        // Enhance chart data with Swiss Ephemeris precision
        enhancedCharts = charts.map(chart => {
          const chartData = typeof chart.chartData === 'string' ? JSON.parse(chart.chartData) : chart.chartData;
          return {
            ...chart,
            chartData: {
              ...chartData,
              precisionLevel: 'swiss-ephemeris',
              enhancedPlanets: preciseCalculations.planets,
              enhancedHouses: preciseCalculations.houses,
              enhancedAspects: preciseCalculations.aspects
            }
          };
        });
      } catch (error) {
        console.log('Using standard astronomical calculations');
      }

      // Generate AI response with enhanced precision
      const aiResponse = await astrologyAI.generatePersonalizedInsight(
        question,
        enhancedCharts,
        primaryBirthData,
        systemComparison,
        conversationHistory
      );

      res.json(aiResponse);
    } catch (error) {
      console.error("AI Chat error:", error);
      res.status(500).json({ 
        message: "Failed to generate AI response",
        response: "I apologize, but I'm experiencing some cosmic interference right now. Please try asking your question again in a moment.",
        insights: [],
        recommendations: [],
        timing: [],
        processingTime: 0
      });
    }
  });

  // Birth data endpoints
  app.get("/api/birth-data", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const birthData = await storage.getBirthDataByUserId(userId);
      res.json(birthData);
    } catch (error) {
      console.error("Error fetching birth data:", error);
      res.status(500).json({ error: "Failed to fetch birth data" });
    }
  });

  app.post("/api/birth-data", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const birthDataInput = insertBirthDataSchema.parse({
        ...req.body,
        userId
      });
      const birthData = await storage.createBirthData(birthDataInput);
      res.status(201).json(birthData);
    } catch (error) {
      console.error("Error creating birth data:", error);
      res.status(500).json({ error: "Failed to create birth data" });
    }
  });

  // Chart endpoints
  app.get("/api/charts/birth-data/:birthDataId", isAuthenticated, async (req, res) => {
    try {
      const birthDataId = parseInt(req.params.birthDataId);
      const charts = await storage.getChartsByBirthDataId(birthDataId);
      res.json(charts);
    } catch (error) {
      console.error("Error fetching charts:", error);
      res.status(500).json({ error: "Failed to fetch charts" });
    }
  });

  app.post("/api/charts", isAuthenticated, async (req, res) => {
    try {
      const chartInput = insertChartSchema.parse(req.body);
      
      // Generate chart data based on birth information
      const birthData = await storage.getBirthData(chartInput.birthDataId);
      if (!birthData) {
        return res.status(404).json({ error: "Birth data not found" });
      }

      // Generate chart data based on selected systems
      const chartData: any = {};
      
      // Add chart data for selected systems
      if (birthData.systems.western) {
        chartData.western = {
          planets: { sun: "Leo", moon: "Pisces", mercury: "Virgo" },
          houses: { first: "Leo", tenth: "Taurus" },
          aspects: ["Sun trine Moon", "Mercury square Mars"],
          interpretation: "Strong creative potential with emotional sensitivity."
        };
      }
      
      if (birthData.systems.vedic) {
        chartData.vedic = {
          rashi: "Simha",
          nakshatra: "Magha",
          dashas: { current: "Venus", period: "18 years" },
          interpretation: "Leadership qualities and royal nature."
        };
      }
      
      if (birthData.systems.chinese) {
        chartData.chinese = {
          sign: "Dragon",
          element: "Water",
          yin_yang: "Yang",
          interpretation: "Powerful and charismatic personality."
        };
      }
      
      if (birthData.systems.humanDesign) {
        chartData.humanDesign = {
          type: "Generator",
          strategy: "Respond",
          authority: "Sacral",
          interpretation: "Natural life force and sustainable energy."
        };
      }
      
      // Add numerology calculations if selected
      if (birthData.systems.numerology) {
        try {
          const { NumerologyCalculator } = await import('./numerology');
          const { TarotAstrology } = await import('./tarot-astrology');
          const { ColorAstrology } = await import('./color-astrology');
          const { GemstoneAstrology } = await import('./gemstone-astrology');
          
          const birth = new Date(birthData.birthDate);
          const fullName = `${(req as any).user?.firstName || ''} ${(req as any).user?.lastName || ''}`.trim() || 'User';
          
          // Calculate complete numerology profile
          const numerologyProfile = NumerologyCalculator.calculateCompleteProfile(fullName, birth);
          
          // Calculate additional systems
          const tarotCards = TarotAstrology.calculateBirthCards(birth);
          const yearCard = TarotAstrology.calculateYearCard(birth);
          
          // Simple sun sign calculation for color/gemstone systems
          const sunSign = getSimpleSunSignHelper(birth);
          const colors = ColorAstrology.calculatePersonalColors(birth, sunSign);
          const gemstones = GemstoneAstrology.calculatePersonalGemstones(birth, sunSign);
          
          chartData.numerology = {
            ...numerologyProfile,
            tarotCards: {
              birthCards: tarotCards,
              yearCard: yearCard
            },
            colors,
            gemstones
          };
        } catch (error) {
          console.error("Error calculating numerology:", error);
          chartData.numerology = {
            error: "Unable to calculate numerology at this time"
          };
        }
      }

      // Mock lifestyle recommendations
      const lifestyleRecommendations = {
        luckyNumbers: [3, 7, 15, 28],
        luckyColors: ["Gold", "Royal Blue", "Deep Purple"],
        favorableStones: ["Ruby", "Sapphire", "Amethyst"],
        careerGuidance: "Leadership roles, creative arts, spiritual teaching",
        subjects: ["Philosophy", "Arts", "Psychology", "Business"],
        personalityTraits: ["Creative", "Intuitive", "Leader", "Compassionate"],
        foods: ["Citrus fruits", "Golden foods", "Spicy foods"],
        avoidItems: ["Processed foods", "Negative people", "Cluttered spaces"],
        auspiciousDates: ["3rd", "7th", "15th", "28th of any month"],
        dailyPractices: ["Morning meditation", "Creative expression", "Physical exercise"]
      };

      const chart = await storage.createChart({
        ...chartInput,
        chartData: chartData,
        interpretations: {
          western: chartData.western?.interpretation,
          vedic: chartData.vedic?.interpretation,
          chinese: chartData.chinese?.interpretation,
          humanDesign: chartData.humanDesign?.interpretation
        },
        lifestyleRecommendations
      });

      res.status(201).json(chart);
    } catch (error) {
      console.error("Error creating chart:", error);
      res.status(500).json({ error: "Failed to create chart" });
    }
  });

  // System comparison endpoints
  app.get("/api/system-comparisons/:chartId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chartId = parseInt(req.params.chartId);
      const comparison = await storage.getSystemComparisonByUserAndChart(userId, chartId);
      res.json(comparison);
    } catch (error) {
      console.error("Error fetching system comparison:", error);
      res.status(500).json({ error: "Failed to fetch system comparison" });
    }
  });

  app.post("/api/system-comparisons", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const comparisonInput = insertSystemComparisonSchema.parse({
        ...req.body,
        userId
      });
      
      // Get the chart to analyze
      const chart = await storage.getChart(comparisonInput.chartId);
      if (!chart) {
        return res.status(404).json({ error: "Chart not found" });
      }

      // Mock system analysis - this would be replaced with actual cross-system comparison
      const systemAnalysis = {
        westernTraits: ["Creative", "Leader", "Intuitive"],
        vedicTraits: ["Royal nature", "Leadership", "Spiritual"],
        chineseTraits: ["Powerful", "Charismatic", "Lucky"],
        humanDesignTraits: ["Generator", "Life force", "Sustainable"],
        commonPatterns: ["Leadership", "Creativity", "Strong personality"],
        uniqueInsights: {
          western: "Creative artistic expression",
          vedic: "Spiritual leadership path",
          chinese: "Natural magnetism and luck",
          humanDesign: "Sustainable energy patterns"
        },
        synthesizedGuidance: {
          strengths: ["Natural leadership", "Creative abilities", "Spiritual insight"],
          challenges: ["Need for recognition", "Impatience", "Perfectionism"],
          recommendations: ["Develop patience", "Channel creativity", "Lead with compassion"]
        }
      };

      const comparison = await storage.createSystemComparison({
        ...comparisonInput,
        ...systemAnalysis
      });

      res.status(201).json(comparison);
    } catch (error) {
      console.error("Error creating system comparison:", error);
      res.status(500).json({ error: "Failed to create system comparison" });
    }
  });

  // Compatibility endpoints
  app.get("/api/compatibility", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const compatibility = await storage.getCompatibilityByUserId(userId);
      res.json(compatibility);
    } catch (error) {
      console.error("Error fetching compatibility:", error);
      res.status(500).json({ error: "Failed to fetch compatibility" });
    }
  });

  app.post("/api/compatibility", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const compatibilityInput = insertCompatibilitySchema.parse({
        ...req.body,
        primaryUserId: userId
      });
      
      // Mock compatibility analysis
      const analysis = {
        overall: "High compatibility with strong emotional connection",
        strengths: ["Shared values", "Complementary skills", "Mutual respect"],
        challenges: ["Communication styles", "Different life paces"],
        recommendations: ["Practice active listening", "Plan regular quality time"]
      };

      const systemComparisons = {
        western: "Venus-Mars harmony creates romantic attraction",
        vedic: "Moon signs are complementary for emotional understanding",
        chinese: "Dragon-Phoenix pairing brings balance and prosperity",
        humanDesign: "Generator-Projector combination offers mutual growth"
      };

      const compatibility = await storage.createCompatibility({
        ...compatibilityInput,
        analysis: analysis,
        systemComparisons: systemComparisons
      });

      res.status(201).json(compatibility);
    } catch (error) {
      console.error("Error creating compatibility:", error);
      res.status(500).json({ error: "Failed to create compatibility" });
    }
  });

  // Daily guidance endpoints
  app.get("/api/daily-guidance/:date", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const date = req.params.date;
      const guidance = await storage.getDailyGuidanceByUserAndDate(userId, date);
      
      if (!guidance) {
        return res.status(404).json({ error: "Daily guidance not found" });
      }
      
      res.json(guidance);
    } catch (error) {
      console.error("Error fetching daily guidance:", error);
      res.status(500).json({ error: "Failed to fetch daily guidance" });
    }
  });

  app.post("/api/daily-guidance", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const guidanceInput = insertDailyGuidanceSchema.parse({
        ...req.body,
        userId
      });
      
      // Mock daily guidance generation
      const guidanceData = {
        horoscope: {
          western: "Today brings creative opportunities and leadership chances",
          vedic: "Favorable time for spiritual practices and learning",
          chinese: "Lucky day for new beginnings and important decisions",
          humanDesign: "Trust your sacral response in all interactions"
        },
        transits: {
          current: "Moon in favorable aspect to your Sun",
          upcoming: "Mercury entering your career sector next week"
        },
        optimalTiming: {
          best_hours: ["9-11 AM", "2-4 PM", "7-9 PM"],
          avoid_hours: ["12-1 PM", "6-7 PM"],
          lucky_direction: "East"
        },
        luckyElements: {
          colors: ["Gold", "Royal Blue"],
          numbers: [3, 7],
          activities: ["Creative work", "Leadership tasks", "Spiritual practice"]
        },
        systemInsights: {
          western: "Focus on creative self-expression today",
          vedic: "Good day for dharmic activities and service",
          chinese: "Dragon energy supports bold initiatives",
          humanDesign: "Generator energy is high - follow your gut feelings"
        }
      };

      const guidance = await storage.createDailyGuidance({
        ...guidanceInput,
        ...guidanceData
      });

      res.status(201).json(guidance);
    } catch (error) {
      console.error("Error creating daily guidance:", error);
      res.status(500).json({ error: "Failed to create daily guidance" });
    }
  });

  // Numerology calculation routes
  app.post("/api/numerology/calculate", async (req, res) => {
    try {
      const { fullName, birthDate } = req.body;
      
      if (!fullName || !birthDate) {
        return res.status(400).json({ message: "Full name and birth date are required" });
      }

      const { NumerologyCalculator } = await import('./numerology');
      const { TarotAstrology } = await import('./tarot-astrology');
      const { ColorAstrology } = await import('./color-astrology');
      const { GemstoneAstrology } = await import('./gemstone-astrology');
      
      const birth = new Date(birthDate);
      
      // Calculate complete numerology profile
      const numerologyProfile = NumerologyCalculator.calculateCompleteProfile(fullName, birth);
      
      // Calculate additional systems
      const tarotCards = TarotAstrology.calculateBirthCards(birth);
      const yearCard = TarotAstrology.calculateYearCard(birth);
      
      // For color and gemstone calculations, we need sun sign
      // Using a simplified calculation based on birth date
      const sunSign = getSimpleSunSign(birth);
      const colors = ColorAstrology.calculatePersonalColors(birth, sunSign);
      const gemstones = GemstoneAstrology.calculatePersonalGemstones(birth, sunSign);
      
      const response = {
        ...numerologyProfile,
        tarotCards: {
          birthCards: tarotCards,
          yearCard: yearCard
        },
        colors,
        gemstones
      };
      
      res.json(response);
    } catch (error) {
      console.error("Numerology calculation error:", error);
      res.status(500).json({ message: "Failed to calculate numerology" });
    }
  });

  // Helper function to get simple sun sign from birth date
  function getSimpleSunSign(birthDate: Date): string {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    return 'Pisces';
  }

  // Helper function for chart generation
  function getSimpleSunSignHelper(birthDate: Date): string {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    return 'Pisces';
  }

  // Comprehensive Chart Generation
  app.post("/api/generate-chart", async (req, res) => {
    try {
      const birthData = req.body;
      
      // Validate required fields
      if (!birthData.birthDate || !birthData.birthTime || !birthData.city) {
        return res.status(400).json({ error: "Missing required birth data" });
      }
      
      // Generate comprehensive astrological analysis
      const chart = await astrologyEngine.generateComprehensiveChart(birthData);
      
      res.json({
        success: true,
        chart,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating chart:", error);
      res.status(500).json({ 
        error: "Failed to generate chart",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Vedic Kundali Generation
  app.post("/api/generate-kundali", async (req, res) => {
    try {
      const birthData = req.body;
      
      // Generate traditional Kundali
      const kundali = await kundaliGenerator.generateKundali(birthData);
      
      res.json({
        success: true,
        kundali,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating Kundali:", error);
      res.status(500).json({ 
        error: "Failed to generate Kundali",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get Krishna Raj Demo Chart
  app.get("/api/demo-chart", async (req, res) => {
    try {
      const krishnaRajData = {
        name: "Krishna Raj",
        birthDate: "1975-06-14",
        birthTime: "09:18",
        city: "Manipal",
        country: "India",
        latitude: 13.3415,
        longitude: 74.7421,
        timezone: "Asia/Kolkata"
      };
      
      const [chart, kundali] = await Promise.all([
        astrologyEngine.generateComprehensiveChart(krishnaRajData),
        kundaliGenerator.generateKundali(krishnaRajData)
      ]);
      
      res.json({
        success: true,
        profile: krishnaRajData,
        chart,
        kundali,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating demo chart:", error);
      res.status(500).json({ 
        error: "Failed to generate demo chart",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}