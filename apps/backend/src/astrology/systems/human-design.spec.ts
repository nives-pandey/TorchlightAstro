/**
 * Torchlight — Human Design — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  GATE_SPAN,
  GATE_WHEEL,
  LINE_SPAN,
  activationsAt,
  designMoment,
  gateOf,
  humanDesignChart,
} from './human-design';
import { planetPosition } from '../core/ephemeris';
import { normalizeDegrees } from '../core/time';

/**
 * Human Design is the system the previous build fabricated, deriving a person's
 * type from `(hours + minutes) % 5`. It is therefore the one that most needs to
 * be demonstrably real rather than merely present.
 *
 * No working independent implementation was found to compare against — the sole
 * npm package under this name fails to load — so verification here separates
 * cleanly into two parts:
 *
 *   - The **astronomy is checked against itself and against the ephemeris**,
 *     which is already validated to 17 arcseconds against NASA JPL. The 88°
 *     solve is verified by measuring the arc it produces, and by confirming the
 *     interval genuinely varies with the Earth's orbital position rather than
 *     being a fixed number of days.
 *   - The **gate wheel is checked structurally**, including against the
 *     published opposite-gate pairings, which are a property of the wheel
 *     entirely independent of how it is stored here.
 */

describe('gate wheel', () => {
  it('contains all sixty-four gates exactly once', () => {
    expect(GATE_WHEEL).toHaveLength(64);
    expect(new Set(GATE_WHEEL).size).toBe(64);

    for (let gate = 1; gate <= 64; gate += 1) {
      expect(GATE_WHEEL).toContain(gate);
    }
  });

  it('divides the circle into sixty-four gates of six lines', () => {
    expect(GATE_SPAN).toBeCloseTo(5.625, 10);
    expect(GATE_SPAN * 64).toBeCloseTo(360, 10);
    expect(LINE_SPAN).toBeCloseTo(0.9375, 10);
    expect(LINE_SPAN * 6).toBeCloseTo(GATE_SPAN, 10);
  });

  it('matches the published opposite-gate pairings', () => {
    /**
     * Gates 180° apart form the documented pairs of the wheel. This is a
     * property of the published wheel rather than of this implementation, so
     * it independently confirms both the ordering and the offset — a rotated
     * or reordered wheel would fail almost every pair.
     */
    const published: Array<[number, number]> = [
      [41, 31],
      [19, 33],
      [13, 7],
      [49, 4],
      [30, 29],
      [55, 59],
      [37, 40],
      [63, 64],
      [22, 47],
      [36, 6],
      [25, 46],
      [17, 18],
      [21, 48],
      [51, 57],
      [42, 32],
      [3, 50],
    ];

    for (const [gate, expected] of published) {
      const index = GATE_WHEEL.indexOf(gate);
      expect(GATE_WHEEL[(index + 32) % 64]).toBe(expected);
    }
  });
});

describe('gateOf', () => {
  it('returns a valid gate and line for every longitude', () => {
    for (let longitude = 0; longitude < 360; longitude += 0.13) {
      const result = gateOf(longitude);
      expect(result.gate).toBeGreaterThanOrEqual(1);
      expect(result.gate).toBeLessThanOrEqual(64);
      expect(result.line).toBeGreaterThanOrEqual(1);
      expect(result.line).toBeLessThanOrEqual(6);
    }
  });

  it('reaches every gate and every line', () => {
    const gates = new Set<number>();
    const lines = new Set<number>();
    for (let longitude = 0; longitude < 360; longitude += 0.05) {
      const result = gateOf(longitude);
      gates.add(result.gate);
      lines.add(result.line);
    }
    expect(gates.size).toBe(64);
    expect(lines.size).toBe(6);
  });

  it('advances the line every 0.9375 degrees within a gate', () => {
    const base = 100;
    const start = gateOf(base);
    for (let step = 1; step < 6; step += 1) {
      const later = gateOf(base + step * LINE_SPAN);
      if (later.gate === start.gate) {
        expect(later.line).toBe(start.line + step);
      }
    }
  });

  it('normalises longitudes outside the circle', () => {
    expect(gateOf(370).gate).toBe(gateOf(10).gate);
    expect(gateOf(-10).gate).toBe(gateOf(350).gate);
  });

  it('changes gate exactly at a boundary', () => {
    // Walk to a known gate edge and confirm the transition is sharp.
    for (let index = 0; index < 64; index += 1) {
      const edge = normalizeDegrees(3 + 52 / 60 + 30 / 3600 + index * GATE_SPAN);
      expect(gateOf(edge + 0.001).gate).toBe(GATE_WHEEL[index]);
    }
  });
});

