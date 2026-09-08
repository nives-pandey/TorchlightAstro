/**
 * Torchlight — life areas
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import type { Chart } from '../chart';
import { rulerOfSign } from '../systems/gemstone';
import { houseSignification } from '../systems/significations';

/**
 * The twelve houses, grouped into the eight parts of a life a reader recognises.
 *
 * The houses were always the most useful thing this engine computes and the
 * least visible: a person wants to know about money and work, and the chart
 * answered with "2nd house" and "10th house". Grouping them under plain names
 * changes nothing about the astronomy and everything about who can read it.
 *
 * Which houses belong to which area is the classical allocation, not an
 * invention — the 2nd is earning and the 11th is receiving, so both are money;
 * the 6th is daily work and the 10th is vocation, so both are work.
 */

export type LifeAreaKey =
  | 'money'
  | 'work'
  | 'love'
  | 'home'
  | 'health'
  | 'learning'
  | 'depth'
  | 'self';

export interface LifeAreaDefinition {
  key: LifeAreaKey;
  /** What a reader calls it. */
  name: string;
  /** The houses it draws on. */
  houses: number[];
  /** One line naming what the houses cover, for a subtitle. */
  summary: string;
}

export const LIFE_AREAS: readonly LifeAreaDefinition[] = [
  { key: 'money', name: 'Money', houses: [2, 11], summary: 'earning and receiving' },
  { key: 'work', name: 'Work', houses: [6, 10], summary: 'daily work and vocation' },
  { key: 'love', name: 'Love', houses: [5, 7], summary: 'romance and partnership' },
  { key: 'home', name: 'Home', houses: [4], summary: 'family and where you are from' },
  { key: 'health', name: 'Health', houses: [6], summary: 'the body and its routines' },
  { key: 'learning', name: 'Learning', houses: [9], summary: 'study, belief and teachers' },
  { key: 'depth', name: 'Depth', houses: [8], summary: 'what is shared and what changes' },
  { key: 'self', name: 'Self', houses: [1], summary: 'how you meet the world' },
] as const;

export interface LifeAreaReading {
  key: LifeAreaKey;
  name: string;
  houses: number[];
  summary: string;
  /** The grahas ruling this area's houses, by sign. */
  rulers: string[];
  /** Planets actually sitting in those houses. */
  occupants: { planet: string; house: number; retrograde: boolean }[];
  /**
   * True when a ruler of this area also rules the running period or sub-period.
   * That is the whole definition — a period is "about" the areas its ruler owns.
   */
  active: boolean;
  /** Which running period made it active, when one did. */
  activatedBy: 'period' | 'sub-period' | null;
  /** When the area is quiet, the year the picture next changes. */
  quietUntil: number | null;
  /** What the tradition says these houses concern. */
  domains: string[];
}

export interface LifeAreasResult {
  areas: LifeAreaReading[];
  /** Absent without a birth time, since houses need one. */
  available: boolean;
}

/**
 * Reads the life areas from a chart.
 *
 * Returns `available: false` rather than guessing when the birth time is
 * unknown: every house in the chart would be wrong, and a plausible wrong
 * answer about someone's marriage is worse than no answer.
 */
export function readLifeAreas(chart: Chart): LifeAreasResult {
  if (!chart.hasBirthTime || !chart.western.houses || !chart.vedic.ascendantRashi) {
    return { areas: [], available: false };
  }

  const ascendantSign = chart.vedic.ascendantRashi.index;
  const current = chart.vedic.currentDasha;
  const periodRuler = current?.mahadasha?.planet ?? null;
  const subRuler = current?.antardasha?.planet ?? null;

  // The house a planet occupies is already resolved on the chart, so this is a
  // regrouping rather than a second calculation.
  const occupantsByHouse = new Map<number, { planet: string; retrograde: boolean }[]>();
  for (const planet of chart.western.planets) {
    if (planet.house === null) continue;
    const list = occupantsByHouse.get(planet.house) ?? [];
    list.push({ planet: planet.name, retrograde: planet.retrograde });
    occupantsByHouse.set(planet.house, list);
  }

  const areas = LIFE_AREAS.map((definition): LifeAreaReading => {
    // Whole-sign from the ascendant: the sign on house N is N-1 signs along.
    const rulers = definition.houses.map((house) =>
      rulerOfSign(((ascendantSign - 1 + house - 1) % 12) + 1),
    );

    const occupants = definition.houses.flatMap((house) =>
      (occupantsByHouse.get(house) ?? []).map((o) => ({ ...o, house })),
    );

    const bySubPeriod = subRuler !== null && rulers.includes(subRuler as never);
    const byPeriod = periodRuler !== null && rulers.includes(periodRuler as never);

    const domains = definition.houses.flatMap(
      (house) => houseSignification(house)?.domains ?? [],
    );

    return {
      key: definition.key,
      name: definition.name,
      houses: [...definition.houses],
      summary: definition.summary,
      rulers,
      occupants,
      active: bySubPeriod || byPeriod,
      activatedBy: bySubPeriod ? 'sub-period' : byPeriod ? 'period' : null,
      // The next sub-period boundary is when the picture can next change.
      quietUntil:
        bySubPeriod || byPeriod
          ? null
          : (current?.antardasha
              ? new Date(current.antardasha.end).getFullYear()
              : null),
      // Deduplicated: two houses in one area often share a domain.
      domains: [...new Set(domains)],
    };
  });

  return { areas, available: true };
}
