/**
 * Torchlight — signification tests
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

import {
  GRAHA_SIGNIFICATIONS,
  HOUSE_SIGNIFICATIONS,
  RASHI_TO_WESTERN,
  grahaSignification,
  houseSignification,
  westernNameFor,
} from './significations';
import { DASHA_SEQUENCE } from './dasha';
import { RASHIS } from './nakshatra';

describe('traditional significations', () => {
  /**
   * The dasha cycle runs on all nine grahas. A period whose ruler has no entry
   * would leave a reading with nothing to say, so the table has to cover the
   * sequence exactly — this is what keeps the two from drifting apart.
   */
  it('covers every graha the dasha cycle can land on', () => {
    for (const { planet } of DASHA_SEQUENCE) {
      expect(grahaSignification(planet)).not.toBeNull();
    }
  });

  it('covers all twelve houses', () => {
    for (let house = 1; house <= 12; house += 1) {
      expect(houseSignification(house)).not.toBeNull();
    }
    expect(houseSignification(0)).toBeNull();
    expect(houseSignification(13)).toBeNull();
  });

  it('maps every rashi the engine can produce to a Western name', () => {
    for (const rashi of RASHIS) {
      expect(westernNameFor(rashi)).not.toBeNull();
    }
  });

  it('returns null rather than guessing for an unknown name', () => {
    expect(grahaSignification('Pluto')).toBeNull();
    expect(westernNameFor('Notarashi')).toBeNull();
  });

  /**
   * These are claims about what a tradition associates with a placement, not
   * claims about a person's future. The distinction matters: a reader who is
   * told a period "brings illness" may act on it. One who is told a tradition
   * "reads this period as demanding of patience" is being given context.
   */
  it('states associations rather than predictions', () => {
    const forbidden = /\b(will|shall|guarantee|destined|fated|must happen)\b/i;

    for (const [name, signification] of Object.entries(GRAHA_SIGNIFICATIONS)) {
      expect(signification.tone).not.toMatch(forbidden);
      expect(`${name}: ${signification.tone}`).toMatch(/traditionally read as/);
    }
  });

  /**
   * The classical texts make claims about death, disease, wealth and marriage
   * that cause real harm when a reader takes them literally. They are
   * deliberately absent, and this test is what keeps them absent.
   */
  it('carries no fatalistic or medical claims', () => {
    const harmful = /\b(death|dying|disease|illness|cancer|divorce|poverty|bankrupt|accident|misfortune)\b/i;

    const everything = [
      ...Object.values(GRAHA_SIGNIFICATIONS),
      ...Object.values(HOUSE_SIGNIFICATIONS),
    ];

    for (const signification of everything) {
      expect(signification.tone).not.toMatch(harmful);
      for (const domain of signification.domains) {
        expect(domain).not.toMatch(harmful);
      }
    }
  });

  it('gives every entry at least two domains and a tone', () => {
    const everything = [
      ...Object.values(GRAHA_SIGNIFICATIONS),
      ...Object.values(HOUSE_SIGNIFICATIONS),
    ];

    for (const signification of everything) {
      expect(signification.domains.length).toBeGreaterThanOrEqual(2);
      expect(signification.tone.length).toBeGreaterThan(10);
    }
  });

  it('names twelve rashis and no more', () => {
    expect(Object.keys(RASHI_TO_WESTERN)).toHaveLength(12);
  });
});
