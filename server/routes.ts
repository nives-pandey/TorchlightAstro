import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertBirthDataSchema, 
  insertChartSchema,
  insertCompatibilitySchema,
  insertDailyGuidanceSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Birth Data
  app.post("/api/birth-data", async (req, res) => {
    try {
      const birthDataInput = insertBirthDataSchema.parse(req.body);
      const birthData = await storage.createBirthData(birthDataInput);
      res.json(birthData);
    } catch (error) {
      res.status(400).json({ error: "Invalid birth data" });
    }
  });

  app.get("/api/birth-data/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const birthDataRecords = await storage.getBirthDataByUserId(userId);
      res.json(birthDataRecords);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Charts
  app.post("/api/charts", async (req, res) => {
    try {
      const chartData = insertChartSchema.parse(req.body);
      const chart = await storage.createChart(chartData);
      res.json(chart);
    } catch (error) {
      res.status(400).json({ error: "Invalid chart data" });
    }
  });

  app.get("/api/charts/birth-data/:birthDataId", async (req, res) => {
    try {
      const birthDataId = parseInt(req.params.birthDataId);
      const charts = await storage.getChartsByBirthDataId(birthDataId);
      res.json(charts);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Generate natal chart
  app.post("/api/charts/generate-natal", async (req, res) => {
    try {
      const { birthDataId } = req.body;
      const birthData = await storage.getBirthData(birthDataId);
      
      if (!birthData) {
        return res.status(404).json({ error: "Birth data not found" });
      }

      // Generate chart data (placeholder for actual astronomical calculations)
      const chartData = {
        planets: generatePlanetaryPositions(birthData),
        houses: generateHouses(birthData),
        aspects: generateAspects(),
        patterns: detectChartPatterns()
      };

      const chart = await storage.createChart({
        birthDataId,
        chartType: "natal",
        chartData,
        interpretations: generateInterpretations(chartData)
      });

      res.json(chart);
    } catch (error) {
      res.status(500).json({ error: "Chart generation failed" });
    }
  });

  // Compatibility Analysis
  app.post("/api/compatibility", async (req, res) => {
    try {
      const compatibilityData = insertCompatibilitySchema.parse(req.body);
      const compatibility = await storage.createCompatibility(compatibilityData);
      res.json(compatibility);
    } catch (error) {
      res.status(400).json({ error: "Invalid compatibility data" });
    }
  });

  app.post("/api/compatibility/analyze", async (req, res) => {
    try {
      const { primaryUserId, partnerUserIds } = req.body;
      
      // Get birth data for all users
      const primaryBirthData = await storage.getBirthDataByUserId(primaryUserId);
      const partnerBirthData = await Promise.all(
        partnerUserIds.map((id: number) => storage.getBirthDataByUserId(id))
      );

      if (!primaryBirthData.length || partnerBirthData.some(data => !data.length)) {
        return res.status(404).json({ error: "Birth data not found for one or more users" });
      }

      // Analyze compatibility
      const analysis = analyzeCompatibility(primaryBirthData[0], partnerBirthData.map(data => data[0]));
      
      const compatibility = await storage.createCompatibility({
        primaryUserId,
        partnerUserIds,
        compatibilityScore: analysis.overallScore,
        systemScores: analysis.systemScores,
        analysis: analysis.detailedAnalysis
      });

      res.json(compatibility);
    } catch (error) {
      res.status(500).json({ error: "Compatibility analysis failed" });
    }
  });

  // Daily Guidance
  app.get("/api/daily-guidance/:userId/:date", async (req, res) => {
    try {
      const { userId, date } = req.params;
      let guidance = await storage.getDailyGuidance(parseInt(userId), date);
      
      if (!guidance) {
        // Generate new guidance for the date
        const birthDataRecords = await storage.getBirthDataByUserId(parseInt(userId));
        if (!birthDataRecords.length) {
          return res.status(404).json({ error: "Birth data not found" });
        }

        const guidanceData = generateDailyGuidance(birthDataRecords[0], date);
        guidance = await storage.createDailyGuidance({
          userId: parseInt(userId),
          date,
          ...guidanceData
        });
      }

      res.json(guidance);
    } catch (error) {
      res.status(500).json({ error: "Failed to get daily guidance" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Placeholder functions for astrological calculations
function generatePlanetaryPositions(birthData: any) {
  // This would integrate with Swiss Ephemeris or similar library
  return {
    sun: { sign: "Capricorn", degree: 25.5, house: 4 },
    moon: { sign: "Pisces", degree: 12.3, house: 7 },
    mercury: { sign: "Aquarius", degree: 8.7, house: 6 },
    venus: { sign: "Sagittarius", degree: 18.2, house: 3 },
    mars: { sign: "Aries", degree: 22.1, house: 8 },
    jupiter: { sign: "Taurus", degree: 15.9, house: 9 },
    saturn: { sign: "Capricorn", degree: 28.4, house: 4 },
    uranus: { sign: "Capricorn", degree: 6.7, house: 4 },
    neptune: { sign: "Capricorn", degree: 13.1, house: 4 },
    pluto: { sign: "Scorpio", degree: 16.8, house: 2 }
  };
}

function generateHouses(birthData: any) {
  return {
    first: { sign: "Virgo", degree: 15.0 },
    second: { sign: "Libra", degree: 10.5 },
    third: { sign: "Scorpio", degree: 8.2 },
    fourth: { sign: "Sagittarius", degree: 15.0 },
    fifth: { sign: "Capricorn", degree: 20.3 },
    sixth: { sign: "Aquarius", degree: 22.1 },
    seventh: { sign: "Pisces", degree: 15.0 },
    eighth: { sign: "Aries", degree: 10.5 },
    ninth: { sign: "Taurus", degree: 8.2 },
    tenth: { sign: "Gemini", degree: 15.0 },
    eleventh: { sign: "Cancer", degree: 20.3 },
    twelfth: { sign: "Leo", degree: 22.1 }
  };
}

function generateAspects() {
  return [
    { planets: ["sun", "jupiter"], aspect: "trine", orb: 2.3, strength: "strong" },
    { planets: ["moon", "venus"], aspect: "sextile", orb: 1.8, strength: "moderate" },
    { planets: ["mercury", "mars"], aspect: "square", orb: 3.2, strength: "weak" }
  ];
}

function detectChartPatterns() {
  return {
    pattern: "bowl",
    dominantElement: "earth",
    dominantModality: "cardinal",
    stelliums: []
  };
}

function generateInterpretations(chartData: any) {
  return {
    sunSign: "Strong foundation-building energy with focus on security and achievement.",
    moonSign: "Intuitive emotional nature seeks harmony in partnerships.",
    risingSign: "Practical, analytical approach to life with attention to detail.",
    dominantThemes: ["earth energy", "cardinal leadership", "practical wisdom"]
  };
}

function analyzeCompatibility(primaryData: any, partnerData: any[]) {
  return {
    overallScore: 85,
    systemScores: {
      western: 88,
      vedic: 82,
      chinese: 90,
      humanDesign: 78
    },
    detailedAnalysis: {
      strengths: ["Complementary sun-moon harmony", "Shared creative vision", "Natural communication flow"],
      challenges: ["Different decision-making styles", "Need to balance individual vs shared time"],
      recommendations: ["Focus on mutual goals", "Respect individual space", "Communicate openly"]
    }
  };
}

function generateDailyGuidance(birthData: any, date: string) {
  return {
    horoscope: {
      overall: "Today brings harmonious energy perfect for practical achievements and relationship growth.",
      love: "Venus-Jupiter trine brings warmth to partnerships. Express appreciation today.",
      career: "Practical Virgo moon supports detailed work and financial planning.",
      health: "Perfect day for health check-ups and starting new wellness routines.",
      growth: "Mercury in Aquarius opens new perspectives and innovative solutions."
    },
    transits: [
      { planet: "Mercury", sign: "Aquarius", aspect: "continuing", influence: "Innovation in communication" },
      { planet: "Venus", aspect: "trine Jupiter", timing: "peak today", influence: "Relationship harmony" },
      { planet: "Moon", sign: "Virgo", timing: "until 3:15 PM", influence: "Detail-oriented energy" }
    ],
    optimalTiming: {
      best: "2:30-4:30 PM",
      avoid: "7:00-9:00 PM",
      social: "10:00 AM-12:00 PM"
    },
    luckyElements: {
      colors: ["blue", "gold", "green"],
      numbers: [3, 7, 12, 21],
      direction: "Northeast",
      element: "Earth & Air"
    }
  };
}
