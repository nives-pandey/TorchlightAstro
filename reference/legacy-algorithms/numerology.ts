// Comprehensive Numerology calculations and interpretations
export class NumerologyCalculator {
  
  /**
   * Calculate Life Path Number from birth date
   */
  static calculateLifePath(birthDate: Date): {
    number: number;
    reducedNumber: number;
    calculation: string;
    meaning: string;
  } {
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    const year = birthDate.getFullYear();
    
    const daySum = this.reduceToSingleDigit(day);
    const monthSum = this.reduceToSingleDigit(month);
    const yearSum = this.reduceToSingleDigit(year);
    
    const total = daySum + monthSum + yearSum;
    const reducedNumber = this.reduceToSingleDigitWithMaster(total);
    
    const calculation = `${day}/${month}/${year} → ${daySum} + ${monthSum} + ${yearSum} = ${total} → ${reducedNumber}`;
    
    return {
      number: total,
      reducedNumber,
      calculation,
      meaning: this.getLifePathMeaning(reducedNumber)
    };
  }

  /**
   * Calculate Destiny Number from full name
   */
  static calculateDestiny(fullName: string): {
    number: number;
    reducedNumber: number;
    calculation: string;
    meaning: string;
  } {
    const letterValues = this.getLetterValues();
    let total = 0;
    let calculation = '';
    
    const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
    
    for (let i = 0; i < cleanName.length; i++) {
      const letter = cleanName[i];
      const value = letterValues[letter] || 0;
      total += value;
      calculation += `${letter}(${value}) `;
    }
    
    const reducedNumber = this.reduceToSingleDigitWithMaster(total);
    calculation += `= ${total} → ${reducedNumber}`;
    
    return {
      number: total,
      reducedNumber,
      calculation,
      meaning: this.getDestinyMeaning(reducedNumber)
    };
  }

  /**
   * Calculate Soul Urge Number (vowels only)
   */
  static calculateSoulUrge(fullName: string): {
    number: number;
    reducedNumber: number;
    calculation: string;
    meaning: string;
  } {
    const letterValues = this.getLetterValues();
    const vowels = 'AEIOU';
    let total = 0;
    let calculation = '';
    
    const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
    
    for (let i = 0; i < cleanName.length; i++) {
      const letter = cleanName[i];
      if (vowels.includes(letter)) {
        const value = letterValues[letter] || 0;
        total += value;
        calculation += `${letter}(${value}) `;
      }
    }
    
    const reducedNumber = this.reduceToSingleDigitWithMaster(total);
    calculation += `= ${total} → ${reducedNumber}`;
    
    return {
      number: total,
      reducedNumber,
      calculation,
      meaning: this.getSoulUrgeMeaning(reducedNumber)
    };
  }

  /**
   * Calculate Personality Number (consonants only)
   */
  static calculatePersonality(fullName: string): {
    number: number;
    reducedNumber: number;
    calculation: string;
    meaning: string;
  } {
    const letterValues = this.getLetterValues();
    const vowels = 'AEIOU';
    let total = 0;
    let calculation = '';
    
    const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
    
    for (let i = 0; i < cleanName.length; i++) {
      const letter = cleanName[i];
      if (!vowels.includes(letter)) {
        const value = letterValues[letter] || 0;
        total += value;
        calculation += `${letter}(${value}) `;
      }
    }
    
    const reducedNumber = this.reduceToSingleDigitWithMaster(total);
    calculation += `= ${total} → ${reducedNumber}`;
    
    return {
      number: total,
      reducedNumber,
      calculation,
      meaning: this.getPersonalityMeaning(reducedNumber)
    };
  }

