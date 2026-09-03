/**
 * Torchlight — Vedic divisional charts — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { VARGA_DIVISIONS, VARGA_SIGNIFICATIONS, VARGA_TYPES, allVargas, vargaOf } from './varga';

/**
 * Divisional charts have no external reference implementation to compare
 * against — Swiss Ephemeris does not compute them, and the JavaScript Vedic
 * libraries surveyed do not either.
 *
 * So correctness is established a different way: by asserting the structural
 * properties the tradition itself defines. A wrong starting rule produces a
 * chart that is internally consistent and completely wrong, and only these
 * properties can catch that. For example, Parashara states that the first
 * navamsa of a movable sign is that sign itself, of a fixed sign the ninth from
 * it, and of a dual sign the fifth — a claim entirely independent of how the
 * division is coded here.
 */

/** Sign abbreviations, for readable failures. */
const SIGNS = ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];

const MOVABLE = 0;
const FIXED = 1;

describe('varga tables', () => {
  it('declares a division count and meaning for every type', () => {
    for (const varga of VARGA_TYPES) {
      expect(VARGA_DIVISIONS[varga]).toBeGreaterThan(0);
      expect(VARGA_SIGNIFICATIONS[varga]).toBeTruthy();
    }
  });

  it('names each varga for its own division count', () => {
    // D9 must divide into nine parts, D30 into thirty, and so on.
    for (const varga of VARGA_TYPES) {
      expect(VARGA_DIVISIONS[varga]).toBe(Number(varga.slice(1)));
    }
  });
});

describe('universal invariants', () => {
  it('always returns a valid sign', () => {
    for (const varga of VARGA_TYPES) {
      for (let longitude = 0; longitude < 360; longitude += 0.7) {
        const result = vargaOf(longitude, varga);
        expect(result.signIndex).toBeGreaterThanOrEqual(1);
        expect(result.signIndex).toBeLessThanOrEqual(12);
        expect(result.signName).toBeTruthy();
      }
    }
  });

  it('reports a division within the varga range', () => {
    for (const varga of VARGA_TYPES) {
      for (let longitude = 0; longitude < 360; longitude += 3.1) {
        const { division } = vargaOf(longitude, varga);
        expect(division).toBeGreaterThanOrEqual(1);
        expect(division).toBeLessThanOrEqual(VARGA_DIVISIONS[varga]);
      }
    }
  });

  it('normalises longitudes outside 0-360', () => {
    expect(vargaOf(360, 'D9').signIndex).toBe(vargaOf(0, 'D9').signIndex);
    expect(vargaOf(-30, 'D9').signIndex).toBe(vargaOf(330, 'D9').signIndex);
  });

  it('is stable within a division and changes at its boundary', () => {
    // A D9 division is 3°20′ wide.
    const width = 30 / 9;
    expect(vargaOf(width * 0.1, 'D9').signIndex).toBe(vargaOf(width * 0.9, 'D9').signIndex);
    expect(vargaOf(width - 0.001, 'D9').signIndex).not.toBe(vargaOf(width + 0.001, 'D9').signIndex);
  });
});

describe('D1 — the birth chart', () => {
  it('is the identity mapping', () => {
    for (let sign = 0; sign < 12; sign += 1) {
      expect(vargaOf(sign * 30 + 15, 'D1').signIndex).toBe(sign + 1);
    }
  });
});

describe('D9 — Navamsa', () => {
  /**
   * The rule this asserts is Parashara's, not this implementation's: the first
   * navamsa of a movable sign is that sign, of a fixed sign the ninth from it,
   * and of a dual sign the fifth from it.
   */
  it('starts each sign at the traditional navamsa', () => {
    for (let sign = 0; sign < 12; sign += 1) {
      const quality = sign % 3;
      const offset = quality === MOVABLE ? 0 : quality === FIXED ? 8 : 4;
      const expected = ((sign + offset) % 12) + 1;

      const actual = vargaOf(sign * 30 + 0.5, 'D9').signIndex;
      expect({ sign: SIGNS[sign], navamsa: SIGNS[actual - 1] }).toEqual({
        sign: SIGNS[sign],
        navamsa: SIGNS[expected - 1],
      });
    }
  });

  it('runs Aries from Aries through to Sagittarius', () => {
    // Nine consecutive navamsas starting at the sign itself.
    for (let part = 0; part < 9; part += 1) {
      const longitude = (part + 0.5) * (30 / 9);
      expect(vargaOf(longitude, 'D9').signIndex).toBe(part + 1);
    }
  });

  it('matches the continuous 108-navamsa form', () => {
    // The whole zodiac holds 108 navamsas running consecutively from Aries.
    // Two independent statements of the same rule must agree everywhere.
    for (let longitude = 0; longitude < 360; longitude += 0.37) {
      const continuous = (Math.floor(longitude / (30 / 9)) % 12) + 1;
      expect(vargaOf(longitude, 'D9').signIndex).toBe(continuous);
    }
  });
});

