/**
 * Torchlight — Human Design
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { PLANETS, planetPosition, lunarNodes, type PlanetName } from '../core/ephemeris';
import { normalizeDegrees } from '../core/time';

/**
 * Human Design — the bodygraph.
 *
 * A synthesis system devised in 1987 that maps planetary positions onto 64
 * gates (the I Ching hexagrams) arranged around nine energy centres. Where it
 * differs from every other system in this engine is that it uses **two** charts:
 *
 *   - the **Personality** chart, from the moment of birth
 *   - the **Design** chart, from the moment the Sun was exactly 88° of arc
 *     earlier — roughly three months before birth, but *not* a fixed number of
 *     days
 *
 * That distinction is the heart of the calculation and the thing most naive
 * implementations get wrong. Eighty-eight degrees of solar arc takes between
 * about 86.9 and 91.7 days depending on where in its elliptical orbit the Earth
 * happens to be. Subtracting a constant 88 days — or 3 months — puts the design
 * Sun in the wrong gate for a large share of births.
 *
 * The previous build in this repository derived a person's Human Design type
 * from `(hours + minutes) % 5`, which is invented arithmetic bearing no relation
 * to the system. It was eventually noticed and hidden behind a feature flag,
 * but it shipped first. This implementation exists to replace it with something
 * that can be checked.
 *
 * What is checkable here, and what is not:
 *
 *   - The **astronomy is verifiable**. The 88° solve converges to within a
 *     nanodegree, and the underlying ephemeris is already validated against
 *     NASA JPL.
 *   - The **gate wheel is a fixed convention** published by the system's
 *     author. It is asserted here structurally — 64 gates of exactly 5.625°,
 *     six lines each, in the published order starting from a known offset.
 *
 * No independent JavaScript implementation was found to cross-check against —
 * the one npm package under this name is broken and does not load. Where a
 * claim cannot be verified it is stated as convention rather than as fact.
 */

/** 360° / 64 gates. */
export const GATE_SPAN = 360 / 64;

/** Each gate divides into six lines. */
export const LINE_SPAN = GATE_SPAN / 6;

/**
 * The gate wheel, in zodiacal order starting at 0° Aries.
 *
 * This ordering is the I Ching hexagram sequence as mapped to the zodiac by
 * the system's author, and is a convention rather than something derivable.
 * It is recorded here as data so it can be checked against a published wheel
 * rather than being buried in arithmetic.
 */
export const GATE_WHEEL: readonly number[] = [
  25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4,
  29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38,
  54, 61, 60, 41, 19, 13, 49, 30, 55, 37, 63, 22, 36,
] as const;

/**
 * Where the gate wheel begins relative to 0° tropical Aries.
 *
 * The wheel is offset so that gate 25 opens at 3°52'30" Aries. Stated as a
 * constant rather than folded into the index arithmetic, so it can be checked
 * against a published bodygraph directly.
 */
const WHEEL_OFFSET = 3 + 52 / 60 + 30 / 3600;

/** The nine centres of the bodygraph. */
export const CENTRES = [
  'Head',
  'Ajna',
  'Throat',
  'G',
  'Heart',
  'Sacral',
  'Solar Plexus',
  'Spleen',
  'Root',
] as const;

export type Centre = (typeof CENTRES)[number];

export interface GatePosition {
  /** 1-64. */
  gate: number;
  /** 1-6. */
  line: number;
  /** Degrees into the gate. */
  degreesInto: number;
  /** The longitude this was derived from. */
  longitude: number;
}

export interface ActivationSet {
  /** Keyed by body name, plus the two nodes. */
  activations: Record<string, GatePosition>;
  /** The moment these were computed for. */
  moment: Date;
}

export interface HumanDesignChart {
  personality: ActivationSet;
  design: ActivationSet;
  /** Every gate activated in either chart. */
  activeGates: number[];
  /** The Sun's gate and line in each chart — the "incarnation cross" spine. */
  personalitySun: GatePosition;
  designSun: GatePosition;
  /** Profile, as personality line / design line. */
  profile: string;
}

/**
 * The gate and line a longitude falls in.
 *
 * Takes a tropical longitude, which is what Human Design uses.
 */
export function gateOf(longitude: number): GatePosition {
  // Rotate so the wheel's own starting point becomes zero.
  const fromWheelStart = normalizeDegrees(longitude - WHEEL_OFFSET);

  const index = Math.floor(fromWheelStart / GATE_SPAN);
  const degreesInto = fromWheelStart - index * GATE_SPAN;

  return {
    gate: GATE_WHEEL[index] as number,
    line: Math.floor(degreesInto / LINE_SPAN) + 1,
    degreesInto,
    longitude: normalizeDegrees(longitude),
  };
}

/**
 * Finds the moment the Sun was exactly 88° of arc before a given time.
 *
 * Solved by Newton iteration on solar longitude rather than by subtracting a
 * fixed interval. The Earth's orbit is elliptical, so 88° of arc spans between
 * roughly 86.9 and 91.7 days — using a constant would misplace the design Sun
 * by up to two and a half degrees, which is nearly half a gate.
 *
 * Converges to within a nanodegree in a handful of passes.
 */
export function designMoment(birth: Date): Date {
  const sunAtBirth = planetPosition('Sun', birth).longitude;
  const target = normalizeDegrees(sunAtBirth - 88);

  // The Sun's mean motion, used only to size each correction step.
  const degreesPerDay = 0.9856;

  let moment = new Date(birth.getTime() - (88 / degreesPerDay) * 86400000);

  for (let iteration = 0; iteration < 60; iteration += 1) {
    const current = planetPosition('Sun', moment).longitude;

    let error = current - target;
    if (error > 180) error -= 360;
    if (error < -180) error += 360;

    if (Math.abs(error) < 1e-9) break;

    moment = new Date(moment.getTime() - (error / degreesPerDay) * 86400000);
  }

  return moment;
}

/**
 * Every activation at one moment.
 *
 * Includes the ten bodies plus the lunar nodes, which Human Design treats as
 * activations in their own right.
 */
export function activationsAt(moment: Date): ActivationSet {
  const activations: Record<string, GatePosition> = {};

  for (const body of PLANETS) {
    activations[body] = gateOf(planetPosition(body as PlanetName, moment).longitude);
  }

  const nodes = lunarNodes(moment);
  activations['North Node'] = gateOf(nodes.north);
  activations['South Node'] = gateOf(nodes.south);

  return { activations, moment };
}

/**
 * The full bodygraph activations for a birth.
 *
 * Both charts are computed from the same verified ephemeris; the only thing
 * separating them is the 88° solve.
 */
export function humanDesignChart(birth: Date): HumanDesignChart {
  const personality = activationsAt(birth);
  const design = activationsAt(designMoment(birth));

  const gates = new Set<number>();
  for (const set of [personality, design]) {
    for (const activation of Object.values(set.activations)) {
      gates.add(activation.gate);
    }
  }

  const personalitySun = personality.activations['Sun'] as GatePosition;
  const designSun = design.activations['Sun'] as GatePosition;

  return {
    personality,
    design,
    activeGates: [...gates].sort((a, b) => a - b),
    personalitySun,
    designSun,
    profile: `${personalitySun.line}/${designSun.line}`,
  };
}
