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
      Ashwini: { deity: "Ashwini Kumaras", symbol: "Horse's head", nature: "Swift", traits: ["healing", "pioneering", "spontaneous"], career: ["medicine", "transportation", "emergency services"], food: ["light", "easily digestible", "fresh fruits"], activities: ["early morning", "quick decisions", "healing practices"] },
      Bharani: { deity: "Yama", symbol: "Yoni", nature: "Creative", traits: ["nurturing", "creative", "transformative"], career: ["arts", "fertility counseling", "agriculture"], food: ["nourishing", "organic", "fertility enhancing"], activities: ["creative projects", "gardening", "reproductive health"] },
      Krittika: { deity: "Agni", symbol: "Razor", nature: "Sharp", traits: ["cutting", "purifying", "determined"], career: ["surgery", "criticism", "purification work"], food: ["spicy", "digestive", "purifying"], activities: ["cleansing rituals", "focused work", "precision tasks"] },
      Rohini: { deity: "Brahma", symbol: "Cart", nature: "Growth", traits: ["creative", "beautiful", "materialistic"], career: ["arts", "luxury goods", "beauty industry"], food: ["rich", "beautiful presentation", "dairy"], activities: ["artistic creation", "shopping", "beauty treatments"] },
      Mrigashira: { deity: "Soma", symbol: "Deer's head", nature: "Searching", traits: ["seeking", "restless", "curious"], career: ["research", "exploration", "investigation"], food: ["variety", "exotic", "light meals"], activities: ["travel", "learning", "exploration"] },
      Ardra: { deity: "Rudra", symbol: "Teardrop", nature: "Stormy", traits: ["emotional", "transformative", "intense"], career: ["psychology", "research", "transformation work"], food: ["cooling", "soothing", "emotional comfort"], activities: ["emotional healing", "research", "meditation"] },
      Punarvasu: { deity: "Aditi", symbol: "Bow and quiver", nature: "Renewal", traits: ["optimistic", "nurturing", "philosophical"], career: ["teaching", "counseling", "spiritual guidance"], food: ["wholesome", "traditional", "home-cooked"], activities: ["family time", "spiritual practices", "teaching"] },
      Pushya: { deity: "Brihaspati", symbol: "Cow's udder", nature: "Nourishing", traits: ["caring", "spiritual", "protective"], career: ["childcare", "spiritual teaching", "nutrition"], food: ["milk products", "nourishing", "pure"], activities: ["caring for others", "spiritual study", "protective measures"] },
      Ashlesha: { deity: "Nagas", symbol: "Serpent", nature: "Embracing", traits: ["mysterious", "intuitive", "possessive"], career: ["psychology", "occult sciences", "medicine"], food: ["detoxifying", "medicinal", "carefully prepared"], activities: ["meditation", "healing practices", "introspection"] },
      Magha: { deity: "Pitrs", symbol: "Throne", nature: "Regal", traits: ["authoritative", "traditional", "proud"], career: ["leadership", "government", "traditional roles"], food: ["royal", "traditional", "ceremonial"], activities: ["leadership roles", "ceremonies", "ancestral worship"] },
      PurvaPhalguni: { deity: "Bhaga", symbol: "Hammock", nature: "Relaxation", traits: ["pleasure-loving", "creative", "luxurious"], career: ["entertainment", "luxury services", "arts"], food: ["rich", "indulgent", "pleasurable"], activities: ["relaxation", "entertainment", "creative pursuits"] },
      UttaraPhalguni: { deity: "Aryaman", symbol: "Bed", nature: "Partnership", traits: ["helpful", "generous", "partnership-oriented"], career: ["counseling", "partnerships", "service"], food: ["shared meals", "balanced", "partnership dining"], activities: ["collaborative work", "helping others", "partnerships"] },
      Hasta: { deity: "Savitar", symbol: "Hand", nature: "Skillful", traits: ["skilled", "hardworking", "practical"], career: ["crafts", "manual work", "skilled trades"], food: ["handmade", "crafted", "practical meals"], activities: ["handicrafts", "skilled work", "practical tasks"] },
      Chitra: { deity: "Tvashtar", symbol: "Pearl", nature: "Bright", traits: ["artistic", "attractive", "dynamic"], career: ["design", "architecture", "visual arts"], food: ["colorful", "beautifully presented", "visually appealing"], activities: ["artistic creation", "design work", "beautification"] },
      Swati: { deity: "Vayu", symbol: "Sword", nature: "Independent", traits: ["independent", "flexible", "diplomatic"], career: ["trade", "diplomacy", "independent business"], food: ["light", "airy", "varied"], activities: ["independent work", "travel", "diplomatic activities"] },
      Vishakha: { deity: "Indra-Agni", symbol: "Triumphal arch", nature: "Determined", traits: ["goal-oriented", "ambitious", "determined"], career: ["goal achievement", "competitive fields", "leadership"], food: ["energy-giving", "competitive nutrition", "achievement-focused"], activities: ["goal pursuit", "competitions", "achievement-oriented tasks"] },
      Anuradha: { deity: "Mitra", symbol: "Lotus", nature: "Friendship", traits: ["friendly", "devoted", "harmonious"], career: ["counseling", "friendship-based work", "harmony creation"], food: ["harmonious combinations", "friendship meals", "balanced"], activities: ["social activities", "friendship building", "harmonious pursuits"] },
      Jyeshtha: { deity: "Indra", symbol: "Earring", nature: "Senior", traits: ["protective", "responsible", "authoritative"], career: ["senior positions", "protection services", "authority roles"], food: ["substantial", "protective nutrition", "senior-appropriate"], activities: ["protective duties", "senior responsibilities", "authority exercises"] },
      Mula: { deity: "Nirriti", symbol: "Bunch of roots", nature: "Foundational", traits: ["investigative", "foundational", "destructive-creative"], career: ["research", "investigation", "foundational work"], food: ["root vegetables", "foundational nutrition", "grounding"], activities: ["research", "foundational work", "investigation"] },
      PurvaAshadha: { deity: "Apas", symbol: "Fan", nature: "Invincible", traits: ["invincible", "purifying", "inspirational"], career: ["inspiration work", "purification", "motivational roles"], food: ["purifying", "inspirational meals", "cleansing"], activities: ["purification practices", "inspirational work", "motivational activities"] },
      UttaraAshadha: { deity: "Vishvedevas", symbol: "Elephant tusk", nature: "Universal", traits: ["universal", "righteous", "final victory"], career: ["universal service", "righteous causes", "final achievement"], food: ["universal appeal", "righteous eating", "victory celebration"], activities: ["universal service", "righteous actions", "victory pursuits"] },
      Shravana: { deity: "Vishnu", symbol: "Ear", nature: "Learning", traits: ["learning", "listening", "knowledge-seeking"], career: ["education", "communication", "knowledge work"], food: ["brain food", "learning-supportive", "concentrated"], activities: ["learning", "listening", "knowledge acquisition"] },
      Dhanishta: { deity: "Vasus", symbol: "Drum", nature: "Wealthy", traits: ["wealthy", "musical", "charitable"], career: ["music", "wealth management", "charity"], food: ["wealthy presentation", "musical ambiance", "charitable sharing"], activities: ["musical activities", "wealth building", "charitable work"] },
      Shatabhisha: { deity: "Varuna", symbol: "Empty circle", nature: "Healing", traits: ["healing", "secretive", "mystical"], career: ["healing", "research", "mystical work"], food: ["healing foods", "mysterious preparations", "therapeutic"], activities: ["healing practices", "research", "mystical pursuits"] },
      PurvaBhadrapada: { deity: "Aja Ekapada", symbol: "Sword", nature: "Fierce", traits: ["fierce", "transformative", "spiritual"], career: ["transformation work", "spiritual guidance", "fierce protection"], food: ["transformative", "spiritual nutrition", "fierce flavors"], activities: ["spiritual practices", "transformation work", "fierce protection"] },
      UttaraBhadrapada: { deity: "Ahir Budhnya", symbol: "Snake", nature: "Deep", traits: ["deep", "mystical", "charitable"], career: ["deep research", "mystical work", "charitable service"], food: ["deep nutrition", "mystical preparation", "charitable meals"], activities: ["deep meditation", "mystical practices", "charitable service"] },
      Revati: { deity: "Pushan", symbol: "Fish", nature: "Nourishing", traits: ["nourishing", "protective", "completion"], career: ["nourishment", "protection", "completion work"], food: ["nourishing", "protective nutrition", "complete meals"], activities: ["nourishing others", "protective actions", "completion tasks"] }
    },
    doshas: {
      Vata: { elements: ["Air", "Space"], qualities: ["dry", "light", "cold", "rough"], traits: ["creative", "energetic", "anxious"], career: ["creative fields", "communication", "travel"], food: ["warm", "moist", "grounding", "regular meals"], activities: ["regular routine", "grounding exercises", "warm environments"] },
      Pitta: { elements: ["Fire", "Water"], qualities: ["hot", "sharp", "light", "oily"], traits: ["intelligent", "focused", "irritable"], career: ["leadership", "analytical work", "competitive fields"], food: ["cooling", "sweet", "bitter", "avoid spicy"], activities: ["cooling activities", "moderate exercise", "avoid excessive heat"] },
      Kapha: { elements: ["Earth", "Water"], qualities: ["heavy", "slow", "cold", "oily"], traits: ["stable", "calm", "sluggish"], career: ["stable positions", "nurturing roles", "slow-paced work"], food: ["light", "warm", "spicy", "stimulating"], activities: ["vigorous exercise", "stimulating activities", "variety"] }
    },
    dashas: {
      Sun: { duration: 6, themes: ["authority", "recognition", "father", "government"], career: ["leadership roles", "government", "public service"], activities: ["leadership development", "public speaking", "authority building"] },
      Moon: { duration: 10, themes: ["emotions", "mother", "public", "mind"], career: ["public relations", "hospitality", "healthcare"], activities: ["emotional healing", "nurturing others", "public service"] },
      Mars: { duration: 7, themes: ["energy", "conflict", "brothers", "property"], career: ["military", "sports", "real estate"], activities: ["physical exercise", "competitive activities", "property matters"] },
      Mercury: { duration: 17, themes: ["communication", "learning", "commerce", "friends"], career: ["communication", "education", "business"], activities: ["learning", "communication skills", "business development"] },
      Jupiter: { duration: 16, themes: ["wisdom", "spirituality", "teaching", "children"], career: ["teaching", "counseling", "spiritual guidance"], activities: ["spiritual practices", "teaching", "wisdom sharing"] },
      Venus: { duration: 20, themes: ["love", "beauty", "arts", "luxury"], career: ["arts", "beauty industry", "luxury goods"], activities: ["artistic pursuits", "beauty treatments", "romantic activities"] },
      Saturn: { duration: 19, themes: ["discipline", "hard work", "delays", "service"], career: ["service roles", "disciplined work", "long-term projects"], activities: ["disciplined practices", "service to others", "patience building"] },
      Rahu: { duration: 18, themes: ["ambition", "foreign", "technology", "unconventional"], career: ["technology", "foreign work", "unconventional fields"], activities: ["innovation", "foreign connections", "unconventional pursuits"] },
      Ketu: { duration: 7, themes: ["spirituality", "detachment", "past life", "moksha"], career: ["spiritual work", "research", "occult sciences"], activities: ["spiritual practices", "meditation", "detachment exercises"] }
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
      Wood: { traits: ["growth", "flexibility", "creativity"], career: ["creative fields", "agriculture", "education"], food: ["green vegetables", "sour flavors", "spring foods"], activities: ["planning", "creative projects", "growth-oriented tasks"] },
      Fire: { traits: ["energy", "passion", "transformation"], career: ["entertainment", "sales", "leadership"], food: ["red foods", "bitter flavors", "summer foods"], activities: ["energetic pursuits", "passionate projects", "transformative work"] },
      Earth: { traits: ["stability", "nurturing", "practicality"], career: ["real estate", "agriculture", "healthcare"], food: ["sweet flavors", "yellow foods", "grounding meals"], activities: ["practical tasks", "nurturing activities", "stable routines"] },
      Metal: { traits: ["precision", "organization", "refinement"], career: ["finance", "engineering", "organization"], food: ["white foods", "spicy flavors", "autumn foods"], activities: ["organizing", "precision work", "refinement projects"] },
      Water: { traits: ["flow", "adaptability", "wisdom"], career: ["communication", "transportation", "wisdom work"], food: ["salty flavors", "black foods", "winter foods"], activities: ["adaptive activities", "flowing movements", "wisdom seeking"] }
    }
  },
  humanDesign: {
    types: {
      Generator: { strategy: "Respond", authority: ["Sacral", "Emotional"], traits: ["life force", "work satisfaction", "sustained energy"], career: ["satisfying work", "building", "sustained effort"], activities: ["responding to life", "following satisfaction", "sustainable work"] },
      ManifestingGenerator: { strategy: "Respond and Inform", authority: ["Sacral", "Emotional"], traits: ["multi-passionate", "quick", "efficient"], career: ["multiple interests", "efficient work", "varied tasks"], activities: ["multi-tasking", "responding quickly", "efficient actions"] },
      Projector: { strategy: "Wait for Invitation", authority: ["Splenic", "Emotional", "Ego", "Self"], traits: ["guidance", "efficiency", "recognition"], career: ["guidance roles", "management", "consulting"], activities: ["waiting for recognition", "guiding others", "efficient systems"] },
      Manifestor: { strategy: "Inform before Acting", authority: ["Emotional", "Splenic", "Ego"], traits: ["initiation", "independence", "impact"], career: ["leadership", "initiation", "independent work"], activities: ["initiating projects", "independent action", "informing others"] },
      Reflector: { strategy: "Wait a Lunar Cycle", authority: ["Lunar"], traits: ["community mirror", "wisdom", "uniqueness"], career: ["community roles", "evaluation", "unique perspectives"], activities: ["community involvement", "reflection", "unique contributions"] }
    },
    centers: {
      Head: { function: "Inspiration and mental pressure", defined: "consistent mental pressure", undefined: "inspiration comes and goes" },
      Ajna: { function: "Mental processing and concepts", defined: "fixed way of thinking", undefined: "flexible mental processing" },
      Throat: { function: "Communication and manifestation", defined: "consistent communication", undefined: "communication depends on others" },
      G: { function: "Identity and direction", defined: "fixed sense of self", undefined: "fluid identity and direction" },
      Heart: { function: "Willpower and ego", defined: "consistent willpower", undefined: "willpower comes and goes" },
      Spleen: { function: "Intuition and health", defined: "reliable intuition", undefined: "sporadic intuitive hits" },
      Sacral: { function: "Life force and sexuality", defined: "sustainable energy", undefined: "energy depends on others" },
      SolarPlexus: { function: "Emotions and desires", defined: "emotional wave", undefined: "takes in others' emotions" },
      Root: { function: "Pressure to act", defined: "consistent pressure", undefined: "pressure comes from others" }
    }
  },
  numerology: {
    lifePath: {
      1: { traits: ["leadership", "independence", "pioneering"], career: ["leadership", "entrepreneurship", "innovation"], food: ["energizing", "protein-rich", "leadership fuel"], activities: ["leading projects", "independent work", "pioneering efforts"] },
      2: { traits: ["cooperation", "sensitivity", "harmony"], career: ["counseling", "partnerships", "support roles"], food: ["harmonious combinations", "soothing", "partnership meals"], activities: ["cooperative work", "harmonizing", "supportive roles"] },
      3: { traits: ["creativity", "communication", "joy"], career: ["arts", "communication", "entertainment"], food: ["colorful", "joyful", "creative presentation"], activities: ["creative expression", "communication", "joyful pursuits"] },
      4: { traits: ["stability", "hard work", "organization"], career: ["organization", "building", "systematic work"], food: ["stable nutrition", "organized meals", "building foods"], activities: ["organizing", "building projects", "systematic work"] },
      5: { traits: ["freedom", "adventure", "change"], career: ["travel", "sales", "varied work"], food: ["varied", "adventurous", "international"], activities: ["travel", "adventure", "changing activities"] },
      6: { traits: ["nurturing", "responsibility", "service"], career: ["healthcare", "teaching", "service"], food: ["nurturing", "home-cooked", "service-oriented"], activities: ["nurturing others", "service work", "responsibility taking"] },
      7: { traits: ["analysis", "spirituality", "introspection"], career: ["research", "analysis", "spiritual work"], food: ["pure", "spiritual", "analytical choices"], activities: ["analysis", "spiritual practices", "introspective work"] },
      8: { traits: ["ambition", "material success", "authority"], career: ["business", "finance", "authority positions"], food: ["substantial", "success-oriented", "authoritative"], activities: ["business building", "authority exercises", "material success"] },
      9: { traits: ["humanitarianism", "completion", "wisdom"], career: ["humanitarian work", "teaching", "completion"], food: ["universal appeal", "humanitarian choices", "wisdom foods"], activities: ["humanitarian service", "teaching", "completion work"] }
    }
  },
  kp: {
    significators: {
      1: { houses: [1], planets: ["Sun"], meanings: ["self", "personality", "health"] },
      2: { houses: [2], planets: ["Jupiter", "Venus"], meanings: ["wealth", "family", "speech"] },
      3: { houses: [3], planets: ["Mars", "Mercury"], meanings: ["siblings", "communication", "courage"] },
      4: { houses: [4], planets: ["Moon", "Mercury"], meanings: ["mother", "home", "education"] },
      5: { houses: [5], planets: ["Jupiter", "Sun"], meanings: ["children", "creativity", "education"] },
      6: { houses: [6], planets: ["Mars", "Saturn"], meanings: ["enemies", "health", "service"] },
      7: { houses: [7], planets: ["Venus", "Jupiter"], meanings: ["spouse", "partnerships", "business"] },
      8: { houses: [8], planets: ["Saturn", "Mars"], meanings: ["longevity", "transformation", "occult"] },
      9: { houses: [9], planets: ["Jupiter", "Sun"], meanings: ["father", "dharma", "fortune"] },
      10: { houses: [10], planets: ["Sun", "Mercury"], meanings: ["career", "reputation", "authority"] },
      11: { houses: [11], planets: ["Jupiter", "Sun"], meanings: ["gains", "friends", "fulfillment"] },
      12: { houses: [12], planets: ["Saturn", "Ketu"], meanings: ["losses", "expenses", "moksha"] }
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
    personalityHighlights?: string[];
    cosmicWeather?: string;
    actionItems?: string[];
    followUpQuestions?: string[];
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

    // Generate additional interactive elements
    const personalityHighlights = this.generatePersonalityHighlights(chartAnalysis, intent);
    const cosmicWeather = this.generateCosmicWeather(birthData);
    const actionItems = this.generateActionItems(chartAnalysis, intent, question);
    const followUpQuestions = this.generateFollowUpQuestions(intent, conversationHistory);

    return {
      response,
      insights,
      recommendations,
      timing,
      processingTime,
      personalityHighlights,
      cosmicWeather,
      actionItems,
      followUpQuestions
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

  private generatePersonalityHighlights(chartAnalysis: any, intent: any): string[] {
    const highlights = [];
    
    // Key personality traits from multiple systems
    if (chartAnalysis.western?.sun?.sign) {
      const signData = this.knowledge.western.signs[chartAnalysis.western.sun.sign as keyof typeof this.knowledge.western.signs];
      if (signData) {
        highlights.push(`Core nature: ${signData.traits.slice(0, 2).join(" & ")} (${chartAnalysis.western.sun.sign})`);
      }
    }

    if (chartAnalysis.humanDesign?.type) {
      highlights.push(`Energy type: ${chartAnalysis.humanDesign.type} - naturally designed to ${chartAnalysis.humanDesign.strategy.toLowerCase()}`);
    }

    if (chartAnalysis.chinese?.animal && chartAnalysis.chinese?.element) {
      highlights.push(`Chinese archetype: ${chartAnalysis.chinese.element} ${chartAnalysis.chinese.animal} - brings ${chartAnalysis.chinese.element.toLowerCase()} energy`);
    }

    return highlights;
  }

  private generateCosmicWeather(birthData: BirthData): string {
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayPlanet = this.transits.weekly.planetary_days[currentDay as keyof typeof this.transits.weekly.planetary_days];
    
    // Get moon phase (simplified)
    const dayOfMonth = currentDate.getDate();
    let moonPhase = "";
    if (dayOfMonth <= 7) moonPhase = "New Moon energy";
    else if (dayOfMonth <= 14) moonPhase = "Waxing Moon energy"; 
    else if (dayOfMonth <= 21) moonPhase = "Full Moon energy";
    else moonPhase = "Waning Moon energy";

    return `Today's cosmic weather: ${dayPlanet} day with ${moonPhase} - ideal for ${dayPlanet.toLowerCase()}-focused activities and ${moonPhase.toLowerCase().replace(' energy', '')} manifestation work.`;
  }

  private generateActionItems(chartAnalysis: any, intent: any, question: string): string[] {
    const actions = [];
    
    // Based on question category
    if (intent.category === "career") {
      actions.push("Update your resume to highlight your natural leadership abilities");
      actions.push("Network with people in your field this week during Venus hours (2-4 PM)");
      actions.push("Research opportunities that align with your core strengths");
    } else if (intent.category === "relationships") {
      actions.push("Practice active listening in your conversations today");
      actions.push("Express appreciation to someone important in your life");
      actions.push("Reflect on your relationship patterns and communication style");
    } else if (intent.category === "health") {
      actions.push("Establish a morning routine that energizes your body");
      actions.push("Pay attention to your body's natural rhythms");
      actions.push("Consider stress management techniques suited to your personality");
    } else {
      // General actions
      actions.push("Spend 10 minutes in meditation or reflection today");
      actions.push("Take one small step toward a meaningful goal");
      actions.push("Connect with nature to ground your energy");
    }

    return actions;
  }

  private generateFollowUpQuestions(intent: any, conversationHistory: Array<{role: string, content: string}>): string[] {
    const questions = [];
    
    // Category-specific follow-ups
    if (intent.category === "career") {
      questions.push("What specific career challenges are you facing right now?");
      questions.push("Are you looking to change careers or advance in your current field?");
      questions.push("What work environments energize you most?");
    } else if (intent.category === "relationships") {
      questions.push("What relationship patterns do you notice in your life?");
      questions.push("Are you seeking a romantic partner or working on existing relationships?");
      questions.push("How do you prefer to communicate in relationships?");
    } else if (intent.category === "spirituality") {
      questions.push("What spiritual practices resonate most with you?");
      questions.push("Are you exploring a specific spiritual path?");
      questions.push("What does spiritual growth mean to you personally?");
    } else {
      // General follow-ups
      questions.push("What area of your life would you like to focus on improving?");
      questions.push("Are there any patterns in your life you'd like to understand better?");
      questions.push("What goals are most important to you right now?");
    }

    return questions.slice(0, 3); // Return max 3 questions
  }
}

export const astrologyAI = new AstrologyAI();