  /**
   * Calculate Personal Year Number for current year
   */
  static calculatePersonalYear(birthDate: Date, targetYear?: number): {
    number: number;
    year: number;
    calculation: string;
    meaning: string;
  } {
    const year = targetYear || new Date().getFullYear();
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    
    const daySum = this.reduceToSingleDigit(day);
    const monthSum = this.reduceToSingleDigit(month);
    const yearSum = this.reduceToSingleDigit(year);
    
    const total = daySum + monthSum + yearSum;
    const reducedNumber = this.reduceToSingleDigitWithMaster(total);
    
    const calculation = `${day}/${month}/${year} → ${daySum} + ${monthSum} + ${yearSum} = ${total} → ${reducedNumber}`;
    
    return {
      number: reducedNumber,
      year,
      calculation,
      meaning: this.getPersonalYearMeaning(reducedNumber)
    };
  }

  /**
   * Calculate complete numerological profile
   */
  static calculateCompleteProfile(fullName: string, birthDate: Date): {
    lifePath: any;
    destiny: any;
    soulUrge: any;
    personality: any;
    personalYear: any;
    compatibility: string;
    luckyNumbers: number[];
    challenges: string[];
    strengths: string[];
  } {
    const lifePath = this.calculateLifePath(birthDate);
    const destiny = this.calculateDestiny(fullName);
    const soulUrge = this.calculateSoulUrge(fullName);
    const personality = this.calculatePersonality(fullName);
    const personalYear = this.calculatePersonalYear(birthDate);
    
    return {
      lifePath,
      destiny,
      soulUrge,
      personality,
      personalYear,
      compatibility: this.getCompatibilityInsight(lifePath.reducedNumber, destiny.reducedNumber),
      luckyNumbers: this.calculateLuckyNumbers(lifePath.reducedNumber, destiny.reducedNumber),
      challenges: this.getLifeChallenges(lifePath.reducedNumber),
      strengths: this.getLifeStrengths(lifePath.reducedNumber)
    };
  }

  // Helper methods
  private static getLetterValues(): {[key: string]: number} {
    return {
      'A': 1, 'J': 1, 'S': 1,
      'B': 2, 'K': 2, 'T': 2,
      'C': 3, 'L': 3, 'U': 3,
      'D': 4, 'M': 4, 'V': 4,
      'E': 5, 'N': 5, 'W': 5,
      'F': 6, 'O': 6, 'X': 6,
      'G': 7, 'P': 7, 'Y': 7,
      'H': 8, 'Q': 8, 'Z': 8,
      'I': 9, 'R': 9
    };
  }

