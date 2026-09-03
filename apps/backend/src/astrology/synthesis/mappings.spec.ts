/**
 * Torchlight — trait vocabulary and mappings — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  elementOfSign,
  mapChinese,
  mapHumanDesign,
  mapNumerology,
  mapVedic,
  mapWestern,
  modalityOfSign,
} from './mappings';
import {
  CONFIDENCE_LEVELS,
  CONFIDENCE_WEIGHT,
  DIMENSION_POLES,
  TRAIT_DIMENSIONS,
  clampTraitValue,
  poleFor,
  reading,
} from './traits';

/**
 * The mappings are where a comparison between traditions becomes possible, and
 * therefore where invention would be easiest to hide.
 *
 * The constraint that keeps this honest is that every mapping rests on a
 * classification the tradition already makes for its own purposes — the
 * modality of a Western sign, the yang or yin of a Chinese stem, the odd or
 * even of a Vedic rashi. Those classifications are independently checkable, and
 * they are checked here.
 *
 * What the tests cannot establish is that two traditions *mean* the same thing
 * by their distinctions. Nothing could. The claim made is narrower: that both
 * are statements about the same axis, and that pointing the same way or
 * different ways along it is worth reporting.
 */

describe('trait vocabulary', () => {
  it('defines poles and a question for every dimension', () => {
    for (const dimension of TRAIT_DIMENSIONS) {
      const poles = DIMENSION_POLES[dimension];
      expect(poles.low).toBeTruthy();
      expect(poles.high).toBeTruthy();
      expect(poles.question).toBeTruthy();
      expect(poles.low).not.toBe(poles.high);
    }
  });

  it('orders confidence weights strictly', () => {
    expect(CONFIDENCE_WEIGHT.strong).toBeGreaterThan(CONFIDENCE_WEIGHT.moderate);
    expect(CONFIDENCE_WEIGHT.moderate).toBeGreaterThan(CONFIDENCE_WEIGHT.indicative);
    for (const level of CONFIDENCE_LEVELS) {
      expect(CONFIDENCE_WEIGHT[level]).toBeGreaterThan(0);
      expect(CONFIDENCE_WEIGHT[level]).toBeLessThanOrEqual(1);
    }
  });

  it('lets one strong reading outweigh two indicative ones', () => {
    // Deliberate: a tradition's central classification should not be outvoted
    // by two tentative ones.
    expect(CONFIDENCE_WEIGHT.strong).toBeGreaterThan(CONFIDENCE_WEIGHT.indicative * 2);
  });
});

describe('clampTraitValue', () => {
  it('bounds values to the unit range', () => {
    expect(clampTraitValue(5)).toBe(1);
    expect(clampTraitValue(-5)).toBe(-1);
    expect(clampTraitValue(0.5)).toBe(0.5);
  });

  it('treats a non-number as neutral rather than propagating it', () => {
    expect(clampTraitValue(Number.NaN)).toBe(0);
  });
});

describe('reading', () => {
  it('clamps on construction, so no mapping can emit out of range', () => {
    expect(reading('s', 'expression', 9, 'strong', 'src').value).toBe(1);
    expect(reading('s', 'expression', -9, 'strong', 'src').value).toBe(-1);
  });
});

describe('poleFor', () => {
  it('names the leaning pole', () => {
    expect(poleFor('expression', 0.5)).toBe(DIMENSION_POLES.expression.high);
    expect(poleFor('expression', -0.5)).toBe(DIMENSION_POLES.expression.low);
  });

  it('returns null near the centre rather than overstating a weak lean', () => {
    expect(poleFor('expression', 0.05)).toBeNull();
    expect(poleFor('expression', -0.05)).toBeNull();
    expect(poleFor('expression', 0)).toBeNull();
  });
});

