import { Chart, BirthData, SystemComparison } from "../shared/schema";

// Comprehensive astrological knowledge base
const ASTROLOGICAL_KNOWLEDGE = {
  western: {
    signs: {
      Aries: { element: "Fire", quality: "Cardinal", ruler: "Mars", traits: ["pioneering", "energetic", "impulsive", "leadership"], keywords: "I am" },
      Taurus: { element: "Earth", quality: "Fixed", ruler: "Venus", traits: ["stable", "practical", "sensual", "determined"], keywords: "I have" },
      Gemini: { element: "Air", quality: "Mutable", ruler: "Mercury", traits: ["communicative", "versatile", "curious", "adaptable"], keywords: "I think" },
      Cancer: { element: "Water", quality: "Cardinal", ruler: "Moon", traits: ["nurturing", "emotional", "protective", "intuitive"], keywords: "I feel" },
      Leo: { element: "Fire", quality: "Fixed", ruler: "Sun", traits: ["creative", "generous", "dramatic", "confident"], keywords: "I will" },
      Virgo: { element: "Earth", quality: "Mutable", ruler: "Mercury", traits: ["analytical", "helpful", "perfectionist", "practical"], keywords: "I analyze" },
      Libra: { element: "Air", quality: "Cardinal", ruler: "Venus", traits: ["harmonious", "diplomatic", "aesthetic", "balanced"], keywords: "I balance" },
      Scorpio: { element: "Water", quality: "Fixed", ruler: "Pluto", traits: ["intense", "transformative", "mysterious", "powerful"], keywords: "I desire" },
      Sagittarius: { element: "Fire", quality: "Mutable", ruler: "Jupiter", traits: ["philosophical", "adventurous", "optimistic", "freedom-loving"], keywords: "I see" },
      Capricorn: { element: "Earth", quality: "Cardinal", ruler: "Saturn", traits: ["ambitious", "disciplined", "responsible", "practical"], keywords: "I use" },
      Aquarius: { element: "Air", quality: "Fixed", ruler: "Uranus", traits: ["innovative", "humanitarian", "independent", "eccentric"], keywords: "I know" },
      Pisces: { element: "Water", quality: "Mutable", ruler: "Neptune", traits: ["intuitive", "compassionate", "artistic", "dreamy"], keywords: "I believe" }
    },
    houses: {
      1: { meaning: "Self, identity, appearance", life_area: "personality" },
      2: { meaning: "Money, possessions, values", life_area: "resources" },
      3: { meaning: "Communication, siblings, short trips", life_area: "communication" },
      4: { meaning: "Home, family, roots", life_area: "foundation" },
      5: { meaning: "Creativity, romance, children", life_area: "self-expression" },
      6: { meaning: "Health, work, service", life_area: "daily_life" },
      7: { meaning: "Partnerships, marriage, open enemies", life_area: "relationships" },
      8: { meaning: "Transformation, shared resources, death", life_area: "transformation" },
      9: { meaning: "Philosophy, higher education, travel", life_area: "expansion" },
      10: { meaning: "Career, reputation, authority", life_area: "achievement" },
      11: { meaning: "Friends, groups, hopes", life_area: "community" },
      12: { meaning: "Spirituality, subconscious, hidden enemies", life_area: "transcendence" }
    },
    planets: {
      Sun: { meaning: "Core self, ego, vitality", energy: "masculine", cycle: "1 year" },
      Moon: { meaning: "Emotions, instincts, unconscious", energy: "feminine", cycle: "28 days" },
      Mercury: { meaning: "Communication, thinking, learning", energy: "neutral", cycle: "88 days" },
      Venus: { meaning: "Love, beauty, values", energy: "feminine", cycle: "225 days" },
      Mars: { meaning: "Action, desire, aggression", energy: "masculine", cycle: "687 days" },
      Jupiter: { meaning: "Expansion, wisdom, growth", energy: "benefic", cycle: "12 years" },
      Saturn: { meaning: "Structure, limitation, discipline", energy: "malefic", cycle: "29 years" },
      Uranus: { meaning: "Innovation, rebellion, change", energy: "disruptive", cycle: "84 years" },
      Neptune: { meaning: "Spirituality, illusion, dreams", energy: "transcendent", cycle: "165 years" },
      Pluto: { meaning: "Transformation, power, rebirth", energy: "transformative", cycle: "248 years" }
    }
  },
  vedic: {
    nakshatras: {
      Ashwini: { deity: "Ashwini Kumaras", symbol: "Horse's head", nature: "Swift", traits: ["healing", "pioneering", "spontaneous"] },
      Bharani: { deity: "Yama", symbol: "Yoni", nature: "Creative", traits: ["nurturing", "creative", "transformative"] },
      Krittika: { deity: "Agni", symbol: "Razor", nature: "Sharp", traits: ["cutting", "purifying", "determined"] },
      Rohini: { deity: "Brahma", symbol: "Cart", nature: "Growth", traits: ["creative", "beautiful", "materialistic"] },
      Mrigashira: { deity: "Soma", symbol: "Deer's head", nature: "Searching", traits: ["seeking", "restless", "curious"] },
      Ardra: { deity: "Rudra", symbol: "Teardrop", nature: "Stormy", traits: ["emotional", "transformative", "intense"] }
    },
    doshas: {
      Vata: { elements: ["Air", "Space"], qualities: ["dry", "light", "cold", "rough"], traits: ["creative", "energetic", "anxious"] },
      Pitta: { elements: ["Fire", "Water"], qualities: ["hot", "sharp", "light", "oily"], traits: ["intelligent", "focused", "irritable"] },
      Kapha: { elements: ["Earth", "Water"], qualities: ["heavy", "slow", "cold", "oily"], traits: ["stable", "calm", "sluggish"] }
    }
  },
  chinese: {
    animals: {
      Rat: { element_years: ["Water", "Wood", "Fire", "Earth", "Metal"], traits: ["intelligent", "adaptable", "charming"], compatible: ["Dragon", "Monkey"] },
      Ox: { element_years: ["Water", "Wood", "Fire", "Earth", "Metal"], traits: ["reliable", "strong", "determined"], compatible: ["Snake", "Rooster"] },
      Tiger: { element_years: ["Water", "Wood", "Fire", "Earth", "Metal"], traits: ["brave", "competitive", "confident"], compatible: ["Horse", "Dog"] },
      Rabbit: { element_years: ["Water", "Wood", "Fire", "Earth", "Metal"], traits: ["gentle", "quiet", "elegant"], compatible: ["Sheep", "Pig"] },
      Dragon: { element_years: ["Water", "Wood", "Fire", "Earth", "Metal"], traits: ["confident", "intelligent", "enthusiastic"], compatible: ["Rat", "Monkey"] },
      Snake: { element_years: ["Water", "Wood", "Fire", "Earth", "Metal"], traits: ["wise", "intuitive", "mysterious"], compatible: ["Ox", "Rooster"] },
      Horse: { element_years: ["Water", "Wood", "Fire", "Earth", "Metal"], traits: ["animated", "active", "energetic"], compatible: ["Tiger", "Dog"] },
      Sheep: { element_years: ["Water", "Wood", "Fire", "Earth", "Metal"], traits: ["calm", "gentle", "sympathetic"], compatible: ["Rabbit", "Pig"] },
      Monkey: { element_years: ["Water", "Wood", "Fire", "Earth", "Metal"], traits: ["sharp", "smart", "curious"], compatible: ["Rat", "Dragon"] },
      Rooster: { element_years: ["Water", "Wood", "Fire", "Earth", "Metal"], traits: ["observant", "hardworking", "courageous"], compatible: ["Ox", "Snake"] },
      Dog: { element_years: ["Water", "Wood", "Fire", "Earth", "Metal"], traits: ["loyal", "responsible", "reliable"], compatible: ["Tiger", "Horse"] },
      Pig: { element_years: ["Water", "Wood", "Fire", "Earth", "Metal"], traits: ["compassionate", "generous", "honest"], compatible: ["Rabbit", "Sheep"] }
    },
    elements: {
      Wood: { traits: ["growth", "flexibility", "cooperation"], season: "Spring", direction: "East" },
      Fire: { traits: ["passion", "energy", "transformation"], season: "Summer", direction: "South" },
      Earth: { traits: ["stability", "practicality", "nurturing"], season: "Late Summer", direction: "Center" },
      Metal: { traits: ["precision", "discipline", "organization"], season: "Autumn", direction: "West" },
      Water: { traits: ["wisdom", "intuition", "adaptability"], season: "Winter", direction: "North" }
    }
  },
  humanDesign: {
    types: {
      Manifestor: { strategy: "Inform", signature: "Peace", not_self: "Anger", aura: "Closed/Repelling" },
      Generator: { strategy: "Respond", signature: "Satisfaction", not_self: "Frustration", aura: "Open/Enveloping" },
      ManifestingGenerator: { strategy: "Respond then Inform", signature: "Satisfaction", not_self: "Frustration/Anger", aura: "Open/Enveloping" },
      Projector: { strategy: "Wait for Invitation", signature: "Success", not_self: "Bitterness", aura: "Focused/Absorbing" },
      Reflector: { strategy: "Wait a Lunar Cycle", signature: "Surprise", not_self: "Disappointment", aura: "Sampling" }
    },
    authorities: {
      Emotional: { description: "Wait for emotional clarity over time", process: "Ride the emotional wave" },
      Sacral: { description: "Trust gut responses", process: "Listen to uh-huh/uh-uh sounds" },
      Splenic: { description: "Trust intuitive hits in the moment", process: "Listen to spontaneous knowing" },
      SelfProjected: { description: "Talk it out to hear your truth", process: "Listen to what you say" },
      Mental: { description: "Process through discussion with others", process: "Think out loud with trusted advisors" },
      Lunar: { description: "Wait 28+ days for clarity", process: "Feel through the full lunar cycle" }
    }
  }
};

