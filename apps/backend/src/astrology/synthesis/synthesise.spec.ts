/**
 * Torchlight — cross-system synthesis — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { mapChinese, mapHumanDesign, mapNumerology, mapVedic, mapWestern } from './mappings';
import { describeDimension, synthesise } from './synthesise';
import { TRAIT_DIMENSIONS, reading, type TraitReading } from './traits';

/**
 * The synthesis layer has no external reference and never could — no tradition
 * was built to be compared with another, so there is no authority to check a
 * cross-system reading against.
 *
 * What can be verified is that the machinery behaves correctly given its
 * inputs, and two properties matter more than the rest:
 *
 *   - **Order independence.** The same person must produce the same reading
 *     regardless of which system happened to be computed first. This failed on
 *     the first implementation: floating-point addition is not associative, and
 *     one real chart gave 0.03333333333333335 against 0.033333333333333326
 *     depending on summation order. Invisible when displayed, but a value
 *     sitting on an agreement threshold would classify differently, so the same
 *     person would get two different readings.
 *   - **Disagreement survives.** Five systems averaged into one number destroys
 *     the only thing this layer exists to surface. An evenly split dimension
 *     and a uniformly neutral one produce the same consensus and must never be
 *     described the same way.
 */

function chart(): TraitReading[] {
  return [
    ...mapWestern(5, 'Leo'),
    ...mapVedic(3, 'Mithuna', 'Mercury'),
    ...mapChinese('Water', false, 'Gui'),
    ...mapNumerology(7),
    ...mapHumanDesign(2, 4),
  ];
}

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

describe('order independence', () => {
  it('gives an identical result however the readings are ordered', () => {
    const readings = chart();
    const baseline = JSON.stringify(synthesise(readings));

    for (let attempt = 0; attempt < 40; attempt += 1) {
      expect(JSON.stringify(synthesise(shuffle(readings)))).toBe(baseline);
    }
  });

  it('holds across many different charts', () => {
    for (let sign = 1; sign <= 12; sign += 1) {
      for (const lifePath of [1, 4, 7, 11, 22]) {
        const readings = [
          ...mapWestern(sign, 'Sign'),
          ...mapVedic(sign, 'Rashi', 'Saturn'),
          ...mapChinese('Metal', sign % 2 === 1, 'Geng'),
          ...mapNumerology(lifePath),
        ];
        const baseline = JSON.stringify(synthesise(readings));
        expect(JSON.stringify(synthesise(shuffle(readings)))).toBe(baseline);
      }
    }
  });
});

describe('disagreement is preserved', () => {
  it('distinguishes a split from a genuine middle', () => {
    // Both average to zero. They mean entirely different things.
    const neutral = [
      reading('a', 'stability', 0, 'strong', 'x'),
      reading('b', 'stability', 0, 'strong', 'y'),
      reading('c', 'stability', 0, 'strong', 'z'),
    ];
    const split = [
      reading('a', 'stability', 0.9, 'strong', 'x'),
      reading('b', 'stability', -0.9, 'strong', 'y'),
    ];

    const neutralResult = synthesise(neutral).dimensions[0];
    const splitResult = synthesise(split).dimensions[0];

    expect(neutralResult?.consensus).toBeCloseTo(splitResult?.consensus as number, 10);
    expect(neutralResult?.agreement).not.toBe(splitResult?.agreement);
    expect(neutralResult?.spread).toBeLessThan(splitResult?.spread as number);
  });

  it('reports a split as a tension and a middle as none', () => {
    const split = [
      reading('a', 'stability', 0.9, 'strong', 'x'),
      reading('b', 'stability', -0.9, 'strong', 'y'),
    ];
    const neutral = [
      reading('a', 'stability', 0, 'strong', 'x'),
      reading('b', 'stability', 0, 'strong', 'y'),
    ];

    expect(synthesise(split).tensions).toHaveLength(1);
    expect(synthesise(neutral).tensions).toHaveLength(0);
  });

  it('names both sides of a tension', () => {
    const split = [
      reading('western', 'expression', 0.8, 'strong', 'x'),
      reading('chinese', 'expression', -0.8, 'strong', 'y'),
    ];
    const tension = synthesise(split).tensions[0];

    expect(tension?.oneSide.systems).toEqual(['western']);
    expect(tension?.otherSide.systems).toEqual(['chinese']);
    expect(tension?.oneSide.pole).not.toBe(tension?.otherSide.pole);
  });

  it('orders tensions by how sharp they are', () => {
    const readings = [
      reading('a', 'stability', 0.9, 'strong', 'x'),
      reading('b', 'stability', -0.9, 'strong', 'y'),
      reading('a', 'relation', 0.3, 'strong', 'x'),
      reading('b', 'relation', -0.3, 'strong', 'y'),
    ];
    const tensions = synthesise(readings).tensions;

    expect(tensions).toHaveLength(2);
    expect(tensions[0]?.intensity).toBeGreaterThan(tensions[1]?.intensity as number);
  });
});

