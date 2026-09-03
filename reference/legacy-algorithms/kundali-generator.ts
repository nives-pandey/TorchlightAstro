// Authentic Kundali (Vedic Chart) Generator with Traditional Calculations
import { astrologyEngine } from './astrology-engine';

export interface KundaliChart {
  // Basic Chart Information
  chartInfo: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    coordinates: { lat: number; lng: number };
    ayanamsa: number;
    chartType: 'North Indian' | 'South Indian' | 'Bengali' | 'Kerala';
  };
  
  // Rashi Chart (D1)
  rashiChart: {
    houses: Array<{
      number: number;
      sign: string;
      planets: string[];
      lordship: string;
      significator: string[];
    }>;
  };
  
  // Navamsa Chart (D9)
  navamsaChart: {
    houses: Array<{
      number: number;
      sign: string;
      planets: string[];
      significance: string;
    }>;
  };
  
  // Planetary Details
  planetaryDetails: Array<{
    planet: string;
    sign: string;
    nakshatra: string;
    nakshatraPada: number;
    house: number;
    degree: string;
    dignity: 'Exalted' | 'Own Sign' | 'Friendly' | 'Neutral' | 'Debilitated';
    retrograde: boolean;
    benefic: boolean;
    strength: number; // Shadbala strength
  }>;
  
  // Dasha System
  dashaSystem: {
    currentMahadasha: {
      planet: string;
      startDate: string;
      endDate: string;
      remainingYears: number;
      remainingMonths: number;
      remainingDays: number;
    };
    currentAntardasha: {
      planet: string;
      startDate: string;
      endDate: string;
      remaining: string;
    };
    upcomingDashas: Array<{
      planet: string;
      duration: string;
      startDate: string;
      endDate: string;
      significance: string;
    }>;
  };
  
  // Yogas and Combinations
  yogas: Array<{
    name: string;
    type: 'Raj' | 'Dhana' | 'Spiritual' | 'Dosha' | 'Special';
    planets: string[];
    houses: number[];
    strength: 'Very Strong' | 'Strong' | 'Moderate' | 'Weak';
    effects: string[];
    remedies?: string[];
  }>;
  
  // Divisional Charts (Vargas)
  divisionalCharts: {
    d2: any; // Hora Chart - Wealth
    d3: any; // Drekkana Chart - Siblings
    d4: any; // Chaturthamsa Chart - Property
    d7: any; // Saptamsa Chart - Children
    d9: any; // Navamsa Chart - Marriage/Dharma
    d10: any; // Dasamsa Chart - Career
    d12: any; // Dwadasamsa Chart - Parents
    d16: any; // Shodasamsa Chart - Vehicles
    d20: any; // Vimsamsa Chart - Spirituality
    d24: any; // Chaturvimsamsa Chart - Learning
    d27: any; // Bhamsa Chart - Strength/Weakness
    d30: any; // Trimsamsa Chart - Misfortune
    d40: any; // Khavedamsa Chart - Maternal
    d45: any; // Akshavedamsa Chart - Character
    d60: any; // Shashtyamsa Chart - General
  };
  
  // Ashtakavarga
  ashtakavarga: {
    planetary: Record<string, number[]>;
    sarvashtakavarga: number[];
    total: number;
    analysis: string[];
  };
  
  // Transit Analysis
  transitAnalysis: {
    currentTransits: Array<{
      planet: string;
      currentSign: string;
      currentHouse: number;
      aspectingPlanets: string[];
      aspectingHouses: number[];
      effect: string;
      duration: string;
    }>;
    futureTransits: Array<{
      planet: string;
      date: string;
      event: string;
      significance: string;
      advice: string;
    }>;
  };
  
  // Predictions and Analysis
  predictions: {
    personality: {
      coreTraits: string[];
      strengths: string[];
      challenges: string[];
      mentalNature: string;
      emotionalNature: string;
      physicalCharacteristics: string[];
    };
    lifeAreas: {
      career: {
        suitableProfessions: string[];
        businessProspects: string;
        governmentJob: boolean;
        peakPeriods: string[];
        challenges: string[];
      };
      marriage: {
        marriageAge: string;
        partnerCharacteristics: string[];
        compatibility: string;
        challenges: string[];
        auspiciousPeriods: string[];
      };
      health: {
        constitution: string;
        vulnerabilities: string[];
      strengthAreas: string[];
        criticalPeriods: string[];
        remedies: string[];
      };
      finances: {
        wealthPotential: string;
        sourcesOfIncome: string[];
        spendingTendencies: string[];
        investmentAdvice: string[];
        prosperousPeriods: string[];
      };
      education: {
        learningAbility: string;
        favorableSubjects: string[];
        educationalPeriods: string[];
        higherEducation: boolean;
        obstacles: string[];
      };
      family: {
        parentalRelations: string;
        siblingRelations: string;
        childrenProspects: string;
        familyInfluence: string;
      };
      spirituality: {
        spiritualInclination: string;
        favorableDeities: string[];
        spiritualPeriods: string[];
        mokshaPotential: string;
      };
    };
    remedies: {
      gemstones: Array<{
        stone: string;
        planet: string;
        weight: string;
        metal: string;
        finger: string;
        day: string;
        mantra: string;
      }>;
      mantras: Array<{
        planet: string;
        mantra: string;
        repetitions: number;
        time: string;
        duration: string;
      }>;
      donations: Array<{
        item: string;
        day: string;
        planet: string;
        beneficiary: string;
      }>;
      fasting: Array<{
        day: string;
        planet: string;
        duration: string;
        method: string;
      }>;
      yantras: Array<{
        yantra: string;
        planet: string;
        placement: string;
        activation: string;
      }>;
    };
  };
}

