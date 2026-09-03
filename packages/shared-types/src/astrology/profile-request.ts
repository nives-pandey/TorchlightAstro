/**
 * Torchlight — birth profile contract
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { z } from 'zod';

import { birthDateSchema, birthTimeSchema, timezoneSchema } from './birth-profile';

/**
 * What the app sends to save a birth profile.
 *
 * Shares its field validators with the chart request, so a date the chart
 * endpoint accepts is a date this one accepts. Two definitions of "a valid
 * birth date" would eventually disagree.
 */
export const createProfileSchema = z.object({
  displayName: z.string().min(1).max(80).trim(),
  birthDate: birthDateSchema,
  /** Omit when unknown; the chart then suppresses everything needing a time. */
  birthTime: birthTimeSchema.optional(),
  /** Display name of the birth place, e.g. "Delhi, India". */
  placeName: z.string().min(1).max(200).trim(),
  countryCode: z.string().length(2).toUpperCase(),
  timezone: timezoneSchema,
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  /** Marks this as the user's own birth rather than a partner's or a friend's. */
  isSelf: z.boolean().optional(),
});

export type CreateProfileRequest = z.infer<typeof createProfileSchema>;

/** Query options when fetching a stored chart. */
export const chartOptionsSchema = z.object({
  houseSystem: z.enum(['placidus', 'whole-sign']).optional(),
});

export type ChartOptions = z.infer<typeof chartOptionsSchema>;
