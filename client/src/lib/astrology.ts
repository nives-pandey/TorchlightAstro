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

export interface ComprehensiveRecommendations {
  luckyNumbers: number[];
  auspiciousDates: string[];
  favorableDays: string[];
  beneficialFoods: string[];
  avoidFoods: string[];
  careerSuggestions: string[];
  educationSubjects: string[];
  personalityTraits: string[];
  gemstones: string[];
  beneficialColors: string[];
  colorsToAvoid: string[];
  bestTimes: string[];
  timesToAvoid: string[];
  favorableDirections: string[];
  directionsToAvoid: string[];
  recommendedActivities: string[];
  activitiesToAvoid: string[];
  monthlyGuidance: Record<string, string>;
}

export function generateComprehensiveRecommendations(chartData: {
  sun: string;
  moon: string;
  rising: string;
  dominantElement: string;
  planets?: Record<string, { sign: string; house: number }>;
}): ComprehensiveRecommendations {
  const sunSign = chartData.sun.toLowerCase();
  const moonSign = chartData.moon.toLowerCase();
  const risingSign = chartData.rising.toLowerCase();
  const element = chartData.dominantElement.toLowerCase();
  
  const recommendations: ComprehensiveRecommendations = {
    luckyNumbers: [],
    auspiciousDates: [],
    favorableDays: [],
    beneficialFoods: [],
    avoidFoods: [],
    careerSuggestions: [],
    educationSubjects: [],
    personalityTraits: [],
    gemstones: [],
    beneficialColors: [],
    colorsToAvoid: [],
    bestTimes: [],
    timesToAvoid: [],
    favorableDirections: [],
    directionsToAvoid: [],
    recommendedActivities: [],
    activitiesToAvoid: [],
    monthlyGuidance: {}
  };

  // Lucky Numbers based on planetary influences
  const baseNumbers = getZodiacNumbers(sunSign);
  const moonNumbers = getZodiacNumbers(moonSign);
  recommendations.luckyNumbers = [...new Set([...baseNumbers, ...moonNumbers])].slice(0, 7);

  // Auspicious Dates (next 6 months)
  recommendations.auspiciousDates = generateAuspiciousDates(sunSign, moonSign);

  // Favorable Days
  recommendations.favorableDays = getFavorableDays(sunSign, element);

  // Food Recommendations
  const foodData = getFoodRecommendations(element, sunSign, moonSign);
  recommendations.beneficialFoods = foodData.beneficial;
  recommendations.avoidFoods = foodData.avoid;

  // Career and Education
  recommendations.careerSuggestions = getCareerSuggestions(sunSign, element, chartData.planets);
  recommendations.educationSubjects = getEducationSubjects(sunSign, element);

  // Personality Traits
  recommendations.personalityTraits = getPersonalityTraits(sunSign, moonSign, risingSign);

  // Gemstones
  recommendations.gemstones = getGemstones(sunSign, moonSign, element);

  // Colors
  const colorData = getColorRecommendations(element, sunSign);
  recommendations.beneficialColors = colorData.beneficial;
  recommendations.colorsToAvoid = colorData.avoid;

  // Timing
  const timingData = getTimingRecommendations(element, sunSign);
  recommendations.bestTimes = timingData.best;
  recommendations.timesToAvoid = timingData.avoid;

  // Directions
  const directionData = getDirectionRecommendations(element, sunSign);
  recommendations.favorableDirections = directionData.favorable;
  recommendations.directionsToAvoid = directionData.avoid;

  // Activities
  const activityData = getActivityRecommendations(element, sunSign, moonSign);
  recommendations.recommendedActivities = activityData.recommended;
  recommendations.activitiesToAvoid = activityData.avoid;

  // Monthly Guidance
  recommendations.monthlyGuidance = getMonthlyGuidance(sunSign, element);

  return recommendations;
}

function getZodiacNumbers(sign: string): number[] {
  const numberMap: Record<string, number[]> = {
    aries: [1, 9, 14, 23],
    taurus: [2, 6, 15, 24],
    gemini: [3, 5, 14, 23],
    cancer: [2, 7, 16, 25],
    leo: [1, 4, 13, 22],
    virgo: [3, 6, 15, 24],
    libra: [6, 7, 16, 25],
    scorpio: [4, 8, 13, 22],
    sagittarius: [3, 9, 18, 27],
    capricorn: [8, 10, 19, 28],
    aquarius: [4, 11, 20, 29],
    pisces: [7, 12, 21, 30]
  };
  return numberMap[sign] || [1, 7, 14, 21];
}

