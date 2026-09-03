/**
 * Torchlight — chart assembly
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { findAspects, type Aspect } from './core/aspects';
import { tropicalToSidereal } from './core/ayanamsa';
import { allPlanetPositions, lunarNodes, type PlanetPosition } from './core/ephemeris';
import { computeHouses, houseOf, type HouseSystem, type Houses } from './core/houses';
import { julianCenturies, toJulianDay, utToTT } from './core/time';
import {
  mapChinese,
  mapHumanDesign,
  mapNumerology,
  mapVedic,
  mapWestern,
} from './synthesis/mappings';
import { synthesise, type Synthesis } from './synthesis/synthesise';
import type { TraitReading } from './synthesis/traits';
import { fourPillars, type FourPillars } from './systems/chinese';
import { recommendColours, type ColourRecommendation } from './systems/colour';
import { activeDasha, vimshottariDashas, type DashaPeriod } from './systems/dasha';
import { recommendGemstones, type GemstoneRecommendation } from './systems/gemstone';
import { humanDesignChart, type HumanDesignChart } from './systems/human-design';
import { nakshatraOf, rashiOf, type NakshatraInfo, type RashiInfo } from './systems/nakshatra';
import { numerologyProfile, type NumerologyProfile } from './systems/numerology';
import { panchangaOf, type Panchanga } from './systems/panchanga';
import { tarotBirthCards, type TarotBirthCards } from './systems/tarot';
import { allVargas, type VargaPosition, type VargaType } from './systems/varga';

/**
 * Assembles a complete chart from one birth.
 *
 * Every other module in the engine answers one narrow question. This is the
 * only place they are put together, and it exists so that a caller — an API
 * handler, a test, an interface — has a single entry point rather than needing
 * to know which of twenty modules to call in what order.
 *
 * Two things this file is careful about:
 *
 *   **Time is converted once, at the boundary.** A birth arrives as local
 *   wall-clock time plus a UTC offset. Everything downstream needs one of three
 *   forms — the UT instant, Terrestrial Time for planetary theory, or the local
 *   clock for the Chinese day and hour pillars — and each is derived here and
 *   passed on. No module below recomputes it, so there is one place a timezone
 *   error could occur rather than twenty.
 *
 *   **A missing birth time degrades honestly.** Houses, the ascendant and the
 *   Chinese hour pillar cannot be computed without one. Rather than substituting
 *   noon and presenting the result as fact — which is what most implementations
 *   do — those sections are omitted and `hasBirthTime` says why. A reading can
 *   then explain what is missing instead of quietly being wrong.
 */

/** What a caller supplies. */
export interface BirthInput {
  /** Full name, for numerology. Optional: the rest of the chart does not need it. */
  name?: string;
  year: number;
  /** 1-12. */
  month: number;
  day: number;
  /** Local wall-clock hour, 0-23. Omit when the birth time is unknown. */
  hour?: number;
  /** Local wall-clock minute, 0-59. */
  minute?: number;
  /**
   * Offset from UT in hours at the moment of birth, east positive.
   * Historical offsets differ from present-day ones, so this must be resolved
   * by the caller against the IANA database rather than assumed.
   */
  utcOffsetHours: number;
  latitude: number;
  /** East positive. */
  longitude: number;
  houseSystem?: HouseSystem;
}

export interface PlacedPlanet extends PlanetPosition {
  /** Tropical sign, 1-12. */
  signIndex: number;
  /** Sidereal longitude, for the Vedic reading. */
  siderealLongitude: number;
  siderealSign: RashiInfo;
  nakshatra: NakshatraInfo;
  /** House number, or null when the birth time is unknown. */
  house: number | null;
}

export interface WesternSection {
  planets: PlacedPlanet[];
  aspects: Aspect[];
  /** Null when the birth time is unknown. */
  houses: Houses | null;
  northNode: number;
  southNode: number;
}

export interface VedicSection {
  ayanamsaDegrees: number;
  moonNakshatra: NakshatraInfo;
  moonRashi: RashiInfo;
  /** Null when the birth time is unknown, since the lagna needs it. */
  ascendantRashi: RashiInfo | null;
  dashas: DashaPeriod[];
  currentDasha: ReturnType<typeof activeDasha>;
  /** Divisional charts for the Moon, the primary Vedic significator. */
  moonVargas: Record<VargaType, VargaPosition>;
  panchanga: Panchanga;
}

export interface Chart {
  /** Echoed so a stored chart carries the input that produced it. */
  input: BirthInput;
  /** True when a birth time was supplied and houses could be computed. */
  hasBirthTime: boolean;
  /** The UT instant of birth. */
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
  /** Every trait reading, so a caller can re-synthesise or inspect. */
  traitReadings: TraitReading[];
  /** Version of the engine that produced this, for cache invalidation. */
  engineVersion: string;
}

/**
 * Bumped whenever a change would alter output for the same input.
 *
 * Stored charts carry this so a correction can invalidate exactly the rows it
 * affects rather than requiring a guess about which are stale.
 */
export const ENGINE_VERSION = '1.0.0';

/** Tropical sign index, 1-12, from a longitude. */
function signIndexOf(longitude: number): number {
  return Math.floor((((longitude % 360) + 360) % 360) / 30) + 1;
}

const TROPICAL_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const;

