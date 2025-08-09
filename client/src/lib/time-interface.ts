// Dynamic time-based interface system
export interface TimeBasedTheme {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  card: string;
  greeting: string;
  cosmicElement: string;
  energyLevel: 'low' | 'medium' | 'high';
}

export interface DailyParticulars {
  date: string;
  moonPhase: string;
  moonSign: string;
  sunSign: string;
  dominantElement: string;
  luckyNumbers: number[];
  colors: string[];
  recommendation: string;
  warning: string;
  bestTime: string;
  energy: string;
}

export function getTimeOfDay(): 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night' | 'midnight' {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  if (hour >= 21 && hour < 24) return 'night';
  return 'midnight';
}

export function getTimeBasedTheme(): TimeBasedTheme {
  const timeOfDay = getTimeOfDay();
  
  const themes: Record<string, TimeBasedTheme> = {
    dawn: {
      background: 'linear-gradient(135deg, hsl(15, 80%, 25%) 0%, hsl(35, 90%, 35%) 50%, hsl(45, 85%, 65%) 100%)',
      primary: 'hsl(35, 90%, 60%)',
      secondary: 'hsl(15, 70%, 50%)',
      accent: 'hsl(45, 85%, 70%)',
      text: 'hsl(30, 20%, 90%)',
      card: 'rgba(255, 140, 0, 0.1)',
      greeting: 'Welcome to the Dawn',
      cosmicElement: '🌅',
      energyLevel: 'medium'
    },
    morning: {
      background: 'linear-gradient(135deg, hsl(45, 100%, 50%) 0%, hsl(60, 100%, 60%) 50%, hsl(200, 80%, 70%) 100%)',
      primary: 'hsl(45, 100%, 55%)',
      secondary: 'hsl(200, 80%, 60%)',
      accent: 'hsl(60, 100%, 65%)',
      text: 'hsl(220, 30%, 20%)',
      card: 'rgba(255, 223, 0, 0.15)',
      greeting: 'Good Morning, Cosmic Soul',
      cosmicElement: '☀️',
      energyLevel: 'high'
    },
    afternoon: {
      background: 'linear-gradient(135deg, hsl(44, 45%, 65%) 0%, hsl(180, 25%, 55%) 50%, hsl(30, 8%, 18%) 100%)',
      primary: 'hsl(44, 45%, 65%)',
      secondary: 'hsl(180, 25%, 55%)',
      accent: 'hsl(30, 8%, 18%)',
      text: 'hsl(0, 0%, 95%)',
      card: 'rgba(0, 123, 255, 0.15)',
      greeting: 'Afternoon Clarity',
      cosmicElement: '🌞',
      energyLevel: 'high'
    },
    evening: {
      background: 'linear-gradient(135deg, hsl(44, 45%, 65%) 0%, hsl(180, 25%, 55%) 50%, hsl(30, 8%, 18%) 100%)',
      primary: 'hsl(44, 45%, 65%)',
      secondary: 'hsl(180, 25%, 55%)',
      accent: 'hsl(30, 8%, 18%)',
      text: 'hsl(60, 10%, 96%)',
      card: 'rgba(255, 20, 147, 0.15)',
      greeting: 'Evening Reflection',
      cosmicElement: '🌇',
      energyLevel: 'medium'
    },
    night: {
      background: 'linear-gradient(135deg, hsl(44, 45%, 65%) 0%, hsl(180, 25%, 55%) 50%, hsl(30, 8%, 18%) 100%)',
      primary: 'hsl(44, 45%, 65%)',
      secondary: 'hsl(180, 25%, 55%)',
      accent: 'hsl(30, 8%, 18%)',
      text: 'hsl(60, 10%, 96%)',
      card: 'rgba(138, 43, 226, 0.2)',
      greeting: 'Mystical Night',
      cosmicElement: '🌙',
      energyLevel: 'low'
    },
    midnight: {
      background: 'linear-gradient(135deg, hsl(44, 45%, 65%) 0%, hsl(180, 25%, 55%) 50%, hsl(30, 8%, 18%) 100%)',
      primary: 'hsl(44, 45%, 65%)',
      secondary: 'hsl(180, 25%, 55%)',
      accent: 'hsl(30, 8%, 18%)',
      text: 'hsl(60, 10%, 96%)',
      card: 'rgba(75, 0, 130, 0.3)',
      greeting: 'Deep Midnight Wisdom',
      cosmicElement: '✨',
      energyLevel: 'low'
    }
  };
  
  return themes[timeOfDay];
}

