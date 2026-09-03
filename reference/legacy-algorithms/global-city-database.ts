import { UniversalCityData } from '../client/src/lib/universal-city-finder';

export interface GeoNamesCity {
  geonameId: number;
  name: string;
  lat: string;
  lng: string;
  countryName: string;
  countryCode: string;
  adminName1: string;
  population: number;
  timezone: {
    timeZoneId: string;
    gmtOffset: number;
    dstOffset: number;
  };
}

export class GlobalCityDatabase {
  private geonamesUsername: string;
  private baseUrl = 'http://api.geonames.org';
  private cache = new Map<string, UniversalCityData[]>();

  constructor() {
    this.geonamesUsername = process.env.GEONAMES_USERNAME || '';
    if (!this.geonamesUsername) {
      console.warn('GEONAMES_USERNAME not set - using fallback city database');
    }
  }

  // Search cities worldwide with authentic GeoNames data
  async searchCitiesGlobal(query: string, maxRows = 20): Promise<UniversalCityData[]> {
    if (!this.geonamesUsername) {
      return this.getFallbackCities(query);
    }

    const cacheKey = `search_${query}_${maxRows}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const url = `${this.baseUrl}/searchJSON?q=${encodeURIComponent(query)}&maxRows=${maxRows}&username=${this.geonamesUsername}&featureClass=P&orderby=population`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`GeoNames API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status) {
        throw new Error(`GeoNames API error: ${data.status.message}`);
      }

      const cities = await Promise.all(
        data.geonames.map(async (city: any) => {
          const timezone = await this.getTimezoneInfo(city.lat, city.lng);
          return this.convertToUniversalFormat(city, timezone);
        })
      );

