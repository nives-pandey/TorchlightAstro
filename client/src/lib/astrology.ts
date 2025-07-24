// Astrological calculation utilities and data structures

export interface PlanetaryPosition {
  planet: string;
  sign: string;
  degree: number;
  house: number;
  symbol: string;
  dignity?: 'domicile' | 'exaltation' | 'fall' | 'detriment' | 'neutral';
}

export interface HousePosition {
  house: number;
  sign: string;
  degree: number;
  ruler: string;
}

export interface Aspect {
  planets: [string, string];
  aspect: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
  orb: number;
  strength: 'strong' | 'moderate' | 'weak';
  applying: boolean;
}

export interface Transit {
  planet: string;
  sign?: string;
  aspect?: string;
  timing: string;
  influence: string;
  intensity: 'high' | 'medium' | 'low';
}

export interface Nakshatra {
  name: string;
  pada: number;
  deity: string;
  characteristics: string[];
  element: string;
}

export interface ChineseZodiac {
  animal: string;
  element: string;
  year: number;
  traits: string[];
  compatibility: string[];
}

export interface HumanDesignType {
  type: 'Generator' | 'Manifestor' | 'Projector' | 'Reflector';
  strategy: string;
  authority: string;
  centers: string[];
  channels: string[];
  gates: string[];
}

// Zodiac signs with metadata
export const ZODIAC_SIGNS = {
  aries: { symbol: '♈', element: 'fire', modality: 'cardinal', ruler: 'mars' },
  taurus: { symbol: '♉', element: 'earth', modality: 'fixed', ruler: 'venus' },
  gemini: { symbol: '♊', element: 'air', modality: 'mutable', ruler: 'mercury' },
  cancer: { symbol: '♋', element: 'water', modality: 'cardinal', ruler: 'moon' },
  leo: { symbol: '♌', element: 'fire', modality: 'fixed', ruler: 'sun' },
  virgo: { symbol: '♍', element: 'earth', modality: 'mutable', ruler: 'mercury' },
  libra: { symbol: '♎', element: 'air', modality: 'cardinal', ruler: 'venus' },
  scorpio: { symbol: '♏', element: 'water', modality: 'fixed', ruler: 'mars' },
  sagittarius: { symbol: '♐', element: 'fire', modality: 'mutable', ruler: 'jupiter' },
  capricorn: { symbol: '♑', element: 'earth', modality: 'cardinal', ruler: 'saturn' },
  aquarius: { symbol: '♒', element: 'air', modality: 'fixed', ruler: 'uranus' },
  pisces: { symbol: '♓', element: 'water', modality: 'mutable', ruler: 'neptune' }
} as const;

// Planetary symbols and properties
export const PLANETS = {
  sun: { symbol: '☉', element: 'fire', nature: 'masculine' },
  moon: { symbol: '☽', element: 'water', nature: 'feminine' },
  mercury: { symbol: '☿', element: 'air', nature: 'neutral' },
  venus: { symbol: '♀', element: 'earth', nature: 'feminine' },
  mars: { symbol: '♂', element: 'fire', nature: 'masculine' },
  jupiter: { symbol: '♃', element: 'fire', nature: 'masculine' },
  saturn: { symbol: '♄', element: 'earth', nature: 'masculine' },
  uranus: { symbol: '♅', element: 'air', nature: 'masculine' },
  neptune: { symbol: '♆', element: 'water', nature: 'feminine' },
  pluto: { symbol: '♇', element: 'water', nature: 'masculine' }
} as const;