// Transit and timing calculations
const TRANSIT_PATTERNS = {
  daily: {
    moon_phases: ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"],
    planetary_hours: ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"]
  },
  weekly: {
    planetary_days: {
      Sunday: "Sun", Monday: "Moon", Tuesday: "Mars", Wednesday: "Mercury", 
      Thursday: "Jupiter", Friday: "Venus", Saturday: "Saturn"
    }
  },
  monthly: {
    seasons: ["Spring Equinox", "Summer Solstice", "Autumn Equinox", "Winter Solstice"]
  }
};

export class AstrologyAI {
  private knowledge = ASTROLOGICAL_KNOWLEDGE;
  private transits = TRANSIT_PATTERNS;

  async generatePersonalizedInsight(
    question: string,
    userCharts: Chart[],
    birthData: BirthData,
    systemComparison?: SystemComparison,
    conversationHistory: Array<{role: string, content: string}> = []
  ): Promise<{
    response: string;
    insights: string[];
    recommendations: string[];
    timing: string[];
    processingTime: number;
  }> {
    const startTime = Date.now();
    
    // Simulate processing time for realistic experience (2-4 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Analyze user's question intent
    const intent = this.analyzeQuestionIntent(question);
    
    // Extract relevant chart data
    const chartAnalysis = this.analyzeUserCharts(userCharts);
    
    // Generate contextual response
    const response = this.generateContextualResponse(
      question, 
      intent, 
      chartAnalysis, 
      birthData,
      systemComparison,
      conversationHistory
    );

    // Generate actionable insights
    const insights = this.generateInsights(chartAnalysis, intent);
    
    // Create personalized recommendations
    const recommendations = this.generateRecommendations(chartAnalysis, intent, birthData);
    
    // Calculate optimal timing
    const timing = this.calculateOptimalTiming(chartAnalysis, birthData);

    const processingTime = Date.now() - startTime;

    return {
      response,
      insights,
      recommendations,
      timing,
      processingTime
    };
  }