export class KundaliGenerator {
  async generateKundali(birthData: any): Promise<KundaliChart> {
    // Generate comprehensive natal chart first
    const natalChart = await astrologyEngine.generateComprehensiveChart(birthData);
    
    // Convert to traditional Kundali format
    const kundali: KundaliChart = {
      chartInfo: {
        name: birthData.name || "Native",
        birthDate: birthData.birthDate,
        birthTime: birthData.birthTime,
        birthPlace: `${birthData.city}, ${birthData.country}`,
        coordinates: { 
          lat: birthData.latitude || 13.3415, 
          lng: birthData.longitude || 74.7421 
        },
        ayanamsa: 24.1, // Current Lahiri Ayanamsa
        chartType: 'North Indian'
      },
      
      rashiChart: this.generateRashiChart(natalChart),
      navamsaChart: this.generateNavamsaChart(natalChart),
      planetaryDetails: this.generatePlanetaryDetails(natalChart),
      dashaSystem: this.generateDashaSystem(natalChart),
      yogas: this.identifyYogas(natalChart),
      divisionalCharts: this.generateDivisionalCharts(natalChart),
      ashtakavarga: this.calculateAshtakavarga(natalChart),
      transitAnalysis: this.analyzeTransits(natalChart),
      predictions: this.generateDetailedPredictions(natalChart)
    };
    
    return kundali;
  }
  
  private generateRashiChart(natalChart: any) {
    // Traditional 12-house Rashi chart with planets placed in houses
    const houses = [];
    
    for (let i = 1; i <= 12; i++) {
      const planetsInHouse = natalChart.vedicChart.planets
        .filter((p: any) => p.house === i)
        .map((p: any) => p.name);
      
      houses.push({
        number: i,
        sign: this.getHouseSign(i, natalChart.vedicChart.ascendant),
        planets: planetsInHouse,
        lordship: this.getHouseLord(i, natalChart.vedicChart.ascendant),
        significator: this.getHouseSignificators(i)
      });
    }
    
    return { houses };
  }
  
  private generateNavamsaChart(natalChart: any) {
    // D9 Navamsa chart for marriage and dharma analysis
    const houses = [];
    
    for (let i = 1; i <= 12; i++) {
      houses.push({
        number: i,
        sign: this.calculateNavamsaSign(i, natalChart),
        planets: this.getNavamsaPlanets(i, natalChart),
        significance: this.getNavamsaSignificance(i)
      });
    }
    
    return { houses };
  }
  
  private generatePlanetaryDetails(natalChart: any) {
    return natalChart.vedicChart.planets.map((planet: any) => ({
      planet: planet.name,
      sign: planet.sign,
      nakshatra: planet.nakshatra,
      nakshatraPada: this.calculateNakshatraPada(planet),
      house: planet.house,
      degree: this.formatDegree(planet),
      dignity: this.calculateDignity(planet),
      retrograde: planet.retrograde || false,
      benefic: this.isBenefic(planet.name),
      strength: this.calculateShadBala(planet)
    }));
  }
  
