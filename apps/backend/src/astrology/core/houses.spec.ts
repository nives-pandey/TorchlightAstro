/**
 * Torchlight — house systems, ascendant and midheaven — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import fixtures from '../__fixtures__/swiss-houses.json';
import { computeHouses, houseOf, ascendant, midheaven, localSiderealTime } from './houses';
import { trueObliquity } from './nutation';
import { angularDifference, julianCenturies, toJulianDay, utToTT } from './time';

/**
 * Validates houses and angles against Swiss Ephemeris.
 *
 * Three separate sign errors in this module each passed a single Greenwich
 * test before this suite existed:
 *
 *   - the midheaven used `atan2(tan(LST), cos ε)`, which discards the quadrant
 *     because `tan` has period 180°. Correct at Greenwich, exactly 180° wrong
 *     for Delhi, Sydney and New York.
 *   - the ascendant sign convention agreed with its own inverse at Greenwich.
 *   - Placidus derived declination from right ascension instead of ecliptic
 *     longitude, which is right at the equinoxes and 2.9° out at latitude 64°.
 *
 * Hence the breadth: both hemispheres, both sides of the prime meridian, every
 * LST quadrant, and latitudes from the equator to the Placidus limit.
 */

/** One arcsecond, in degrees. */
const ARCSEC = 1 / 3600;

/**
 * Two arcseconds. The measured worst case across 980 modern cases is 0.5″;
 * this leaves headroom for ΔT model differences in older dates without being
 * loose enough to hide a real regression.
 */
const TOLERANCE = 2 * ARCSEC;

function partsOf(utc: string): { y: number; m: number; d: number; h: number; min: number } {
  const [date, time] = utc.split(' ');
  const [y, m, d] = (date as string).split('-').map(Number);
  const [h, min] = (time as string).split(':').map(Number);
  return { y: y as number, m: m as number, d: d as number, h: h as number, min: min as number };
}

describe('houses vs Swiss Ephemeris', () => {
  describe.each(fixtures.fixtures)('$label — $system', (fixture) => {
    const { y, m, d, h, min } = partsOf(fixture.utc);
    const jd = toJulianDay(y, m, d, h, min, 0);
    const t = julianCenturies(utToTT(jd, y, m));

    const computed = computeHouses(
      jd,
      t,
      fixture.latitude,
      fixture.longitude,
      fixture.system as 'placidus' | 'whole-sign',
    );

    it('matches the ascendant', () => {
      expect(Math.abs(angularDifference(computed.ascendant, fixture.ascendant))).toBeLessThan(
        TOLERANCE,
      );
    });

    it('matches the midheaven', () => {
      expect(Math.abs(angularDifference(computed.midheaven, fixture.midheaven))).toBeLessThan(
        TOLERANCE,
      );
    });

    it('matches all twelve cusps', () => {
      for (let i = 0; i < 12; i += 1) {
        const error = Math.abs(
          angularDifference(computed.cusps[i] as number, fixture.cusps[i] as number),
        );
        // Name the house in the failure so a regression points at the culprit.
        expect({ house: i + 1, withinTolerance: error < TOLERANCE }).toEqual({
          house: i + 1,
          withinTolerance: true,
        });
      }
    });
  });
});

describe('house structure invariants', () => {
  const jd = toJulianDay(1985, 7, 22, 8, 50, 0);
  const t = julianCenturies(utToTT(jd, 1985, 7));
  const houses = computeHouses(jd, t, 28.6139, 77.209, 'placidus');

  it('returns exactly twelve cusps', () => {
    expect(houses.cusps).toHaveLength(12);
  });

  it('starts house 1 at the ascendant and house 10 at the midheaven', () => {
    expect(Math.abs(angularDifference(houses.cusps[0] as number, houses.ascendant))).toBeLessThan(
      1e-9,
    );
    expect(Math.abs(angularDifference(houses.cusps[9] as number, houses.midheaven))).toBeLessThan(
      1e-9,
    );
  });

  it('places opposite cusps exactly 180 degrees apart', () => {
    for (let i = 0; i < 6; i += 1) {
      const opposite = angularDifference(
        houses.cusps[i + 6] as number,
        (houses.cusps[i] as number) + 180,
      );
      expect(Math.abs(opposite)).toBeLessThan(1e-9);
    }
  });

  it('produces twelve distinct cusps', () => {
    // An earlier indexing bug made houses 2 and 3 identical to 5 and 6.
    const rounded = new Set(houses.cusps.map((c) => c.toFixed(4)));
    expect(rounded.size).toBe(12);
  });

  it('advances cusps in order around the zodiac', () => {
    for (let i = 0; i < 11; i += 1) {
      const step = angularDifference(houses.cusps[i + 1] as number, houses.cusps[i] as number);
      expect(step).toBeGreaterThan(0);
      expect(step).toBeLessThan(180);
    }
  });
});