// House meanings and areas
export const HOUSES = {
  1: { area: 'Identity & Appearance', keywords: ['self', 'appearance', 'first impressions'] },
  2: { area: 'Values & Resources', keywords: ['money', 'possessions', 'self-worth'] },
  3: { area: 'Communication & Learning', keywords: ['siblings', 'communication', 'short trips'] },
  4: { area: 'Home & Family', keywords: ['family', 'roots', 'foundation'] },
  5: { area: 'Creativity & Romance', keywords: ['children', 'creativity', 'romance'] },
  6: { area: 'Work & Health', keywords: ['daily routine', 'health', 'service'] },
  7: { area: 'Partnerships', keywords: ['marriage', 'partnerships', 'open enemies'] },
  8: { area: 'Transformation', keywords: ['death', 'transformation', 'occult'] },
  9: { area: 'Wisdom & Travel', keywords: ['philosophy', 'religion', 'long journeys'] },
  10: { area: 'Career & Reputation', keywords: ['career', 'reputation', 'public image'] },
  11: { area: 'Friendships & Goals', keywords: ['friends', 'hopes', 'group activities'] },
  12: { area: 'Spirituality & Subconscious', keywords: ['subconscious', 'hidden enemies', 'spirituality'] }
} as const;

// Nakshatras (Vedic lunar mansions)
export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
] as const;

// Chinese zodiac animals
export const CHINESE_ANIMALS = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
] as const;

export const CHINESE_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;

// Utility functions
export function getZodiacSign(degree: number): keyof typeof ZODIAC_SIGNS {
  const signs = Object.keys(ZODIAC_SIGNS) as (keyof typeof ZODIAC_SIGNS)[];
  const signIndex = Math.floor(degree / 30);
  return signs[signIndex] || 'aries';
}

export function getHouse(degree: number, ascendant: number): number {
  let houseDegree = degree - ascendant;
  if (houseDegree < 0) houseDegree += 360;
  return Math.floor(houseDegree / 30) + 1;
}

export function calculateAspectOrb(planet1Degree: number, planet2Degree: number, aspectDegree: number): number {
  const difference = Math.abs(planet1Degree - planet2Degree);
  const actualDifference = Math.min(difference, 360 - difference);
  return Math.abs(actualDifference - aspectDegree);
}

export function getAspectType(orb: number): Aspect['aspect'] | null {
  if (orb <= 8) return 'conjunction';
  if (Math.abs(orb - 60) <= 6) return 'sextile';
  if (Math.abs(orb - 90) <= 8) return 'square';
  if (Math.abs(orb - 120) <= 8) return 'trine';
  if (Math.abs(orb - 180) <= 8) return 'opposition';
  return null;
}

export function getMoonPhase(date: Date): { phase: string; illumination: number; emoji: string } {
  // Simplified moon phase calculation
  const lunarMonth = 29.53059; // days
  const knownNewMoon = new Date('2024-01-11'); // Known new moon date
  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const cyclePosition = (daysSinceNewMoon % lunarMonth) / lunarMonth;
  
  if (cyclePosition < 0.125) return { phase: 'New Moon', illumination: 0, emoji: '🌑' };
  if (cyclePosition < 0.25) return { phase: 'Waxing Crescent', illumination: 25, emoji: '🌒' };
  if (cyclePosition < 0.375) return { phase: 'First Quarter', illumination: 50, emoji: '🌓' };
  if (cyclePosition < 0.5) return { phase: 'Waxing Gibbous', illumination: 75, emoji: '🌔' };
  if (cyclePosition < 0.625) return { phase: 'Full Moon', illumination: 100, emoji: '🌕' };
  if (cyclePosition < 0.75) return { phase: 'Waning Gibbous', illumination: 75, emoji: '🌖' };
  if (cyclePosition < 0.875) return { phase: 'Last Quarter', illumination: 50, emoji: '🌗' };
  return { phase: 'Waning Crescent', illumination: 25, emoji: '🌘' };
}

export function getChineseZodiac(year: number): { animal: string; element: string } {
  const animals = CHINESE_ANIMALS;
  const elements = CHINESE_ELEMENTS;
  
  // Chinese zodiac starts from 1924 for this calculation
  const baseYear = 1924;
  const yearsSince = year - baseYear;
  
  const animalIndex = yearsSince % 12;
  const elementIndex = Math.floor(yearsSince / 2) % 5;
  
  return {
    animal: animals[animalIndex],
    element: elements[elementIndex]
  };
}

