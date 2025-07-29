// Multi-System Destination & Climate Recommendation Engine
// Based on authentic astrological principles from 5 major systems

export interface SystemProfile {
  western?: {
    sunSign: string;
    moonSign?: string;  
    ascendant?: string;
    dominantElement: 'fire' | 'earth' | 'air' | 'water';
    dominantQuality: 'cardinal' | 'fixed' | 'mutable';
    rulingPlanet: string;
  };
  vedic?: {
    rashi: string;
    nakshatra: string;
    ascendant?: string;
    dominantDosha: 'vata' | 'pitta' | 'kapha';
    birthStar: string;
    rulingPlanet: string;
  };
  chinese?: {
    animal: string;
    element: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
    polarity: 'yin' | 'yang';
    season: 'spring' | 'summer' | 'autumn' | 'winter';
  };
  humanDesign?: {
    type: 'Generator' | 'Projector' | 'Manifestor' | 'Reflector';
    strategy: string;
    authority: string;
    profile: string;
  };
  numerology?: {
    lifePathNumber: number;
    destinyNumber: number;
    soulUrge: number;
    personalityNumber: number;
  };
}

export interface DestinationRecommendation {
  location: string;
  country: string;
  continent: string;
  coordinates: { lat: number; lng: number };
  climate: {
    type: string;
    temperatureRange: { min: number; max: number };
    idealMonths: string[];
    humidity: 'low' | 'moderate' | 'high';
    seasonality: string;
  };
  benefits: string[];
  astrologyBasis: {
    systems: string[];
    reasoning: string[];
    confidence: number;
  };
  activities: string[];
  precautions: string[];
}

export interface ClimateProfile {
  idealTemperature: { min: number; max: number };
  preferredHumidity: 'low' | 'moderate' | 'high';
  seasonPreference: string[];
  avoidConditions: string[];
  reasoning: {
    system: string;
    explanation: string;
  }[];
}

