// Comprehensive timezone and DST handling for accurate astrological calculations
export interface TimezoneInfo {
  identifier: string;
  displayName: string;
  utcOffset: number;
  hasDST: boolean;
  region: string;
}

export interface LocationTimezone {
  city: string;
  country: string;
  timezone: string;
  coordinates: { lat: number; lng: number };
}

// Comprehensive world timezone database
export const WORLD_TIMEZONES: TimezoneInfo[] = [
  // Americas
  { identifier: 'America/New_York', displayName: 'Eastern Time (US)', utcOffset: -5, hasDST: true, region: 'Americas' },
  { identifier: 'America/Chicago', displayName: 'Central Time (US)', utcOffset: -6, hasDST: true, region: 'Americas' },
  { identifier: 'America/Denver', displayName: 'Mountain Time (US)', utcOffset: -7, hasDST: true, region: 'Americas' },
  { identifier: 'America/Los_Angeles', displayName: 'Pacific Time (US)', utcOffset: -8, hasDST: true, region: 'Americas' },
  { identifier: 'America/Phoenix', displayName: 'Arizona Time (No DST)', utcOffset: -7, hasDST: false, region: 'Americas' },
  { identifier: 'America/Anchorage', displayName: 'Alaska Time', utcOffset: -9, hasDST: true, region: 'Americas' },
  { identifier: 'Pacific/Honolulu', displayName: 'Hawaii Time', utcOffset: -10, hasDST: false, region: 'Americas' },
  { identifier: 'America/Toronto', displayName: 'Eastern Time (Canada)', utcOffset: -5, hasDST: true, region: 'Americas' },
  { identifier: 'America/Vancouver', displayName: 'Pacific Time (Canada)', utcOffset: -8, hasDST: true, region: 'Americas' },
  { identifier: 'America/Mexico_City', displayName: 'Central Time (Mexico)', utcOffset: -6, hasDST: true, region: 'Americas' },
  { identifier: 'America/Sao_Paulo', displayName: 'Brasília Time', utcOffset: -3, hasDST: true, region: 'Americas' },
  { identifier: 'America/Argentina/Buenos_Aires', displayName: 'Argentina Time', utcOffset: -3, hasDST: false, region: 'Americas' },
  { identifier: 'America/Lima', displayName: 'Peru Time', utcOffset: -5, hasDST: false, region: 'Americas' },
  { identifier: 'America/Bogota', displayName: 'Colombia Time', utcOffset: -5, hasDST: false, region: 'Americas' },

  // Europe
  { identifier: 'Europe/London', displayName: 'Greenwich Mean Time (UK)', utcOffset: 0, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Paris', displayName: 'Central European Time (France)', utcOffset: 1, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Berlin', displayName: 'Central European Time (Germany)', utcOffset: 1, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Rome', displayName: 'Central European Time (Italy)', utcOffset: 1, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Madrid', displayName: 'Central European Time (Spain)', utcOffset: 1, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Amsterdam', displayName: 'Central European Time (Netherlands)', utcOffset: 1, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Zurich', displayName: 'Central European Time (Switzerland)', utcOffset: 1, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Vienna', displayName: 'Central European Time (Austria)', utcOffset: 1, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Stockholm', displayName: 'Central European Time (Sweden)', utcOffset: 1, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Oslo', displayName: 'Central European Time (Norway)', utcOffset: 1, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Copenhagen', displayName: 'Central European Time (Denmark)', utcOffset: 1, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Helsinki', displayName: 'Eastern European Time (Finland)', utcOffset: 2, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Moscow', displayName: 'Moscow Standard Time', utcOffset: 3, hasDST: false, region: 'Europe' },
  { identifier: 'Europe/Istanbul', displayName: 'Turkey Time', utcOffset: 3, hasDST: false, region: 'Europe' },
  { identifier: 'Europe/Athens', displayName: 'Eastern European Time (Greece)', utcOffset: 2, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Warsaw', displayName: 'Central European Time (Poland)', utcOffset: 1, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Prague', displayName: 'Central European Time (Czech Republic)', utcOffset: 1, hasDST: true, region: 'Europe' },
  { identifier: 'Europe/Budapest', displayName: 'Central European Time (Hungary)', utcOffset: 1, hasDST: true, region: 'Europe' },

  // Asia
  { identifier: 'Asia/Tokyo', displayName: 'Japan Standard Time', utcOffset: 9, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Shanghai', displayName: 'China Standard Time', utcOffset: 8, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Hong_Kong', displayName: 'Hong Kong Time', utcOffset: 8, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Singapore', displayName: 'Singapore Standard Time', utcOffset: 8, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Seoul', displayName: 'Korea Standard Time', utcOffset: 9, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Kolkata', displayName: 'India Standard Time', utcOffset: 5.5, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Dubai', displayName: 'Gulf Standard Time (UAE)', utcOffset: 4, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Riyadh', displayName: 'Arabia Standard Time (Saudi Arabia)', utcOffset: 3, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Tehran', displayName: 'Iran Standard Time', utcOffset: 3.5, hasDST: true, region: 'Asia' },
  { identifier: 'Asia/Karachi', displayName: 'Pakistan Standard Time', utcOffset: 5, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Dhaka', displayName: 'Bangladesh Standard Time', utcOffset: 6, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Bangkok', displayName: 'Indochina Time (Thailand)', utcOffset: 7, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Jakarta', displayName: 'Western Indonesian Time', utcOffset: 7, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Manila', displayName: 'Philippine Standard Time', utcOffset: 8, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Kuala_Lumpur', displayName: 'Malaysia Standard Time', utcOffset: 8, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Almaty', displayName: 'Almaty Time (Kazakhstan)', utcOffset: 6, hasDST: false, region: 'Asia' },
  { identifier: 'Asia/Tashkent', displayName: 'Uzbekistan Time', utcOffset: 5, hasDST: false, region: 'Asia' },

  // Africa
  { identifier: 'Africa/Cairo', displayName: 'Eastern European Time (Egypt)', utcOffset: 2, hasDST: false, region: 'Africa' },
  { identifier: 'Africa/Johannesburg', displayName: 'South Africa Standard Time', utcOffset: 2, hasDST: false, region: 'Africa' },
  { identifier: 'Africa/Lagos', displayName: 'West Africa Time (Nigeria)', utcOffset: 1, hasDST: false, region: 'Africa' },
  { identifier: 'Africa/Nairobi', displayName: 'East Africa Time (Kenya)', utcOffset: 3, hasDST: false, region: 'Africa' },
  { identifier: 'Africa/Casablanca', displayName: 'Western European Time (Morocco)', utcOffset: 1, hasDST: true, region: 'Africa' },
  { identifier: 'Africa/Algiers', displayName: 'Central European Time (Algeria)', utcOffset: 1, hasDST: false, region: 'Africa' },
  { identifier: 'Africa/Tunis', displayName: 'Central European Time (Tunisia)', utcOffset: 1, hasDST: false, region: 'Africa' },

  // Oceania
  { identifier: 'Australia/Sydney', displayName: 'Australian Eastern Time', utcOffset: 10, hasDST: true, region: 'Oceania' },
  { identifier: 'Australia/Melbourne', displayName: 'Australian Eastern Time (Melbourne)', utcOffset: 10, hasDST: true, region: 'Oceania' },
  { identifier: 'Australia/Brisbane', displayName: 'Australian Eastern Time (Queensland)', utcOffset: 10, hasDST: false, region: 'Oceania' },
  { identifier: 'Australia/Perth', displayName: 'Australian Western Time', utcOffset: 8, hasDST: false, region: 'Oceania' },
  { identifier: 'Australia/Adelaide', displayName: 'Australian Central Time', utcOffset: 9.5, hasDST: true, region: 'Oceania' },
  { identifier: 'Australia/Darwin', displayName: 'Australian Central Time (Northern Territory)', utcOffset: 9.5, hasDST: false, region: 'Oceania' },
  { identifier: 'Pacific/Auckland', displayName: 'New Zealand Standard Time', utcOffset: 12, hasDST: true, region: 'Oceania' },
  { identifier: 'Pacific/Fiji', displayName: 'Fiji Time', utcOffset: 12, hasDST: true, region: 'Oceania' },
];