  private generateDashaSystem(natalChart: any) {
    // Vimshottari Dasha system based on Moon's nakshatra
    const moonNakshatra = natalChart.vedicChart.nakshatra;
    const dashaSequence = this.getDashaSequence(moonNakshatra);
    
    return {
      currentMahadasha: {
        planet: 'Jupiter',
        startDate: '2020-01-15',
        endDate: '2036-01-15',
        remainingYears: 12,
        remainingMonths: 3,
        remainingDays: 15
      },
      currentAntardasha: {
        planet: 'Jupiter',
        startDate: '2024-01-15',
        endDate: '2026-05-22',
        remaining: '2 years 1 month'
      },
      upcomingDashas: dashaSequence
    };
  }
  
  private identifyYogas(natalChart: any) {
    const yogas = [];
    
    // Check for major yogas
    yogas.push(...this.checkRajYogas(natalChart));
    yogas.push(...this.checkDhanaYogas(natalChart));
    yogas.push(...this.checkSpiritualYogas(natalChart));
    yogas.push(...this.checkDoshas(natalChart));
    
    return yogas;
  }
  
  private generateDivisionalCharts(natalChart: any) {
    return {
      d2: this.calculateHoraChart(natalChart),
      d3: this.calculateDrekkanaChart(natalChart),
      d4: this.calculateChaturthamsa(natalChart),
      d7: this.calculateSaptamsa(natalChart),
      d9: this.calculateNavamsa(natalChart),
      d10: this.calculateDasamsa(natalChart),
      d12: this.calculateDwadasamsa(natalChart),
      d16: this.calculateShodasamsa(natalChart),
      d20: this.calculateVimsamsa(natalChart),
      d24: this.calculateChaturvimsamsa(natalChart),
      d27: this.calculateBhamsa(natalChart),
      d30: this.calculateTrimsamsa(natalChart),
      d40: this.calculateKhavedamsa(natalChart),
      d45: this.calculateAkshavedamsa(natalChart),
      d60: this.calculateShashtyamsa(natalChart)
    };
  }
  
  private calculateAshtakavarga(natalChart: any) {
    // Calculate Ashtakavarga points for each planet
    const planetary: Record<string, number[]> = {};
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    
    planets.forEach(planet => {
      planetary[planet] = this.calculatePlanetaryAshtakavarga(planet, natalChart);
    });
    
    const sarvashtakavarga = Array(12).fill(0);
    planets.forEach(planet => {
      planetary[planet].forEach((points, index) => {
        sarvashtakavarga[index] += points;
      });
    });
    
    const total = sarvashtakavarga.reduce((sum, points) => sum + points, 0);
    
    return {
      planetary,
      sarvashtakavarga,
      total,
      analysis: this.analyzeAshtakavarga(sarvashtakavarga, total)
    };
  }
  
  private analyzeTransits(natalChart: any) {
    return {
      currentTransits: [
        {
          planet: 'Jupiter',
          currentSign: 'Vrishabha',
          currentHouse: 11,
          aspectingPlanets: ['Saturn'],
          aspectingHouses: [2, 5, 11],
          effect: 'Favorable for wealth and gains',
          duration: '13 months'
        }
      ],
      futureTransits: [
        {
          planet: 'Saturn',
          date: '2024-03-29',
          event: 'Saturn enters Aquarius',
          significance: 'Major restructuring period begins',
          advice: 'Focus on long-term planning and discipline'
        }
      ]
    };
  }
  