// Western Astrology - Element-based Destination Mapping
const WESTERN_DESTINATIONS = {
  fire: {
    favorable: [
      {
        location: "Cairo, Egypt",
        country: "Egypt",
        continent: "Africa", 
        coordinates: { lat: 30.0444, lng: 31.2357 },
        climate: {
          type: "Hot Desert",
          temperatureRange: { min: 20, max: 35 },
          idealMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
          humidity: "low" as const,
          seasonality: "Winter travel recommended"
        },
        benefits: ["Enhanced leadership energy", "Increased vitality", "Solar plexus activation", "Confidence boost"],
        activities: ["Desert expeditions", "Solar energy practices", "Historical exploration", "Adventure sports"],
        precautions: ["Stay hydrated", "Avoid peak summer", "Sun protection essential"]
      },
      {
        location: "Sedona, Arizona",
        country: "USA",
        continent: "North America",
        coordinates: { lat: 34.8697, lng: -111.7610 },
        climate: {
          type: "High Desert",
          temperatureRange: { min: 15, max: 30 },
          idealMonths: ["Mar", "Apr", "May", "Sep", "Oct", "Nov"],
          humidity: "low" as const,
          seasonality: "Spring and fall optimal"
        },
        benefits: ["Spiritual awakening", "Energy vortex alignment", "Creative inspiration", "Physical vitality"],
        activities: ["Vortex meditation", "Red rock climbing", "Sunrise ceremonies", "Energy healing"],
        precautions: ["High altitude adjustment", "Strong UV exposure", "Rocky terrain awareness"]
      },
      {
        location: "Rajasthan, India",
        country: "India",
        continent: "Asia",
        coordinates: { lat: 26.9124, lng: 75.7873 },
        climate: {
          type: "Hot Semi-Arid",
          temperatureRange: { min: 18, max: 40 },
          idealMonths: ["Nov", "Dec", "Jan", "Feb"],
          humidity: "low" as const,
          seasonality: "Cool season essential"
        },
        benefits: ["Royal energy activation", "Cultural fire alignment", "Passionate expression", "Leadership development"],
        activities: ["Palace tours", "Desert safaris", "Traditional festivals", "Fire ceremonies"],
        precautions: ["Monsoon avoidance", "Extreme heat periods", "Cultural sensitivity required"]
      }
    ],
    climate: {
      idealTemperature: { min: 22, max: 32 },
      preferredHumidity: "low" as const,
      seasonPreference: ["Summer", "Late Spring"],
      avoidConditions: ["Excessive humidity", "Cold climates", "Prolonged grey weather"],
      reasoning: [
        { system: "Western", explanation: "Fire signs need warmth and sunshine to maintain energy levels" },
        { system: "Western", explanation: "Dry heat enhances natural fire element without overwhelming" },
        { system: "Western", explanation: "Bright environments support optimistic fire nature" }
      ]
    }
  },
  earth: {
    favorable: [
      {
        location: "Swiss Alps",
        country: "Switzerland", 
        continent: "Europe",
        coordinates: { lat: 46.5197, lng: 7.4815 },
        climate: {
          type: "Alpine",
          temperatureRange: { min: 5, max: 20 },
          idealMonths: ["Jun", "Jul", "Aug", "Sep"],
          humidity: "moderate" as const,
          seasonality: "Summer hiking season"
        },
        benefits: ["Deep grounding", "Stability enhancement", "Natural connection", "Practical insights"],
        activities: ["Mountain hiking", "Alpine meditation", "Traditional crafts", "Sustainable living"],
        precautions: ["Weather changes", "Altitude sickness", "Trail difficulty assessment"]
      },
      {
        location: "Tuscany, Italy",
        country: "Italy",
        continent: "Europe", 
        coordinates: { lat: 43.7711, lng: 11.2486 },
        climate: {
          type: "Mediterranean",
          temperatureRange: { min: 12, max: 28 },
          idealMonths: ["Apr", "May", "Jun", "Sep", "Oct"],
          humidity: "moderate" as const,
          seasonality: "Spring and autumn ideal"
        },
        benefits: ["Sensual grounding", "Agricultural connection", "Artistic inspiration", "Slow living"],
        activities: ["Vineyard tours", "Cooking classes", "Art workshops", "Farm experiences"],
        precautions: ["Tourist crowds in summer", "Transportation planning", "Language preparation"]
      },
      {
        location: "New Zealand",
        country: "New Zealand",
        continent: "Oceania",
        coordinates: { lat: -40.9006, lng: 174.8860 },
        climate: {
          type: "Temperate Oceanic",
          temperatureRange: { min: 8, max: 24 },
          idealMonths: ["Dec", "Jan", "Feb", "Mar", "Apr"],
          humidity: "moderate" as const,
          seasonality: "Southern hemisphere summer"
        },
        benefits: ["Nature immersion", "Stability through adventure", "Environmental consciousness", "Practical skills"],
        activities: ["Nature walks", "Sustainable tourism", "Outdoor activities", "Conservation work"],
        precautions: ["Seasonal reversal", "Weather variability", "Remote area preparation"]
      }
    ],
    climate: {
      idealTemperature: { min: 15, max: 25 },
      preferredHumidity: "moderate" as const,
      seasonPreference: ["Spring", "Autumn"],
      avoidConditions: ["Extreme heat", "High humidity", "Unstable weather"],
      reasoning: [
        { system: "Western", explanation: "Earth signs prefer stable, moderate climates that support grounding" },
        { system: "Western", explanation: "Natural environments enhance earth element connection" },
        { system: "Western", explanation: "Consistent temperatures support earth sign need for security" }
      ]
    }
  },
  air: {
    favorable: [
      {
        location: "Himalayas, Nepal",
        country: "Nepal",
        continent: "Asia",
        coordinates: { lat: 27.9881, lng: 86.9250 },
        climate: {
          type: "Alpine/Highland",
          temperatureRange: { min: 5, max: 20 },
          idealMonths: ["Mar", "Apr", "May", "Oct", "Nov"],
          humidity: "low" as const,
          seasonality: "Pre and post monsoon"
        },
        benefits: ["Mental clarity", "Spiritual elevation", "Communication enhancement", "Intellectual stimulation"],
        activities: ["High-altitude trekking", "Meditation retreats", "Cultural exchange", "Philosophical discussions"],
        precautions: ["Altitude preparation", "Weather monitoring", "Physical fitness required"]
      },
      {
        location: "Andes Mountains, Peru",
        country: "Peru", 
        continent: "South America",
        coordinates: { lat: -13.5319, lng: -71.9675 },
        climate: {
          type: "High Altitude Tropical",
          temperatureRange: { min: 8, max: 22 },
          idealMonths: ["May", "Jun", "Jul", "Aug", "Sep"],
          humidity: "low" as const,
          seasonality: "Dry season optimal"
        },
        benefits: ["Expanded perspective", "Ancient wisdom access", "Mental breakthrough", "Communication skills"],
        activities: ["Machu Picchu visits", "Sacred valley exploration", "Language learning", "Cultural immersion"],
        precautions: ["Altitude sickness", "Weather preparation", "Cultural respect essential"]
      },
      {
        location: "Scottish Highlands",
        country: "Scotland",
        continent: "Europe",
        coordinates: { lat: 57.0500, lng: -4.2000 },
        climate: {
          type: "Oceanic Highland",
          temperatureRange: { min: 5, max: 18 },
          idealMonths: ["May", "Jun", "Jul", "Aug", "Sep"],
          humidity: "high" as const,
          seasonality: "Summer months preferred"
        },
        benefits: ["Mental clarity", "Poetic inspiration", "Wind element alignment", "Intellectual freedom"],
        activities: ["Highland walking", "Castle exploration", "Literary tours", "Wind sports"],
        precautions: ["Weather unpredictability", "Midges in summer", "Waterproof gear essential"]
      }
    ],
    climate: {
      idealTemperature: { min: 12, max: 22 },
      preferredHumidity: "low" as const,
      seasonPreference: ["Spring", "Early Summer"],
      avoidConditions: ["Stagnant air", "High humidity", "Extreme heat"],
      reasoning: [
        { system: "Western", explanation: "Air signs need fresh, moving air for mental clarity" },
        { system: "Western", explanation: "Higher altitudes provide the space air signs crave" },
        { system: "Western", explanation: "Cool, crisp air enhances air sign intellectual abilities" }
      ]
    }
  },
  water: {
    favorable: [
      {
        location: "Maldives",
        country: "Maldives",
        continent: "Asia",
        coordinates: { lat: 3.2028, lng: 73.2207 },
        climate: {
          type: "Tropical Monsoon",
          temperatureRange: { min: 26, max: 30 },
          idealMonths: ["Dec", "Jan", "Feb", "Mar", "Apr"],
          humidity: "high" as const,
          seasonality: "Dry season ideal"
        },
        benefits: ["Emotional healing", "Intuition enhancement", "Subconscious cleansing", "Spiritual connection"],
        activities: ["Ocean meditation", "Snorkeling", "Sunset rituals", "Water healing"],
        precautions: ["Sun exposure", "Marine life respect", "Environmental consciousness"]
      },
      {
        location: "Greek Islands",
        country: "Greece",
        continent: "Europe",
        coordinates: { lat: 36.3932, lng: 25.4615 },
        climate: {
          type: "Mediterranean",
          temperatureRange: { min: 18, max: 28 },
          idealMonths: ["May", "Jun", "Sep", "Oct"],
          humidity: "moderate" as const,
          seasonality: "Shoulder seasons optimal"
        },
        benefits: ["Emotional balance", "Creative inspiration", "Mythological connection", "Healing waters"],
        activities: ["Island hopping", "Thermal springs", "Archaeological sites", "Seaside meditation"],
        precautions: ["Tourist seasons", "Sun protection", "Cultural sensitivity"]
      },
      {
        location: "Kerala Backwaters, India",
        country: "India",
        continent: "Asia",
        coordinates: { lat: 9.4981, lng: 76.3388 },
        climate: {
          type: "Tropical Monsoon",
          temperatureRange: { min: 23, max: 32 },
          idealMonths: ["Dec", "Jan", "Feb", "Mar"],
          humidity: "high" as const,
          seasonality: "Post-monsoon ideal"
        },
        benefits: ["Deep emotional healing", "Ayurvedic treatments", "Water element balance", "Spiritual purification"],
        activities: ["Houseboat journeys", "Ayurvedic treatments", "Temple visits", "Water ceremonies"],
        precautions: ["Monsoon timing", "Health precautions", "Cultural awareness"]
      }
    ],
    climate: {
      idealTemperature: { min: 20, max: 28 },
      preferredHumidity: "moderate" as const,
      seasonPreference: ["Mild seasons", "Monsoon transitions"],
      avoidConditions: ["Extreme dryness", "Harsh winds", "Temperature extremes"],
      reasoning: [
        { system: "Western", explanation: "Water signs need moisture and gentle temperatures for emotional balance" },
        { system: "Western", explanation: "Proximity to water bodies enhances natural water element" },
        { system: "Western", explanation: "Stable, warm climates support water sign sensitivity" }
      ]
    }
  }
};

