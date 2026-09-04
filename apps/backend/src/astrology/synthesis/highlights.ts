/**
 * Torchlight — what is notable about a chart
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import type { Chart } from '../chart';
import { tropicalSignName } from '../chart';
import { houseSignification, westernNameFor } from '../systems/significations';

/**
 * What stands out in a chart, and what is happening in it now.
 *
 * The synthesis layer answers "what is this person like" as five trait axes.
 * That question has a shallow floor: run it over any chart and you get five
 * adjectives that fit most people, which is the failure mode every astrology
 * app shares. Two things are more useful and neither was being surfaced.
 *
 * The first is **time**. A dasha is a bounded period with a start and an end,
 * so "you are in a Jupiter period until 2033" is specific, checkable, and
 * changes on its own — unlike a personality adjective, which is fixed forever.
 *
 * The second is **rarity**. Most charts have no stellium and no master number.
 * When a chart does, that is worth saying, and saying how unusual it is. When
 * it does not, saying so plainly is still honest and still informative.
 *
 * Everything here is derived from placements the engine already verified. This
 * module adds no astronomy; it only decides what is worth pointing at.
 */

/** How unusual something is, used to decide whether it leads. */
export type Notability = 'rare' | 'uncommon' | 'ordinary';

export interface Highlight {
  /** Stable identifier, so the app can attach its own copy or an icon. */
  kind:
    | 'stellium'
    | 'retrograde-cluster'
    | 'master-number'
    | 'element-absence'
    | 'element-dominance'
    | 'unanimous-trait'
    | 'zodiac-divergence';
  notability: Notability;
  /** One plain sentence stating the finding. */
  statement: string;
  /** The placements this was read from, so a claim can always show its source. */
  basis: string[];
}

export interface TimeWindow {
  /** e.g. "Jupiter", the ruling graha of the period. */
  ruler: string;
  startsAt: string;
  endsAt: string;
  /** Whole years the period runs, for display. */
  years: number;
  /** How far through it the person is now, 0 to 1. */
  elapsed: number;
}

export interface ChartHighlights {
  /** The dasha periods running right now, outermost first. */
  now: {
    mahadasha: TimeWindow;
    antardasha: TimeWindow | null;
    /** The next mahadasha, so there is something ahead as well as now. */
    next: TimeWindow | null;
  } | null;
  /** Notable features, most unusual first. */
  notable: Highlight[];
  /**
   * True when nothing unusual was found. Saying so is more honest than
   * manufacturing significance, and the app should say it rather than showing
   * an empty section.
   */
  unremarkable: boolean;
}

/** Master numbers are not reduced in numerology, and most charts have none. */
const MASTER_NUMBERS = new Set([11, 22, 33]);

/** Below this many planets, a house is not a stellium. */
const STELLIUM_THRESHOLD = 3;

/**
 * Coerces a date that may have been through JSON.
 *
 * A chart straight from the engine carries real `Date` objects. The same chart
 * loaded from storage carries ISO strings, because JSON has no date type and
 * `jsonb` round-trips whatever it was given. Both reach this module, and the
 * type says `Date` for both — so the string case type-checked cleanly and threw
 * at runtime the first time a stored chart was read.
 */
function asDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function toWindow(
  period: { planet: string; start: Date | string; end: Date | string; years: number },
  at: Date,
): TimeWindow {
  const start = asDate(period.start);
  const end = asDate(period.end);
  const span = end.getTime() - start.getTime();
  const through = at.getTime() - start.getTime();

  return {
    ruler: period.planet,
    startsAt: start.toISOString(),
    endsAt: end.toISOString(),
    years: period.years,
    // Clamped: a period that has not started, or has ended, should not report
    // a fraction outside its own bounds.
    elapsed: span <= 0 ? 0 : Math.min(1, Math.max(0, through / span)),
  };
}

/**
 * Reads what is notable from an assembled chart.
 *
 * `at` is injected rather than read from the clock so the result is
 * deterministic and testable — the same chart at the same moment always
 * produces the same highlights.
 */
