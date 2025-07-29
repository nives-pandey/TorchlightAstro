// Advanced Timezone Analytics & Monitoring System
// Real-time tracking of timezone usage, DST accuracy, and user patterns

export interface TimezoneUsageStats {
  timezoneId: string;
  displayName: string;
  usageCount: number;
  successRate: number;
  avgConfidenceScore: number;
  dstCorrections: number;
  lastUsed: Date;
  region: string;
}

export interface BirthTimeQualityMetrics {
  totalEntries: number;
  exactTimes: number;
  roundedTimes: number;
  unknownTimes: number;
  qualityScores: {
    'A+': number; // Exact time, hospital records
    'A': number;  // Exact time, reliable source
    'B+': number; // Close approximation (±5 min)
    'B': number;  // Good approximation (±15 min)
    'C+': number; // Rough estimate (±30 min)
    'C': number;  // Very rough (±1 hour)
    'D': number;  // Unknown or unreliable
  };
  impactAnalysis: {
    risingSignChanges: number;
    houseShifts: number;
    aspectDifferences: number;
  };
}

export interface GeographicDistribution {
  continent: string;
  country: string;
  city: string;
  coordinates: { lat: number; lng: number };
  userCount: number;
  timezones: string[];
  popularTimes: { hour: number; count: number }[];
}

export interface DSTAnalytics {
  totalCorrections: number;
  affectedYears: number[];
  mostCommonAdjustments: { offset: number; count: number }[];
  userNotifications: number;
  accuracyImprovement: number;
}

export interface AutoDetectionMetrics {
  totalAttempts: number;
  successfulDetections: number;
  failedDetections: number;
  ambiguousMatches: number;
  manualOverrides: number;
  confidenceDistribution: { range: string; count: number }[];
}

export interface TimezoneRecommendation {
  timezoneId: string;
  displayName: string;
  confidence: number;
  reasoning: string[];
  alternatives: { id: string; name: string; confidence: number }[];
}

export interface UserSessionData {
  sessionId: string;
  ipGeolocation: { country: string; city: string; timezone: string };
  browserTimezone: string;
  userSelections: {
    city: string;
    country: string;
    timezone: string;
    confidence: number;
    method: 'auto' | 'manual' | 'suggestion';
  };
  validationResults: {
    cityMatch: boolean;
    timezoneValid: boolean;
    dstApplied: boolean;
    qualityScore: string;
  };
}

export class TimezoneAnalytics {
  private static instance: TimezoneAnalytics;
  private usageStats: Map<string, TimezoneUsageStats> = new Map();
  private qualityMetrics: BirthTimeQualityMetrics;
  private geographicData: GeographicDistribution[] = [];
  private dstAnalytics: DSTAnalytics;
  private autoDetectionMetrics: AutoDetectionMetrics;

  constructor() {
    this.initializeMetrics();
  }

  static getInstance(): TimezoneAnalytics {
    if (!TimezoneAnalytics.instance) {
      TimezoneAnalytics.instance = new TimezoneAnalytics();
    }
    return TimezoneAnalytics.instance;
  }

  private initializeMetrics() {
    this.qualityMetrics = {
      totalEntries: 0,
      exactTimes: 0,
      roundedTimes: 0,
      unknownTimes: 0,
      qualityScores: {
        'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D': 0
      },
      impactAnalysis: {
        risingSignChanges: 0,
        houseShifts: 0,
        aspectDifferences: 0
      }
    };

    this.dstAnalytics = {
      totalCorrections: 0,
      affectedYears: [],
      mostCommonAdjustments: [],
      userNotifications: 0,
      accuracyImprovement: 0
    };

    this.autoDetectionMetrics = {
      totalAttempts: 0,
      successfulDetections: 0,
      failedDetections: 0,
      ambiguousMatches: 0,
      manualOverrides: 0,
      confidenceDistribution: []
    };
  }

