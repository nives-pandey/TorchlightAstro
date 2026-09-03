/**
 * Torchlight — Chinese Four Pillars (BaZi)
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { normalizeDegrees } from '../core/time';
import { planetPosition } from '../core/ephemeris';

/**
 * The Four Pillars of Destiny — BaZi, literally "eight characters".
 *
 * A birth is described by four pairs: year, month, day and hour, each pairing
 * one of ten Heavenly Stems with one of twelve Earthly Branches. The branches
 * are the familiar animal signs; the stems carry the five elements in yang and
 * yin form.
 *
 * The single most common error in Western implementations — and the one the
 * previous build made — is deriving the animal from `year % 12`. That is wrong
 * for anyone born in January or early February, because the Chinese year does
 * not begin on 1 January.
 *
 * Worse, it is wrong in *two different ways* depending on which tradition is
 * meant, and the distinction matters:
 *
 *   - The **lunar new year** falls on the second new moon after the winter
 *     solstice, somewhere between 21 January and 20 February.
 *   - The **solar year** used for BaZi begins at Lìchūn, the start of spring,
 *     when the Sun reaches 315° of tropical longitude — around 4 February.
 *
 * BaZi uses the solar boundary, not the lunar one, and so does this module.
 * They usually fall within a fortnight of each other but can disagree for
 * roughly two weeks a year, which is enough to give someone the wrong animal
 * for their entire life.
 *
 * The month pillar likewise changes at solar terms, not at lunar months: each
 * of the twelve months begins when the Sun crosses a multiple of 30° measured
 * from 315°.
 */

/** The ten Heavenly Stems, in order. */
export const HEAVENLY_STEMS: ReadonlyArray<{
  chinese: string;
  pinyin: string;
  element: string;
  yang: boolean;
}> = [
  { chinese: '甲', pinyin: 'Jia', element: 'Wood', yang: true },
  { chinese: '乙', pinyin: 'Yi', element: 'Wood', yang: false },
  { chinese: '丙', pinyin: 'Bing', element: 'Fire', yang: true },
  { chinese: '丁', pinyin: 'Ding', element: 'Fire', yang: false },
  { chinese: '戊', pinyin: 'Wu', element: 'Earth', yang: true },
  { chinese: '己', pinyin: 'Ji', element: 'Earth', yang: false },
  { chinese: '庚', pinyin: 'Geng', element: 'Metal', yang: true },
  { chinese: '辛', pinyin: 'Xin', element: 'Metal', yang: false },
  { chinese: '壬', pinyin: 'Ren', element: 'Water', yang: true },
  { chinese: '癸', pinyin: 'Gui', element: 'Water', yang: false },
] as const;

/** The twelve Earthly Branches, with their animals. */
export const EARTHLY_BRANCHES: ReadonlyArray<{
  chinese: string;
  pinyin: string;
  animal: string;
  element: string;
}> = [
  { chinese: '子', pinyin: 'Zi', animal: 'Rat', element: 'Water' },
  { chinese: '丑', pinyin: 'Chou', animal: 'Ox', element: 'Earth' },
  { chinese: '寅', pinyin: 'Yin', animal: 'Tiger', element: 'Wood' },
  { chinese: '卯', pinyin: 'Mao', animal: 'Rabbit', element: 'Wood' },
  { chinese: '辰', pinyin: 'Chen', animal: 'Dragon', element: 'Earth' },
  { chinese: '巳', pinyin: 'Si', animal: 'Snake', element: 'Fire' },
  { chinese: '午', pinyin: 'Wu', animal: 'Horse', element: 'Fire' },
  { chinese: '未', pinyin: 'Wei', animal: 'Goat', element: 'Earth' },
  { chinese: '申', pinyin: 'Shen', animal: 'Monkey', element: 'Metal' },
  { chinese: '酉', pinyin: 'You', animal: 'Rooster', element: 'Metal' },
  { chinese: '戌', pinyin: 'Xu', animal: 'Dog', element: 'Earth' },
  { chinese: '亥', pinyin: 'Hai', animal: 'Pig', element: 'Water' },
] as const;

