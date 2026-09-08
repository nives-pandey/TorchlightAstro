/**
 * Torchlight — life area tests
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

import { buildChart, type BirthInput } from '../chart';
import { rulerOfSign } from '../systems/gemstone';
import { LIFE_AREAS, readLifeAreas } from './life-areas';

const BIRTH: BirthInput = {
  name: 'Test Person',
  year: 1990,
  month: 8,
  day: 15,
  hour: 14,
  minute: 30,
  utcOffsetHours: 5.5,
  latitude: 26.39271,
  longitude: 81.47594,
};

describe('life areas', () => {
  const chart = buildChart(BIRTH);
  const { areas, available } = readLifeAreas(chart);

  it('covers every area exactly once', () => {
    expect(available).toBe(true);
    expect(areas).toHaveLength(LIFE_AREAS.length);
    expect(new Set(areas.map((a) => a.key)).size).toBe(LIFE_AREAS.length);
  });

  /**
   * Houses are measured from the ascendant, so the ruler of an area's house is
   * a fact about the chart rather than a lookup. Deriving it twice by different
   * routes is what catches an off-by-one in the whole-sign arithmetic.
   */
  it('names the ruler of each house correctly from the ascendant', () => {
    const ascendant = chart.vedic.ascendantRashi?.index as number;

    for (const area of areas) {
      area.houses.forEach((house, index) => {
        const expected = rulerOfSign(((ascendant - 1 + house - 1) % 12) + 1);
        expect(area.rulers[index]).toBe(expected);
      });
    }
  });

  it('places a planet in the area whose house it occupies', () => {
    const self = areas.find((a) => a.key === 'self');
    const inFirstHouse = chart.western.planets
      .filter((p) => p.house === 1)
      .map((p) => p.name)
      .sort();

    expect(self?.occupants.map((o) => o.planet).sort()).toEqual(inFirstHouse);
  });

  /**
   * The definition of "active" the design states: an area is active when a
   * ruler of its houses also rules the running period or sub-period.
   */
  it('marks an area active only when its ruler runs the current period', () => {
    const period = chart.vedic.currentDasha?.mahadasha?.planet;
    const sub = chart.vedic.currentDasha?.antardasha?.planet;

    for (const area of areas) {
      const shouldBeActive =
        (period !== undefined && area.rulers.includes(period)) ||
        (sub !== undefined && area.rulers.includes(sub));

      expect(area.active).toBe(shouldBeActive);
    }
  });

  it('says which period activated an area, and nothing when none did', () => {
    for (const area of areas) {
      if (area.active) {
        expect(area.activatedBy).not.toBeNull();
        expect(area.quietUntil).toBeNull();
      } else {
        expect(area.activatedBy).toBeNull();
      }
    }
  });

  it('carries what the tradition says those houses concern', () => {
    for (const area of areas) {
      expect(area.domains.length).toBeGreaterThan(0);
      // Two houses in one area often share a domain; it should appear once.
      expect(new Set(area.domains).size).toBe(area.domains.length);
    }
  });

  /**
   * Without a birth time every house in the chart is wrong. A plausible wrong
   * answer about someone's marriage is worse than no answer, so the layer
   * refuses rather than guessing.
   */
  it('refuses to read areas when the birth time is unknown', () => {
    const { hour: _hour, minute: _minute, ...timeless } = BIRTH;
    const result = readLifeAreas(buildChart(timeless));

    expect(result.available).toBe(false);
    expect(result.areas).toHaveLength(0);
  });

  it('reads a chart that has been through JSON, as a stored one has', () => {
    const stored = JSON.parse(JSON.stringify(chart)) as typeof chart;

    expect(readLifeAreas(stored)).toEqual(readLifeAreas(chart));
  });
});
