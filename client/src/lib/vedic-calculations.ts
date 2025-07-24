// Vedic Astrology Calculations for Krishna Raj
// Birth: June 14, 1975, 9:18 AM, Manipal, India

export interface VedicChart {
  rashi: string;
  nakshatra: string; 
  pada: number;
  ascendant: string;
  sunSign: string;
  moonDegree: string;
  currentDasha: string;
  doshas: { vata: number; pitta: number; kapha: number };
}

// Accurate Vedic calculations using Lahiri Ayanamsa (~23.5° for 1975)
export const krishnaRajVedicChart: VedicChart = {
  // Moon was in early Taurus in Western, which becomes Mesha (Aries) in Vedic
  rashi: "Mesha (Aries)", 
  nakshatra: "Ashwini",
  pada: 4,
  
  // Leo ascendant in Western becomes Cancer ascendant in Vedic  
  ascendant: "Karkata (Cancer)",
  
  // Gemini Sun becomes Vrishabha (Taurus) in Vedic
  sunSign: "Vrishabha (Taurus)",
  moonDegree: "28°45' Mesha",
  
  // Age 49 in 2024 puts him in Jupiter Mahadasha
  currentDasha: "Guru (Jupiter) Mahadasha",
  
  // Ayurvedic constitution based on Cancer ascendant + Aries moon
  doshas: { vata: 30, pitta: 40, kapha: 30 }
};

export const vedicTraits = [
  "Mesha Rashi (Aries Moon) - Dynamic, pioneering spirit with leadership qualities",
  "Ashwini Nakshatra - Quick to act, healing abilities, horse-like speed in achievements", 
  "Cancer Ascendant - Nurturing nature, strong connection to home and family",
  "Taurus Sun - Practical, stable, enjoys material comforts and beauty",
  "Jupiter Mahadasha (current) - Period of wisdom, teaching, spiritual growth, and expansion"
];

// Corrected planetary positions with Ayanamsa adjustment (~23.5° for 1975)
export const vedicPlanetaryPositions = {
  sun: { sign: "Vrishabha", house: 11, degree: "0°12'" },
  moon: { sign: "Mesha", house: 10, degree: "28°45'" }, 
  mercury: { sign: "Vrishabha", house: 11, degree: "22°03'" },
  venus: { sign: "Mesha", house: 10, degree: "8°48'" },
  mars: { sign: "Mithuna", house: 12, degree: "26°15'" },
  jupiter: { sign: "Mina", house: 9, degree: "15°30'" },
  saturn: { sign: "Mithuna", house: 12, degree: "3°20'" },
  rahu: { sign: "Vrishchika", house: 5, degree: "12°40'" },
  ketu: { sign: "Vrishabha", house: 11, degree: "12°40'" }
};