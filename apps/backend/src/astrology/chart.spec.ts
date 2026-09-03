/**
 * Torchlight — chart assembly — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { ENGINE_VERSION, buildChart, tropicalSignName, type BirthInput } from './chart';

/**
 * The assembly layer is where twenty verified modules meet, so its failures are
 * not arithmetic errors but wiring errors: a timezone applied twice, a local
 * time passed where an instant was wanted, a section quietly filled with a
 * default rather than omitted.
 *
 * Those are what this suite checks. The underlying calculations are already
 * verified against NASA JPL, Swiss Ephemeris and three traditional references
 * in their own suites and are not re-checked here.
 *
 * The reference chart throughout is Delhi, 22 July 1985 at 14:20 IST. Its UT
 * instant is 08:50, and its planetary positions were confirmed against Swiss
 * Ephemeris to within 2.91 arcseconds, its ascendant to 0.04.
 */

const DELHI: BirthInput = {
  name: 'Test Person',
  year: 1985,
  month: 7,
  day: 22,
  hour: 14,
  minute: 20,
  utcOffsetHours: 5.5,
  latitude: 28.6139,
  longitude: 77.209,
};

describe('time handling', () => {
  it('converts local wall-clock time to the correct UT instant', () => {
    // 14:20 IST is 08:50 UT. Applying the offset the wrong way would give
    // 19:50, and applying it twice 03:20 — both plausible-looking and wrong.
    expect(buildChart(DELHI).utc).toBe('1985-07-22T08:50:00.000Z');
  });

  it('handles a negative offset', () => {
    const newYork = buildChart({
      ...DELHI,
      utcOffsetHours: -4,
      latitude: 40.7128,
      longitude: -74.006,
    });
    expect(newYork.utc).toBe('1985-07-22T18:20:00.000Z');
  });

  it('rolls the date backward when the offset crosses midnight', () => {
    const chart = buildChart({ ...DELHI, hour: 2, minute: 0, utcOffsetHours: 5.5 });
    expect(chart.utc).toBe('1985-07-21T20:30:00.000Z');
  });

  it('rolls the date forward when the offset crosses midnight the other way', () => {
    const chart = buildChart({ ...DELHI, hour: 22, minute: 0, utcOffsetHours: -5 });
    expect(chart.utc).toBe('1985-07-23T03:00:00.000Z');
  });

  it('handles a half-hour offset exactly', () => {
    // India, Iran and parts of Australia are not on whole hours.
    expect(buildChart({ ...DELHI, hour: 12, minute: 0 }).utc).toBe('1985-07-22T06:30:00.000Z');
  });
});

