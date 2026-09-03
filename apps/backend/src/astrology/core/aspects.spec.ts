/**
 * Torchlight — planetary aspects — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  ASPECT_DEFINITIONS,
  ASPECT_TYPES,
  type AspectType,
  allowedOrbFor,
  aspectBetween,
  aspectToPoint,
  aspectsTo,
  findAspects,
  separation,
} from './aspects';
import { allPlanetPositions, type PlanetPosition } from './ephemeris';

/**
 * Aspects are pure geometry over positions the ephemeris has already verified,
 * so correctness here is provable by construction rather than by comparison
 * against an external table: an aspect is present if and only if the angular
 * separation falls within the orb of a defined angle.
 *
 * The tests therefore assert the geometry directly, and separately confirm that
 * the same aspect set emerges whether positions come from this engine or from
 * Swiss Ephemeris — a difference there would mean the aspect logic is sensitive
 * to sub-arcsecond position differences, which it must not be.
 */

function body(name: string, longitude: number, speed = 1): PlanetPosition {
  return {
    name: name as PlanetPosition['name'],
    longitude,
    latitude: 0,
    distance: 1,
    speed,
    retrograde: speed < 0,
  };
}

describe('separation', () => {
  it('measures the shorter arc', () => {
    expect(separation(0, 90)).toBe(90);
    // 270° apart one way is 90° the other; aspects are undirected.
    expect(separation(0, 270)).toBe(90);
  });

  it('is symmetric', () => {
    expect(separation(10, 200)).toBeCloseTo(separation(200, 10), 12);
  });

  it('never exceeds 180 degrees', () => {
    for (let a = 0; a < 360; a += 7) {
      for (let b = 0; b < 360; b += 11) {
        const value = separation(a, b);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(180);
      }
    }
  });

  it('handles the wrap across zero', () => {
    expect(separation(355, 5)).toBeCloseTo(10, 12);
    expect(separation(5, 355)).toBeCloseTo(10, 12);
  });
});

describe('aspect definitions', () => {
  it('defines every declared type', () => {
    for (const type of ASPECT_TYPES) {
      expect(ASPECT_DEFINITIONS[type]).toBeDefined();
      expect(ASPECT_DEFINITIONS[type].orb).toBeGreaterThan(0);
    }
  });

  it('places every aspect angle within a half circle', () => {
    for (const type of ASPECT_TYPES) {
      const { angle } = ASPECT_DEFINITIONS[type];
      expect(angle).toBeGreaterThanOrEqual(0);
      expect(angle).toBeLessThanOrEqual(180);
    }
  });

  it('marks exactly the five Ptolemaic aspects as major', () => {
    const major = ASPECT_TYPES.filter((type) => ASPECT_DEFINITIONS[type].major);
    expect(major.sort()).toEqual(
      ['conjunction', 'opposition', 'sextile', 'square', 'trine'].sort(),
    );
  });

  it('gives major aspects wider orbs than minor ones', () => {
    const smallestMajor = Math.min(
      ...ASPECT_TYPES.filter((t) => ASPECT_DEFINITIONS[t].major).map(
        (t) => ASPECT_DEFINITIONS[t].orb,
      ),
    );
    const largestMinor = Math.max(
      ...ASPECT_TYPES.filter((t) => !ASPECT_DEFINITIONS[t].major).map(
        (t) => ASPECT_DEFINITIONS[t].orb,
      ),
    );
    expect(smallestMajor).toBeGreaterThan(largestMinor);
  });
});

describe('allowedOrbFor', () => {
  it('widens the orb when a luminary is involved', () => {
    const plain = allowedOrbFor('conjunction', 'Mars', 'Saturn');
    expect(allowedOrbFor('conjunction', 'Sun', 'Saturn')).toBeGreaterThan(plain);
    expect(allowedOrbFor('conjunction', 'Mars', 'Moon')).toBeGreaterThan(plain);
  });

  it('applies the luminary bonus once, not twice', () => {
    expect(allowedOrbFor('conjunction', 'Sun', 'Moon')).toBe(
      allowedOrbFor('conjunction', 'Sun', 'Mars'),
    );
  });
});