      this.cache.set(cacheKey, cities);
      return cities;
    } catch (error) {
      console.error('GeoNames search failed:', error);
      return this.getFallbackCities(query);
    }
  }

  // Get cities by country code
  async getCitiesByCountry(countryCode: string, maxRows = 100): Promise<UniversalCityData[]> {
    if (!this.geonamesUsername) {
      return this.getFallbackCitiesByCountry(countryCode);
    }

    const cacheKey = `country_${countryCode}_${maxRows}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const url = `${this.baseUrl}/searchJSON?country=${countryCode}&maxRows=${maxRows}&username=${this.geonamesUsername}&featureClass=P&orderby=population`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status) {
        throw new Error(`GeoNames API error: ${data.status.message}`);
      }

      const cities = await Promise.all(
        data.geonames.map(async (city: any) => {
          const timezone = await this.getTimezoneInfo(city.lat, city.lng);
          return this.convertToUniversalFormat(city, timezone);
        })
      );

      this.cache.set(cacheKey, cities);
      return cities;
    } catch (error) {
      console.error('GeoNames country search failed:', error);
      return this.getFallbackCitiesByCountry(countryCode);
    }
  }

  // Get major cities worldwide
  async getMajorCitiesWorldwide(minPopulation = 100000): Promise<UniversalCityData[]> {
    if (!this.geonamesUsername) {
      return this.getStaticMajorCities();
    }

    const cacheKey = `major_cities_${minPopulation}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const countries = ['US', 'CN', 'IN', 'JP', 'DE', 'GB', 'FR', 'IT', 'BR', 'CA', 'AU', 'RU', 'MX', 'KR', 'ES', 'TR', 'NL', 'SA', 'CH', 'BE', 'SE', 'NO', 'DK', 'FI', 'PH', 'TH', 'MY', 'SG', 'ID', 'VN', 'PK', 'BD', 'EG', 'ZA', 'NG', 'KE', 'GH', 'MA', 'TN', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'EC', 'BO', 'PY'];
      
      const allCities: UniversalCityData[] = [];
      
      for (const country of countries) {
        const cities = await this.getCitiesByCountry(country, 50);
        allCities.push(...cities.filter(city => (city.population || 0) >= minPopulation));
      }

      // Sort by population and remove duplicates
      const uniqueCities = allCities
        .filter((city, index, self) => 
          index === self.findIndex(c => c.city === city.city && c.country === city.country)
        )
        .sort((a, b) => (b.population || 0) - (a.population || 0));

      this.cache.set(cacheKey, uniqueCities);
      return uniqueCities;
    } catch (error) {
      console.error('Major cities worldwide failed:', error);
      return this.getStaticMajorCities();
    }
  }

  private async getTimezoneInfo(lat: string, lng: string): Promise<any> {
    if (!this.geonamesUsername) {
      return { timeZoneId: 'UTC', gmtOffset: 0, dstOffset: 0 };
    }

    try {
      const url = `${this.baseUrl}/timezoneJSON?lat=${lat}&lng=${lng}&username=${this.geonamesUsername}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status) {
        return { timeZoneId: 'UTC', gmtOffset: 0, dstOffset: 0 };
      }
      
      return data;
    } catch (error) {
      return { timeZoneId: 'UTC', gmtOffset: 0, dstOffset: 0 };
    }
  }

  private convertToUniversalFormat(geoCity: any, timezone: any): UniversalCityData {
    return {
      city: geoCity.name,
      country: geoCity.countryName,
      region: this.getRegionFromCountry(geoCity.countryCode),
      timezone: timezone.timeZoneId,
      utcOffset: timezone.gmtOffset,
      dstOffset: timezone.dstOffset,
      latitude: parseFloat(geoCity.lat),
      longitude: parseFloat(geoCity.lng),
      population: geoCity.population || 0
    };
  }

  private getRegionFromCountry(countryCode: string): string {
    const regions: { [key: string]: string } = {
      'US': 'North America', 'CA': 'North America', 'MX': 'North America',
      'CN': 'Asia', 'JP': 'Asia', 'IN': 'Asia', 'KR': 'Asia', 'TH': 'Asia', 'VN': 'Asia', 'MY': 'Asia', 'SG': 'Asia', 'ID': 'Asia', 'PH': 'Asia', 'PK': 'Asia', 'BD': 'Asia',
      'GB': 'Europe', 'FR': 'Europe', 'DE': 'Europe', 'IT': 'Europe', 'ES': 'Europe', 'NL': 'Europe', 'BE': 'Europe', 'CH': 'Europe', 'SE': 'Europe', 'NO': 'Europe', 'DK': 'Europe', 'FI': 'Europe', 'RU': 'Europe',
      'AU': 'Oceania', 'NZ': 'Oceania',
      'BR': 'South America', 'AR': 'South America', 'CL': 'South America', 'CO': 'South America', 'PE': 'South America', 'VE': 'South America', 'UY': 'South America', 'EC': 'South America', 'BO': 'South America', 'PY': 'South America',
      'EG': 'Africa', 'ZA': 'Africa', 'NG': 'Africa', 'KE': 'Africa', 'GH': 'Africa', 'MA': 'Africa', 'TN': 'Africa'
    };
    return regions[countryCode] || 'Unknown';
  }

  private getFallbackCities(query: string): UniversalCityData[] {
    // Use existing static database as fallback
    const staticCities = this.getStaticMajorCities();
    const normalizedQuery = query.toLowerCase();
    
    return staticCities.filter(city => 
      city.city.toLowerCase().includes(normalizedQuery) ||
      city.country.toLowerCase().includes(normalizedQuery)
    ).slice(0, 20);
  }

  private getFallbackCitiesByCountry(countryCode: string): UniversalCityData[] {
    const countryNames: { [key: string]: string } = {
      'US': 'United States', 'CN': 'China', 'IN': 'India', 'JP': 'Japan',
      'DE': 'Germany', 'GB': 'United Kingdom', 'FR': 'France', 'IT': 'Italy',
      'BR': 'Brazil', 'CA': 'Canada', 'AU': 'Australia', 'RU': 'Russia',
      'MX': 'Mexico', 'KR': 'South Korea', 'ES': 'Spain', 'PH': 'Philippines'
    };
    
    const countryName = countryNames[countryCode];
    if (!countryName) return [];

    return this.getStaticMajorCities().filter(city => 
      city.country === countryName
    );
  }

  private getStaticMajorCities(): UniversalCityData[] {
    return [
      // Comprehensive global coverage - major cities from each continent
      { city: "Tokyo", country: "Japan", region: "Asia", timezone: "Asia/Tokyo", utcOffset: 9, latitude: 35.6762, longitude: 139.6503, population: 37400068 },
      { city: "Delhi", country: "India", region: "Asia", timezone: "Asia/Kolkata", utcOffset: 5.5, latitude: 28.7041, longitude: 77.1025, population: 28514000 },
      { city: "Shanghai", country: "China", region: "Asia", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 31.2304, longitude: 121.4737, population: 24256800 },
      { city: "São Paulo", country: "Brazil", region: "South America", timezone: "America/Sao_Paulo", utcOffset: -3, latitude: -23.5505, longitude: -46.6333, population: 21650000 },
      { city: "Mexico City", country: "Mexico", region: "North America", timezone: "America/Mexico_City", utcOffset: -6, latitude: 19.4326, longitude: -99.1332, population: 21581000 },
      { city: "Cairo", country: "Egypt", region: "Africa", timezone: "Africa/Cairo", utcOffset: 2, latitude: 30.0444, longitude: 31.2357, population: 20076000 },
      { city: "Mumbai", country: "India", region: "Asia", timezone: "Asia/Kolkata", utcOffset: 5.5, latitude: 19.0760, longitude: 72.8777, population: 19980000 },
      { city: "Beijing", country: "China", region: "Asia", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 39.9042, longitude: 116.4074, population: 19612000 },
      { city: "Dhaka", country: "Bangladesh", region: "Asia", timezone: "Asia/Dhaka", utcOffset: 6, latitude: 23.8103, longitude: 90.4125, population: 19578000 },
      { city: "Osaka", country: "Japan", region: "Asia", timezone: "Asia/Tokyo", utcOffset: 9, latitude: 34.6937, longitude: 135.5023, population: 19281000 },
      
      // Major European cities
      { city: "London", country: "United Kingdom", region: "Europe", timezone: "Europe/London", utcOffset: 0, latitude: 51.5074, longitude: -0.1278, population: 9648110 },
      { city: "Paris", country: "France", region: "Europe", timezone: "Europe/Paris", utcOffset: 1, latitude: 48.8566, longitude: 2.3522, population: 11017000 },
      { city: "Berlin", country: "Germany", region: "Europe", timezone: "Europe/Berlin", utcOffset: 1, latitude: 52.5200, longitude: 13.4050, population: 6144600 },
      { city: "Madrid", country: "Spain", region: "Europe", timezone: "Europe/Madrid", utcOffset: 1, latitude: 40.4168, longitude: -3.7038, population: 6642000 },
      { city: "Rome", country: "Italy", region: "Europe", timezone: "Europe/Rome", utcOffset: 1, latitude: 41.9028, longitude: 12.4964, population: 4342000 },
      { city: "Amsterdam", country: "Netherlands", region: "Europe", timezone: "Europe/Amsterdam", utcOffset: 1, latitude: 52.3676, longitude: 4.9041, population: 2431000 },
      
      // North American cities
      { city: "New York", country: "United States", region: "North America", timezone: "America/New_York", utcOffset: -5, latitude: 40.7128, longitude: -74.0060, population: 18823000 },
      { city: "Los Angeles", country: "United States", region: "North America", timezone: "America/Los_Angeles", utcOffset: -8, latitude: 34.0522, longitude: -118.2437, population: 12488000 },
      { city: "Chicago", country: "United States", region: "North America", timezone: "America/Chicago", utcOffset: -6, latitude: 41.8781, longitude: -87.6298, population: 8608000 },
      { city: "Toronto", country: "Canada", region: "North America", timezone: "America/Toronto", utcOffset: -5, latitude: 43.6532, longitude: -79.3832, population: 6417000 },
      
      // Southeast Asian cities
      { city: "Manila", country: "Philippines", region: "Asia", timezone: "Asia/Manila", utcOffset: 8, latitude: 14.5995, longitude: 120.9842, population: 13923000 },
      { city: "Bangkok", country: "Thailand", region: "Asia", timezone: "Asia/Bangkok", utcOffset: 7, latitude: 13.7563, longitude: 100.5018, population: 10156000 },
      { city: "Ho Chi Minh City", country: "Vietnam", region: "Asia", timezone: "Asia/Ho_Chi_Minh", utcOffset: 7, latitude: 10.8231, longitude: 106.6297, population: 8993000 },
      { city: "Singapore", country: "Singapore", region: "Asia", timezone: "Asia/Singapore", utcOffset: 8, latitude: 1.3521, longitude: 103.8198, population: 5896000 },
      { city: "Kuala Lumpur", country: "Malaysia", region: "Asia", timezone: "Asia/Kuala_Lumpur", utcOffset: 8, latitude: 3.1390, longitude: 101.6869, population: 7996000 },
      
      // South American cities
      { city: "Buenos Aires", country: "Argentina", region: "South America", timezone: "America/Argentina/Buenos_Aires", utcOffset: -3, latitude: -34.6118, longitude: -58.3960, population: 15154000 },
      { city: "Rio de Janeiro", country: "Brazil", region: "South America", timezone: "America/Sao_Paulo", utcOffset: -3, latitude: -22.9068, longitude: -43.1729, population: 13458000 },
      { city: "Lima", country: "Peru", region: "South America", timezone: "America/Lima", utcOffset: -5, latitude: -12.0464, longitude: -77.0428, population: 10719000 },
      
      // African cities
      { city: "Lagos", country: "Nigeria", region: "Africa", timezone: "Africa/Lagos", utcOffset: 1, latitude: 6.5244, longitude: 3.3792, population: 15388000 },
      { city: "Kinshasa", country: "Democratic Republic of Congo", region: "Africa", timezone: "Africa/Kinshasa", utcOffset: 1, latitude: -4.4419, longitude: 15.2663, population: 14342000 },
      { city: "Johannesburg", country: "South Africa", region: "Africa", timezone: "Africa/Johannesburg", utcOffset: 2, latitude: -26.2041, longitude: 28.0473, population: 9616000 },
      
      // Oceania
      { city: "Sydney", country: "Australia", region: "Oceania", timezone: "Australia/Sydney", utcOffset: 10, latitude: -33.8688, longitude: 151.2093, population: 5312000 },
      { city: "Melbourne", country: "Australia", region: "Oceania", timezone: "Australia/Melbourne", utcOffset: 10, latitude: -37.8136, longitude: 144.9631, population: 4968000 }
    ];
  }

  // Get database statistics
  async getGlobalStats(): Promise<any> {
    const majorCities = await this.getMajorCitiesWorldwide();
    const regions = new Set(majorCities.map(c => c.region));
    const countries = new Set(majorCities.map(c => c.country));

    return {
      totalCities: majorCities.length,
      totalCountries: countries.size,
      totalRegions: regions.size,
      apiStatus: this.geonamesUsername ? 'Connected' : 'Fallback Mode',
      coverage: 'Global - All Continents'
    };
  }
}

export const globalCityDatabase = new GlobalCityDatabase();