function generateAuspiciousDates(sunSign: string, moonSign: string): string[] {
  const today = new Date();
  const dates = [];
  
  // Generate next 6 months of favorable dates
  for (let i = 1; i <= 180; i += 15) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  }
  
  return dates.slice(0, 12);
}

function getFavorableDays(sunSign: string, element: string): string[] {
  const dayMap: Record<string, string[]> = {
    fire: ['Tuesday', 'Sunday'],
    earth: ['Wednesday', 'Saturday'],
    air: ['Wednesday', 'Friday'],
    water: ['Monday', 'Thursday']
  };
  
  const signDays: Record<string, string> = {
    aries: 'Tuesday', taurus: 'Friday', gemini: 'Wednesday',
    cancer: 'Monday', leo: 'Sunday', virgo: 'Wednesday',
    libra: 'Friday', scorpio: 'Tuesday', sagittarius: 'Thursday',
    capricorn: 'Saturday', aquarius: 'Saturday', pisces: 'Thursday'
  };
  
  const elementDays = dayMap[element] || ['Sunday'];
  const signDay = signDays[sunSign];
  
  return [...new Set([...elementDays, signDay])].filter(Boolean);
}

function getFoodRecommendations(element: string, sunSign: string, moonSign: string): { beneficial: string[], avoid: string[] } {
  const elementFoods: Record<string, { beneficial: string[], avoid: string[] }> = {
    fire: {
      beneficial: ['Spicy foods', 'Red pepper', 'Ginger', 'Cinnamon', 'Citrus fruits', 'Pomegranate', 'Beef', 'Hot soups'],
      avoid: ['Cold foods', 'Excessive dairy', 'Raw vegetables in winter', 'Iced drinks']
    },
    earth: {
      beneficial: ['Root vegetables', 'Grains', 'Beans', 'Dairy products', 'Honey', 'Dates', 'Almonds', 'Whole grains'],
      avoid: ['Processed foods', 'Excessive sugar', 'Fast food', 'Artificial additives']
    },
    air: {
      beneficial: ['Light foods', 'Fruits', 'Salads', 'Herbal teas', 'Coconut', 'Green vegetables', 'Fish'],
      avoid: ['Heavy meals', 'Fried foods', 'Excessive meat', 'Dense foods before sleep']
    },
    water: {
      beneficial: ['Seafood', 'Soups', 'Hydrating fruits', 'Cucumber', 'Melons', 'Rice', 'Milk', 'Coconut water'],
      avoid: ['Dehydrating foods', 'Excessive salt', 'Spicy foods', 'Alcohol in excess']
    }
  };
  
  return elementFoods[element] || elementFoods.earth;
}

function getCareerSuggestions(sunSign: string, element: string, planets?: Record<string, any>): string[] {
  const careerMap: Record<string, string[]> = {
    aries: ['Leadership roles', 'Entrepreneurship', 'Military', 'Sports', 'Emergency services', 'Sales'],
    taurus: ['Banking', 'Real estate', 'Agriculture', 'Art', 'Food industry', 'Interior design'],
    gemini: ['Communication', 'Writing', 'Teaching', 'Media', 'Technology', 'Transportation'],
    cancer: ['Healthcare', 'Hospitality', 'Real estate', 'Social work', 'Food service', 'Childcare'],
    leo: ['Entertainment', 'Management', 'Politics', 'Theater', 'Fashion', 'Government'],
    virgo: ['Healthcare', 'Research', 'Analytics', 'Administration', 'Quality control', 'Editing'],
    libra: ['Law', 'Diplomacy', 'Art', 'Fashion', 'Counseling', 'Public relations'],
    scorpio: ['Investigation', 'Psychology', 'Surgery', 'Research', 'Insurance', 'Occult sciences'],
    sagittarius: ['Education', 'Travel', 'Publishing', 'Philosophy', 'Sports', 'International trade'],
    capricorn: ['Management', 'Government', 'Engineering', 'Architecture', 'Business', 'Administration'],
    aquarius: ['Technology', 'Social work', 'Innovation', 'Science', 'Humanitarian work', 'Electronics'],
    pisces: ['Arts', 'Healing', 'Psychology', 'Spirituality', 'Film', 'Marine biology']
  };
  
  return careerMap[sunSign] || ['General management', 'Consulting', 'Service industry'];
}

