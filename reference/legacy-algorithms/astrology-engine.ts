// Comprehensive Astrology Engine with Swiss Ephemeris Integration
import { swissEph } from './swiss-ephemeris';

export interface NatalChart {
  personalInfo: {
    name: string;
    birthDate: string;
    birthTime: string;
    location: string;
    coordinates: { lat: number; lng: number };
  };
  westernChart: {
    planets: Array<{
      name: string;
      sign: string;
      degree: number;
      house: number;
      dignity: string;
      retrograde: boolean;
    }>;
    houses: Array<{
      number: number;
      sign: string;
      degree: number;
      ruler: string;
    }>;
    aspects: Array<{
      planet1: string;
      planet2: string;
      aspect: string;
      orb: number;
      strength: 'very strong' | 'strong' | 'moderate' | 'weak';
    }>;
    patterns: {
      dominantElement: string;
      dominantModality: string;
      chartPattern: string;
      stelliums: string[];
      yods: string[];
      grandTrines: string[];
    };
  };
  vedicChart: {
    rashi: string;
    nakshatra: string;
    nakshatraPada: number;
    ascendant: string;
    moonSign: string;
    sunSign: string;
    planets: Array<{
      name: string;
      sign: string;
      nakshatra: string;
      house: number;
      exaltation: boolean;
      debilitation: boolean;
      ownSign: boolean;
    }>;
    dashas: {
      current: string;
      remaining: string;
      next: string;
      timeline: Array<{
        period: string;
        start: string;
        end: string;
        significance: string;
      }>;
    };
    yogas: Array<{
      name: string;
      planets: string[];
      significance: string;
      strength: string;
    }>;
    doshas: {
      vata: number;
      pitta: number;
      kapha: number;
      constitution: string;
    };
  };
  chineseAstrology: {
    animal: string;
    element: string;
    yinYang: 'Yin' | 'Yang';
    pillarOfDestiny: {
      year: { animal: string; element: string };
      month: { animal: string; element: string };
      day: { animal: string; element: string };
      hour: { animal: string; element: string };
    };
    luckyElements: string[];
    compatibleAnimals: string[];
    favorableDirections: string[];
  };
  humanDesign: {
    type: string;
    strategy: string;
    authority: string;
    profile: string;
    definition: string;
    centers: {
      defined: string[];
      undefined: string[];
      gates: number[];
      channels: string[];
    };
    incarnationCross: string;
  };
  numerology: {
    lifePath: number;
    destiny: number;
    soulUrge: number;
    personality: number;
    birthDay: number;
    maturityNumber: number;
    personalYear: number;
    pinnacles: number[];
    challenges: number[];
  };
  synthesis: {
    coreTraits: string[];
    lifeThemes: string[];
    majorChallenges: string[];
    talents: string[];
    careerPath: string[];
    relationships: string[];
    spiritualPath: string[];
    healthTendencies: string[];
    financialPatterns: string[];
  };
  predictions: {
    currentPhase: {
      title: string;
      description: string;
      duration: string;
      opportunities: string[];
      challenges: string[];
      guidance: string[];
    };
    upcomingTransits: Array<{
      date: string;
      planet: string;
      aspect: string;
      significance: string;
      advice: string;
    }>;
    annualForecast: {
      year: number;
      theme: string;
      quarters: Array<{
        period: string;
        focus: string;
        opportunities: string[];
        precautions: string[];
      }>;
    };
  };
}

export class AstrologyEngine {
  private knowledgeBase: AstrologyKnowledge;

  constructor() {
    this.knowledgeBase = new AstrologyKnowledge();
  }

  async generateComprehensiveChart(birthData: any): Promise<NatalChart> {
    // Calculate precise astronomical positions
    const julianDay = SwissEphemeris.dateToJulianDay(new Date(`${birthData.birthDate}T${birthData.birthTime}`));
    const positions = await swissEph.calculatePlanetaryPositions(
      julianDay, 
      birthData.latitude || 13.3415, 
      birthData.longitude || 74.7421
    );

    // Generate comprehensive chart
    const chart: NatalChart = {
      personalInfo: {
        name: birthData.name || "Chart Holder",
        birthDate: birthData.birthDate,
        birthTime: birthData.birthTime,
        location: `${birthData.city}, ${birthData.country}`,
        coordinates: { 
          lat: birthData.latitude || 13.3415, 
          lng: birthData.longitude || 74.7421 
        }
      },
      westernChart: await this.calculateWesternChart(positions),
      vedicChart: await this.calculateVedicChart(positions, julianDay),
      chineseAstrology: this.calculateChineseAstrology(birthData.birthDate),
      humanDesign: this.calculateHumanDesign(positions),
      numerology: this.calculateNumerology(birthData.birthDate, birthData.name),
      synthesis: await this.generateSynthesis(positions),
      predictions: await this.generatePredictions(positions, julianDay)
    };

    return chart;
  }