describe('D2 — Hora', () => {
  it('only ever lands in Cancer or Leo', () => {
    // The two halves belong to the Moon and the Sun, and to no one else.
    for (let longitude = 0; longitude < 360; longitude += 0.5) {
      expect([4, 5]).toContain(vargaOf(longitude, 'D2').signIndex);
    }
  });

  it('gives the first half of an odd sign to the Sun', () => {
    expect(vargaOf(10, 'D2').signIndex).toBe(5); // Aries first half → Leo
    expect(vargaOf(20, 'D2').signIndex).toBe(4); // Aries second half → Cancer
  });

  it('reverses the order in an even sign', () => {
    expect(vargaOf(40, 'D2').signIndex).toBe(4); // Taurus first half → Cancer
    expect(vargaOf(50, 'D2').signIndex).toBe(5); // Taurus second half → Leo
  });
});

describe('D3 — Drekkana', () => {
  it('steps through the trine from the natal sign', () => {
    // First third the sign itself, second the fifth from it, third the ninth.
    expect(vargaOf(5, 'D3').signIndex).toBe(1); // Aries
    expect(vargaOf(15, 'D3').signIndex).toBe(5); // Leo
    expect(vargaOf(25, 'D3').signIndex).toBe(9); // Sagittarius
  });

  it('keeps every drekkana in the same element as its natal sign', () => {
    // A defining property: the trine from any sign shares its element.
    for (let longitude = 0; longitude < 360; longitude += 1.3) {
      const natal = Math.floor(longitude / 30) % 4;
      const derived = (vargaOf(longitude, 'D3').signIndex - 1) % 4;
      expect(derived).toBe(natal);
    }
  });
});

describe('D30 — Trimsamsa', () => {
  /**
   * The only varga with unequal divisions, and the only one whose result is a
   * planet's own sign rather than a counted offset.
   */
  it('follows the traditional ranges in an odd sign', () => {
    // Aries: Mars 0-5, Saturn 5-10, Jupiter 10-18, Mercury 18-25, Venus 25-30.
    const expected: Array<[number, string]> = [
      [2, 'Ar'],
      [7, 'Aq'],
      [14, 'Sg'],
      [21, 'Ge'],
      [28, 'Li'],
    ];
    for (const [degree, sign] of expected) {
      expect(SIGNS[vargaOf(degree, 'D30').signIndex - 1]).toBe(sign);
    }
  });

  it('follows the reversed ranges in an even sign', () => {
    // Taurus: Venus 0-5, Mercury 5-12, Jupiter 12-20, Saturn 20-25, Mars 25-30.
    const expected: Array<[number, string]> = [
      [2, 'Ta'],
      [8, 'Vi'],
      [16, 'Pi'],
      [22, 'Cp'],
      [28, 'Sc'],
    ];
    for (const [degree, sign] of expected) {
      expect(SIGNS[vargaOf(30 + degree, 'D30').signIndex - 1]).toBe(sign);
    }
  });

  it('never lands in Cancer or Leo', () => {
    // Only the five non-luminary planets own trimsamsas, so the Moon's and
    // Sun's signs can never appear. A strong check on the whole rule.
    for (let longitude = 0; longitude < 360; longitude += 0.31) {
      const index = vargaOf(longitude, 'D30').signIndex;
      expect(index).not.toBe(4);
      expect(index).not.toBe(5);
    }
  });
});

describe('D10 — Dasamsa', () => {
  it('counts from the sign itself in an odd sign', () => {
    expect(vargaOf(1, 'D10').signIndex).toBe(1); // Aries first dasamsa → Aries
  });

  it('counts from the ninth in an even sign', () => {
    // Taurus (index 1) + 8 = Capricorn (index 9).
    expect(vargaOf(31, 'D10').signIndex).toBe(10);
  });
});

describe('allVargas', () => {
  it('returns every declared varga', () => {
    const result = allVargas(123.456);
    for (const varga of VARGA_TYPES) {
      expect(result[varga]).toBeDefined();
      expect(result[varga].varga).toBe(varga);
    }
  });

  it('agrees with computing each varga singly', () => {
    const longitude = 200.75;
    const all = allVargas(longitude);
    for (const varga of VARGA_TYPES) {
      expect(all[varga]).toEqual(vargaOf(longitude, varga));
    }
  });
});
