/**
 * Torchlight — cross-system synthesis
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  CONFIDENCE_WEIGHT,
  DIMENSION_POLES,
  TRAIT_DIMENSIONS,
  poleFor,
  type TraitDimension,
  type TraitReading,
} from './traits';

/**
 * Where the traditions agree, and where they do not.
 *
 * This is the product. Every other module in the engine computes what a single
 * tradition says; this one is the only place that compares them, and the
 * comparison is the thing no single-tradition app can offer.
 *
 * The design principle throughout is that **disagreement is information, not
 * error**. Averaging five systems into one number would destroy exactly what
 * makes the reading interesting: that a person can be steady by one measure and
 * restless by another, and that the tension between those is often the truest
 * thing that can be said about them.
 *
 * So a consensus is computed, but the spread is carried alongside it and never
 * discarded. A dimension where every system agrees and one where they are
 * evenly split can produce the same average, and the two must never be
 * presented the same way.
 */

/** How strongly the systems agree on a dimension. */
export const AGREEMENT_LEVELS = ['converged', 'aligned', 'mixed', 'divided'] as const;

export type AgreementLevel = (typeof AGREEMENT_LEVELS)[number];

export interface DimensionSynthesis {
  dimension: TraitDimension;
  /** Weighted consensus, −1 to +1. */
  consensus: number;
  /** The pole this leans toward, or null when genuinely balanced. */
  pole: string | null;
  agreement: AgreementLevel;
  /** Standard deviation of the contributing values. Higher means more spread. */
  spread: number;
  /** Every system's reading, so a reading can always show its working. */
  readings: TraitReading[];
  /** Systems on each side, when the dimension is contested. */
  supporting: string[];
  opposing: string[];
}

export interface Tension {
  dimension: TraitDimension;
  /** The systems pulling one way, and what they say. */
  oneSide: { systems: string[]; pole: string };
  otherSide: { systems: string[]; pole: string };
  /** How sharp the disagreement is, 0 to 1. */
  intensity: number;
}

export interface Synthesis {
  dimensions: DimensionSynthesis[];
  /** Dimensions where the traditions genuinely conflict, sharpest first. */
  tensions: Tension[];
  /** Dimensions where every contributing system points the same way. */
  agreements: DimensionSynthesis[];
  /** Which systems contributed at all. */
  systems: string[];
}

/**
 * Weighted mean of a set of readings.
 *
 * Weighting by confidence is what stops an indicative mapping from carrying the
 * same force as a tradition's central classification.
 */
function weightedConsensus(readings: readonly TraitReading[]): number {
  if (readings.length === 0) return 0;

  // Summed in a fixed order, not the order the readings arrived in.
  //
  // Floating-point addition is not associative, so the same set of readings
  // summed in two different orders can differ in the last bits — measured at
  // 0.03333333333333335 against 0.033333333333333326 for one real chart. That
  // is invisible in a displayed number but not harmless: a value sitting on an
  // agreement threshold could classify differently depending on which system
  // happened to be computed first, so the same person would get two different
  // readings. Sorting first makes the result a function of the readings alone.
  const ordered = [...readings].sort((a, b) =>
    a.system === b.system ? a.value - b.value : a.system.localeCompare(b.system),
  );

  let weightedSum = 0;
  let totalWeight = 0;

  for (const item of ordered) {
    const weight = CONFIDENCE_WEIGHT[item.confidence];
    weightedSum += item.value * weight;
    totalWeight += weight;
  }

  return totalWeight === 0 ? 0 : weightedSum / totalWeight;
}

/**
 * Spread of the contributing values, as a population standard deviation.
 *
 * Deliberately unweighted. The question here is how far apart the traditions
 * are, and weighting would let a single confident system make a real
 * disagreement look like consensus.
 */
function spreadOf(readings: readonly TraitReading[]): number {
  if (readings.length < 2) return 0;

  // Sorted for the same reason as the consensus: summation order must not
  // reach the result. Ascending by value is enough here, since the spread does
  // not depend on which system a value came from.
  const values = readings.map((item) => item.value).sort((a, b) => a - b);

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;

  return Math.sqrt(variance);
}

