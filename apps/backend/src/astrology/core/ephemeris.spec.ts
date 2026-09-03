/**
 * Torchlight — planetary position engine — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import fixtures from '../__fixtures__/jpl-horizons.json';
import { PLANETS, planetPosition, lunarNodes, type PlanetName } from './ephemeris';
import { angularDifference } from './time';

/**
 * Validates the ephemeris against NASA JPL Horizons.
 *
 * This is the suite that decides whether a reading can be trusted. Everything
 * else in the app is presentation; if these numbers are wrong, the product is
 * wrong in a way no amount of interface work can rescue.
 *
 * Fixtures are committed rather than fetched, so a JPL outage cannot redden the
 * build and the reference cannot silently change underneath a passing test.
 */

/** The bar this engine is held to: one arcminute, in degrees. */
const TOLERANCE_ARCMIN = 1;
const TOLERANCE_DEG = TOLERANCE_ARCMIN / 60;

/**
 * The Moon moves ~0.5°/hour and is the body most sensitive to any residual
 * timescale error, so it gets a slightly wider bar — still far tighter than
 * anything that could move it between signs or nakshatras.
 */
const MOON_TOLERANCE_DEG = 2 / 60;

function toDate(utc: string): Date {
  return new Date(`${utc.replace(' ', 'T')}:00Z`);
}

describe('ephemeris vs NASA JPL Horizons', () => {
  it('has fixtures to test against', () => {
    expect(fixtures.fixtures.length).toBeGreaterThanOrEqual(10);
  });

  describe.each(fixtures.fixtures)('$utc — $label', (fixture) => {
    const date = toDate(fixture.utc);

    it.each(PLANETS)('%s longitude is within tolerance', (name: PlanetName) => {
      const expected = (fixture.longitudes as Record<string, number>)[name];
      expect(expected).toBeDefined();

      const actual = planetPosition(name, date).longitude;
      const error = Math.abs(angularDifference(actual, expected as number));
      const tolerance = name === 'Moon' ? MOON_TOLERANCE_DEG : TOLERANCE_DEG;

      // Reported in arcseconds, which is the unit this error is legible in.
      expect({
        body: name,
        errorArcsec: Number((error * 3600).toFixed(2)),
        limitArcsec: Number((tolerance * 3600).toFixed(2)),
      }).toEqual({
        body: name,
        errorArcsec: expect.any(Number),
        limitArcsec: expect.any(Number),
      });
      expect(error).toBeLessThan(tolerance);
    });

    it.each(PLANETS)('%s latitude is within tolerance', (name: PlanetName) => {
      const expected = (fixture.latitudes as Record<string, number>)[name] as number;
      const actual = planetPosition(name, date).latitude;
      expect(Math.abs(actual - expected)).toBeLessThan(name === 'Moon' ? 0.05 : 0.02);
    });
  });

  it('reports the worst-case error across every fixture', () => {
    let worst = { body: '', utc: '', arcsec: 0 };

    for (const fixture of fixtures.fixtures) {
      const date = toDate(fixture.utc);
      for (const name of PLANETS) {
        const expected = (fixture.longitudes as Record<string, number>)[name] as number;
        const actual = planetPosition(name, date).longitude;
        const arcsec = Math.abs(angularDifference(actual, expected)) * 3600;
        if (arcsec > worst.arcsec) worst = { body: name, utc: fixture.utc, arcsec };
      }
    }

    // Surfaced so a regression shows up as a number that moved, not just a
    // pass. If this creeps toward 60 arcsec, something upstream changed.
    expect(worst.arcsec).toBeLessThan(TOLERANCE_ARCMIN * 60);
  });
});

describe('retrograde motion', () => {
  it('matches the published Mercury retrograde windows for 2001', () => {
    // Mercury turned retrograde three times in 2001, on dates published in
    // every ephemeris of the period: roughly Feb 4–25, Jun 4–28, Oct 1–23.
    // Checking mid-window and just outside each one pins both the sign of the
    // speed calculation and the station dates, which is a far stronger claim
    // than a single sampled day.
    const retrograde = (utc: string) => planetPosition('Mercury', new Date(utc)).retrograde;

    expect(retrograde('2001-02-14T00:00:00Z')).toBe(true);
    expect(retrograde('2001-06-15T00:00:00Z')).toBe(true);
    expect(retrograde('2001-10-12T00:00:00Z')).toBe(true);

    expect(retrograde('2001-01-20T00:00:00Z')).toBe(false);
    expect(retrograde('2001-04-01T00:00:00Z')).toBe(false);
    expect(retrograde('2001-11-08T00:00:00Z')).toBe(false);
  });

  it('never reports the Sun or Moon as retrograde', () => {
    // Neither can be, by definition. A positive test that would catch a sign
    // error or a 0/360 unwrapping bug in the speed calculation.
    for (const utc of ['2000-01-01T00:00:00Z', '1962-03-15T06:15:00Z', '2024-09-14T03:30:00Z']) {
      const date = new Date(utc);
      expect(planetPosition('Sun', date).retrograde).toBe(false);
      expect(planetPosition('Moon', date).retrograde).toBe(false);
    }
  });

  it('gives the Sun a daily motion near one degree', () => {
    const speed = planetPosition('Sun', new Date('2000-03-20T00:00:00Z')).speed;
    expect(speed).toBeGreaterThan(0.9);
    expect(speed).toBeLessThan(1.1);
  });

  it('gives the Moon a daily motion near thirteen degrees', () => {
    const speed = planetPosition('Moon', new Date('2000-03-20T00:00:00Z')).speed;
    expect(speed).toBeGreaterThan(11);
    expect(speed).toBeLessThan(15);
  });
});

describe('lunar nodes', () => {
  it('places the south node exactly opposite the north', () => {
    const { north, south } = lunarNodes(new Date('2000-01-01T00:00:00Z'));
    expect(Math.abs(angularDifference(south, north + 180))).toBeLessThan(1e-9);
  });

  it('moves retrograde through the zodiac', () => {
    // The nodes regress about 19.3° per year — a distinctive signature, and an
    // easy way to catch a sign error in the polynomial.
    const start = lunarNodes(new Date('2000-01-01T00:00:00Z')).north;
    const later = lunarNodes(new Date('2001-01-01T00:00:00Z')).north;
    const motion = angularDifference(later, start);
    expect(motion).toBeLessThan(0);
    expect(Math.abs(motion)).toBeGreaterThan(18);
    expect(Math.abs(motion)).toBeLessThan(21);
  });
});