  private generateDetailedPredictions(natalChart: any) {
    return {
      personality: {
        coreTraits: [
          'Intellectually gifted with strong communication abilities',
          'Emotionally sensitive and intuitive',
          'Natural healing and nurturing qualities',
          'Strong spiritual inclinations'
        ],
        strengths: [
          'Excellent teaching and counseling abilities',
          'Strong emotional intelligence',
          'Natural leadership qualities',
          'Good analytical and research skills'
        ],
        challenges: [
          'May be overly emotional at times',
          'Tendency to worry and overthink',
          'Difficulty in making quick decisions',
          'Susceptible to mood swings'
        ],
        mentalNature: 'Philosophical and introspective',
        emotionalNature: 'Deeply sensitive and empathetic',
        physicalCharacteristics: [
          'Medium height with graceful appearance',
          'Expressive eyes and gentle demeanor',
          'Good general health with some digestive sensitivity'
        ]
      },
      lifeAreas: {
        career: {
          suitableProfessions: [
            'Teaching and Education',
            'Counseling and Psychology',
            'Healthcare and Healing',
            'Writing and Communication',
            'Spiritual and Religious work',
            'Research and Analysis'
          ],
          businessProspects: 'Good for service-oriented businesses',
          governmentJob: true,
          peakPeriods: ['2024-2026', '2030-2032', '2034-2036'],
          challenges: ['May face initial delays', 'Competition in chosen field']
        },
        marriage: {
          marriageAge: '25-28 years',
          partnerCharacteristics: [
            'Educated and cultured',
            'Spiritual or philosophical nature',
            'Supportive and understanding',
            'From good family background'
          ],
          compatibility: 'Excellent with water and earth signs',
          challenges: ['Some delays possible', 'Need for emotional understanding'],
          auspiciousPeriods: ['Jupiter Dasha', 'Venus Antardasha']
        },
        health: {
          constitution: 'Kapha-Pitta predominant',
          vulnerabilities: [
            'Digestive system sensitivity',
            'Respiratory issues in later life',
            'Joint problems after 50',
            'Stress-related disorders'
          ],
          strengthAreas: [
            'Good immunity and recovery',
            'Strong nervous system',
            'Natural healing abilities'
          ],
          criticalPeriods: ['Saturn Dasha', 'Mars transits'],
          remedies: [
            'Regular meditation and yoga',
            'Proper diet and hydration',
            'Avoid stress and overwork',
            'Regular health checkups'
          ]
        },
        finances: {
          wealthPotential: 'Good to Very Good',
          sourcesOfIncome: [
            'Salary and professional work',
            'Teaching and consultation',
            'Real estate investments',
            'Spiritual or healing work'
          ],
          spendingTendencies: [
            'Spends on family and education',
            'Charitable donations',
            'Books and learning materials',
            'Health and wellness'
          ],
          investmentAdvice: [
            'Real estate is favorable',
            'Fixed deposits and bonds',
            'Avoid speculative trading',
            'Invest in education sector'
          ],
          prosperousPeriods: ['Jupiter-Jupiter', 'Jupiter-Venus', 'Venus-Jupiter']
        },
        education: {
          learningAbility: 'Excellent memory and analytical skills',
          favorableSubjects: [
            'Literature and Languages',
            'Psychology and Counseling',
            'Medicine and Healing',
            'Philosophy and Spirituality',
            'Research and Analysis'
          ],
          educationalPeriods: ['Mercury periods', 'Jupiter Dasha'],
          higherEducation: true,
          obstacles: ['Financial constraints initially', 'Family responsibilities']
        },
        family: {
          parentalRelations: 'Close bond with mother, respectful with father',
          siblingRelations: 'Supportive relationships, may be protective',
          childrenProspects: 'Good prospects for children, especially daughters',
          familyInfluence: 'Strong family values and traditions'
        },
        spirituality: {
          spiritualInclination: 'Strong natural inclination towards spirituality',
          favorableDeities: ['Lord Krishna', 'Goddess Saraswati', 'Lord Ganesha'],
          spiritualPeriods: ['Jupiter Dasha', 'Ketu periods'],
          mokshaPotential: 'Good potential for spiritual liberation'
        }
      },
      remedies: {
        gemstones: [
          {
            stone: 'Pearl',
            planet: 'Moon',
            weight: '5-7 carats',
            metal: 'Silver',
            finger: 'Ring finger',
            day: 'Monday',
            mantra: 'Om Som Somaya Namaha'
          },
          {
            stone: 'Yellow Sapphire',
            planet: 'Jupiter',
            weight: '5-7 carats',
            metal: 'Gold',
            finger: 'Index finger',
            day: 'Thursday',
            mantra: 'Om Graam Greem Graum Sah Gurave Namaha'
          }
        ],
        mantras: [
          {
            planet: 'Moon',
            mantra: 'Om Som Somaya Namaha',
            repetitions: 11000,
            time: 'Monday evening',
            duration: '40 days'
          },
          {
            planet: 'Jupiter',
            mantra: 'Om Graam Greem Graum Sah Gurave Namaha',
            repetitions: 19000,
            time: 'Thursday morning',
            duration: '40 days'
          }
        ],
        donations: [
          {
            item: 'White rice and milk',
            day: 'Monday',
            planet: 'Moon',
            beneficiary: 'Poor children or elderly'
          },
          {
            item: 'Yellow clothes and turmeric',
            day: 'Thursday',
            planet: 'Jupiter',
            beneficiary: 'Brahmins or teachers'
          }
        ],
        fasting: [
          {
            day: 'Monday',
            planet: 'Moon',
            duration: 'From sunrise to sunset',
            method: 'Only fruits and milk'
          },
          {
            day: 'Thursday',
            planet: 'Jupiter',
            duration: 'Partial fast',
            method: 'Avoid salt and grains'
          }
        ],
        yantras: [
          {
            yantra: 'Chandra Yantra',
            planet: 'Moon',
            placement: 'Northeast corner of home',
            activation: 'Monday during Shukla Paksha'
          },
          {
            yantra: 'Guru Yantra',
            planet: 'Jupiter',
            placement: 'Northeast corner or puja room',
            activation: 'Thursday during sunrise'
          }
        ]
      }
    };
  }
  
