import type { Express } from "express";
import { LyraAIReportEngine } from './lyra-ai-report-engine';
import { SwissEphemerisEngine } from './swiss-ephemeris-engine';
import { GlobalCityDatabase } from './global-city-database';

// Initialize engines
const lyraEngine = new LyraAIReportEngine();
const swissEngine = new SwissEphemerisEngine();
const cityDatabase = new GlobalCityDatabase();

export function registerLyraReportAPI(app: Express) {
  
  // Generate comprehensive 5-page Lyra AI report
  app.post("/api/reports/lyra-comprehensive", async (req, res) => {
    try {
      const { birthData } = req.body;
      
      if (!birthData?.city || !birthData?.birthDate || !birthData?.birthTime) {
        return res.status(400).json({ 
          error: "Complete birth data required (city, birthDate, birthTime)" 
        });
      }

      console.log('🌟 Generating Lyra AI comprehensive 5-page report...');
      
      // Step 1: Get authentic city coordinates
      const cities = await cityDatabase.searchGlobalCities(birthData.city);
      if (cities.length === 0) {
        return res.status(400).json({ 
          error: "City not found in global database. Please try a different spelling." 
        });
      }
      
      const cityData = cities[0]; // Use first match
      console.log(`✅ Found authentic coordinates for ${cityData.city}, ${cityData.country}`);

      // Step 2: Calculate authentic planetary positions
      const enhancedBirthData = {
        ...birthData,
        birthPlace: {
          latitude: cityData.latitude,
          longitude: cityData.longitude,
          timezone: cityData.timezone
        }
      };

      const planetaryData = await swissEngine.calculatePlanetaryPositions(enhancedBirthData);
      const houseCusps = await swissEngine.calculateHouseCusps(enhancedBirthData);
      const aspects = swissEngine.calculateAspects(planetaryData);

      // Step 3: Prepare comprehensive astrological data package
      const astrologicalData = {
        birthData: enhancedBirthData,
        cityInfo: cityData,
        western: {
          planets: planetaryData,
          houses: houseCusps,
          aspects: aspects
        },
        vedic: {
          // Add Vedic calculations here when available
          planets: planetaryData // Simplified for now
        },
        numerology: {
          lifePath: calculateLifePath(birthData.birthDate),
          expression: calculateExpression(birthData.name || 'User'),
          soulUrge: calculateSoulUrge(birthData.name || 'User')
        },
        chinese: {
          sign: calculateChineseSign(birthData.birthDate),
          element: calculateChineseElement(birthData.birthDate)
        }
      };

      // Step 4: Generate 5-page Lyra AI report
      const comprehensiveReport = await lyraEngine.generateComprehensive5PageReport(astrologicalData);
      
      console.log('✅ Lyra AI comprehensive report generated successfully');

      res.json({
        success: true,
        reportType: "Lyra AI Comprehensive 5-Page Report",
        cityVerified: `${cityData.city}, ${cityData.country}`,
        coordinates: `${cityData.latitude}, ${cityData.longitude}`,
        timezone: cityData.timezone,
        dataSource: "Swiss Ephemeris + Gemini AI",
        report: comprehensiveReport,
        metadata: {
          planetsCalculated: Object.keys(planetaryData).length,
          aspectsFound: aspects.length,
          reportLength: comprehensiveReport.length
        }
      });

    } catch (error) {
      console.error('Lyra comprehensive report generation failed:', error);
      res.status(500).json({ 
        error: "Failed to generate comprehensive report",
        details: error.message 
      });
    }
  });

  // Generate quick test report
  app.post("/api/reports/lyra-test", async (req, res) => {
    try {
      const { birthData } = req.body;
      
      if (!birthData) {
        return res.status(400).json({ 
          error: "Birth data required" 
        });
      }

      console.log('🌟 Generating Lyra AI test report...');
      
      const testReport = await lyraEngine.generateTestReport(birthData);
      
      res.json({
        success: true,
        reportType: "Lyra AI Test Report",
        report: testReport
      });

    } catch (error) {
      console.error('Lyra test report generation failed:', error);
      res.status(500).json({ 
        error: "Failed to generate test report",
        details: error.message 
      });
    }
  });

  console.log('✅ Lyra AI comprehensive report API registered');
}

// Helper numerology functions
function calculateLifePath(birthDate: string): number {
  const numbers = birthDate.replace(/\D/g, '');
  let sum = numbers.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  return sum;
}

function calculateExpression(name: string): number {
  const letterValues: { [key: string]: number } = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
  };
  
  let sum = name.toLowerCase().split('').reduce((acc, char) => {
    return acc + (letterValues[char] || 0);
  }, 0);
  
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  return sum;
}

function calculateSoulUrge(name: string): number {
  const vowels = 'aeiou';
  const letterValues: { [key: string]: number } = {
    'a': 1, 'e': 5, 'i': 9, 'o': 6, 'u': 3
  };
  
  let sum = name.toLowerCase().split('').reduce((acc, char) => {
    return vowels.includes(char) ? acc + (letterValues[char] || 0) : acc;
  }, 0);
  
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  return sum;
}

function calculateChineseSign(birthDate: string): string {
  const year = parseInt(birthDate.split('-')[0]);
  const signs = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
  ];
  
  // Chinese New Year doesn't align with January 1, but this is simplified
  return signs[(year - 1900) % 12];
}

function calculateChineseElement(birthDate: string): string {
  const year = parseInt(birthDate.split('-')[0]);
  const elements = ['Metal', 'Water', 'Wood', 'Fire', 'Earth'];
  
  return elements[Math.floor((year - 1900) % 10 / 2)];
}