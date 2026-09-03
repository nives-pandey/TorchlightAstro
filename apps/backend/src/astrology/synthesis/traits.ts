/**
 * Torchlight — the common trait vocabulary
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * The vocabulary every system is translated into before anything is compared.
 *
 * This is the foundation of the whole product. Ten traditions describe a person
 * in ten incompatible languages — a Vedic chart speaks of grahas and bhavas, a
 * BaZi chart of stems and phases, numerology of reduced digits — and none of
 * them can be compared to another until all of them are expressed in the same
 * terms.
 *
 * The honest problem, stated up front: **there is no external authority for
 * these mappings.** No tradition ever agreed to a shared vocabulary, because
 * none of them was built to be compared. Anyone claiming a canonical
 * cross-system correspondence is inventing one.
 *
 * So this file makes a narrower and defensible claim. It defines a small set of
 * dimensions that every tradition *does* independently speak to, maps each
 * system's own output onto them, and — critically — records the confidence of
 * each mapping and never presents a synthesis as though it were a reading from
 * any single tradition. Where two systems agree, that agreement is real and
 * worth stating. Where they disagree, the disagreement is reported rather than
 * averaged away.
 *
 * What is verifiable here:
 *
 *   - every mapping is total: no system input produces an undefined trait
 *   - the scales are bounded and consistently oriented
 *   - a system's contribution is traceable back to the placement that produced
 *     it, so a reading can always show its working
 *   - agreement and disagreement are computed symmetrically, so the order
 *     systems are supplied in cannot change the result
 */

/**
 * The dimensions along which traditions can be compared.
 *
 * Chosen because each is something *every* included tradition speaks to
 * independently, rather than because they carve the person up neatly. A
 * dimension only earns a place here if at least three systems address it
 * without being stretched.
 */
export const TRAIT_DIMENSIONS = [
  /** Outward drive versus inward reflection. */
  'expression',
  /** Steadiness versus appetite for change. */
  'stability',
  /** Reasoning versus feeling as the trusted guide. */
  'orientation',
  /** Working alone versus through others. */
  'relation',
  /** Structure versus improvisation. */
  'structure',
] as const;

export type TraitDimension = (typeof TRAIT_DIMENSIONS)[number];

/**
 * What each pole of a dimension means.
 *
 * Held as data so a reading can name the poles in the user's own words rather
 * than exposing an internal number.
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

/** How much weight a mapping deserves. */
export const CONFIDENCE_LEVELS = ['strong', 'moderate', 'indicative'] as const;

export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

/**
 * Numeric weight per confidence level.
 *
 * Used when combining several systems' readings of one dimension. The gaps are
 * deliberately wide: a strong mapping should dominate two indicative ones
 * rather than being outvoted by them.
 */
export const CONFIDENCE_WEIGHT: Readonly<Record<Confidence, number>> = {
  strong: 1,
  moderate: 0.6,
  indicative: 0.3,
};

/**
 * One system's reading of one dimension.
 *
 * `source` names the exact placement this came from, so a reading can always
 * show its working rather than asserting a conclusion.
 */
export interface TraitReading {
  system: string;
  dimension: TraitDimension;
  /** −1 to +1, where the sign points toward the dimension's named poles. */
  value: number;
  confidence: Confidence;
  /** The placement this was derived from, e.g. "Sun in Leo" or "Day Master: Yang Fire". */
  source: string;
}

/** Clamps a value into the −1 to +1 range every reading must occupy. */
export function clampTraitValue(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(-1, Math.min(1, value));
}

/**
 * Builds a reading, clamping the value so no mapping can emit out of range.
 *
 * Every mapping goes through here rather than constructing the object directly,
 * so the range invariant holds by construction instead of by convention.
 */
export function reading(
  system: string,
  dimension: TraitDimension,
  value: number,
  confidence: Confidence,
  source: string,
): TraitReading {
  return {
    system,
    dimension,
    value: clampTraitValue(value),
    confidence,
    source,
  };
}

/** Names the pole a value leans toward, or null when it sits near the middle. */
export function poleFor(dimension: TraitDimension, value: number): string | null {
  // A tenth either side of centre is treated as genuinely balanced rather than
  // as a weak lean, so a reading does not overstate a near-zero result.
  if (Math.abs(value) < 0.1) return null;
  return value > 0 ? DIMENSION_POLES[dimension].high : DIMENSION_POLES[dimension].low;
}
