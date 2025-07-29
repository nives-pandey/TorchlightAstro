// Advanced Timezone Handler with DST History and Smart Detection
// Comprehensive timezone management system for accurate birth chart calculations

export interface TimezoneData {
  id: string;
  name: string;
  offset: number;
  dstOffset?: number;
  country: string;
  region: string;
  cities: string[];
  dstRules?: DSTRule[];
}

export interface DSTRule {
  startYear: number;
  endYear?: number;
  startRule: {
    month: number;
    week: number;
    dayOfWeek: number;
    time: string;
  };
  endRule: {
    month: number;
    week: number;
    dayOfWeek: number;
    time: string;
  };
  offset: number; // Hours to add during DST
}

export interface TimezoneSearchResult {
  timezone: TimezoneData;
  confidence: number;
  matchType: 'exact' | 'partial' | 'nearby' | 'fallback';
  reasoning: string[];
}

export interface DSTAnalysisResult {
  isDSTActive: boolean;
  adjustmentMade: boolean;
  originalTime: Date;
  adjustedTime: Date;
  offsetHours: number;
  rule?: DSTRule;
  confidence: number;
}

// Comprehensive timezone database
export const WORLD_TIMEZONES: TimezoneData[] = [
  // North America - United States
  {
    id: "America/New_York",
    name: "Eastern Time",
    offset: -5,
    dstOffset: -4,
    country: "United States",
    region: "North America",
    cities: ["New York", "Boston", "Washington", "Atlanta", "Miami", "Detroit", "Philadelphia"],
    dstRules: [{
      startYear: 2007,
      startRule: { month: 3, week: 2, dayOfWeek: 0, time: "02:00" },
      endRule: { month: 11, week: 1, dayOfWeek: 0, time: "02:00" },
      offset: 1
    }]
  },
  {
    id: "America/Chicago",
    name: "Central Time",
    offset: -6,
    dstOffset: -5,
    country: "United States",
    region: "North America",
    cities: ["Chicago", "Houston", "Dallas", "San Antonio", "Austin", "Memphis", "New Orleans"],
    dstRules: [{
      startYear: 2007,
      startRule: { month: 3, week: 2, dayOfWeek: 0, time: "02:00" },
      endRule: { month: 11, week: 1, dayOfWeek: 0, time: "02:00" },
      offset: 1
    }]
  },
  {
    id: "America/Denver",
    name: "Mountain Time",
    offset: -7,
    dstOffset: -6,
    country: "United States",
    region: "North America",
    cities: ["Denver", "Phoenix", "Salt Lake City", "Albuquerque", "Boulder", "Colorado Springs"],
    dstRules: [{
      startYear: 2007,
      startRule: { month: 3, week: 2, dayOfWeek: 0, time: "02:00" },
      endRule: { month: 11, week: 1, dayOfWeek: 0, time: "02:00" },
      offset: 1
    }]
  },
  {
    id: "America/Los_Angeles",
    name: "Pacific Time",
    offset: -8,
    dstOffset: -7,
    country: "United States",
    region: "North America",
    cities: ["Los Angeles", "San Francisco", "San Diego", "Seattle", "Portland", "Las Vegas"],
    dstRules: [{
      startYear: 2007,
      startRule: { month: 3, week: 2, dayOfWeek: 0, time: "02:00" },
      endRule: { month: 11, week: 1, dayOfWeek: 0, time: "02:00" },
      offset: 1
    }]
  },

  // Europe
  {
    id: "Europe/London",
    name: "Greenwich Mean Time",
    offset: 0,
    dstOffset: 1,
    country: "United Kingdom",
    region: "Europe",
    cities: ["London", "Manchester", "Birmingham", "Liverpool", "Edinburgh", "Glasgow"],
    dstRules: [{
      startYear: 1996,
      startRule: { month: 3, week: -1, dayOfWeek: 0, time: "01:00" },
      endRule: { month: 10, week: -1, dayOfWeek: 0, time: "02:00" },
      offset: 1
    }]
  },
  {
    id: "Europe/Paris",
    name: "Central European Time",
    offset: 1,
    dstOffset: 2,
    country: "France",
    region: "Europe",
    cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Strasbourg"],
    dstRules: [{
      startYear: 1996,
      startRule: { month: 3, week: -1, dayOfWeek: 0, time: "02:00" },
      endRule: { month: 10, week: -1, dayOfWeek: 0, time: "03:00" },
      offset: 1
    }]
  },
  {
    id: "Europe/Berlin",
    name: "Central European Time",
    offset: 1,
    dstOffset: 2,
    country: "Germany",
    region: "Europe",
    cities: ["Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt", "Stuttgart"],
    dstRules: [{
      startYear: 1996,
      startRule: { month: 3, week: -1, dayOfWeek: 0, time: "02:00" },
      endRule: { month: 10, week: -1, dayOfWeek: 0, time: "03:00" },
      offset: 1
    }]
  },

  // Asia
  {
    id: "Asia/Kolkata",
    name: "India Standard Time",
    offset: 5.5,
    country: "India",
    region: "Asia",
    cities: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"]
  },
  {
    id: "Asia/Tokyo",
    name: "Japan Standard Time",
    offset: 9,
    country: "Japan",
    region: "Asia",
    cities: ["Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo", "Kyoto"]
  },
  {
    id: "Asia/Shanghai",
    name: "China Standard Time",
    offset: 8,
    country: "China",
    region: "Asia",
    cities: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen", "Tianjin", "Wuhan", "Chengdu"]
  },
  {
    id: "Asia/Manila",
    name: "Philippines Standard Time",
    offset: 8,
    country: "Philippines",
    region: "Asia",
    cities: ["Manila", "Quezon City", "Makati", "Pasig", "Taguig", "Cebu City", "Davao", "Zamboanga", "Antipolo", "Pasay", "Caloocan", "Las Piñas", "Marikina", "Muntinlupa", "Parañaque", "Valenzuela", "Bacoor", "General Santos", "Iloilo City", "Cagayan de Oro", "Bacolod", "Baguio", "Butuan", "Cotabato", "Dumaguete", "Iligan", "Legazpi", "Lucena", "Naga", "Olongapo", "San Pablo", "Tacloban", "Tagaytay", "Tuguegarao"]
  },
  {
    id: "Asia/Bangkok",
    name: "Indochina Time",
    offset: 7,
    country: "Thailand",
    region: "Asia",
    cities: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Hat Yai"]
  },
  {
    id: "Asia/Singapore",
    name: "Singapore Standard Time",
    offset: 8,
    country: "Singapore",
    region: "Asia",
    cities: ["Singapore"]
  },
  {
    id: "Asia/Kuala_Lumpur",
    name: "Malaysia Time",
    offset: 8,
    country: "Malaysia",
    region: "Asia",
    cities: ["Kuala Lumpur", "George Town", "Ipoh", "Shah Alam", "Petaling Jaya", "Klang", "Johor Bahru", "Kuching", "Kota Kinabalu"]
  },
  {
    id: "Asia/Jakarta",
    name: "Western Indonesian Time",
    offset: 7,
    country: "Indonesia",
    region: "Asia",
    cities: ["Jakarta", "Surabaya", "Bandung", "Bekasi", "Medan", "Tangerang", "Depok", "Semarang", "Palembang", "Makassar"]
  },

  // Oceania
  {
    id: "Australia/Sydney",
    name: "Australian Eastern Time",
    offset: 10,
    dstOffset: 11,
    country: "Australia",
    region: "Oceania",
    cities: ["Sydney", "Melbourne", "Brisbane", "Canberra"],
    dstRules: [{
      startYear: 2008,
      startRule: { month: 10, week: 1, dayOfWeek: 0, time: "02:00" },
      endRule: { month: 4, week: 1, dayOfWeek: 0, time: "03:00" },
      offset: 1
    }]
  },

  // South America
  {
    id: "America/Sao_Paulo",
    name: "Brasília Time",
    offset: -3,
    country: "Brazil",
    region: "South America",
    cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza"]
  },

  // Africa  
  {
    id: "Africa/Cairo",
    name: "Eastern European Time",
    offset: 2,
    country: "Egypt",
    region: "Africa",
    cities: ["Cairo", "Alexandria", "Giza"]
  }
];

