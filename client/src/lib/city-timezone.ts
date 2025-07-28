// Comprehensive city database with timezone and DST information
export interface CityData {
  city: string;
  country: string;
  timezone: string;
  utcOffset: number; // Standard time offset from UTC in hours
  dstOffset?: number; // DST offset if applicable
  latitude: number;
  longitude: number;
  dstStart?: string; // DST start date pattern (e.g., "last Sunday in March")
  dstEnd?: string; // DST end date pattern
}

export const majorCities: CityData[] = [
  // Europe
  {
    city: "Paris",
    country: "France", 
    timezone: "Europe/Paris",
    utcOffset: 1,
    dstOffset: 2,
    latitude: 48.8566,
    longitude: 2.3522,
    dstStart: "last Sunday in March",
    dstEnd: "last Sunday in October"
  },
  {
    city: "London",
    country: "United Kingdom",
    timezone: "Europe/London", 
    utcOffset: 0,
    dstOffset: 1,
    latitude: 51.5074,
    longitude: -0.1278,
    dstStart: "last Sunday in March",
    dstEnd: "last Sunday in October"
  },
  {
    city: "Berlin",
    country: "Germany",
    timezone: "Europe/Berlin",
    utcOffset: 1,
    dstOffset: 2, 
    latitude: 52.5200,
    longitude: 13.4050,
    dstStart: "last Sunday in March",
    dstEnd: "last Sunday in October"
  },
  {
    city: "Rome",
    country: "Italy",
    timezone: "Europe/Rome",
    utcOffset: 1,
    dstOffset: 2,
    latitude: 41.9028,
    longitude: 12.4964,
    dstStart: "last Sunday in March", 
    dstEnd: "last Sunday in October"
  },
  {
    city: "Madrid",
    country: "Spain",
    timezone: "Europe/Madrid",
    utcOffset: 1,
    dstOffset: 2,
    latitude: 40.4168,
    longitude: -3.7038,
    dstStart: "last Sunday in March",
    dstEnd: "last Sunday in October"
  },

  // North America
  {
    city: "New York",
    country: "United States",
    timezone: "America/New_York",
    utcOffset: -5,
    dstOffset: -4,
    latitude: 40.7128,
    longitude: -74.0060,
    dstStart: "second Sunday in March",
    dstEnd: "first Sunday in November"
  },
  {
    city: "Los Angeles", 
    country: "United States",
    timezone: "America/Los_Angeles",
    utcOffset: -8,
    dstOffset: -7,
    latitude: 34.0522,
    longitude: -118.2437,
    dstStart: "second Sunday in March",
    dstEnd: "first Sunday in November"
  },
  {
    city: "Chicago",
    country: "United States", 
    timezone: "America/Chicago",
    utcOffset: -6,
    dstOffset: -5,
    latitude: 41.8781,
    longitude: -87.6298,
    dstStart: "second Sunday in March",
    dstEnd: "first Sunday in November"
  },
  {
    city: "Toronto",
    country: "Canada",
    timezone: "America/Toronto",
    utcOffset: -5,
    dstOffset: -4,
    latitude: 43.6532,
    longitude: -79.3832,
    dstStart: "second Sunday in March",
    dstEnd: "first Sunday in November"
  },

  // Asia
  {
    city: "Mumbai",
    country: "India",
    timezone: "Asia/Kolkata",
    utcOffset: 5.5,
    latitude: 19.0760,
    longitude: 72.8777
  },
  {
    city: "Delhi",
    country: "India", 
    timezone: "Asia/Kolkata",
    utcOffset: 5.5,
    latitude: 28.7041,
    longitude: 77.1025
  },
  {
    city: "Bangalore",
    country: "India",
    timezone: "Asia/Kolkata", 
    utcOffset: 5.5,
    latitude: 12.9716,
    longitude: 77.5946
  },
  {
    city: "Tokyo",
    country: "Japan",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.6762,
    longitude: 139.6503
  },
  {
    city: "Beijing",
    country: "China",
    timezone: "Asia/Shanghai",
    utcOffset: 8,
    latitude: 39.9042,
    longitude: 116.4074
  },
  {
    city: "Singapore",
    country: "Singapore",
    timezone: "Asia/Singapore", 
    utcOffset: 8,
    latitude: 1.3521,
    longitude: 103.8198
  },
  {
    city: "Dubai",
    country: "UAE",
    timezone: "Asia/Dubai",
    utcOffset: 4,
    latitude: 25.2048,
    longitude: 55.2708
  },

  // Australia & Oceania
  {
    city: "Sydney",
    country: "Australia",
    timezone: "Australia/Sydney",
    utcOffset: 10,
    dstOffset: 11,
    latitude: -33.8688,
    longitude: 151.2093,
    dstStart: "first Sunday in October",
    dstEnd: "first Sunday in April"
  },
  {
    city: "Melbourne",
    country: "Australia",
    timezone: "Australia/Melbourne", 
    utcOffset: 10,
    dstOffset: 11,
    latitude: -37.8136,
    longitude: 144.9631,
    dstStart: "first Sunday in October",
    dstEnd: "first Sunday in April"
  },

  // Africa
  {
    city: "Cairo",
    country: "Egypt",
    timezone: "Africa/Cairo",
    utcOffset: 2,
    latitude: 30.0444,
    longitude: 31.2357
  },
  {
    city: "Johannesburg",
    country: "South Africa",
    timezone: "Africa/Johannesburg",
    utcOffset: 2,
    latitude: -26.2041,
    longitude: 28.0473
  },

  // South America
  {
    city: "São Paulo",
    country: "Brazil",
    timezone: "America/Sao_Paulo",
    utcOffset: -3,
    latitude: -23.5558,
    longitude: -46.6396
  },
  {
    city: "Buenos Aires", 
    country: "Argentina",
    timezone: "America/Argentina/Buenos_Aires",
    utcOffset: -3,
    latitude: -34.6037,
    longitude: -58.3816
  }
];

