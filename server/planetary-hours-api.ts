// Planetary Hours API Integration for global timing system
// Documentation: http://www.planetaryhoursapi.com/

interface PlanetaryHoursRequest {
  date: string; // YYYY-MM-DD format
  latitude: number;
  longitude: number;
}

interface PlanetaryHour {
  hour: number;
  planet: string;
  startTime: string;
  endTime: string;
  activities: string[];
}

interface PlanetaryHoursResponse {
  date: string;
  location: {
    latitude: number;
    longitude: number;
  };
  sunrise: string;
  sunset: string;
  dayHours: PlanetaryHour[];
  nightHours: PlanetaryHour[];
  currentHour?: PlanetaryHour;
}

class PlanetaryHoursAPI {
  private baseUrl = 'http://www.planetaryhoursapi.com/api';

  async getPlanetaryHours(request: PlanetaryHoursRequest): Promise<PlanetaryHoursResponse | null> {
    try {
      const url = `${this.baseUrl}/${request.date}/${request.latitude},${request.longitude}`;
      console.log(`Requesting planetary hours from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return this.enhanceWithActivities(data);
    } catch (error) {
      console.error('PlanetaryHoursAPI error:', error);
      return this.generateFallbackHours(request);
    }
  }

  private enhanceWithActivities(data: any): PlanetaryHoursResponse {
    const planetaryActivities = {
      'Sun': ['Career advancement', 'Leadership', 'Authority figures', 'Health matters', 'Fame'],
      'Moon': ['Intuition', 'Domestic affairs', 'Travel', 'Dreams', 'Emotions'],
      'Mercury': ['Communication', 'Learning', 'Business', 'Technology', 'Writing'],
      'Venus': ['Love', 'Art', 'Beauty', 'Social activities', 'Music'],
      'Mars': ['Physical activity', 'Competition', 'Courage', 'Construction', 'Surgery'],
      'Jupiter': ['Legal matters', 'Teaching', 'Expansion', 'Wealth', 'Wisdom'],
      'Saturn': ['Structure', 'Discipline', 'Real estate', 'Agriculture', 'Binding contracts']
    };

    // Enhance hours with activities
    if (data.dayHours) {
      data.dayHours = data.dayHours.map((hour: any) => ({
        ...hour,
        activities: planetaryActivities[hour.planet as keyof typeof planetaryActivities] || ['General activities']
      }));
    }

    if (data.nightHours) {
      data.nightHours = data.nightHours.map((hour: any) => ({
        ...hour,
        activities: planetaryActivities[hour.planet as keyof typeof planetaryActivities] || ['General activities']
      }));
    }

    return data;
  }

  private generateFallbackHours(request: PlanetaryHoursRequest): PlanetaryHoursResponse {
    // Simple fallback calculation when API is unavailable
    const planets = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
    const date = new Date(request.date);
    const dayOfWeek = date.getDay(); // 0 = Sunday
    
    // Simple sunrise/sunset calculation (approximate)
    const sunrise = '06:00';
    const sunset = '18:00';
    
    const dayHours: PlanetaryHour[] = [];
    const nightHours: PlanetaryHour[] = [];
    
    // Generate day hours (sunrise to sunset)
    for (let i = 0; i < 12; i++) {
      const planetIndex = (dayOfWeek + i) % 7;
      const startHour = 6 + i;
      const endHour = 6 + i + 1;
      
      dayHours.push({
        hour: i + 1,
        planet: planets[planetIndex],
        startTime: `${startHour.toString().padStart(2, '0')}:00`,
        endTime: `${endHour.toString().padStart(2, '0')}:00`,
        activities: this.getActivitiesForPlanet(planets[planetIndex])
      });
    }
    
    // Generate night hours (sunset to sunrise)
    for (let i = 0; i < 12; i++) {
      const planetIndex = (dayOfWeek + 12 + i) % 7;
      let startHour = 18 + i;
      let endHour = 18 + i + 1;
      
      if (startHour >= 24) startHour -= 24;
      if (endHour >= 24) endHour -= 24;
      
      nightHours.push({
        hour: i + 1,
        planet: planets[planetIndex],
        startTime: `${startHour.toString().padStart(2, '0')}:00`,
        endTime: `${endHour.toString().padStart(2, '0')}:00`,
        activities: this.getActivitiesForPlanet(planets[planetIndex])
      });
    }
    
    return {
      date: request.date,
      location: {
        latitude: request.latitude,
        longitude: request.longitude
      },
      sunrise,
      sunset,
      dayHours,
      nightHours
    };
  }

  private getActivitiesForPlanet(planet: string): string[] {
    const activities = {
      'Sun': ['Career advancement', 'Leadership', 'Authority figures', 'Health matters'],
      'Moon': ['Intuition', 'Domestic affairs', 'Travel', 'Dreams'],
      'Mercury': ['Communication', 'Learning', 'Business', 'Technology'],
      'Venus': ['Love', 'Art', 'Beauty', 'Social activities'],
      'Mars': ['Physical activity', 'Competition', 'Courage', 'Construction'],
      'Jupiter': ['Legal matters', 'Teaching', 'Expansion', 'Wealth'],
      'Saturn': ['Structure', 'Discipline', 'Real estate', 'Agriculture']
    };
    
    return activities[planet as keyof typeof activities] || ['General activities'];
  }

  getCurrentPlanetaryHour(hours: PlanetaryHoursResponse): PlanetaryHour | null {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Check day hours
    for (const hour of hours.dayHours) {
      if (currentTime >= hour.startTime && currentTime < hour.endTime) {
        return hour;
      }
    }
    
    // Check night hours
    for (const hour of hours.nightHours) {
      if (currentTime >= hour.startTime && currentTime < hour.endTime) {
        return hour;
      }
    }
    
    return null;
  }

  async getGlobalTiming(latitude: number, longitude: number, date?: string): Promise<{
    planetaryHours: PlanetaryHoursResponse;
    currentHour: PlanetaryHour | null;
    recommendations: string[];
  }> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const planetaryHours = await this.getPlanetaryHours({
      date: targetDate,
      latitude,
      longitude
    });
    
    if (!planetaryHours) {
      throw new Error('Unable to retrieve planetary hours');
    }
    
    const currentHour = this.getCurrentPlanetaryHour(planetaryHours);
    
    const recommendations = currentHour 
      ? [`Current ${currentHour.planet} hour is optimal for: ${currentHour.activities.join(', ')}`]
      : ['Check current time against planetary hours for optimal timing'];
    
    return {
      planetaryHours,
      currentHour,
      recommendations
    };
  }
}

export const planetaryHoursAPI = new PlanetaryHoursAPI();
export type { PlanetaryHoursRequest, PlanetaryHour, PlanetaryHoursResponse };