/**
 * Torchlight — astrological system definitions
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { z } from 'zod';

/**
 * The traditions Torchlight can read a chart through.
 *
 * `humanDesign` is deliberately absent. The previous build derived its type
 * from `(hours + minutes) % 5`, which is invented arithmetic, not Human Design.
 * It is not listed here until a verified implementation exists — an enum member
 * is a promise that the calculation is real.
 */
export const astrologySystemSchema = z.enum(['western', 'vedic', 'chinese', 'numerology']);

export type AstrologySystem = z.infer<typeof astrologySystemSchema>;

/** Systems available in v1. Kept separate so scope can widen without a schema change. */
export const V1_SYSTEMS: readonly AstrologySystem[] = ['western', 'vedic', 'numerology'] as const;

/**
 * How a given system's output was produced. Surfaced in the UI so a reading
 * never implies more precision than it has — the old build claimed
 * "Swiss Ephemeris precision" over hardcoded values, and that must not recur.
 */
export const calculationSourceSchema = z.enum([
  /** Computed locally from ephemeris math. */
  'computed',
  /** Returned by an external astronomical API. */
  'external-api',
  /** Derived from a traditional lookup table (e.g. nakshatra rulerships). */
  'traditional-table',
]);

export type CalculationSource = z.infer<typeof calculationSourceSchema>;

/** Provenance attached to every calculated result. */
export const provenanceSchema = z.object({
  source: calculationSourceSchema,
  /** e.g. "VSOP87", "Lahiri ayanamsa", "Pythagorean". */
  method: z.string(),
  /** Stated accuracy where meaningful, e.g. "±1 arcminute". */
  accuracy: z.string().optional(),
  /**
   * True only when houses/ascendant were computable — i.e. birth time known.
   * The UI uses this to explain what is missing rather than showing a gap.
   */
  hasBirthTime: z.boolean(),
});

export type Provenance = z.infer<typeof provenanceSchema>;
