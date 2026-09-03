/**
 * Torchlight — system-to-trait mappings
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { reading, type TraitReading } from './traits';

/**
 * Each tradition's own output, translated into the shared vocabulary.
 *
 * Every mapping here rests on a classification the tradition itself makes. That
 * constraint is what keeps this from being invention: the modality of a Western
 * sign, the yin or yang of a Chinese stem, the odd or even of a Vedic rashi are
 * all distinctions the traditions draw for their own purposes, long before
 * anyone thought to compare them.
 *
 * What is *not* claimed is that these traditions mean the same thing by their
 * distinctions. Cardinal in Western astrology and yang in Chinese cosmology are
 * not the same idea. They are, however, both statements about initiative, which
 * is enough to place them on a common axis and see whether they point the same
 * way — and that comparison is the product.
 *
 * Confidence is assigned by how directly a tradition addresses a dimension:
 *
 *   - **strong** — the tradition classifies this explicitly, and the
 *     classification is central to how it reads a person
 *   - **moderate** — the tradition addresses it, but as a secondary quality
 *   - **indicative** — a defensible reading, but one a practitioner might
 *     reasonably draw differently
 *
 * No mapping is rated strong unless the underlying distinction is one the
 * tradition would recognise as primary.
 */

const ELEMENTS = ['Fire', 'Earth', 'Air', 'Water'] as const;
const MODALITIES = ['Cardinal', 'Fixed', 'Mutable'] as const;

/** Element of a zodiac sign, 1-based. Aries is Fire, and the cycle repeats. */
export function elementOfSign(signIndex: number): (typeof ELEMENTS)[number] {
  return ELEMENTS[(signIndex - 1) % 4] as (typeof ELEMENTS)[number];
}

/** Modality of a zodiac sign, 1-based. Aries is Cardinal, and the cycle repeats. */
export function modalityOfSign(signIndex: number): (typeof MODALITIES)[number] {
  return MODALITIES[(signIndex - 1) % 3] as (typeof MODALITIES)[number];
}

/**
 * Western astrology, from the Sun sign.
 *
 * Element and modality are the two classifications Western astrology applies to
 * every sign, and both are primary rather than incidental — which is why these
 * are the only two rated strong.
 */
export function mapWestern(sunSignIndex: number, signName: string): TraitReading[] {
  const element = elementOfSign(sunSignIndex);
  const modality = modalityOfSign(sunSignIndex);
  const source = `Sun in ${signName}`;

  const readings: TraitReading[] = [];

  // Fire and Air are the extraverted elements, Earth and Water the introverted.
  // This is one of the oldest distinctions in the tradition.
  readings.push(
    reading(
      'western',
      'expression',
      element === 'Fire' ? 0.9 : element === 'Air' ? 0.6 : element === 'Earth' ? -0.5 : -0.7,
      'strong',
      source,
    ),
  );

  // Modality is precisely a statement about how change is met.
  readings.push(
    reading(
      'western',
      'stability',
      modality === 'Fixed' ? 0.9 : modality === 'Cardinal' ? -0.2 : -0.7,
      'strong',
      source,
    ),
  );

  // Air and Earth are the elements associated with reasoning; Fire and Water
  // with feeling — Fire less strongly, since its heat is not sentiment.
  readings.push(
    reading(
      'western',
      'orientation',
      element === 'Air' ? 0.8 : element === 'Earth' ? 0.5 : element === 'Water' ? -0.8 : -0.3,
      'moderate',
      source,
    ),
  );

  // Cardinal signs initiate, which reads as independence; mutable signs adapt
  // to others.
  readings.push(
    reading(
      'western',
      'relation',
      modality === 'Mutable' ? 0.5 : modality === 'Cardinal' ? -0.5 : 0,
      'indicative',
      source,
    ),
  );

  readings.push(
    reading(
      'western',
      'structure',
      element === 'Earth' ? 0.8 : element === 'Air' ? 0.2 : element === 'Water' ? -0.3 : -0.5,
      'moderate',
      source,
    ),
  );

  return readings;
}

/**
 * Vedic astrology, from the Moon's rashi and its nakshatra ruler.
 *
 * Vedic practice reads the Moon rather than the Sun as the primary indicator of
 * a person's nature, so that is what is mapped here.
 */
