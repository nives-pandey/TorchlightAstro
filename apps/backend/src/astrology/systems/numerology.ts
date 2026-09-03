/**
 * Torchlight — numerology
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * Numerology — deriving numbers from a name and a birth date.
 *
 * No astronomy is involved, which makes this the one system in the engine with
 * no ephemeris to check against. It is also, for exactly that reason, the one
 * most often implemented carelessly: the previous build derived the "destiny
 * number" from `firstName.length + lastName.length`, which is the length of a
 * string and not numerology at all.
 *
 * Correctness here rests on two things that *are* checkable:
 *
 *   - The reduction rules are arithmetic with strict properties. A correct
 *     reduction is idempotent, preserves master numbers, and always lands in
 *     the published set {1-9, 11, 22, 33}.
 *   - The letter mappings are published tables. Pythagorean assigns A-I to 1-9
 *     and repeats; Chaldean assigns by sound and famously omits 9. Both are
 *     implemented so a reading can state which it used rather than leaving the
 *     reader to guess.
 */

/**
 * Master numbers are never reduced further.
 *
 * This is the single most common numerology bug: reducing 11 to 2 or 22 to 4
 * destroys the distinction the whole system rests on. 33 is treated as a master
 * number here, which is the mainstream modern convention, though some older
 * schools recognise only 11 and 22.
 */
export const MASTER_NUMBERS: readonly number[] = [11, 22, 33] as const;

/**
 * Pythagorean letter values — A=1 through I=9, then repeating.
 *
 * The dominant Western system, and the default here.
 */
const PYTHAGOREAN: Readonly<Record<string, number>> = {
  a: 1,
  j: 1,
  s: 1,
  b: 2,
  k: 2,
  t: 2,
  c: 3,
  l: 3,
  u: 3,
  d: 4,
  m: 4,
  v: 4,
  e: 5,
  n: 5,
  w: 5,
  f: 6,
  o: 6,
  x: 6,
  g: 7,
  p: 7,
  y: 7,
  h: 8,
  q: 8,
  z: 8,
  i: 9,
  r: 9,
};

/**
 * Chaldean letter values, assigned by sound rather than alphabetical position.
 *
 * Nine is deliberately absent from the mapping: in the Chaldean system nine is
 * held sacred and never assigned to a letter, appearing only as a sum. An
 * implementation that "fills in" nine is not Chaldean.
 */
const CHALDEAN: Readonly<Record<string, number>> = {
  a: 1,
  i: 1,
  j: 1,
  q: 1,
  y: 1,
  b: 2,
  k: 2,
  r: 2,
  c: 3,
  g: 3,
  l: 3,
  s: 3,
  d: 4,
  m: 4,
  t: 4,
  e: 5,
  h: 5,
  n: 5,
  x: 5,
  u: 6,
  v: 6,
  w: 6,
  o: 7,
  z: 7,
  f: 8,
  p: 8,
};

export type NumerologySystem = 'pythagorean' | 'chaldean';

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

/**
 * Reduces a number to a single digit, stopping at any master number.
 *
 * The stop condition is checked *before* each reduction step and again on the
 * result, so a sum of 29 reduces to 11 and stays there rather than continuing
 * to 2.
 */
export function reduce(value: number): number {
  let current = Math.abs(Math.trunc(value));

  while (current > 9 && !MASTER_NUMBERS.includes(current)) {
    let sum = 0;
    let remaining = current;
    while (remaining > 0) {
      sum += remaining % 10;
      remaining = Math.floor(remaining / 10);
    }
    current = sum;
  }

  return current;
}

/**
 * Normalises a name for numerological use.
 *
 * Diacritics are folded rather than dropped, so José contributes the same
 * letters as Jose. Anything that is not a letter after folding — spaces,
 * hyphens, apostrophes — carries no value in either system and is removed.
 */
function lettersOf(name: string): string[] {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .split('');
}