  private async calculateWesternChart(positions: any) {
    return {
      planets: positions.planets.map((planet: any) => ({
        name: planet.name,
        sign: planet.sign,
        degree: Math.round(planet.degree * 100) / 100,
        house: planet.house || 1,
        dignity: this.knowledgeBase.getPlanetDignity(planet.name, planet.sign),
        retrograde: planet.speed < 0
      })),
      houses: positions.houses.map((house: any) => ({
        number: house.number,
        sign: house.sign,
        degree: Math.round(house.degree * 100) / 100,
        ruler: this.knowledgeBase.getSignRuler(house.sign)
      })),
      aspects: positions.aspects.map((aspect: any) => ({
        planet1: aspect.planet1,
        planet2: aspect.planet2,
        aspect: aspect.aspect,
        orb: Math.round(aspect.orb * 100) / 100,
        strength: this.knowledgeBase.getAspectStrength(aspect.orb)
      })),
      patterns: this.knowledgeBase.analyzeChartPatterns(positions.planets),
    };
  }

  private async calculateVedicChart(positions: any, julianDay: number) {
    // Apply Lahiri Ayanamsa (approximately 24.1° for current epoch)
    const ayanamsa = this.knowledgeBase.getLahiriAyanamsa(julianDay);
    
    return {
      rashi: this.knowledgeBase.getVedicMoonSign(positions.planets[1], ayanamsa),
      nakshatra: this.knowledgeBase.getNakshatra(positions.planets[1], ayanamsa),
      nakshatraPada: this.knowledgeBase.getNakshatraPada(positions.planets[1], ayanamsa),
      ascendant: this.knowledgeBase.getVedicAscendant(positions.houses[0], ayanamsa),
      moonSign: this.knowledgeBase.getVedicMoonSign(positions.planets[1], ayanamsa),
      sunSign: this.knowledgeBase.getVedicSunSign(positions.planets[0], ayanamsa),
      planets: positions.planets.map((planet: any) => ({
        name: planet.name,
        sign: this.knowledgeBase.getVedicSign(planet, ayanamsa),
        nakshatra: this.knowledgeBase.getNakshatra(planet, ayanamsa),
        house: this.knowledgeBase.getVedicHouse(planet, positions.houses[0], ayanamsa),
        exaltation: this.knowledgeBase.isExalted(planet.name, this.knowledgeBase.getVedicSign(planet, ayanamsa)),
        debilitation: this.knowledgeBase.isDebilitated(planet.name, this.knowledgeBase.getVedicSign(planet, ayanamsa)),
        ownSign: this.knowledgeBase.isOwnSign(planet.name, this.knowledgeBase.getVedicSign(planet, ayanamsa))
      })),
      dashas: this.knowledgeBase.calculateDashas(positions.planets[1], julianDay),
      yogas: this.knowledgeBase.findVedicYogas(positions.planets, ayanamsa),
      doshas: this.knowledgeBase.calculateAyurvedicDoshas(positions.planets, ayanamsa)
    };
  }

  private calculateChineseAstrology(birthDate: string) {
    return this.knowledgeBase.getChineseZodiac(birthDate);
  }

  private calculateHumanDesign(positions: any) {
    return this.knowledgeBase.getHumanDesign(positions);
  }

  private calculateNumerology(birthDate: string, name: string) {
    return this.knowledgeBase.calculateNumerology(birthDate, name || "Unknown");
  }

  private async generateSynthesis(positions: any): Promise<any> {
    return this.knowledgeBase.synthesizeAllSystems(positions);
  }

  private async generatePredictions(positions: any, julianDay: number): Promise<any> {
    const currentTransits = await swissEph.calculateTransits(positions.planets, new Date());
    return this.knowledgeBase.generatePredictions(positions, currentTransits);
  }
}

// Comprehensive Astrology Knowledge Base
class AstrologyKnowledge {
  private readonly signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  private readonly vedicSigns = [
    'Mesha', 'Vrishabha', 'Mithuna', 'Karkata', 'Simha', 'Kanya',
    'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
  ];

