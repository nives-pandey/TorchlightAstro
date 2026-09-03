/**
 * Torchlight — Vedic divisional charts (vargas)
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { normalizeDegrees } from '../core/time';
import { RASHIS } from './nakshatra';

/**
 * Divisional charts — the vargas.
 *
 * A Vedic reading is not built from the birth chart alone. Each sign is
 * subdivided, and the subdivision a planet falls into maps to a *different*
 * sign in a derived chart. The ninth division (Navamsa, D9) is read alongside
 * the birth chart for almost every question and is considered inseparable from
 * it — a planet strong in the birth chart but weak in D9 is read as promising
 * more than it delivers.
 *
 * The general rule is simple: divide each 30° sign into N parts, number the
 * parts consecutively from a starting sign that depends on the varga, and read
 * off which sign the planet lands in. What differs between vargas is *where the
 * counting starts*, and that rule is specific to each. Getting the starting
 * rule wrong produces a chart that is internally consistent and completely
 * wrong — which is why each is implemented explicitly rather than through one
 * clever generalisation.
 *
 * All input longitudes are **sidereal**. Passing tropical values shifts every
 * planet by roughly a sign before the division even begins.
 */

export const VARGA_TYPES = [
  'D1',
  'D2',
  'D3',
  'D4',
  'D7',
  'D9',
  'D10',
  'D12',
  'D16',
  'D20',
  'D24',
  'D27',
  'D30',
  'D40',
  'D45',
  'D60',
] as const;

export type VargaType = (typeof VARGA_TYPES)[number];

/** What each divisional chart is traditionally consulted for. */
export const VARGA_SIGNIFICATIONS: Readonly<Record<VargaType, string>> = {
  D1: 'The birth chart — the body, and life as a whole',
  D2: 'Wealth and sustenance',
  D3: 'Siblings, courage, and initiative',
  D4: 'Property, home, and inner contentment',
  D7: 'Children and progeny',
  D9: 'Marriage, and the underlying strength of every planet',
  D10: 'Career, status, and action in the world',
  D12: 'Parents and ancestry',
  D16: 'Vehicles, comforts, and pleasures',
  D20: 'Spiritual practice and devotion',
  D24: 'Learning and education',
  D27: 'Strengths and weaknesses of constitution',
  D30: 'Misfortunes and their sources',
  D40: 'Maternal legacy',
  D45: 'Paternal legacy',
  D60: 'The totality of past actions — the finest division',
};

/** How many parts each sign divides into for a given varga. */
export const VARGA_DIVISIONS: Readonly<Record<VargaType, number>> = {
  D1: 1,
  D2: 2,
  D3: 3,
  D4: 4,
  D7: 7,
  D9: 9,
  D10: 10,
  D12: 12,
  D16: 16,
  D20: 20,
  D24: 24,
  D27: 27,
  D30: 30,
  D40: 40,
  D45: 45,
  D60: 60,
};

/** Signs are grouped by element and by movable/fixed/dual quality. */
const MOVABLE = 0;
const FIXED = 1;
const DUAL = 2;

/** 0 = Aries. Movable: Aries, Cancer, Libra, Capricorn. And so on. */
function quality(signIndex: number): number {
  return signIndex % 3 === 0 ? MOVABLE : signIndex % 3 === 1 ? FIXED : DUAL;
}

/** True for Aries, Gemini, Leo, Libra, Sagittarius, Aquarius. */
function isOddSign(signIndex: number): boolean {
  return signIndex % 2 === 0;
}

export interface VargaPosition {
  varga: VargaType;
  /** 1-12, the sign in the divisional chart. */
  signIndex: number;
  signName: string;
  /** Which division of the natal sign the planet occupied, 1-based. */
  division: number;
}

/**
 * Maps a sidereal longitude into a divisional chart.
 *
 * Each varga's starting rule is stated in its own branch, with the traditional
 * source of the rule named, because these rules are the whole content of the
 * subject and a silent "optimisation" across them would be a serious bug.
 */
