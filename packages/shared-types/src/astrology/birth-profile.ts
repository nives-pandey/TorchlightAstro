/**
 * Torchlight — birth data contract
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { z } from 'zod';

/**
 * Birth data is the single input the entire app derives from, so it is
 * validated once, here, and both the app and the API agree on what valid means.
 *
 * Two decisions worth stating outright:
 *
 * 1. Date and time are stored as plain strings alongside an IANA zone id,
 *    never as a JS Date or a UTC instant. A birth is a *local wall-clock*
 *    event: someone born at 06:15 in Kolkata was born at 06:15 there, and the
 *    UTC offset that applied on that date in that place is a lookup, not
 *    something to bake in at input time. Historical zones change; storing the
 *    instant would freeze whatever offset the device believed at entry.
 *
 * 2. Birth time is optional. A large share of people do not know theirs, and
 *    an app that hard-requires it either loses them or teaches them to guess —
 *    and a guessed time silently produces a confidently wrong ascendant and
 *    houses. `birthTime: null` is a first-class state that suppresses the
 *    house-dependent parts of a reading and says so.
 */

/** `YYYY-MM-DD`, Gregorian. */
export const birthDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format')
  .refine((value) => {
    const [y, m, d] = value.split('-').map(Number) as [number, number, number];
    if (m < 1 || m > 12 || d < 1 || d > 31) return false;
    // Round-trip through UTC to reject impossible dates like 2001-02-30.
    const parsed = new Date(Date.UTC(y, m - 1, d));
    return (
      parsed.getUTCFullYear() === y && parsed.getUTCMonth() === m - 1 && parsed.getUTCDate() === d
    );
  }, 'Not a real calendar date')
  .refine((value) => {
    const year = Number(value.slice(0, 4));
    // VSOP87 is accurate roughly 1000–3000 CE; well outside any real user's
    // birth year, but it stops absurd input from reaching the engine.
    return year >= 1800 && year <= 2200;
  }, 'Birth year must be between 1800 and 2200');

/** `HH:MM` on a 24-hour clock. */
export const birthTimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Birth time must be in 24-hour HH:MM format');

/** IANA zone id, e.g. `Asia/Kolkata`. Not an offset — see the note above. */
export const timezoneSchema = z
  .string()
  .min(3)
  .max(64)
  .regex(/^[A-Za-z]+\/[A-Za-z_\-+0-9/]+$|^UTC$/, 'Must be an IANA timezone id, e.g. Asia/Kolkata');

export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const birthPlaceSchema = z.object({
  /** Display name shown back to the user, e.g. "Kolkata, West Bengal". */
  name: z.string().min(1).max(200),
  /** ISO 3166-1 alpha-2. */
  countryCode: z.string().length(2).toUpperCase(),
  timezone: timezoneSchema,
  ...coordinatesSchema.shape,
});

/** What the client sends when creating or updating a birth profile. */
export const birthProfileInputSchema = z.object({
  /** Used to personalise readings, and for numerology name calculations. */
  displayName: z.string().min(1).max(80).trim(),
  birthDate: birthDateSchema,
  /** `null` when unknown — houses and ascendant are then omitted. */
  birthTime: birthTimeSchema.nullable(),
  place: birthPlaceSchema,
  /** Marks the profile this user considers their own, vs. a partner's. */
  isSelf: z.boolean().default(false),
});

/** A stored birth profile as returned by the API. */
export const birthProfileSchema = birthProfileInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;
export type BirthPlace = z.infer<typeof birthPlaceSchema>;
export type BirthProfileInput = z.infer<typeof birthProfileInputSchema>;
export type BirthProfile = z.infer<typeof birthProfileSchema>;