  private static reduceToSingleDigit(num: number): number {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = Math.floor(num / 10) + (num % 10);
    }
    return num;
  }

  private static reduceToSingleDigitWithMaster(num: number): number {
    // Preserve master numbers 11, 22, 33
    if (num === 11 || num === 22 || num === 33) return num;
    
    while (num > 9) {
      const digits = num.toString().split('').map(Number);
      num = digits.reduce((sum, digit) => sum + digit, 0);
      
      if (num === 11 || num === 22 || num === 33) return num;
    }
    return num;
  }

  // Meaning interpretations
  private static getLifePathMeaning(number: number): string {
    const meanings = {
      1: "Natural leader with strong independence and pioneering spirit. You're meant to lead and innovate.",
      2: "Diplomatic peacemaker with strong intuition. You excel in cooperation and partnership.",
      3: "Creative communicator with artistic talents. You're meant to inspire and entertain others.",
      4: "Practical builder with strong work ethic. You create stable foundations and lasting structures.",
      5: "Freedom-loving adventurer who craves variety. You're meant to experience and explore life fully.",
      6: "Nurturing caregiver with strong family values. You're meant to heal and support others.",
      7: "Spiritual seeker with analytical mind. You're meant to uncover hidden truths and wisdom.",
      8: "Material achiever with business acumen. You're meant to master the material world.",
      9: "Humanitarian with universal love. You're meant to serve humanity and complete cycles.",
      11: "Master intuitive with spiritual leadership abilities. You're meant to inspire and enlighten.",
      22: "Master builder who can manifest dreams into reality. You're meant to create lasting change.",
      33: "Master teacher with healing abilities. You're meant to guide humanity with compassion."
    };
    return meanings[number] || "Unknown path requiring further study.";
  }

  private static getDestinyMeaning(number: number): string {
    const meanings = {
      1: "Destined to lead and pioneer new paths. Your purpose is to be first and show others the way.",
      2: "Destined to bring harmony and cooperation. Your purpose is to unite and mediate.",
      3: "Destined to create and communicate joy. Your purpose is to uplift others through creativity.",
      4: "Destined to build and organize systems. Your purpose is to create order and stability.",
      5: "Destined to promote freedom and change. Your purpose is to break boundaries and explore.",
      6: "Destined to nurture and heal others. Your purpose is to care for family and community.",
      7: "Destined to seek truth and wisdom. Your purpose is to uncover mysteries and teach.",
      8: "Destined to achieve material success. Your purpose is to master business and finance.",
      9: "Destined to serve humanity. Your purpose is to complete and perfect what others start.",
      11: "Destined to inspire spiritual awakening. Your purpose is to be a spiritual messenger.",
      22: "Destined to build something lasting for humanity. Your purpose is large-scale creation.",
      33: "Destined to heal and teach with love. Your purpose is compassionate guidance."
    };
    return meanings[number] || "Unique destiny requiring personal discovery.";
  }

  private static getSoulUrgeMeaning(number: number): string {
    const meanings = {
      1: "Deep need for independence and leadership. You crave recognition and pioneering opportunities.",
      2: "Deep need for partnership and harmony. You crave emotional connection and cooperation.",
      3: "Deep need for creative expression. You crave artistic outlets and joyful communication.",
      4: "Deep need for security and order. You crave stability and practical achievement.",
      5: "Deep need for freedom and adventure. You crave variety and exciting experiences.",
      6: "Deep need to nurture and protect. You crave family harmony and helping others.",
      7: "Deep need for knowledge and solitude. You crave spiritual understanding and analysis.",
      8: "Deep need for material success. You crave power, recognition, and financial security.",
      9: "Deep need to serve others. You crave opportunities to help humanity and give back.",
      11: "Deep need for spiritual connection. You crave intuitive insights and inspiring others.",
      22: "Deep need to build something meaningful. You crave large-scale accomplishment.",
      33: "Deep need to heal and guide. You crave opportunities to nurture with wisdom."
    };
    return meanings[number] || "Unique soul desires requiring inner exploration.";
  }

  private static getPersonalityMeaning(number: number): string {
    const meanings = {
      1: "Others see you as confident, independent, and pioneering. You project leadership energy.",
      2: "Others see you as diplomatic, gentle, and cooperative. You project peaceful energy.",
      3: "Others see you as creative, charming, and entertaining. You project joyful energy.",
      4: "Others see you as practical, reliable, and hardworking. You project stable energy.",
      5: "Others see you as dynamic, adventurous, and free-spirited. You project exciting energy.",
      6: "Others see you as caring, responsible, and family-oriented. You project nurturing energy.",
      7: "Others see you as mysterious, analytical, and wise. You project spiritual energy.",
      8: "Others see you as successful, ambitious, and powerful. You project authoritative energy.",
      9: "Others see you as compassionate, generous, and wise. You project humanitarian energy.",
      11: "Others see you as inspiring, intuitive, and spiritually aware. You project enlightened energy.",
      22: "Others see you as capable of great achievements. You project master builder energy.",
      33: "Others see you as healing, wise, and compassionate. You project master teacher energy."
    };
    return meanings[number] || "Unique personality projection requiring observation.";
  }

  private static getPersonalYearMeaning(number: number): string {
    const meanings = {
      1: "New beginnings and fresh starts. Time to initiate projects and take leadership.",
      2: "Cooperation and relationships. Time to work with others and develop partnerships.",
      3: "Creativity and communication. Time to express yourself and enjoy social activities.",
      4: "Hard work and building foundations. Time to organize and create lasting structures.",
      5: "Change and freedom. Time to explore new opportunities and embrace adventure.",
      6: "Family and responsibility. Time to focus on home, healing, and nurturing others.",
      7: "Introspection and spiritual growth. Time to study, analyze, and seek inner wisdom.",
      8: "Material achievement and recognition. Time to focus on career and financial goals.",
      9: "Completion and humanitarian service. Time to finish projects and help others."
    };
    return meanings[number] || "Unique year energy requiring careful observation.";
  }

  private static getCompatibilityInsight(lifePath: number, destiny: number): string {
    const compatibility = Math.abs(lifePath - destiny);
    
    if (compatibility === 0) {
      return "Perfect alignment between your life path and destiny. You're living your true purpose.";
    } else if (compatibility <= 2) {
      return "Good harmony between your life path and destiny. You're generally aligned with your purpose.";
    } else if (compatibility <= 4) {
      return "Some tension between your life path and destiny. Growth comes through balancing these energies.";
    } else {
      return "Significant contrast between your life path and destiny. This creates dynamic tension for growth.";
    }
  }

  private static calculateLuckyNumbers(lifePath: number, destiny: number): number[] {
    const base = [lifePath, destiny];
    const derived = [
      (lifePath + destiny) % 9 || 9,
      (lifePath * 2) % 9 || 9,
      (destiny * 2) % 9 || 9,
      (lifePath + destiny + 1) % 9 || 9,
      (lifePath + destiny + 7) % 9 || 9
    ];
    
    return [...new Set([...base, ...derived])].sort((a, b) => a - b);
  }

  private static getLifeChallenges(lifePath: number): string[] {
    const challenges = {
      1: ["Overcoming selfishness", "Learning to work with others", "Avoiding domineering behavior"],
      2: ["Building self-confidence", "Avoiding over-sensitivity", "Learning to assert yourself"],
      3: ["Focusing scattered energy", "Avoiding superficiality", "Managing emotional ups and downs"],
      4: ["Embracing change", "Avoiding rigid thinking", "Learning to relax and have fun"],
      5: ["Committing to responsibilities", "Avoiding restlessness", "Learning focus and discipline"],
      6: ["Setting healthy boundaries", "Avoiding over-responsibility", "Learning to receive help"],
      7: ["Connecting with others", "Sharing your knowledge", "Avoiding isolation"],
      8: ["Balancing material and spiritual", "Avoiding power struggles", "Learning compassion"],
      9: ["Learning to let go", "Avoiding martyrdom", "Focusing on completion"],
      11: ["Managing sensitivity", "Grounding spiritual insights", "Avoiding overwhelm"],
      22: ["Managing high expectations", "Staying grounded", "Avoiding perfectionism"],
      33: ["Avoiding burnout from giving", "Setting boundaries", "Managing emotional intensity"]
    };
    return challenges[lifePath] || ["Discovering your unique challenges through experience"];
  }

  private static getLifeStrengths(lifePath: number): string[] {
    const strengths = {
      1: ["Natural leadership", "Independence", "Pioneering spirit", "Initiative"],
      2: ["Diplomacy", "Cooperation", "Intuition", "Peacemaking"],
      3: ["Creativity", "Communication", "Optimism", "Inspiration"],
      4: ["Reliability", "Organization", "Practicality", "Persistence"],
      5: ["Adaptability", "Freedom", "Adventure", "Versatility"],
      6: ["Nurturing", "Responsibility", "Healing", "Family devotion"],
      7: ["Analysis", "Spirituality", "Wisdom", "Research abilities"],
      8: ["Business acumen", "Material success", "Leadership", "Organization"],
      9: ["Humanitarianism", "Compassion", "Universal love", "Completion"],
      11: ["Intuition", "Inspiration", "Spiritual leadership", "Sensitivity"],
      22: ["Master building", "Large-scale vision", "Practical idealism", "Leadership"],
      33: ["Master teaching", "Healing abilities", "Compassion", "Guidance"]
    };
    return strengths[lifePath] || ["Unique strengths to be discovered"];
  }
}