// Vedic Astrology - Dosha-based Climate Recommendations
const VEDIC_CLIMATE_PROFILES = {
  vata: {
    idealTemperature: { min: 22, max: 28 },
    preferredHumidity: "moderate" as const,
    seasonPreference: ["Late Spring", "Early Summer"],
    avoidConditions: ["Cold winds", "Dry heat", "Rapid weather changes"],
    reasoning: [
      { system: "Vedic", explanation: "Vata dosha needs warmth and stability to balance cold, dry, mobile qualities" },
      { system: "Vedic", explanation: "Consistent temperatures prevent Vata aggravation" },
      { system: "Vedic", explanation: "Moderate humidity prevents excessive dryness" }
    ]
  },
  pitta: {
    idealTemperature: { min: 18, max: 24 },
    preferredHumidity: "low" as const,
    seasonPreference: ["Autumn", "Winter", "Early Spring"],
    avoidConditions: ["Excessive heat", "High humidity", "Intense sun"],
    reasoning: [
      { system: "Vedic", explanation: "Pitta dosha requires cooling to balance fire and heat" },
      { system: "Vedic", explanation: "Low humidity prevents overheating and inflammation" },
      { system: "Vedic", explanation: "Cool seasons support Pitta's natural intensity without aggravation" }
    ]
  },
  kapha: {
    idealTemperature: { min: 25, max: 32 },
    preferredHumidity: "low" as const,
    seasonPreference: ["Late Spring", "Summer", "Early Autumn"],
    avoidConditions: ["Cold, damp weather", "High humidity", "Stagnant air"],
    reasoning: [
      { system: "Vedic", explanation: "Kapha dosha needs warmth and dryness to balance cold, wet, heavy qualities" },
      { system: "Vedic", explanation: "Dry heat helps reduce excess Kapha accumulation" },
      { system: "Vedic", explanation: "Moving air prevents stagnation that aggravates Kapha" }
    ]
  }
};

