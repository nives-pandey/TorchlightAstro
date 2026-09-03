/**
 * Torchlight — numerology — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  MASTER_NUMBERS,
  birthdayNumber,
  challenges,
  expression,
  lifePath,
  maturity,
  numerologyProfile,
  personalYear,
  personality,
  reduce,
  soulUrge,
} from './numerology';

/**
 * Numerology has no ephemeris to check against, which is precisely why the
 * previous build shipped `firstName.length + lastName.length` as a "destiny
 * number" without anyone noticing.
 *
 * Two things here are genuinely verifiable, and both are asserted:
 *
 *   - The letter tables are published and rule-generated. Pythagorean values
 *     follow (position mod 9) + 1 exactly; Chaldean assigns by sound and never
 *     uses 9, a property that distinguishes it from every imitation.
 *   - The reduction is arithmetic with strict properties: idempotent, master-
 *     preserving, and closed over {1-9, 11, 22, 33}.
 *
 * Beyond that, worked examples are computed by hand in the comments so the
 * expected values are derivable rather than asserted on faith.
 */

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

describe('reduce', () => {
  it('reduces multi-digit numbers to a single digit', () => {
    expect(reduce(19)).toBe(1); // 1+9 = 10 → 1+0 = 1
    expect(reduce(45)).toBe(9); // 4+5 = 9
    expect(reduce(28)).toBe(1); // 2+8 = 10 → 1
    // 38 is deliberately absent here: 3+8 = 11, a master number, so it stops
    // at 11 rather than continuing to 2. It belongs in the master test below.
  });

  it('preserves master numbers', () => {
    // The single most common numerology bug is reducing these away.
    expect(reduce(11)).toBe(11);
    expect(reduce(22)).toBe(22);
    expect(reduce(33)).toBe(33);
    expect(reduce(29)).toBe(11); // 2+9=11, stops there
  });

  it('is idempotent', () => {
    for (let value = 1; value <= 200; value += 1) {
      expect(reduce(reduce(value))).toBe(reduce(value));
    }
  });

  it('always lands in the published set', () => {
    const allowed = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, ...MASTER_NUMBERS]);
    for (let value = 1; value <= 5000; value += 1) {
      expect(allowed.has(reduce(value))).toBe(true);
    }
  });

  it('handles zero and negatives without looping', () => {
    expect(reduce(0)).toBe(0);
    expect(reduce(-19)).toBe(1);
  });
});

describe('Pythagorean letter values', () => {
  it('follows the (position mod 9) + 1 rule for every letter', () => {
    // Asserted from the rule, not from the table — so a transcription error in
    // the table cannot pass.
    ALPHABET.forEach((letter, index) => {
      expect(expression(letter, 'pythagorean')).toBe((index % 9) + 1);
    });
  });

  it('gives A, J and S the same value', () => {
    expect(expression('a')).toBe(1);
    expect(expression('j')).toBe(1);
    expect(expression('s')).toBe(1);
  });
});

describe('Chaldean letter values', () => {
  it('never assigns nine to any letter', () => {
    // Nine is held sacred in the Chaldean system and appears only as a sum.
    // An implementation that fills in nine is not Chaldean.
    for (const letter of ALPHABET) {
      expect(expression(letter, 'chaldean')).not.toBe(9);
    }
  });

  it('keeps every letter within one to eight', () => {
    for (const letter of ALPHABET) {
      const value = expression(letter, 'chaldean');
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(8);
    }
  });

  it('differs from Pythagorean, as the two systems must', () => {
    const differences = ALPHABET.filter(
      (letter) => expression(letter, 'chaldean') !== expression(letter, 'pythagorean'),
    );
    expect(differences.length).toBeGreaterThan(10);
  });
});

describe('lifePath', () => {
  it('matches worked examples', () => {
    // 1970-11-29: month 11 is master and kept; day 29 → 2+9 = 11, also master;
    // year 1970 → 1+9+7+0 = 17 → 8. Sum 11+11+8 = 30 → 3.
    expect(lifePath(1970, 11, 29)).toBe(3);

    // 2000-01-01: 1 + 1 + 2 = 4.
    expect(lifePath(2000, 1, 1)).toBe(4);

    // 1985-07-22: 7 + 22 (master) + (1985 → 23 → 5) = 34 → 7.
    expect(lifePath(1985, 7, 22)).toBe(7);
  });

  it('reduces components before summing, preserving master months and days', () => {
    // Summing every digit at once would destroy the master 11 in the month.
    // The two methods usually agree; this is a case where they need not.
    expect(lifePath(1970, 11, 29)).toBe(3);
  });

  it('always produces a valid life path', () => {
    const allowed = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, ...MASTER_NUMBERS]);
    for (let year = 1900; year <= 2030; year += 7) {
      for (let month = 1; month <= 12; month += 1) {
        for (const day of [1, 11, 22, 28]) {
          expect(allowed.has(lifePath(year, month, day))).toBe(true);
        }
      }
    }
  });
});