export function mapVedic(
  moonSignIndex: number,
  rashiName: string,
  nakshatraRuler: string,
): TraitReading[] {
  // Element is deliberately not used here. Western reading takes character from
  // the element; Vedic reading takes it from nakshatra rulership, which is the
  // sharper statement — so orientation, relation and structure come from the
  // ruler below rather than from the sign's element.
  const modality = modalityOfSign(moonSignIndex);
  const source = `Moon in ${rashiName}, ${nakshatraRuler} nakshatra`;

  const readings: TraitReading[] = [];

  // Odd rashis are traditionally active and male-natured, even ones receptive
  // and female-natured — a distinction Vedic astrology draws explicitly.
  const odd = moonSignIndex % 2 === 1;
  readings.push(reading('vedic', 'expression', odd ? 0.6 : -0.6, 'strong', source));

  readings.push(
    reading(
      'vedic',
      'stability',
      modality === 'Fixed' ? 0.8 : modality === 'Cardinal' ? -0.1 : -0.6,
      'strong',
      source,
    ),
  );

  // Nakshatra rulership carries the sharpest character statement in Vedic
  // reading, so it drives orientation and structure rather than the sign alone.
  const reasoning = ['Mercury', 'Saturn', 'Jupiter'].includes(nakshatraRuler);
  const feeling = ['Moon', 'Venus'].includes(nakshatraRuler);
  readings.push(
    reading('vedic', 'orientation', reasoning ? 0.7 : feeling ? -0.7 : 0, 'moderate', source),
  );

  const connective = ['Venus', 'Moon', 'Jupiter'].includes(nakshatraRuler);
  const solitary = ['Saturn', 'Ketu'].includes(nakshatraRuler);
  readings.push(
    reading('vedic', 'relation', connective ? 0.7 : solitary ? -0.7 : 0, 'moderate', source),
  );

  const structured = ['Saturn', 'Mercury'].includes(nakshatraRuler);
  const fluid = ['Rahu', 'Ketu', 'Moon'].includes(nakshatraRuler);
  readings.push(
    reading('vedic', 'structure', structured ? 0.8 : fluid ? -0.6 : 0.1, 'moderate', source),
  );

  return readings;
}

/**
 * Chinese Four Pillars, from the day master.
 *
 * BaZi reads the day stem as the person themselves, so its element and polarity
 * are the natural basis. Yang and yin is an explicit, primary classification in
 * the tradition, which is why polarity is rated strong.
 */
export function mapChinese(
  dayMasterElement: string,
  dayMasterYang: boolean,
  stemName: string,
): TraitReading[] {
  const source = `Day Master: ${stemName} (${dayMasterYang ? 'Yang' : 'Yin'} ${dayMasterElement})`;
  const readings: TraitReading[] = [];

  // Yang is outward and active, yin inward and receptive — the distinction the
  // whole system is built on.
  readings.push(reading('chinese', 'expression', dayMasterYang ? 0.8 : -0.8, 'strong', source));

  // Earth is the stabilising phase; Fire and Wood are the volatile ones.
  readings.push(
    reading(
      'chinese',
      'stability',
      dayMasterElement === 'Earth'
        ? 0.9
        : dayMasterElement === 'Metal'
          ? 0.5
          : dayMasterElement === 'Water'
            ? -0.2
            : dayMasterElement === 'Wood'
              ? -0.4
              : -0.7,
      'strong',
      source,
    ),
  );

  // Metal is associated with judgement and precision, Water with depth and
  // intuition.
  readings.push(
    reading(
      'chinese',
      'orientation',
      dayMasterElement === 'Metal'
        ? 0.8
        : dayMasterElement === 'Earth'
          ? 0.3
          : dayMasterElement === 'Water'
            ? -0.6
            : dayMasterElement === 'Fire'
              ? -0.4
              : 0,
      'moderate',
      source,
    ),
  );

  // Wood grows outward toward others; Metal cuts and separates.
  readings.push(
    reading(
      'chinese',
      'relation',
      dayMasterElement === 'Wood'
        ? 0.6
        : dayMasterElement === 'Water'
          ? 0.4
          : dayMasterElement === 'Metal'
            ? -0.6
            : 0,
      'indicative',
      source,
    ),
  );

  readings.push(
    reading(
      'chinese',
      'structure',
      dayMasterElement === 'Metal'
        ? 0.8
        : dayMasterElement === 'Earth'
          ? 0.6
          : dayMasterElement === 'Fire'
            ? -0.5
            : dayMasterElement === 'Water'
              ? -0.4
              : 0,
      'moderate',
      source,
    ),
  );

  return readings;
}