  private analyzeQuestionIntent(question: string): {
    category: string;
    focus: string;
    timeframe: string;
    systems: string[];
  } {
    const lowerQuestion = question.toLowerCase();
    
    // Categorize question type
    let category = "general";
    if (lowerQuestion.includes("career") || lowerQuestion.includes("job") || lowerQuestion.includes("work")) {
      category = "career";
    } else if (lowerQuestion.includes("love") || lowerQuestion.includes("relationship") || lowerQuestion.includes("partner")) {
      category = "relationships";
    } else if (lowerQuestion.includes("health") || lowerQuestion.includes("wellness")) {
      category = "health";
    } else if (lowerQuestion.includes("money") || lowerQuestion.includes("finance") || lowerQuestion.includes("wealth")) {
      category = "finances";
    } else if (lowerQuestion.includes("spiritual") || lowerQuestion.includes("purpose") || lowerQuestion.includes("meaning")) {
      category = "spirituality";
    }

    // Determine focus
    let focus = "personality";
    if (lowerQuestion.includes("future") || lowerQuestion.includes("prediction")) {
      focus = "prediction";
    } else if (lowerQuestion.includes("compatibility") || lowerQuestion.includes("match")) {
      focus = "compatibility";
    } else if (lowerQuestion.includes("strength") || lowerQuestion.includes("gift")) {
      focus = "strengths";
    } else if (lowerQuestion.includes("challenge") || lowerQuestion.includes("weakness")) {
      focus = "challenges";
    }

    // Determine timeframe
    let timeframe = "present";
    if (lowerQuestion.includes("today") || lowerQuestion.includes("now")) {
      timeframe = "today";
    } else if (lowerQuestion.includes("week") || lowerQuestion.includes("soon")) {
      timeframe = "week";
    } else if (lowerQuestion.includes("month") || lowerQuestion.includes("upcoming")) {
      timeframe = "month";
    } else if (lowerQuestion.includes("year") || lowerQuestion.includes("future")) {
      timeframe = "year";
    }

    // Determine relevant systems
    const systems = [];
    if (lowerQuestion.includes("western") || lowerQuestion.includes("zodiac") || lowerQuestion.includes("horoscope")) {
      systems.push("western");
    }
    if (lowerQuestion.includes("vedic") || lowerQuestion.includes("jyotish") || lowerQuestion.includes("hindu")) {
      systems.push("vedic");
    }
    if (lowerQuestion.includes("chinese") || lowerQuestion.includes("animal")) {
      systems.push("chinese");
    }
    if (lowerQuestion.includes("human design") || lowerQuestion.includes("generator") || lowerQuestion.includes("manifestor")) {
      systems.push("humanDesign");
    }
    
    // If no specific system mentioned, include all
    if (systems.length === 0) {
      systems.push("western", "vedic", "chinese", "humanDesign");
    }

    return { category, focus, timeframe, systems };
  }