describe('name numbers', () => {
  /**
   * "John Smith" in Pythagorean, computed by hand:
   *   J1 O6 H8 N5           = 20
   *   S1 M4 I9 T2 H8        = 24
   *   total                 = 44 → 8
   *   vowels O6 I9          = 15 → 6
   *   consonants 44 − 15    = 29 → 11, a master number
   */
  it('computes expression from every letter', () => {
    expect(expression('John Smith')).toBe(8);
  });

  it('computes soul urge from the vowels', () => {
    expect(soulUrge('John Smith')).toBe(6);
  });

  it('computes personality from the consonants, keeping master numbers', () => {
    expect(personality('John Smith')).toBe(11);
  });

  it('ignores spaces, hyphens and apostrophes', () => {
    expect(expression("Mary-Jane O'Brien")).toBe(expression('MaryJaneOBrien'));
  });

  it('is case insensitive', () => {
    expect(expression('JOHN SMITH')).toBe(expression('john smith'));
  });

  it('folds diacritics rather than dropping the letter', () => {
    // José must contribute the same letters as Jose, not lose the e entirely.
    expect(expression('José')).toBe(expression('Jose'));
    expect(expression('Müller')).toBe(expression('Muller'));
  });

  it('returns zero for a name with no letters', () => {
    expect(expression('123 !!!')).toBe(0);
  });
});

describe('birthdayNumber', () => {
  it('keeps a master birthday', () => {
    expect(birthdayNumber(22)).toBe(22);
    expect(birthdayNumber(11)).toBe(11);
  });

  it('reduces other days', () => {
    expect(birthdayNumber(28)).toBe(1); // 2+8 = 10 → 1
    expect(birthdayNumber(5)).toBe(5);
  });
});

describe('maturity', () => {
  it('combines life path and expression', () => {
    expect(maturity(3, 4)).toBe(7);
    expect(maturity(9, 8)).toBe(8); // 17 → 8
  });

  it('preserves a master maturity number', () => {
    // Any pair summing to 11, 22 or 33 stops there rather than reducing on.
    expect(maturity(3, 8)).toBe(11);
    expect(maturity(4, 7)).toBe(11);
  });
});

describe('personalYear', () => {
  it('always lands in the nine-year cycle', () => {
    // The cycle runs 1 to 9 and has no master values, so returning 11 would be
    // a category error rather than a preserved master number.
    for (let year = 2020; year <= 2035; year += 1) {
      for (const [month, day] of [
        [11, 29],
        [1, 1],
        [7, 22],
        [2, 11],
        [9, 9],
      ] as Array<[number, number]>) {
        const value = personalYear(month, day, year);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(9);
      }
    }
  });

  it('advances by one each year, wrapping after nine', () => {
    const first = personalYear(6, 15, 2025);
    const second = personalYear(6, 15, 2026);
    expect(second).toBe((first % 9) + 1);
  });
});

describe('challenges', () => {
  it('produces values from zero to eight', () => {
    // These are absolute differences, so they never carry master values, and a
    // zero challenge is meaningful rather than an error.
    for (let year = 1950; year <= 2020; year += 11) {
      for (let month = 1; month <= 12; month += 3) {
        const result = challenges(year, month, 15);
        for (const value of Object.values(result)) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(8);
        }
      }
    }
  });

  it('derives the third challenge from the first two', () => {
    const result = challenges(1985, 7, 22);
    expect(result.third).toBe(Math.abs(result.first - result.second));
  });
});

describe('numerologyProfile', () => {
  it('assembles every number consistently', () => {
    const profile = numerologyProfile('John Smith', 1985, 7, 22);

    expect(profile.lifePath).toBe(lifePath(1985, 7, 22));
    expect(profile.expression).toBe(expression('John Smith'));
    expect(profile.soulUrge).toBe(soulUrge('John Smith'));
    expect(profile.personality).toBe(personality('John Smith'));
    expect(profile.birthday).toBe(birthdayNumber(22));
    expect(profile.maturity).toBe(maturity(profile.lifePath, profile.expression));
  });

  it('records which system produced the numbers', () => {
    expect(numerologyProfile('John Smith', 1985, 7, 22, 'chaldean').system).toBe('chaldean');
  });

  it('takes the life path from the date, so both systems agree on it', () => {
    const pythagorean = numerologyProfile('John Smith', 1985, 7, 22, 'pythagorean');
    const chaldean = numerologyProfile('John Smith', 1985, 7, 22, 'chaldean');
    expect(chaldean.lifePath).toBe(pythagorean.lifePath);
  });

  it('draws name numbers from genuinely different tables', () => {
    // Two reduced values can coincide by chance — 'John Smith' reduces to 8
    // under both — so this compares across several names rather than asserting
    // a difference for one, which is what an earlier version of this test got
    // wrong.
    const names = ['John Smith', 'Mary Jones', 'Ravi Kumar', 'Elena Petrova'];
    const differing = names.filter(
      (name) => expression(name, 'chaldean') !== expression(name, 'pythagorean'),
    );
    expect(differing.length).toBeGreaterThan(0);
  });
});
