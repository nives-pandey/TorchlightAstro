/**
 * Torchlight — traditional significations
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * What each graha, house, and sign traditionally signifies.
 *
 * This table exists because of a specific failure. When a language model was
 * given only the computed facts — "Jupiter period, 2017 to 2033" — it wrote a
 * good reading by supplying the meanings from its own training: that Jupiter
 * concerns expansion and study, that the 8th house concerns shared resources.
 * Each of those happened to be right. None of them was auditable, none came
 * from this engine, and a model that recalls eight meanings correctly will
 * eventually recall a ninth incorrectly with exactly the same confidence.
 *
 * The engine is exact to the arcsecond about *where* the planets are. It should
 * be equally answerable for *what the tradition says about them*. So the
 * meanings live here, as data, with their sources named — and the model's job
 * narrows back to phrasing what it is given.
 *
 * These are classical significations (karakatva), not predictions. They describe
 * what a tradition associates with a placement, which is a claim about the
 * tradition rather than a claim about the person's future. Wording is
 * deliberately neutral and non-fatalistic: no tradition's claim about wealth,
 * death, disease, or marriage is reproduced here, because those are the claims
 * that do harm when a reader takes them literally.
 *
 * Sources, all classical and widely published:
 *   - Parashara, *Brihat Parashara Hora Shastra*, ch. 3 (graha karakatva) and
 *     ch. 11 (bhava significations)
 *   - Varahamihira, *Brihat Jataka*, ch. 1-2
 *   - Standard Western house rulerships as set out in Ptolemy, *Tetrabiblos*,
 *     book III, and unchanged in modern practice
 */

/** A traditional association, in the words a reader can use. */
export interface Signification {
  /** Two to four domains the tradition links to this placement. */
  domains: string[];
  /** How the period or placement is traditionally characterised, in tone. */
  tone: string;
}

/**
 * The nine grahas of Vedic astrology.
 *
 * Rahu and Ketu are included because the Vimshottari dasha cycle runs on all
 * nine; a reading that hits a Rahu period and has nothing to say would be worse
 * than one that says what the tradition says.
 */
export const GRAHA_SIGNIFICATIONS: Readonly<Record<string, Signification>> = {
  Sun: {
    domains: ['selfhood', 'vitality', 'authority', 'the father'],
    tone: 'a period traditionally read as bringing matters of self-definition and responsibility forward',
  },
  Moon: {
    domains: ['feeling', 'the mind', 'nourishment', 'the mother'],
    tone: 'a period traditionally read as emotionally changeable and inward-turning',
  },
  Mars: {
    domains: ['drive', 'courage', 'competition', 'siblings'],
    tone: 'a period traditionally read as energetic and confrontational in tone',
  },
  Mercury: {
    domains: ['intellect', 'speech', 'commerce', 'learning'],
    tone: 'a period traditionally read as quick, communicative, and analytical',
  },
  Jupiter: {
    domains: ['expansion', 'teaching', 'study', 'counsel'],
    tone: 'a period traditionally read as broadening and oriented toward learning',
  },
  Venus: {
    domains: ['beauty', 'art', 'pleasure', 'partnership'],
    tone: 'a period traditionally read as sociable and drawn toward comfort and craft',
  },
  Saturn: {
    domains: ['structure', 'discipline', 'endurance', 'time'],
    tone: 'a period traditionally read as slow, structural, and demanding of patience',
  },
  Rahu: {
    domains: ['ambition', 'the unfamiliar', 'worldly appetite'],
    tone: 'a period traditionally read as unsettling and strongly outward-reaching',
  },
  Ketu: {
    domains: ['detachment', 'inwardness', 'letting go'],
    tone: 'a period traditionally read as inward and loosening of attachments',
  },
};

/**
 * The twelve houses (bhavas).
 *
 * Vedic and Western practice agree closely on these domains, which is why one
 * table serves both. Where they diverge it is in emphasis rather than subject.
 */
export const HOUSE_SIGNIFICATIONS: Readonly<Record<number, Signification>> = {
  1: {
    domains: ['the self', 'the body', 'how one meets the world'],
    tone: 'the house of selfhood and outward manner',
  },
  2: {
    domains: ['resources', 'speech', 'what one values'],
    tone: 'the house of holdings and voice',
  },
  3: {
    domains: ['courage', 'siblings', 'short journeys', 'effort'],
    tone: 'the house of initiative and immediate surroundings',
  },
  4: {
    domains: ['home', 'the mother', 'inner peace', 'roots'],
    tone: 'the house of foundations and belonging',
  },
  5: {
    domains: ['creativity', 'children', 'learning', 'play'],
    tone: 'the house of what one makes and delights in',
  },
  6: {
    domains: ['work', 'service', 'obstacles', 'daily routine'],
    tone: 'the house of effort and things to be overcome',
  },
  7: {
    domains: ['partnership', 'agreements', 'the other person'],
    tone: 'the house of one-to-one relationship',
  },
  8: {
    domains: ['depth', 'shared resources', 'transformation', 'the hidden'],
    tone: 'the house of what is held in common and what changes irreversibly',
  },
  9: {
    domains: ['philosophy', 'teachers', 'long journeys', 'belief'],
    tone: 'the house of meaning and the search for it',
  },
  10: {
    domains: ['vocation', 'standing', 'public action'],
    tone: 'the house of work in the world',
  },
  11: {
    domains: ['networks', 'gains', 'community', 'hopes'],
    tone: 'the house of the wider circle and what it brings',
  },
  12: {
    domains: ['solitude', 'retreat', 'the unseen', 'release'],
    tone: 'the house of withdrawal and what lies beyond the visible',
  },
};

/** Sidereal sign names paired with their common Western equivalents. */
export const RASHI_TO_WESTERN: Readonly<Record<string, string>> = {
  Mesha: 'Aries',
  Vrishabha: 'Taurus',
  Mithuna: 'Gemini',
  Karka: 'Cancer',
  Simha: 'Leo',
  Kanya: 'Virgo',
  Tula: 'Libra',
  Vrischika: 'Scorpio',
  Dhanu: 'Sagittarius',
  Makara: 'Capricorn',
  Kumbha: 'Aquarius',
  Meena: 'Pisces',
};

/** The signification for a graha, or null when the name is not one of the nine. */
export function grahaSignification(planet: string): Signification | null {
  return GRAHA_SIGNIFICATIONS[planet] ?? null;
}

/** The signification for a house, or null when out of range. */
export function houseSignification(house: number): Signification | null {
  return HOUSE_SIGNIFICATIONS[house] ?? null;
}

/** The Western name for a rashi, or null when unrecognised. */
export function westernNameFor(rashi: string): string | null {
  return RASHI_TO_WESTERN[rashi] ?? null;
}