  // Real-time tracking methods
  trackTimezoneUsage(timezoneId: string, success: boolean, confidence: number, region: string) {
    const existing = this.usageStats.get(timezoneId);
    if (existing) {
      existing.usageCount++;
      existing.successRate = ((existing.successRate * (existing.usageCount - 1)) + (success ? 1 : 0)) / existing.usageCount;
      existing.avgConfidenceScore = ((existing.avgConfidenceScore * (existing.usageCount - 1)) + confidence) / existing.usageCount;
      existing.lastUsed = new Date();
    } else {
      this.usageStats.set(timezoneId, {
        timezoneId,
        displayName: this.getTimezoneDisplayName(timezoneId),
        usageCount: 1,
        successRate: success ? 1 : 0,
        avgConfidenceScore: confidence,
        dstCorrections: 0,
        lastUsed: new Date(),
        region
      });
    }
  }

  trackBirthTimeQuality(timeString: string, sourceReliability: string, userReported: boolean) {
    this.qualityMetrics.totalEntries++;
    
    const quality = this.assessTimeQuality(timeString, sourceReliability, userReported);
    this.qualityMetrics.qualityScores[quality]++;

    // Check if time appears rounded
    if (this.isRoundedTime(timeString)) {
      this.qualityMetrics.roundedTimes++;
    } else {
      this.qualityMetrics.exactTimes++;
    }
  }

  trackDSTCorrection(timezoneId: string, originalTime: Date, correctedTime: Date, year: number) {
    const stats = this.usageStats.get(timezoneId);
    if (stats) {
      stats.dstCorrections++;
    }

    this.dstAnalytics.totalCorrections++;
    if (!this.dstAnalytics.affectedYears.includes(year)) {
      this.dstAnalytics.affectedYears.push(year);
    }

    const offset = correctedTime.getTime() - originalTime.getTime();
    const adjustment = this.dstAnalytics.mostCommonAdjustments.find(a => a.offset === offset);
    if (adjustment) {
      adjustment.count++;
    } else {
      this.dstAnalytics.mostCommonAdjustments.push({ offset, count: 1 });
    }
  }

  trackAutoDetection(city: string, detectedTimezone: string, confidence: number, success: boolean) {
    this.autoDetectionMetrics.totalAttempts++;
    
    if (success) {
      this.autoDetectionMetrics.successfulDetections++;
    } else {
      this.autoDetectionMetrics.failedDetections++;
    }

    // Track confidence distribution
    const range = this.getConfidenceRange(confidence);
    const existing = this.autoDetectionMetrics.confidenceDistribution.find(c => c.range === range);
    if (existing) {
      existing.count++;
    } else {
      this.autoDetectionMetrics.confidenceDistribution.push({ range, count: 1 });
    }
  }

  trackGeographicUsage(country: string, city: string, timezone: string, coordinates: { lat: number; lng: number }) {
    const existing = this.geographicData.find(g => g.city === city && g.country === country);
    if (existing) {
      existing.userCount++;
      if (!existing.timezones.includes(timezone)) {
        existing.timezones.push(timezone);
      }
    } else {
      this.geographicData.push({
        continent: this.getContinent(country),
        country,
        city,
        coordinates,
        userCount: 1,
        timezones: [timezone],
        popularTimes: []
      });
    }
  }

