/**
 * Torchlight — tradition labels
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * How each tradition is named and abbreviated.
 *
 * The engine identifies systems by internal keys — `humanDesign`, `chinese` —
 * which are fine in JSON and wrong in a sentence. The initial is what the
 * dimension chips use, where five names would not fit.
 */
export const TRADITIONS: Readonly<
  Record<string, { name: string; initial: string; note: string }>
> = {
  western: { name: 'Western', initial: 'W', note: 'Tropical zodiac, Placidus houses' },
  vedic: { name: 'Vedic', initial: 'V', note: 'Indian sidereal astrology' },
  chinese: { name: 'Chinese', initial: 'C', note: 'Four pillars, BaZi' },
  numerology: { name: 'Numerology', initial: 'N', note: 'Pythagorean reduction' },
  humanDesign: { name: 'Human Design', initial: 'H', note: 'Gates and profile' },
  tarot: { name: 'Tarot', initial: 'T', note: 'Major Arcana birth cards' },
};

/** The display name for a system key, falling back to the key itself. */
export function traditionName(key: string): string {
  return TRADITIONS[key]?.name ?? key;
}

/** The single-letter chip for a system key. */
export function traditionInitial(key: string): string {
  return TRADITIONS[key]?.initial ?? key.charAt(0).toUpperCase();
}

/** Joins tradition names readably: "Western, Vedic and Chinese". */
export function joinTraditions(keys: readonly string[]): string {
  const names = keys.map(traditionName);
  if (names.length === 0) return '';
  if (names.length === 1) return names[0] as string;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1] as string}`;
}