export function findHighlights(chart: Chart, at: Date = new Date()): ChartHighlights {
  const notable: Highlight[] = [];

  // ---- Stelliums -------------------------------------------------------
  // Three or more planets in one house concentrates a chart's emphasis, and
  // most charts have none. Houses need a birth time, so this is skipped when
  // there is none rather than computed from a guess.
  if (chart.hasBirthTime) {
    const byHouse = new Map<number, string[]>();
    for (const planet of chart.western.planets) {
      if (planet.house === null) continue;
      byHouse.set(planet.house, [...(byHouse.get(planet.house) ?? []), planet.name]);
    }

    for (const [house, planets] of [...byHouse].sort(([a], [b]) => a - b)) {
      if (planets.length < STELLIUM_THRESHOLD) continue;
      const meaning = houseSignification(house);
      notable.push({
        kind: 'stellium',
        notability: planets.length >= 4 ? 'rare' : 'uncommon',
        statement:
          `${planets.length} planets sit together in your ${ordinal(house)} house` +
          (meaning ? `, ${meaning.tone} — it concerns ${meaning.domains.join(', ')}.` : '.'),
        basis: planets.map((name) => `${name} in house ${house}`),
      });
    }
  }

  // ---- Retrograde clusters --------------------------------------------
  // The outer planets are retrograde for much of each year, so one or two is
  // unremarkable. Four or more at once is not.
  const retrograde = chart.western.planets.filter((p) => p.retrograde);
  if (retrograde.length >= 4) {
    notable.push({
      kind: 'retrograde-cluster',
      notability: retrograde.length >= 5 ? 'rare' : 'uncommon',
      statement: `${retrograde.length} planets were retrograde when you were born.`,
      basis: retrograde.map((p) => `${p.name} retrograde`),
    });
  }

  // ---- Master numbers --------------------------------------------------
  if (chart.numerology) {
    const named: ReadonlyArray<readonly [string, number]> = [
      ['Life path', chart.numerology.lifePath],
      ['Expression', chart.numerology.expression],
      ['Soul urge', chart.numerology.soulUrge],
      ['Personality', chart.numerology.personality],
    ];

    for (const [label, value] of named) {
      if (!MASTER_NUMBERS.has(value)) continue;
      notable.push({
        kind: 'master-number',
        notability: 'uncommon',
        statement: `Your ${label.toLowerCase()} is ${value}, a master number that is not reduced.`,
        basis: [`${label} ${value}`],
      });
    }
  }

  // ---- Element balance -------------------------------------------------
  // BaZi reads the eight characters' element distribution. A missing element,
  // or one that dominates, is what a practitioner comments on first.
  const counts = chart.chinese.elementCounts;
  const elements = Object.entries(counts);
  const total = elements.reduce((sum, [, n]) => sum + n, 0);

  for (const [element, n] of elements) {
    if (n === 0) {
      notable.push({
        kind: 'element-absence',
        notability: 'uncommon',
        statement: `Your Chinese chart has no ${element.toLowerCase()} in it at all.`,
        basis: [`${element}: 0 of ${total}`],
      });
    } else if (total > 0 && n / total >= 0.5) {
      notable.push({
        kind: 'element-dominance',
        notability: 'rare',
        statement: `${element} fills half your Chinese chart — ${n} of ${total} characters.`,
        basis: [`${element}: ${n} of ${total}`],
      });
    }
  }

  // ---- Unanimous traits ------------------------------------------------
  // Traditions built on different premises rarely agree exactly. When every
  // one of them lands on the same side, that is the firmest thing the chart
  // says about character.
  for (const agreement of chart.synthesis.agreements) {
    if (agreement.pole === null) continue;
    notable.push({
      kind: 'unanimous-trait',
      notability: agreement.readings.length >= 4 ? 'rare' : 'uncommon',
      statement: `All ${agreement.readings.length} traditions that read this agree you are ${agreement.pole.toLowerCase()}.`,
      basis: agreement.readings.map((r) => `${r.system}: ${r.source}`),
    });
  }

  // ---- The zodiac divergence -------------------------------------------
  // Western and Vedic place the same Sun in different signs, and a reader who
  // knows both notices immediately. It is not an error in either system: the
  // two zodiacs measure from different reference points, and the gap between
  // them is the ayanamsa. Explaining it is more useful than hiding it.
  const sun = chart.western.planets.find((p) => p.name === 'Sun');
  if (sun) {
    const tropical = tropicalSignName(sun.longitude);
    const sidereal = sun.siderealSign.name;
    const siderealInWestern = westernNameFor(sidereal);
    notable.push({
      kind: 'zodiac-divergence',
      notability: 'ordinary',
      statement: `Western reads your Sun as ${tropical}; Vedic reads it as ${sidereal}${
        siderealInWestern ? ` (${siderealInWestern})` : ''
      }. Both are right — they measure from different starting points, ${chart.vedic.ayanamsaDegrees.toFixed(2)}° apart.`,
      basis: [
        `Sun tropical ${sun.longitude.toFixed(2)}°`,
        `Sun sidereal ${sun.siderealLongitude.toFixed(2)}°`,
        `ayanamsa ${chart.vedic.ayanamsaDegrees.toFixed(4)}°`,
      ],
    });
  }

  const rank: Record<Notability, number> = { rare: 0, uncommon: 1, ordinary: 2 };
  notable.sort((a, b) => rank[a.notability] - rank[b.notability]);

  const current = chart.vedic.currentDasha;
  const mahadasha = current?.mahadasha ?? null;

  // The period after the running one, so the app can say what comes next.
  const next = mahadasha
    ? (chart.vedic.dashas.find(
        (d) => asDate(d.start).getTime() > asDate(mahadasha.start).getTime(),
      ) ?? null)
    : null;

  return {
    now: mahadasha
      ? {
          mahadasha: toWindow(mahadasha, at),
          antardasha: current?.antardasha ? toWindow(current.antardasha, at) : null,
          next: next ? toWindow(next, at) : null,
        }
      : null,
    notable,
    // "Ordinary" findings are context, not headlines — the zodiac divergence is
    // true of every chart. If nothing beat it, the chart is unremarkable and
    // the app should say so rather than dressing it up.
    unremarkable: notable.every((h) => h.notability === 'ordinary'),
  };
}

function ordinal(n: number): string {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? 'th' : (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th');
  return `${n}${suffix}`;
}
