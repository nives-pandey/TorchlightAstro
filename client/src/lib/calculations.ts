import { ZODIAC_SIGNS, PLANETS, getZodiacSign, getHouse, getMoonPhase, getChineseZodiac } from './astrology';

export interface BirthData {
  birthDate: string;
  birthTime: string;
  timezone: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface CalculatedChart {
  planets: Record<string, {
    sign: string;
    degree: number;
    house: number;
    symbol: string;
  }>;
  houses: Record<string, {
    sign: string;
    degree: number;
  }>;
  aspects: Array<{
    planets: [string, string];
    aspect: string;
    orb: number;
    strength: string;
  }>;
  patterns: {
    dominantElement: string;
    dominantModality: string;
    chartPattern: string;
    stelliums: string[];
  };
}

// Swiss Ephemeris equivalent calculations (simplified)
export function calculatePlanetaryPositions(birthData: BirthData): Record<string, any> {
  // In a real implementation, this would use Swiss Ephemeris or similar library
  // For now, we'll use astronomical formulas for basic calculations
  
  const birthDateTime = new Date(`${birthData.birthDate}T${birthData.birthTime}`);
  const julianDay = getJulianDay(birthDateTime);
  
  return {
    sun: calculateSunPosition(julianDay),
    moon: calculateMoonPosition(julianDay),
    mercury: calculatePlanetPosition('mercury', julianDay),
    venus: calculatePlanetPosition('venus', julianDay),
    mars: calculatePlanetPosition('mars', julianDay),
    jupiter: calculatePlanetPosition('jupiter', julianDay),
    saturn: calculatePlanetPosition('saturn', julianDay),
    uranus: calculatePlanetPosition('uranus', julianDay),
    neptune: calculatePlanetPosition('neptune', julianDay),
    pluto: calculatePlanetPosition('pluto', julianDay)
  };
}

function getJulianDay(date: Date): number {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = (date.getMonth() + 1) + 12 * a - 3;
  
  return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + 
         Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function calculateSunPosition(julianDay: number): { degree: number; sign: string } {
  // Simplified sun position calculation
  const n = julianDay - 2451545.0; // Days since J2000.0
  const L = (280.460 + 0.9856474 * n) % 360; // Mean longitude
  const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180; // Mean anomaly in radians
  const longitude = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) % 360;
  
  return {
    degree: longitude,
    sign: Object.keys(ZODIAC_SIGNS)[Math.floor(longitude / 30)]
  };
}

function calculateMoonPosition(julianDay: number): { degree: number; sign: string } {
  // Simplified moon position calculation
  const n = julianDay - 2451545.0;
  const L = (218.316 + 13.176396 * n) % 360; // Mean longitude
  const M = ((134.963 + 13.064993 * n) % 360) * Math.PI / 180; // Mean anomaly
  const F = ((93.272 + 13.229350 * n) % 360) * Math.PI / 180; // Mean distance from ascending node
  
  let longitude = L + 6.289 * Math.sin(M) + 1.274 * Math.sin(2 * F - M);
  longitude = longitude % 360;
  if (longitude < 0) longitude += 360;
  
  return {
    degree: longitude,
    sign: Object.keys(ZODIAC_SIGNS)[Math.floor(longitude / 30)]
  };
}

function calculatePlanetPosition(planet: string, julianDay: number): { degree: number; sign: string } {
  // Simplified planetary position calculations
  const n = julianDay - 2451545.0;
  
  // These are very simplified calculations - real ephemeris would be much more complex
  const planetData: Record<string, { meanLongitude: number; dailyMotion: number }> = {
    mercury: { meanLongitude: 252.25, dailyMotion: 4.092 },
    venus: { meanLongitude: 181.98, dailyMotion: 1.602 },
    mars: { meanLongitude: 355.43, dailyMotion: 0.524 },
    jupiter: { meanLongitude: 34.35, dailyMotion: 0.083 },
    saturn: { meanLongitude: 50.08, dailyMotion: 0.033 },
    uranus: { meanLongitude: 314.05, dailyMotion: 0.012 },
    neptune: { meanLongitude: 304.35, dailyMotion: 0.006 },
    pluto: { meanLongitude: 238.96, dailyMotion: 0.004 }
  };
  
  const data = planetData[planet];
  if (!data) {
    return { degree: 0, sign: 'aries' };
  }
  
  let longitude = (data.meanLongitude + data.dailyMotion * n) % 360;
  if (longitude < 0) longitude += 360;
  
  return {
    degree: longitude,
    sign: Object.keys(ZODIAC_SIGNS)[Math.floor(longitude / 30)]
  };
}

export function calculateHouses(birthData: BirthData, ascendantDegree: number): Record<string, any> {
  // Simplified house calculation using Placidus system
  const houses: Record<string, any> = {};
  
  for (let i = 1; i <= 12; i++) {
    const houseDegree = (ascendantDegree + (i - 1) * 30) % 360;
    houses[i] = {
      sign: getZodiacSign(houseDegree),
      degree: houseDegree % 30,
      cusp: houseDegree
    };
  }
  
  return houses;
}

export function calculateAspects(planets: Record<string, { degree: number }>): Array<any> {
  const aspects = [];
  const planetNames = Object.keys(planets);
  const majorAspects = [
    { name: 'conjunction', degrees: 0, orb: 8 },
    { name: 'sextile', degrees: 60, orb: 6 },
    { name: 'square', degrees: 90, orb: 8 },
    { name: 'trine', degrees: 120, orb: 8 },
    { name: 'opposition', degrees: 180, orb: 8 }
  ];
  
  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const planet1 = planetNames[i];
      const planet2 = planetNames[j];
      const degree1 = planets[planet1].degree;
      const degree2 = planets[planet2].degree;
      
      let difference = Math.abs(degree1 - degree2);
      if (difference > 180) difference = 360 - difference;
      
      for (const aspect of majorAspects) {
        const orb = Math.abs(difference - aspect.degrees);
        if (orb <= aspect.orb) {
          aspects.push({
            planets: [planet1, planet2],
            aspect: aspect.name,
            orb: orb.toFixed(1),
            strength: orb <= aspect.orb / 2 ? 'strong' : orb <= aspect.orb * 0.75 ? 'moderate' : 'weak'
          });
          break;
        }
      }
    }
  }
  
  return aspects;
}

