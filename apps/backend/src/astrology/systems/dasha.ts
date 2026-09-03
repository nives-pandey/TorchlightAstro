/**
 * Torchlight — Vimshottari planetary period system
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { nakshatraOf } from './nakshatra';

/**
 * Vimshottari Dasha — the Vedic system of planetary periods.
 *
 * A person's life is divided into nine major periods (mahadashas) totalling 120
 * years, allotted to the planets in a fixed sequence. Which planet's period you
 * are born into, and how much of it remains, is set entirely by the Moon's
 * nakshatra at birth. Each mahadasha subdivides into nine antardashas in the
 * same sequence and proportion, and so on downward.
 *
 * This is the backbone of Vedic prediction — it is what answers "when". An
 * error in the Moon's position of even a degree can shift the birth dasha to a
 * different planet, which moves every subsequent period by years.
 *
 * The 120-year total is not incidental: it is the sum of the nine planetary
 * allotments, and each nakshatra's ruler determines where in the cycle a life
 * begins.
 */

/** Years allotted to each planet, in the fixed traditional order. */
export const DASHA_SEQUENCE: ReadonlyArray<{ planet: string; years: number }> = [
  { planet: 'Ketu', years: 7 },
  { planet: 'Venus', years: 20 },
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 10 },
  { planet: 'Mars', years: 7 },
  { planet: 'Rahu', years: 18 },
  { planet: 'Jupiter', years: 16 },
  { planet: 'Saturn', years: 19 },
  { planet: 'Mercury', years: 17 },
] as const;

/** The cycle totals exactly 120 years, which the tests assert. */
export const DASHA_TOTAL_YEARS = 120;

/**
 * Length of the Vedic sidereal year in days.
 *
 * Vimshottari periods are traditionally reckoned in sidereal years of
 * 365.25 days, not tropical years of 365.2422. Over a 120-year cycle the
 * difference is about a year, so using the wrong one shifts late-life periods
 * noticeably.
 */
const DAYS_PER_YEAR = 365.25;

export interface DashaPeriod {
  planet: string;
  start: Date;
  end: Date;
  /** Length in years, for display. */
  years: number;
  /** Nested sub-periods, when computed. */
  sub?: DashaPeriod[];
}

function addYears(date: Date, years: number): Date {
  return new Date(date.getTime() + years * DAYS_PER_YEAR * 86400000);
}

/**
 * Builds the mahadasha sequence for a birth.
 *
 * `moonSiderealLongitude` must be sidereal. A tropical longitude lands in a
 * nakshatra roughly two positions earlier, which starts the whole sequence on
 * the wrong planet.
 *
 * The first period is partial: a birth two thirds of the way through a
 * nakshatra has one third of that planet's period remaining.
 */
export function vimshottariDashas(
  birthDate: Date,
  moonSiderealLongitude: number,
  cycles = 1,
): DashaPeriod[] {
  const nakshatra = nakshatraOf(moonSiderealLongitude);

  const startIndex = DASHA_SEQUENCE.findIndex((entry) => entry.planet === nakshatra.ruler);
  if (startIndex === -1) {
    // Unreachable: every nakshatra ruler appears in the sequence. Guarding
    // rather than indexing with -1, which would silently produce Mercury.
    throw new Error(`Nakshatra ruler ${nakshatra.ruler} is not in the dasha sequence`);
  }

  const periods: DashaPeriod[] = [];

  // The portion of the first period already elapsed at birth equals the portion
  // of the nakshatra the Moon had already travelled.
  const first = DASHA_SEQUENCE[startIndex] as { planet: string; years: number };
  const remainingYears = first.years * (1 - nakshatra.fraction);

  let cursor = birthDate;
  periods.push({
    planet: first.planet,
    start: cursor,
    end: addYears(cursor, remainingYears),
    years: remainingYears,
  });
  cursor = addYears(cursor, remainingYears);

  const total = DASHA_SEQUENCE.length * cycles;
  for (let step = 1; step < total; step += 1) {
    const entry = DASHA_SEQUENCE[(startIndex + step) % DASHA_SEQUENCE.length] as {
      planet: string;
      years: number;
    };
    const end = addYears(cursor, entry.years);
    periods.push({ planet: entry.planet, start: cursor, end, years: entry.years });
    cursor = end;
  }

  return periods;
}

/**
 * Subdivides a period into its nine antardashas.
 *
 * Each sub-period takes the same share of the parent that its planet takes of
 * the 120-year cycle, and the sequence starts with the parent's own planet.
 * The same rule applies recursively to deeper levels.
 */
export function subPeriods(period: DashaPeriod): DashaPeriod[] {
  const startIndex = DASHA_SEQUENCE.findIndex((entry) => entry.planet === period.planet);
  if (startIndex === -1) {
    throw new Error(`Planet ${period.planet} is not in the dasha sequence`);
  }

  const result: DashaPeriod[] = [];
  let cursor = period.start;

  for (let step = 0; step < DASHA_SEQUENCE.length; step += 1) {
    const entry = DASHA_SEQUENCE[(startIndex + step) % DASHA_SEQUENCE.length] as {
      planet: string;
      years: number;
    };
    const years = (period.years * entry.years) / DASHA_TOTAL_YEARS;
    const end = addYears(cursor, years);
    result.push({ planet: entry.planet, start: cursor, end, years });
    cursor = end;
  }

  return result;
}

/**
 * The mahadasha and antardasha active at a given moment.
 *
 * Returns nulls rather than throwing when the date falls outside the computed
 * span — a chart displaying "no active period" is better than one that crashes.
 */
export function activeDasha(
  periods: DashaPeriod[],
  at: Date,
): { mahadasha: DashaPeriod | null; antardasha: DashaPeriod | null } {
  const mahadasha = periods.find((p) => at >= p.start && at < p.end) ?? null;
  if (!mahadasha) return { mahadasha: null, antardasha: null };

  const antardasha = subPeriods(mahadasha).find((p) => at >= p.start && at < p.end) ?? null;
  return { mahadasha, antardasha };
}