describe('sign classification', () => {
  it('cycles elements every four signs from Aries', () => {
    expect(elementOfSign(1)).toBe('Fire'); // Aries
    expect(elementOfSign(2)).toBe('Earth'); // Taurus
    expect(elementOfSign(3)).toBe('Air'); // Gemini
    expect(elementOfSign(4)).toBe('Water'); // Cancer
    expect(elementOfSign(5)).toBe('Fire'); // Leo
  });

  it('gives each element exactly three signs', () => {
    const counts = new Map<string, number>();
    for (let sign = 1; sign <= 12; sign += 1) {
      const element = elementOfSign(sign);
      counts.set(element, (counts.get(element) ?? 0) + 1);
    }
    expect(counts.size).toBe(4);
    for (const count of counts.values()) {
      expect(count).toBe(3);
    }
  });

  it('cycles modalities every three signs from Aries', () => {
    expect(modalityOfSign(1)).toBe('Cardinal');
    expect(modalityOfSign(2)).toBe('Fixed');
    expect(modalityOfSign(3)).toBe('Mutable');
    expect(modalityOfSign(4)).toBe('Cardinal');
  });

  it('gives each modality exactly four signs', () => {
    const counts = new Map<string, number>();
    for (let sign = 1; sign <= 12; sign += 1) {
      const modality = modalityOfSign(sign);
      counts.set(modality, (counts.get(modality) ?? 0) + 1);
    }
    expect(counts.size).toBe(3);
    for (const count of counts.values()) {
      expect(count).toBe(4);
    }
  });

  it('pairs every element-modality combination exactly once', () => {
    // Twelve signs, four elements, three modalities — each pair occurring once
    // is the defining structure of the zodiac, and a good check that both
    // cycles are correct.
    const pairs = new Set<string>();
    for (let sign = 1; sign <= 12; sign += 1) {
      pairs.add(`${elementOfSign(sign)}-${modalityOfSign(sign)}`);
    }
    expect(pairs.size).toBe(12);
  });
});

describe('mapWestern', () => {
  it('maps every sign without gaps', () => {
    for (let sign = 1; sign <= 12; sign += 1) {
      const readings = mapWestern(sign, `Sign${sign}`);
      expect(readings.length).toBe(5);
      for (const item of readings) {
        expect(item.system).toBe('western');
        expect(item.value).toBeGreaterThanOrEqual(-1);
        expect(item.value).toBeLessThanOrEqual(1);
        expect(item.source).toContain(`Sign${sign}`);
      }
    }
  });

  it('reads fire and air signs as more outgoing than earth and water', () => {
    const fire = mapWestern(1, 'Aries').find((r) => r.dimension === 'expression');
    const water = mapWestern(4, 'Cancer').find((r) => r.dimension === 'expression');
    expect(fire?.value).toBeGreaterThan(water?.value as number);
  });

  it('reads fixed signs as steadier than mutable ones', () => {
    const fixed = mapWestern(2, 'Taurus').find((r) => r.dimension === 'stability');
    const mutable = mapWestern(3, 'Gemini').find((r) => r.dimension === 'stability');
    expect(fixed?.value).toBeGreaterThan(mutable?.value as number);
  });

  it('rates only the primary classifications as strong', () => {
    // Element and modality are central to Western reading; the rest are
    // secondary and must not carry the same weight.
    const strong = mapWestern(1, 'Aries').filter((r) => r.confidence === 'strong');
    expect(strong.map((r) => r.dimension).sort()).toEqual(['expression', 'stability']);
  });
});