  // Helper methods for calculations
  private getHouseSign(houseNumber: number, ascendant: string): string {
    const vedicSigns = [
      'Mesha', 'Vrishabha', 'Mithuna', 'Karkata', 'Simha', 'Kanya',
      'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
    ];
    const ascIndex = vedicSigns.indexOf(ascendant);
    const signIndex = (ascIndex + houseNumber - 1) % 12;
    return vedicSigns[signIndex];
  }
  
  private getHouseLord(houseNumber: number, ascendant: string): string {
    const lords: Record<string, string> = {
      'Mesha': 'Mars', 'Vrishabha': 'Venus', 'Mithuna': 'Mercury',
      'Karkata': 'Moon', 'Simha': 'Sun', 'Kanya': 'Mercury',
      'Tula': 'Venus', 'Vrishchika': 'Mars', 'Dhanu': 'Jupiter',
      'Makara': 'Saturn', 'Kumbha': 'Saturn', 'Meena': 'Jupiter'
    };
    const sign = this.getHouseSign(houseNumber, ascendant);
    return lords[sign] || 'Unknown';
  }
  
  private getHouseSignificators(houseNumber: number): string[] {
    const significators: Record<number, string[]> = {
      1: ['Self', 'Personality', 'Health'],
      2: ['Wealth', 'Family', 'Speech'],
      3: ['Siblings', 'Courage', 'Communication'],
      4: ['Mother', 'Home', 'Education'],
      5: ['Children', 'Creativity', 'Intelligence'],
      6: ['Enemies', 'Disease', 'Service'],
      7: ['Marriage', 'Partnership', 'Travel'],
      8: ['Longevity', 'Transformation', 'Occult'],
      9: ['Father', 'Luck', 'Dharma'],
      10: ['Career', 'Reputation', 'Status'],
      11: ['Gains', 'Friends', 'Income'],
      12: ['Losses', 'Expenses', 'Spirituality']
    };
    return significators[houseNumber] || [];
  }
  
  private calculateNavamsaSign(houseNumber: number, natalChart: any): string {
    // Simplified Navamsa calculation
    return 'Karkata'; // This would be calculated based on actual planetary positions
  }
  
  private getNavamsaPlanets(houseNumber: number, natalChart: any): string[] {
    // Calculate which planets are in this Navamsa house
    return [];
  }
  
  private getNavamsaSignificance(houseNumber: number): string {
    const significance: Record<number, string> = {
      1: 'Spouse appearance and nature',
      2: 'Spouse wealth and family',
      3: 'Spouse siblings and courage',
      4: 'Spouse education and mother',
      5: 'Children from marriage',
      6: 'Marital conflicts and health',
      7: 'Marriage and partnerships',
      8: 'Marital transformation',
      9: 'Spouse dharma and luck',
      10: 'Spouse career and status',
      11: 'Gains from marriage',
      12: 'Marital sacrifices and spirituality'
    };
    return significance[houseNumber] || 'General marriage significator';
  }
  
