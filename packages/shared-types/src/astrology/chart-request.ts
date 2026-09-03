/**
 * Torchlight — chart request contract
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { z } from 'zod';

import {
  birthDateSchema,
  birthTimeSchema,
  coordinatesSchema,
  timezoneSchema,
} from './birth-profile';

/**
 * The contract for requesting a chart.
 *
 * Defined here rather than in the backend so the app and the API validate
 * against one definition. A rule that exists only server-side is a rule the app
 * will eventually violate.
 */
export const chartRequestSchema = z.object({
  /** Optional: only numerology needs it, and a chart without it is still valid. */
  name: z.string().min(1).max(80).trim().optional(),
  birthDate: birthDateSchema,
  /**
   * Omit when unknown. The engine then suppresses houses, the ascendant and the
   * Chinese hour pillar rather than substituting noon and presenting the result
   * as fact.
   */
  birthTime: birthTimeSchema.optional(),
  /** IANA zone id. The server resolves the historical offset from it. */
  timezone: timezoneSchema,
  ...coordinatesSchema.shape,
  houseSystem: z.enum(['placidus', 'whole-sign']).optional(),
});

export type ChartRequest = z.infer<typeof chartRequestSchema>;