describe('designMoment', () => {
  /**
   * The design chart is taken from the moment the Sun was 88° of *arc* earlier.
   * Subtracting a fixed 88 days is the common shortcut and is wrong by up to
   * two and a half degrees — nearly half a gate.
   */
  it('lands exactly 88 degrees of solar arc before birth', () => {
    for (const iso of [
      '1985-07-22T14:20:00Z',
      '2000-01-01T12:00:00Z',
      '1962-03-15T06:15:00Z',
      '2024-09-14T03:30:00Z',
      '1936-11-03T23:45:00Z',
    ]) {
      const birth = new Date(iso);
      const design = designMoment(birth);

      const arc = normalizeDegrees(
        planetPosition('Sun', birth).longitude - planetPosition('Sun', design).longitude,
      );

      expect(Math.abs(arc - 88)).toBeLessThan(1e-6);
    }
  });

  it('always precedes the birth', () => {
    for (const iso of ['1985-07-22T14:20:00Z', '2000-01-01T12:00:00Z']) {
      const birth = new Date(iso);
      expect(designMoment(birth).getTime()).toBeLessThan(birth.getTime());
    }
  });

  it('spans a genuinely varying number of days', () => {
    // The Earth's orbit is elliptical, so 88° of arc takes between roughly
    // 86.9 and 91.7 days. A constant interval would make this test fail, which
    // is precisely the point of having it.
    const intervals = [
      '1985-07-22T14:20:00Z',
      '2000-01-01T12:00:00Z',
      '1962-03-15T06:15:00Z',
      '2024-09-14T03:30:00Z',
    ].map((iso) => {
      const birth = new Date(iso);
      return (birth.getTime() - designMoment(birth).getTime()) / 86400000;
    });

    const smallest = Math.min(...intervals);
    const largest = Math.max(...intervals);

    expect(smallest).toBeGreaterThan(85);
    expect(largest).toBeLessThan(93);
    // The spread must be real, not a rounding artefact.
    expect(largest - smallest).toBeGreaterThan(1);
  });

  it('takes longest near aphelion and shortest near perihelion', () => {
    // The Earth moves slowest in July and fastest in January, so a July birth
    // needs more days to cover the same arc than a January one.
    const july = new Date('2000-07-04T00:00:00Z');
    const january = new Date('2000-01-03T00:00:00Z');

    const julyDays = (july.getTime() - designMoment(july).getTime()) / 86400000;
    const januaryDays = (january.getTime() - designMoment(january).getTime()) / 86400000;

    expect(julyDays).toBeGreaterThan(januaryDays);
  });
});

describe('activationsAt', () => {
  const set = activationsAt(new Date('1985-07-22T14:20:00Z'));

  it('activates all ten bodies and both nodes', () => {
    expect(Object.keys(set.activations)).toHaveLength(12);
    expect(set.activations['Sun']).toBeDefined();
    expect(set.activations['North Node']).toBeDefined();
    expect(set.activations['South Node']).toBeDefined();
  });

  it('places the nodes in opposite gates', () => {
    const north = set.activations['North Node'];
    const south = set.activations['South Node'];
    const northIndex = GATE_WHEEL.indexOf(north?.gate as number);
    expect(GATE_WHEEL[(northIndex + 32) % 64]).toBe(south?.gate);
  });

  it('derives each activation from its body position', () => {
    const sun = planetPosition('Sun', set.moment).longitude;
    expect(set.activations['Sun']?.gate).toBe(gateOf(sun).gate);
  });
});

describe('humanDesignChart', () => {
  const chart = humanDesignChart(new Date('1985-07-22T14:20:00Z'));

  it('produces both a personality and a design chart', () => {
    expect(chart.personality.activations['Sun']).toBeDefined();
    expect(chart.design.activations['Sun']).toBeDefined();
    expect(chart.design.moment.getTime()).toBeLessThan(chart.personality.moment.getTime());
  });

  it('separates the two Suns by 88 degrees', () => {
    const separation = normalizeDegrees(chart.personalitySun.longitude - chart.designSun.longitude);
    expect(Math.abs(separation - 88)).toBeLessThan(1e-6);
  });

  it('lists active gates in order without duplicates', () => {
    expect(chart.activeGates.length).toBeGreaterThan(0);
    expect(chart.activeGates.length).toBeLessThanOrEqual(24);
    expect(new Set(chart.activeGates).size).toBe(chart.activeGates.length);

    for (let i = 0; i < chart.activeGates.length - 1; i += 1) {
      expect(chart.activeGates[i + 1] as number).toBeGreaterThan(chart.activeGates[i] as number);
    }
  });

  it('forms the profile from the two Sun lines', () => {
    expect(chart.profile).toBe(`${chart.personalitySun.line}/${chart.designSun.line}`);
    expect(chart.profile).toMatch(/^[1-6]\/[1-6]$/);
  });

  it('is deterministic', () => {
    const again = humanDesignChart(new Date('1985-07-22T14:20:00Z'));
    expect(again.profile).toBe(chart.profile);
    expect(again.activeGates).toEqual(chart.activeGates);
  });
});
