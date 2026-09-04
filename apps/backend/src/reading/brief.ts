/**
 * Torchlight — building the reading brief
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import type { Chart } from '../astrology/chart';

/**
 * How each tradition is named in prose.
 *
 * The engine identifies systems by internal keys. Handing "humanDesign" to a
 * model invites it back out in the reading, so the brief translates them at the
 * boundary rather than hoping the model tidies up after us.
 */
const SYSTEM_NAMES: Readonly<Record<string, string>> = {
  western: 'Western astrology',
  vedic: 'Vedic astrology',
  chinese: 'Chinese astrology',
  numerology: 'Numerology',
  humanDesign: 'Human Design',
  tarot: 'Tarot',
};

const named = (system: string): string => SYSTEM_NAMES[system] ?? system;
import { grahaSignification } from '../astrology/systems/significations';
import { findHighlights, type ChartHighlights } from '../astrology/synthesis/highlights';
import type { BriefFact, ReadingBrief } from './reading.types';

/**
 * Turns a verified chart into the only thing the model is allowed to read.
 *
 * This is the security boundary of the reading layer, and it is a boundary in
 * one direction: facts pass through, numbers do not. A model given longitudes
 * can compute a placement nobody verified and state it with the same confidence
 * as the real ones. A model given "Jupiter period, ends 2033" can only rephrase
 * that.
 *
 * The word "translate" is exact here. The engine has already decided what is
 * true; this decides what is worth saying; the model decides only how to say it.
 */

const NAMED_PLANETS = ['Sun', 'Moon', 'Ascendant'] as const;

function yearOf(iso: string): number {
  return new Date(iso).getFullYear();
}

/** Joins domains readably: "expansion, teaching and study". */
function listOf(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** Describes how far through a period someone is, without a decimal. */
function progressWord(elapsed: number): string {
  if (elapsed < 0.25) return 'early in';
  if (elapsed < 0.6) return 'partway through';
  if (elapsed < 0.85) return 'well into';
  return 'near the end of';
}

export function buildBrief(
  chart: Chart,
  displayName: string,
  at: Date = new Date(),
): ReadingBrief {
  const highlights: ChartHighlights = findHighlights(chart, at);

  // ---- Now -------------------------------------------------------------
  const now: BriefFact[] = [];

  if (highlights.now) {
    const { mahadasha, antardasha, next } = highlights.now;

    const ruling = grahaSignification(mahadasha.ruler);

    now.push({
      label: 'Current period',
      statement:
        `They are ${progressWord(mahadasha.elapsed)} a ${mahadasha.ruler} period that runs from ${yearOf(
          mahadasha.startsAt,
        )} to ${yearOf(mahadasha.endsAt)} — ${mahadasha.years} years in total.` +
        (ruling
          ? ` The tradition associates ${mahadasha.ruler} with ${listOf(ruling.domains)}: ${ruling.tone}.`
          : ''),
      basis: [`Vimshottari mahadasha: ${mahadasha.ruler}`],
    });

    if (antardasha) {
      const sub = grahaSignification(antardasha.ruler);
      now.push({
        label: 'Sub-period within it',
        statement:
          `Inside that, a shorter ${antardasha.ruler} phase runs until ${yearOf(antardasha.endsAt)}.` +
          (sub ? ` ${antardasha.ruler} is associated with ${listOf(sub.domains)}.` : ''),
        basis: [`Vimshottari antardasha: ${antardasha.ruler}`],
      });
    }

    if (next) {
      const following = grahaSignification(next.ruler);
      now.push({
        label: 'What follows',
        statement:
          `The ${mahadasha.ruler} period gives way to a ${next.ruler} period in ${yearOf(next.startsAt)}.` +
          (following ? ` That one is ${following.tone}.` : ''),
        basis: [`Next mahadasha: ${next.ruler}`],
      });
    }
  }

  // ---- What stands out -------------------------------------------------
  // Ordinary findings are true of every chart, so they are context rather than
  // headlines and are left out of the brief entirely.
  const notable: BriefFact[] = highlights.notable
    .filter((h) => h.notability !== 'ordinary' && h.kind !== 'unanimous-trait')
    .map((h) => ({
      label: 'Unusual in this chart',
      statement: h.statement,
      basis: h.basis,
    }));

  // The zodiac divergence is ordinary — every chart has one — but it is the
  // single most useful thing to explain to someone meeting both systems, so it
  // is carried through deliberately rather than filtered out with the rest.
  const divergence = highlights.notable.find((h) => h.kind === 'zodiac-divergence');
  if (divergence) {
    notable.push({
      label: 'Why two traditions name different signs',
      statement: divergence.statement,
      basis: divergence.basis,
    });
  }

  // ---- Character -------------------------------------------------------
  const character: BriefFact[] = [];

  for (const tension of chart.synthesis.tensions) {
    character.push({
      label: 'Traditions disagree',
      statement: `On ${tension.dimension}, ${tension.oneSide.systems
        .map(named)
        .join(', ')} read them as ${tension.oneSide.pole.toLowerCase()}, while ${tension.otherSide.systems
        .map(named)
        .join(', ')} read them as ${tension.otherSide.pole.toLowerCase()}.`,
      basis: [...tension.oneSide.systems, ...tension.otherSide.systems].map(named),
    });
  }

  for (const agreement of chart.synthesis.agreements) {
    if (agreement.pole === null) continue;
    character.push({
      label: 'Traditions agree',
      statement: `On ${agreement.dimension}, every tradition that reads it says ${agreement.pole.toLowerCase()}.`,
      basis: agreement.readings.map((r) => `${named(r.system)}: ${r.source}`),
    });
  }

  // The headline placements, named without their coordinates.
  const placements: string[] = [];
  for (const name of NAMED_PLANETS) {
    const planet = chart.western.planets.find((p) => p.name === name);
    if (planet) placements.push(`${name} in ${planet.siderealSign.name} (Vedic)`);
  }
  if (chart.vedic.ascendantRashi) {
    placements.push(`Ascendant ${chart.vedic.ascendantRashi.name}`);
  }
  if (placements.length > 0) {
    character.push({
      label: 'Headline placements',
      statement: placements.join('; '),
      basis: placements,
    });
  }

  return {
    displayName,
    hasBirthTime: chart.hasBirthTime,
    now,
    notable,
    character,
  };
}

/**
 * Renders the brief as the text the model receives.
 *
 * Kept separate from the prompt so it can be inspected, logged, and asserted on
 * in tests — the exact bytes the model saw are what a disputed reading has to
 * be checked against.
 */
export function renderBrief(brief: ReadingBrief): string {
  const section = (title: string, facts: BriefFact[]): string =>
    facts.length === 0
      ? ''
      : `\n## ${title}\n` +
        facts.map((f) => `- ${f.label}: ${f.statement}`).join('\n') +
        '\n';

  return [
    `Person: ${brief.displayName}`,
    brief.hasBirthTime
      ? 'Birth time known, so houses and rising sign are available.'
      : 'Birth time unknown, so houses and rising sign are absent. Do not mention them.',
    section('The period they are in now', brief.now),
    section('What is unusual about this chart', brief.notable),
    section('What the traditions say about character', brief.character),
  ]
    .join('\n')
    .trim();
}