export function searchCities(query: string): CityData[] {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  return majorCities.filter(city => 
    city.city.toLowerCase().includes(searchTerm) ||
    city.country.toLowerCase().includes(searchTerm)
  ).slice(0, 8); // Limit to 8 results for better UX
}

export function getTimezoneForDate(city: CityData, date: Date): number {
  if (!city.dstOffset || !city.dstStart || !city.dstEnd) {
    return city.utcOffset;
  }

  // Check if date falls within DST period
  const year = date.getFullYear();
  const dstStart = calculateDSTDate(city.dstStart, year);
  const dstEnd = calculateDSTDate(city.dstEnd, year);

  if (city.dstStart.includes("March") && city.dstEnd.includes("October")) {
    // Northern hemisphere DST
    if (date >= dstStart && date < dstEnd) {
      return city.dstOffset;
    }
  } else if (city.dstStart.includes("October") && city.dstEnd.includes("April")) {
    // Southern hemisphere DST 
    if (date >= dstStart || date < dstEnd) {
      return city.dstOffset;
    }
  }

  return city.utcOffset;
}

function calculateDSTDate(pattern: string, year: number): Date {
  // Simplified DST calculation - in production, use a proper timezone library
  if (pattern.includes("last Sunday in March")) {
    return getLastSundayOfMonth(year, 2); // March is month 2 (0-indexed)
  } else if (pattern.includes("last Sunday in October")) {
    return getLastSundayOfMonth(year, 9); // October is month 9
  } else if (pattern.includes("second Sunday in March")) {
    return getNthSundayOfMonth(year, 2, 2);
  } else if (pattern.includes("first Sunday in November")) {
    return getNthSundayOfMonth(year, 10, 1); // November is month 10
  } else if (pattern.includes("first Sunday in October")) {
    return getNthSundayOfMonth(year, 9, 1);
  } else if (pattern.includes("first Sunday in April")) {
    return getNthSundayOfMonth(year, 3, 1); // April is month 3
  }
  
  return new Date(year, 0, 1); // Fallback
}

function getLastSundayOfMonth(year: number, month: number): Date {
  const lastDay = new Date(year, month + 1, 0);
  const lastSunday = new Date(lastDay);
  lastSunday.setDate(lastDay.getDate() - lastDay.getDay());
  return lastSunday;
}

function getNthSundayOfMonth(year: number, month: number, nth: number): Date {
  const firstDay = new Date(year, month, 1);
  const firstSunday = new Date(firstDay);
  firstSunday.setDate(1 + (7 - firstDay.getDay()) % 7);
  
  const targetSunday = new Date(firstSunday);
  targetSunday.setDate(firstSunday.getDate() + (nth - 1) * 7);
  
  return targetSunday;
}