// Chinese Five Element Destination Mapping
const CHINESE_DESTINATIONS = {
  wood: {
    favorable: ["Eastern regions", "Forests", "Bamboo groves", "Spring destinations"],
    climate: { ideal: "Mild spring weather", temperature: { min: 15, max: 25 } },
    reasoning: "Wood element thrives in growth conditions with fresh energy"
  },
  fire: {
    favorable: ["Southern locations", "Desert regions", "Tropical areas", "Summer destinations"],
    climate: { ideal: "Warm, sunny weather", temperature: { min: 25, max: 35 } },
    reasoning: "Fire element needs heat and brightness to maintain vitality"
  },
  earth: {
    favorable: ["Central regions", "Plains", "Agricultural areas", "Late summer destinations"],
    climate: { ideal: "Stable, moderate weather", temperature: { min: 18, max: 26 } },
    reasoning: "Earth element prefers stability and grounding conditions"
  },
  metal: {
    favorable: ["Western regions", "Mountains", "Arid areas", "Autumn destinations"],
    climate: { ideal: "Cool, dry weather", temperature: { min: 10, max: 20 } },
    reasoning: "Metal element is refined by cool, clear conditions"
  },
  water: {
    favorable: ["Northern regions", "Coastal areas", "Lakes", "Winter destinations"],
    climate: { ideal: "Cool, humid weather", temperature: { min: 5, max: 18 } },
    reasoning: "Water element flows best in cool, moist environments"
  }
};

// Human Design Type Preferences
const HUMAN_DESIGN_ENVIRONMENTS = {
  Generator: {
    preferred: "Energizing but not overstimulating environments",
    climate: "Moderate temperatures with good air circulation",
    activities: "Sustainable, engaging experiences"
  },
  Projector: {
    preferred: "Refined, less crowded environments",
    climate: "Comfortable temperatures without extremes", 
    activities: "Quality over quantity experiences"
  },
  Manifestor: {
    preferred: "Freedom-oriented, less structured environments",
    climate: "Variable climate acceptance",
    activities: "Independent exploration options"
  },
  Reflector: {
    preferred: "Natural, less populated environments",
    climate: "Stable, gentle climates",
    activities: "Contemplative, nature-based experiences"
  }
};

// Numerology Life Path Preferences
const NUMEROLOGY_PREFERENCES = {
  1: { climate: "Dynamic, leadership-inspiring environments", temperature: "Energizing warmth" },
  2: { climate: "Harmonious, partnership-friendly environments", temperature: "Comfortable cooperation" },
  3: { climate: "Creative, expressive environments", temperature: "Inspiring conditions" },
  4: { climate: "Stable, structured environments", temperature: "Reliable consistency" },
  5: { climate: "Varied, adventure-ready environments", temperature: "Changeable acceptance" },
  6: { climate: "Nurturing, family-friendly environments", temperature: "Comfortable for all" },
  7: { climate: "Contemplative, spiritual environments", temperature: "Meditative coolness" },
  8: { climate: "Achievement-oriented environments", temperature: "Success-supporting warmth" },
  9: { climate: "Globally-conscious environments", temperature: "Universally comfortable" }
};

export class DestinationEngine {
  private profile: SystemProfile;

  constructor(profile: SystemProfile) {
    this.profile = profile;
  }

