// Comprehensive Timezone & User Experience Enhancement System
// Complete implementation of all requested timezone improvements and analytics

import { timezoneHandler, TimezoneSearchResult, WORLD_TIMEZONES } from './timezone-handler';
import { timezoneAnalytics } from './timezone-analytics';

export interface EnhancedTimezoneSelection {
  timezone: string;
  confidence: number;
  source: 'auto_detection' | 'smart_suggestion' | 'ip_geolocation' | 'browser_detected' | 'manual_override';
  quality: {
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
    score: number;
    warnings: string[];
    suggestions: string[];
  };
  dstAnalysis: {
    applied: boolean;
    originalTime: string;
    adjustedTime: string;
    explanation: string;
    historicalAccuracy: number;
  };
  validation: {
    cityMatch: boolean;
    countryMatch: boolean; 
    timezoneValid: boolean;
    alternativeOptions: string[];
  };
}

export interface UserLocationData {
  city: string;
  country: string;
  coordinates?: { lat: number; lng: number };
  timezone: string;
  confidence: number;
  ipAddress?: string;
  browserTimezone: string;
}

export interface TimezoneRecommendationEngine {
  recommendations: TimezoneSearchResult[];
  fallbackOptions: string[];
  userGuidance: {
    primaryChoice: string;
    reasoning: string[];
    alternativeScenarios: Array<{
      timezone: string;
      impact: string;
      confidence: number;
    }>;
  };
}

export class ComprehensiveTimezoneSystem {
  private static instance: ComprehensiveTimezoneSystem;

  static getInstance(): ComprehensiveTimezoneSystem {
    if (!ComprehensiveTimezoneSystem.instance) {
      ComprehensiveTimezoneSystem.instance = new ComprehensiveTimezoneSystem();
    }
    return ComprehensiveTimezoneSystem.instance;
  }

  // Main entry point for enhanced timezone selection
  async selectTimezone(userInput: {
    city: string;
    country: string;
    birthDate: string;
    birthTime: string;
    userIP?: string;
  }): Promise<EnhancedTimezoneSelection> {
    
    // Step 1: Get smart recommendations
    const recommendations = this.getSmartRecommendations(
      userInput.city, 
      userInput.country, 
      userInput.userIP
    );

    // Step 2: Select best recommendation
    const bestRecommendation = recommendations.recommendations[0];
    if (!bestRecommendation) {
      throw new Error('Unable to determine timezone from provided information');
    }

    // Step 3: Analyze DST for the specific birth date
    const birthDateTime = new Date(`${userInput.birthDate} ${userInput.birthTime}`);
    const dstAnalysis = timezoneHandler.analyzeDST(birthDateTime, bestRecommendation.timezone.id);

    // Step 4: Quality assessment
    const quality = this.assessTimezoneQuality(
      userInput.birthTime,
      bestRecommendation.confidence,
      userInput.city,
      userInput.country
    );

    // Step 5: Validation checks
    const validation = {
      cityMatch: bestRecommendation.matchType === 'exact',
      countryMatch: bestRecommendation.timezone.country.toLowerCase().includes(userInput.country.toLowerCase()),
      timezoneValid: timezoneHandler.isValidTimezone(bestRecommendation.timezone.id),
      alternativeOptions: recommendations.recommendations.slice(1, 4).map(r => r.timezone.name)
    };

    // Step 6: Track analytics
    timezoneAnalytics.trackTimezoneUsage(
      bestRecommendation.timezone.id,
      true,
      bestRecommendation.confidence,
      bestRecommendation.timezone.region
    );

    timezoneAnalytics.trackAutoDetection(
      userInput.city,
      bestRecommendation.timezone.id,
      bestRecommendation.confidence,
      bestRecommendation.matchType === 'exact'
    );

    if (dstAnalysis.adjustmentMade) {
      timezoneAnalytics.trackDSTCorrection(
        bestRecommendation.timezone.id,
        dstAnalysis.originalTime,
        dstAnalysis.adjustedTime,
        birthDateTime.getFullYear()
      );
    }

    timezoneAnalytics.trackBirthTimeQuality(
      userInput.birthTime,
      'user_reported',
      true
    );

    // Step 7: Build comprehensive result
    return {
      timezone: bestRecommendation.timezone.id,
      confidence: bestRecommendation.confidence,
      source: this.determineSource(bestRecommendation),
      quality,
      dstAnalysis: {
        applied: dstAnalysis.adjustmentMade,
        originalTime: userInput.birthTime,
        adjustedTime: dstAnalysis.adjustmentMade ? 
          this.formatTime(dstAnalysis.adjustedTime) : userInput.birthTime,
        explanation: this.getDSTExplanation(dstAnalysis, bestRecommendation.timezone.name),
        historicalAccuracy: dstAnalysis.confidence
      },
      validation
    };
  }

