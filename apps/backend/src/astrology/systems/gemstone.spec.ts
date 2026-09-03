/**
 * Torchlight — gemstone correspondences — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  NAVARATNA,
  NAVARATNA_ORDER,
  dayForGraha,
  recommendGemstones,
  rulerOfSign,
  type Graha,
} from './gemstone';

/**
 * A derived layer computes nothing astronomical, so the claim it can make is
 * narrower: that its table is complete and internally consistent, and that its
 * logic reads real chart data rather than inventing it.
 *
 * The sign rulerships are the part that *is* independently checkable, because
 * Vedic rulership has strict structure: the Sun and Moon rule one sign each,
 * the other five planets rule two — one odd-numbered, one even — and the shadow
 * grahas Rahu and Ketu rule none. A transcription error in that list would
 * break at least one of those properties.
 */

describe('the Navaratna', () => {
  it('names all nine grahas', () => {
    expect(NAVARATNA_ORDER).toHaveLength(9);
    expect(Object.keys(NAVARATNA)).toHaveLength(9);
  });

  it('includes the two shadow grahas', () => {
    expect(NAVARATNA_ORDER).toContain('Rahu');
    expect(NAVARATNA_ORDER).toContain('Ketu');
  });

  it('has an entry for every graha in the order', () => {
    for (const graha of NAVARATNA_ORDER) {
      expect(NAVARATNA[graha]).toBeDefined();
      expect(NAVARATNA[graha].graha).toBe(graha);
    }
  });

  it('assigns a distinct stone to each graha', () => {
    const stones = NAVARATNA_ORDER.map((graha) => NAVARATNA[graha].stone);
    expect(new Set(stones).size).toBe(9);
  });

  it('gives each entry a complete set of attributes', () => {
    for (const graha of NAVARATNA_ORDER) {
      const entry = NAVARATNA[graha];
      expect(entry.stone).toBeTruthy();
      expect(entry.sanskrit).toBeTruthy();
      expect(entry.finger).toBeTruthy();
      expect(entry.metal).toBeTruthy();
      expect(entry.day).toBeTruthy();
    }
  });

  it('uses only real weekdays', () => {
    const days = new Set([
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]);
    for (const graha of NAVARATNA_ORDER) {
      expect(days.has(NAVARATNA[graha].day)).toBe(true);
    }
  });

  it('pairs the seven classical grahas with their own weekdays', () => {
    // The names of the days derive from these rulerships, so this is a genuine
    // external check rather than a restatement of the table.
    expect(NAVARATNA.Sun.day).toBe('Sunday');
    expect(NAVARATNA.Moon.day).toBe('Monday');
    expect(NAVARATNA.Mars.day).toBe('Tuesday');
    expect(NAVARATNA.Mercury.day).toBe('Wednesday');
    expect(NAVARATNA.Jupiter.day).toBe('Thursday');
    expect(NAVARATNA.Venus.day).toBe('Friday');
    expect(NAVARATNA.Saturn.day).toBe('Saturday');
  });
});

