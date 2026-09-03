/**
 * Torchlight — bundled city fallback — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { isKnownTimezone } from '../astrology/timezone';
import { FALLBACK_CITIES } from './fallback-cities';

/**
 * The fallback exists so that an outage at a free third-party service cannot
 * block sign-up. That only holds if every entry is actually usable, and the
 * field that must be usable is the timezone — a wrong one moves the ascendant
 * by degrees, where a wrong coordinate moves it by arcminutes.
 */

describe('bundled cities', () => {
  it('has a substantial list', () => {
    expect(FALLBACK_CITIES.length).toBeGreaterThanOrEqual(300);
  });

  it('gives every city a timezone the runtime recognises', () => {
    // An unrecognised zone would throw at chart time, turning a degraded
    // fallback into a broken one.
    for (const city of FALLBACK_CITIES) {
      expect(isKnownTimezone(city.timezone)).toBe(true);
    }
  });

  it('gives every city valid coordinates', () => {
    for (const city of FALLBACK_CITIES) {
      expect(Math.abs(city.latitude)).toBeLessThanOrEqual(90);
      expect(Math.abs(city.longitude)).toBeLessThanOrEqual(180);
    }
  });

  it('names every city and its country', () => {
    for (const city of FALLBACK_CITIES) {
      expect(city.name.length).toBeGreaterThan(0);
      expect(city.countryCode).toHaveLength(2);
    }
  });

  it('spans many countries rather than concentrating in one', () => {
    const countries = new Set(FALLBACK_CITIES.map((city) => city.countryCode));
    expect(countries.size).toBeGreaterThanOrEqual(50);
  });

  it('orders by population, so a prefix search surfaces the likeliest match', () => {
    for (let i = 0; i < FALLBACK_CITIES.length - 1; i += 1) {
      expect((FALLBACK_CITIES[i] as { population: number }).population).toBeGreaterThanOrEqual(
        (FALLBACK_CITIES[i + 1] as { population: number }).population,
      );
    }
  });

  it('covers India, the largest expected audience', () => {
    const indian = FALLBACK_CITIES.filter((city) => city.countryCode === 'IN');
    expect(indian.length).toBeGreaterThanOrEqual(20);
    // Every Indian city shares one zone, so any of them yields a correct
    // offset for an Indian birth even if the exact town is missing.
    for (const city of indian) {
      expect(city.timezone).toBe('Asia/Kolkata');
    }
  });

  it('includes the cities a first user is most likely to type', () => {
    const names = new Set(FALLBACK_CITIES.map((city) => city.name));
    for (const expected of ['Mumbai', 'Delhi', 'London', 'New York City', 'Tokyo']) {
      // Names vary by source, so this checks the list is plausibly global
      // rather than asserting one exact spelling.
      const found = [...names].some((name) => name.includes(expected.split(' ')[0] as string));
      expect(found).toBe(true);
    }
  });
});