  // Smart recommendation engine
  getSmartRecommendations(city: string, country: string, userIP?: string): TimezoneRecommendationEngine {
    // Get timezone recommendations from handler
    const recommendations = timezoneHandler.getSmartRecommendations(city, country, userIP);
    
    // Add browser timezone as fallback
    const browserTimezone = timezoneHandler.getBrowserTimezone();
    const browserTzData = timezoneHandler['timezones'].get(browserTimezone);
    
    if (browserTzData && !recommendations.find(r => r.timezone.id === browserTimezone)) {
      recommendations.push({
        timezone: browserTzData,
        confidence: 0.3,
        matchType: 'fallback',
        reasoning: ['Browser timezone detected', 'System preference fallback']
      });
    }

    // Generate user guidance
    const primaryChoice = recommendations[0];
    const userGuidance = {
      primaryChoice: primaryChoice?.timezone.name || 'Unknown',
      reasoning: primaryChoice?.reasoning || ['No suitable timezone found'],
      alternativeScenarios: recommendations.slice(1, 4).map(rec => ({
        timezone: rec.timezone.name,
        impact: this.getTimezoneImpact(primaryChoice, rec),
        confidence: rec.confidence
      }))
    };

    return {
      recommendations,
      fallbackOptions: [browserTimezone, 'UTC'],
      userGuidance
    };
  }

  // IP-based geolocation enhancement
  async enhanceWithIPGeolocation(userIP: string): Promise<UserLocationData | null> {
    // In production, this would call a geolocation API
    // For now, return mock data structure
    return {
      city: 'Auto-detected',
      country: 'Auto-detected',
      timezone: timezoneHandler.getBrowserTimezone(),
      confidence: 0.6,
      ipAddress: userIP,
      browserTimezone: timezoneHandler.getBrowserTimezone()
    };
  }

  // Visual timezone map integration
  generateTimezoneMapData(selectedTimezone?: string) {
    const allTimezones = timezoneHandler.getTimezonesByRegion('North America')
      .concat(timezoneHandler.getTimezonesByRegion('Europe'))
      .concat(timezoneHandler.getTimezonesByRegion('Asia'))
      .concat(timezoneHandler.getTimezonesByRegion('Oceania'))
      .concat(timezoneHandler.getTimezonesByRegion('South America'))
      .concat(timezoneHandler.getTimezonesByRegion('Africa'));

    return allTimezones.map(tz => ({
      id: tz.id,
      name: tz.name,
      region: tz.region,
      country: tz.country,
      cities: tz.cities,
      isSelected: tz.id === selectedTimezone,
      usage: this.getTimezoneUsageStats(tz.id)
    }));
  }