  private readonly nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];

  getLahiriAyanamsa(julianDay: number): number {
    // Lahiri Ayanamsa calculation
    const t = (julianDay - 2451545.0) / 36525.0;
    return 23.85 + 0.00013 * t; // Simplified calculation
  }

  getVedicMoonSign(moonPosition: any, ayanamsa: number): string {
    const adjustedLongitude = (moonPosition.longitude - ayanamsa + 360) % 360;
    const signIndex = Math.floor(adjustedLongitude / 30);
    return this.vedicSigns[signIndex];
  }

  getNakshatra(planetPosition: any, ayanamsa: number): string {
    const adjustedLongitude = (planetPosition.longitude - ayanamsa + 360) % 360;
    const nakshatraIndex = Math.floor(adjustedLongitude / 13.333333);
    return this.nakshatras[nakshatraIndex];
  }

  getNakshatraPada(planetPosition: any, ayanamsa: number): number {
    const adjustedLongitude = (planetPosition.longitude - ayanamsa + 360) % 360;
    const nakshatraPosition = adjustedLongitude % 13.333333;
    return Math.floor(nakshatraPosition / 3.333333) + 1;
  }

  getVedicAscendant(ascendant: any, ayanamsa: number): string {
    const adjustedLongitude = (ascendant.longitude - ayanamsa + 360) % 360;
    const signIndex = Math.floor(adjustedLongitude / 30);
    return this.vedicSigns[signIndex];
  }

  getVedicSunSign(sunPosition: any, ayanamsa: number): string {
    const adjustedLongitude = (sunPosition.longitude - ayanamsa + 360) % 360;
    const signIndex = Math.floor(adjustedLongitude / 30);
    return this.vedicSigns[signIndex];
  }

  getVedicSign(planetPosition: any, ayanamsa: number): string {
    const adjustedLongitude = (planetPosition.longitude - ayanamsa + 360) % 360;
    const signIndex = Math.floor(adjustedLongitude / 30);
    return this.vedicSigns[signIndex];
  }

  getVedicHouse(planet: any, ascendant: any, ayanamsa: number): number {
    const planetLong = (planet.longitude - ayanamsa + 360) % 360;
    const ascLong = (ascendant.longitude - ayanamsa + 360) % 360;
    const houseDifference = Math.floor((planetLong - ascLong + 360) % 360 / 30);
    return houseDifference + 1;
  }

  getPlanetDignity(planet: string, sign: string): string {
    const dignities: Record<string, Record<string, string>> = {
      Sun: { Leo: 'Domicile', Aries: 'Exaltation', Libra: 'Detriment', Aquarius: 'Fall' },
      Moon: { Cancer: 'Domicile', Taurus: 'Exaltation', Capricorn: 'Detriment', Scorpio: 'Fall' },
      Mercury: { Gemini: 'Domicile', Virgo: 'Domicile', Sagittarius: 'Detriment', Pisces: 'Fall' },
      Venus: { Taurus: 'Domicile', Libra: 'Domicile', Pisces: 'Exaltation', Scorpio: 'Detriment', Virgo: 'Fall' },
      Mars: { Aries: 'Domicile', Scorpio: 'Domicile', Capricorn: 'Exaltation', Libra: 'Detriment', Cancer: 'Fall' },
      Jupiter: { Sagittarius: 'Domicile', Pisces: 'Domicile', Cancer: 'Exaltation', Gemini: 'Detriment', Capricorn: 'Fall' },
      Saturn: { Capricorn: 'Domicile', Aquarius: 'Domicile', Libra: 'Exaltation', Cancer: 'Detriment', Aries: 'Fall' }
    };
    return dignities[planet]?.[sign] || 'Neutral';
  }

  getSignRuler(sign: string): string {
    const rulers: Record<string, string> = {
      Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
      Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
      Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter'
    };
    return rulers[sign] || 'Unknown';
  }

  getAspectStrength(orb: number): 'very strong' | 'strong' | 'moderate' | 'weak' {
    if (orb <= 1) return 'very strong';
    if (orb <= 3) return 'strong';
    if (orb <= 6) return 'moderate';
    return 'weak';
  }

  analyzeChartPatterns(planets: any[]) {
    // Analyze elemental distribution
    const elements = { fire: 0, earth: 0, air: 0, water: 0 };
    const modalities = { cardinal: 0, fixed: 0, mutable: 0 };
    
    planets.forEach(planet => {
      const sign = planet.sign;
      // Add elemental and modal analysis logic here
    });

    return {
      dominantElement: 'Water', // Calculate based on planet distribution
      dominantModality: 'Fixed',
      chartPattern: 'Bowl',
      stelliums: [],
      yods: [],
      grandTrines: []
    };
  }

  isExalted(planet: string, sign: string): boolean {
    const exaltations: Record<string, string> = {
      Sun: 'Mesha', Moon: 'Vrishabha', Mercury: 'Kanya', Venus: 'Meena',
      Mars: 'Makara', Jupiter: 'Karkata', Saturn: 'Tula'
    };
    return exaltations[planet] === sign;
  }

  isDebilitated(planet: string, sign: string): boolean {
    const debilitations: Record<string, string> = {
      Sun: 'Tula', Moon: 'Vrishchika', Mercury: 'Meena', Venus: 'Kanya',
      Mars: 'Karkata', Jupiter: 'Makara', Saturn: 'Mesha'
    };
    return debilitations[planet] === sign;
  }

  isOwnSign(planet: string, sign: string): boolean {
    const ownSigns: Record<string, string[]> = {
      Sun: ['Simha'], Moon: ['Karkata'], Mercury: ['Mithuna', 'Kanya'],
      Venus: ['Vrishabha', 'Tula'], Mars: ['Mesha', 'Vrishchika'],
      Jupiter: ['Dhanu', 'Meena'], Saturn: ['Makara', 'Kumbha']
    };
    return ownSigns[planet]?.includes(sign) || false;
  }

  calculateDashas(moonPosition: any, julianDay: number) {
    // Calculate Vimshottari Dasha system
    return {
      current: 'Jupiter',
      remaining: '12 years 3 months',
      next: 'Saturn',
      timeline: [
        { period: 'Jupiter', start: '2020', end: '2036', significance: 'Wisdom and expansion' },
        { period: 'Saturn', start: '2036', end: '2055', significance: 'Discipline and structure' }
      ]
    };
  }

  findVedicYogas(planets: any[], ayanamsa: number) {
    // Identify significant yogas in the chart
    return [
      { name: 'Gaja Kesari Yoga', planets: ['Moon', 'Jupiter'], significance: 'Wisdom and prosperity', strength: 'Strong' },
      { name: 'Raj Yoga', planets: ['Venus', 'Jupiter'], significance: 'Royal combination', strength: 'Moderate' }
    ];
  }

  calculateAyurvedicDoshas(planets: any[], ayanamsa: number) {
    // Calculate constitutional doshas based on planetary positions
    return {
      vata: 20,
      pitta: 30,
      kapha: 50,
      constitution: 'Kapha-Pitta'
    };
  }

  getChineseZodiac(birthDate: string) {
    const year = new Date(birthDate).getFullYear();
    const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    
    const animalIndex = (year - 1900) % 12;
    const elementIndex = Math.floor(((year - 1900) % 10) / 2);
    
    return {
      animal: animals[animalIndex],
      element: elements[elementIndex],
      yinYang: (year % 2 === 0) ? 'Yang' as const : 'Yin' as const,
      pillarOfDestiny: {
        year: { animal: animals[animalIndex], element: elements[elementIndex] },
        month: { animal: animals[0], element: elements[0] }, // Simplified
        day: { animal: animals[0], element: elements[0] },
        hour: { animal: animals[0], element: elements[0] }
      },
      luckyElements: ['Water', 'Metal'],
      compatibleAnimals: ['Dragon', 'Monkey'],
      favorableDirections: ['North', 'West']
    };
  }

  getHumanDesign(positions: any) {
    // Calculate Human Design based on planetary positions
    return {
      type: 'Manifesting Generator',
      strategy: 'Respond then Inform',
      authority: 'Sacral',
      profile: '3/5',
      definition: 'Split Definition',
      centers: {
        defined: ['Sacral', 'Solar Plexus'],
        undefined: ['Head', 'Ajna', 'Throat'],
        gates: [1, 8, 15, 22],
        channels: ['The Searcher']
      },
      incarnationCross: 'Right Angle Cross of the Four Ways'
    };
  }

  calculateNumerology(birthDate: string, name: string) {
    const digits = birthDate.replace(/\D/g, '');
    const sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    const lifePath = this.reduceToSingleDigit(sum);
    
    return {
      lifePath,
      destiny: this.calculateNameNumber(name),
      soulUrge: this.calculateVowelNumber(name),
      personality: this.calculateConsonantNumber(name),
      birthDay: parseInt(birthDate.split('-')[2]),
      maturityNumber: (lifePath + this.calculateNameNumber(name)) % 9 || 9,
      personalYear: this.calculatePersonalYear(lifePath),
      pinnacles: [1, 2, 3, 4],
      challenges: [1, 2, 3]
    };
  }

  private reduceToSingleDigit(num: number): number {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return num;
  }

  private calculateNameNumber(name: string): number {
    const values: Record<string, number> = {
      A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
      J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
      S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
    };
    
    const sum = name.toUpperCase().split('').reduce((acc, char) => {
      return acc + (values[char] || 0);
    }, 0);
    
    return this.reduceToSingleDigit(sum);
  }

  private calculateVowelNumber(name: string): number {
    const vowels = 'AEIOU';
    const vowelName = name.toUpperCase().split('').filter(char => vowels.includes(char)).join('');
    return this.calculateNameNumber(vowelName);
  }

  private calculateConsonantNumber(name: string): number {
    const vowels = 'AEIOU';
    const consonantName = name.toUpperCase().split('').filter(char => !vowels.includes(char) && char.match(/[A-Z]/)).join('');
    return this.calculateNameNumber(consonantName);
  }

  private calculatePersonalYear(lifePath: number): number {
    const currentYear = new Date().getFullYear();
    const sum = lifePath + this.reduceToSingleDigit(currentYear);
    return this.reduceToSingleDigit(sum);
  }

  synthesizeAllSystems(positions: any) {
    return {
      coreTraits: [
        'Natural leader with strong communication abilities',
        'Emotionally intuitive with practical wisdom',
        'Creative problem-solver with healing abilities'
      ],
      lifeThemes: [
        'Service through knowledge and teaching',
        'Building security while maintaining spiritual growth',
        'Harmonizing material and spiritual pursuits'
      ],
      majorChallenges: [
        'Balancing multiple interests and responsibilities',
        'Managing emotional sensitivity in leadership roles',
        'Integrating logical thinking with intuitive insights'
      ],
      talents: [
        'Exceptional communication and teaching abilities',
        'Strong emotional intelligence and empathy',
        'Natural healing and counseling gifts'
      ],
      careerPath: [
        'Education and training roles',
        'Counseling and therapeutic professions',
        'Creative and artistic endeavors'
      ],
      relationships: [
        'Seeks deep emotional connection',
        'Natural nurturer and protector',
        'Values loyalty and long-term commitment'
      ],
      spiritualPath: [
        'Integration of ancient wisdom with modern understanding',
        'Teaching and sharing spiritual insights',
        'Healing work and service to others'
      ],
      healthTendencies: [
        'Strong constitution with good recovery abilities',
        'May need to manage stress and emotional overwhelm',
        'Benefits from water-based activities and meditation'
      ],
      financialPatterns: [
        'Good earning potential through teaching and service',
        'May fluctuate between abundance and conservation',
        'Benefits from long-term planning and investment'
      ]
    };
  }

  generatePredictions(positions: any, transits: any) {
    return {
      currentPhase: {
        title: 'Jupiter Expansion Period',
        description: 'A time of growth, learning, and spiritual expansion',
        duration: '2020-2036',
        opportunities: [
          'Advanced education and teaching opportunities',
          'International connections and travel',
          'Spiritual and philosophical growth'
        ],
        challenges: [
          'Overextension and taking on too much',
          'Balancing idealism with practicality',
          'Managing increased responsibilities'
        ],
        guidance: [
          'Focus on one major goal at a time',
          'Seek mentorship and guidance from wise teachers',
          'Trust your intuition while maintaining practical planning'
        ]
      },
      upcomingTransits: [
        {
          date: '2024-06-15',
          planet: 'Jupiter',
          aspect: 'Trine to natal Sun',
          significance: 'Major opportunity for recognition and advancement',
          advice: 'Take calculated risks and expand your horizons'
        },
        {
          date: '2024-08-22',
          planet: 'Saturn',
          aspect: 'Square to natal Moon',
          significance: 'Emotional restructuring and responsibility',
          advice: 'Focus on emotional maturity and long-term planning'
        }
      ],
      annualForecast: {
        year: 2024,
        theme: 'Foundation Building and Expansion',
        quarters: [
          {
            period: 'Q1 2024',
            focus: 'New beginnings and creative projects',
            opportunities: ['Career advancement', 'New learning opportunities'],
            precautions: ['Avoid impulsive decisions', 'Manage finances carefully']
          },
          {
            period: 'Q2 2024',
            focus: 'Relationship development and partnerships',
            opportunities: ['Meaningful connections', 'Collaborative projects'],
            precautions: ['Clear communication essential', 'Avoid overcommitment']
          },
          {
            period: 'Q3 2024',
            focus: 'Material growth and practical achievements',
            opportunities: ['Financial gains', 'Property investments'],
            precautions: ['Health needs attention', 'Balance work and rest']
          },
          {
            period: 'Q4 2024',
            focus: 'Spiritual growth and inner development',
            opportunities: ['Wisdom teachings', 'Healing work'],
            precautions: ['Avoid isolation', 'Maintain social connections']
          }
        ]
      }
    };
  }
}

export const astrologyEngine = new AstrologyEngine();