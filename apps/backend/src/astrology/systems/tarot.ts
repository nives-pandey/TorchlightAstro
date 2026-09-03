/**
 * Torchlight — Tarot birth cards
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * Tarot birth cards — the Major Arcana derived from a birth date.
 *
 * Sum the digits of the full date, then reduce until the result is 22 or less.
 * That number names a card of the Major Arcana, and if it reduces further to a
 * second distinct card, both are read as a pair.
 *
 * Two details separate a correct implementation from a plausible one:
 *
 *   - The reduction stops at **22**, not at 9. Numerology reduces to a single
 *     digit; tarot does not, because the Major Arcana runs 0 to 21 with 22
 *     treated as The Fool. Reducing to a digit collapses fourteen distinct
 *     cards into nine and is the usual error.
 *   - A sum reducing to **19** yields three cards, not two: 19 → 10 → 1. The
 *     Sun, the Wheel of Fortune and the Magician. This is the only date family
 *     with a triple, and an implementation that assumes at most two cards drops
 *     the third silently.
 */

/** The Major Arcana, indexed 0 to 21. */
export const MAJOR_ARCANA: readonly string[] = [
  'The Fool',
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
] as const;

export interface TarotCard {
  /** 0-21. */
  number: number;
  name: string;
}

export interface TarotBirthCards {
  /** The raw digit sum before any reduction. */
  sum: number;
  /**
   * The cards, in reduction order. The first is the primary birth card; any
   * that follow are its reductions.
   */
  cards: TarotCard[];
  primary: TarotCard;
}

/** Names the card for a number, treating 22 as The Fool. */
function cardFor(value: number): TarotCard {
  // 22 wraps to 0: the Major Arcana has 22 cards numbered 0 to 21, and a sum
  // of exactly 22 is traditionally read as The Fool rather than as out of range.
  const number = value === 22 ? 0 : value;
  return { number, name: MAJOR_ARCANA[number] as string };
}

/**
 * The birth cards for a date.
 *
 * The chain continues while the value exceeds 21 or can still be reduced to a
 * different card, which is what produces the 19 → 10 → 1 triple.
 */
export function tarotBirthCards(year: number, month: number, day: number): TarotBirthCards {
  const digits = `${year}${month}${day}`
    .split('')
    .reduce((total, digit) => total + Number(digit), 0);

  const cards: TarotCard[] = [];
  let value = digits;

  // Reduce into range first: anything above 22 is not yet a card.
  while (value > 22) {
    value = String(value)
      .split('')
      .reduce((total, digit) => total + Number(digit), 0);
  }

  cards.push(cardFor(value));

  // Then continue reducing while a further, distinct card exists. A value of
  // 19 gives 10 and then 1; a value of 10 gives 1; a single digit gives none.
  while (value > 9) {
    value = String(value)
      .split('')
      .reduce((total, digit) => total + Number(digit), 0);
    cards.push(cardFor(value));
  }

  return {
    sum: digits,
    cards,
    primary: cards[0] as TarotCard,
  };
}