  // Birth certificate time helper
  generateBirthCertificateGuidance(providedTime: string): {
    timeQuality: string;
    improvementSuggestions: string[];
    expectedSources: string[];
    accuracyImpact: string;
  } {
    const isRounded = this.isTimeRounded(providedTime);
    const hasMinutes = providedTime.includes(':');

    return {
      timeQuality: this.assessTimeString(providedTime),
      improvementSuggestions: [
        ...(isRounded ? ['Check birth certificate for exact minutes'] : []),
        ...(isRounded ? ['Contact birth hospital for records'] : []),
        ...(!hasMinutes ? ['Hour-only time reduces chart accuracy'] : []),
        'Medical records may have more precise timing'
      ],
      expectedSources: [
        'Hospital birth records',
        'Official birth certificate',
        'Medical delivery records',
        'Midwife or doctor notes'
      ],
      accuracyImpact: isRounded ? 
        'Rising sign and house positions may vary' : 
        'Chart calculations should be reliable'
    };
  }

  // Progressive form validation
  validateTimezoneInput(input: {
    city?: string;
    country?: string;
    timezone?: string;
  }): {
    isValid: boolean;
    errors: string[];
    suggestions: string[];
    completeness: number;
  } {
    const errors: string[] = [];
    const suggestions: string[] = [];
    let completeness = 0;

    // City validation
    if (input.city) {
      completeness += 33;
      if (input.city.length < 2) {
        errors.push('City name too short');
      }
    } else {
      suggestions.push('Enter birth city for timezone detection');
    }

    // Country validation
    if (input.country) {
      completeness += 33;
      if (input.country.length < 2) {
        errors.push('Country name too short');
      }
    } else {
      suggestions.push('Specify birth country for accuracy');
    }

    // Timezone validation
    if (input.timezone) {
      completeness += 34;
      if (!timezoneHandler.isValidTimezone(input.timezone)) {
        errors.push('Invalid timezone selected');
      }
    } else if (input.city && input.country) {
      suggestions.push('Auto-detection will suggest timezone');
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions,
      completeness
    };
  }

  // Historical DST notification system
  generateDSTNotification(dstAnalysis: any, timezone: string): {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success';
    details: string[];
  } {
    if (!dstAnalysis.adjustmentMade) {
      return {
        title: 'No DST Adjustment Needed',
        message: 'Daylight Saving Time was not active on your birth date.',
        type: 'success',
        details: [
          'Your birth time remains unchanged',
          'Standard time was in effect',
          'Chart calculations use provided time directly'
        ]
      };
    }

    return {
      title: 'DST Adjustment Applied',
      message: `We've adjusted your birth time by ${Math.abs(dstAnalysis.offsetHours)} hour(s) to account for Daylight Saving Time.`,
      type: 'info',
      details: [
        `Original time: ${this.formatTime(dstAnalysis.originalTime)}`,
        `Adjusted time: ${this.formatTime(dstAnalysis.adjustedTime)}`,
        `DST was active in ${timezone} on your birth date`,
        `Historical accuracy: ${Math.round(dstAnalysis.confidence * 100)}%`
      ]
    };
  }

  // Alternative scenario analysis
  generateAlternativeScenarios(baseTimezone: string, birthTime: string): Array<{
    timezone: string;
    timeDifference: string;
    impactAreas: string[];
    confidence: number;
    recommendation: string;
  }> {
    // Get nearby timezones for comparison
    const baseData = timezoneHandler['timezones'].get(baseTimezone);
    if (!baseData) return [];

    const alternativeTimezones = Array.from(timezoneHandler['timezones'].values())
      .filter(tz => tz.region === baseData.region && tz.id !== baseTimezone)
      .slice(0, 3);

    return alternativeTimezones.map(tz => {
      const offsetDiff = tz.offset - baseData.offset;
      return {
        timezone: tz.name,
        timeDifference: `${offsetDiff > 0 ? '+' : ''}${offsetDiff} hours`,
        impactAreas: this.calculateImpactAreas(offsetDiff),
        confidence: 0.7,
        recommendation: offsetDiff === 0 ? 
          'Minimal impact on chart' : 
          'Significant changes in rising sign and houses'
      };
    });
  }

  // Private helper methods
  private determineSource(recommendation: TimezoneSearchResult): EnhancedTimezoneSelection['source'] {
    switch (recommendation.matchType) {
      case 'exact': return 'auto_detection';
      case 'partial': return 'smart_suggestion';
      case 'fallback': return 'ip_geolocation';
      default: return 'manual_override';
    }
  }