  private analyzeUserCharts(charts: Chart[]): any {
    const analysis: any = {
      western: null,
      vedic: null,
      chinese: null,
      humanDesign: null
    };

    charts.forEach(chart => {
      try {
        const chartData = typeof chart.chartData === 'string' 
          ? JSON.parse(chart.chartData) 
          : chart.chartData;
        
        analysis[chart.chartType.replace('-', '')] = chartData;
      } catch (error) {
        console.error(`Error parsing chart data for ${chart.chartType}:`, error);
      }
    });

    return analysis;
  }

  private generateContextualResponse(
    question: string,
    intent: any,
    chartAnalysis: any,
    birthData: BirthData,
    systemComparison?: SystemComparison,
    conversationHistory: Array<{role: string, content: string}> = []
  ): string {
    let response = "";

    // Personalized greeting based on chart data
    if (chartAnalysis.western?.sun?.sign) {
      response += `As a ${chartAnalysis.western.sun.sign}, `;
    }

    // Category-specific responses
    switch (intent.category) {
      case "career":
        response += this.generateCareerGuidance(chartAnalysis, intent);
        break;
      case "relationships":
        response += this.generateRelationshipGuidance(chartAnalysis, intent);
        break;
      case "health":
        response += this.generateHealthGuidance(chartAnalysis, intent);
        break;
      case "finances":
        response += this.generateFinancialGuidance(chartAnalysis, intent);
        break;
      case "spirituality":
        response += this.generateSpiritualGuidance(chartAnalysis, intent);
        break;
      default:
        response += this.generateGeneralGuidance(chartAnalysis, intent, question);
    }

    // Add cross-system synthesis if available
    if (systemComparison) {
      try {
        const synthesis = typeof systemComparison.synthesizedGuidance === 'string'
          ? JSON.parse(systemComparison.synthesizedGuidance)
          : systemComparison.synthesizedGuidance;
        
        if (synthesis && intent.category in synthesis) {
          response += `\n\nFrom a multi-system perspective: ${synthesis[intent.category]}`;
        }
      } catch (error) {
        console.error("Error parsing synthesized guidance:", error);
      }
    }

    return response;
  }