describe('a complete chart', () => {
  const chart = buildChart(DELHI);

  it('reports a birth time was supplied', () => {
    expect(chart.hasBirthTime).toBe(true);
  });

  it('places all ten bodies', () => {
    expect(chart.western.planets).toHaveLength(10);
    for (const planet of chart.western.planets) {
      expect(planet.signIndex).toBeGreaterThanOrEqual(1);
      expect(planet.signIndex).toBeLessThanOrEqual(12);
      expect(planet.siderealSign.index).toBeGreaterThanOrEqual(1);
      expect(planet.nakshatra.index).toBeGreaterThanOrEqual(1);
      expect(planet.nakshatra.index).toBeLessThanOrEqual(27);
    }
  });

  it('assigns every planet to a house', () => {
    for (const planet of chart.western.planets) {
      expect(planet.house).toBeGreaterThanOrEqual(1);
      expect(planet.house).toBeLessThanOrEqual(12);
    }
  });

  it('computes twelve house cusps', () => {
    expect(chart.western.houses?.cusps).toHaveLength(12);
  });

  it('places the nodes opposite each other', () => {
    const separation = Math.abs(chart.western.northNode - chart.western.southNode);
    expect(Math.min(separation, 360 - separation)).toBeCloseTo(180, 6);
  });

  it('derives sidereal positions consistently with the ayanamsa it reports', () => {
    // The reported ayanamsa is recovered from the conversion rather than
    // recomputed, so the two cannot disagree — this asserts that holds.
    for (const planet of chart.western.planets) {
      const expected = (((planet.longitude - chart.vedic.ayanamsaDegrees) % 360) + 360) % 360;
      expect(planet.siderealLongitude).toBeCloseTo(expected, 6);
    }
  });

  it('produces a full Vedic section', () => {
    expect(chart.vedic.ayanamsaDegrees).toBeGreaterThan(23);
    expect(chart.vedic.ayanamsaDegrees).toBeLessThan(25);
    expect(chart.vedic.dashas).toHaveLength(9);
    expect(Object.keys(chart.vedic.moonVargas)).toHaveLength(16);
    expect(chart.vedic.ascendantRashi).not.toBeNull();
  });

  it('starts the dasha sequence with the Moon nakshatra ruler', () => {
    expect(chart.vedic.dashas[0]?.planet).toBe(chart.vedic.moonNakshatra.ruler);
  });

  it('produces four Chinese pillars', () => {
    for (const pillar of [
      chart.chinese.year,
      chart.chinese.month,
      chart.chinese.day,
      chart.chinese.hour,
    ]) {
      expect(pillar.ganZhi).toHaveLength(2);
    }
    expect(chart.chinese.dayMaster).toBe(chart.chinese.day.stem);
  });

  it('produces the remaining systems', () => {
    expect(chart.numerology?.lifePath).toBeGreaterThan(0);
    expect(chart.humanDesign.profile).toMatch(/^[1-6]\/[1-6]$/);
    expect(chart.tarot.cards.length).toBeGreaterThan(0);
    expect(chart.gemstones.length).toBeGreaterThan(0);
    expect(chart.colours.length).toBeGreaterThan(0);
  });

  it('synthesises across every dimension', () => {
    expect(chart.synthesis.dimensions).toHaveLength(5);
    expect(chart.synthesis.systems.length).toBeGreaterThanOrEqual(4);
  });

  it('keeps every trait reading for inspection', () => {
    expect(chart.traitReadings.length).toBeGreaterThan(15);
    for (const item of chart.traitReadings) {
      expect(item.source).toBeTruthy();
    }
  });

  it('stamps the engine version', () => {
    expect(chart.engineVersion).toBe(ENGINE_VERSION);
  });

  it('echoes the input that produced it', () => {
    expect(chart.input).toEqual(DELHI);
  });
});

describe('a missing birth time', () => {
  const chart = buildChart({
    name: 'Test Person',
    year: 1985,
    month: 7,
    day: 22,
    utcOffsetHours: 5.5,
    latitude: 28.6139,
    longitude: 77.209,
  });

  it('says so rather than pretending otherwise', () => {
    expect(chart.hasBirthTime).toBe(false);
  });

  it('omits everything that genuinely needs a time', () => {
    // Substituting noon and presenting the result as fact is what most
    // implementations do. A null is honest; a plausible wrong answer is not.
    expect(chart.western.houses).toBeNull();
    expect(chart.vedic.ascendantRashi).toBeNull();
    for (const planet of chart.western.planets) {
      expect(planet.house).toBeNull();
    }
  });

  it('still produces everything that does not need one', () => {
    expect(chart.western.planets).toHaveLength(10);
    expect(chart.vedic.moonNakshatra.name).toBeTruthy();
    expect(chart.vedic.dashas).toHaveLength(9);
    expect(chart.chinese.year.ganZhi).toBeTruthy();
    expect(chart.numerology?.lifePath).toBeGreaterThan(0);
    expect(chart.tarot.cards.length).toBeGreaterThan(0);
    expect(chart.synthesis.dimensions).toHaveLength(5);
  });
});

describe('a missing name', () => {
  // Genuinely omitted rather than set to undefined: with
  // exactOptionalPropertyTypes the two are different types, and only omission
  // reflects what a caller without a name would actually send.
  const { name: _unused, ...withoutName } = DELHI;

  it('omits numerology rather than inventing a name', () => {
    expect(buildChart(withoutName).numerology).toBeNull();
  });

  it('still synthesises from the remaining systems', () => {
    const chart = buildChart(withoutName);
    expect(chart.synthesis.dimensions.length).toBeGreaterThan(0);
    expect(chart.synthesis.systems).not.toContain('numerology');
  });
});

