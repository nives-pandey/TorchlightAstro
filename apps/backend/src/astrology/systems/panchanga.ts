/**
 * Torchlight — Panchanga, the five limbs of the Hindu calendar
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { normalizeDegrees } from '../core/time';
import { nakshatraOf, type NakshatraInfo } from './nakshatra';

/**
 * Panchanga — literally "five limbs" — is the traditional Hindu almanac, and
 * the framework within which Vedic astrology situates a moment in time.
 *
 * The five limbs are Tithi, Vara, Nakshatra, Yoga and Karana. Four of the five
 * derive from the *relationship* between the Sun and the Moon rather than from
 * either alone, which makes this an unusually good test of the engine: an error
 * in either luminary, or in the ayanamsa, shows up immediately as a wrong
 * tithi or yoga, where a chart of individual placements might hide it.
 *
 * Every longitude here is sidereal. Tithi and Karana happen to be invariant to
 * the ayanamsa because they use the *difference* between two longitudes, and
 * the ayanamsa cancels — a property the tests exploit deliberately, since it
 * isolates the ephemeris from the ayanamsa when hunting for the source of a
 * discrepancy.
 */

/** A tithi is 12° of elongation of the Moon from the Sun. */
export const TITHI_SPAN = 12;

/** A yoga is 13°20′ of the *sum* of the two longitudes. */
export const YOGA_SPAN = 360 / 27;

/** A karana is half a tithi. */
export const KARANA_SPAN = TITHI_SPAN / 2;

/**
 * The thirty tithis of a lunar month, named in order.
 *
 * The first fifteen belong to the waxing fortnight (Shukla Paksha) and the
 * second fifteen to the waning (Krishna Paksha), so the names repeat with the
 * paksha distinguishing them. Purnima (full moon) closes the waxing half and
 * Amavasya (new moon) the waning.
 */
export const TITHI_NAMES: readonly string[] = [
  'Pratipada',
  'Dwitiya',
  'Tritiya',
  'Chaturthi',
  'Panchami',
  'Shashthi',
  'Saptami',
  'Ashtami',
  'Navami',
  'Dashami',
  'Ekadashi',
  'Dwadashi',
  'Trayodashi',
  'Chaturdashi',
  'Purnima',
] as const;

/** The twenty-seven yogas, in order. */
export const YOGA_NAMES: readonly string[] = [
  'Vishkambha',
  'Priti',
  'Ayushman',
  'Saubhagya',
  'Shobhana',
  'Atiganda',
  'Sukarma',
  'Dhriti',
  'Shula',
  'Ganda',
  'Vriddhi',
  'Dhruva',
  'Vyaghata',
  'Harshana',
  'Vajra',
  'Siddhi',
  'Vyatipata',
  'Variyana',
  'Parigha',
  'Shiva',
  'Siddha',
  'Sadhya',
  'Shubha',
  'Shukla',
  'Brahma',
  'Indra',
  'Vaidhriti',
] as const;

/**
 * The eleven karanas.
 *
 * Seven are "movable" and repeat eight times through the lunar month; four are
 * "fixed" and occur once each, clustered around the new moon. That irregular
 * arrangement is the whole subtlety of karana calculation: the sequence is not
 * a simple modulo, and treating it as one puts every karana near the new moon
 * in the wrong place.
 */
const MOVABLE_KARANAS: readonly string[] = [
  'Bava',
  'Balava',
  'Kaulava',
  'Taitila',
  'Gara',
  'Vanija',
  'Vishti',
] as const;

const FIXED_KARANAS: readonly string[] = ['Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'] as const;

export type Paksha = 'Shukla' | 'Krishna';

export interface Tithi {
  /** 1-30 across the whole lunar month. */
  index: number;
  /** 1-15 within the fortnight. */
  indexInPaksha: number;
  name: string;
  paksha: Paksha;
  /** How far through this tithi, 0 to 1. */
  fraction: number;
}

export interface Yoga {
  index: number;
  name: string;
  fraction: number;
}

export interface Karana {
  index: number;
  name: string;
  fraction: number;
  fixed: boolean;
}

export interface Panchanga {
  tithi: Tithi;
  nakshatra: NakshatraInfo;
  yoga: Yoga;
  karana: Karana;
  /** Elongation of the Moon from the Sun, 0-360. */
  elongation: number;
}