  private generateCareerGuidance(chartAnalysis: any, intent: any): string {
    let guidance = "your natural career path shows strong potential in ";
    
    if (chartAnalysis.western?.sun?.house) {
      const house = chartAnalysis.western.sun.house;
      if (house === 10 || house === 6) {
        guidance += "leadership and professional recognition. ";
      } else if (house === 3 || house === 9) {
        guidance += "communication, teaching, or publishing. ";
      } else if (house === 2 || house === 8) {
        guidance += "finance, resources, or transformation work. ";
      }
    }

    if (chartAnalysis.humanDesign?.type) {
      const type = chartAnalysis.humanDesign.type;
      if (type === "Manifestor") {
        guidance += "You're designed to initiate new projects and lead others. ";
      } else if (type === "Generator") {
        guidance += "You thrive in work that lights you up and provides sustainable energy. ";
      } else if (type === "Projector") {
        guidance += "You excel in guiding others and managing systems efficiently. ";
      }
    }

    return guidance;
  }

  private generateRelationshipGuidance(chartAnalysis: any, intent: any): string {
    let guidance = "in relationships, you naturally ";
    
    if (chartAnalysis.western?.venus?.sign) {
      const venusSign = chartAnalysis.western.venus.sign;
      const signData = this.knowledge.western.signs[venusSign as keyof typeof this.knowledge.western.signs];
      if (signData) {
        guidance += `express love through ${signData.traits.join(", ")} qualities. `;
      }
    }

    if (chartAnalysis.chinese?.compatible_animals) {
      guidance += `You're most compatible with ${chartAnalysis.chinese.compatible_animals.join(" and ")} types. `;
    }

    return guidance;
  }

  private generateHealthGuidance(chartAnalysis: any, intent: any): string {
    let guidance = "for optimal health, focus on ";
    
    if (chartAnalysis.western?.sun?.sign) {
      const element = this.knowledge.western.signs[chartAnalysis.western.sun.sign as keyof typeof this.knowledge.western.signs]?.element;
      if (element === "Fire") {
        guidance += "managing stress and cooling activities. ";
      } else if (element === "Earth") {
        guidance += "digestive health and regular routines. ";
      } else if (element === "Air") {
        guidance += "breathing exercises and mental clarity. ";
      } else if (element === "Water") {
        guidance += "emotional balance and lymphatic system. ";
      }
    }

    return guidance;
  }

  private generateFinancialGuidance(chartAnalysis: any, intent: any): string {
    let guidance = "your financial approach tends to be ";
    
    if (chartAnalysis.western?.sun?.house === 2 || chartAnalysis.western?.venus?.house === 2) {
      guidance += "naturally abundant, with good instincts for value and resources. ";
    } else if (chartAnalysis.western?.saturn?.house === 2) {
      guidance += "disciplined and long-term focused, building wealth through patience. ";
    }

    return guidance;
  }

  private generateSpiritualGuidance(chartAnalysis: any, intent: any): string {
    let guidance = "your spiritual path is illuminated through ";
    
    if (chartAnalysis.vedic?.jupiter) {
      guidance += "wisdom traditions and philosophical study. ";
    }
    
    if (chartAnalysis.western?.neptune) {
      guidance += "Dreams, meditation, and creative expression open doorways to higher consciousness. ";
    }

    return guidance;
  }