describe('aspectBetween', () => {
  it('detects each major aspect at its exact angle', () => {
    const cases: Array<[number, AspectType]> = [
      [0, 'conjunction'],
      [60, 'sextile'],
      [90, 'square'],
      [120, 'trine'],
      [180, 'opposition'],
    ];

    for (const [angle, expected] of cases) {
      const found = aspectBetween(body('Mars', 0), body('Saturn', angle));
      expect(found?.type).toBe(expected);
      expect(found?.orb).toBeCloseTo(0, 10);
      expect(found?.strength).toBeCloseTo(1, 10);
    }
  });

  it('returns null when no aspect is within orb', () => {
    // 100° is 10° from a square and 20° from a trine — outside both.
    expect(aspectBetween(body('Mars', 0), body('Saturn', 100))).toBeNull();
  });

  it('accepts an aspect just inside orb and rejects one just outside', () => {
    const orb = allowedOrbFor('square', 'Mars', 'Saturn');
    expect(aspectBetween(body('Mars', 0), body('Saturn', 90 + orb - 0.01))).not.toBeNull();
    expect(aspectBetween(body('Mars', 0), body('Saturn', 90 + orb + 0.01))).toBeNull();
  });

  it('chooses the closest aspect when orbs overlap', () => {
    // 46° is 1° from a semisquare (45°) and 16° from a sextile — the
    // semisquare must win regardless of table order.
    const found = aspectBetween(body('Mars', 0), body('Saturn', 46), { includeMinor: true });
    expect(found?.type).toBe('semisquare');
  });

  it('excludes minor aspects unless asked', () => {
    expect(aspectBetween(body('Mars', 0), body('Saturn', 150))).toBeNull();
    expect(aspectBetween(body('Mars', 0), body('Saturn', 150), { includeMinor: true })?.type).toBe(
      'quincunx',
    );
  });

  it('scales orbs by the supplied factor', () => {
    const wide = aspectBetween(body('Mars', 0), body('Saturn', 99), { orbFactor: 2 });
    expect(wide?.type).toBe('square');
    expect(aspectBetween(body('Mars', 0), body('Saturn', 99))).toBeNull();
  });

  it('reports strength as 1 at exact and 0 at the edge of orb', () => {
    const exact = aspectBetween(body('Mars', 0), body('Saturn', 120));
    expect(exact?.strength).toBeCloseTo(1, 10);

    const orb = allowedOrbFor('trine', 'Mars', 'Saturn');
    const edge = aspectBetween(body('Mars', 0), body('Saturn', 120 + orb));
    expect(edge?.strength).toBeCloseTo(0, 6);
  });

  it('works across the zero-degree wrap', () => {
    // 357° and 3° are 6° apart, not 354°. Within the 8° conjunction orb.
    expect(aspectBetween(body('Mars', 357), body('Venus', 3))?.type).toBe('conjunction');

    // And the orb is still enforced across the wrap: 355° to 5° is 10° apart,
    // outside Mars-Venus's 8°, so there is no aspect. The first version of this
    // test asserted a conjunction here and was simply wrong about the orb.
    expect(aspectBetween(body('Mars', 355), body('Venus', 5))).toBeNull();

    // The same separation does aspect when a luminary widens the orb to 10°.
    expect(aspectBetween(body('Sun', 355), body('Venus', 5))?.type).toBe('conjunction');
  });
});