export function calculateCompatibilityScore(
  person1: { sun: string; moon: string; rising: string },
  person2: { sun: string; moon: string; rising: string }
): number {
  // Simplified compatibility calculation based on elements and modalities
  let score = 0;
  
  // Sun sign compatibility (40% weight)
  const sun1 = ZODIAC_SIGNS[person1.sun.toLowerCase() as keyof typeof ZODIAC_SIGNS];
  const sun2 = ZODIAC_SIGNS[person2.sun.toLowerCase() as keyof typeof ZODIAC_SIGNS];
  if (sun1.element === sun2.element) score += 40;
  else if ((sun1.element === 'fire' && sun2.element === 'air') || 
           (sun1.element === 'earth' && sun2.element === 'water') ||
           (sun1.element === 'air' && sun2.element === 'fire') ||
           (sun1.element === 'water' && sun2.element === 'earth')) score += 30;
  else score += 10;
  
  // Moon sign compatibility (35% weight)
  const moon1 = ZODIAC_SIGNS[person1.moon.toLowerCase() as keyof typeof ZODIAC_SIGNS];
  const moon2 = ZODIAC_SIGNS[person2.moon.toLowerCase() as keyof typeof ZODIAC_SIGNS];
  if (moon1.element === moon2.element) score += 35;
  else if ((moon1.element === 'fire' && moon2.element === 'air') || 
           (moon1.element === 'earth' && moon2.element === 'water') ||
           (moon1.element === 'air' && moon2.element === 'fire') ||
           (moon1.element === 'water' && moon2.element === 'earth')) score += 25;
  else score += 8;
  
  // Rising sign compatibility (25% weight)
  const rising1 = ZODIAC_SIGNS[person1.rising.toLowerCase() as keyof typeof ZODIAC_SIGNS];
  const rising2 = ZODIAC_SIGNS[person2.rising.toLowerCase() as keyof typeof ZODIAC_SIGNS];
  if (rising1.modality === rising2.modality) score += 25;
  else score += 12;
  
  return Math.min(score, 100);
}

export function generateLifestyleRecommendations(chartData: {
  sun: string;
  moon: string;
  rising: string;
  dominantElement: string;
}): {
  bestTimes: string[];
  favorableDirections: string[];
  beneficialColors: string[];
  recommendedActivities: string[];
  dietarySuggestions: string[];
} {
  const recommendations = {
    bestTimes: [] as string[],
    favorableDirections: [] as string[],
    beneficialColors: [] as string[],
    recommendedActivities: [] as string[],
    dietarySuggestions: [] as string[]
  };

  // Recommendations based on dominant element
  switch (chartData.dominantElement.toLowerCase()) {
    case 'fire':
      recommendations.bestTimes = ['sunrise', 'midday'];
      recommendations.favorableDirections = ['south', 'southeast'];
      recommendations.beneficialColors = ['red', 'orange', 'gold'];
      recommendations.recommendedActivities = ['exercise', 'leadership', 'creative projects'];
      recommendations.dietarySuggestions = ['spicy foods', 'citrus fruits', 'warm beverages'];
      break;
    case 'earth':
      recommendations.bestTimes = ['mid-morning', 'early afternoon'];
      recommendations.favorableDirections = ['southwest', 'northeast'];
      recommendations.beneficialColors = ['brown', 'yellow', 'green'];
      recommendations.recommendedActivities = ['gardening', 'organizing', 'practical tasks'];
      recommendations.dietarySuggestions = ['root vegetables', 'grains', 'dairy products'];
      break;
    case 'air':
      recommendations.bestTimes = ['mid-morning', 'early evening'];
      recommendations.favorableDirections = ['east', 'west'];
      recommendations.beneficialColors = ['light blue', 'white', 'silver'];
      recommendations.recommendedActivities = ['reading', 'socializing', 'learning'];
      recommendations.dietarySuggestions = ['light meals', 'fruits', 'herbal teas'];
      break;
    case 'water':
      recommendations.bestTimes = ['evening', 'night'];
      recommendations.favorableDirections = ['north', 'northwest'];
      recommendations.beneficialColors = ['blue', 'sea green', 'purple'];
      recommendations.recommendedActivities = ['meditation', 'swimming', 'emotional healing'];
      recommendations.dietarySuggestions = ['seafood', 'soups', 'hydrating foods'];
      break;
  }

  return recommendations;
}
