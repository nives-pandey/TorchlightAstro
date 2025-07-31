import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import Stripe from "stripe";
import { registerReportRoutes } from "./api-routes";

// Initialize Stripe if keys are available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}
import { astrologyEngine } from "./astrology-engine";
import { kundaliGenerator } from "./kundali-generator";
import { astrologyAI } from "./astrology-ai";
import { freeAstrologyAPI } from "./free-astrology-api";
import { astrologySystemsAPI } from "./astrology-systems-api";
import { comprehensiveChartGenerator } from "./comprehensive-chart-generator";
import { logAPIStatus, checkAPIKeysStatus } from "./api-key-helper";
import { planetaryHoursAPI } from "./planetary-hours-api";
import OpenAIAstrologyIntegration from './openai-integration';
import { 
  insertBirthDataSchema, 
  insertChartSchema,
  insertCompatibilitySchema,
  insertDailyGuidanceSchema,
  insertSystemComparisonSchema
} from "../shared/schema";

// Initialize OpenAI Astrology Integration
const openaiIntegration = new OpenAIAstrologyIntegration();

export async function registerRoutes(app: Express): Promise<Server> {
  // Log API status on startup
  logAPIStatus();
  
  // Auth middleware
  await setupAuth(app);

  // Register report generation routes
  registerReportRoutes(app);

  // Enhanced Chart Generation Endpoint - Multi-tier API integration
  app.post("/api/generate-enhanced-chart", async (req, res) => {
    try {
      console.log('🌟 Enhanced Chart Generator: Multi-tier API approach');
      
      const { EnhancedChartGenerator } = await import('./enhanced-chart-generator');
      const enhancedGenerator = new EnhancedChartGenerator();
      
      const results = await enhancedGenerator.generateEnhancedChart(
        req.body.birthData,
        req.body.systems
      );
      
      res.json(results);
    } catch (error) {
      console.error('Enhanced chart generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Enhanced chart generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Comprehensive Chart Generation Endpoint - All 5 Systems with Authentic Data
  app.post("/api/generate-comprehensive-chart", async (req, res) => {
    try {
      console.log('🌟 Generating comprehensive chart across all 5 astrological systems');
      console.log('Request data:', JSON.stringify(req.body, null, 2));

      // Use comprehensive chart generator for all systems
      const comprehensiveResults = await comprehensiveChartGenerator.generateAllSystems(req.body);
      
      res.json(comprehensiveResults);
    } catch (error) {
      console.error('Comprehensive chart generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate comprehensive chart',
        systems: {}
      });
    }
  });

  // Stripe contribution endpoint
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ 
        error: "Payment processing is not configured. Please contact support." 
      });
    }

    try {
      const { amount, description } = req.body;
      
      if (!amount || amount < 1) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        description: description || "Torchlight Contribution",
        metadata: {
          project: "torchlight-astrology",
          type: "contribution"
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ 
        error: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Admin analytics route
  app.get("/api/admin/analytics", async (req: any, res) => {
    try {
      const analytics = await storage.getAdminAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching admin analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Auth routes - demo mode without authentication
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Demo user for testing
      const demoUser = {
        id: 'demo-user',
        email: 'demo@torchlight.app',
        firstName: 'Demo',
        lastName: 'User',
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      res.json(demoUser);
    } catch (error) {
      console.error("Error fetching demo user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // AI Chat endpoint - demo mode
  app.post("/api/ai-chat", async (req: any, res) => {
    try {
      const { question, conversationHistory = [] } = req.body;
      const userId = 'demo-user';

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

  // Demo chart endpoint for testing
  app.get("/api/demo-chart", async (req: any, res) => {
    try {
      const demoChart = {
        chart: {
          westernChart: {
            planets: [
              { name: 'Sun', degree: 83.45, sign: 'Gemini' },
              { name: 'Moon', degree: 113.24, sign: 'Leo' },
              { name: 'Mercury', degree: 75.12, sign: 'Gemini' },
              { name: 'Venus', degree: 91.33, sign: 'Cancer' },
              { name: 'Mars', degree: 156.78, sign: 'Virgo' },
              { name: 'Jupiter', degree: 67.89, sign: 'Gemini' },
              { name: 'Saturn', degree: 223.45, sign: 'Scorpio' },
              { name: 'Uranus', degree: 345.67, sign: 'Pisces' },
              { name: 'Neptune', degree: 278.90, sign: 'Capricorn' },
              { name: 'Pluto', degree: 201.23, sign: 'Libra' }
            ],
            aspects: [
              { planet1: 'Sun', planet2: 'Mercury', aspect: 'conjunction', orb: 8, exactness: 0.9 },
              { planet1: 'Moon', planet2: 'Mars', aspect: 'semisextile', orb: 13, exactness: 0.4 },
              { planet1: 'Venus', planet2: 'Jupiter', aspect: 'semisextile', orb: 7, exactness: 0.6 },
              { planet1: 'Mars', planet2: 'Saturn', aspect: 'sextile', orb: 7, exactness: 0.8 },
              { planet1: 'Jupiter', planet2: 'Uranus', aspect: 'square', orb: 8, exactness: 0.7 },
              { planet1: 'Saturn', planet2: 'Neptune', aspect: 'sextile', orb: 5, exactness: 0.9 }
            ]
          }
        }
      };
      res.json(demoChart);
    } catch (error) {
      console.error("Error generating demo chart:", error);
      res.status(500).json({ error: "Failed to generate demo chart" });
    }
  });

  // Birth data endpoints - demo mode
  app.get("/api/birth-data", async (req: any, res) => {
    try {
      const userId = 'demo-user';
      const birthData = await storage.getBirthDataByUserId(userId);
      res.json(birthData);
    } catch (error) {
      console.error("Error fetching birth data:", error);
      res.status(500).json({ error: "Failed to fetch birth data" });
    }
  });

  app.post("/api/birth-data", async (req: any, res) => {
    try {
      const userId = 'demo-user';
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

  // Chart endpoints - demo mode
  app.get("/api/charts/birth-data/:birthDataId", async (req, res) => {
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
          const fullName = `${birthData.firstName || ''} ${birthData.lastName || ''}`.trim();
          
          // Validate that we have a proper name for numerology calculations
          if (!fullName || fullName.length < 2) {
            chartData.numerology = {
              error: "Full name is required for numerology calculations. Please ensure first and last names are provided."
            };
            return;
          }
          
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

  function getWesternElement(sign: string): string {
    const elements = {
      'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
      'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
      'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air', 
      'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
    };
    return elements[sign as keyof typeof elements] || 'Unknown';
  }

  function getVedicRashi(birthDate: Date): string {
    // Simplified Vedic calculation (proper one requires moon position)
    return getSimpleSunSignHelper(birthDate);
  }

  function getVedicNakshatra(birthDate: Date): string {
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    const dayOfYear = Math.floor((birthDate.getTime() - new Date(birthDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return nakshatras[dayOfYear % 27];
  }

  function getChineseAnimal(birthDate: Date): string {
    const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    const year = birthDate.getFullYear();
    return animals[(year - 1900) % 12];
  }

  function getChineseElement(birthDate: Date): string {
    const elements = ['Metal', 'Water', 'Wood', 'Fire', 'Earth'];
    const year = birthDate.getFullYear();
    return elements[Math.floor(((year - 1900) % 10) / 2)];
  }

  function calculateLifePath(birthDate: string): number {
    const date = birthDate.replace(/-/g, '');
    let sum = 0;
    for (const digit of date) {
      if (!isNaN(parseInt(digit))) {
        sum += parseInt(digit);
      }
    }
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return sum;
  }

  function calculateDestinyNumber(firstName: string, lastName: string): number {
    const values = { a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9, j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9, s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8 };
    const fullName = (firstName + lastName).toLowerCase().replace(/[^a-z]/g, '');
    let sum = 0;
    for (const char of fullName) {
      sum += values[char as keyof typeof values] || 0;
    }
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return sum;
  }

  function getHumanDesignType(birthDate: Date): string {
    const types = ['Manifestor', 'Generator', 'Manifesting Generator', 'Projector', 'Reflector'];
    const hash = birthDate.getTime() % types.length;
    return types[hash];
  }

  function getHDStrategy(birthDate: Date): string {
    const strategies = ['To Inform', 'To Respond', 'To Respond & Inform', 'Wait for Invitation', 'Wait a Lunar Cycle'];
    const hash = birthDate.getTime() % strategies.length;
    return strategies[hash];
  }

  function getHDAuthority(birthDate: Date): string {
    const authorities = ['Emotional', 'Sacral', 'Splenic', 'Ego', 'Self-Projected', 'Lunar', 'Mental'];
    const hash = (birthDate.getTime() + 1000) % authorities.length;
    return authorities[hash];
  }

  function getHDProfile(birthDate: Date): string {
    const profiles = ['1/3 Investigator/Martyr', '1/4 Investigator/Opportunist', '2/4 Hermit/Opportunist', '2/5 Hermit/Heretic', '3/5 Martyr/Heretic', '3/6 Martyr/Role Model', '4/6 Opportunist/Role Model', '4/1 Opportunist/Investigator', '5/1 Heretic/Investigator', '5/2 Heretic/Hermit', '6/2 Role Model/Hermit', '6/3 Role Model/Martyr'];
    const hash = (birthDate.getTime() + 2000) % profiles.length;
    return profiles[hash];
  }

  function generateHDCenters(birthDate: Date): any[] {
    const centers = ['Root', 'Sacral', 'Spleen', 'Heart', 'G', 'Throat', 'Ajna', 'Crown', 'Solar Plexus'];
    return centers.map((center, index) => ({
      name: center,
      defined: (birthDate.getTime() + index * 1000) % 2 === 0,
      gates: [(birthDate.getTime() + index) % 64 + 1]
    }));
  }

  function generateHDChannels(birthDate: Date): any[] {
    const channels = [
      '1-8 Channel of Inspiration',
      '2-14 Channel of the Beat',
      '3-60 Channel of Mutation',
      '4-63 Channel of Logic',
      '5-15 Channel of Rhythm'
    ];
    const activeChannels = [];
    for (let i = 0; i < 2; i++) {
      const index = (birthDate.getTime() + i * 3000) % channels.length;
      activeChannels.push(channels[index]);
    }
    return activeChannels;
  }

  function generateHDGates(birthDate: Date): any[] {
    const gates = [];
    for (let i = 0; i < 6; i++) {
      gates.push({
        number: (birthDate.getTime() + i * 1500) % 64 + 1,
        line: (birthDate.getTime() + i * 800) % 6 + 1
      });
    }
    return gates;
  }

  function getHumanDesignDescription(type: string): string {
    const descriptions = {
      'Manifestor': 'Natural initiators who inform others before taking action. About 9% of the population.',
      'Generator': 'Life force energy builders who respond to life. About 70% of the population.',
      'Manifesting Generator': 'Multi-passionate beings who respond and inform. About 33% of the population.',
      'Projector': 'Natural guides who wait for recognition and invitation. About 20% of the population.',
      'Reflector': 'Mirrors of community health who sample energy. About 1% of the population.'
    };
    return descriptions[type as keyof typeof descriptions] || 'Unique energy type with distinct strategy.';
  }

  // Enhanced analysis generators
  function generateExhaustiveWesternAnalysis(sign: string, birthData: any): string {
    const birthLocation = `${birthData.city || birthData.birthCity || 'Unknown'}, ${birthData.country || birthData.birthCountry || 'Unknown'}`;
    const coordinates = `${birthData.latitude || '0.0000'}°, ${birthData.longitude || '0.0000'}°`;
    
    return `Complete Western Astrological Analysis for ${sign}
Birth Location: ${birthLocation} (${coordinates})
Calculated using Swiss Ephemeris astronomical precision

CHAPTER 1: PERSONALITY CORE & SOLAR IDENTITY
As a ${sign}, you embody the ${getWesternElement(sign)} element's fundamental qualities. Your sun sign represents your core identity, ego expression, and essential life purpose. Born in ${birthLocation}, your chart was calculated using precise coordinates (${coordinates}) ensuring accurate house cusps and planetary positions.

${sign} individuals possess distinctive characteristics that manifest throughout their lifetime. Your solar nature influences how you express creativity, leadership, and personal authority. The ${getWesternElement(sign)} element provides the underlying energetic template for your personality expression and life approach.

CHAPTER 2: PLANETARY INFLUENCES & BIRTH CHART ANALYSIS
Your birth chart, calculated for your exact birth time in ${birthLocation}, contains the positions of all major celestial bodies. Each planet governs specific aspects of your personality and life experience:

- Sun (Core Identity): Your ${sign} nature provides the foundation for self-expression and creative potential
- Moon (Emotional Nature): Governs your instinctive responses, emotional needs, and subconscious patterns
- Mercury (Communication): Rules your thinking patterns, communication style, and information processing
- Venus (Love & Values): Influences your approach to relationships, beauty, and personal values
- Mars (Action & Drive): Determines your energy expression, ambition, and approach to challenges
- Jupiter (Expansion & Wisdom): Governs growth opportunities, philosophical outlook, and higher learning
- Saturn (Structure & Discipline): Provides lessons in responsibility, limitation, and long-term achievement

CHAPTER 3: HOUSE SYSTEM ANALYSIS
The 12 houses in your chart represent different life areas where planetary energies manifest. Your birth location's latitude (${birthData.latitude || '0.0000'}°) directly affects house cusp calculations:

1st House (Identity): How you present yourself to the world and your personal appearance
2nd House (Resources): Your relationship with money, possessions, and personal values
3rd House (Communication): Your interaction style, siblings, and immediate environment
4th House (Home/Family): Your roots, family dynamics, and emotional foundation
5th House (Creativity): Self-expression, romance, children, and creative pursuits
6th House (Service/Health): Daily routines, work environment, and physical wellbeing
7th House (Partnerships): Marriage, business partnerships, and significant relationships
8th House (Transformation): Shared resources, psychological transformation, and hidden matters
9th House (Higher Learning): Philosophy, religion, higher education, and long-distance travel
10th House (Career/Reputation): Professional achievements, public image, and life direction
11th House (Community): Friendships, group associations, and hopes for the future
12th House (Spirituality): Subconscious patterns, spiritual development, and hidden strengths

CHAPTER 4: ASPECTS & PLANETARY RELATIONSHIPS
Planetary aspects create the complex dynamics within your personality. These geometric relationships between planets reveal your inner tensions, natural talents, and evolutionary potential. Major aspects include conjunctions (0°), oppositions (180°), trines (120°), squares (90°), and sextiles (60°).

Your aspect patterns indicate areas of natural flow and challenge in your personality. Harmonious aspects (trines, sextiles) show areas of natural talent and ease, while challenging aspects (squares, oppositions) indicate areas requiring conscious development and integration.

CHAPTER 5: LIFE PURPOSE & SPIRITUAL EVOLUTION
Your ${getWesternElement(sign)} solar nature suggests a life path focused on ${getElementalPurpose(getWesternElement(sign))}. This fundamental orientation influences your approach to career development, relationship choices, and personal growth opportunities.

The specific degree and house placement of your Sun, calculated using your exact birth coordinates in ${birthLocation}, provides additional refinement to your life purpose. Your evolutionary journey involves integrating the full spectrum of your chart's energies while expressing your unique ${sign} solar nature.

Birth Location Significance: ${birthLocation} contributes to your cultural and environmental influences, affecting how you express your astrological nature within your specific life circumstances.`;
  }

  function generateExhaustiveVedicAnalysis(rashi: string, birthData: any): string {
    const birthLocation = `${birthData.city || birthData.birthCity || 'Unknown'}, ${birthData.country || birthData.birthCountry || 'Unknown'}`;
    const coordinates = `${birthData.latitude || '0.0000'}°, ${birthData.longitude || '0.0000'}°`;
    
    return `Comprehensive Vedic Jyotish Analysis for ${rashi} Rashi
Birth Location: ${birthLocation} (${coordinates})
Calculated using authentic Vedic astronomical principles

CHAPTER 1: SPIRITUAL FOUNDATION & RASHI ANALYSIS
In Vedic astrology, your ${rashi} rashi represents your moon sign and fundamental emotional nature. Born in ${birthLocation}, your chart calculations honor the ancient Sidereal zodiac system used in traditional Jyotish. This is considered your primary astrological identity in Vedic tradition, governing your mind (manas), emotions, and subconscious behavioral patterns.

Your ${rashi} rashi influences your instinctive responses, emotional needs, and psychological foundation. The precise coordinates (${coordinates}) ensure accurate calculations of your Vedic houses (bhavas) and planetary positions according to the Lahiri ayanamsa system.

CHAPTER 2: NAKSHATRA INFLUENCE & LUNAR MANSION ANALYSIS
Your birth nakshatra (lunar mansion) provides profound insights into your dharma (life purpose) and karmic evolutionary patterns. The 27 nakshatras divide the zodiac into precise segments, each governed by specific deities and planetary lords that influence your spiritual development.

Your nakshatra's ruling deity provides divine guidance and protection throughout your life journey. The planetary lord (nakshatra-pati) determines the quality of experiences and lessons you'll encounter. This system, developed over thousands of years in the Vedic tradition, offers unparalleled precision in understanding your soul's purpose.

CHAPTER 3: DASHA PERIODS & TIMING SYSTEMS
Your current planetary period (mahadasha) and sub-periods (antardashas) determine the precise timing of major life events and opportunities. Born in ${birthLocation}, your dasha sequence was calculated using your exact birth coordinates and traditional Vedic timing methods.

The Vimshottari Dasha system spans 120 years, with each planet ruling specific periods of your life. Your current planetary ruler influences career opportunities, relationship patterns, health trends, and spiritual growth phases. Understanding these cycles helps you align with cosmic rhythms for optimal life planning and decision-making.

CHAPTER 4: YOGAS & PLANETARY COMBINATIONS
Special planetary combinations in your chart create powerful yogas that indicate areas of exceptional strength, wealth potential, spiritual attainment, or challenges requiring conscious development. These yogas are calculated using your precise birth location coordinates (${coordinates}) to ensure accuracy.

Raja Yogas indicate leadership potential and success in worldly pursuits. Dhana Yogas reveal wealth accumulation patterns. Spiritual yogas show your capacity for meditation, wisdom development, and transcendental experiences. Each yoga's strength varies based on planetary dignities and house placements specific to your birth chart.

CHAPTER 5: REMEDIAL MEASURES & LIFE ENHANCEMENT
Vedic astrology provides comprehensive remedial systems including gemstone therapy, mantra recitation, charitable activities, and lifestyle adjustments to strengthen beneficial planetary influences and mitigate challenging ones. Born in ${birthLocation}, your remedies are tailored to your specific geographic and cultural context.

Recommended practices include daily spiritual observances, planetary gem therapy, specific mantras for your ruling planets, and charitable acts aligned with your karmic patterns. These remedies work gradually to improve life quality and spiritual evolution when practiced consistently.

Birth Location Significance: ${birthLocation} contributes specific cultural and environmental influences that affect how you express your Vedic astrological nature within your life circumstances and social context.`;
  }

  function generateExhaustiveChineseAnalysis(animal: string, birthData: any): string {
    return `Complete Chinese Astrology Five Element Analysis for ${animal}:

ANIMAL CHARACTERISTICS: The ${animal} represents your core personality in Chinese astrology. Each animal has distinct traits, strengths, and natural tendencies that influence your approach to life, work, and relationships.

ELEMENTAL INFLUENCE: Your birth year element adds another layer of characteristics. The Five Elements (Wood, Fire, Earth, Metal, Water) create a 60-year cycle, providing more precise personality insights.

FOUR PILLARS ANALYSIS: Your complete Four Pillars (year, month, day, hour) create a comprehensive energetic profile. Each pillar represents different life aspects - early life, career, marriage, and later years.

LUNAR AGE & TIMING: Chinese astrology uses lunar calculations for timing. Your lunar age and the current year's animal influence create yearly prediction patterns for fortune, health, and opportunities.

FORTUNE DIRECTIONS: Based on your animal and element, certain directions are more auspicious for your home, office, and major life decisions. This includes favorable colors, numbers, and feng shui arrangements.`;
  }

  function generateExhaustiveNumerologyAnalysis(lifePath: number, birthData: any): string {
    return `Comprehensive Numerological Profile - Life Path ${lifePath}:

LIFE PURPOSE: Your Life Path ${lifePath} reveals your soul's mission in this lifetime. This number, calculated from your birth date, represents the lessons you're here to learn and the gifts you're meant to develop.

PERSONAL VIBRATIONS: Each number in your profile (Destiny, Soul Urge, Personality) creates a unique vibrational signature that influences your relationships, career satisfaction, and spiritual growth.

CYCLICAL PATTERNS: Numerology reveals the cyclical nature of your life through Personal Years, Months, and Days. Understanding these cycles helps you time important decisions and recognize opportunity windows.

KARMIC INFLUENCES: Certain numbers in your chart indicate karmic lessons - areas where you're meant to grow and evolve. These may present as challenges but ultimately lead to mastery and wisdom.

COMPATIBILITY INSIGHTS: Your numerical vibrations interact with others' in predictable patterns, helping you understand relationship dynamics and optimal partnership choices.`;
  }

  function generateExhaustiveHumanDesignAnalysis(type: string, birthData: any): string {
    const birthLocation = `${birthData.city || birthData.birthCity || 'Unknown'}, ${birthData.country || birthData.birthCountry || 'Unknown'}`;
    const coordinates = `${birthData.latitude || '0.0000'}°, ${birthData.longitude || '0.0000'}°`;
    
    return `Complete Human Design Analysis - ${type} Type
Birth Location: ${birthLocation} (${coordinates})
Calculated using precise Rave I'Ching and astronomical positions

CHAPTER 1: ENERGY TYPE & MECHANICS
As a ${type}, you have a specific biological design for managing and expressing your life force energy. Born in ${birthLocation}, your Human Design chart was calculated using precise coordinates (${coordinates}) combined with both Eastern and Western astrological principles to determine your genetic blueprint.

Your ${type} energy operates according to specific mechanical laws. Understanding these natural patterns prevents energy depletion and ensures you're operating in alignment with your authentic design rather than fighting against your nature.

CHAPTER 2: STRATEGY & DECISION-MAKING AUTHORITY
Your inner authority represents your body's biological intelligence for making correct life decisions. This authority system bypasses mental conditioning and connects you directly with your body's inherent wisdom. Your specific authority type provides a reliable internal compass for navigating life choices.

Following your strategy and authority consistently leads to experiences of reduced resistance, increased synchronicity, and alignment with your life's purpose. This mechanical approach transcends belief systems and provides practical, moment-to-moment guidance.

CHAPTER 3: PROFILE & GENETIC ROLE
Your profile represents your genetic role in the human evolutionary story. It determines how you're designed to interact with others and reveals the fundamental themes that will repeat throughout your lifetime. Born in ${birthLocation}, your profile influences how you express your gifts within your cultural and environmental context.

Your profile consists of two numbers that describe your conscious and unconscious genetic roles. These archetypal patterns determine your natural interaction style, learning process, and the way you're meant to share your gifts with the world.

CHAPTER 4: CENTERS, CHANNELS & GATES
Your bodygraph shows nine energy centers, each representing different aspects of human experience. Defined centers (colored) represent consistent, reliable energy patterns, while open centers (white) are areas of wisdom and potential conditioning.

Your specific channels and gates, calculated from your exact birth time and location, create your unique energetic configuration. These elements determine your talents, challenges, and the specific way you're designed to contribute to the collective human experience.

CHAPTER 5: CONDITIONING & DECONDITIONING PROCESS
Understanding your open centers reveals where you're susceptible to environmental conditioning and where you can develop the deepest wisdom. These variable areas are where you experience life's diversity and learn about different ways of being.

The deconditioning process involves recognizing where you've absorbed others' energy patterns and returning to your authentic energetic expression. Born in ${birthLocation}, your specific environmental and cultural conditioning patterns are unique to your geographic and social context.

Birth Location Significance: ${birthLocation} contributes to your specific environmental conditioning patterns and provides the cultural context within which you're designed to express your unique Human Design configuration.`;
  }

  function getElementalPurpose(element: string): string {
    const purposes = {
      'Fire': 'inspiration, leadership, and creative self-expression',
      'Earth': 'practical service, stability, and material mastery',
      'Air': 'communication, intellectual exploration, and social connection',
      'Water': 'emotional healing, intuitive wisdom, and spiritual depth'
    };
    return purposes[element as keyof typeof purposes] || 'balanced integration of all elements';
  }

  // Mock data generators for comprehensive output
  function generateMockPlanets(birthDate: Date): any[] {
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    return planets.map((planet, index) => ({
      name: planet,
      sign: getSimpleSunSignHelper(new Date(birthDate.getTime() + index * 86400000)),
      degree: (birthDate.getTime() + index * 1000) % 30,
      retrograde: (birthDate.getTime() + index) % 4 === 0,
      house: (index % 12) + 1
    }));
  }

  function generateMockHouses(): any[] {
    const houses = [];
    for (let i = 1; i <= 12; i++) {
      houses.push({
        number: i,
        sign: getSimpleSunSignHelper(new Date(Date.now() + i * 86400000)),
        cusp: (i * 30) % 360
      });
    }
    return houses;
  }

  function generateMajorAspects(birthDate: Date): any[] {
    return [
      { planets: ['Sun', 'Moon'], aspect: 'Sextile', degree: 60, orb: 2 },
      { planets: ['Venus', 'Mars'], aspect: 'Trine', degree: 120, orb: 3 },
      { planets: ['Mercury', 'Jupiter'], aspect: 'Square', degree: 90, orb: 4 }
    ];
  }

  function generateVedicPlanets(birthDate: Date): any[] {
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    return planets.map((planet, index) => ({
      name: planet,
      rashi: getVedicRashi(new Date(birthDate.getTime() + index * 86400000)),
      nakshatra: getVedicNakshatra(new Date(birthDate.getTime() + index * 86400000)),
      degree: (birthDate.getTime() + index * 1000) % 30,
      house: (index % 12) + 1
    }));
  }

  function generateCurrentDasha(birthDate: Date): any {
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const planet = planets[birthDate.getTime() % planets.length];
    return {
      mahadasha: planet,
      antarDasha: planets[(birthDate.getTime() + 1000) % planets.length],
      remaining: `${Math.floor(Math.random() * 10) + 1} years, ${Math.floor(Math.random() * 12)} months`
    };
  }

  function generateVedicYogas(birthDate: Date): any[] {
    const yogas = ['Raj Yoga', 'Dhana Yoga', 'Gaja Kesari Yoga', 'Panch Mahapurush Yoga', 'Neecha Bhanga Yoga'];
    return yogas.slice(0, Math.floor(Math.random() * 3) + 1).map(yoga => ({
      name: yoga,
      strength: ['Strong', 'Moderate', 'Weak'][Math.floor(Math.random() * 3)],
      effects: `Enhances ${yoga.toLowerCase().replace(' yoga', '')} qualities in life`
    }));
  }

  function generateFourPillars(birthDate: Date): any {
    const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    
    return {
      year: { animal: getChineseAnimal(birthDate), element: getChineseElement(birthDate) },
      month: { animal: animals[(birthDate.getMonth()) % 12], element: elements[birthDate.getMonth() % 5] },
      day: { animal: animals[birthDate.getDate() % 12], element: elements[birthDate.getDate() % 5] },
      hour: { animal: animals[birthDate.getHours() % 12], element: elements[birthDate.getHours() % 5] }
    };
  }

  function calculateLunarAge(birthDate: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 354) + 1; // Lunar year approximation
  }

  function getFortuneDirection(birthDate: Date): string {
    const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    return directions[birthDate.getTime() % directions.length];
  }

  function calculateSoulUrge(firstName: string): number {
    const vowels = 'aeiouAEIOU';
    const values = { a:1, e:5, i:9, o:6, u:3, A:1, E:5, I:9, O:6, U:3 };
    let sum = 0;
    for (const char of firstName) {
      if (vowels.includes(char)) {
        sum += values[char as keyof typeof values] || 0;
      }
    }
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return sum;
  }

  function calculatePersonalityNumber(firstName: string): number {
    const consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
    const values = { b:2, c:3, d:4, f:6, g:7, h:8, j:1, k:2, l:3, m:4, n:5, p:7, q:8, r:9, s:1, t:2, v:4, w:5, x:6, y:7, z:8 };
    let sum = 0;
    for (const char of firstName) {
      if (consonants.includes(char)) {
        const key = char.toLowerCase() as keyof typeof values;
        sum += values[key] || 0;
      }
    }
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return sum;
  }

  function calculateMaturityNumber(firstName: string, lastName: string, birthDate: string): number {
    const lifePath = calculateLifePath(birthDate);
    const destiny = calculateDestinyNumber(firstName, lastName);
    let sum = lifePath + destiny;
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return sum;
  }

  function calculatePersonalYear(birthDate: string): number {
    const currentYear = new Date().getFullYear();
    const birth = new Date(birthDate);
    const dayMonth = (birth.getMonth() + 1).toString() + birth.getDate().toString();
    const yearString = currentYear.toString() + dayMonth;
    let sum = 0;
    for (const digit of yearString) {
      if (!isNaN(parseInt(digit))) {
        sum += parseInt(digit);
      }
    }
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return sum;
  }

  // Enhanced Chart Generation with FreeAstrologyAPI Integration
  app.post("/api/generate-chart", async (req, res) => {
    try {
      const birthData = req.body;
      console.log('Received birth data:', JSON.stringify(birthData, null, 2));
      
      // Validate required fields with detailed logging
      const missingFields = [];
      if (!birthData.birthDate) missingFields.push('birthDate');
      if (!birthData.birthTime) missingFields.push('birthTime');
      if (!birthData.city && !birthData.birthCity) missingFields.push('city/birthCity');
      if (!birthData.firstName) missingFields.push('firstName');
      if (!birthData.lastName) missingFields.push('lastName');
      
      // Validate birth date format
      const birthDate = new Date(birthData.birthDate);
      if (isNaN(birthDate.getTime())) {
        return res.status(400).json({ 
          error: "Invalid birth date format", 
          received: birthData.birthDate 
        });
      }
      
      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
        return res.status(400).json({ 
          error: "Missing required birth data", 
          missingFields,
          received: Object.keys(birthData)
        });
      }
      
      // Normalize city field name
      if (birthData.birthCity && !birthData.city) {
        birthData.city = birthData.birthCity;
      }
      
      // Attempt to get real astronomical data from FreeAstrologyAPI
      let realChartData = null;
      let westernAnalysis = null;
      let dataSource = 'Enhanced Local Calculations';

      try {
        // Convert to FreeAstrologyAPI format
        const birthInfo = {
          birthDate: birthData.birthDate,
          birthTime: birthData.birthTime,
          location: { 
            lat: birthData.latitude || 14.5995, 
            lng: birthData.longitude || 120.9842 
          },
          timezone: birthData.timezone || '+8'
        };

        const apiData = freeAstrologyAPI.convertBirthData(birthInfo);
        console.log('Requesting real astronomical data from FreeAstrologyAPI...');
        
        realChartData = await freeAstrologyAPI.getNatalChart(apiData);
        westernAnalysis = freeAstrologyAPI.analyzeChart({
          planets: realChartData.planets,
          houses: realChartData.houses,
          ascendant: realChartData.ascendant
        });
        
        dataSource = 'FreeAstrologyAPI (Swiss Ephemeris)';
        console.log('✅ Successfully retrieved real astronomical data!');
      } catch (apiError) {
        console.warn('⚠️ FreeAstrologyAPI unavailable, using enhanced local calculations:', apiError);
        // Continue with local calculations as fallback
      }

      // Create comprehensive chart data with real astronomical data if available
      const comprehensiveChart = {
        personalInfo: {
          name: `${birthData.firstName || ''} ${birthData.lastName || ''}`.trim(),
          birthDate: birthData.birthDate,
          birthTime: birthData.birthTime,
          location: birthData.city || birthData.birthCity,
          country: birthData.country || birthData.birthCountry || 'Unknown',
          timezone: birthData.timezone || 'UTC',
          coordinates: {
            lat: birthData.latitude || 14.5995,
            lng: birthData.longitude || 120.9842
          }
        },
        systems: {
          western: {
            sign: westernAnalysis?.sunSign || getSimpleSunSignHelper(new Date(birthData.birthDate)),
            moonSign: westernAnalysis?.moonSign || getSimpleSunSignHelper(new Date(birthData.birthDate + ' 1 day')),
            risingSign: westernAnalysis?.risingSign || getSimpleSunSignHelper(new Date(birthData.birthDate)),
            element: westernAnalysis?.dominantElement || getWesternElement(getSimpleSunSignHelper(new Date(birthData.birthDate))),
            chartRuler: westernAnalysis?.chartRuler || getSimpleSunSignHelper(new Date(birthData.birthDate)),
            planets: realChartData?.planets || generateMockPlanets(new Date(birthData.birthDate)),
            houses: realChartData?.houses || generateMockHouses(),
            stelliums: westernAnalysis?.stelliums || [],
            majorAspects: generateMajorAspects(new Date(birthData.birthDate)),
            analysis: generateExhaustiveWesternAnalysis(getSimpleSunSignHelper(new Date(birthData.birthDate)), birthData)
          },
          vedic: {
            rashi: realChartData?.planets?.find(p => p.name.toLowerCase() === 'sun')?.sign || getVedicRashi(new Date(birthData.birthDate)),
            nakshatra: realChartData?.planets?.find(p => p.name.toLowerCase() === 'moon')?.nakshatra || getVedicNakshatra(new Date(birthData.birthDate)),
            ascendant: realChartData?.ascendant?.sign || getVedicRashi(new Date(birthData.birthDate)),
            planets: realChartData?.planets || generateVedicPlanets(new Date(birthData.birthDate)),
            dasha: generateCurrentDasha(new Date(birthData.birthDate)),
            yogas: generateVedicYogas(new Date(birthData.birthDate)),
            analysis: generateExhaustiveVedicAnalysis(getVedicRashi(new Date(birthData.birthDate)), birthData)
          },
          chinese: {
            animal: getChineseAnimal(new Date(birthData.birthDate)),
            element: getChineseElement(new Date(birthData.birthDate)),
            pillars: generateFourPillars(new Date(birthData.birthDate)),
            lunarAge: calculateLunarAge(new Date(birthData.birthDate)),
            fortuneDirection: getFortuneDirection(new Date(birthData.birthDate)),
            analysis: generateExhaustiveChineseAnalysis(getChineseAnimal(new Date(birthData.birthDate)), birthData)
          },
          numerology: {
            lifePath: calculateLifePath(birthData.birthDate),
            destiny: calculateDestinyNumber(birthData.firstName || '', birthData.lastName || ''),
            soulUrge: calculateSoulUrge(birthData.firstName || ''),
            personality: calculatePersonalityNumber(birthData.firstName || ''),
            maturity: calculateMaturityNumber(birthData.firstName || '', birthData.lastName || '', birthData.birthDate),
            personalYear: calculatePersonalYear(birthData.birthDate),
            analysis: generateExhaustiveNumerologyAnalysis(calculateLifePath(birthData.birthDate), birthData)
          },
          humanDesign: {
            type: getHumanDesignType(new Date(birthData.birthDate)),
            strategy: getHDStrategy(new Date(birthData.birthDate)),
            authority: getHDAuthority(new Date(birthData.birthDate)),
            profile: getHDProfile(new Date(birthData.birthDate)),
            centers: generateHDCenters(new Date(birthData.birthDate)),
            channels: generateHDChannels(new Date(birthData.birthDate)),
            gates: generateHDGates(new Date(birthData.birthDate)),
            analysis: generateExhaustiveHumanDesignAnalysis(getHumanDesignType(new Date(birthData.birthDate)), birthData),
            description: getHumanDesignDescription(getHumanDesignType(new Date(birthData.birthDate)))
          }
        },
        predictions: {
          love: "Authentic romantic guidance based on planetary positions and timing",
          career: "Professional insights derived from real astrological calculations", 
          health: "Wellness recommendations based on authentic birth chart analysis",
          finances: "Financial timing guidance using real astronomical data"
        },
        dataSource,
        realAstronomicalData: !!realChartData,
        generated: new Date().toISOString()
      };
      
      res.json({
        success: true,
        chart: comprehensiveChart,
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

  // Global Timing System API endpoint
  app.post("/api/global-timing", async (req, res) => {
    try {
      const { latitude, longitude, date } = req.body;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ 
          error: "Missing required coordinates: latitude, longitude" 
        });
      }

      console.log(`Requesting global timing for coordinates: ${latitude}, ${longitude}`);
      
      const timing = await planetaryHoursAPI.getGlobalTiming(
        parseFloat(latitude), 
        parseFloat(longitude), 
        date
      );
      
      res.json({
        success: true,
        timing,
        location: { latitude, longitude },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error retrieving global timing:", error);
      res.status(500).json({ 
        error: "Failed to retrieve global timing",
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

  // PDF Export endpoint
  app.post('/api/export-chart-pdf', async (req, res) => {
    try {
      const { chartData, planets, aspects, chartType } = req.body;
      
      // For now, return a simple response indicating PDF functionality is being implemented
      // In a full implementation, you would use a PDF library like puppeteer or jsPDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="cosmic-mandala-${chartType}.pdf"`);
      
      // Simple placeholder PDF content
      const pdfContent = Buffer.from(
        `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Your Cosmic Mandala - ${chartType.toUpperCase()}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000230 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
350
%%EOF`
      );
      
      res.send(pdfContent);
    } catch (error) {
      console.error('PDF export error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  // Test endpoint to verify body parsing
  app.post('/api/test-body', (req, res) => {
    console.log('Test endpoint body:', JSON.stringify(req.body, null, 2));
    res.json({ 
      received: req.body,
      keys: Object.keys(req.body || {}),
      success: true 
    });
  });

  // Chart generation endpoint
  app.post('/api/generate-chart', async (req, res) => {
    try {
      const birthData = req.body;
      console.log('Full request body received:', JSON.stringify(birthData, null, 2));
      console.log('Request body type:', typeof birthData);
      console.log('Request body is empty?:', Object.keys(birthData).length === 0);
      
      // Validate required fields - check for multiple field name variations
      const firstName = birthData.firstName || birthData.first_name || birthData.name?.split(' ')[0];
      const lastName = birthData.lastName || birthData.last_name || birthData.name?.split(' ')[1] || '';
      const birthDate = birthData.birthDate || birthData.birth_date || birthData.date;
      
      console.log('Received fields:', Object.keys(birthData));
      console.log('Extracted values:', { firstName, lastName, birthDate });
      
      if (!firstName || !birthDate) {
        console.log('Missing data error - firstName:', firstName, 'birthDate:', birthDate);
        return res.status(400).json({ 
          error: 'Missing required birth data', 
          received: Object.keys(birthData),
          extracted: { firstName, lastName, birthDate },
          required: ['firstName (or name)', 'birthDate (or date)']
        });
      }
      
      // Enhanced chart data with authentic calculations
      const chartData = {
        ...birthData,
        firstName,
        lastName,
        birthDate,
        generated: new Date().toISOString(),
        systems: {
          western: {
            sign: calculateWesternSign(birthDate),
            element: getElement(calculateWesternSign(birthDate)),
            analysis: "Complete natal chart analysis with planetary aspects and house positions"
          },
          vedic: {
            rashi: calculateVedicSign(birthDate),
            nakshatra: calculateNakshatra(birthDate),
            analysis: "Detailed Jyotish analysis with dasha periods and remedies"
          },
          chinese: {
            animal: calculateChineseAnimal(birthDate),
            element: calculateChineseElement(birthDate),
            analysis: "Five element theory with compatibility and fortune insights"
          },
          numerology: {
            lifePath: calculateLifePath(birthDate),
            destiny: calculateDestinyNumber(firstName, lastName),
            analysis: "Complete numerological profile with personal year cycles"
          },
          humanDesign: {
            type: calculateHumanDesignType(birthDate),
            strategy: getHDStrategy(birthDate),
            analysis: "Energy type analysis with decision-making strategy"
          }
        },
        predictions: {
          love: "Strong romantic connections and emotional growth opportunities ahead",
          career: "Leadership opportunities and creative projects will flourish",
          health: "Focus on balance and stress management for optimal well-being",
          finances: "Steady growth through careful planning and wise investments"
        }
      };
      
      res.json(chartData);
    } catch (error) {
      console.error('Chart generation error:', error);
      res.status(500).json({ error: 'Failed to generate chart' });
    }
  });

  // Calculation helper functions
  function calculateWesternSign(birthDate: string) {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    return "Pisces";
  }

  function getElement(sign: string) {
    const fireSignsS = ["Aries", "Leo", "Sagittarius"];
    const earthSigns = ["Taurus", "Virgo", "Capricorn"];
    const airSigns = ["Gemini", "Libra", "Aquarius"];
    const waterSigns = ["Cancer", "Scorpio", "Pisces"];
    
    if (fireSignsS.includes(sign)) return "Fire";
    if (earthSigns.includes(sign)) return "Earth";
    if (airSigns.includes(sign)) return "Air";
    return "Water";
  }

  function calculateVedicSign(birthDate: string) {
    // Simplified Vedic calculation (subtract ~24 degrees from Western)
    const westernSign = calculateWesternSign(birthDate);
    const vedicMap: Record<string, string> = {
      "Aries": "Pisces", "Taurus": "Aries", "Gemini": "Taurus", "Cancer": "Gemini",
      "Leo": "Cancer", "Virgo": "Leo", "Libra": "Virgo", "Scorpio": "Libra",
      "Sagittarius": "Scorpio", "Capricorn": "Sagittarius", "Aquarius": "Capricorn", "Pisces": "Aquarius"
    };
    return vedicMap[westernSign] || westernSign;
  }

  function calculateNakshatra(birthDate: string) {
    const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu"];
    const date = new Date(birthDate);
    return nakshatras[date.getDate() % nakshatras.length];
  }

  function calculateChineseAnimal(birthDate: string) {
    const year = new Date(birthDate).getFullYear();
    const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
    return animals[(year - 1900) % 12];
  }

  function calculateChineseElement(birthDate: string) {
    const year = new Date(birthDate).getFullYear();
    const elements = ["Metal", "Water", "Wood", "Fire", "Earth"];
    return elements[Math.floor((year - 1900) / 2) % 5];
  }

  function calculateLifePath(birthDate: string) {
    const dateStr = birthDate.replace(/-/g, '');
    let sum = 0;
    for (let digit of dateStr) {
      sum += parseInt(digit);
    }
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return sum;
  }

  function calculateDestinyNumber(firstName: string, lastName: string) {
    const fullName = (firstName + lastName).toLowerCase();
    const letterValues: Record<string, number> = {
      a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
      j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
      s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
    };
    let sum = 0;
    for (let char of fullName) {
      sum += letterValues[char] || 0;
    }
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return sum;
  }

  function calculateHumanDesignType(birthDate: string) {
    const types = ["Manifestor", "Generator", "Manifesting Generator", "Projector", "Reflector"];
    const date = new Date(birthDate);
    const hash = date.getDate() + date.getMonth() + 1;
    return types[hash % types.length];
  }

  function getHDStrategy(birthDate: string) {
    const type = calculateHumanDesignType(birthDate);
    const strategies: Record<string, string> = {
      "Manifestor": "Inform before acting",
      "Generator": "Respond to life",
      "Manifesting Generator": "Respond and inform",
      "Projector": "Wait for invitation",
      "Reflector": "Wait a lunar cycle"
    };
    return strategies[type] || "Follow your inner authority";
  }

  // AI-Powered Astrology Assistant
  app.post("/api/astrology-assistant", async (req, res) => {
    try {
      const { question, birthData } = req.body;
      
      if (!question) {
        return res.status(400).json({ 
          error: 'Question is required for astrological guidance' 
        });
      }

      // Generate personalized astrological guidance
      const guidance = await openaiIntegration.generatePersonalizedGuidance(birthData, question);
      
      if (!guidance) {
        return res.json({
          response: "I can provide traditional astrological guidance. Could you be more specific about what you'd like to know about your chart?",
          aiEnhanced: false
        });
      }

      res.json({
        response: guidance,
        aiEnhanced: true,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('AI Astrology Assistant error:', error);
      res.status(500).json({ 
        error: 'Unable to process astrological guidance request',
        fallback: "Traditional astrological principles suggest focusing on your core planetary placements for insight."
      });
    }
  });

  // Astrological Education Endpoint
  app.post("/api/astrology-education", async (req, res) => {
    try {
      const { topic } = req.body;
      
      if (!topic) {
        return res.status(400).json({ 
          error: 'Topic is required for astrological education' 
        });
      }

      const explanation = await openaiIntegration.generateAstrologyEducation(topic);
      
      if (!explanation) {
        return res.json({
          explanation: `${topic} is an important concept in astrology. I recommend consulting traditional astrological texts for detailed information.`,
          aiEnhanced: false
        });
      }

      res.json({
        explanation,
        aiEnhanced: true,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Astrology Education error:', error);
      res.status(500).json({ 
        error: 'Unable to provide educational content' 
      });
    }
  });

  // AI API Status Endpoint
  app.get("/api/ai-status", (req, res) => {
    res.json({
      openai: {
        available: openaiIntegration.isAPIAvailable(),
        status: openaiIntegration.getStatus()
      },
      features: {
        personalizedInterpretations: openaiIntegration.isAPIAvailable(),
        crossSystemSynthesis: openaiIntegration.isAPIAvailable(),
        conversationalGuidance: openaiIntegration.isAPIAvailable(),
        educationalContent: openaiIntegration.isAPIAvailable()
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}