/**
 * Torchlight — chart response types
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * The shape the chart endpoint returns.
 *
 * Mirrors the engine's own types rather than importing them: the engine's
 * interfaces reference `Date` objects and internal unions that do not survive
 * JSON, so what arrives over the wire is a near copy with dates as strings.
 * Declaring that copy here keeps the app honest about what it actually holds.
 *
 * Only the fields the app reads are declared. The response carries more — every
 * planet's aspects, nested dasha sub-periods, each dimension's full working —
 * and those are added here as screens start showing them.
 */

export interface RashiInfo {
  index: number;
  name: string;
  degreesInto: number;
}

export interface NakshatraInfo {
  index: number;
  name: string;
  ruler: string;
  pada: number;
  degreesInto: number;
  fraction: number;
}

/**
 * How each tradition is named in prose.
 *
 * The engine identifies systems by the keys it uses internally — `humanDesign`,
 * `chinese`. Those are fine in JSON and wrong in a sentence a person reads.
 */
export const SYSTEM_NAMES: Readonly<Record<string, string>> = {
  western: 'Western',
  vedic: 'Vedic',
  chinese: 'Chinese',
  numerology: 'Numerology',
  humanDesign: 'Human Design',
  tarot: 'Tarot',
};

/** The twelve tropical signs, indexed by a planet's `signIndex`. */
export const TROPICAL_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

export interface PlacedPlanet {
  name: string;
  longitude: number;
  /** 0-11. The response carries the index; the name is looked up locally. */
  signIndex: number;
  siderealLongitude: number;
  siderealSign: RashiInfo;
  nakshatra: NakshatraInfo;
  retrograde: boolean;
  /** Null when the birth time is unknown, since houses need it. */
  house: number | null;
}

export interface WesternSection {
  planets: PlacedPlanet[];
  houses: {
    system: string;
    ascendant: number;
    midheaven: number;
    cusps: number[];
    /** True when Placidus was undefined at this latitude and whole-sign was used. */
    fellBackToWholeSign: boolean;
  } | null;
  northNode: number;
  southNode: number;
}

export interface DashaPeriod {
  planet: string;
  /** ISO string — `Date` does not survive JSON. */
  start: string;
  end: string;
  years: number;
}

export interface Panchanga {
  tithi: { index: number; indexInPaksha: number; name: string; paksha: string };
  nakshatra: NakshatraInfo;
  yoga: { index: number; name: string };
  karana: { index: number; name: string };
  elongation: number;
}

export interface VedicSection {
  ayanamsaDegrees: number;
  moonNakshatra: NakshatraInfo;
  moonRashi: RashiInfo;
  ascendantRashi: RashiInfo | null;
  dashas: DashaPeriod[];
  currentDasha: { mahadasha: DashaPeriod; antardasha: DashaPeriod | null } | null;
  panchanga: Panchanga;
}

export interface Stem {
  chinese: string;
  pinyin: string;
  element: string;
  yang: boolean;
}

export interface Branch {
  chinese: string;
  pinyin: string;
  animal: string;
  element: string;
}

export interface Pillar {
  stem: Stem;
  branch: Branch;
  ganZhi: string;
  pinyin: string;
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  dayMaster: Stem;
  elementCounts: Record<string, number>;
}

export interface NumerologyProfile {
  system: string;
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  maturity: number;
}

export interface HumanDesignChart {
  activeGates: number[];
  personalitySun: { gate: number; line: number };
  designSun: { gate: number; line: number };
  profile: string;
}

export interface TarotCard {
  number: number;
  name: string;
}

export interface TarotBirthCards {
  sum: number;
  cards: TarotCard[];
  primary: TarotCard;
}

export interface GemstoneRecommendation {
  basis: 'ascendant-ruler' | 'moon-sign-ruler' | 'current-dasha';
  gemstone: { name: string; planet: string; hex?: string };
}

export interface ColourRecommendation {
  basis: 'ascendant-ruler' | 'moon-sign-ruler' | 'day-master-phase';
  colour: { name: string; hex: string };
  source: string;
}

export type TraitDimension = 'expression' | 'stability' | 'orientation' | 'relation' | 'structure';

export interface TraitReading {
  system: string;
  dimension: TraitDimension;
  /** −1 to +1, where the sign points toward the dimension's named poles. */
  value: number;
  confidence: string;
  source: string;
}

export interface DimensionSynthesis {
  dimension: TraitDimension;
  consensus: number;
  pole: string | null;
  agreement: string;
  spread: number;
  readings: TraitReading[];
  supporting: string[];
  opposing: string[];
}

export interface Tension {
  dimension: TraitDimension;
  oneSide: { systems: string[]; pole: string };
  otherSide: { systems: string[]; pole: string };
  intensity: number;
}

export interface Synthesis {
  dimensions: DimensionSynthesis[];
  tensions: Tension[];
  agreements: DimensionSynthesis[];
  systems: string[];
}

export interface Chart {
  /** False when the birth time is unknown; houses and the hour pillar are then absent. */
  hasBirthTime: boolean;
  utc: string;
  western: WesternSection;
  vedic: VedicSection;
  chinese: FourPillars;
  numerology: NumerologyProfile | null;
  humanDesign: HumanDesignChart;
  tarot: TarotBirthCards;
  gemstones: GemstoneRecommendation[];
  colours: ColourRecommendation[];
  synthesis: Synthesis;
  engineVersion: string;
}

/**
 * The plain-language reading of a chart.
 *
 * Null when the reading layer is unavailable — the app renders the placements
 * either way, so a missing reading omits a section rather than breaking a screen.
 */
export interface Reading {
  /** The period they are living through now. */
  now: string;
  /** What stands out in the chart. */
  standsOut: string;
  /** What the traditions say about character. */
  character: string;
  model: string;
  generatedAt: string;
}

/**
 * What `GET /profiles/:id/chart` returns.
 *
 * The chart is wrapped rather than returned bare: a chart is expensive to
 * compute and is cached, and the caller is told which it got and when it was
 * computed.
 */
export interface ChartResponse {
  chart: Chart;
  cached: boolean;
  computedAt: string;
}

/**
 * What each dimension's poles are called, and the question it answers.
 *
 * Duplicated from the engine deliberately: these are display strings, and the
 * app should not have to fetch a chart to know how to label an axis.
 */
export const DIMENSION_POLES: Readonly<
  Record<TraitDimension, { low: string; high: string; question: string }>
> = {
  expression: {
    low: 'Reflective',
    high: 'Outgoing',
    question: 'Where does your energy naturally go?',
  },
  stability: {
    low: 'Changeable',
    high: 'Steady',
    question: 'How do you hold your ground?',
  },
  orientation: {
    low: 'Feeling',
    high: 'Reasoning',
    question: 'What do you trust when deciding?',
  },
  relation: {
    low: 'Independent',
    high: 'Connective',
    question: 'How do you prefer to work?',
  },
  structure: {
    low: 'Improvising',
    high: 'Structured',
    question: 'How much form do you want around you?',
  },
};