/**
 * Numerology, from the life path.
 *
 * The character of each number is the most firmly agreed content in numerology,
 * and unlike the other systems it is a single discrete value rather than a
 * combination — so the mapping is a table rather than a rule.
 *
 * Master numbers are given their own entries rather than being reduced, which
 * matters: an 11 is not a 2 in this tradition, and collapsing them would erase
 * the distinction the system rests on.
 */
const LIFE_PATH_TRAITS: Readonly<
  Record<
    number,
    {
      expression: number;
      stability: number;
      orientation: number;
      relation: number;
      structure: number;
    }
  >
> = {
  1: { expression: 0.8, stability: 0.2, orientation: 0.4, relation: -0.7, structure: 0.2 },
  2: { expression: -0.5, stability: 0.4, orientation: -0.6, relation: 0.8, structure: 0 },
  3: { expression: 0.9, stability: -0.5, orientation: -0.4, relation: 0.5, structure: -0.6 },
  4: { expression: -0.2, stability: 0.9, orientation: 0.6, relation: 0, structure: 0.9 },
  5: { expression: 0.7, stability: -0.9, orientation: 0.1, relation: 0.3, structure: -0.8 },
  6: { expression: 0.2, stability: 0.6, orientation: -0.4, relation: 0.9, structure: 0.4 },
  7: { expression: -0.8, stability: 0.3, orientation: 0.8, relation: -0.8, structure: 0.3 },
  8: { expression: 0.6, stability: 0.5, orientation: 0.7, relation: -0.2, structure: 0.7 },
  9: { expression: 0.3, stability: -0.2, orientation: -0.5, relation: 0.7, structure: -0.2 },
  11: { expression: -0.3, stability: -0.4, orientation: -0.9, relation: 0.6, structure: -0.3 },
  22: { expression: 0.4, stability: 0.7, orientation: 0.5, relation: 0.4, structure: 0.9 },
  33: { expression: 0.5, stability: 0.3, orientation: -0.6, relation: 0.9, structure: 0.2 },
};

export function mapNumerology(lifePath: number): TraitReading[] {
  const traits = LIFE_PATH_TRAITS[lifePath];
  const source = `Life Path ${lifePath}`;

  // Every value the numerology module can produce has an entry, which the tests
  // assert. Returning nothing rather than guessing is the correct response to
  // an unexpected input.
  if (!traits) return [];

  return [
    reading('numerology', 'expression', traits.expression, 'moderate', source),
    reading('numerology', 'stability', traits.stability, 'moderate', source),
    reading('numerology', 'orientation', traits.orientation, 'indicative', source),
    reading('numerology', 'relation', traits.relation, 'moderate', source),
    reading('numerology', 'structure', traits.structure, 'moderate', source),
  ];
}

/**
 * Human Design, from the profile lines.
 *
 * The six lines carry fixed characters in the system, and the profile — the
 * pairing of personality and design lines — is the single most-cited feature of
 * a bodygraph. Only the dimensions the lines genuinely speak to are mapped;
 * inventing values for the rest would add noise rather than information.
 */
const LINE_TRAITS: Readonly<Record<number, { expression: number; relation: number }>> = {
  1: { expression: -0.6, relation: -0.5 }, // Investigator: inward, foundational
  2: { expression: -0.7, relation: -0.6 }, // Hermit: needs solitude
  3: { expression: 0.4, relation: 0.2 }, // Martyr: learns by trial
  4: { expression: 0.3, relation: 0.9 }, // Opportunist: works through network
  5: { expression: 0.7, relation: 0.5 }, // Heretic: projected onto, practical
  6: { expression: 0.1, relation: 0.3 }, // Role Model: observer then guide
};

export function mapHumanDesign(personalityLine: number, designLine: number): TraitReading[] {
  const personality = LINE_TRAITS[personalityLine];
  const design = LINE_TRAITS[designLine];
  if (!personality || !design) return [];

  const source = `Profile ${personalityLine}/${designLine}`;

  // The personality line is conscious and the design line unconscious, so the
  // conscious one is weighted more heavily in how a person presents.
  const blend = (a: number, b: number): number => a * 0.65 + b * 0.35;

  return [
    reading(
      'humanDesign',
      'expression',
      blend(personality.expression, design.expression),
      'moderate',
      source,
    ),
    reading(
      'humanDesign',
      'relation',
      blend(personality.relation, design.relation),
      'moderate',
      source,
    ),
  ];
}
