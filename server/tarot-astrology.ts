// Tarot and Birth Card calculations based on birth date
export class TarotAstrology {
  
  /**
   * Calculate Birth Cards from birth date using Tarot numerology
   */
  static calculateBirthCards(birthDate: Date): {
    primaryCard: any;
    secondaryCard: any;
    soulCard: any;
    calculation: string;
    lifeTheme: string;
  } {
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    const year = birthDate.getFullYear();
    
    // Add all digits of birth date
    let total = this.sumDigits(day) + this.sumDigits(month) + this.sumDigits(year);
    
    // Reduce to single digit or master number
    let soulNumber = total;
    while (soulNumber > 22) {
      soulNumber = this.sumDigits(soulNumber);
    }
    
    let personalityNumber = soulNumber;
    if (soulNumber > 9) {
      personalityNumber = this.sumDigits(soulNumber);
    }
    
    const calculation = `${day}/${month}/${year} → ${total} → Soul: ${soulNumber}, Personality: ${personalityNumber}`;
    
    return {
      primaryCard: this.getTarotCard(soulNumber),
      secondaryCard: personalityNumber !== soulNumber ? this.getTarotCard(personalityNumber) : null,
      soulCard: this.getTarotCard(soulNumber),
      calculation,
      lifeTheme: this.getLifeTheme(soulNumber, personalityNumber)
    };
  }

  /**
   * Calculate current year Tarot card
   */
  static calculateYearCard(birthDate: Date, targetYear?: number): {
    card: any;
    year: number;
    calculation: string;
    yearlyTheme: string;
  } {
    const year = targetYear || new Date().getFullYear();
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    
    let total = this.sumDigits(day) + this.sumDigits(month) + this.sumDigits(year);
    
    while (total > 22) {
      total = this.sumDigits(total);
    }
    
    const calculation = `${day}/${month}/${year} → ${total}`;
    
    return {
      card: this.getTarotCard(total),
      year,
      calculation,
      yearlyTheme: this.getYearlyTheme(total)
    };
  }

  private static sumDigits(num: number): number {
    return num.toString().split('').map(Number).reduce((sum, digit) => sum + digit, 0);
  }

  private static getTarotCard(number: number): any {
    const cards = {
      1: {
        name: "The Magician",
        keywords: ["Manifestation", "Power", "Skill", "Concentration"],
        meaning: "You have the power to manifest your desires through focused will and skill.",
        element: "Air",
        planet: "Mercury"
      },
      2: {
        name: "The High Priestess",
        keywords: ["Intuition", "Mystery", "Subconscious", "Wisdom"],
        meaning: "Trust your intuition and inner wisdom to guide your decisions.",
        element: "Water",
        planet: "Moon"
      },
      3: {
        name: "The Empress",
        keywords: ["Fertility", "Creativity", "Nature", "Abundance"],
        meaning: "Embrace creativity and nurturing energy to bring abundance into your life.",
        element: "Earth",
        planet: "Venus"
      },
      4: {
        name: "The Emperor",
        keywords: ["Authority", "Structure", "Control", "Leadership"],
        meaning: "Take charge of your life with discipline and structured leadership.",
        element: "Fire",
        planet: "Mars"
      },
      5: {
        name: "The Hierophant",
        keywords: ["Tradition", "Education", "Spiritual guidance", "Conformity"],
        meaning: "Seek wisdom through traditional teachings and spiritual guidance.",
        element: "Earth",
        planet: "Taurus"
      },
      6: {
        name: "The Lovers",
        keywords: ["Love", "Harmony", "Relationships", "Choices"],
        meaning: "Important choices in relationships and the need for harmony and balance.",
        element: "Air",
        planet: "Gemini"
      },
      7: {
        name: "The Chariot",
        keywords: ["Willpower", "Victory", "Determination", "Control"],
        meaning: "Victory through willpower and determination in overcoming obstacles.",
        element: "Water",
        planet: "Cancer"
      },
      8: {
        name: "Strength",
        keywords: ["Inner strength", "Courage", "Patience", "Compassion"],
        meaning: "True strength comes from inner courage and compassionate patience.",
        element: "Fire",
        planet: "Leo"
      },
      9: {
        name: "The Hermit",
        keywords: ["Soul searching", "Inner guidance", "Solitude", "Wisdom"],
        meaning: "Time for introspection and seeking inner wisdom through solitude.",
        element: "Earth",
        planet: "Virgo"
      },
      10: {
        name: "Wheel of Fortune",
        keywords: ["Destiny", "Cycles", "Change", "Good fortune"],
        meaning: "Life cycles and destiny are turning in your favor through positive change.",
        element: "Fire",
        planet: "Jupiter"
      },
      11: {
        name: "Justice",
        keywords: ["Balance", "Fairness", "Truth", "Law"],
        meaning: "Seek balance and fairness in all decisions, truth will prevail.",
        element: "Air",
        planet: "Libra"
      },
      12: {
        name: "The Hanged Man",
        keywords: ["Suspension", "Sacrifice", "New perspective", "Letting go"],
        meaning: "Sometimes sacrifice and letting go leads to new perspectives and growth.",
        element: "Water",
        planet: "Neptune"
      },
      13: {
        name: "Death",
        keywords: ["Transformation", "Endings", "New beginnings", "Rebirth"],
        meaning: "Major transformation and rebirth through necessary endings.",
        element: "Water",
        planet: "Scorpio"
      },
      14: {
        name: "Temperance",
        keywords: ["Balance", "Moderation", "Healing", "Harmony"],
        meaning: "Find balance and healing through moderation and patience.",
        element: "Fire",
        planet: "Sagittarius"
      },
      15: {
        name: "The Devil",
        keywords: ["Temptation", "Bondage", "Materialism", "Freedom"],
        meaning: "Recognize the chains that bind you and choose freedom over temptation.",
        element: "Earth",
        planet: "Capricorn"
      },
      16: {
        name: "The Tower",
        keywords: ["Sudden change", "Upheaval", "Revelation", "Liberation"],
        meaning: "Sudden changes and revelations that ultimately lead to liberation.",
        element: "Fire",
        planet: "Mars"
      },
      17: {
        name: "The Star",
        keywords: ["Hope", "Inspiration", "Healing", "Guidance"],
        meaning: "Hope, inspiration, and spiritual guidance light your path forward.",
        element: "Air",
        planet: "Aquarius"
      },
      18: {
        name: "The Moon",
        keywords: ["Illusion", "Intuition", "Dreams", "Subconscious"],
        meaning: "Trust your intuition to navigate through illusions and uncertainty.",
        element: "Water",
        planet: "Pisces"
      },
      19: {
        name: "The Sun",
        keywords: ["Joy", "Success", "Vitality", "Enlightenment"],
        meaning: "Joy, success, and enlightenment shine brightly in your life.",
        element: "Fire",
        planet: "Sun"
      },
      20: {
        name: "Judgement",
        keywords: ["Rebirth", "Awakening", "Redemption", "Calling"],
        meaning: "Spiritual awakening and answering your higher calling for rebirth.",
        element: "Fire",
        planet: "Pluto"
      },
      21: {
        name: "The World",
        keywords: ["Completion", "Accomplishment", "Fulfillment", "Unity"],
        meaning: "Completion of a major life cycle and accomplishment of your goals.",
        element: "Earth",
        planet: "Saturn"
      },
      22: {
        name: "The Fool",
        keywords: ["New beginnings", "Innocence", "Adventure", "Potential"],
        meaning: "Embrace new adventures with innocent trust in your unlimited potential.",
        element: "Air",
        planet: "Uranus"
      }
    };
    
    return cards[number] || cards[22]; // Default to The Fool if not found
  }

