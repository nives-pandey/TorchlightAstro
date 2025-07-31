// Prokerala Astrology API Integration - Swiss Ephemeris calculations
// Free tier: 5,000 API calls/month
// Documentation: https://api.prokerala.com/

interface ProkeralaBirthData {
  datetime: string; // ISO format: 2025-01-31T14:30:00+05:30
  coordinates: string; // "latitude,longitude"
}

interface ProkeralaPlanetPosition {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  speed: number;
  is_retrograde: boolean;
  sign: {
    id: number;
    name: string;
    lord: string;
  };
  nakshatra: {
    id: number;
    name: string;
    lord: string;
    pada: number;
  };
  house: number;
}

interface ProkeralaHousePosition {
  id: number;
  degree: number;
  sign: {
    id: number;
    name: string;
    lord: string;
  };
}

interface ProkeralaResponse {
  status: 'success' | 'error';
  data?: {
    planets?: ProkeralaPlanetPosition[];
    houses?: ProkeralaHousePosition[];
    ascendant?: {
      sign: string;
      degree: number;
      lord: string;
    };
  };
  errors?: Array<{
    title: string;
    detail: string;
  }>;
}

class ProkeralaAPI {
  private baseUrl = 'https://api.prokerala.com/v2/astrology';
  private apiKey: string | null = null;

  constructor() {
    // Check for API key in environment
    this.apiKey = process.env.PROKERALA_API_KEY || null;
    console.log(`🔑 Prokerala API Key: ${this.apiKey ? '✅ Available' : '❌ Missing'}`);
  }

  private formatDateTime(birthDate: string, birthTime: string, timezone: string): string {
    // Convert to ISO format with timezone
    return `${birthDate}T${birthTime}:00${this.getTimezoneOffset(timezone)}`;
  }

  private getTimezoneOffset(timezone: string): string {
    // Convert timezone name to offset (simplified)
    const timezoneMap: Record<string, string> = {
      'Asia/Kolkata': '+05:30',
      'America/New_York': '-05:00',
      'Europe/London': '+00:00',
      'Asia/Tokyo': '+09:00',
      'Australia/Sydney': '+11:00',
      'America/Los_Angeles': '-08:00'
    };
    return timezoneMap[timezone] || '+00:00';
  }

  private async makeRequest(endpoint: string, params: Record<string, string>): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Prokerala API key not configured. Please set PROKERALA_API_KEY environment variable.');
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    console.log(`🌐 Prokerala API Request: ${endpoint}`);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Prokerala API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status === 'error') {
        throw new Error(`Prokerala API error: ${result.errors?.[0]?.detail || 'Unknown error'}`);
      }

      return result;
    } catch (error) {
      console.error(`Prokerala API error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Birth Chart with planetary positions
  async getBirthChart(birthDate: string, birthTime: string, latitude: number, longitude: number, timezone: string): Promise<any> {
    const datetime = this.formatDateTime(birthDate, birthTime, timezone);
    const coordinates = `${latitude},${longitude}`;

    return this.makeRequest('/birth-chart', {
      datetime,
      coordinates,
      chart_type: 'rasi',
      chart_style: 'north-indian'
    });
  }

  // Planetary positions
  async getPlanets(birthDate: string, birthTime: string, latitude: number, longitude: number, timezone: string): Promise<any> {
    const datetime = this.formatDateTime(birthDate, birthTime, timezone);
    const coordinates = `${latitude},${longitude}`;

    return this.makeRequest('/planets', {
      datetime,
      coordinates
    });
  }

  // House cusps
  async getHouses(birthDate: string, birthTime: string, latitude: number, longitude: number, timezone: string): Promise<any> {
    const datetime = this.formatDateTime(birthDate, birthTime, timezone);
    const coordinates = `${latitude},${longitude}`;

    return this.makeRequest('/houses', {
      datetime,
      coordinates,
      house_type: 'placidus'
    });
  }

  // Daily Panchang
  async getPanchang(birthDate: string, latitude: number, longitude: number, timezone: string): Promise<any> {
    const coordinates = `${latitude},${longitude}`;

    return this.makeRequest('/panchang', {
      date: birthDate,
      coordinates
    });
  }

  // Test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      // Test with sample data
      await this.makeRequest('/panchang', {
        date: '2025-01-31',
        coordinates: '28.6139,77.2090'
      });
      return true;
    } catch (error) {
      console.error('Prokerala API test failed:', error);
      return false;
    }
  }
}

export { ProkeralaAPI };
export type { ProkeralaBirthData, ProkeralaPlanetPosition, ProkeralaHousePosition, ProkeralaResponse };