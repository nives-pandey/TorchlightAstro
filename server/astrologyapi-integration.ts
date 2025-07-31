// AstrologyAPI.com Integration - Swiss Ephemeris calculations
// Professional astrology API with comprehensive features
// Documentation: https://astrologyapi.com/docs/api-ref

interface AstrologyAPIBirthData {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
}

interface AstrologyAPIPlanetPosition {
  id: number;
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: string;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  nakshatra_pad: number;
  house: number;
  is_planet_set: boolean;
  planet_awastha: string;
}

interface AstrologyAPIHousePosition {
  house: number;
  degree: number;
  sign: string;
  signLord: string;
}

interface AstrologyAPIAspect {
  aspecting_planet: string;
  aspected_planet: string;
  type: string;
  orb: number;
  aspect_degree: number;
}

class AstrologyAPIIntegration {
  private baseUrl = 'https://json.astrologyapi.com/v1';
  private userId: string | null = null;
  private apiKey: string | null = null;

  constructor() {
    // Check for credentials in environment
    this.userId = process.env.ASTROLOGY_API_USER_ID || null;
    this.apiKey = process.env.ASTROLOGY_API_KEY || null;
    console.log(`🔑 AstrologyAPI Credentials: ${this.userId && this.apiKey ? '✅ Available' : '❌ Missing'}`);
  }

  private convertBirthData(birthDate: string, birthTime: string, latitude: number, longitude: number, timezone: string): AstrologyAPIBirthData {
    const date = new Date(birthDate);
    const [hours, minutes] = birthTime.split(':').map(Number);
    
    // Convert timezone string to numeric offset
    const timezoneOffset = this.getTimezoneOffset(timezone);

    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      hour: hours,
      min: minutes,
      lat: latitude,
      lon: longitude,
      tzone: timezoneOffset
    };
  }

  private getTimezoneOffset(timezone: string): number {
    // Convert timezone name to numeric offset
    const timezoneMap: Record<string, number> = {
      'Asia/Kolkata': 5.5,
      'America/New_York': -5,
      'Europe/London': 0,
      'Asia/Tokyo': 9,
      'Australia/Sydney': 11,
      'America/Los_Angeles': -8,
      'America/Chicago': -6,
      'Europe/Paris': 1,
      'Asia/Shanghai': 8
    };
    return timezoneMap[timezone] || 0;
  }

  private async makeRequest(endpoint: string, data: AstrologyAPIBirthData): Promise<any> {
    if (!this.userId || !this.apiKey) {
      throw new Error('AstrologyAPI credentials not configured. Please set ASTROLOGY_API_USER_ID and ASTROLOGY_API_KEY environment variables.');
    }

    const auth = Buffer.from(`${this.userId}:${this.apiKey}`).toString('base64');
    
    console.log(`🌐 AstrologyAPI Request: ${endpoint}`);

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AstrologyAPI request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`AstrologyAPI error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get planetary positions
  async getPlanets(birthDate: string, birthTime: string, latitude: number, longitude: number, timezone: string): Promise<AstrologyAPIPlanetPosition[]> {
    const data = this.convertBirthData(birthDate, birthTime, latitude, longitude, timezone);
    return this.makeRequest('planets', data);
  }

  // Get house cusps
  async getHouses(birthDate: string, birthTime: string, latitude: number, longitude: number, timezone: string): Promise<AstrologyAPIHousePosition[]> {
    const data = this.convertBirthData(birthDate, birthTime, latitude, longitude, timezone);
    return this.makeRequest('houses', data);
  }

  // Get planetary aspects
  async getAspects(birthDate: string, birthTime: string, latitude: number, longitude: number, timezone: string): Promise<AstrologyAPIAspect[]> {
    const data = this.convertBirthData(birthDate, birthTime, latitude, longitude, timezone);
    return this.makeRequest('aspects', data);
  }

  // Get Vedic planetary positions
  async getVedicPlanets(birthDate: string, birthTime: string, latitude: number, longitude: number, timezone: string): Promise<any> {
    const data = this.convertBirthData(birthDate, birthTime, latitude, longitude, timezone);
    return this.makeRequest('planets', data); // Same endpoint, different interpretation
  }

  // Get basic Panchang
  async getBasicPanchang(birthDate: string, birthTime: string, latitude: number, longitude: number, timezone: string): Promise<any> {
    const data = this.convertBirthData(birthDate, birthTime, latitude, longitude, timezone);
    return this.makeRequest('basic_panchang', data);
  }

  // Test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      // Test with sample data
      const testData: AstrologyAPIBirthData = {
        day: 15,
        month: 7,
        year: 1990,
        hour: 14,
        min: 30,
        lat: 28.6139,
        lon: 77.2090,
        tzone: 5.5
      };
      
      await this.makeRequest('planets', testData);
      return true;
    } catch (error) {
      console.error('AstrologyAPI test failed:', error);
      return false;
    }
  }
}

export { AstrologyAPIIntegration };
export type { AstrologyAPIBirthData, AstrologyAPIPlanetPosition, AstrologyAPIHousePosition, AstrologyAPIAspect };