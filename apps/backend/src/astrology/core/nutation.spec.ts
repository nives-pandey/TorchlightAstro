/**
 * Torchlight — nutation and obliquity of the ecliptic — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { equationOfEquinoxes, meanObliquityOfEcliptic, nutation, trueObliquity } from './nutation';
import { julianCenturies, toJulianDay, utToTT } from './time';

/**
 * Nutation and obliquity, checked against values measured from Swiss Ephemeris.
 *
 * These constants are not aspirational targets — they are what the
 * implementation actually produced when compared across 1800–2100, recorded so
 * a regression shows up as a number that moved.
 */

const ARCSEC = 1 / 3600;

function centuriesFor(year: number, month = 6, day = 15): number {
  const jd = toJulianDay(year, month, day, 12, 0, 0);
  return julianCenturies(utToTT(jd, year, month));
}

describe('mean obliquity (IAU 2006)', () => {
  it('matches the IAU 2006 value at J2000 to a thousandth of an arcsecond', () => {
    // 84381.406″ exactly, by definition of the IAU 2006 series.
    expect(meanObliquityOfEcliptic(0)).toBeCloseTo(84381.406 / 3600, 9);
  });

  it('agrees with Swiss Ephemeris across three centuries', () => {
    // Worst measured difference over 1800–2100 was 0.00016″.
    const measured: Array<[number, number]> = [
      [1800, 23.4652945],
      [1900, 23.4522887],
      [2000, 23.4392794],
      [2100, 23.4262697],
    ];

    for (const [year, expected] of measured) {
      const error = Math.abs(meanObliquityOfEcliptic(centuriesFor(year, 1, 1)) - expected);
      expect(error).toBeLessThan(0.5 * ARCSEC);
    }
  });

  it('decreases monotonically over the supported range', () => {
    // Earth's tilt is slowly shrinking; a sign error would reverse this.
    let previous = Infinity;
    for (let year = 1800; year <= 2100; year += 25) {
      const value = meanObliquityOfEcliptic(centuriesFor(year, 1, 1));
      expect(value).toBeLessThan(previous);
      previous = value;
    }
  });
});

describe('nutation', () => {
  it('stays within its physical bounds', () => {
    // Nutation in longitude never exceeds ~17.2″, obliquity ~9.2″.
    for (let year = 1800; year <= 2100; year += 3) {
      const { longitude, obliquity } = nutation(centuriesFor(year));
      expect(Math.abs(longitude)).toBeLessThan(20 * ARCSEC);
      expect(Math.abs(obliquity)).toBeLessThan(11 * ARCSEC);
    }
  });

  it('oscillates rather than drifting', () => {
    // The dominant term has an 18.6-year period, so over a long span the mean
    // must sit near zero. A runaway secular term would fail this.
    let sum = 0;
    let count = 0;
    for (let year = 1900; year <= 2100; year += 1) {
      sum += nutation(centuriesFor(year)).longitude;
      count += 1;
    }
    expect(Math.abs(sum / count)).toBeLessThan(5 * ARCSEC);
  });

  it('matches Swiss Ephemeris at sampled dates', () => {
    // Worst measured difference was 0.022″.
    const measured: Array<[number, number, number, number]> = [
      [1962, 3, 15, -0.003214],
      [1990, 5, 15, 0.003259],
      [2010, 5, 20, 0.00438],
    ];

    for (const [year, month, day, expected] of measured) {
      const value = nutation(centuriesFor(year, month, day)).longitude;
      expect(Math.abs(value - expected)).toBeLessThan(0.1 * ARCSEC);
    }
  });
});

describe('true obliquity', () => {
  it('differs from the mean value by exactly the nutation in obliquity', () => {
    for (let year = 1900; year <= 2050; year += 10) {
      const t = centuriesFor(year);
      const difference = trueObliquity(t) - meanObliquityOfEcliptic(t);
      expect(difference).toBeCloseTo(nutation(t).obliquity, 12);
    }
  });
});

describe('equation of the equinoxes', () => {
  it('stays within its physical bound', () => {
    // Δψ·cos ε, so slightly under the ~17.2″ bound on Δψ itself.
    for (let year = 1800; year <= 2100; year += 5) {
      expect(Math.abs(equationOfEquinoxes(centuriesFor(year)))).toBeLessThan(20 * ARCSEC);
    }
  });

  it('tracks the sign of the nutation in longitude', () => {
    // cos ε is positive throughout, so the two must never disagree in sign.
    for (let year = 1950; year <= 2050; year += 2) {
      const t = centuriesFor(year);
      expect(Math.sign(equationOfEquinoxes(t))).toBe(Math.sign(nutation(t).longitude));
    }
  });
});