/**
 * Classifies how much the systems agree.
 *
 * Thresholds are on the spread rather than the consensus, because that is the
 * quantity that actually answers the question. A dimension can have a consensus
 * near zero either because every system says "balanced" or because half say one
 * thing and half the opposite — cases that must not be described identically.
 */
function agreementFor(readings: readonly TraitReading[], spread: number): AgreementLevel {
  if (readings.length < 2) return 'mixed';

  // Do the systems even point the same direction? Values within a tenth of
  // zero are treated as neutral and abstain rather than counting as a side.
  const positive = readings.filter((r) => r.value > 0.1).length;
  const negative = readings.filter((r) => r.value < -0.1).length;
  const contested = positive > 0 && negative > 0;

  if (!contested && spread < 0.25) return 'converged';
  if (!contested) return 'aligned';
  if (spread < 0.55) return 'mixed';
  return 'divided';
}

/**
 * Synthesises a set of readings across every dimension.
 *
 * Order-independent by construction: readings are grouped by dimension and
 * combined by weighted mean, neither of which depends on the sequence they
 * arrive in. The tests assert this, because an order-dependent synthesis would
 * give different answers for the same person depending on which system happened
 * to be computed first.
 */
export function synthesise(readings: readonly TraitReading[]): Synthesis {
  const dimensions: DimensionSynthesis[] = [];

  for (const dimension of TRAIT_DIMENSIONS) {
    const forDimension = readings.filter((item) => item.dimension === dimension);
    if (forDimension.length === 0) continue;

    const consensus = weightedConsensus(forDimension);
    const spread = spreadOf(forDimension);

    dimensions.push({
      dimension,
      consensus,
      pole: poleFor(dimension, consensus),
      agreement: agreementFor(forDimension, spread),
      spread,
      readings: [...forDimension].sort((a, b) => a.system.localeCompare(b.system)),
      supporting: forDimension
        .filter((r) => r.value > 0.1)
        .map((r) => r.system)
        .sort(),
      opposing: forDimension
        .filter((r) => r.value < -0.1)
        .map((r) => r.system)
        .sort(),
    });
  }

  const tensions: Tension[] = dimensions
    .filter((entry) => entry.supporting.length > 0 && entry.opposing.length > 0)
    .map((entry) => ({
      dimension: entry.dimension,
      oneSide: { systems: entry.supporting, pole: DIMENSION_POLES[entry.dimension].high },
      otherSide: { systems: entry.opposing, pole: DIMENSION_POLES[entry.dimension].low },
      // Spread is bounded at 1 for values in [−1, 1], so this needs no scaling.
      intensity: Math.min(1, entry.spread),
    }))
    .sort((a, b) => b.intensity - a.intensity);

  const agreements = dimensions
    .filter((entry) => entry.agreement === 'converged' || entry.agreement === 'aligned')
    .sort((a, b) => Math.abs(b.consensus) - Math.abs(a.consensus));

  const systems = [...new Set(readings.map((item) => item.system))].sort();

  return { dimensions, tensions, agreements, systems };
}

/**
 * A plain-language description of one dimension's result.
 *
 * Deliberately conservative: it states what was found and by which systems, and
 * says nothing the readings do not support. Interpretive prose belongs
 * elsewhere — this is the factual substrate that any such prose must not
 * contradict.
 */
export function describeDimension(entry: DimensionSynthesis): string {
  const poles = DIMENSION_POLES[entry.dimension];

  if (entry.agreement === 'divided' || entry.agreement === 'mixed') {
    return (
      `${entry.supporting.join(' and ')} read you as ${poles.high.toLowerCase()}, ` +
      `while ${entry.opposing.join(' and ')} read you as ${poles.low.toLowerCase()}.`
    );
  }

  if (entry.pole === null) {
    return `The traditions place you near the middle between ${poles.low.toLowerCase()} and ${poles.high.toLowerCase()}.`;
  }

  const systems = entry.readings.map((r) => r.system);
  const verb = entry.agreement === 'converged' ? 'all agree' : 'agree';

  return `${systems.join(', ')} ${verb} that you lean ${entry.pole.toLowerCase()}.`;
}