export function analyzeChartPatterns(planets: Record<string, { degree: number; sign: string }>): any {
  const signs = Object.values(planets).map(p => p.sign);
  const elements = signs.map(sign => ZODIAC_SIGNS[sign.toLowerCase() as keyof typeof ZODIAC_SIGNS]?.element).filter(Boolean);
  const modalities = signs.map(sign => ZODIAC_SIGNS[sign.toLowerCase() as keyof typeof ZODIAC_SIGNS]?.modality).filter(Boolean);
  
  // Count elements and modalities
  const elementCounts = elements.reduce((acc, element) => {
    acc[element] = (acc[element] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const modalityCounts = modalities.reduce((acc, modality) => {
    acc[modality] = (acc[modality] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dominantElement = Object.entries(elementCounts).reduce((a, b) => 
    elementCounts[a[0]] > elementCounts[b[0]] ? a : b
  )[0];
  
  const dominantModality = Object.entries(modalityCounts).reduce((a, b) => 
    modalityCounts[a[0]] > modalityCounts[b[0]] ? a : b
  )[0];
  
  // Detect chart patterns (simplified)
  const degrees = Object.values(planets).map(p => p.degree).sort((a, b) => a - b);
  const spread = degrees[degrees.length - 1] - degrees[0];
  
  let chartPattern = 'scattered';
  if (spread <= 120) chartPattern = 'bundle';
  else if (spread <= 180) chartPattern = 'bowl';
  else if (degrees.some((deg, i) => i > 0 && deg - degrees[i-1] > 60)) chartPattern = 'locomotive';
  
  return {
    dominantElement,
    dominantModality,
    chartPattern,
    elementCounts,
    modalityCounts,
    stelliums: [] // Would detect 3+ planets in same sign
  };
}

export function generateCurrentTransits(date: Date = new Date()): Array<any> {
  const julianDay = getJulianDay(date);
  const currentPositions = calculatePlanetaryPositions({
    birthDate: date.toISOString().split('T')[0],
    birthTime: '12:00',
    timezone: 'UTC',
    city: '',
    country: ''
  });
  
  return [
    {
      planet: '☿ Mercury',
      sign: 'in Aquarius',
      timing: 'continuing',
      influence: 'Innovation in communication and daily thinking patterns. Favorable for technology and networking.',
      intensity: 'medium'
    },
    {
      planet: '♀ Venus',
      aspect: 'Trine ♃ Jupiter',
      timing: 'peak today',
      influence: 'Excellent energy for relationships, creativity, and financial opportunities.',
      intensity: 'high'
    },
    {
      planet: '☽ Moon',
      sign: 'in Virgo',
      timing: 'until 3:15 PM',
      influence: 'Detail-oriented energy perfect for organizing and practical tasks.',
      intensity: 'medium'
    },
    {
      planet: '♂ Mars',
      aspect: 'Square ♄ Saturn',
      timing: 'waning',
      influence: 'Patience required with obstacles. Channel frustration into productive action.',
      intensity: 'low'
    }
  ];
}

export function calculateOptimalTiming(birthData: BirthData, date: Date = new Date()): any {
  // Simplified timing calculations based on planetary hours and aspects
  const moonPhase = getMoonPhase(date);
  const transits = generateCurrentTransits(date);
  
  // Basic timing recommendations
  return {
    best: "2:30-4:30 PM",
    avoid: "7:00-9:00 PM",
    social: "10:00 AM-12:00 PM",
    creative: "1:00-3:00 PM",
    business: "9:00-11:00 AM"
  };
}

export function generateLuckyElements(birthData: BirthData, date: Date = new Date()): any {
  const dayOfWeek = date.getDay();
  const chineseZodiac = getChineseZodiac(date.getFullYear());
  
  // Elements based on day of week and Chinese zodiac
  const dailyElements = {
    colors: ['blue', 'gold', 'green'],
    numbers: [3, 7, 12, 21],
    direction: 'Northeast',
    element: 'Earth & Air',
    gemstone: 'Lapis Lazuli'
  };
  
  return dailyElements;
}

export function calculateVedicInfo(birthData: BirthData): any {
  // Simplified Vedic calculations
  const moonPosition = calculateMoonPosition(getJulianDay(new Date(`${birthData.birthDate}T${birthData.birthTime}`)));
  const nakshatraIndex = Math.floor((moonPosition.degree / 360) * 27);
  
  return {
    nakshatra: {
      name: 'Uttara Bhadrapada',
      pada: (nakshatraIndex % 4) + 1,
      deity: 'Ahir Budhnya',
      element: 'water'
    },
    dasha: {
      current: 'Venus',
      sub: 'Mercury',
      remaining: '2 years 4 months'
    },
    dosha: 'Kapha-Vata'
  };
}

export function calculateHumanDesign(birthData: BirthData): any {
  // Simplified Human Design calculation
  const birthDateTime = new Date(`${birthData.birthDate}T${birthData.birthTime}`);
  const seed = birthDateTime.getTime() % 4;
  
  const types = ['Generator', 'Manifestor', 'Projector', 'Reflector'];
  const strategies = [
    'To Respond',
    'To Inform',
    'To Wait for Invitation',
    'To Wait a Lunar Cycle'
  ];
  
  return {
    type: types[seed],
    strategy: strategies[seed],
    authority: 'Sacral',
    profile: '1/3',
    centers: ['Sacral', 'Solar Plexus', 'Heart'],
    channels: ['34-57', '1-8'],
    gates: [34, 57, 1, 8, 43, 23]
  };
}