  private generateGeneralGuidance(chartAnalysis: any, intent: any, question: string): string {
    let guidance = "your cosmic blueprint reveals ";
    
    // Use sun sign as primary personality indicator
    if (chartAnalysis.western?.sun?.sign) {
      const sign = chartAnalysis.western.sun.sign;
      const signData = this.knowledge.western.signs[sign as keyof typeof this.knowledge.western.signs];
      if (signData) {
        guidance += `${signData.traits.join(", ")} qualities that shape your approach to life. `;
      }
    }

    // Add specific insights based on question keywords
    if (question.toLowerCase().includes("strength")) {
      guidance += "Your greatest strengths lie in your natural ability to ";
    } else if (question.toLowerCase().includes("challenge")) {
      guidance += "Growth opportunities emerge when you work with ";
    }

    return guidance;
  }

  private generateInsights(chartAnalysis: any, intent: any): string[] {
    const insights = [];
    
    // Western astrology insights
    if (chartAnalysis.western) {
      if (chartAnalysis.western.sun && chartAnalysis.western.moon) {
        insights.push(`Your Sun in ${chartAnalysis.western.sun.sign} and Moon in ${chartAnalysis.western.moon.sign} create a unique blend of conscious will and emotional nature.`);
      }
    }

    // Human Design insights
    if (chartAnalysis.humanDesign) {
      insights.push(`As a ${chartAnalysis.humanDesign.type}, your strategy of "${chartAnalysis.humanDesign.strategy}" guides your decision-making process.`);
    }

    // Chinese astrology insights
    if (chartAnalysis.chinese) {
      insights.push(`Your ${chartAnalysis.chinese.element} ${chartAnalysis.chinese.animal} combination brings ${chartAnalysis.chinese.element.toLowerCase()} energy to your natural ${chartAnalysis.chinese.animal.toLowerCase()} characteristics.`);
    }

    return insights;
  }

  private generateRecommendations(chartAnalysis: any, intent: any, birthData: BirthData): string[] {
    const recommendations = [];
    
    // Time-based recommendations
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayPlanet = this.transits.weekly.planetary_days[currentDay as keyof typeof this.transits.weekly.planetary_days];
    
    recommendations.push(`Today (${currentDay}) is ruled by ${dayPlanet}, making it ideal for ${dayPlanet.toLowerCase()}-related activities.`);

    // Element-based recommendations
    if (chartAnalysis.western?.sun?.sign) {
      const element = this.knowledge.western.signs[chartAnalysis.western.sun.sign as keyof typeof this.knowledge.western.signs]?.element;
      if (element) {
        recommendations.push(`As a ${element} sign, engage with ${element.toLowerCase()} element activities for balance and energy.`);
      }
    }

    // System-specific recommendations
    if (chartAnalysis.humanDesign?.authority) {
      recommendations.push(`Trust your ${chartAnalysis.humanDesign.authority} authority when making important decisions.`);
    }

    return recommendations;
  }

  private calculateOptimalTiming(chartAnalysis: any, birthData: BirthData): string[] {
    const timing = [];
    const currentDate = new Date();
    
    // Daily timing
    timing.push("Best hours today: 6-8 AM (spiritual practice), 2-4 PM (creative work), 7-9 PM (relationships)");
    
    // Weekly timing
    const daysAhead = [];
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(currentDate);
      futureDate.setDate(currentDate.getDate() + i);
      const dayName = futureDate.toLocaleDateString('en-US', { weekday: 'long' });
      const dayPlanet = this.transits.weekly.planetary_days[dayName as keyof typeof this.transits.weekly.planetary_days];
      daysAhead.push(`${dayName}: ${dayPlanet} energy`);
    }
    timing.push(`Week ahead: ${daysAhead.slice(0, 3).join(", ")}`);
    
    // Monthly timing based on birth data
    if (birthData.birthDate) {
      const birthMonth = new Date(birthData.birthDate).getMonth();
      const currentMonth = currentDate.getMonth();
      const monthsUntilBirthday = (birthMonth - currentMonth + 12) % 12;
      
      if (monthsUntilBirthday <= 3) {
        timing.push(`Approaching your solar return in ${monthsUntilBirthday} months - excellent time for new beginnings`);
      }
    }

    return timing;
  }
}

export const astrologyAI = new AstrologyAI();