describe('consensus', () => {
  it('weights by confidence', () => {
    // A strong reading must outweigh an indicative one pulling the other way.
    const readings = [
      reading('a', 'expression', 1, 'strong', 'x'),
      reading('b', 'expression', -1, 'indicative', 'y'),
    ];
    expect(synthesise(readings).dimensions[0]?.consensus).toBeGreaterThan(0);
  });

  it('lets a strong reading outweigh two indicative ones', () => {
    // The confidence gaps are deliberately wide so this holds.
    const readings = [
      reading('a', 'expression', 1, 'strong', 'x'),
      reading('b', 'expression', -1, 'indicative', 'y'),
      reading('c', 'expression', -1, 'indicative', 'z'),
    ];
    expect(synthesise(readings).dimensions[0]?.consensus).toBeGreaterThan(0);
  });

  it('stays within range for any input', () => {
    for (let sign = 1; sign <= 12; sign += 1) {
      for (const element of ['Wood', 'Fire', 'Earth', 'Metal', 'Water']) {
        const result = synthesise([
          ...mapWestern(sign, 'Sign'),
          ...mapVedic(sign, 'Rashi', 'Venus'),
          ...mapChinese(element, true, 'Stem'),
        ]);
        for (const dimension of result.dimensions) {
          expect(dimension.consensus).toBeGreaterThanOrEqual(-1);
          expect(dimension.consensus).toBeLessThanOrEqual(1);
          expect(dimension.spread).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});

describe('agreement classification', () => {
  it('calls tight agreement converged', () => {
    const readings = [
      reading('a', 'expression', 0.7, 'strong', 'x'),
      reading('b', 'expression', 0.75, 'strong', 'y'),
      reading('c', 'expression', 0.8, 'strong', 'z'),
    ];
    expect(synthesise(readings).dimensions[0]?.agreement).toBe('converged');
  });

  it('calls same-direction but scattered agreement aligned', () => {
    const readings = [
      reading('a', 'expression', 0.2, 'strong', 'x'),
      reading('b', 'expression', 0.9, 'strong', 'y'),
    ];
    expect(synthesise(readings).dimensions[0]?.agreement).toBe('aligned');
  });

  it('calls a sharp split divided', () => {
    const readings = [
      reading('a', 'expression', 0.9, 'strong', 'x'),
      reading('b', 'expression', -0.9, 'strong', 'y'),
    ];
    expect(synthesise(readings).dimensions[0]?.agreement).toBe('divided');
  });

  it('treats near-zero readings as abstaining rather than taking a side', () => {
    // A value of 0.05 is not a weak vote for the high pole; it is no vote.
    const readings = [
      reading('a', 'expression', 0.8, 'strong', 'x'),
      reading('b', 'expression', 0.05, 'strong', 'y'),
    ];
    const result = synthesise(readings).dimensions[0];
    expect(result?.opposing).toHaveLength(0);
    expect(result?.supporting).toEqual(['a']);
  });
});

describe('traceability', () => {
  it('keeps every contributing reading', () => {
    const result = synthesise(chart());
    for (const dimension of result.dimensions) {
      expect(dimension.readings.length).toBeGreaterThan(0);
      for (const item of dimension.readings) {
        expect(item.source).toBeTruthy();
        expect(item.system).toBeTruthy();
      }
    }
  });

  it('lists the contributing systems', () => {
    const result = synthesise(chart());
    expect(result.systems).toContain('western');
    expect(result.systems).toContain('vedic');
    expect(result.systems).toContain('chinese');
    expect(result.systems).toEqual([...result.systems].sort());
  });

  it('covers every dimension a real chart touches', () => {
    const result = synthesise(chart());
    const covered = new Set(result.dimensions.map((d) => d.dimension));
    for (const dimension of TRAIT_DIMENSIONS) {
      expect(covered.has(dimension)).toBe(true);
    }
  });
});

describe('edge cases', () => {
  it('handles no readings at all', () => {
    const result = synthesise([]);
    expect(result.dimensions).toHaveLength(0);
    expect(result.tensions).toHaveLength(0);
    expect(result.systems).toHaveLength(0);
  });

  it('handles a single system', () => {
    const result = synthesise(mapWestern(1, 'Aries'));
    expect(result.systems).toEqual(['western']);
    // One system cannot agree or disagree with anything.
    expect(result.tensions).toHaveLength(0);
    expect(result.dimensions[0]?.spread).toBe(0);
  });

  it('omits dimensions no system spoke to', () => {
    // Human Design maps only two dimensions, so the rest must be absent
    // rather than present with an invented value.
    const result = synthesise(mapHumanDesign(1, 4));
    expect(result.dimensions).toHaveLength(2);
  });
});

describe('describeDimension', () => {
  it('names both sides when the traditions conflict', () => {
    const result = synthesise([
      reading('western', 'expression', 0.9, 'strong', 'x'),
      reading('chinese', 'expression', -0.9, 'strong', 'y'),
    ]);
    const text = describeDimension(result.dimensions[0] as never);

    expect(text).toContain('western');
    expect(text).toContain('chinese');
    expect(text).toContain('while');
  });

  it('states agreement plainly when they concur', () => {
    const result = synthesise([
      reading('western', 'expression', 0.8, 'strong', 'x'),
      reading('vedic', 'expression', 0.85, 'strong', 'y'),
    ]);
    expect(describeDimension(result.dimensions[0] as never)).toContain('agree');
  });

  it('says the middle is the middle rather than picking a side', () => {
    const result = synthesise([
      reading('western', 'expression', 0.02, 'strong', 'x'),
      reading('vedic', 'expression', -0.02, 'strong', 'y'),
    ]);
    expect(describeDimension(result.dimensions[0] as never)).toContain('middle');
  });
});