describe('mapVedic', () => {
  it('maps every sign and every nakshatra ruler', () => {
    const rulers = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    for (let sign = 1; sign <= 12; sign += 1) {
      for (const ruler of rulers) {
        const readings = mapVedic(sign, `Rashi${sign}`, ruler);
        expect(readings.length).toBe(5);
        for (const item of readings) {
          expect(item.value).toBeGreaterThanOrEqual(-1);
          expect(item.value).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it('reads odd rashis as more active than even ones', () => {
    // Vedic astrology draws this distinction explicitly.
    const odd = mapVedic(1, 'Mesha', 'Mars').find((r) => r.dimension === 'expression');
    const even = mapVedic(2, 'Vrishabha', 'Mars').find((r) => r.dimension === 'expression');
    expect(odd?.value).toBeGreaterThan(0);
    expect(even?.value).toBeLessThan(0);
  });

  it('names the placement it read', () => {
    const readings = mapVedic(4, 'Karka', 'Jupiter');
    for (const item of readings) {
      expect(item.source).toContain('Karka');
      expect(item.source).toContain('Jupiter');
    }
  });
});

describe('mapChinese', () => {
  it('maps every element and polarity', () => {
    for (const element of ['Wood', 'Fire', 'Earth', 'Metal', 'Water']) {
      for (const yang of [true, false]) {
        const readings = mapChinese(element, yang, 'Stem');
        expect(readings.length).toBe(5);
        for (const item of readings) {
          expect(item.value).toBeGreaterThanOrEqual(-1);
          expect(item.value).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it('reads yang as outgoing and yin as inward', () => {
    // The distinction the whole system is built on, hence rated strong.
    const yang = mapChinese('Fire', true, 'Bing').find((r) => r.dimension === 'expression');
    const yin = mapChinese('Fire', false, 'Ding').find((r) => r.dimension === 'expression');

    expect(yang?.value).toBeGreaterThan(0);
    expect(yin?.value).toBeLessThan(0);
    expect(yang?.confidence).toBe('strong');
  });

  it('reads Earth as the steadiest phase', () => {
    const earth = mapChinese('Earth', true, 'Wu').find((r) => r.dimension === 'stability');
    const fire = mapChinese('Fire', true, 'Bing').find((r) => r.dimension === 'stability');
    expect(earth?.value).toBeGreaterThan(fire?.value as number);
  });

  it('records the polarity in its source', () => {
    expect(mapChinese('Metal', true, 'Geng')[0]?.source).toContain('Yang');
    expect(mapChinese('Metal', false, 'Xin')[0]?.source).toContain('Yin');
  });
});

describe('mapNumerology', () => {
  it('maps every value the numerology module can produce', () => {
    // Nine single digits plus three master numbers. A missing entry would
    // silently drop numerology from a person's synthesis.
    for (const lifePath of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]) {
      const readings = mapNumerology(lifePath);
      expect(readings.length).toBe(5);
      expect(new Set(readings.map((r) => r.dimension)).size).toBe(5);
    }
  });

  it('keeps master numbers distinct from their reductions', () => {
    // An 11 is not a 2 in this tradition, and collapsing them would erase the
    // distinction the system rests on.
    const eleven = mapNumerology(11).find((r) => r.dimension === 'orientation');
    const two = mapNumerology(2).find((r) => r.dimension === 'orientation');
    expect(eleven?.value).not.toBe(two?.value);
  });

  it('returns nothing for a value it does not recognise', () => {
    // Silence is the correct response to unexpected input; a guess is not.
    expect(mapNumerology(13)).toHaveLength(0);
    expect(mapNumerology(0)).toHaveLength(0);
  });

  it('reads 7 as inward and 3 as outgoing', () => {
    const seven = mapNumerology(7).find((r) => r.dimension === 'expression');
    const three = mapNumerology(3).find((r) => r.dimension === 'expression');
    expect(seven?.value).toBeLessThan(0);
    expect(three?.value).toBeGreaterThan(0);
  });
});

describe('mapHumanDesign', () => {
  it('maps all thirty-six profiles', () => {
    for (let personality = 1; personality <= 6; personality += 1) {
      for (let design = 1; design <= 6; design += 1) {
        const readings = mapHumanDesign(personality, design);
        expect(readings.length).toBe(2);
        expect(readings[0]?.source).toBe(`Profile ${personality}/${design}`);
      }
    }
  });

  it('maps only the dimensions the lines genuinely speak to', () => {
    // Inventing values for the other three would add noise, not information.
    const dimensions = mapHumanDesign(1, 4).map((r) => r.dimension);
    expect(dimensions.sort()).toEqual(['expression', 'relation']);
  });

  it('weights the conscious line more heavily than the unconscious one', () => {
    // Personality is conscious, design unconscious, so 2/4 and 4/2 must differ.
    const twoFour = mapHumanDesign(2, 4).find((r) => r.dimension === 'relation');
    const fourTwo = mapHumanDesign(4, 2).find((r) => r.dimension === 'relation');
    expect(twoFour?.value).not.toBeCloseTo(fourTwo?.value as number, 5);
    expect(fourTwo?.value).toBeGreaterThan(twoFour?.value as number);
  });

  it('returns nothing for an impossible line', () => {
    expect(mapHumanDesign(0, 4)).toHaveLength(0);
    expect(mapHumanDesign(1, 7)).toHaveLength(0);
  });
});
