/**
 * Torchlight — colour correspondences
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { NAVARATNA_ORDER, rulerOfSign, type Graha } from './gemstone';

/**
 * Colour correspondences.
 *
 * A derived layer, like gemstones: nothing astronomical is computed here. Two
 * distinct traditions are kept separate rather than blended, because they
 * disagree and merging them would produce a scheme belonging to neither.
 *
 *   - **Graha colours** come from Vedic tradition and pair with the Navaratna
 *     stones. Kept alongside the gemstone module so the two cannot drift.
 *   - **Element colours** come from the Chinese five-phase system, where each
 *     phase has a fixed colour used in Feng Shui and BaZi reading.
 *
 * Where the previous build had a colour file, it mapped colours to Western sun
 * signs by way of chakras — a modern synthesis with no basis in either tradition
 * above. It is not carried over, for the same reason its gemstone list was not.
 */

/** A colour, with a hex value so an interface can render it directly. */
export interface ColourEntry {
  name: string;
  /** Uppercase six-digit hex, for rendering. */
  hex: string;
}

/**
 * Colours of the nine grahas.
 *
 * Traditional associations, recorded as data. The hex values are a rendering
 * choice made here — tradition names a colour, not a screen value — and are
 * chosen to be legible rather than to claim authority.
 */
export const GRAHA_COLOURS: Readonly<Record<Graha, ColourEntry>> = {
  Sun: { name: 'Deep Red', hex: '#B03A2E' },
  Moon: { name: 'White', hex: '#F4F1EA' },
  Mars: { name: 'Red', hex: '#C0392B' },
  Mercury: { name: 'Green', hex: '#27946B' },
  Jupiter: { name: 'Yellow', hex: '#D4A017' },
  Venus: { name: 'White', hex: '#EFE9DC' },
  Saturn: { name: 'Dark Blue', hex: '#2C3E67' },
  Rahu: { name: 'Smoky Grey', hex: '#6B6560' },
  Ketu: { name: 'Brown', hex: '#7A5C3E' },
};

/** The five phases of Chinese cosmology, in the generating cycle order. */
export const FIVE_PHASES = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;

export type Phase = (typeof FIVE_PHASES)[number];

/**
 * Colours of the five phases.
 *
 * Fixed in Chinese tradition, and used identically in Feng Shui and in BaZi.
 */
export const PHASE_COLOURS: Readonly<Record<Phase, ColourEntry>> = {
  Wood: { name: 'Green', hex: '#3E8E5A' },
  Fire: { name: 'Red', hex: '#C0392B' },
  Earth: { name: 'Yellow', hex: '#C9A227' },
  Metal: { name: 'White', hex: '#EDEAE3' },
  Water: { name: 'Black', hex: '#1F2A33' },
};

/**
 * The generating cycle: each phase produces the next.
 *
 * Wood feeds Fire, Fire makes Earth (ash), Earth bears Metal, Metal carries
 * Water, Water nourishes Wood. The cycle is closed, which the tests assert.
 */
export function generates(phase: Phase): Phase {
  const index = FIVE_PHASES.indexOf(phase);
  return FIVE_PHASES[(index + 1) % FIVE_PHASES.length] as Phase;
}

/**
 * The controlling cycle: each phase overcomes the one two steps ahead.
 *
 * Wood parts Earth, Earth dams Water, Water quenches Fire, Fire melts Metal,
 * Metal cuts Wood. Also closed, and distinct from the generating cycle at every
 * step — a property worth asserting, since confusing the two is the usual error
 * in five-phase reasoning.
 */
export function controls(phase: Phase): Phase {
  const index = FIVE_PHASES.indexOf(phase);
  return FIVE_PHASES[(index + 2) % FIVE_PHASES.length] as Phase;
}

export interface ColourRecommendation {
  basis: 'ascendant-ruler' | 'moon-sign-ruler' | 'day-master-phase';
  colour: ColourEntry;
  /** What the colour was derived from, named so a reading can explain itself. */
  source: string;
}

/**
 * Colours indicated by a chart.
 *
 * Reads the same verified placements the gemstone layer does, plus the BaZi day
 * master when one is supplied. Each recommendation carries its basis, so a
 * reading can say *why* rather than presenting a colour as if it were arbitrary.
 */
export function recommendColours(input: {
  ascendantSignIndex: number;
  moonSignIndex: number;
  dayMasterElement?: string;
}): ColourRecommendation[] {
  const ascendantRuler = rulerOfSign(input.ascendantSignIndex);
  const moonRuler = rulerOfSign(input.moonSignIndex);

  const recommendations: ColourRecommendation[] = [
    {
      basis: 'ascendant-ruler',
      colour: GRAHA_COLOURS[ascendantRuler],
      source: ascendantRuler,
    },
    {
      basis: 'moon-sign-ruler',
      colour: GRAHA_COLOURS[moonRuler],
      source: moonRuler,
    },
  ];

  // The day master's element comes from the Chinese pillars, a different
  // tradition — so it is reported as its own basis rather than merged with the
  // Vedic pair above. Guarded rather than assumed.
  if (input.dayMasterElement && input.dayMasterElement in PHASE_COLOURS) {
    const phase = input.dayMasterElement as Phase;
    recommendations.push({
      basis: 'day-master-phase',
      colour: PHASE_COLOURS[phase],
      source: phase,
    });
  }

  return recommendations;
}

/** Every graha colour, in Navaratna order. */
export function allGrahaColours(): Array<{ graha: Graha; colour: ColourEntry }> {
  return NAVARATNA_ORDER.map((graha) => ({ graha, colour: GRAHA_COLOURS[graha] }));
}
