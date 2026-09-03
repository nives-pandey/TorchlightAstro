// Gemstone and Crystal Astrology - Personal stone recommendations based on astrological factors
export class GemstoneAstrology {
  
  /**
   * Calculate personal gemstone recommendations based on birth data
   */
  static calculatePersonalGemstones(birthDate: Date, sunSign: string, moonSign?: string): {
    primaryStones: any[];
    secondaryStones: any[];
    birthStones: any[];
    chakraStones: any[];
    protectionStones: any[];
    healingStones: any[];
    luckStones: any[];
    careerStones: any[];
    loveStones: any[];
    wearingGuidance: any;
  } {
    const lifePath = this.calculateLifePathNumber(birthDate);
    const birthMonth = birthDate.getMonth() + 1;
    
    return {
      primaryStones: this.getPrimaryStones(sunSign),
      secondaryStones: this.getSecondaryStones(moonSign || sunSign),
      birthStones: this.getBirthStones(birthMonth),
      chakraStones: this.getChakraStones(lifePath),
      protectionStones: this.getProtectionStones(sunSign),
      healingStones: this.getHealingStones(lifePath, birthMonth),
      luckStones: this.getLuckStones(lifePath),
      careerStones: this.getCareerStones(sunSign, lifePath),
      loveStones: this.getLoveStones(sunSign),
      wearingGuidance: this.getWearingGuidance(sunSign, lifePath)
    };
  }