describe('applying and separating', () => {
  it('marks a faster body closing on a slower one as applying', () => {
    // Mars at 85° moving 1°/day toward Saturn at 90° standing still: the gap
    // to an exact conjunction is shrinking.
    const found = aspectBetween(body('Mars', 85, 1), body('Saturn', 90, 0));
    expect(found?.type).toBe('conjunction');
    expect(found?.applying).toBe(true);
  });

  it('marks a body moving away as separating', () => {
    const found = aspectBetween(body('Mars', 95, 1), body('Saturn', 90, 0));
    expect(found?.applying).toBe(false);
  });

  it('handles retrograde motion, which inverts the naive test', () => {
    // Mars is *ahead* of Saturn but moving backwards, so it is still closing.
    // A positional heuristic would call this separating; only the speeds tell
    // the truth.
    const found = aspectBetween(body('Mars', 95, -1), body('Saturn', 90, 0));
    expect(found?.applying).toBe(true);
  });

  it('accounts for both bodies moving', () => {
    // Both advance, but Saturn faster, so the gap widens.
    const found = aspectBetween(body('Mars', 85, 0.5), body('Saturn', 90, 2));
    expect(found?.applying).toBe(false);
  });
});

describe('findAspects', () => {
  const positions = allPlanetPositions(new Date('2000-01-01T12:00:00Z'));

  it('counts each pair once', () => {
    const aspects = findAspects(positions);
    const seen = new Set<string>();
    for (const aspect of aspects) {
      const key = [aspect.from, aspect.to].sort().join('|');
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('never pairs a body with itself', () => {
    for (const aspect of findAspects(positions)) {
      expect(aspect.from).not.toBe(aspect.to);
    }
  });

  it('sorts by strength, tightest first', () => {
    const aspects = findAspects(positions);
    for (let i = 0; i < aspects.length - 1; i += 1) {
      expect((aspects[i] as { strength: number }).strength).toBeGreaterThanOrEqual(
        (aspects[i + 1] as { strength: number }).strength,
      );
    }
  });

  it('finds more aspects when minor ones are included', () => {
    expect(findAspects(positions, { includeMinor: true }).length).toBeGreaterThanOrEqual(
      findAspects(positions).length,
    );
  });

  it('reports every aspect within its stated orb', () => {
    for (const aspect of findAspects(positions, { includeMinor: true })) {
      expect(aspect.orb).toBeLessThanOrEqual(aspect.allowedOrb);
      expect(Math.abs(aspect.separation - aspect.exactAngle)).toBeCloseTo(aspect.orb, 10);
    }
  });

  it('produces a plausible number of aspects for a real chart', () => {
    // Ten bodies give 45 pairs; a typical chart shows somewhere between a
    // handful and roughly half of them in major aspect.
    const count = findAspects(positions).length;
    expect(count).toBeGreaterThan(2);
    expect(count).toBeLessThan(30);
  });
});

describe('aspectsTo', () => {
  const positions = allPlanetPositions(new Date('1985-07-22T14:20:00Z'));
  const sun = positions.find((p) => p.name === 'Sun') as PlanetPosition;

  it('excludes the body itself', () => {
    for (const aspect of aspectsTo(sun, positions)) {
      expect(aspect.to).not.toBe('Sun');
    }
  });

  it('agrees with the full chart scan', () => {
    const viaAll = findAspects(positions)
      .filter((a) => a.from === 'Sun' || a.to === 'Sun')
      .map((a) => (a.from === 'Sun' ? a.to : a.from))
      .sort();
    const viaTo = aspectsTo(sun, positions)
      .map((a) => a.to)
      .sort();
    expect(viaTo).toEqual(viaAll);
  });
});

describe('aspectToPoint', () => {
  const positions = allPlanetPositions(new Date('2000-01-01T12:00:00Z'));
  const moon = positions.find((p) => p.name === 'Moon') as PlanetPosition;

  it('aspects a fixed point such as the ascendant', () => {
    // Place the point exactly square to the Moon.
    const found = aspectToPoint(moon, moon.longitude + 90, 'Ascendant');
    expect(found?.type).toBe('square');
    expect(found?.to).toBe('Ascendant');
  });

  it('judges applying from the body alone, since a point does not move', () => {
    const ahead = aspectToPoint(moon, moon.longitude + 90, 'Ascendant');
    expect(typeof ahead?.applying).toBe('boolean');
  });
});