export class TimezoneHandler {
  private static instance: TimezoneHandler;
  private timezones: Map<string, TimezoneData> = new Map();
  private cityIndex: Map<string, TimezoneData[]> = new Map();

  constructor() {
    this.initializeDatabase();
  }

  static getInstance(): TimezoneHandler {
    if (!TimezoneHandler.instance) {
      TimezoneHandler.instance = new TimezoneHandler();
    }
    return TimezoneHandler.instance;
  }

  private initializeDatabase() {
    // Index timezones by ID
    WORLD_TIMEZONES.forEach(tz => {
      this.timezones.set(tz.id, tz);
    });

    // Create city index for fast lookups
    WORLD_TIMEZONES.forEach(tz => {
      tz.cities.forEach(city => {
        const cityKey = this.normalizeCityName(city);
        if (!this.cityIndex.has(cityKey)) {
          this.cityIndex.set(cityKey, []);
        }
        this.cityIndex.get(cityKey)!.push(tz);
      });
    });
  }

  // Smart timezone detection based on city and country
  findTimezone(city: string, country?: string): TimezoneSearchResult[] {
    const results: TimezoneSearchResult[] = [];
    const normalizedCity = this.normalizeCityName(city);

    // Exact city match
    const exactMatches = this.cityIndex.get(normalizedCity) || [];
    exactMatches.forEach(tz => {
      const confidence = country && tz.country.toLowerCase().includes(country.toLowerCase()) ? 0.95 : 0.85;
      results.push({
        timezone: tz,
        confidence,
        matchType: 'exact',
        reasoning: ['Exact city name match', country ? 'Country confirmed' : 'City verified']
      });
    });

    // Partial city matches
    if (results.length === 0) {
      this.cityIndex.forEach((timezones, cityKey) => {
        if (cityKey.includes(normalizedCity) || normalizedCity.includes(cityKey)) {
          timezones.forEach(tz => {
            const confidence = country && tz.country.toLowerCase().includes(country.toLowerCase()) ? 0.75 : 0.65;
            results.push({
              timezone: tz,
              confidence,
              matchType: 'partial',
              reasoning: ['Partial city name match', 'Similar city name found']
            });
          });
        }
      });
    }

    // Country-based fallback
    if (results.length === 0 && country) {
      WORLD_TIMEZONES.forEach(tz => {
        if (tz.country.toLowerCase().includes(country.toLowerCase())) {
          results.push({
            timezone: tz,
            confidence: 0.5,
            matchType: 'fallback',
            reasoning: ['Country match only', 'Major timezone for region']
          });
        }
      });
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  // Historical DST analysis for specific date
  analyzeDST(date: Date, timezoneId: string): DSTAnalysisResult {
    const timezone = this.timezones.get(timezoneId);
    if (!timezone || !timezone.dstRules) {
      return {
        isDSTActive: false,
        adjustmentMade: false,
        originalTime: date,
        adjustedTime: date,
        offsetHours: 0,
        confidence: 1.0
      };
    }

    const year = date.getFullYear();
    const applicableRule = timezone.dstRules.find(rule => 
      year >= rule.startYear && (!rule.endYear || year <= rule.endYear)
    );

    if (!applicableRule) {
      return {
        isDSTActive: false,
        adjustmentMade: false,
        originalTime: date,
        adjustedTime: date,
        offsetHours: 0,
        confidence: 1.0
      };
    }

    const dstStart = this.calculateDSTDate(year, applicableRule.startRule);
    const dstEnd = this.calculateDSTDate(year, applicableRule.endRule);
    
    const isDSTActive = date >= dstStart && date < dstEnd;
    
    if (isDSTActive) {
      const adjustedTime = new Date(date.getTime() - (applicableRule.offset * 60 * 60 * 1000));
      return {
        isDSTActive: true,
        adjustmentMade: true,
        originalTime: date,
        adjustedTime,
        offsetHours: -applicableRule.offset,
        rule: applicableRule,
        confidence: 0.95
      };
    }

    return {
      isDSTActive: false,
      adjustmentMade: false,
      originalTime: date,
      adjustedTime: date,
      offsetHours: 0,
      rule: applicableRule,
      confidence: 0.95
    };
  }

  // Convert local time to UTC accounting for timezone and DST
  toUTC(localTime: Date, timezoneId: string): Date {
    const timezone = this.timezones.get(timezoneId);
    if (!timezone) {
      throw new Error(`Unknown timezone: ${timezoneId}`);
    }

    const dstAnalysis = this.analyzeDST(localTime, timezoneId);
    const effectiveOffset = dstAnalysis.isDSTActive ? 
      (timezone.dstOffset ?? timezone.offset) : timezone.offset;

    return new Date(localTime.getTime() - (effectiveOffset * 60 * 60 * 1000));
  }

  // Get current timezone from browser
  getBrowserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // Validate timezone ID
  isValidTimezone(timezoneId: string): boolean {
    return this.timezones.has(timezoneId);
  }

  // Get all timezones for a region
  getTimezonesByRegion(region: string): TimezoneData[] {
    return Array.from(this.timezones.values()).filter(tz => tz.region === region);
  }

  // Get timezone recommendations based on multiple criteria
  getSmartRecommendations(city: string, country?: string, userIP?: string): TimezoneSearchResult[] {
    const cityResults = this.findTimezone(city, country);
    
    // Add browser timezone as backup
    const browserTz = this.getBrowserTimezone();
    const browserTimezone = this.timezones.get(browserTz);
    if (browserTimezone && !cityResults.find(r => r.timezone.id === browserTz)) {
      cityResults.push({
        timezone: browserTimezone,
        confidence: 0.4,
        matchType: 'fallback',
        reasoning: ['Browser timezone detected', 'User system preference']
      });
    }

    return cityResults.slice(0, 5); // Return top 5 recommendations
  }

  private normalizeCityName(city: string): string {
    return city.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ýÿ]/g, 'y')
      .replace(/[ç]/g, 'c')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9]/g, '');
  }

  private calculateDSTDate(year: number, rule: DSTRule['startRule']): Date {
    const date = new Date(year, rule.month - 1, 1);
    
    // Find the specified week and day
    let targetDate: Date;
    if (rule.week > 0) {
      // Positive week (1st, 2nd, etc.)
      const firstDayOfMonth = date.getDay();
      const daysToAdd = (rule.dayOfWeek - firstDayOfMonth + 7) % 7 + (rule.week - 1) * 7;
      targetDate = new Date(year, rule.month - 1, 1 + daysToAdd);
    } else {
      // Negative week (last occurrence)
      const lastDayOfMonth = new Date(year, rule.month, 0);
      const lastDayWeekday = lastDayOfMonth.getDay();
      const daysToSubtract = (lastDayWeekday - rule.dayOfWeek + 7) % 7;
      targetDate = new Date(year, rule.month - 1, lastDayOfMonth.getDate() - daysToSubtract);
    }

    // Set the time
    const [hours, minutes] = rule.time.split(':').map(Number);
    targetDate.setHours(hours, minutes, 0, 0);

    return targetDate;
  }
}

// Singleton instance
export const timezoneHandler = TimezoneHandler.getInstance();

// Legacy compatibility functions
export function detectTimezoneFromCity(city: string, country?: string): string | null {
  const results = timezoneHandler.findTimezone(city, country);
  return results.length > 0 ? results[0].timezone.id : null;
}

export function getTimezonesByRegion(region: string): TimezoneData[] {
  return timezoneHandler.getTimezonesByRegion(region);
}

export function validateBirthTimeAccuracy(timeString: string): {
  isAccurate: boolean;
  quality: string;
  suggestions: string[];
} {
  const isRounded = !timeString.includes(':') || 
    (timeString.includes(':') && parseInt(timeString.split(':')[1]) % 15 === 0);
  
  return {
    isAccurate: !isRounded,
    quality: isRounded ? 'Rounded (±15 min accuracy)' : 'Precise (±2 min accuracy)',
    suggestions: isRounded ? [
      'Check birth certificate for exact time',
      'Contact birth hospital for precise records'
    ] : []
  };
}

export interface TimezoneInfo {
  id: string;
  name: string;
  offset: number;
  country: string;
  region: string;
}