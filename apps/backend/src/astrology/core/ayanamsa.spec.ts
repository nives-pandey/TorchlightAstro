/**
 * Torchlight — tropical to sidereal conversion — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { AYANAMSA_SYSTEMS, ayanamsa, siderealToTropical, tropicalToSidereal } from './ayanamsa';
import { julianCenturies, toJulianDay, utToTT } from './time';

/**
 * The ayanamsa is the largest single number in the Vedic pipeline — about 24°,
 * most of a zodiac sign. Every constant below was solved against Swiss
 * Ephemeris rather than taken from a textbook, after three of four remembered
 * textbook values turned out to be wrong (Krishnamurti's by 43 arcseconds).
 */

const ARCSEC = 1 / 3600;

function centuriesFor(year: number, month = 6, day = 15): number {
  const jd = toJulianDay(year, month, day, 12, 0, 0);
  return julianCenturies(utToTT(jd, year, month));
}

describe('ayanamsa vs Swiss Ephemeris', () => {
  /**
   * Measured values, not aspirational ones. Worst observed disagreement across
   * 1800–2050 was 0.0009 arcseconds.
   */
  const measured: Array<[string, number, number]> = [
    ['lahiri', 1962, 23.32631927],
    ['lahiri', 2000, 23.85707323],
    ['lahiri', 2024, 24.19234403],
    ['fagan-bradley', 1962, 24.2095269],
    ['fagan-bradley', 2000, 24.74028087],
    ['fagan-bradley', 2024, 25.07555167],
    ['raman', 1962, 21.88001791],
    ['raman', 2000, 22.41077192],
    ['raman', 2024, 22.74604274],
    ['krishnamurti', 1962, 23.22946691],
    ['krishnamurti', 2000, 23.76022092],
    ['krishnamurti', 2024, 24.09549174],
  ];

  it.each(measured)('%s at %s matches to within an arcsecond', (system, year, expected) => {
    const jd = toJulianDay(year as number, 1, 1, 0, 0, 0);
    const t = julianCenturies(utToTT(jd, year as number, 1));
    const error = Math.abs(ayanamsa(t, system as 'lahiri') - (expected as number));
    expect(error).toBeLessThan(1 * ARCSEC);
  });
});

describe('ayanamsa behaviour', () => {
  it('increases monotonically — precession only runs one way', () => {
    let previous = -Infinity;
    for (let year = 1800; year <= 2100; year += 10) {
      const value = ayanamsa(centuriesFor(year));
      expect(value).toBeGreaterThan(previous);
      previous = value;
    }
  });

  it('advances at roughly the rate of general precession', () => {
    // ~50.3 arcseconds per year is the defining rate.
    const start = ayanamsa(centuriesFor(1950));
    const end = ayanamsa(centuriesFor(2050));
    const perYear = ((end - start) / 100) * 3600;
    expect(perYear).toBeGreaterThan(50.2);
    expect(perYear).toBeLessThan(50.4);
  });

  it('orders the systems as tradition does', () => {
    // Fagan-Bradley runs ahead of Lahiri, which runs ahead of Raman.
    const t = centuriesFor(2000);
    expect(ayanamsa(t, 'fagan-bradley')).toBeGreaterThan(ayanamsa(t, 'lahiri'));
    expect(ayanamsa(t, 'lahiri')).toBeGreaterThan(ayanamsa(t, 'raman'));
  });

  it('supports every declared system', () => {
    const t = centuriesFor(2000);
    for (const system of AYANAMSA_SYSTEMS) {
      const value = ayanamsa(t, system);
      expect(Number.isFinite(value)).toBe(true);
      // All modern ayanamsas sit in the low twenties of degrees.
      expect(value).toBeGreaterThan(20);
      expect(value).toBeLessThan(26);
    }
  });
});

describe('tropical and sidereal conversion', () => {
  const t = centuriesFor(2000);

  it('round-trips without loss', () => {
    for (const longitude of [0, 45, 123.456, 270, 359.99]) {
      const roundTripped = siderealToTropical(tropicalToSidereal(longitude, t), t);
      expect(roundTripped).toBeCloseTo(longitude, 10);
    }
  });

  it('subtracts rather than adds', () => {
    // An inverted sign here would be a ~48° error that still looks like a
    // plausible chart, so it is asserted directly.
    const tropical = 100;
    expect(tropicalToSidereal(tropical, t)).toBeLessThan(tropical);
  });

  it('wraps correctly below zero', () => {
    // 10° tropical is late Pisces sidereal, not a negative number.
    const result = tropicalToSidereal(10, t);
    expect(result).toBeGreaterThan(340);
    expect(result).toBeLessThan(360);
  });

  it('moves a longitude by roughly one sign', () => {
    // The practical consequence: many tropical Leos are sidereal Cancers.
    const tropicalSign = Math.floor(150 / 30);
    const siderealSign = Math.floor(tropicalToSidereal(150, t) / 30);
    expect(tropicalSign - siderealSign).toBe(1);
  });
});