  /**
   * Get specific gemstone recommendations for different purposes
   */
  static getGemstoneForPurpose(purpose: string, birthDate: Date, sunSign: string): {
    recommendedStones: any[];
    howToUse: string;
    timing: string;
    placement: string;
    cleansing: string;
  } {
    const lifePath = this.calculateLifePathNumber(birthDate);
    
    const purposes = {
      'meditation': {
        stones: this.getMeditationStones(lifePath),
        howToUse: 'Hold in hands during meditation or place on third eye chakra',
        timing: 'During spiritual practices and quiet reflection',
        placement: 'Meditation space, altar, or worn as pendant',
        cleansing: 'Moonlight cleansing and sage smudging'
      },
      'protection': {
        stones: this.getProtectionStones(sunSign),
        howToUse: 'Wear as jewelry or carry in pocket',
        timing: 'During challenging situations or travel',
        placement: 'On person, in home entrance, or car',
        cleansing: 'Salt water cleansing and sunlight charging'
      },
      'healing': {
        stones: this.getHealingStones(lifePath, birthDate.getMonth() + 1),
        howToUse: 'Place on affected area or wear close to body',
        timing: 'During illness or emotional distress',
        placement: 'On body, bedside, or healing space',
        cleansing: 'Running water and crystal cleansing'
      },
      'prosperity': {
        stones: this.getProsperityStones(lifePath),
        howToUse: 'Keep in wallet, business area, or wear as ring',
        timing: 'During business activities and financial decisions',
        placement: 'Workspace, cash register, or financial documents',
        cleansing: 'Earth burial and full moon charging'
      },
      'love': {
        stones: this.getLoveStones(sunSign),
        howToUse: 'Wear over heart chakra or keep in bedroom',
        timing: 'During relationship work and romantic occasions',
        placement: 'Bedroom, relationship corner of home, or worn as necklace',
        cleansing: 'Rose water cleansing and pink candle charging'
      },
      'creativity': {
        stones: this.getCreativityStones(sunSign, lifePath),
        howToUse: 'Keep in creative workspace or wear during artistic work',
        timing: 'During creative projects and artistic expression',
        placement: 'Art studio, creative workspace, or worn as bracelet',
        cleansing: 'Sound cleansing with singing bowls'
      }
    };
    
    return purposes[purpose.toLowerCase()] || {
      recommendedStones: [this.getUniversalStone()],
      howToUse: 'Wear or carry as needed',
      timing: 'As desired',
      placement: 'Personal preference',
      cleansing: 'Standard cleansing methods'
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

  private static getPrimaryStones(sunSign: string): any[] {
    const signStones = {
      'Aries': [
        { name: 'Diamond', properties: ['Strength', 'Courage', 'Clarity'], chakra: 'Crown', color: 'Clear' },
        { name: 'Ruby', properties: ['Passion', 'Energy', 'Leadership'], chakra: 'Root', color: 'Red' },
        { name: 'Bloodstone', properties: ['Courage', 'Vitality', 'Strength'], chakra: 'Root', color: 'Green with Red' }
      ],
      'Taurus': [
        { name: 'Emerald', properties: ['Love', 'Healing', 'Prosperity'], chakra: 'Heart', color: 'Green' },
        { name: 'Rose Quartz', properties: ['Love', 'Compassion', 'Emotional healing'], chakra: 'Heart', color: 'Pink' },
        { name: 'Sapphire', properties: ['Wisdom', 'Truth', 'Spiritual insight'], chakra: 'Throat', color: 'Blue' }
      ],
      'Gemini': [
        { name: 'Agate', properties: ['Communication', 'Mental clarity', 'Balance'], chakra: 'Throat', color: 'Various' },
        { name: 'Citrine', properties: ['Mental clarity', 'Creativity', 'Joy'], chakra: 'Solar Plexus', color: 'Yellow' },
        { name: 'Pearl', properties: ['Wisdom', 'Purity', 'Emotional balance'], chakra: 'Sacral', color: 'White' }
      ],
      'Cancer': [
        { name: 'Moonstone', properties: ['Intuition', 'Emotional balance', 'New beginnings'], chakra: 'Sacral', color: 'White/Blue' },
        { name: 'Pearl', properties: ['Purity', 'Wisdom', 'Emotional healing'], chakra: 'Sacral', color: 'White' },
        { name: 'Ruby', properties: ['Emotional strength', 'Passion', 'Protection'], chakra: 'Heart', color: 'Red' }
      ],
      'Leo': [
        { name: 'Peridot', properties: ['Joy', 'Confidence', 'Prosperity'], chakra: 'Heart', color: 'Green' },
        { name: 'Citrine', properties: ['Confidence', 'Success', 'Abundance'], chakra: 'Solar Plexus', color: 'Yellow' },
        { name: 'Sunstone', properties: ['Leadership', 'Vitality', 'Joy'], chakra: 'Solar Plexus', color: 'Orange' }
      ],
      'Virgo': [
        { name: 'Sapphire', properties: ['Wisdom', 'Mental clarity', 'Truth'], chakra: 'Throat', color: 'Blue' },
        { name: 'Carnelian', properties: ['Confidence', 'Creativity', 'Motivation'], chakra: 'Sacral', color: 'Orange' },
        { name: 'Amazonite', properties: ['Truth', 'Communication', 'Harmony'], chakra: 'Throat', color: 'Blue-Green' }
      ],
      'Libra': [
        { name: 'Opal', properties: ['Balance', 'Creativity', 'Emotional healing'], chakra: 'Heart', color: 'Iridescent' },
        { name: 'Lapis Lazuli', properties: ['Truth', 'Wisdom', 'Communication'], chakra: 'Throat', color: 'Blue' },
        { name: 'Rose Quartz', properties: ['Love', 'Harmony', 'Emotional healing'], chakra: 'Heart', color: 'Pink' }
      ],
      'Scorpio': [
        { name: 'Topaz', properties: ['Transformation', 'Healing', 'Protection'], chakra: 'Solar Plexus', color: 'Golden' },
        { name: 'Garnet', properties: ['Passion', 'Energy', 'Regeneration'], chakra: 'Root', color: 'Red' },
        { name: 'Obsidian', properties: ['Protection', 'Grounding', 'Truth'], chakra: 'Root', color: 'Black' }
      ],
      'Sagittarius': [
        { name: 'Turquoise', properties: ['Wisdom', 'Protection', 'Communication'], chakra: 'Throat', color: 'Blue-Green' },
        { name: 'Tanzanite', properties: ['Spiritual awareness', 'Transformation', 'Communication'], chakra: 'Third Eye', color: 'Blue-Purple' },
        { name: 'Sodalite', properties: ['Truth', 'Logic', 'Communication'], chakra: 'Throat', color: 'Blue' }
      ],
      'Capricorn': [
        { name: 'Garnet', properties: ['Success', 'Strength', 'Prosperity'], chakra: 'Root', color: 'Red' },
        { name: 'Black Tourmaline', properties: ['Protection', 'Grounding', 'Strength'], chakra: 'Root', color: 'Black' },
        { name: 'Onyx', properties: ['Strength', 'Support', 'Grounding'], chakra: 'Root', color: 'Black' }
      ],
      'Aquarius': [
        { name: 'Amethyst', properties: ['Spiritual awareness', 'Intuition', 'Peace'], chakra: 'Crown', color: 'Purple' },
        { name: 'Aquamarine', properties: ['Communication', 'Clarity', 'Courage'], chakra: 'Throat', color: 'Blue' },
        { name: 'Fluorite', properties: ['Mental clarity', 'Focus', 'Spiritual growth'], chakra: 'Third Eye', color: 'Purple/Green' }
      ],
      'Pisces': [
        { name: 'Aquamarine', properties: ['Intuition', 'Emotional healing', 'Communication'], chakra: 'Throat', color: 'Blue' },
        { name: 'Amethyst', properties: ['Spiritual connection', 'Intuition', 'Peace'], chakra: 'Crown', color: 'Purple' },
        { name: 'Moonstone', properties: ['Intuition', 'Emotional balance', 'Psychic abilities'], chakra: 'Third Eye', color: 'White' }
      ]
    };
    
    return signStones[sunSign] || [this.getUniversalStone()];
  }

  private static getSecondaryStones(moonSign: string): any[] {
    // Moon sign stones for emotional and subconscious support
    return this.getPrimaryStones(moonSign).map(stone => ({
      ...stone,
      purpose: 'Emotional support and subconscious healing'
    }));
  }

  private static getBirthStones(month: number): any[] {
    const birthStones = [
      [{ name: 'Garnet', properties: ['Strength', 'Protection', 'Healing'], color: 'Red' }], // January
      [{ name: 'Amethyst', properties: ['Peace', 'Spirituality', 'Sobriety'], color: 'Purple' }], // February
      [{ name: 'Aquamarine', properties: ['Courage', 'Communication', 'Clarity'], color: 'Blue' }], // March
      [{ name: 'Diamond', properties: ['Strength', 'Purity', 'Innocence'], color: 'Clear' }], // April
      [{ name: 'Emerald', properties: ['Love', 'Rebirth', 'Fertility'], color: 'Green' }], // May
      [{ name: 'Pearl', properties: ['Purity', 'Wisdom', 'Integrity'], color: 'White' }], // June
      [{ name: 'Ruby', properties: ['Love', 'Passion', 'Protection'], color: 'Red' }], // July
      [{ name: 'Peridot', properties: ['Strength', 'Influence', 'Protection'], color: 'Green' }], // August
      [{ name: 'Sapphire', properties: ['Wisdom', 'Virtue', 'Fortune'], color: 'Blue' }], // September
      [{ name: 'Opal', properties: ['Hope', 'Purity', 'Truth'], color: 'Iridescent' }], // October
      [{ name: 'Topaz', properties: ['Love', 'Affection', 'Fortune'], color: 'Golden' }], // November
      [{ name: 'Turquoise', properties: ['Success', 'Fortune', 'Protection'], color: 'Blue-Green' }] // December
    ];
    
    return birthStones[month - 1] || [this.getUniversalStone()];
  }

  private static getChakraStones(lifePath: number): any[] {
    const chakraStones = [
      { name: 'Red Jasper', chakra: 'Root', properties: ['Grounding', 'Stability', 'Strength'], color: 'Red' },
      { name: 'Carnelian', chakra: 'Sacral', properties: ['Creativity', 'Sexuality', 'Emotion'], color: 'Orange' },
      { name: 'Citrine', chakra: 'Solar Plexus', properties: ['Personal power', 'Confidence', 'Will'], color: 'Yellow' },
      { name: 'Green Aventurine', chakra: 'Heart', properties: ['Love', 'Compassion', 'Healing'], color: 'Green' },
      { name: 'Blue Lace Agate', chakra: 'Throat', properties: ['Communication', 'Truth', 'Expression'], color: 'Blue' },
      { name: 'Sodalite', chakra: 'Third Eye', properties: ['Intuition', 'Insight', 'Wisdom'], color: 'Blue' },
      { name: 'Clear Quartz', chakra: 'Crown', properties: ['Clarity', 'Amplification', 'Connection'], color: 'Clear' }
    ];
    
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
    const result = [...chakraStones];
    
    // Add emphasized stones with special notation
    emphasizeIndices.forEach(index => {
      result.push({
        ...chakraStones[index],
        emphasis: true,
        purpose: 'Primary focus for your life path'
      });
    });
    
    return result;
  }

  private static getProtectionStones(sunSign: string): any[] {
    return [
      { name: 'Black Tourmaline', properties: ['Protection', 'Grounding', 'Purification'], color: 'Black' },
      { name: 'Hematite', properties: ['Grounding', 'Protection', 'Strength'], color: 'Metallic Grey' },
      { name: 'Obsidian', properties: ['Protection', 'Truth', 'Grounding'], color: 'Black' },
      { name: 'Smoky Quartz', properties: ['Protection', 'Grounding', 'Transformation'], color: 'Grey-Brown' }
    ];
  }

  private static getHealingStones(lifePath: number, month: number): any[] {
    const healingStones = [
      { name: 'Clear Quartz', properties: ['Amplification', 'Clarity', 'Healing'], color: 'Clear' },
      { name: 'Amethyst', properties: ['Spiritual healing', 'Peace', 'Protection'], color: 'Purple' },
      { name: 'Rose Quartz', properties: ['Emotional healing', 'Love', 'Compassion'], color: 'Pink' },
      { name: 'Green Aventurine', properties: ['Heart healing', 'Emotional recovery', 'Growth'], color: 'Green' }
    ];
    
    return healingStones;
  }

  private static getLuckStones(lifePath: number): any[] {
    const luckStones = {
      1: [{ name: 'Ruby', properties: ['Success', 'Leadership', 'Confidence'], color: 'Red' }],
      2: [{ name: 'Moonstone', properties: ['Intuition', 'Balance', 'New opportunities'], color: 'White' }],
      3: [{ name: 'Citrine', properties: ['Success', 'Abundance', 'Joy'], color: 'Yellow' }],
      4: [{ name: 'Emerald', properties: ['Prosperity', 'Growth', 'Stability'], color: 'Green' }],
      5: [{ name: 'Aquamarine', properties: ['Adventure', 'Communication', 'Courage'], color: 'Blue' }],
      6: [{ name: 'Rose Quartz', properties: ['Love', 'Harmony', 'Family'], color: 'Pink' }],
      7: [{ name: 'Amethyst', properties: ['Wisdom', 'Spiritual growth', 'Insight'], color: 'Purple' }],
      8: [{ name: 'Garnet', properties: ['Success', 'Prosperity', 'Achievement'], color: 'Red' }],
      9: [{ name: 'Opal', properties: ['Completion', 'Transformation', 'Hope'], color: 'Iridescent' }]
    };
    
    return luckStones[lifePath] || [{ name: 'Clear Quartz', properties: ['Amplification', 'Clarity'], color: 'Clear' }];
  }

  private static getCareerStones(sunSign: string, lifePath: number): any[] {
    return [
      { name: 'Tiger Eye', properties: ['Confidence', 'Success', 'Protection'], color: 'Golden Brown' },
      { name: 'Pyrite', properties: ['Abundance', 'Manifestation', 'Confidence'], color: 'Golden' },
      { name: 'Green Aventurine', properties: ['Opportunity', 'Leadership', 'Growth'], color: 'Green' },
      { name: 'Carnelian', properties: ['Motivation', 'Courage', 'Success'], color: 'Orange' }
    ];
  }

  private static getLoveStones(sunSign: string): any[] {
    return [
      { name: 'Rose Quartz', properties: ['Unconditional love', 'Compassion', 'Emotional healing'], color: 'Pink' },
      { name: 'Rhodonite', properties: ['Emotional healing', 'Love', 'Forgiveness'], color: 'Pink with Black' },
      { name: 'Green Aventurine', properties: ['Heart healing', 'Emotional growth', 'Love'], color: 'Green' },
      { name: 'Moonstone', properties: ['Emotional balance', 'Intuition', 'New love'], color: 'White' }
    ];
  }

  private static getMeditationStones(lifePath: number): any[] {
    return [
      { name: 'Amethyst', properties: ['Spiritual connection', 'Peace', 'Higher consciousness'], color: 'Purple' },
      { name: 'Clear Quartz', properties: ['Clarity', 'Amplification', 'Focus'], color: 'Clear' },
      { name: 'Selenite', properties: ['Higher consciousness', 'Clarity', 'Divine connection'], color: 'White' },
      { name: 'Labradorite', properties: ['Intuition', 'Transformation', 'Spiritual awakening'], color: 'Grey with Flashes' }
    ];
  }

  private static getProsperityStones(lifePath: number): any[] {
    return [
      { name: 'Citrine', properties: ['Abundance', 'Success', 'Manifestation'], color: 'Yellow' },
      { name: 'Pyrite', properties: ['Wealth', 'Abundance', 'Confidence'], color: 'Golden' },
      { name: 'Green Aventurine', properties: ['Opportunity', 'Prosperity', 'Growth'], color: 'Green' },
      { name: 'Tiger Eye', properties: ['Success', 'Confidence', 'Practical wisdom'], color: 'Golden Brown' }
    ];
  }

  private static getCreativityStones(sunSign: string, lifePath: number): any[] {
    return [
      { name: 'Carnelian', properties: ['Creativity', 'Motivation', 'Courage'], color: 'Orange' },
      { name: 'Citrine', properties: ['Creative energy', 'Inspiration', 'Joy'], color: 'Yellow' },
      { name: 'Labradorite', properties: ['Imagination', 'Transformation', 'Magic'], color: 'Grey with Flashes' },
      { name: 'Fluorite', properties: ['Mental clarity', 'Focus', 'Inspiration'], color: 'Various' }
    ];
  }

  private static getWearingGuidance(sunSign: string, lifePath: number): any {
    return {
      bestFingers: {
        'Ring finger': 'For success and leadership stones',
        'Middle finger': 'For protection and grounding stones',
        'Index finger': 'For communication and wisdom stones',
        'Little finger': 'For intuition and healing stones'
      },
      bestTimes: {
        'Morning': 'Energizing stones like citrine and carnelian',
        'Evening': 'Calming stones like amethyst and moonstone',
        'Full Moon': 'For charging and cleansing all stones',
        'New Moon': 'For setting intentions with manifestation stones'
      },
      combinations: [
        'Clear Quartz amplifies other stones - wear together',
        'Rose Quartz and Green Aventurine for heart healing',
        'Amethyst and Selenite for spiritual connection',
        'Tiger Eye and Pyrite for business success'
      ],
      cleansing: [
        'Monthly cleansing under full moon',
        'Sage smudging for purification',
        'Running water for daily cleansing',
        'Salt water for deep cleansing (avoid soft stones)'
      ]
    };
  }

  private static getUniversalStone(): any {
    return { 
      name: 'Clear Quartz', 
      properties: ['Amplification', 'Clarity', 'Healing', 'Universal energy'], 
      color: 'Clear',
      chakra: 'All',
      note: 'Universal stone suitable for all purposes'
    };
  }
}