/**
 * The tithi at a moment.
 *
 * Defined by the Moon's elongation from the Sun in 12° steps, so it is
 * independent of the ayanamsa: both longitudes shift by the same amount and the
 * difference is unchanged. Tropical or sidereal inputs give the same answer,
 * provided both come from the same zodiac.
 */
export function tithiOf(sunLongitude: number, moonLongitude: number): Tithi {
  const elongation = normalizeDegrees(moonLongitude - sunLongitude);
  const zeroBased = Math.floor(elongation / TITHI_SPAN);

  const paksha: Paksha = zeroBased < 15 ? 'Shukla' : 'Krishna';
  const indexInPaksha = (zeroBased % 15) + 1;

  // The fifteenth tithi of each fortnight has its own name: the full moon
  // closes the waxing half, the new moon the waning.
  let name: string;
  if (indexInPaksha === 15) {
    name = paksha === 'Shukla' ? 'Purnima' : 'Amavasya';
  } else {
    name = TITHI_NAMES[indexInPaksha - 1] as string;
  }

  return {
    index: zeroBased + 1,
    indexInPaksha,
    name,
    paksha,
    fraction: (elongation % TITHI_SPAN) / TITHI_SPAN,
  };
}

/**
 * The yoga at a moment.
 *
 * Unlike the tithi, this uses the *sum* of the two sidereal longitudes, so it
 * is not ayanamsa-invariant — a wrong ayanamsa shifts the yoga by twice its
 * error. That makes the yoga a sharper test of the ayanamsa than any single
 * placement.
 */
export function yogaOf(sunSidereal: number, moonSidereal: number): Yoga {
  const sum = normalizeDegrees(sunSidereal + moonSidereal);
  const zeroBased = Math.floor(sum / YOGA_SPAN);

  return {
    index: zeroBased + 1,
    name: YOGA_NAMES[zeroBased] as string,
    fraction: (sum % YOGA_SPAN) / YOGA_SPAN,
  };
}

/**
 * The karana at a moment.
 *
 * Sixty karanas fill a lunar month, two per tithi. The arrangement is
 * deliberately irregular:
 *
 *   karana 1               Kimstughna, fixed
 *   karanas 2-57           the seven movable karanas, repeating eight times
 *   karanas 58, 59, 60     Shakuni, Chatushpada, Naga, fixed
 *
 * Computing this as a plain modulo of the seven movable names gives the right
 * answer for most of the month and the wrong one around the new moon, which is
 * exactly where the fixed karanas carry their traditional significance.
 */
export function karanaOf(sunLongitude: number, moonLongitude: number): Karana {
  const elongation = normalizeDegrees(moonLongitude - sunLongitude);
  const zeroBased = Math.floor(elongation / KARANA_SPAN);
  const index = zeroBased + 1;

  let name: string;
  let fixed: boolean;

  if (index === 1) {
    name = 'Kimstughna';
    fixed = true;
  } else if (index >= 58) {
    // 58, 59, 60 → Shakuni, Chatushpada, Naga.
    name = FIXED_KARANAS[index - 58] as string;
    fixed = true;
  } else {
    // Karanas 2 through 57 cycle the seven movable names.
    name = MOVABLE_KARANAS[(index - 2) % 7] as string;
    fixed = false;
  }

  return {
    index,
    name,
    fraction: (elongation % KARANA_SPAN) / KARANA_SPAN,
    fixed,
  };
}

/**
 * The full Panchanga for a moment.
 *
 * Takes sidereal longitudes. The Vara (weekday) is deliberately excluded: it
 * depends on local sunrise rather than on the positions, and belongs with the
 * place-aware part of the engine rather than here.
 */
export function panchangaOf(sunSidereal: number, moonSidereal: number): Panchanga {
  return {
    tithi: tithiOf(sunSidereal, moonSidereal),
    nakshatra: nakshatraOf(moonSidereal),
    yoga: yogaOf(sunSidereal, moonSidereal),
    karana: karanaOf(sunSidereal, moonSidereal),
    elongation: normalizeDegrees(moonSidereal - sunSidereal),
  };
}
