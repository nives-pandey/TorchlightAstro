// Cookie management for personalized experiences
export interface UserPreferences {
  theme: 'auto' | 'light' | 'dark' | 'sanctuary';
  language: 'en' | 'es' | 'ru' | 'fr';
  preferredSystems: string[];
  visitCount: number;
  lastVisit: string;
  timeZone: string;
  favoriteColors: string[];
  personalizedGreeting: boolean;
  notificationTime: string;
  recentInteractions?: Array<{
    action: string;
    timestamp: string;
    data?: any;
  }>;
  birthData?: {
    hasCompleteProfile: boolean;
    systems: string[];
    lastAnalysis: string;
  };
}

export class CookieManager {
  private static COOKIE_NAME = 'torchlight_prefs';
  private static EXPIRES_DAYS = 365;

  static getPreferences(): UserPreferences {
    const defaultPrefs: UserPreferences = {
      theme: 'auto',
      language: 'en',
      preferredSystems: ['western', 'vedic'],
      visitCount: 0,
      lastVisit: '',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      favoriteColors: ['purple', 'pink', 'gold'],
      personalizedGreeting: true,
      notificationTime: '09:00',
    };

    try {
      const cookieValue = this.getCookie(this.COOKIE_NAME);
      if (!cookieValue) return this.initializeFirstVisit(defaultPrefs);
      
      const saved = JSON.parse(cookieValue);
      return { ...defaultPrefs, ...saved };
    } catch (error) {
      console.warn('Failed to parse preferences cookie:', error);
      return defaultPrefs;
    }
  }

  static savePreferences(prefs: Partial<UserPreferences>): void {
    try {
      const currentPrefs = this.getPreferences();
      const updatedPrefs = { ...currentPrefs, ...prefs };
      
      // Update visit tracking
      updatedPrefs.visitCount = (currentPrefs.visitCount || 0) + 1;
      updatedPrefs.lastVisit = new Date().toISOString();
      
      this.setCookie(this.COOKIE_NAME, JSON.stringify(updatedPrefs), this.EXPIRES_DAYS);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  static updateBirthData(birthData: UserPreferences['birthData']): void {
    const prefs = this.getPreferences();
    prefs.birthData = birthData;
    this.savePreferences(prefs);
  }

  static addPreferredSystem(system: string): void {
    const prefs = this.getPreferences();
    if (!prefs.preferredSystems.includes(system)) {
      prefs.preferredSystems.push(system);
      this.savePreferences(prefs);
    }
  }

  static setFavoriteColors(colors: string[]): void {
    this.savePreferences({ favoriteColors: colors });
  }

  static getVisitStatus(): 'first' | 'returning' | 'frequent' {
    const prefs = this.getPreferences();
    if (prefs.visitCount === 0) return 'first';
    if (prefs.visitCount < 5) return 'returning';
    return 'frequent';
  }

  static getPersonalizedGreeting(): string {
    const prefs = this.getPreferences();
    const status = this.getVisitStatus();
    const timeOfDay = this.getTimeBasedGreeting();
    
    if (!prefs.personalizedGreeting) return timeOfDay;
    
    switch (status) {
      case 'first':
        return `${timeOfDay} Welcome to your cosmic journey!`;
      case 'returning':
        return `${timeOfDay} Welcome back, seeker!`;
      case 'frequent':
        return `${timeOfDay} Your cosmic sanctuary awaits.`;
      default:
        return timeOfDay;
    }
  }

  private static initializeFirstVisit(defaultPrefs: UserPreferences): UserPreferences {
    const initialized = {
      ...defaultPrefs,
      visitCount: 1,
      lastVisit: new Date().toISOString(),
    };
    
    this.setCookie(this.COOKIE_NAME, JSON.stringify(initialized), this.EXPIRES_DAYS);
    return initialized;
  }

  private static getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 6) return 'Good night';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  }

  private static setCookie(name: string, value: string, days: number): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
  }

  private static getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
  }

  // Analytics and behavior tracking
  static trackInteraction(action: string, data?: any): void {
    const prefs = this.getPreferences();
    const interaction = {
      action,
      timestamp: new Date().toISOString(),
      data,
    };
    
    // Store recent interactions (last 10)
    const interactions = prefs.recentInteractions || [];
    interactions.unshift(interaction);
    if (interactions.length > 10) interactions.pop();
    
    this.savePreferences({ recentInteractions: interactions });
  }

  static getRecommendedSystems(): string[] {
    const prefs = this.getPreferences();
    const interactions = prefs.recentInteractions || [];
    
    // Analyze interaction patterns to recommend systems
    const systemCounts = interactions.reduce((acc: any, interaction: any) => {
      if (interaction.data?.system) {
        acc[interaction.data.system] = (acc[interaction.data.system] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Return top 3 most interacted systems, fallback to preferences
    const recommended = Object.entries(systemCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([system]) => system);
    
    return recommended.length > 0 ? recommended : prefs.preferredSystems;
  }
}