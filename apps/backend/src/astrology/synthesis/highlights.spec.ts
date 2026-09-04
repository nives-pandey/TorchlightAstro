/**
 * Torchlight — highlight tests
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

import { buildChart, type BirthInput } from '../chart';
import { findHighlights } from './highlights';

/**
 * A birth with a known-interesting chart: three planets in one house, a master
 * number in the numerology, and a running dasha. Verified placements, so the
 * assertions below are about what the highlight layer *says* about them, not
 * about the astronomy — that is covered by the engine's own suites.
 */
const RICH: BirthInput = {
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

/** Fixed so the elapsed fractions are deterministic. */
const NOW = new Date('2026-09-04T00:00:00Z');

describe('findHighlights', () => {
  it('reports the running dasha as a bounded window', () => {
    const { now } = findHighlights(buildChart(RICH), NOW);

    expect(now).not.toBeNull();
    expect(now?.mahadasha.ruler).toBe('Jupiter');
    expect(new Date(now?.mahadasha.endsAt ?? 0).getFullYear()).toBe(2033);

    // Partway through, not at either end.
    expect(now?.mahadasha.elapsed).toBeGreaterThan(0);
    expect(now?.mahadasha.elapsed).toBeLessThan(1);
  });

  it('names what comes next, so the reading is not only about now', () => {
    const { now } = findHighlights(buildChart(RICH), NOW);

    expect(now?.next).not.toBeNull();
    expect(now?.next?.ruler).toBe('Saturn');
    // The next period cannot have started yet.
    expect(new Date(now?.next?.startsAt ?? 0).getTime()).toBeGreaterThan(NOW.getTime());
  });

  it('finds a stellium and says which planets make it', () => {
    const { notable } = findHighlights(buildChart(RICH), NOW);
    const stelliums = notable.filter((h) => h.kind === 'stellium');

    expect(stelliums.length).toBeGreaterThan(0);
    for (const stellium of stelliums) {
      expect(stellium.basis.length).toBeGreaterThanOrEqual(3);
      expect(stellium.statement).toMatch(/planets sit together/);
    }
  });

  it('explains the zodiac divergence rather than hiding it', () => {
    const { notable } = findHighlights(buildChart(RICH), NOW);
    const divergence = notable.find((h) => h.kind === 'zodiac-divergence');

    expect(divergence).toBeDefined();
    // Both readings named, and the reason they differ.
    expect(divergence?.statement).toMatch(/Western reads your Sun as \w+; Vedic reads it as \w+/);
    expect(divergence?.statement).toMatch(/different starting points/);
    expect(divergence?.basis).toHaveLength(3);
  });

  it('orders rare findings ahead of ordinary ones', () => {
    const { notable } = findHighlights(buildChart(RICH), NOW);
    const rank = { rare: 0, uncommon: 1, ordinary: 2 } as const;

    for (let i = 1; i < notable.length; i += 1) {
      const previous = notable[i - 1]!;
      const current = notable[i]!;
      expect(rank[previous.notability]).toBeLessThanOrEqual(rank[current.notability]);
    }
  });

  it('traces every finding back to a placement', () => {
    const { notable } = findHighlights(buildChart(RICH), NOW);

    // A claim with no basis is indistinguishable from an invented one.
    for (const highlight of notable) {
      expect(highlight.basis.length).toBeGreaterThan(0);
      expect(highlight.statement.length).toBeGreaterThan(0);
    }
  });

  it('suppresses house-based findings when the birth time is unknown', () => {
    const { hour: _hour, minute: _minute, ...timeless } = RICH;
    const chart = buildChart(timeless);
    const { notable } = findHighlights(chart, NOW);

    expect(chart.hasBirthTime).toBe(false);
    // A stellium is a statement about houses, and houses need a birth time.
    expect(notable.some((h) => h.kind === 'stellium')).toBe(false);
  });

  it('is deterministic for the same chart and moment', () => {
    const chart = buildChart(RICH);

    expect(findHighlights(chart, NOW)).toEqual(findHighlights(chart, NOW));
  });
});