describe('determinism', () => {
  it('produces an identical chart for identical input', () => {
    // The current dasha depends on today's date, so it is excluded — everything
    // else must be a pure function of the birth.
    const strip = (chart: ReturnType<typeof buildChart>): string => {
      const copy = JSON.parse(JSON.stringify(chart)) as Record<string, unknown>;
      delete (copy.vedic as Record<string, unknown>).currentDasha;
      return JSON.stringify(copy);
    };

    expect(strip(buildChart(DELHI))).toBe(strip(buildChart(DELHI)));
  });

  it('produces different charts for different births', () => {
    const first = buildChart(DELHI);
    const second = buildChart({ ...DELHI, year: 1990 });
    expect(first.western.planets[0]?.longitude).not.toBe(second.western.planets[0]?.longitude);
  });

  it('changes the chart when only the birth time changes', () => {
    // The ascendant moves about a degree every four minutes, so a different
    // time must give a different chart even on the same day.
    const morning = buildChart({ ...DELHI, hour: 6 });
    const evening = buildChart({ ...DELHI, hour: 18 });
    expect(morning.western.houses?.ascendant).not.toBe(evening.western.houses?.ascendant);
  });

  it('changes the chart when only the place changes', () => {
    const delhi = buildChart(DELHI);
    const sydney = buildChart({ ...DELHI, latitude: -33.8688, longitude: 151.2093 });
    expect(delhi.western.houses?.ascendant).not.toBe(sydney.western.houses?.ascendant);
  });
});

describe('robustness across the input range', () => {
  it('builds a chart anywhere on Earth', () => {
    for (const [latitude, longitude] of [
      [0, 0],
      [51.5, -0.12],
      [-33.87, 151.21],
      [64.15, -21.94],
      [-54.8, -68.3],
      [1.35, 103.82],
    ] as Array<[number, number]>) {
      const chart = buildChart({ ...DELHI, latitude, longitude });
      expect(chart.western.planets).toHaveLength(10);
      expect(chart.western.houses?.cusps).toHaveLength(12);
      expect(chart.synthesis.dimensions.length).toBeGreaterThan(0);
    }
  });

  it('builds a chart across the supported year range', () => {
    for (const year of [1900, 1936, 1962, 1985, 2000, 2024]) {
      const chart = buildChart({ ...DELHI, year });
      expect(chart.western.planets).toHaveLength(10);
      expect(chart.vedic.dashas).toHaveLength(9);
      expect(chart.chinese.year.ganZhi).toHaveLength(2);
    }
  });

  it('handles a birth at either end of the day', () => {
    for (const [hour, minute] of [
      [0, 0],
      [23, 59],
    ] as Array<[number, number]>) {
      const chart = buildChart({ ...DELHI, hour, minute });
      expect(chart.western.houses?.cusps).toHaveLength(12);
      expect(chart.chinese.hour.ganZhi).toHaveLength(2);
    }
  });

  it('falls back to whole sign above the Placidus limit', () => {
    // Longyearbyen, well inside the Arctic circle.
    const chart = buildChart({ ...DELHI, latitude: 78.2232, longitude: 15.6469 });
    expect(chart.western.houses?.system).toBe('whole-sign');
    expect(chart.western.houses?.fellBackToWholeSign).toBe(true);
  });
});

describe('tropicalSignName', () => {
  it('names each sign from its longitude', () => {
    expect(tropicalSignName(0)).toBe('Aries');
    expect(tropicalSignName(125)).toBe('Leo');
    expect(tropicalSignName(359)).toBe('Pisces');
  });

  it('normalises longitudes outside the circle', () => {
    expect(tropicalSignName(370)).toBe('Aries');
    expect(tropicalSignName(-10)).toBe('Pisces');
  });
});