  // Smart recommendation system
  getTimezoneRecommendations(city: string, country: string, userIP?: string): TimezoneRecommendation[] {
    const recommendations: TimezoneRecommendation[] = [];

    // Primary recommendation based on city-country match
    const primaryZone = this.getCityTimezone(city, country);
    if (primaryZone) {
      recommendations.push({
        timezoneId: primaryZone.id,
        displayName: primaryZone.name,
        confidence: primaryZone.confidence,
        reasoning: ['Exact city match', 'Historical data verified'],
        alternatives: []
      });
    }

    // Backup recommendations based on geographic proximity
    const nearbyZones = this.getNearbyTimezones(city, country);
    nearbyZones.forEach(zone => {
      recommendations.push({
        timezoneId: zone.id,
        displayName: zone.name,
        confidence: zone.confidence,
        reasoning: ['Geographic proximity', 'Regional consistency'],
        alternatives: []
      });
    });

    // IP-based fallback
    if (userIP) {
      const ipBasedZone = this.getTimezoneFromIP(userIP);
      if (ipBasedZone) {
        recommendations.push({
          timezoneId: ipBasedZone.id,
          displayName: ipBasedZone.name,
          confidence: 0.6,
          reasoning: ['IP geolocation match', 'Fallback suggestion'],
          alternatives: []
        });
      }
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  // Analytics reporting methods
  getUsageReport(): TimezoneUsageStats[] {
    return Array.from(this.usageStats.values())
      .sort((a, b) => b.usageCount - a.usageCount);
  }

  getQualityReport(): BirthTimeQualityMetrics {
    return { ...this.qualityMetrics };
  }

  getGeographicReport(): GeographicDistribution[] {
    return [...this.geographicData]
      .sort((a, b) => b.userCount - a.userCount);
  }

  getDSTReport(): DSTAnalytics {
    return { ...this.dstAnalytics };
  }

  getAutoDetectionReport(): AutoDetectionMetrics {
    return { ...this.autoDetectionMetrics };
  }

  // Time quality assessment helpers
  private assessTimeQuality(timeString: string, sourceReliability: string, userReported: boolean): keyof BirthTimeQualityMetrics['qualityScores'] {
    if (sourceReliability === 'hospital_record' && !this.isRoundedTime(timeString)) {
      return 'A+';
    }
    if (sourceReliability === 'birth_certificate' && !this.isRoundedTime(timeString)) {
      return 'A';
    }
    if (!this.isRoundedTime(timeString) && userReported) {
      return 'B+';
    }
    if (this.isRoundedTime(timeString) && timeString.includes(':')) {
      return 'B';
    }
    if (this.isRoundedTime(timeString)) {
      return 'C+';
    }
    if (timeString === 'unknown' || timeString === '') {
      return 'D';
    }
    return 'C';
  }

  private isRoundedTime(timeString: string): boolean {
    if (!timeString.includes(':')) return true;
    const [hours, minutes] = timeString.split(':');
    const min = parseInt(minutes);
    return min % 15 === 0; // Rounded to quarter hours
  }

  private getConfidenceRange(confidence: number): string {
    if (confidence >= 0.9) return '90-100%';
    if (confidence >= 0.8) return '80-89%';
    if (confidence >= 0.7) return '70-79%';
    if (confidence >= 0.6) return '60-69%';
    if (confidence >= 0.5) return '50-59%';
    return 'Below 50%';
  }

  private getTimezoneDisplayName(timezoneId: string): string {
    try {
      return new Intl.DateTimeFormat('en', {
        timeZone: timezoneId,
        timeZoneName: 'long'
      }).formatToParts(new Date()).find(part => part.type === 'timeZoneName')?.value || timezoneId;
    } catch {
      return timezoneId;
    }
  }

  private getCityTimezone(city: string, country: string): { id: string; name: string; confidence: number } | null {
    // Implementation would use timezone database
    // For now, return mock data structure
    return null;
  }

  private getNearbyTimezones(city: string, country: string): { id: string; name: string; confidence: number }[] {
    // Implementation would use geographic proximity
    return [];
  }

  private getTimezoneFromIP(ip: string): { id: string; name: string } | null {
    // Implementation would use IP geolocation service
    return null;
  }

  private getContinent(country: string): string {
    const continentMap: Record<string, string> = {
      'United States': 'North America',
      'Canada': 'North America',
      'Mexico': 'North America',
      'United Kingdom': 'Europe',
      'France': 'Europe',
      'Germany': 'Europe',
      'Spain': 'Europe',
      'Italy': 'Europe',
      'India': 'Asia',
      'China': 'Asia',
      'Japan': 'Asia',
      'Australia': 'Oceania',
      'New Zealand': 'Oceania',
      'Brazil': 'South America',
      'Argentina': 'South America',
      'Egypt': 'Africa',
      'South Africa': 'Africa',
      'Nigeria': 'Africa'
    };
    return continentMap[country] || 'Unknown';
  }
}

// Singleton instance
export const timezoneAnalytics = TimezoneAnalytics.getInstance();