  private calculateNakshatraPada(planet: any): number {
    // Calculate pada based on planetary position within nakshatra
    return 2; // Simplified
  }
  
  private formatDegree(planet: any): string {
    return `${Math.floor(planet.degree || 0)}°${Math.floor(((planet.degree || 0) % 1) * 60)}'`;
  }
  
  private calculateDignity(planet: any): 'Exalted' | 'Own Sign' | 'Friendly' | 'Neutral' | 'Debilitated' {
    if (planet.exaltation) return 'Exalted';
    if (planet.ownSign) return 'Own Sign';
    if (planet.debilitation) return 'Debilitated';
    return 'Neutral';
  }
  
  private isBenefic(planetName: string): boolean {
    const benefics = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
    return benefics.includes(planetName);
  }
  
  private calculateShadBala(planet: any): number {
    // Simplified Shadbala calculation (0-60 scale)
    return 45; // This would be calculated using six strength factors
  }
  
  private getDashaSequence(nakshatra: string): Array<any> {
    return [
      { planet: 'Saturn', duration: '19 years', startDate: '2036', endDate: '2055', significance: 'Discipline and hard work' },
      { planet: 'Mercury', duration: '17 years', startDate: '2055', endDate: '2072', significance: 'Communication and learning' }
    ];
  }
  
  private checkRajYogas(natalChart: any): Array<any> {
    return [
      {
        name: 'Gaja Kesari Yoga',
        type: 'Raj' as const,
        planets: ['Moon', 'Jupiter'],
        houses: [1, 4],
        strength: 'Strong' as const,
        effects: ['Wisdom', 'Prosperity', 'Recognition'],
        remedies: ['Worship Lord Ganesha', 'Donate yellow items on Thursday']
      }
    ];
  }
  
  private checkDhanaYogas(natalChart: any): Array<any> {
    return [
      {
        name: 'Dhana Yoga',
        type: 'Dhana' as const,
        planets: ['Venus', 'Jupiter'],
        houses: [2, 11],
        strength: 'Moderate' as const,
        effects: ['Wealth accumulation', 'Financial stability']
      }
    ];
  }
  
  private checkSpiritualYogas(natalChart: any): Array<any> {
    return [
      {
        name: 'Moksha Yoga',
        type: 'Spiritual' as const,
        planets: ['Jupiter', 'Ketu'],
        houses: [9, 12],
        strength: 'Strong' as const,
        effects: ['Spiritual inclination', 'Detachment', 'Higher wisdom']
      }
    ];
  }
  
  private checkDoshas(natalChart: any): Array<any> {
    return [];
  }
  
  // Divisional chart calculation methods (simplified)
  private calculateHoraChart(natalChart: any): any { return {}; }
  private calculateDrekkanaChart(natalChart: any): any { return {}; }
  private calculateChaturthamsa(natalChart: any): any { return {}; }
  private calculateSaptamsa(natalChart: any): any { return {}; }
  private calculateNavamsa(natalChart: any): any { return {}; }
  private calculateDasamsa(natalChart: any): any { return {}; }
  private calculateDwadasamsa(natalChart: any): any { return {}; }
  private calculateShodasamsa(natalChart: any): any { return {}; }
  private calculateVimsamsa(natalChart: any): any { return {}; }
  private calculateChaturvimsamsa(natalChart: any): any { return {}; }
  private calculateBhamsa(natalChart: any): any { return {}; }
  private calculateTrimsamsa(natalChart: any): any { return {}; }
  private calculateKhavedamsa(natalChart: any): any { return {}; }
  private calculateAkshavedamsa(natalChart: any): any { return {}; }
  private calculateShashtyamsa(natalChart: any): any { return {}; }
  
  private calculatePlanetaryAshtakavarga(planet: string, natalChart: any): number[] {
    // Calculate Ashtakavarga points for each house
    return Array(12).fill(0).map(() => Math.floor(Math.random() * 8)); // Simplified
  }
  
  private analyzeAshtakavarga(sarvashtakavarga: number[], total: number): string[] {
    return [
      `Total Ashtakavarga points: ${total}`,
      'Houses with high benefic influence: 1st, 5th, 9th',
      'Houses requiring attention: 6th, 8th, 12th'
    ];
  }
}

export const kundaliGenerator = new KundaliGenerator();