function getEducationSubjects(sunSign: string, element: string): string[] {
  const subjectMap: Record<string, string[]> = {
    aries: ['Sports science', 'Engineering', 'Military studies', 'Business administration', 'Physical education'],
    taurus: ['Economics', 'Agriculture', 'Fine arts', 'Architecture', 'Culinary arts', 'Music'],
    gemini: ['Communications', 'Literature', 'Computer science', 'Languages', 'Journalism'],
    cancer: ['Psychology', 'History', 'Social work', 'Nutrition', 'Early childhood education'],
    leo: ['Performing arts', 'Political science', 'Management', 'Fashion design', 'Film studies'],
    virgo: ['Medicine', 'Mathematics', 'Research methodology', 'Library science', 'Statistics'],
    libra: ['Law', 'Arts', 'International relations', 'Interior design', 'Counseling'],
    scorpio: ['Psychology', 'Forensic science', 'Medicine', 'Occult studies', 'Investigation'],
    sagittarius: ['Philosophy', 'International studies', 'Adventure sports', 'Theology', 'Travel and tourism'],
    capricorn: ['Business administration', 'Government studies', 'Engineering', 'Geology', 'Management'],
    aquarius: ['Science', 'Technology', 'Social sciences', 'Innovation studies', 'Humanitarian studies'],
    pisces: ['Arts', 'Marine biology', 'Spirituality', 'Film studies', 'Healing arts']
  };
  
  return subjectMap[sunSign] || ['General studies', 'Liberal arts', 'Business'];
}

function getPersonalityTraits(sunSign: string, moonSign: string, risingSign: string): string[] {
  const traitMap: Record<string, string[]> = {
    aries: ['Leadership', 'Courage', 'Initiative', 'Pioneering spirit', 'Independence'],
    taurus: ['Reliability', 'Patience', 'Determination', 'Practicality', 'Loyalty'],
    gemini: ['Adaptability', 'Communication', 'Curiosity', 'Versatility', 'Intelligence'],
    cancer: ['Nurturing', 'Intuition', 'Emotional depth', 'Protective nature', 'Sensitivity'],
    leo: ['Confidence', 'Creativity', 'Generosity', 'Leadership', 'Warmth'],
    virgo: ['Attention to detail', 'Analytical mind', 'Service orientation', 'Perfectionism', 'Practicality'],
    libra: ['Diplomacy', 'Balance', 'Aesthetic sense', 'Cooperation', 'Fairness'],
    scorpio: ['Intensity', 'Transformation', 'Depth', 'Intuition', 'Determination'],
    sagittarius: ['Optimism', 'Adventure', 'Philosophy', 'Freedom-loving', 'Honesty'],
    capricorn: ['Ambition', 'Discipline', 'Responsibility', 'Persistence', 'Structure'],
    aquarius: ['Innovation', 'Independence', 'Humanitarian nature', 'Originality', 'Forward-thinking'],
    pisces: ['Compassion', 'Intuition', 'Creativity', 'Spirituality', 'Empathy']
  };
  
  const sunTraits = traitMap[sunSign] || [];
  const moonTraits = traitMap[moonSign] || [];
  
  return [...new Set([...sunTraits.slice(0, 3), ...moonTraits.slice(0, 2)])];
}

function getGemstones(sunSign: string, moonSign: string, element: string): string[] {
  const gemstoneMap: Record<string, string[]> = {
    aries: ['Diamond', 'Ruby', 'Red Coral', 'Bloodstone'],
    taurus: ['Emerald', 'Rose Quartz', 'Sapphire', 'Jade'],
    gemini: ['Emerald', 'Agate', 'Citrine', 'Pearl'],
    cancer: ['Pearl', 'Moonstone', 'Silver', 'Opal'],
    leo: ['Ruby', 'Gold', 'Peridot', 'Amber'],
    virgo: ['Sapphire', 'Peridot', 'Agate', 'Carnelian'],
    libra: ['Opal', 'Diamond', 'Jade', 'Lapis Lazuli'],
    scorpio: ['Topaz', 'Garnet', 'Beryl', 'Coral'],
    sagittarius: ['Turquoise', 'Topaz', 'Amethyst', 'Ruby'],
    capricorn: ['Garnet', 'Onyx', 'Blue Sapphire', 'Amethyst'],
    aquarius: ['Amethyst', 'Garnet', 'Sapphire', 'Aquamarine'],
    pisces: ['Aquamarine', 'Amethyst', 'Moonstone', 'Pearl']
  };
  
  return gemstoneMap[sunSign] || ['Clear Quartz', 'Amethyst', 'Rose Quartz'];
}