describe('polar latitudes', () => {
  const jd = toJulianDay(1990, 5, 15, 12, 0, 0);
  const t = julianCenturies(utToTT(jd, 1990, 5));

  it('falls back to whole sign beyond the Placidus limit and says so', () => {
    const houses = computeHouses(jd, t, 78.2232, 15.6469, 'placidus');
    expect(houses.system).toBe('whole-sign');
    expect(houses.fellBackToWholeSign).toBe(true);
  });

  it('does not claim a fallback when whole sign was requested outright', () => {
    const houses = computeHouses(jd, t, 78.2232, 15.6469, 'whole-sign');
    expect(houses.fellBackToWholeSign).toBe(false);
  });

  it('still produces a usable chart at the pole', () => {
    const houses = computeHouses(jd, t, 89.9, 0, 'placidus');
    expect(houses.cusps).toHaveLength(12);
    expect(houses.cusps.every((c) => Number.isFinite(c))).toBe(true);
  });
});

describe('whole sign houses', () => {
  const jd = toJulianDay(1985, 7, 22, 8, 50, 0);
  const t = julianCenturies(utToTT(jd, 1985, 7));
  const houses = computeHouses(jd, t, 28.6139, 77.209, 'whole-sign');

  it('starts house 1 at zero degrees of the rising sign', () => {
    expect(houses.cusps[0]).toBe(Math.floor(houses.ascendant / 30) * 30);
  });

  it('spaces every cusp exactly thirty degrees apart', () => {
    for (let i = 0; i < 11; i += 1) {
      expect(
        angularDifference(houses.cusps[i + 1] as number, houses.cusps[i] as number),
      ).toBeCloseTo(30, 9);
    }
  });
});

describe('houseOf', () => {
  const cusps = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  it('assigns a longitude to the containing house', () => {
    expect(houseOf(15, cusps)).toBe(1);
    expect(houseOf(95, cusps)).toBe(4);
    expect(houseOf(359, cusps)).toBe(12);
  });

  it('assigns a cusp longitude to the house it opens', () => {
    expect(houseOf(30, cusps)).toBe(2);
    expect(houseOf(0, cusps)).toBe(1);
  });

  it('handles houses that wrap across zero degrees', () => {
    const wrapped = [340, 10, 40, 70, 100, 130, 160, 190, 220, 250, 280, 310];
    expect(houseOf(350, wrapped)).toBe(1);
    expect(houseOf(5, wrapped)).toBe(1);
    expect(houseOf(15, wrapped)).toBe(2);
  });
});

describe('angles across all four sidereal-time quadrants', () => {
  // The midheaven bug was invisible in two of these four quadrants.
  it.each([0, 6, 12, 18])('is self-consistent at hour %s UT', (hour) => {
    const jd = toJulianDay(1990, 5, 15, hour, 0, 0);
    const t = julianCenturies(utToTT(jd, 1990, 5));
    const obliquity = trueObliquity(t);
    const lst = localSiderealTime(jd, 77.209, t);

    const asc = ascendant(lst, 28.6139, obliquity);
    const mc = midheaven(lst, obliquity);

    // The midheaven always precedes the ascendant in zodiacal order by between
    // 0° and 180° — a relation that a 180° error breaks immediately.
    const separation = angularDifference(asc, mc);
    expect(separation).toBeGreaterThan(0);
    expect(separation).toBeLessThan(180);
  });
});