  generateDestinationRecommendations(): DestinationRecommendation[] {
    const recommendations: DestinationRecommendation[] = [];

    // Western Astrology recommendations
    if (this.profile.western) {
      const westernRecs = this.getWesternDestinations();
      recommendations.push(...westernRecs);
    }

    // Add recommendations from other systems...
    // This would continue with Vedic, Chinese, Human Design, and Numerology

    return this.synthesizeRecommendations(recommendations);
  }

  generateClimateProfile(): ClimateProfile {
    const profiles: ClimateProfile[] = [];

    // Collect climate preferences from all systems
    if (this.profile.western) {
      profiles.push(WESTERN_DESTINATIONS[this.profile.western.dominantElement].climate);
    }

    if (this.profile.vedic) {
      profiles.push(VEDIC_CLIMATE_PROFILES[this.profile.vedic.dominantDosha]);
    }

    // Synthesize all profiles into one comprehensive recommendation
    return this.synthesizeClimateProfiles(profiles);
  }

  private getWesternDestinations(): DestinationRecommendation[] {
    const element = this.profile.western?.dominantElement;
    if (!element) return [];

    const elementDestinations = WESTERN_DESTINATIONS[element];
    return elementDestinations.favorable.map(dest => ({
      ...dest,
      astrologyBasis: {
        systems: ["Western Astrology"],
        reasoning: [`${element} element alignment`, `${this.profile.western?.rulingPlanet} planetary influence`],
        confidence: 0.85
      }
    }));
  }

  private synthesizeRecommendations(recommendations: DestinationRecommendation[]): DestinationRecommendation[] {
    // Remove duplicates and rank by consensus across systems
    const uniqueDestinations = new Map<string, DestinationRecommendation>();
    
    recommendations.forEach(rec => {
      const key = `${rec.location}-${rec.country}`;
      if (uniqueDestinations.has(key)) {
        const existing = uniqueDestinations.get(key)!;
        // Merge recommendations from multiple systems
        existing.astrologyBasis.systems.push(...rec.astrologyBasis.systems);
        existing.astrologyBasis.reasoning.push(...rec.astrologyBasis.reasoning);
        existing.astrologyBasis.confidence = Math.max(existing.astrologyBasis.confidence, rec.astrologyBasis.confidence);
      } else {
        uniqueDestinations.set(key, rec);
      }
    });

    return Array.from(uniqueDestinations.values())
      .sort((a, b) => b.astrologyBasis.confidence - a.astrologyBasis.confidence);
  }

  private synthesizeClimateProfiles(profiles: ClimateProfile[]): ClimateProfile {
    if (profiles.length === 0) {
      return {
        idealTemperature: { min: 18, max: 25 },
        preferredHumidity: "moderate",
        seasonPreference: ["Spring", "Autumn"],
        avoidConditions: ["Extreme weather"],
        reasoning: [{ system: "Default", explanation: "Moderate climate suitable for most people" }]
      };
    }

    // Find overlapping temperature ranges
    const minTemp = Math.max(...profiles.map(p => p.idealTemperature.min));
    const maxTemp = Math.min(...profiles.map(p => p.idealTemperature.max));

    // Determine most common humidity preference
    const humidityPrefs = profiles.map(p => p.preferredHumidity);
    const preferredHumidity = this.getMostFrequent(humidityPrefs);

    // Combine season preferences
    const allSeasons = profiles.flatMap(p => p.seasonPreference);
    const uniqueSeasons = [...new Set(allSeasons)];

    // Combine avoidance conditions
    const allAvoidConditions = profiles.flatMap(p => p.avoidConditions);
    const uniqueAvoidConditions = [...new Set(allAvoidConditions)];

    // Combine reasoning
    const allReasoning = profiles.flatMap(p => p.reasoning);

    return {
      idealTemperature: { min: minTemp, max: maxTemp },
      preferredHumidity: preferredHumidity,
      seasonPreference: uniqueSeasons,
      avoidConditions: uniqueAvoidConditions,
      reasoning: allReasoning
    };
  }

  private getMostFrequent<T>(arr: T[]): T {
    const frequency = new Map<T, number>();
    arr.forEach(item => frequency.set(item, (frequency.get(item) || 0) + 1));
    return Array.from(frequency.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }
}

// Factory function
export function generateDestinationRecommendations(profile: SystemProfile): {
  destinations: DestinationRecommendation[];
  climateProfile: ClimateProfile;
} {
  const engine = new DestinationEngine(profile);
  return {
    destinations: engine.generateDestinationRecommendations(),
    climateProfile: engine.generateClimateProfile()
  };
}