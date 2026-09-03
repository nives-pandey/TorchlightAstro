/**
 * Torchlight — lunar mansions and sidereal signs
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { normalizeDegrees } from '../core/time';

/**
 * Nakshatras — the 27 lunar mansions of Vedic astrology.
 *
 * The sidereal zodiac is divided into 27 equal segments of 13°20′ each, the
 * distance the Moon travels in roughly a day. Each is ruled by a planet, and
 * that rulership is what drives the Vimshottari Dasha timing system: the
 * nakshatra the Moon occupied at birth determines which planetary period a
 * person is born into, and therefore the timing of everything that follows.
 *
 * Every longitude here is **sidereal**. Passing a tropical longitude produces a
 * nakshatra roughly two positions off, which then cascades into the wrong dasha
 * sequence — an error measured in years of a person's life.
 */

/** 360° / 27. */
export const NAKSHATRA_SPAN = 360 / 27;

/** Each nakshatra divides into four padas of 3°20′. */
export const PADA_SPAN = NAKSHATRA_SPAN / 4;

export interface NakshatraInfo {
  /** 1-27, in zodiacal order from 0° sidereal Aries. */
  index: number;
  name: string;
  /** Ruling planet, which drives the Vimshottari Dasha sequence. */
  ruler: string;
  /** Quarter within the nakshatra, 1-4. */
  pada: number;
  /** Degrees travelled into this nakshatra, 0 to 13.333. */
  degreesInto: number;
  /** How far through this nakshatra, 0 to 1. Used to seed the dasha balance. */
  fraction: number;
}

/**
 * The 27 nakshatras in order, with their traditional planetary rulers.
 *
 * The ruler sequence is not arbitrary and must not be reordered: it repeats
 * Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury three times over
 * the 27, and the Vimshottari Dasha depends on exactly that cycle.
 */
export const NAKSHATRAS: ReadonlyArray<{ name: string; ruler: string }> = [
  { name: 'Ashwini', ruler: 'Ketu' },
  { name: 'Bharani', ruler: 'Venus' },
  { name: 'Krittika', ruler: 'Sun' },
  { name: 'Rohini', ruler: 'Moon' },
  { name: 'Mrigashira', ruler: 'Mars' },
  { name: 'Ardra', ruler: 'Rahu' },
  { name: 'Punarvasu', ruler: 'Jupiter' },
  { name: 'Pushya', ruler: 'Saturn' },
  { name: 'Ashlesha', ruler: 'Mercury' },
  { name: 'Magha', ruler: 'Ketu' },
  { name: 'Purva Phalguni', ruler: 'Venus' },
  { name: 'Uttara Phalguni', ruler: 'Sun' },
  { name: 'Hasta', ruler: 'Moon' },
  { name: 'Chitra', ruler: 'Mars' },
  { name: 'Swati', ruler: 'Rahu' },
  { name: 'Vishakha', ruler: 'Jupiter' },
  { name: 'Anuradha', ruler: 'Saturn' },
  { name: 'Jyeshtha', ruler: 'Mercury' },
  { name: 'Mula', ruler: 'Ketu' },
  { name: 'Purva Ashadha', ruler: 'Venus' },
  { name: 'Uttara Ashadha', ruler: 'Sun' },
  { name: 'Shravana', ruler: 'Moon' },
  { name: 'Dhanishta', ruler: 'Mars' },
  { name: 'Shatabhisha', ruler: 'Rahu' },
  { name: 'Purva Bhadrapada', ruler: 'Jupiter' },
  { name: 'Uttara Bhadrapada', ruler: 'Saturn' },
  { name: 'Revati', ruler: 'Mercury' },
] as const;

/**
 * The nakshatra a sidereal longitude falls in.
 *
 * `fraction` is carried through because the Vimshottari Dasha at birth is not a
 * full period: a person born a third of the way through Rohini begins life two
 * thirds of the way through a Moon major period.
 */
export function nakshatraOf(siderealLongitude: number): NakshatraInfo {
  const longitude = normalizeDegrees(siderealLongitude);

  const zeroBased = Math.floor(longitude / NAKSHATRA_SPAN);
  const degreesInto = longitude - zeroBased * NAKSHATRA_SPAN;
  const entry = NAKSHATRAS[zeroBased] as { name: string; ruler: string };

  return {
    index: zeroBased + 1,
    name: entry.name,
    ruler: entry.ruler,
    pada: Math.floor(degreesInto / PADA_SPAN) + 1,
    degreesInto,
    fraction: degreesInto / NAKSHATRA_SPAN,
  };
}

/** The twelve sidereal signs, used for rashi placement. */
export const RASHIS: readonly string[] = [
  'Mesha',
  'Vrishabha',
  'Mithuna',
  'Karka',
  'Simha',
  'Kanya',
  'Tula',
  'Vrischika',
  'Dhanu',
  'Makara',
  'Kumbha',
  'Meena',
] as const;

export interface RashiInfo {
  /** 1-12. */
  index: number;
  name: string;
  /** Degrees into the sign, 0 to 30. */
  degreesInto: number;
}

/** The sidereal sign (rashi) a longitude falls in. */
export function rashiOf(siderealLongitude: number): RashiInfo {
  const longitude = normalizeDegrees(siderealLongitude);
  const zeroBased = Math.floor(longitude / 30);

  return {
    index: zeroBased + 1,
    name: RASHIS[zeroBased] as string,
    degreesInto: longitude - zeroBased * 30,
  };
}
