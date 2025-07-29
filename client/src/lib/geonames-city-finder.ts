/**
 * Enhanced GeoNames API-based City Finder
 * Provides real-time global city search with 11+ million placenames
 * Superior to static databases with live data and comprehensive coverage
 */

export interface GeoNamesCityData {
  city: string;
  country: string;
  region: string;
  timezone: string;
  utcOffset: number;
  latitude: number;
  longitude: number;
  population: number;
  countryCode: string;
  adminName1?: string; // State/Province
  adminName2?: string; // County/District
  geonameId: number;
}

export interface GeoNamesTimezone {
  timezoneId: string;
  gmtOffset: number;
  dstOffset: number;
  rawOffset: number;
}

class GeoNamesCityFinder {
  private readonly baseUrl = 'http://api.geonames.org';
  private readonly username = 'torchlight_app'; // Need to register this
  private cache = new Map<string, GeoNamesCityData[]>();
  private timezoneCache = new Map<string, GeoNamesTimezone>();

  /**
   * Search cities globally with fuzzy matching
   */
  async searchCities(query: string, maxResults: number = 10): Promise<GeoNamesCityData[]> {
    const cacheKey = `${query.toLowerCase()}_${maxResults}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const url = `${this.baseUrl}/searchJSON?q=${encodeURIComponent(query)}&maxRows=${maxResults}&featureClass=P&orderby=population&username=${this.username}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`GeoNames API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status) {
        throw new Error(`GeoNames error: ${data.status.message}`);
      }

      const cities: GeoNamesCityData[] = (data.geonames || []).map((item: any) => ({
        city: item.name,
        country: item.countryName,
        region: this.getRegionFromCountry(item.countryCode),
        timezone: item.timezone?.timeZoneId || 'UTC',
        utcOffset: item.timezone?.gmtOffset || 0,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lng),
        population: item.population || 0,
        countryCode: item.countryCode,
        adminName1: item.adminName1,
        adminName2: item.adminName2,
        geonameId: item.geonameId
      }));

      this.cache.set(cacheKey, cities);
      return cities;
    } catch (error) {
      console.warn('GeoNames API unavailable, falling back to static data:', error);
      return this.fallbackSearch(query, maxResults);
    }
  }

  /**
   * Get timezone information by coordinates
   */
  async getTimezone(lat: number, lng: number): Promise<GeoNamesTimezone | null> {
    const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
    
    if (this.timezoneCache.has(cacheKey)) {
      return this.timezoneCache.get(cacheKey)!;
    }

    try {
      const url = `${this.baseUrl}/timezoneJSON?lat=${lat}&lng=${lng}&username=${this.username}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`GeoNames timezone API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status) {
        throw new Error(`GeoNames timezone error: ${data.status.message}`);
      }

      const timezone: GeoNamesTimezone = {
        timezoneId: data.timezoneId,
        gmtOffset: data.gmtOffset,
        dstOffset: data.dstOffset,
        rawOffset: data.rawOffset
      };

      this.timezoneCache.set(cacheKey, timezone);
      return timezone;
    } catch (error) {
      console.warn('GeoNames timezone API unavailable:', error);
      return null;
    }
  }

  /**
   * Search for cities in a specific country
   */
  async searchCitiesInCountry(country: string, maxResults: number = 20): Promise<GeoNamesCityData[]> {
    try {
      const url = `${this.baseUrl}/searchJSON?country=${encodeURIComponent(country)}&featureClass=P&orderby=population&maxRows=${maxResults}&username=${this.username}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`GeoNames API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status) {
        throw new Error(`GeoNames error: ${data.status.message}`);
      }

      return (data.geonames || []).map((item: any) => ({
        city: item.name,
        country: item.countryName,
        region: this.getRegionFromCountry(item.countryCode),
        timezone: item.timezone?.timeZoneId || 'UTC',
        utcOffset: item.timezone?.gmtOffset || 0,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lng),
        population: item.population || 0,
        countryCode: item.countryCode,
        adminName1: item.adminName1,
        adminName2: item.adminName2,
        geonameId: item.geonameId
      }));
    } catch (error) {
      console.warn('GeoNames country search unavailable:', error);
      return [];
    }
  }

  /**
   * Get country information
   */
  async getCountryInfo(countryCode: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/countryInfoJSON?country=${countryCode}&username=${this.username}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`GeoNames API error: ${response.status}`);
      }

      const data = await response.json();
      return data.geonames?.[0] || null;
    } catch (error) {
      console.warn('GeoNames country info unavailable:', error);
      return null;
    }
  }

  /**
   * Enhanced search with smart matching
   */
  async smartSearch(query: string): Promise<GeoNamesCityData[]> {
    const results = await this.searchCities(query, 15);
    
    // If direct search returns few results, try variations
    if (results.length < 5) {
      const variations = [
        `${query} city`,
        `${query} town`,
        query.split(' ')[0], // First word only
      ];
      
      for (const variation of variations) {
        if (variation !== query) {
          const additionalResults = await this.searchCities(variation, 10);
          results.push(...additionalResults.filter(city => 
            !results.some(existing => 
              existing.geonameId === city.geonameId
            )
          ));
        }
      }
    }

    // Sort by population (more relevant cities first)
    return results.sort((a, b) => b.population - a.population);
  }

  private getRegionFromCountry(countryCode: string): string {
    const regions: Record<string, string> = {
      // Asia
      'IN': 'Asia', 'CN': 'Asia', 'JP': 'Asia', 'KR': 'Asia', 'TH': 'Asia', 'VN': 'Asia',
      'PH': 'Asia', 'ID': 'Asia', 'MY': 'Asia', 'SG': 'Asia', 'BD': 'Asia', 'PK': 'Asia',
      // Europe
      'GB': 'Europe', 'FR': 'Europe', 'DE': 'Europe', 'IT': 'Europe', 'ES': 'Europe', 'NL': 'Europe',
      'BE': 'Europe', 'CH': 'Europe', 'AT': 'Europe', 'SE': 'Europe', 'NO': 'Europe', 'DK': 'Europe',
      // North America
      'US': 'North America', 'CA': 'North America', 'MX': 'North America',
      // South America
      'BR': 'South America', 'AR': 'South America', 'CL': 'South America', 'CO': 'South America',
      // Africa
      'ZA': 'Africa', 'NG': 'Africa', 'EG': 'Africa', 'KE': 'Africa', 'MA': 'Africa',
      // Oceania
      'AU': 'Oceania', 'NZ': 'Oceania'
    };
    
    return regions[countryCode] || 'Other';
  }

  /**
   * Fallback to static data when API is unavailable
   */
  private fallbackSearch(query: string, maxResults: number): GeoNamesCityData[] {
    // Import static data as fallback
    const staticCities: GeoNamesCityData[] = [
      // Major global cities as fallback
      { city: "London", country: "United Kingdom", region: "Europe", timezone: "Europe/London", utcOffset: 0, latitude: 51.5074, longitude: -0.1278, population: 9000000, countryCode: "GB", geonameId: 2643743 },
      { city: "New York", country: "United States", region: "North America", timezone: "America/New_York", utcOffset: -5, latitude: 40.7128, longitude: -74.0060, population: 8400000, countryCode: "US", geonameId: 5128581 },
      { city: "Tokyo", country: "Japan", region: "Asia", timezone: "Asia/Tokyo", utcOffset: 9, latitude: 35.6762, longitude: 139.6503, population: 14000000, countryCode: "JP", geonameId: 1850147 },
      { city: "Mumbai", country: "India", region: "Asia", timezone: "Asia/Kolkata", utcOffset: 5.5, latitude: 19.0760, longitude: 72.8777, population: 12400000, countryCode: "IN", geonameId: 1275339 },
      { city: "Delhi", country: "India", region: "Asia", timezone: "Asia/Kolkata", utcOffset: 5.5, latitude: 28.7041, longitude: 77.1025, population: 11000000, countryCode: "IN", geonameId: 1273294 },
      { city: "Bangalore", country: "India", region: "Asia", timezone: "Asia/Kolkata", utcOffset: 5.5, latitude: 12.9716, longitude: 77.5946, population: 8400000, countryCode: "IN", geonameId: 1277333 },
      { city: "Manipal", country: "India", region: "Asia", timezone: "Asia/Kolkata", utcOffset: 5.5, latitude: 13.3467, longitude: 74.7926, population: 45000, countryCode: "IN", geonameId: 1264418 },
    ];

    const lowerQuery = query.toLowerCase();
    return staticCities
      .filter(city => 
        city.city.toLowerCase().includes(lowerQuery) ||
        city.country.toLowerCase().includes(lowerQuery)
      )
      .slice(0, maxResults);
  }

  /**
   * Get usage statistics
   */
  getStats() {
    return {
      totalCities: "11+ million (live)",
      cachedSearches: this.cache.size,
      cachedTimezones: this.timezoneCache.size,
      apiProvider: "GeoNames.org",
      coverage: "Global",
      languages: "Multiple",
      lastUpdated: "Real-time"
    };
  }
}

// Export singleton instance
export const geoNamesCityFinder = new GeoNamesCityFinder();