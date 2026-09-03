/**
 * Torchlight — Vimshottari planetary period system — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  DASHA_SEQUENCE,
  DASHA_TOTAL_YEARS,
  activeDasha,
  subPeriods,
  vimshottariDashas,
} from './dasha';
import { NAKSHATRA_SPAN } from './nakshatra';

/**
 * The dasha system answers "when" in Vedic astrology, so its errors are
 * measured in years of a person's life rather than arcseconds.
 *
 * There is no external reference to compare against here the way there is for
 * planetary positions — Vimshottari is arithmetic, not astronomy. What can be
 * verified is that the arithmetic satisfies the properties tradition defines:
 * a 120-year cycle, a fixed planetary order, proportional subdivision, and a
 * first period shortened by exactly the fraction of the nakshatra already
 * travelled at birth.
 */

const birth = new Date(Date.UTC(1990, 0, 1, 0, 0, 0));
const YEAR_MS = 365.25 * 86400000;

describe('dasha sequence', () => {
  it('totals exactly 120 years', () => {
    const total = DASHA_SEQUENCE.reduce((sum, entry) => sum + entry.years, 0);
    expect(total).toBe(DASHA_TOTAL_YEARS);
    expect(total).toBe(120);
  });

  it('lists the nine planets in the traditional order', () => {
    expect(DASHA_SEQUENCE.map((entry) => entry.planet)).toEqual([
      'Ketu',
      'Venus',
      'Sun',
      'Moon',
      'Mars',
      'Rahu',
      'Jupiter',
      'Saturn',
      'Mercury',
    ]);
  });

  it('allots the traditional year counts', () => {
    expect(DASHA_SEQUENCE.map((entry) => entry.years)).toEqual([7, 20, 6, 10, 7, 18, 16, 19, 17]);
  });
});

describe('vimshottariDashas', () => {
  it('starts with the nakshatra ruler', () => {
    // 0° sidereal is the start of Ashwini, ruled by Ketu.
    expect(vimshottariDashas(birth, 0)[0]?.planet).toBe('Ketu');
    // Rohini (index 4) is ruled by the Moon; its span starts at 3 × 13°20′.
    expect(vimshottariDashas(birth, NAKSHATRA_SPAN * 3 + 1)[0]?.planet).toBe('Moon');
  });

  it('spans exactly 120 years when born at a nakshatra boundary', () => {
    const periods = vimshottariDashas(birth, 0);
    const last = periods[periods.length - 1];
    const years = ((last as { end: Date }).end.getTime() - birth.getTime()) / YEAR_MS;
    expect(years).toBeCloseTo(120, 6);
  });

  it('shortens the first period by the fraction already travelled', () => {
    // Halfway through Ashwini leaves half of Ketu's seven years.
    const halfway = vimshottariDashas(birth, NAKSHATRA_SPAN / 2);
    expect(halfway[0]?.years).toBeCloseTo(3.5, 10);

    // Three quarters through leaves a quarter.
    const threeQuarters = vimshottariDashas(birth, NAKSHATRA_SPAN * 0.75);
    expect(threeQuarters[0]?.years).toBeCloseTo(1.75, 10);
  });

  it('gives full length to every period after the first', () => {
    const periods = vimshottariDashas(birth, NAKSHATRA_SPAN / 2);
    expect(periods[1]?.planet).toBe('Venus');
    expect(periods[1]?.years).toBe(20);
  });

  it('leaves no gaps or overlaps between periods', () => {
    const periods = vimshottariDashas(birth, 100);
    for (let i = 0; i < periods.length - 1; i += 1) {
      const end = (periods[i] as { end: Date }).end.getTime();
      const nextStart = (periods[i + 1] as { start: Date }).start.getTime();
      expect(Math.abs(end - nextStart)).toBeLessThan(2);
    }
  });

  it('follows the sequence cyclically', () => {
    const periods = vimshottariDashas(birth, NAKSHATRA_SPAN * 8 + 1); // Ashlesha, Mercury
    expect(periods[0]?.planet).toBe('Mercury');
    // Mercury is last, so the cycle wraps to Ketu.
    expect(periods[1]?.planet).toBe('Ketu');
  });

  it('can extend over multiple cycles', () => {
    const periods = vimshottariDashas(birth, 0, 2);
    expect(periods).toHaveLength(18);
  });
});

describe('subPeriods', () => {
  const periods = vimshottariDashas(birth, 0);
  const venus = periods[1] as { planet: string; years: number; start: Date; end: Date };

  it('produces nine antardashas', () => {
    expect(subPeriods(venus)).toHaveLength(9);
  });

  it('starts with the parent planet', () => {
    expect(subPeriods(venus)[0]?.planet).toBe('Venus');
  });

  it('sums exactly to the parent period', () => {
    const total = subPeriods(venus).reduce((sum, period) => sum + period.years, 0);
    expect(total).toBeCloseTo(venus.years, 9);
  });

  it('divides each share in proportion to the 120-year cycle', () => {
    // Venus within Venus: 20 × 20/120 = 3.333… years.
    expect(subPeriods(venus)[0]?.years).toBeCloseTo((20 * 20) / 120, 10);
    // Sun within Venus: 20 × 6/120 = 1 year.
    const sun = subPeriods(venus).find((period) => period.planet === 'Sun');
    expect(sun?.years).toBeCloseTo(1, 10);
  });

  it('starts and ends flush with the parent', () => {
    const subs = subPeriods(venus);
    expect(subs[0]?.start.getTime()).toBe(venus.start.getTime());
    const last = subs[subs.length - 1];
    expect(Math.abs((last as { end: Date }).end.getTime() - venus.end.getTime())).toBeLessThan(2);
  });
});

describe('activeDasha', () => {
  const periods = vimshottariDashas(birth, 0);

  it('finds the period containing a date', () => {
    const at = new Date(Date.UTC(1995, 0, 1));
    const { mahadasha, antardasha } = activeDasha(periods, at);
    expect(mahadasha).not.toBeNull();
    expect(antardasha).not.toBeNull();
    expect(at.getTime()).toBeGreaterThanOrEqual((mahadasha as { start: Date }).start.getTime());
    expect(at.getTime()).toBeLessThan((mahadasha as { end: Date }).end.getTime());
  });

  it('nests the antardasha inside its mahadasha', () => {
    const { mahadasha, antardasha } = activeDasha(periods, new Date(Date.UTC(2005, 5, 15)));
    expect((antardasha as { start: Date }).start.getTime()).toBeGreaterThanOrEqual(
      (mahadasha as { start: Date }).start.getTime(),
    );
    expect((antardasha as { end: Date }).end.getTime()).toBeLessThanOrEqual(
      (mahadasha as { end: Date }).end.getTime() + 2,
    );
  });

  it('returns nulls rather than throwing outside the computed span', () => {
    const before = activeDasha(periods, new Date(Date.UTC(1980, 0, 1)));
    expect(before.mahadasha).toBeNull();
    expect(before.antardasha).toBeNull();

    const after = activeDasha(periods, new Date(Date.UTC(2200, 0, 1)));
    expect(after.mahadasha).toBeNull();
  });

  it('returns the birth period at the moment of birth', () => {
    expect(activeDasha(periods, birth).mahadasha?.planet).toBe('Ketu');
  });
});
