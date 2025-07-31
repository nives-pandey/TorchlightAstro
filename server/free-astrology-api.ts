// Free Astrology API Integration for authentic astrological calculations
// Documentation: http://freeastrologyapi.com/

interface BirthData {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
}

interface PlanetPosition {
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: string;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  house: number;
  relative_position: string;
}

interface HousePosition {
  house: number;
  sign: string;
  degree: number;
  signLord: string;
}

interface AstrologyResponse {
  planets?: PlanetPosition[];
  houses?: HousePosition[];
  ascendant?: {
    sign: string;
    degree: number;
    signLord: string;
  };
}

class FreeAstrologyAPI {
  private baseUrl = 'https://json.freeastrologyapi.com';
  private apiKey: string | null = null;

  constructor() {
    // Check for API key in environment
    this.apiKey = process.env.FREE_ASTROLOGY_API_KEY || null;
  }

  private async makeRequest(endpoint: string, data: BirthData): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add API key if available
    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`FreeAstrologyAPI error for ${endpoint}:`, error);
      throw error;
    }
  }

  async getPlanetPositions(birthData: BirthData): Promise<PlanetPosition[]> {
    try {
      const response = await this.makeRequest('/planets', birthData);
      return response.planets || [];
    } catch (error) {
      console.error('Error fetching planet positions:', error);
      return [];
    }
  }

  async getVedicChart(birthData: BirthData): Promise<any> {
    try {
      const response = await this.makeRequest('/birth-chart-info', birthData);
      return response;
    } catch (error) {
      console.error('Error fetching Vedic chart:', error);
      return null;
    }
  }

  async getNavamsaChart(birthData: BirthData): Promise<any> {
    try {
      const response = await this.makeRequest('/navamsa-chart-info', birthData);
      return response;
    } catch (error) {
      console.error('Error fetching Navamsa chart:', error);
      return null;
    }
  }

  async getPanchang(birthData: BirthData): Promise<any> {
    try {
      const response = await this.makeRequest('/panchang', birthData);
      return response;
    } catch (error) {
      console.error('Error fetching Panchang:', error);
      return null;
    }
  }

  async getWesternChart(birthData: BirthData): Promise<any> {
    try {
      const response = await this.makeRequest('/western-chart', birthData);
      return response;
    } catch (error) {
      console.error('Error fetching Western chart:', error);
      return null;
    }
  }

  async getHouses(birthData: BirthData): Promise<HousePosition[]> {
    try {
      const response = await this.makeRequest('/houses', birthData);
      return response.houses || [];
    } catch (error) {
      console.error('Error fetching houses:', error);
      return [];
    }
  }

  async getAspects(birthData: BirthData): Promise<any> {
    try {
      const response = await this.makeRequest('/aspects', birthData);
      return response.aspects || [];
    } catch (error) {
      console.error('Error fetching aspects:', error);
      return [];
    }
  }

  async getExtendedPlanetPositions(birthData: BirthData): Promise<AstrologyResponse> {
    try {
      const response = await this.makeRequest('/planets/extended', birthData);
      return response;
    } catch (error) {
      console.error('Error fetching extended planet positions:', error);
      return {};
    }
  }

  async getHousePositions(birthData: BirthData): Promise<HousePosition[]> {
    try {
      const response = await this.makeRequest('/houses/placidus', birthData);
      return response.houses || [];
    } catch (error) {
      console.error('Error fetching house positions:', error);
      return [];
    }
  }

  async getAscendant(birthData: BirthData): Promise<any> {
    try {
      const response = await this.makeRequest('/ascendant', birthData);
      return response;
    } catch (error) {
      console.error('Error fetching ascendant:', error);
      return null;
    }
  }

  async getNatalChart(birthData: BirthData): Promise<{
    planets: PlanetPosition[];
    houses: HousePosition[];
    ascendant: any;
    extended: AstrologyResponse;
  }> {
    try {
      // Make parallel requests for efficiency
      const [planets, houses, ascendant, extended] = await Promise.all([
        this.getPlanetPositions(birthData),
        this.getHousePositions(birthData),
        this.getAscendant(birthData),
        this.getExtendedPlanetPositions(birthData)
      ]);

      return {
        planets,
        houses,
        ascendant,
        extended
      };
    } catch (error) {
      console.error('Error generating natal chart:', error);
      throw error;
    }
  }

  // Convert birth data format from our app to FreeAstrologyAPI format
  convertBirthData(birthInfo: any): BirthData {
    const birthDate = new Date(birthInfo.birthDate);
    const [hours, minutes] = birthInfo.birthTime.split(':').map(Number);
    
    // Include birth location details for comprehensive analysis
    const birthLocation = {
      city: birthInfo.city || birthInfo.birthCity || 'Unknown',
      country: birthInfo.country || birthInfo.birthCountry || 'Unknown',
      coordinates: {
        lat: parseFloat(birthInfo.latitude) || 0,
        lon: parseFloat(birthInfo.longitude) || 0
      }
    };
    
    console.log(`🌍 Birth Location Integration: ${birthLocation.city}, ${birthLocation.country} (${birthLocation.coordinates.lat}, ${birthLocation.coordinates.lon})`);
    
    return {
      day: birthDate.getDate(),
      month: birthDate.getMonth() + 1,
      year: birthDate.getFullYear(),
      hour: hours,
      min: minutes,
      lat: birthLocation.coordinates.lat,
      lon: birthLocation.coordinates.lon,
      tzone: parseFloat(birthInfo.timezone) || 0
    };
  }

  // Enhanced chart analysis with Western astrology interpretation
  analyzeChart(chartData: {
    planets: PlanetPosition[];
    houses: HousePosition[];
    ascendant: any;
  }): {
    sunSign: string;
    moonSign: string;
    risingSign: string;
    dominantElement: string;
    chartRuler: string;
    majorAspects: string[];
    stelliums: string[];
    analysis: string;
  } {
    const planets = chartData.planets || [];
    const ascendant = chartData.ascendant;

    // Find key planets
    const sun = planets.find(p => p.name.toLowerCase() === 'sun');
    const moon = planets.find(p => p.name.toLowerCase() === 'moon');
    
    // Calculate element distribution
    const elementCount = { fire: 0, earth: 0, air: 0, water: 0 };
    const fireSignsArray = ['Aries', 'Leo', 'Sagittarius'];
    const earthSignsArray = ['Taurus', 'Virgo', 'Capricorn'];
    const airSignsArray = ['Gemini', 'Libra', 'Aquarius'];
    const waterSignsArray = ['Cancer', 'Scorpio', 'Pisces'];

    planets.forEach(planet => {
      if (fireSignsArray.includes(planet.sign)) elementCount.fire++;
      else if (earthSignsArray.includes(planet.sign)) elementCount.earth++;
      else if (airSignsArray.includes(planet.sign)) elementCount.air++;
      else if (waterSignsArray.includes(planet.sign)) elementCount.water++;
    });

    const dominantElement = Object.entries(elementCount)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Find stelliums (3+ planets in same sign)
    const signCount: Record<string, string[]> = {};
    planets.forEach(planet => {
      if (!signCount[planet.sign]) signCount[planet.sign] = [];
      signCount[planet.sign].push(planet.name);
    });

    const stelliums = Object.entries(signCount)
      .filter(([, planetNames]) => planetNames.length >= 3)
      .map(([sign, planetNames]) => `${sign} (${planetNames.join(', ')})`);

    // Generate basic analysis
    const analysis = this.generateBasicAnalysis({
      sunSign: sun?.sign || 'Unknown',
      moonSign: moon?.sign || 'Unknown',
      risingSign: ascendant?.sign || 'Unknown',
      dominantElement,
      stelliums
    });

    return {
      sunSign: sun?.sign || 'Unknown',
      moonSign: moon?.sign || 'Unknown',
      risingSign: ascendant?.sign || 'Unknown',
      dominantElement,
      chartRuler: this.getChartRuler(ascendant?.sign || 'Unknown'),
      majorAspects: [], // TODO: Calculate aspects
      stelliums,
      analysis
    };
  }

  private getChartRuler(risingSign: string): string {
    const rulers: Record<string, string> = {
      'Aries': 'Mars',
      'Taurus': 'Venus',
      'Gemini': 'Mercury',
      'Cancer': 'Moon',
      'Leo': 'Sun',
      'Virgo': 'Mercury',
      'Libra': 'Venus',
      'Scorpio': 'Mars/Pluto',
      'Sagittarius': 'Jupiter',
      'Capricorn': 'Saturn',
      'Aquarius': 'Saturn/Uranus',
      'Pisces': 'Jupiter/Neptune'
    };
    return rulers[risingSign] || 'Unknown';
  }

  private generateBasicAnalysis(data: {
    sunSign: string;
    moonSign: string;
    risingSign: string;
    dominantElement: string;
    stelliums: string[];
  }): string {
    const elementTraits: Record<string, string> = {
      fire: 'energetic, enthusiastic, and action-oriented',
      earth: 'practical, grounded, and methodical',
      air: 'intellectual, communicative, and social',
      water: 'emotional, intuitive, and empathetic'
    };

    let analysis = `This chart shows a ${data.sunSign} Sun with ${data.moonSign} Moon and ${data.risingSign} Rising. `;
    analysis += `The dominant element is ${data.dominantElement}, indicating a personality that is ${elementTraits[data.dominantElement] || 'balanced'}. `;
    
    if (data.stelliums.length > 0) {
      analysis += `Notable stelliums in ${data.stelliums.join(' and ')} suggest concentrated energy in these areas. `;
    }

    return analysis;
  }

  // Vedic astrology calculations
  async getVedicChart(birthData: BirthData): Promise<any> {
    try {
      const response = await this.makeRequest('/planets/tropical', birthData);
      return response;
    } catch (error) {
      console.error('Error fetching Vedic chart:', error);
      return null;
    }
  }

  // Planetary hours calculation
  async getPlanetaryHours(birthData: BirthData): Promise<any> {
    try {
      // FreeAstrologyAPI doesn't have planetary hours, but we can calculate from sunrise/sunset
      const response = await this.makeRequest('/sun_timing', birthData);
      return response;
    } catch (error) {
      console.error('Error fetching sun timing:', error);
      return null;
    }
  }
}

export const freeAstrologyAPI = new FreeAstrologyAPI();
export type { BirthData, PlanetPosition, HousePosition, AstrologyResponse };