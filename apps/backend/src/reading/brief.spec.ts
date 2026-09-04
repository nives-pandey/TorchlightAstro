/**
 * Torchlight — brief tests
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

import { buildChart, type BirthInput } from '../astrology/chart';
import { buildBrief, renderBrief } from './brief';

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

const NOW = new Date('2026-09-04T00:00:00Z');

describe('the reading brief', () => {
  const chart = buildChart(BIRTH);
  const brief = buildBrief(chart, 'Test Person', NOW);
  const rendered = renderBrief(brief);

  it('states the current period in years, not jargon', () => {
    const period = brief.now.find((f) => f.label === 'Current period');

    expect(period).toBeDefined();
    expect(period?.statement).toMatch(/Jupiter period/);
    expect(period?.statement).toMatch(/2017 to 2033/);
    // "mahadasha" belongs in the basis, not in the sentence a reader sees.
    expect(period?.statement).not.toMatch(/mahadasha/i);
  });

  /**
   * The security property of this layer. A model given coordinates can compute
   * a placement nobody verified and assert it as confidently as a real one. It
   * must only ever see conclusions.
   */
  it('never exposes a raw coordinate to the model', () => {
    // Longitudes and degrees carry several decimals; a legitimate figure in the
    // brief is a year, a whole count, or the ayanamsa stated to two places.
    const suspicious = rendered.match(/\d+\.\d{3,}/g);

    expect(suspicious).toBeNull();
  });

  it('does not leak the raw sidereal or tropical longitudes', () => {
    const sun = chart.western.planets.find((p) => p.name === 'Sun');

    expect(sun).toBeDefined();
    expect(rendered).not.toContain(String(sun?.longitude));
    expect(rendered).not.toContain(String(sun?.siderealLongitude));
  });

  it('tells the model when houses are unavailable, so it cannot invent them', () => {
    const { hour: _hour, minute: _minute, ...timeless } = BIRTH;
    const timelessBrief = renderBrief(buildBrief(buildChart(timeless), 'Test Person', NOW));

    expect(timelessBrief).toMatch(/Birth time unknown/);
    expect(timelessBrief).toMatch(/Do not mention them/);
  });

  it('carries both sides of every disagreement', () => {
    const disagreements = brief.character.filter((f) => f.label === 'Traditions disagree');

    expect(disagreements.length).toBeGreaterThan(0);
    for (const fact of disagreements) {
      // Both camps named, so the model cannot report a disagreement one-sidedly.
      expect(fact.statement).toMatch(/read them as .+, while .+ read them as /);
      expect(fact.basis.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('explains why two traditions name different signs', () => {
    const divergence = brief.notable.find(
      (f) => f.label === 'Why two traditions name different signs',
    );

    expect(divergence).toBeDefined();
    expect(divergence?.statement).toMatch(/different starting points/);
  });

  it('gives every fact a basis, so no claim is unsourced', () => {
    for (const fact of [...brief.now, ...brief.notable, ...brief.character]) {
      expect(fact.basis.length).toBeGreaterThan(0);
    }
  });

  it('is deterministic for the same chart and moment', () => {
    expect(renderBrief(buildBrief(chart, 'Test Person', NOW))).toBe(rendered);
  });
});