function getColorRecommendations(element: string, sunSign: string): { beneficial: string[], avoid: string[] } {
  const colorMap: Record<string, { beneficial: string[], avoid: string[] }> = {
    fire: {
      beneficial: ['Red', 'Orange', 'Gold', 'Yellow', 'Bright colors'],
      avoid: ['Dark blue', 'Black', 'Dark green', 'Cool colors']
    },
    earth: {
      beneficial: ['Brown', 'Green', 'Yellow', 'Beige', 'Earth tones'],
      avoid: ['Bright red', 'Electric blue', 'Hot pink', 'Neon colors']
    },
    air: {
      beneficial: ['Light blue', 'White', 'Silver', 'Pale yellow', 'Pastels'],
      avoid: ['Dark colors', 'Heavy browns', 'Deep reds', 'Black']
    },
    water: {
      beneficial: ['Blue', 'Sea green', 'Purple', 'Silver', 'White'],
      avoid: ['Bright orange', 'Hot red', 'Neon yellow', 'Harsh colors']
    }
  };
  
  return colorMap[element] || colorMap.earth;
}

function getTimingRecommendations(element: string, sunSign: string): { best: string[], avoid: string[] } {
  const timingMap: Record<string, { best: string[], avoid: string[] }> = {
    fire: {
      best: ['6-8 AM', '12-2 PM', 'Sunrise', 'Midday'],
      avoid: ['10 PM-12 AM', 'Late night', 'Pre-dawn hours']
    },
    earth: {
      best: ['9-11 AM', '2-4 PM', 'Mid-morning', 'Early afternoon'],
      avoid: ['Midnight-3 AM', 'Very early morning', 'Late evening']
    },
    air: {
      best: ['10 AM-12 PM', '4-6 PM', 'Mid-morning', 'Early evening'],
      avoid: ['3-5 AM', 'Deep night', 'Heavy afternoon']
    },
    water: {
      best: ['6-8 PM', '8-10 PM', 'Evening', 'Twilight hours'],
      avoid: ['12-3 PM', 'Harsh midday', 'Peak afternoon sun']
    }
  };
  
  return timingMap[element] || timingMap.earth;
}

function getDirectionRecommendations(element: string, sunSign: string): { favorable: string[], avoid: string[] } {
  const directionMap: Record<string, { favorable: string[], avoid: string[] }> = {
    fire: {
      favorable: ['South', 'Southeast', 'East'],
      avoid: ['North', 'Northwest']
    },
    earth: {
      favorable: ['Southwest', 'Northeast', 'South'],
      avoid: ['Southeast', 'Northwest']
    },
    air: {
      favorable: ['East', 'West', 'Northeast'],
      avoid: ['South', 'Southwest']
    },
    water: {
      favorable: ['North', 'Northeast', 'Northwest'],
      avoid: ['South', 'Southeast']
    }
  };
  
  return directionMap[element] || directionMap.earth;
}

function getActivityRecommendations(element: string, sunSign: string, moonSign: string): { recommended: string[], avoid: string[] } {
  const activityMap: Record<string, { recommended: string[], avoid: string[] }> = {
    fire: {
      recommended: ['Exercise', 'Leadership activities', 'Competitive sports', 'Creative projects', 'Outdoor activities'],
      avoid: ['Passive activities', 'Excessive meditation', 'Sedentary lifestyle', 'Isolation']
    },
    earth: {
      recommended: ['Gardening', 'Organizing', 'Practical tasks', 'Building projects', 'Financial planning'],
      avoid: ['Impulsive decisions', 'Risky investments', 'Unstable situations', 'Chaotic environments']
    },
    air: {
      recommended: ['Reading', 'Socializing', 'Learning', 'Communication', 'Travel', 'Networking'],
      avoid: ['Isolation', 'Routine work', 'Physical labor', 'Emotional drama']
    },
    water: {
      recommended: ['Meditation', 'Swimming', 'Emotional healing', 'Artistic pursuits', 'Spiritual practices'],
      avoid: ['Harsh criticism', 'Aggressive sports', 'Emotional stress', 'Dry environments']
    }
  };
  
  return activityMap[element] || activityMap.earth;
}

function getMonthlyGuidance(sunSign: string, element: string): Record<string, string> {
  return {
    'January': 'Focus on new beginnings and goal setting. Excellent time for planning.',
    'February': 'Strengthen relationships and social connections. Good for collaboration.',
    'March': 'Take initiative in projects. Energy levels are high for action.',
    'April': 'Financial matters require attention. Good time for investments.',
    'May': 'Communication and learning are favored. Expand your knowledge.',
    'June': 'Home and family matters take priority. Focus on security.',
    'July': 'Creative projects flourish. Express your artistic side.',
    'August': 'Career advancement opportunities arise. Show leadership.',
    'September': 'Health and daily routines need attention. Organize your life.',
    'October': 'Partnerships and relationships are highlighted. Seek balance.',
    'November': 'Transformation and deep changes occur. Embrace renewal.',
    'December': 'Spiritual growth and wisdom seeking. Reflect and plan ahead.'
  };
}
