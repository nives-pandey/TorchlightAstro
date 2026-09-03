/**
 * Torchlight — gemstone correspondences
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * Gemstones, by the Vedic Navaratna scheme.
 *
 * This is a **derived layer**: it computes nothing astronomical of its own and
 * instead reads placements the engine has already verified, then maps them
 * through a correspondence table.
 *
 * That distinction matters for how correctness is claimed. The nine stones and
 * their planetary rulers are a fixed, documented scheme — the Navaratna, worn
 * as a single setting in Indian tradition — not something derivable from first
 * principles. What *is* checkable is that the mapping is complete and
 * one-to-one, that it covers exactly the nine grahas including Rahu and Ketu,
 * and that the recommendation logic reads real chart data rather than
 * inventing it.
 *
 * The previous build's gemstone file organised stones by Western sun sign and
 * by birth month — the modern jeweller's birthstone list, which has no
 * connection to the Vedic scheme and would have been misleading beside Vedic
 * placements. It is deliberately not carried over.
 */

/** The nine grahas of Vedic astrology, in the traditional Navaratna order. */
export const NAVARATNA_ORDER = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
  'Rahu',
  'Ketu',
] as const;

export type Graha = (typeof NAVARATNA_ORDER)[number];

export interface GemstoneEntry {
  graha: Graha;
  /** English name. */
  stone: string;
  /** Sanskrit name, as used in Indian gemmology. */
  sanskrit: string;
  /** The finger the stone is traditionally worn on. */
  finger: string;
  /** The metal the stone is traditionally set in. */
  metal: string;
  /** The weekday associated with the graha. */
  day: string;
}

/**
 * The Navaratna — nine stones, one per graha.
 *
 * A documented traditional scheme rather than a derivation. Recorded as data so
 * it can be checked against a published source directly, and so a different
 * school's substitutions could be supplied without touching any logic.
 */
export const NAVARATNA: Readonly<Record<Graha, GemstoneEntry>> = {
  Sun: {
    graha: 'Sun',
    stone: 'Ruby',
    sanskrit: 'Manikya',
    finger: 'Ring',
    metal: 'Gold',
    day: 'Sunday',
  },
  Moon: {
    graha: 'Moon',
    stone: 'Pearl',
    sanskrit: 'Moti',
    finger: 'Little',
    metal: 'Silver',
    day: 'Monday',
  },
  Mars: {
    graha: 'Mars',
    stone: 'Red Coral',
    sanskrit: 'Moonga',
    finger: 'Ring',
    metal: 'Copper',
    day: 'Tuesday',
  },
  Mercury: {
    graha: 'Mercury',
    stone: 'Emerald',
    sanskrit: 'Panna',
    finger: 'Little',
    metal: 'Gold',
    day: 'Wednesday',
  },
  Jupiter: {
    graha: 'Jupiter',
    stone: 'Yellow Sapphire',
    sanskrit: 'Pukhraj',
    finger: 'Index',
    metal: 'Gold',
    day: 'Thursday',
  },
  Venus: {
    graha: 'Venus',
    stone: 'Diamond',
    sanskrit: 'Heera',
    finger: 'Middle',
    metal: 'Silver',
    day: 'Friday',
  },
  Saturn: {
    graha: 'Saturn',
    stone: 'Blue Sapphire',
    sanskrit: 'Neelam',
    finger: 'Middle',
    metal: 'Iron',
    day: 'Saturday',
  },
  Rahu: {
    graha: 'Rahu',
    stone: 'Hessonite',
    sanskrit: 'Gomed',
    finger: 'Middle',
    metal: 'Silver',
    day: 'Saturday',
  },
  Ketu: {
    graha: 'Ketu',
    stone: "Cat's Eye",
    sanskrit: 'Lehsunia',
    finger: 'Middle',
    metal: 'Silver',
    day: 'Tuesday',
  },
};

/**
 * The graha ruling each sidereal sign, indexed 0 for Mesha.
 *
 * Rahu and Ketu rule no sign, which is why this list contains only seven of the
 * nine grahas and why several appear twice.
 */
const SIGN_RULERS: readonly Graha[] = [
  'Mars', // Mesha
  'Venus', // Vrishabha
  'Mercury', // Mithuna
  'Moon', // Karka
  'Sun', // Simha
  'Mercury', // Kanya
  'Venus', // Tula
  'Mars', // Vrischika
  'Jupiter', // Dhanu
  'Saturn', // Makara
  'Saturn', // Kumbha
  'Jupiter', // Meena
] as const;

/** The graha ruling a sidereal sign, taking a 1-12 index. */
export function rulerOfSign(signIndex: number): Graha {
  return SIGN_RULERS[signIndex - 1] as Graha;
}

export interface GemstoneRecommendation {
  /** Why this stone was selected. */
  basis: 'ascendant-ruler' | 'moon-sign-ruler' | 'current-dasha';
  gemstone: GemstoneEntry;
}

/**
 * Stones indicated by a chart.
 *
 * Three traditional bases, each reading verified data rather than guessing:
 *
 *   - the ruler of the ascendant sign, the *lagnesha*, which is the primary
 *     recommendation in most schools
 *   - the ruler of the Moon's sign, for emotional and mental support
 *   - the graha ruling the currently running mahadasha
 *
 * Returns one entry per basis. Duplicates are kept rather than collapsed,
 * because two bases agreeing on a stone is itself meaningful — a reading would
 * state it more strongly.
 */
export function recommendGemstones(input: {
  ascendantSignIndex: number;
  moonSignIndex: number;
  currentDashaLord?: string;
}): GemstoneRecommendation[] {
  const recommendations: GemstoneRecommendation[] = [
    {
      basis: 'ascendant-ruler',
      gemstone: NAVARATNA[rulerOfSign(input.ascendantSignIndex)],
    },
    {
      basis: 'moon-sign-ruler',
      gemstone: NAVARATNA[rulerOfSign(input.moonSignIndex)],
    },
  ];

  // The dasha lord is a graha name from the Vimshottari sequence, which uses
  // the same nine names. Guarded rather than assumed, so an unexpected value
  // omits the recommendation instead of producing a wrong one.
  if (input.currentDashaLord && input.currentDashaLord in NAVARATNA) {
    recommendations.push({
      basis: 'current-dasha',
      gemstone: NAVARATNA[input.currentDashaLord as Graha],
    });
  }

  return recommendations;
}

/**
 * The weekday a graha rules, used for timing when a stone is first worn.
 *
 * Kept as a lookup on the table rather than a separate list, so the two cannot
 * drift apart.
 */
export function dayForGraha(graha: Graha): string {
  return NAVARATNA[graha].day;
}
