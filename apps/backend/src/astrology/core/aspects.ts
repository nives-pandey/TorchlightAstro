/**
 * Torchlight — planetary aspects
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import type { PlanetPosition } from './ephemeris';
import { angularDifference, normalizeDegrees } from './time';

/**
 * Aspects — the angular relationships between planets.
 *
 * Two planets 90° apart are said to be in square, 120° apart in trine, and so
 * on. These angles carry most of the interpretive weight in Western astrology:
 * a chart is not a list of placements, it is a network of relationships between
 * them.
 *
 * Two things here are more subtle than they look:
 *
 *   **Orb.** An aspect is not an exact angle but a tolerance around one. The
 *   orb varies by aspect (a conjunction is allowed more latitude than a
 *   quincunx) and traditionally by body (the Sun and Moon are allowed more than
 *   Pluto). Both variations are implemented, because using a single flat orb
 *   produces aspects practitioners would not recognise.
 *
 *   **Applying versus separating.** An aspect tightening toward exact is read
 *   very differently from one loosening away, and the distinction depends on
 *   the planets' relative *speed*, not their positions. This is where a naive
 *   implementation usually goes wrong: it needs the sign of the rate of change
 *   of the separation, which retrograde motion can invert.
 */

export const ASPECT_TYPES = [
  'conjunction',
  'opposition',
  'trine',
  'square',
  'sextile',
  'quincunx',
  'semisextile',
  'semisquare',
  'sesquiquadrate',
  'quintile',
  'biquintile',
] as const;

export type AspectType = (typeof ASPECT_TYPES)[number];

interface AspectDefinition {
  angle: number;
  /** Base orb in degrees, before per-body adjustment. */
  orb: number;
  /**
   * Major aspects are the Ptolemaic five and carry the most interpretive
   * weight; minor aspects are read as secondary detail.
   */
  major: boolean;
}

/**
 * The aspects recognised, with traditional orbs.
 *
 * Orb values follow mainstream modern Western practice. They are deliberately
 * data rather than constants in code, so a different school's orbs can be
 * supplied without touching the geometry.
 */
export const ASPECT_DEFINITIONS: Readonly<Record<AspectType, AspectDefinition>> = {
  conjunction: { angle: 0, orb: 8, major: true },
  opposition: { angle: 180, orb: 8, major: true },
  trine: { angle: 120, orb: 8, major: true },
  square: { angle: 90, orb: 7, major: true },
  sextile: { angle: 60, orb: 6, major: true },
  quincunx: { angle: 150, orb: 3, major: false },
  semisextile: { angle: 30, orb: 2, major: false },
  semisquare: { angle: 45, orb: 2, major: false },
  sesquiquadrate: { angle: 135, orb: 2, major: false },
  quintile: { angle: 72, orb: 2, major: false },
  biquintile: { angle: 144, orb: 2, major: false },
};

/**
 * Extra orb allowed when a luminary is involved, in degrees.
 *
 * The Sun and Moon are traditionally granted wider orbs than the planets. This
 * is additive to the aspect's base orb and applied once, not twice, when both
 * bodies are luminaries.
 */
const LUMINARY_ORB_BONUS = 2;

const LUMINARIES = new Set(['Sun', 'Moon']);

export interface Aspect {
  from: string;
  to: string;
  type: AspectType;
  /** The exact angle this aspect is defined at. */
  exactAngle: number;
  /** The actual separation between the two bodies, 0-180. */
  separation: number;
  /** How far from exact, in degrees. Always positive. */
  orb: number;
  /** The orb allowed for this pairing, after any luminary bonus. */
  allowedOrb: number;
  /** True when the aspect is tightening toward exact. */
  applying: boolean;
  major: boolean;
  /**
   * 0 to 1, where 1 is exact and 0 is at the edge of orb. Useful for ranking
   * which aspects in a chart deserve emphasis.
   */
  strength: number;
}

/**
 * The angular separation between two longitudes, folded to 0-180.
 *
 * Aspects are undirected: 270° apart and 90° apart are the same square, so the
 * separation is always the shorter arc.
 */
export function separation(longitudeA: number, longitudeB: number): number {
  const raw = Math.abs(normalizeDegrees(longitudeA) - normalizeDegrees(longitudeB));
  return raw > 180 ? 360 - raw : raw;
}

/** The orb allowed for one aspect between two named bodies. */
export function allowedOrbFor(type: AspectType, bodyA: string, bodyB: string): number {
  const base = ASPECT_DEFINITIONS[type].orb;
  const involvesLuminary = LUMINARIES.has(bodyA) || LUMINARIES.has(bodyB);
  return involvesLuminary ? base + LUMINARY_ORB_BONUS : base;
}