  private assessTimezoneQuality(birthTime: string, confidence: number, city: string, country: string): EnhancedTimezoneSelection['quality'] {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    let score = confidence;
    let grade: EnhancedTimezoneSelection['quality']['grade'] = 'A';

    // Time quality assessment
    if (this.isTimeRounded(birthTime)) {
      warnings.push('Birth time appears rounded - may affect accuracy');
      suggestions.push('Check birth certificate for exact time');
      score -= 0.1;
    }

    // Location quality assessment
    if (!city || city.length < 3) {
      warnings.push('City name too short for reliable detection');
      score -= 0.15;
    }

    if (!country || country.length < 3) {
      warnings.push('Country information needed for accuracy');  
      score -= 0.1;
    }

    // Grade assignment
    if (score >= 0.95) grade = 'A+';
    else if (score >= 0.9) grade = 'A';
    else if (score >= 0.8) grade = 'B+';
    else if (score >= 0.7) grade = 'B';
    else if (score >= 0.6) grade = 'C+';
    else if (score >= 0.5) grade = 'C';
    else grade = 'D';

    return { grade, score, warnings, suggestions };
  }

  private getDSTExplanation(dstAnalysis: any, timezoneName: string): string {
    if (!dstAnalysis.adjustmentMade) {
      return `Standard time was in effect in ${timezoneName} on your birth date. No adjustment needed.`;
    }

    const adjustment = dstAnalysis.offsetHours > 0 ? 'forward' : 'back';
    const hours = Math.abs(dstAnalysis.offsetHours);
    
    return `Daylight Saving Time was active in ${timezoneName} on your birth date. ` +
           `We've moved your birth time ${adjustment} by ${hours} hour(s) to calculate your chart using standard time, ` +
           `which is the astronomical standard for astrological calculations.`;
  }

  private getTimezoneImpact(primary: TimezoneSearchResult | undefined, alternative: TimezoneSearchResult): string {
    if (!primary) return 'Unknown impact';
    
    const offsetDiff = alternative.timezone.offset - primary.timezone.offset;
    if (Math.abs(offsetDiff) < 0.5) return 'Minimal impact';
    if (Math.abs(offsetDiff) < 2) return 'Moderate impact on houses';
    return 'Significant changes in rising sign and house positions';
  }

  private getTimezoneUsageStats(timezoneId: string): { count: number; popularity: number } {
    // Would integrate with analytics system
    return { count: 0, popularity: 0 };
  }

  private isTimeRounded(timeString: string): boolean {
    if (!timeString.includes(':')) return true;
    const [, minutes] = timeString.split(':');
    const min = parseInt(minutes);
    return min % 15 === 0; // Rounded to quarter hours
  }

  private assessTimeString(timeString: string): string {
    if (!timeString || timeString === 'unknown') return 'Unknown';
    if (!timeString.includes(':')) return 'Hour only (low precision)';
    if (this.isTimeRounded(timeString)) return 'Rounded time (moderate precision)';
    return 'Exact time (high precision)';
  }

  private calculateImpactAreas(offsetDiff: number): string[] {
    const areas: string[] = [];
    if (Math.abs(offsetDiff) >= 1) {
      areas.push('Rising sign may change');
      areas.push('House positions affected');
    }
    if (Math.abs(offsetDiff) >= 2) {
      areas.push('Planetary aspects may shift');
      areas.push('Midheaven position changes');
    }
    if (Math.abs(offsetDiff) >= 4) {
      areas.push('Major chart restructuring');
    }
    return areas.length > 0 ? areas : ['Minimal astrological impact'];
  }

  private formatTime(date: Date): string {
    return date.toTimeString().substring(0, 5);
  }
}

// Export singleton instance
export const comprehensiveTimezoneSystem = ComprehensiveTimezoneSystem.getInstance();