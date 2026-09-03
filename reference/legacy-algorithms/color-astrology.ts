// Color Astrology - Personal color analysis based on birth data and astrological factors
export class ColorAstrology {
  
  /**
   * Calculate personal color profile based on birth date and astrological factors
   */
  static calculatePersonalColors(birthDate: Date, sunSign: string, moonSign?: string): {
    primaryColors: string[];
    secondaryColors: string[];
    luckyColors: string[];
    avoidColors: string[];
    dailyColors: { [day: string]: string };
    monthlyColors: { [month: string]: string };
    chakraColors: string[];
    powerColor: string;
    healingColor: string;
    relationshipColor: string;
  } {
    const lifePath = this.calculateLifePathNumber(birthDate);
    const birthMonth = birthDate.getMonth() + 1;
    const birthDay = birthDate.getDate();
    
    return {
      primaryColors: this.getPrimaryColors(sunSign, lifePath),
      secondaryColors: this.getSecondaryColors(moonSign || sunSign, birthMonth),
      luckyColors: this.getLuckyColors(lifePath, birthDay),
      avoidColors: this.getColorsToAvoid(sunSign, lifePath),
      dailyColors: this.getDailyColors(sunSign),
      monthlyColors: this.getMonthlyColors(),
      chakraColors: this.getChakraColors(lifePath),
      powerColor: this.getPowerColor(sunSign, lifePath),
      healingColor: this.getHealingColor(birthMonth, lifePath),
      relationshipColor: this.getRelationshipColor(sunSign)
    };
  }

  /**
   * Get colors for specific purposes and timing
   */
  static getColorGuidance(purpose: string, birthDate: Date, sunSign: string): {
    recommendedColors: string[];
    timing: string;
    usage: string;
    meaning: string;
  } {
    const lifePath = this.calculateLifePathNumber(birthDate);
    const purposes = {
      'career': {
        colors: this.getCareerColors(sunSign, lifePath),
        timing: 'Wear during important meetings and career-focused days',
        usage: 'Business attire, office decor, accessories',
        meaning: 'Colors that enhance professional success and leadership qualities'
      },
      'love': {
        colors: this.getLoveColors(sunSign),
        timing: 'Wear on dates and romantic occasions',
        usage: 'Romantic outfits, gifts, bedroom decor',
        meaning: 'Colors that attract love and enhance romantic relationships'
      },
      'health': {
        colors: this.getHealingColors(lifePath),
        timing: 'Use during illness or stress recovery',
        usage: 'Home decor, meditation space, healing practices',
        meaning: 'Colors that promote physical and emotional healing'
      },
      'creativity': {
        colors: this.getCreativeColors(sunSign, lifePath),
        timing: 'Use during creative projects and artistic work',
        usage: 'Art supplies, creative workspace, inspiration boards',
        meaning: 'Colors that stimulate imagination and creative expression'
      },
      'meditation': {
        colors: this.getMeditationColors(lifePath),
        timing: 'Use during spiritual practices and quiet reflection',
        usage: 'Meditation space, spiritual practices, quiet time',
        meaning: 'Colors that enhance spiritual connection and inner peace'
      },
      'protection': {
        colors: this.getProtectionColors(sunSign),
        timing: 'Use during challenging times or difficult situations',
        usage: 'Personal accessories, home entrance, protective items',
        meaning: 'Colors that provide energetic protection and strength'
      }
    };
    
    return purposes[purpose.toLowerCase()] || {
      recommendedColors: ['White', 'Silver'],
      timing: 'Use as needed',
      usage: 'General purposes',
      meaning: 'Universal colors for balance and clarity'
    };
  }

  // Helper methods
  private static calculateLifePathNumber(birthDate: Date): number {
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    const year = birthDate.getFullYear();
    
    let total = this.sumDigits(day) + this.sumDigits(month) + this.sumDigits(year);
    
    while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
      total = this.sumDigits(total);
    }
    