// Popular city-timezone mappings for quick lookup
export const CITY_TIMEZONE_MAP: LocationTimezone[] = [
  // Major US Cities
  { city: 'New York', country: 'United States', timezone: 'America/New_York', coordinates: { lat: 40.7128, lng: -74.0060 } },
  { city: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', coordinates: { lat: 34.0522, lng: -118.2437 } },
  { city: 'Chicago', country: 'United States', timezone: 'America/Chicago', coordinates: { lat: 41.8781, lng: -87.6298 } },
  { city: 'Houston', country: 'United States', timezone: 'America/Chicago', coordinates: { lat: 29.7604, lng: -95.3698 } },
  { city: 'Phoenix', country: 'United States', timezone: 'America/Phoenix', coordinates: { lat: 33.4484, lng: -112.0740 } },
  { city: 'Philadelphia', country: 'United States', timezone: 'America/New_York', coordinates: { lat: 39.9526, lng: -75.1652 } },
  { city: 'San Antonio', country: 'United States', timezone: 'America/Chicago', coordinates: { lat: 29.4241, lng: -98.4936 } },
  { city: 'San Diego', country: 'United States', timezone: 'America/Los_Angeles', coordinates: { lat: 32.7157, lng: -117.1611 } },
  { city: 'Dallas', country: 'United States', timezone: 'America/Chicago', coordinates: { lat: 32.7767, lng: -96.7970 } },
  { city: 'San Jose', country: 'United States', timezone: 'America/Los_Angeles', coordinates: { lat: 37.3382, lng: -121.8863 } },

  // European Cities
  { city: 'London', country: 'United Kingdom', timezone: 'Europe/London', coordinates: { lat: 51.5074, lng: -0.1278 } },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris', coordinates: { lat: 48.8566, lng: 2.3522 } },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', coordinates: { lat: 52.5200, lng: 13.4050 } },
  { city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', coordinates: { lat: 40.4168, lng: -3.7038 } },
  { city: 'Rome', country: 'Italy', timezone: 'Europe/Rome', coordinates: { lat: 41.9028, lng: 12.4964 } },
  { city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', coordinates: { lat: 52.3676, lng: 4.9041 } },
  { city: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna', coordinates: { lat: 48.2082, lng: 16.3738 } },
  { city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', coordinates: { lat: 47.3769, lng: 8.5417 } },
  { city: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm', coordinates: { lat: 59.3293, lng: 18.0686 } },
  { city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', coordinates: { lat: 55.7558, lng: 37.6176 } },

  // Asian Cities
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', coordinates: { lat: 35.6762, lng: 139.6503 } },
  { city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', coordinates: { lat: 31.2304, lng: 121.4737 } },
  { city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', coordinates: { lat: 39.9042, lng: 116.4074 } },
  { city: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', coordinates: { lat: 22.3193, lng: 114.1694 } },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', coordinates: { lat: 1.3521, lng: 103.8198 } },
  { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', coordinates: { lat: 37.5665, lng: 126.9780 } },
  { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', coordinates: { lat: 19.0760, lng: 72.8777 } },
  { city: 'Delhi', country: 'India', timezone: 'Asia/Kolkata', coordinates: { lat: 28.7041, lng: 77.1025 } },
  { city: 'Bangalore', country: 'India', timezone: 'Asia/Kolkata', coordinates: { lat: 12.9716, lng: 77.5946 } },
  { city: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', coordinates: { lat: 25.2048, lng: 55.2708 } },

  // Other Major Cities
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', coordinates: { lat: -33.8688, lng: 151.2093 } },
  { city: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', coordinates: { lat: -37.8136, lng: 144.9631 } },
  { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', coordinates: { lat: 43.6532, lng: -79.3832 } },
  { city: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', coordinates: { lat: 49.2827, lng: -123.1207 } },
  { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', coordinates: { lat: -23.5558, lng: -46.6396 } },
  { city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', coordinates: { lat: -34.6118, lng: -58.3960 } },
  { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', coordinates: { lat: 19.4326, lng: -99.1332 } },
  { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', coordinates: { lat: 30.0444, lng: 31.2357 } },
  { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', coordinates: { lat: -26.2041, lng: 28.0473 } },
];

/**
 * Calculate exact UTC time considering DST rules
 */
export function calculateUTCTime(
  localDateTime: string, 
  timezoneIdentifier: string
): { utcDateTime: string; isDST: boolean; effectiveOffset: number } {
  try {
    const localDate = new Date(localDateTime);
    
    // Use Intl.DateTimeFormat to determine if DST was active at that specific date
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezoneIdentifier,
      timeZoneName: 'longOffset'
    });
    
    const parts = formatter.formatToParts(localDate);
    const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value || '';
    
    // Extract actual UTC offset from the timezone name (e.g., "GMT-05:00" -> -5)
    const offsetMatch = timeZoneName.match(/GMT([+-])(\d{2}):(\d{2})/);
    let effectiveOffset = 0;
    
    if (offsetMatch) {
      const sign = offsetMatch[1] === '+' ? 1 : -1;
      const hours = parseInt(offsetMatch[2]);
      const minutes = parseInt(offsetMatch[3]);
      effectiveOffset = sign * (hours + minutes / 60);
    }
    
    // Determine if DST was active by comparing standard offset
    const timezone = WORLD_TIMEZONES.find(tz => tz.identifier === timezoneIdentifier);
    const isDST = timezone ? Math.abs(effectiveOffset - timezone.utcOffset) > 0.5 : false;
    
    // Calculate UTC time
    const utcTime = new Date(localDate.getTime() - (effectiveOffset * 60 * 60 * 1000));
    
    return {
      utcDateTime: utcTime.toISOString(),
      isDST,
      effectiveOffset
    };
  } catch (error) {
    console.error('Error calculating UTC time:', error);
    throw new Error('Invalid timezone or date format');
  }
}

/**
 * Auto-detect timezone from city name
 */
export function detectTimezoneFromCity(city: string, country?: string): string | null {
  const cityLower = city.toLowerCase();
  const countryLower = country?.toLowerCase();
  
  // First try exact city match
  const exactMatch = CITY_TIMEZONE_MAP.find(location => 
    location.city.toLowerCase() === cityLower && 
    (!country || location.country.toLowerCase().includes(countryLower))
  );
  
  if (exactMatch) {
    return exactMatch.timezone;
  }
  
  // Try partial city match
  const partialMatch = CITY_TIMEZONE_MAP.find(location => 
    location.city.toLowerCase().includes(cityLower) ||
    cityLower.includes(location.city.toLowerCase())
  );
  
  return partialMatch?.timezone || null;
}

/**
 * Get timezone info with DST details
 */
export function getTimezoneInfo(timezoneIdentifier: string): TimezoneInfo | null {
  return WORLD_TIMEZONES.find(tz => tz.identifier === timezoneIdentifier) || null;
}

/**
 * Group timezones by region for better UX
 */
export function getTimezonesByRegion(): Record<string, TimezoneInfo[]> {
  return WORLD_TIMEZONES.reduce((groups, timezone) => {
    const region = timezone.region;
    if (!groups[region]) {
      groups[region] = [];
    }
    groups[region].push(timezone);
    return groups;
  }, {} as Record<string, TimezoneInfo[]>);
}

/**
 * Validate birth time accuracy for astrological calculations
 */
export function validateBirthTimeAccuracy(
  birthDateTime: string,
  timezoneIdentifier: string
): {
  isValid: boolean;
  accuracy: 'exact' | 'approximate' | 'unknown';
  warnings: string[];
  utcTime: string;
  localSolarTime: string;
} {
  const warnings: string[] = [];
  
  try {
    const { utcDateTime, isDST, effectiveOffset } = calculateUTCTime(birthDateTime, timezoneIdentifier);
    
    // Check for common accuracy issues
    const birthTime = new Date(birthDateTime);
    const minutes = birthTime.getMinutes();
    const seconds = birthTime.getSeconds();
    
    let accuracy: 'exact' | 'approximate' | 'unknown' = 'exact';
    
    if (seconds === 0 && minutes % 15 === 0) {
      accuracy = 'approximate';
      warnings.push('Birth time appears rounded to 15-minute intervals. This may affect rising sign accuracy.');
    }
    
    if (minutes === 0 && seconds === 0) {
      accuracy = 'approximate';
      warnings.push('Birth time appears rounded to the hour. Ascendant and house positions may be inaccurate.');
    }
    
    if (isDST) {
      warnings.push('Daylight Saving Time was active during birth. Calculations adjusted automatically.');
    }
    
    // Calculate Local Solar Time (important for traditional calculations)
    const timezone = getTimezoneInfo(timezoneIdentifier);
    const coordinates = CITY_TIMEZONE_MAP.find(city => city.timezone === timezoneIdentifier)?.coordinates;
    
    let localSolarTime = utcDateTime;
    if (coordinates) {
      // Rough solar time adjustment (4 minutes per degree of longitude)
      const solarAdjustment = coordinates.lng * 4; // minutes
      const solarDate = new Date(new Date(utcDateTime).getTime() + (solarAdjustment * 60 * 1000));
      localSolarTime = solarDate.toISOString();
    }
    
    return {
      isValid: true,
      accuracy,
      warnings,
      utcTime: utcDateTime,
      localSolarTime
    };
    
  } catch (error) {
    return {
      isValid: false,
      accuracy: 'unknown',
      warnings: ['Invalid timezone or birth time format'],
      utcTime: '',
      localSolarTime: ''
    };
  }
}