export function getDailyParticulars(): DailyParticulars {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Calculate moon phase based on lunar cycle (approximate)
  const lunarCycle = 29.53;
  const moonPhaseIndex = Math.floor((dayOfYear % lunarCycle) / (lunarCycle / 8));
  const moonPhases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 
                     'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  
  // Calculate moon sign (simplified)
  const moonSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const moonSignIndex = Math.floor((dayOfYear * 2.33) % 12); // Moon changes sign ~every 2.33 days
  
  // Sun sign based on date
  const sunSignIndex = Math.floor((today.getMonth() * 30 + today.getDate()) / 30.4) % 12;
  
  // Elements cycle
  const elements = ['Fire', 'Earth', 'Air', 'Water'];
  const elementIndex = dayOfYear % 4;
  
  // Generate lucky numbers
  const luckyNumbers = Array.from({length: 3}, (_, i) => ((dayOfYear + i * 7) % 49) + 1);
  
  // Time-based colors
  const timeOfDay = getTimeOfDay();
  const colorSets = {
    dawn: ['hsl(44, 45%, 65%)', 'hsl(44, 45%, 65%)', 'hsl(44, 45%, 65%)'],
    morning: ['hsl(180, 25%, 55%)', 'hsl(180, 25%, 55%)', 'hsl(30, 8%, 18%)'],
    afternoon: ['hsl(44, 45%, 65%)', 'hsl(180, 25%, 55%)', 'hsl(60, 10%, 96%)'],
    evening: ['hsl(44, 45%, 65%)', 'hsl(180, 25%, 55%)', 'hsl(60, 10%, 96%)'],
    night: ['hsl(180, 25%, 55%)', 'hsl(30, 8%, 18%)', 'hsl(180, 25%, 55%)'],
    midnight: ['hsl(30, 8%, 18%)', 'hsl(30, 5%, 66%)', 'hsl(180, 25%, 55%)']
  };
  
  return {
    date: today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    moonPhase: moonPhases[moonPhaseIndex],
    moonSign: moonSigns[moonSignIndex],
    sunSign: moonSigns[sunSignIndex],
    dominantElement: elements[elementIndex],
    luckyNumbers,
    colors: colorSets[timeOfDay] || colorSets.night,
    recommendation: getTimeBasedRecommendation(timeOfDay, moonPhases[moonPhaseIndex]),
    warning: getTimeBasedWarning(timeOfDay),
    bestTime: getBestTimeForActivities(timeOfDay),
    energy: getEnergyDescription(timeOfDay, moonPhases[moonPhaseIndex])
  };
}

function getTimeBasedRecommendation(timeOfDay: string, moonPhase: string): string {
  const recommendations = {
    dawn: `Perfect time for new beginnings and setting intentions. The ${moonPhase} energy supports fresh starts.`,
    morning: `High energy period ideal for important decisions and creative work. Your cosmic alignment is strongest now.`,
    afternoon: `Focus on communication and social connections. The universe supports collaborative efforts.`,
    evening: `Time for introspection and planning. The ${moonPhase} encourages reflection on today's experiences.`,
    night: `Perfect for meditation and spiritual practices. Your intuition is heightened during this mystical hour.`,
    midnight: `Deep wisdom and subconscious insights emerge. Trust your dreams and inner guidance tonight.`
  };
  
  return recommendations[timeOfDay as keyof typeof recommendations] || recommendations.night;
}

function getTimeBasedWarning(timeOfDay: string): string {
  const warnings = {
    dawn: 'Avoid making hasty decisions. Let the morning clarity guide you.',
    morning: 'Don\'t overcommit your energy. Save some for the day ahead.',
    afternoon: 'Be mindful of communication misunderstandings. Think before speaking.',
    evening: 'Avoid starting new projects. Focus on completing existing tasks.',
    night: 'Don\'t make major life decisions. Wait for daylight clarity.',
    midnight: 'Limit exposure to negative energy. Protect your psychic space.'
  };
  
  return warnings[timeOfDay as keyof typeof warnings] || warnings.night;
}

function getBestTimeForActivities(timeOfDay: string): string {
  const activities = {
    dawn: 'Meditation, goal setting, journaling',
    morning: 'Important meetings, creative work, exercise',
    afternoon: 'Social activities, learning, communication',
    evening: 'Family time, planning, gentle exercise',
    night: 'Reading, relaxation, spiritual practices',
    midnight: 'Dream work, deep meditation, rest'
  };
  
  return activities[timeOfDay as keyof typeof activities] || activities.night;
}

function getEnergyDescription(timeOfDay: string, moonPhase: string): string {
  const baseEnergy = {
    dawn: 'Gentle awakening energy with potential for growth',
    morning: 'High vitality and clear thinking powers',
    afternoon: 'Balanced energy perfect for action and communication',
    evening: 'Calming energy shifting toward introspection',
    night: 'Mystical energy enhancing intuition and dreams',
    midnight: 'Deep, transformative energy for inner work'
  };
  
  const moonModifier = moonPhase.includes('New') ? 'enhanced by new beginnings' :
                      moonPhase.includes('Full') ? 'amplified by lunar fullness' :
                      moonPhase.includes('Waxing') ? 'growing with lunar expansion' :
                      'releasing with lunar contraction';
  
  return `${baseEnergy[timeOfDay as keyof typeof baseEnergy]} ${moonModifier}.`;
}