  private static getLifeTheme(soulNumber: number, personalityNumber: number): string {
    const themes = {
      1: "Leadership and pioneering new paths through personal will and manifestation.",
      2: "Developing intuition and bringing harmony through cooperation and sensitivity.",
      3: "Creative expression and bringing joy through artistic and communicative gifts.",
      4: "Building solid foundations through discipline, hard work, and practical wisdom.",
      5: "Learning freedom and teaching others through adventure and life experience.",
      6: "Nurturing and healing others through love, responsibility, and service.",
      7: "Seeking truth and sharing wisdom through spiritual study and inner development.",
      8: "Developing inner strength and courage to overcome life's challenges with compassion.",
      9: "Finding inner wisdom through introspection and sharing insights with others.",
      10: "Understanding life's cycles and helping others navigate change and destiny.",
      11: "Bringing balance and justice through fair decision-making and truth-seeking.",
      12: "Learning patience and new perspectives through sacrifice and letting go.",
      13: "Facilitating transformation and helping others through major life changes.",
      14: "Teaching balance and healing through patience and moderate living.",
      15: "Overcoming limitations and helping others break free from bondage.",
      16: "Catalyzing sudden positive changes and helping others through upheaval.",
      17: "Inspiring hope and providing spiritual guidance to others.",
      18: "Navigating illusions and helping others trust their intuitive wisdom.",
      19: "Bringing joy and enlightenment through positive energy and success.",
      20: "Facilitating spiritual awakening and helping others answer their calling.",
      21: "Achieving completion and helping others accomplish their life goals.",
      22: "Embracing new beginnings and helping others trust in their potential."
    };
    
    return themes[soulNumber] || "Discovering your unique life theme through experience.";
  }

  private static getYearlyTheme(number: number): string {
    const yearlyThemes = {
      1: "A year of new beginnings and taking charge of your personal power.",
      2: "A year of developing intuition and focusing on relationships and cooperation.",
      3: "A year of creative expression and nurturing your artistic and communicative abilities.",
      4: "A year of building foundations and focusing on discipline and hard work.",
      5: "A year of learning through experience and embracing freedom and adventure.",
      6: "A year of nurturing others and taking responsibility for family and community.",
      7: "A year of seeking inner wisdom and focusing on spiritual development.",
      8: "A year of developing inner strength and facing challenges with courage.",
      9: "A year of introspection and sharing your wisdom with others.",
      10: "A year of major changes and aligning with your destiny and life cycles.",
      11: "A year of seeking balance and making important decisions with fairness.",
      12: "A year of letting go and gaining new perspectives through patience.",
      13: "A year of major transformation and embracing necessary endings.",
      14: "A year of finding balance and focusing on healing and moderation.",
      15: "A year of breaking free from limitations and overcoming temptations.",
      16: "A year of sudden changes and revelations that lead to liberation.",
      17: "A year of hope, inspiration, and spiritual guidance lighting your path.",
      18: "A year of trusting intuition and navigating through uncertainties.",
      19: "A year of joy, success, and enlightenment shining in your life.",
      20: "A year of spiritual awakening and answering your higher calling.",
      21: "A year of completion and accomplishing major life goals.",
      22: "A year of new adventures and trusting in your unlimited potential."
    };
    
    return yearlyThemes[number] || "A year of unique experiences and personal growth.";
  }
}