    return total;
  }

  private static sumDigits(num: number): number {
    return num.toString().split('').map(Number).reduce((sum, digit) => sum + digit, 0);
  }

  private static getPrimaryColors(sunSign: string, lifePath: number): string[] {
    const signColors = {
      'Aries': ['Red', 'Orange', 'Scarlet'],
      'Taurus': ['Green', 'Pink', 'Earth tones'],
      'Gemini': ['Yellow', 'Silver', 'Light Blue'],
      'Cancer': ['White', 'Silver', 'Sea Green'],
      'Leo': ['Gold', 'Orange', 'Yellow'],
      'Virgo': ['Navy Blue', 'Grey', 'Brown'],
      'Libra': ['Pink', 'Light Blue', 'Lavender'],
      'Scorpio': ['Deep Red', 'Black', 'Maroon'],
      'Sagittarius': ['Purple', 'Turquoise', 'Royal Blue'],
      'Capricorn': ['Black', 'Brown', 'Dark Green'],
      'Aquarius': ['Electric Blue', 'Turquoise', 'Silver'],
      'Pisces': ['Sea Green', 'Lavender', 'Aqua']
    };

    const lifePathColors = {
      1: ['Red', 'Orange', 'Gold'],
      2: ['Orange', 'Peach', 'Coral'],
      3: ['Yellow', 'Bright colors'],
      4: ['Green', 'Earth tones'],
      5: ['Blue', 'Turquoise'],
      6: ['Indigo', 'Deep Blue'],
      7: ['Violet', 'Purple'],
      8: ['Pink', 'Rose'],
      9: ['All colors', 'Rainbow'],
      11: ['Silver', 'White'],
      22: ['Gold', 'Yellow'],
      33: ['Emerald Green', 'Teal']
    };

    const signColor = signColors[sunSign] || ['White'];
    const pathColor = lifePathColors[lifePath] || ['Silver'];
    
    return [...new Set([...signColor, ...pathColor])];
  }

  private static getSecondaryColors(moonSign: string, birthMonth: number): string[] {
    const moonColors = {
      'Aries': ['Coral', 'Salmon'],
      'Taurus': ['Mint Green', 'Sage'],
      'Gemini': ['Lemon Yellow', 'Cream'],
      'Cancer': ['Pearl', 'Ice Blue'],
      'Leo': ['Amber', 'Honey'],
      'Virgo': ['Taupe', 'Khaki'],
      'Libra': ['Rose', 'Powder Blue'],
      'Scorpio': ['Burgundy', 'Wine'],
      'Sagittarius': ['Periwinkle', 'Mauve'],
      'Capricorn': ['Charcoal', 'Olive'],
      'Aquarius': ['Cyan', 'Teal'],
      'Pisces': ['Mint', 'Seafoam']
    };

    const monthColors = [
      ['Garnet Red', 'Deep Red'], // January
      ['Amethyst Purple', 'Violet'], // February
      ['Aquamarine Blue', 'Pale Blue'], // March
      ['Diamond Clear', 'Crystal'], // April
      ['Emerald Green', 'Fresh Green'], // May
      ['Pearl White', 'Cream'], // June
      ['Ruby Red', 'Cherry'], // July
      ['Peridot Green', 'Lime'], // August
      ['Sapphire Blue', 'Royal Blue'], // September
      ['Opal Multi', 'Iridescent'], // October
      ['Topaz Yellow', 'Golden'], // November
      ['Turquoise Blue', 'Sky Blue'] // December
    ];

    const moon = moonColors[moonSign] || ['Silver'];
    const month = monthColors[birthMonth - 1] || ['White'];
    
    return [...new Set([...moon, ...month])];
  }

  private static getLuckyColors(lifePath: number, birthDay: number): string[] {
    const luckyByLifePath = {
      1: ['Gold', 'Orange', 'Yellow'],
      2: ['White', 'Cream', 'Silver'],
      3: ['Yellow', 'Pink', 'Light Blue'],
      4: ['Blue', 'Grey', 'Green'],
      5: ['Grey', 'White', 'Light colors'],
      6: ['Blue', 'Pink', 'White'],
      7: ['Green', 'Yellow', 'White'],
      8: ['Black', 'Dark Blue', 'Brown'],
      9: ['Red', 'Pink', 'Rose'],
      11: ['Silver', 'White', 'Crystal'],
      22: ['Gold', 'Yellow', 'Orange'],
      33: ['Green', 'Blue', 'White']
    };

    const dayLucky = birthDay % 7;
    const dayColors = [
      ['Red', 'Maroon'], // 0 - Sunday colors
      ['White', 'Silver'], // 1 - Monday colors  
      ['Red', 'Pink'], // 2 - Tuesday colors
      ['Green', 'Yellow'], // 3 - Wednesday colors
      ['Yellow', 'Orange'], // 4 - Thursday colors
      ['Blue', 'White'], // 5 - Friday colors
      ['Purple', 'Black'] // 6 - Saturday colors
    ];

    const pathColors = luckyByLifePath[lifePath] || ['Silver'];
    const dayColor = dayColors[dayLucky] || ['White'];
    
    return [...new Set([...pathColors, ...dayColor])];
  }

  private static getColorsToAvoid(sunSign: string, lifePath: number): string[] {
    const avoidBySun = {
      'Aries': ['Black', 'Dark Blue'],
      'Taurus': ['Red', 'Bright Orange'],
      'Gemini': ['Dark colors', 'Black'],
      'Cancer': ['Bright Red', 'Orange'],
      'Leo': ['Black', 'Dark Blue'],
      'Virgo': ['Bright Red', 'Hot Pink'],
      'Libra': ['Black', 'Dark Brown'],
      'Scorpio': ['Bright Yellow', 'Light colors'],
      'Sagittarius': ['Black', 'Dark Grey'],
      'Capricorn': ['Bright colors', 'Neon'],
      'Aquarius': ['Brown', 'Dark colors'],
      'Pisces': ['Bright Red', 'Orange']
    };

    const avoidByPath = {
      1: ['Black', 'Dark colors'],
      2: ['Red', 'Bright colors'],
      3: ['Black', 'Dark Blue'],
      4: ['Pink', 'Light colors'],
      5: ['Red', 'Dark colors'],
      6: ['Black', 'Dark Grey'],
      7: ['Red', 'Bright Orange'],
      8: ['Pink', 'Light colors'],
      9: ['Black', 'Dark colors']
    };

    const sunAvoid = avoidBySun[sunSign] || [];
    const pathAvoid = avoidByPath[lifePath] || [];
    
    return [...new Set([...sunAvoid, ...pathAvoid])];
  }

  private static getDailyColors(sunSign: string): { [day: string]: string } {
    return {
      'Sunday': 'Gold', // Sun day
      'Monday': 'Silver', // Moon day
      'Tuesday': 'Red', // Mars day
      'Wednesday': 'Green', // Mercury day
      'Thursday': 'Yellow', // Jupiter day
      'Friday': 'Blue', // Venus day
      'Saturday': 'Purple' // Saturn day
    };
  }

  private static getMonthlyColors(): { [month: string]: string } {
    return {
      'January': 'Deep Red',
      'February': 'Purple',
      'March': 'Light Blue',
      'April': 'Clear White',
      'May': 'Green',
      'June': 'Pearl White',
      'July': 'Ruby Red',
      'August': 'Light Green',
      'September': 'Deep Blue',
      'October': 'Multi-colored',
      'November': 'Golden Yellow',
      'December': 'Sky Blue'
    };
  }

  private static getChakraColors(lifePath: number): string[] {
    const chakraBase = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'];
    
    // Emphasize certain chakras based on life path
    const emphasis = {
      1: [0, 2], // Root and Solar Plexus
      2: [1, 3], // Sacral and Heart
      3: [2, 4], // Solar Plexus and Throat
      4: [0, 3], // Root and Heart
      5: [2, 4], // Solar Plexus and Throat
      6: [3, 5], // Heart and Third Eye
      7: [5, 6], // Third Eye and Crown
      8: [0, 2], // Root and Solar Plexus
      9: [3, 6], // Heart and Crown
      11: [5, 6], // Third Eye and Crown
      22: [0, 6], // Root and Crown
      33: [3, 6]  // Heart and Crown
    };

    const emphasizeIndices = emphasis[lifePath] || [3]; // Default to Heart
    const result = [...chakraBase];
    
    // Add emphasized colors twice for importance
    emphasizeIndices.forEach(index => {
      result.push(chakraBase[index]);
    });
    
    return result;
  }

  private static getPowerColor(sunSign: string, lifePath: number): string {
    const powerColors = {
      'Aries': 'Red',
      'Taurus': 'Green',
      'Gemini': 'Silver',
      'Cancer': 'White',
      'Leo': 'Gold',
      'Virgo': 'Navy Blue',
      'Libra': 'Pink',
      'Scorpio': 'Deep Red',
      'Sagittarius': 'Purple',
      'Capricorn': 'Black',
      'Aquarius': 'Electric Blue',
      'Pisces': 'Sea Green'
    };

    return powerColors[sunSign] || 'White';
  }

  private static getHealingColor(birthMonth: number, lifePath: number): string {
    const healingColors = [
      'Deep Red', 'Violet', 'Aqua', 'Clear', 'Green',
      'Pearl', 'Ruby', 'Peridot', 'Sapphire', 'Opal',
      'Topaz', 'Turquoise'
    ];

    return healingColors[birthMonth - 1] || 'White';
  }

  private static getRelationshipColor(sunSign: string): string {
    const relationshipColors = {
      'Aries': 'Pink',
      'Taurus': 'Rose',
      'Gemini': 'Light Blue',
      'Cancer': 'Silver',
      'Leo': 'Orange',
      'Virgo': 'Lavender',
      'Libra': 'Pink',
      'Scorpio': 'Deep Rose',
      'Sagittarius': 'Light Purple',
      'Capricorn': 'Burgundy',
      'Aquarius': 'Turquoise',
      'Pisces': 'Seafoam'
    };

    return relationshipColors[sunSign] || 'Pink';
  }

  private static getCareerColors(sunSign: string, lifePath: number): string[] {
    return ['Navy Blue', 'Black', 'Grey', 'White'];
  }

  private static getLoveColors(sunSign: string): string[] {
    return ['Pink', 'Rose', 'Red', 'Coral'];
  }

  private static getHealingColors(lifePath: number): string[] {
    return ['Green', 'Blue', 'White', 'Lavender'];
  }

  private static getCreativeColors(sunSign: string, lifePath: number): string[] {
    return ['Yellow', 'Orange', 'Purple', 'Bright colors'];
  }

  private static getMeditationColors(lifePath: number): string[] {
    return ['Purple', 'Indigo', 'White', 'Silver'];
  }

  private static getProtectionColors(sunSign: string): string[] {
    return ['Black', 'Deep Blue', 'Silver', 'White'];
  }
}