export interface Pillar {
  stemIndex: number;
  branchIndex: number;
  stem: (typeof HEAVENLY_STEMS)[number];
  branch: (typeof EARTHLY_BRANCHES)[number];
  /** The sexagenary pair, e.g. "甲子". */
  ganZhi: string;
  /** Romanised, e.g. "Jia Zi". */
  pinyin: string;
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  /** The day stem, which BaZi reads as the person themselves. */
  dayMaster: (typeof HEAVENLY_STEMS)[number];
  /** How many of each element appear across the eight characters. */
  elementCounts: Record<string, number>;
}

function makePillar(stemIndex: number, branchIndex: number): Pillar {
  const stem = HEAVENLY_STEMS[stemIndex] as (typeof HEAVENLY_STEMS)[number];
  const branch = EARTHLY_BRANCHES[branchIndex] as (typeof EARTHLY_BRANCHES)[number];

  return {
    stemIndex,
    branchIndex,
    stem,
    branch,
    ganZhi: stem.chinese + branch.chinese,
    pinyin: `${stem.pinyin} ${branch.pinyin}`,
  };
}

/**
 * Solar longitude at which the BaZi year and month change.
 *
 * Lìchūn, the start of spring, is 315°. Each subsequent month begins 30° later.
 */
const LICHUN_LONGITUDE = 315;

/**
 * The Sun's tropical longitude, measured from Lìchūn.
 *
 * Returns 0 at the moment of Lìchūn and increases to 360 over the year, so the
 * month index is simply this divided by thirty.
 */
function solarAngleFromLichun(date: Date): number {
  const sun = planetPosition('Sun', date).longitude;
  return normalizeDegrees(sun - LICHUN_LONGITUDE);
}

/**
 * The BaZi year for a date — the solar year, beginning at Lìchūn.
 *
 * A birth between 1 January and Lìchūn belongs to the *previous* BaZi year.
 * This is the correction `year % 12` misses, and it affects roughly a tenth of
 * all births.
 */
export function baziYearNumber(date: Date): number {
  const calendarYear = date.getUTCFullYear();

  // Lìchūn always falls in the first days of February, so only January and
  // early February can precede it. Restricting the question to those months
  // avoids needing a threshold on solar longitude at all.
  //
  // An earlier version tested `sun >= 280 && sun < 315`, treating 280° as
  // "roughly 1 January". It fails on 1 January itself, where the Sun sits at
  // 279.86° — a magic number chosen by eye rather than derived, and wrong by
  // a seventh of a degree.
  const month = date.getUTCMonth();
  if (month > 1) return calendarYear;

  // The Sun runs from ~280° on 1 January to 315° at Lìchūn. Anything below
  // 315° in January or February is still the previous solar year.
  const sun = planetPosition('Sun', date).longitude;
  return sun < LICHUN_LONGITUDE ? calendarYear - 1 : calendarYear;
}

/**
 * The year pillar.
 *
 * The sexagenary cycle is anchored so that 1984 is 甲子 (Jia Zi), the first of
 * the sixty. Stems repeat every ten years and branches every twelve, so the
 * pair repeats every sixty.
 */
export function yearPillar(date: Date): Pillar {
  const year = baziYearNumber(date);

  // 1984 = Jia Zi = stem 0, branch 0.
  const offset = year - 1984;
  const stemIndex = ((offset % 10) + 10) % 10;
  const branchIndex = ((offset % 12) + 12) % 12;

  return makePillar(stemIndex, branchIndex);
}

/**
 * The month pillar.
 *
 * The branch is fixed by the solar term: the month beginning at Lìchūn is
 * always 寅 (Tiger), regardless of year. The stem follows the "five tigers"
 * rule, which derives the first month's stem from the year stem.
 */
export function monthPillar(date: Date): Pillar {
  const monthsSinceLichun = Math.floor(solarAngleFromLichun(date) / 30);

  // The first solar month is always the Tiger branch, index 2.
  const branchIndex = (2 + monthsSinceLichun) % 12;

  // Five tigers rule: a year stem of Jia or Ji starts the year at Bing Yin,
  // Yi or Geng at Wu Yin, and so on — the first month's stem advances by two
  // for each step of the year stem, modulo ten.
  const yearStem = yearPillar(date).stemIndex;
  const firstMonthStem = (yearStem * 2 + 2) % 10;
  const stemIndex = (firstMonthStem + monthsSinceLichun) % 10;

  return makePillar(stemIndex, branchIndex);
}