/** Tropical sign name, for display and for the synthesis source string. */
export function tropicalSignName(longitude: number): string {
  return TROPICAL_SIGNS[signIndexOf(longitude) - 1] as string;
}

/**
 * Builds the complete chart.
 *
 * Deterministic: the same input always produces the same output, which is what
 * makes a stored chart safe to cache and a synthesis safe to compare across
 * runs.
 */
export function buildChart(input: BirthInput): Chart {
  const hasBirthTime = input.hour !== undefined;
  const hour = input.hour ?? 12;
  const minute = input.minute ?? 0;

  // Local wall-clock to UT. This is the only place the offset is applied.
  const utcHourDecimal = hour + minute / 60 - input.utcOffsetHours;
  const jdUT = toJulianDay(input.year, input.month, input.day, 0, 0, 0) + utcHourDecimal / 24;

  // Terrestrial Time for planetary theory; UT stays for sidereal time.
  const t = julianCenturies(utToTT(jdUT, input.year, input.month));

  // The same instant as a Date, for modules that take one.
  const utcMillis = Date.UTC(input.year, input.month - 1, input.day) + utcHourDecimal * 3600000;
  const utcDate = new Date(utcMillis);

  // Local wall-clock as a Date, for the Chinese day and hour pillars, which
  // turn on local midnight and local clock hours rather than on UT.
  const localDate = new Date(Date.UTC(input.year, input.month - 1, input.day, hour, minute, 0));

  // ---- Western ----------------------------------------------------------

  const positions = allPlanetPositions(utcDate);
  const nodes = lunarNodes(utcDate);

  const houses = hasBirthTime
    ? computeHouses(jdUT, t, input.latitude, input.longitude, input.houseSystem ?? 'placidus')
    : null;

  const planets: PlacedPlanet[] = positions.map((position) => {
    const sidereal = tropicalToSidereal(position.longitude, t);
    return {
      ...position,
      signIndex: signIndexOf(position.longitude),
      siderealLongitude: sidereal,
      siderealSign: rashiOf(sidereal),
      nakshatra: nakshatraOf(sidereal),
      house: houses ? houseOf(position.longitude, houses.cusps) : null,
    };
  });

  const western: WesternSection = {
    planets,
    aspects: findAspects(positions),
    houses,
    northNode: nodes.north,
    southNode: nodes.south,
  };

  // ---- Vedic ------------------------------------------------------------

  const moon = planets.find((planet) => planet.name === 'Moon') as PlacedPlanet;
  const sun = planets.find((planet) => planet.name === 'Sun') as PlacedPlanet;

  const dashas = vimshottariDashas(utcDate, moon.siderealLongitude);

  const vedic: VedicSection = {
    // Recovered from the conversion rather than recomputed, so the two cannot
    // disagree.
    ayanamsaDegrees: (((sun.longitude - sun.siderealLongitude) % 360) + 360) % 360,
    moonNakshatra: moon.nakshatra,
    moonRashi: moon.siderealSign,
    ascendantRashi: houses ? rashiOf(tropicalToSidereal(houses.ascendant, t)) : null,
    dashas,
    currentDasha: activeDasha(dashas, new Date()),
    moonVargas: allVargas(moon.siderealLongitude),
    panchanga: panchangaOf(sun.siderealLongitude, moon.siderealLongitude),
  };

  // ---- Chinese ----------------------------------------------------------

  // Local time for day and hour, the true instant for year and month, since
  // solar terms are absolute moments rather than local ones.
  const chinese = fourPillars(localDate, utcDate);

  // ---- Numerology -------------------------------------------------------

  const numerology = input.name
    ? numerologyProfile(input.name, input.year, input.month, input.day)
    : null;

  // ---- Remaining systems ------------------------------------------------

  const humanDesign = humanDesignChart(utcDate);
  const tarot = tarotBirthCards(input.year, input.month, input.day);

  const ascendantSignIndex = vedic.ascendantRashi?.index ?? moon.siderealSign.index;

  const gemstones = recommendGemstones({
    ascendantSignIndex,
    moonSignIndex: moon.siderealSign.index,
    ...(vedic.currentDasha.mahadasha
      ? { currentDashaLord: vedic.currentDasha.mahadasha.planet }
      : {}),
  });

  const colours = recommendColours({
    ascendantSignIndex,
    moonSignIndex: moon.siderealSign.index,
    dayMasterElement: chinese.dayMaster.element,
  });

  // ---- Synthesis --------------------------------------------------------

  const traitReadings: TraitReading[] = [
    ...mapWestern(sun.signIndex, tropicalSignName(sun.longitude)),
    ...mapVedic(moon.siderealSign.index, moon.siderealSign.name, moon.nakshatra.ruler),
    ...mapChinese(chinese.dayMaster.element, chinese.dayMaster.yang, chinese.dayMaster.pinyin),
    ...(numerology ? mapNumerology(numerology.lifePath) : []),
    ...mapHumanDesign(humanDesign.personalitySun.line, humanDesign.designSun.line),
  ];

  return {
    input,
    hasBirthTime,
    utc: utcDate.toISOString(),
    western,
    vedic,
    chinese,
    numerology,
    humanDesign,
    tarot,
    gemstones,
    colours,
    synthesis: synthesise(traitReadings),
    traitReadings,
    engineVersion: ENGINE_VERSION,
  };
}
