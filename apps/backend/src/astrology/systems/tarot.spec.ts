/**
 * Torchlight — Tarot birth cards — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { MAJOR_ARCANA, tarotBirthCards } from './tarot';

/**
 * Birth cards are arithmetic, so there is no ephemeris to check against — but
 * the arithmetic has strict properties, and two of them separate a correct
 * implementation from a plausible one:
 *
 *   - Reduction stops at 22, not at 9. The Major Arcana runs 0 to 21, so
 *     reducing to a single digit collapses fourteen distinct cards into nine.
 *   - A sum reducing to 19 yields three cards, not two: The Sun, the Wheel of
 *     Fortune and the Magician. An implementation assuming at most two cards
 *     drops the third silently.
 */

describe('Major Arcana', () => {
  it('has twenty-two cards', () => {
    expect(MAJOR_ARCANA).toHaveLength(22);
  });

  it('opens with The Fool and closes with The World', () => {
    expect(MAJOR_ARCANA[0]).toBe('The Fool');
    expect(MAJOR_ARCANA[21]).toBe('The World');
  });

  it('names every card uniquely', () => {
    expect(new Set(MAJOR_ARCANA).size).toBe(22);
  });
});

describe('tarotBirthCards', () => {
  it('sums every digit of the date', () => {
    // 1900-01-08 → 1+9+0+0+0+1+0+8 = 19
    expect(tarotBirthCards(1900, 1, 8).sum).toBe(19);
  });

  it('produces the documented triple for a sum of nineteen', () => {
    // The only chain of three: 19 → 10 → 1.
    const result = tarotBirthCards(1900, 1, 8);
    expect(result.cards.map((card) => card.number)).toEqual([19, 10, 1]);
    expect(result.cards.map((card) => card.name)).toEqual([
      'The Sun',
      'Wheel of Fortune',
      'The Magician',
    ]);
  });

  it('always lands within the Major Arcana', () => {
    for (let year = 1900; year <= 2030; year += 1) {
      for (let month = 1; month <= 12; month += 1) {
        for (const day of [1, 9, 15, 22, 28]) {
          for (const card of tarotBirthCards(year, month, day).cards) {
            expect(card.number).toBeGreaterThanOrEqual(0);
            expect(card.number).toBeLessThanOrEqual(21);
            expect(card.name).toBe(MAJOR_ARCANA[card.number]);
          }
        }
      }
    }
  });

  it('never returns more than three cards', () => {
    for (let year = 1900; year <= 2030; year += 1) {
      for (let month = 1; month <= 12; month += 1) {
        for (const day of [1, 9, 15, 22, 28]) {
          const count = tarotBirthCards(year, month, day).cards.length;
          expect(count).toBeGreaterThanOrEqual(1);
          expect(count).toBeLessThanOrEqual(3);
        }
      }
    }
  });

  it('reduces each card from the one before it', () => {
    for (let year = 1950; year <= 2020; year += 3) {
      const result = tarotBirthCards(year, 7, 22);
      for (let i = 0; i < result.cards.length - 1; i += 1) {
        const from = result.cards[i]?.number as number;
        const to = result.cards[i + 1]?.number as number;
        const digitSum = String(from)
          .split('')
          .reduce((sum, digit) => sum + Number(digit), 0);
        expect(to).toBe(digitSum);
      }
    }
  });

  it('stops reducing at a single digit', () => {
    for (let year = 1900; year <= 2030; year += 7) {
      const cards = tarotBirthCards(year, 3, 15).cards;
      const last = cards[cards.length - 1]?.number as number;
      expect(last).toBeLessThanOrEqual(9);
    }
  });

  it('names the first card as primary', () => {
    const result = tarotBirthCards(1985, 7, 22);
    expect(result.primary).toEqual(result.cards[0]);
  });

  it('reads a sum of exactly twenty-two as The Fool', () => {
    // 22 wraps to 0 rather than falling out of range, which is the traditional
    // reading and the reason the arcana is indexed from zero.
    // 1999-12-01 → 1+9+9+9+1+2+0+1 = 32 → 5. Search for a genuine 22 instead.
    let found = false;
    for (let year = 1900; year <= 2030 && !found; year += 1) {
      for (let month = 1; month <= 12 && !found; month += 1) {
        for (let day = 1; day <= 28 && !found; day += 1) {
          const result = tarotBirthCards(year, month, day);
          const reducedToTwentyTwo =
            result.sum === 22 || (result.sum > 22 && result.primary.number === 0);
          if (result.sum === 22) {
            expect(result.primary.name).toBe('The Fool');
            found = true;
          } else if (reducedToTwentyTwo) {
            found = true;
          }
        }
      }
    }
    expect(found).toBe(true);
  });

  it('is deterministic', () => {
    const first = tarotBirthCards(1985, 7, 22);
    const second = tarotBirthCards(1985, 7, 22);
    expect(second).toEqual(first);
  });
});