/**
 * The day pillar.
 *
 * Days run in an unbroken sexagenary cycle that has never been reset, so this
 * is a straight count from a known anchor. The anchor used here is
 * 2000-01-07 UT, which was 甲子 (Jia Zi) — the first day of a cycle.
 *
 * The cycle changes at local midnight, so the date must already be expressed in
 * the birth's local time before it reaches this function.
 */
export function dayPillar(localDate: Date): Pillar {
  const anchor = Date.UTC(2000, 0, 7);
  const midnight = Date.UTC(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
  );

  const days = Math.round((midnight - anchor) / 86400000);
  const stemIndex = ((days % 10) + 10) % 10;
  const branchIndex = ((days % 12) + 12) % 12;

  return makePillar(stemIndex, branchIndex);
}

/**
 * The hour pillar.
 *
 * The day divides into twelve two-hour branches, the first of which (Rat)
 * straddles midnight from 23:00 to 01:00. That offset is the subtlety: an hour
 * of 23 belongs to the *next* day's first branch, not to the current day's
 * last.
 *
 * The stem follows the "five rats" rule from the day stem.
 */
export function hourPillar(dayStemIndex: number, localHour: number, localMinute = 0): Pillar {
  const minutes = localHour * 60 + localMinute;

  // 23:00-01:00 is branch 0, then every two hours after.
  const branchIndex = Math.floor(((minutes + 60) % 1440) / 120);

  // Five rats rule: the first hour stem is twice the day stem, modulo ten.
  const firstHourStem = (dayStemIndex * 2) % 10;
  const stemIndex = (firstHourStem + branchIndex) % 10;

  return makePillar(stemIndex, branchIndex);
}

/**
 * All four pillars for a birth.
 *
 * Two different times are needed, and conflating them is the subtlest error in
 * this module:
 *
 *   - `localDate` is the birth's **local wall-clock** time. The day pillar
 *     turns at local midnight and the hour pillar reads local clock hours.
 *   - `utcInstant` is the same moment in **UT**. The year and month pillars
 *     turn on solar terms, which are instants in absolute time — the Sun
 *     crosses 315° at one moment worldwide, not at a local hour.
 *
 * When `utcInstant` is omitted the local time is used for both, which is
 * correct only for a birth at Greenwich. Comparing against a reference that
 * computes solar terms in China Standard Time showed the consequence: seven
 * month pillars out of 400 landed one month early, every one of them within a
 * quarter of a degree of a term boundary. Supplying the true instant resolved
 * all seven.
 */
export function fourPillars(localDate: Date, utcInstant?: Date): FourPillars {
  const solarMoment = utcInstant ?? localDate;
  return fourPillarsInternal(localDate, solarMoment);
}

function fourPillarsInternal(localDate: Date, solarMoment: Date): FourPillars {
  // Year and month turn on solar terms, which are absolute instants.
  const year = yearPillar(solarMoment);
  const month = monthPillar(solarMoment);
  // Day turns at local midnight.
  const day = dayPillar(localDate);

  /**
   * From 23:00 the Rat hour has already begun, and its stem is taken from the
   * *following* day even though the day pillar itself does not change until
   * midnight. The two disagree for exactly one hour a day.
   *
   * This was found by comparison rather than by reasoning: a birth at 23:30 on
   * 1999-12-31 produced 庚子 where the reference gives 壬子, and the difference
   * resolved once the next day's stem was used.
   */
  const localHour = localDate.getUTCHours();
  const stemForHour =
    localHour >= 23 ? dayPillar(new Date(localDate.getTime() + 86400000)).stemIndex : day.stemIndex;

  const hour = hourPillar(stemForHour, localHour, localDate.getUTCMinutes());

  const elementCounts: Record<string, number> = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0,
  };

  for (const pillar of [year, month, day, hour]) {
    elementCounts[pillar.stem.element] = (elementCounts[pillar.stem.element] ?? 0) + 1;
    elementCounts[pillar.branch.element] = (elementCounts[pillar.branch.element] ?? 0) + 1;
  }

  return { year, month, day, hour, dayMaster: day.stem, elementCounts };
}

/**
 * The animal sign for a date.
 *
 * Uses the solar year boundary, so a birth in late January gets the previous
 * year's animal — which is the correct answer and the one `year % 12` gets
 * wrong.
 */
export function animalSign(date: Date): string {
  return yearPillar(date).branch.animal;
}