export function vargaOf(siderealLongitude: number, varga: VargaType): VargaPosition {
  const longitude = normalizeDegrees(siderealLongitude);
  const sign = Math.floor(longitude / 30);
  const degreesInSign = longitude - sign * 30;

  const divisions = VARGA_DIVISIONS[varga];
  const partSize = 30 / divisions;
  // 0-based index of which part of the sign the planet occupies.
  const part = Math.min(Math.floor(degreesInSign / partSize), divisions - 1);

  let result: number;

  switch (varga) {
    case 'D1':
      result = sign;
      break;

    case 'D2':
      // Hora. In odd signs the first half is Leo (the Sun's), the second Cancer
      // (the Moon's); in even signs the order reverses.
      if (isOddSign(sign)) {
        result = part === 0 ? 4 : 3;
      } else {
        result = part === 0 ? 3 : 4;
      }
      break;

    case 'D3':
      // Drekkana. Counting starts from the sign itself, then the 5th, then the
      // 9th — the trine from that sign.
      result = (sign + part * 4) % 12;
      break;

    case 'D4':
      // Chaturthamsa. From the sign itself, then each successive kendra.
      result = (sign + part * 3) % 12;
      break;

    case 'D7':
      // Saptamsa. Odd signs count from the sign itself; even signs from the
      // seventh from it.
      result = (isOddSign(sign) ? sign + part : sign + 6 + part) % 12;
      break;

    case 'D9': {
      // Navamsa. Counting begins from a fixed sign determined by the quality of
      // the natal sign: movable signs start from themselves, fixed signs from
      // the ninth, dual signs from the fifth. This is equivalent to the
      // continuous rule where the 108 navamsas of the zodiac run consecutively
      // from Aries, which is the form used here because it cannot drift.
      result = (sign * 9 + part) % 12;
      break;
    }

    case 'D10':
      // Dasamsa. Odd signs count from the sign itself; even signs from the
      // ninth from it.
      result = (isOddSign(sign) ? sign + part : sign + 8 + part) % 12;
      break;

    case 'D12':
      // Dwadasamsa. Always counts from the sign itself.
      result = (sign + part) % 12;
      break;

    case 'D16':
      // Shodasamsa. Movable signs count from Aries, fixed from Leo, dual from
      // Sagittarius.
      result = ([0, 4, 8][quality(sign)] as number) + part;
      result %= 12;
      break;

    case 'D20':
      // Vimsamsa. Movable from Aries, fixed from Sagittarius, dual from Leo.
      result = ([0, 8, 4][quality(sign)] as number) + part;
      result %= 12;
      break;

    case 'D24':
      // Chaturvimsamsa. Odd signs count from Leo, even signs from Cancer.
      result = (isOddSign(sign) ? 4 : 3) + part;
      result %= 12;
      break;

    case 'D27':
      // Bhamsa. Counting starts from the first sign of the natal sign's
      // element: fire from Aries, earth from Cancer, air from Libra, water
      // from Capricorn.
      result = (sign % 4) * 3 + part;
      result %= 12;
      break;

    case 'D30': {
      // Trimsamsa. The only varga with unequal parts. In odd signs the ranges
      // are 5° Mars, 5° Saturn, 8° Jupiter, 7° Mercury, 5° Venus; in even
      // signs the order and boundaries reverse.
      result = trimsamsaSign(sign, degreesInSign);
      break;
    }

    case 'D40':
      // Khavedamsa. Odd signs count from Aries, even signs from Libra.
      result = (isOddSign(sign) ? 0 : 6) + part;
      result %= 12;
      break;

    case 'D45':
      // Akshavedamsa. Movable from Aries, fixed from Leo, dual from
      // Sagittarius.
      result = ([0, 4, 8][quality(sign)] as number) + part;
      result %= 12;
      break;

    case 'D60':
      // Shastiamsa. Always counts from the sign itself.
      result = (sign + part) % 12;
      break;
  }

  return {
    varga,
    signIndex: result + 1,
    signName: RASHIS[result] as string,
    division: part + 1,
  };
}

/**
 * Trimsamsa (D30), which alone uses unequal divisions.
 *
 * The five ranges belong to Mars, Saturn, Jupiter, Mercury and Venus, and both
 * their widths and their order differ between odd and even signs. The resulting
 * sign is the ruling planet's own sign — Mars takes Aries in odd signs and
 * Scorpio in even, and so on — which is why this cannot be expressed as an
 * offset like the others.
 */
function trimsamsaSign(sign: number, degreesInSign: number): number {
  if (isOddSign(sign)) {
    // Mars 0-5, Saturn 5-10, Jupiter 10-18, Mercury 18-25, Venus 25-30.
    if (degreesInSign < 5) return 0; // Aries
    if (degreesInSign < 10) return 10; // Aquarius
    if (degreesInSign < 18) return 8; // Sagittarius
    if (degreesInSign < 25) return 2; // Gemini
    return 6; // Libra
  }

  // Even signs reverse both the order and the rulers' signs.
  // Venus 0-5, Mercury 5-12, Jupiter 12-20, Saturn 20-25, Mars 25-30.
  if (degreesInSign < 5) return 1; // Taurus
  if (degreesInSign < 12) return 5; // Virgo
  if (degreesInSign < 20) return 11; // Pisces
  if (degreesInSign < 25) return 9; // Capricorn
  return 7; // Scorpio
}

/** Every varga position for one longitude, keyed by chart. */
export function allVargas(siderealLongitude: number): Record<VargaType, VargaPosition> {
  const result = {} as Record<VargaType, VargaPosition>;
  for (const varga of VARGA_TYPES) {
    result[varga] = vargaOf(siderealLongitude, varga);
  }
  return result;
}