describe('sign rulership', () => {
  it('returns a valid graha for every sign', () => {
    for (let sign = 1; sign <= 12; sign += 1) {
      expect(NAVARATNA[rulerOfSign(sign)]).toBeDefined();
    }
  });

  it('never lets a shadow graha rule a sign', () => {
    // Rahu and Ketu have no sign rulership in classical Vedic astrology.
    for (let sign = 1; sign <= 12; sign += 1) {
      expect(['Rahu', 'Ketu']).not.toContain(rulerOfSign(sign));
    }
  });

  it('gives the Sun and Moon one sign each', () => {
    const counts = new Map<Graha, number>();
    for (let sign = 1; sign <= 12; sign += 1) {
      const ruler = rulerOfSign(sign);
      counts.set(ruler, (counts.get(ruler) ?? 0) + 1);
    }
    expect(counts.get('Sun')).toBe(1);
    expect(counts.get('Moon')).toBe(1);
  });

  it('gives the other five planets two signs each', () => {
    const counts = new Map<Graha, number>();
    for (let sign = 1; sign <= 12; sign += 1) {
      const ruler = rulerOfSign(sign);
      counts.set(ruler, (counts.get(ruler) ?? 0) + 1);
    }
    for (const planet of ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as Graha[]) {
      expect(counts.get(planet)).toBe(2);
    }
  });

  it('pairs each dual ruler with one odd and one even sign', () => {
    // A defining symmetry of the rulership scheme, and the property most likely
    // to break if the list were mistranscribed.
    for (const planet of ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as Graha[]) {
      const signs: number[] = [];
      for (let sign = 1; sign <= 12; sign += 1) {
        if (rulerOfSign(sign) === planet) signs.push(sign);
      }
      expect(signs.filter((s) => s % 2 === 1)).toHaveLength(1);
      expect(signs.filter((s) => s % 2 === 0)).toHaveLength(1);
    }
  });

  it('places the luminaries in their own signs', () => {
    expect(rulerOfSign(5)).toBe('Sun'); // Simha
    expect(rulerOfSign(4)).toBe('Moon'); // Karka
  });
});

describe('recommendGemstones', () => {
  it('returns the ascendant and Moon-sign rulers', () => {
    const result = recommendGemstones({ ascendantSignIndex: 1, moonSignIndex: 4 });

    expect(result).toHaveLength(2);
    expect(result[0]?.basis).toBe('ascendant-ruler');
    expect(result[0]?.gemstone.stone).toBe('Red Coral'); // Mesha, ruled by Mars
    expect(result[1]?.basis).toBe('moon-sign-ruler');
    expect(result[1]?.gemstone.stone).toBe('Pearl'); // Karka, ruled by the Moon
  });

  it('adds the dasha lord when one is supplied', () => {
    const result = recommendGemstones({
      ascendantSignIndex: 1,
      moonSignIndex: 4,
      currentDashaLord: 'Jupiter',
    });

    expect(result).toHaveLength(3);
    expect(result[2]?.basis).toBe('current-dasha');
    expect(result[2]?.gemstone.stone).toBe('Yellow Sapphire');
  });

  it('accepts the shadow grahas as dasha lords', () => {
    // Rahu and Ketu rule no sign but do run mahadashas, so they can only ever
    // reach this function through that basis.
    const result = recommendGemstones({
      ascendantSignIndex: 1,
      moonSignIndex: 4,
      currentDashaLord: 'Ketu',
    });
    expect(result[2]?.gemstone.stone).toBe("Cat's Eye");
  });

  it('omits an unrecognised dasha lord rather than guessing', () => {
    const result = recommendGemstones({
      ascendantSignIndex: 1,
      moonSignIndex: 4,
      currentDashaLord: 'Chiron',
    });
    expect(result).toHaveLength(2);
  });

  it('keeps a duplicate when two bases agree', () => {
    // Agreement is meaningful — a reading would state it more strongly — so it
    // must not be silently collapsed.
    const result = recommendGemstones({ ascendantSignIndex: 1, moonSignIndex: 8 });
    expect(result).toHaveLength(2);
    expect(result[0]?.gemstone.stone).toBe(result[1]?.gemstone.stone);
  });

  it('works for every combination of ascendant and Moon sign', () => {
    for (let ascendant = 1; ascendant <= 12; ascendant += 1) {
      for (let moon = 1; moon <= 12; moon += 1) {
        const result = recommendGemstones({ ascendantSignIndex: ascendant, moonSignIndex: moon });
        expect(result).toHaveLength(2);
        for (const recommendation of result) {
          expect(recommendation.gemstone.stone).toBeTruthy();
        }
      }
    }
  });
});

describe('dayForGraha', () => {
  it('agrees with the table', () => {
    for (const graha of NAVARATNA_ORDER) {
      expect(dayForGraha(graha)).toBe(NAVARATNA[graha].day);
    }
  });
});