/** Sums a name's letters under the chosen table, without reducing. */
function rawNameSum(
  name: string,
  system: NumerologySystem,
  filter: (letter: string) => boolean = () => true,
): number {
  const table = system === 'chaldean' ? CHALDEAN : PYTHAGOREAN;
  return lettersOf(name)
    .filter(filter)
    .reduce((sum, letter) => sum + (table[letter] ?? 0), 0);
}

/**
 * Life Path — from the birth date. The single most important number.
 *
 * Month, day and year are each reduced *before* being summed, rather than
 * summing every digit at once. The two methods usually agree but not always,
 * and the component-wise method is the one that preserves master numbers
 * correctly: 1970-11-29 has a master 11 month that digit-summing would destroy.
 */
export function lifePath(year: number, month: number, day: number): number {
  return reduce(reduce(month) + reduce(day) + reduce(year));
}

/** Expression (Destiny) — from every letter of the full birth name. */
export function expression(fullName: string, system: NumerologySystem = 'pythagorean'): number {
  return reduce(rawNameSum(fullName, system));
}

/** Soul Urge (Heart's Desire) — from the vowels alone. */
export function soulUrge(fullName: string, system: NumerologySystem = 'pythagorean'): number {
  return reduce(rawNameSum(fullName, system, (letter) => VOWELS.has(letter)));
}

/** Personality — from the consonants alone. */
export function personality(fullName: string, system: NumerologySystem = 'pythagorean'): number {
  return reduce(rawNameSum(fullName, system, (letter) => !VOWELS.has(letter)));
}

/**
 * Birthday number — the day of the month, reduced.
 *
 * Unlike the others this keeps master numbers from the raw day, so someone born
 * on the 22nd has a birthday number of 22.
 */
export function birthdayNumber(day: number): number {
  return reduce(day);
}

/**
 * Maturity — the life path and expression combined.
 *
 * Read as what a life orients toward in its second half.
 */
export function maturity(life: number, expr: number): number {
  return reduce(life + expr);
}

/**
 * Personal Year — where someone sits in a nine-year cycle.
 *
 * Takes the *current* year with the birth month and day. Master numbers are
 * deliberately reduced here: the personal year cycle runs 1 to 9 and has no
 * master values, so returning 11 would be a category error.
 */
export function personalYear(birthMonth: number, birthDay: number, currentYear: number): number {
  const value = reduce(reduce(birthMonth) + reduce(birthDay) + reduce(currentYear));

  // Master numbers do not belong to this cycle, so reduce them the rest of the
  // way: 11 to 2, 22 to 4, 33 to 6.
  if (!MASTER_NUMBERS.includes(value)) return value;

  const digits = String(value)
    .split('')
    .reduce((sum, digit) => sum + Number(digit), 0);
  return digits;
}

/**
 * Challenge numbers — the four obstacles of a life, from date differences.
 *
 * These are absolute differences rather than sums, so they reduce to 0 through
 * 8 and never carry master values. A zero challenge is meaningful in the
 * tradition, not an error.
 */
export function challenges(
  year: number,
  month: number,
  day: number,
): { first: number; second: number; third: number; fourth: number } {
  const m = reduce(month);
  const d = reduce(day);
  const y = reduce(year);

  const first = Math.abs(m - d);
  const second = Math.abs(d - y);
  const third = Math.abs(first - second);
  const fourth = Math.abs(m - y);

  return { first, second, third, fourth };
}

export interface NumerologyProfile {
  system: NumerologySystem;
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  maturity: number;
  challenges: ReturnType<typeof challenges>;
}

/** The complete profile for a name and birth date. */
export function numerologyProfile(
  fullName: string,
  year: number,
  month: number,
  day: number,
  system: NumerologySystem = 'pythagorean',
): NumerologyProfile {
  const life = lifePath(year, month, day);
  const expr = expression(fullName, system);

  return {
    system,
    lifePath: life,
    expression: expr,
    soulUrge: soulUrge(fullName, system),
    personality: personality(fullName, system),
    birthday: birthdayNumber(day),
    maturity: maturity(life, expr),
    challenges: challenges(year, month, day),
  };
}