/**
 * Determines whether an aspect is applying or separating.
 *
 * The test is the sign of the rate of change of the separation, not a
 * comparison of positions. Concretely: advance both bodies by their daily
 * motion and see whether the gap from exact shrinks.
 *
 * Doing this by comparing longitudes instead — "the faster planet is behind, so
 * it must be applying" — breaks whenever either body is retrograde, which is
 * roughly a fifth of the time for the outer planets.
 */
function isApplying(
  longitudeA: number,
  speedA: number,
  longitudeB: number,
  speedB: number,
  exactAngle: number,
): boolean {
  const currentOrb = Math.abs(separation(longitudeA, longitudeB) - exactAngle);

  // A small step forward; the size is immaterial provided it is small enough
  // not to cross the exact point.
  const step = 0.01;
  const futureOrb = Math.abs(
    separation(longitudeA + speedA * step, longitudeB + speedB * step) - exactAngle,
  );

  return futureOrb < currentOrb;
}

export interface AspectOptions {
  /** Include minor aspects. Off by default: they add noise to a first reading. */
  includeMinor?: boolean;
  /** Multiplier on every orb, for tighter or looser chart readings. */
  orbFactor?: number;
}

/**
 * Finds the aspect between two bodies, if any.
 *
 * Returns the *closest* matching aspect rather than the first found. Orbs
 * overlap — a 46° separation is within orb of both a semisextile at 30° (no)
 * and a semisquare at 45° (yes) — so scanning in definition order would make
 * the result depend on table ordering rather than on the geometry.
 */
export function aspectBetween(
  a: PlanetPosition,
  b: PlanetPosition,
  options: AspectOptions = {},
): Aspect | null {
  const { includeMinor = false, orbFactor = 1 } = options;

  const gap = separation(a.longitude, b.longitude);
  let best: Aspect | null = null;

  for (const type of ASPECT_TYPES) {
    const definition = ASPECT_DEFINITIONS[type];
    if (!definition.major && !includeMinor) continue;

    const allowedOrb = allowedOrbFor(type, a.name, b.name) * orbFactor;
    const orb = Math.abs(gap - definition.angle);
    if (orb > allowedOrb) continue;

    if (best === null || orb < best.orb) {
      best = {
        from: a.name,
        to: b.name,
        type,
        exactAngle: definition.angle,
        separation: gap,
        orb,
        allowedOrb,
        applying: isApplying(a.longitude, a.speed, b.longitude, b.speed, definition.angle),
        major: definition.major,
        strength: 1 - orb / allowedOrb,
      };
    }
  }

  return best;
}

/**
 * Every aspect in a set of positions.
 *
 * Each pair is considered once — aspects are symmetric, so returning both
 * Sun-Moon and Moon-Sun would double every count downstream.
 *
 * Results are sorted by strength so the tightest, most significant aspects come
 * first; a chart typically has a dozen or more, and the reading should lead
 * with the ones that matter.
 */
export function findAspects(
  positions: readonly PlanetPosition[],
  options: AspectOptions = {},
): Aspect[] {
  const aspects: Aspect[] = [];

  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const found = aspectBetween(
        positions[i] as PlanetPosition,
        positions[j] as PlanetPosition,
        options,
      );
      if (found) aspects.push(found);
    }
  }

  return aspects.sort((x, y) => y.strength - x.strength);
}

/**
 * Aspects from a single body to every other.
 *
 * Used for "what does Saturn touch in this chart" style questions, which is how
 * a reading is usually assembled.
 */
export function aspectsTo(
  body: PlanetPosition,
  others: readonly PlanetPosition[],
  options: AspectOptions = {},
): Aspect[] {
  return others
    .filter((other) => other.name !== body.name)
    .map((other) => aspectBetween(body, other, options))
    .filter((aspect): aspect is Aspect => aspect !== null)
    .sort((x, y) => y.strength - x.strength);
}

/**
 * Angular distance from a body to a fixed point such as the ascendant.
 *
 * Angles have no speed of their own, so applying/separating is judged from the
 * body's motion alone — the chart's angles are fixed for a natal reading.
 */
export function aspectToPoint(
  body: PlanetPosition,
  pointLongitude: number,
  pointName: string,
  options: AspectOptions = {},
): Aspect | null {
  return aspectBetween(
    body,
    {
      name: pointName as PlanetPosition['name'],
      longitude: pointLongitude,
      latitude: 0,
      distance: 0,
      speed: 0,
      retrograde: false,
    },
    options,
  );
}

/**
 * Signed difference used when ordering aspects around the wheel.
 *
 * Re-exported so callers building chart graphics do not reach into the time
 * module for what is really an aspect-geometry concern.
 */
export { angularDifference };
