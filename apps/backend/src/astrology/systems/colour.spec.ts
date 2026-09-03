/**
 * Torchlight — colour correspondences — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  FIVE_PHASES,
  GRAHA_COLOURS,
  PHASE_COLOURS,
  allGrahaColours,
  controls,
  generates,
  recommendColours,
  type Phase,
} from './colour';
import { NAVARATNA_ORDER } from './gemstone';

/**
 * Colour is a derived layer, so most of its content is convention. The part
 * that is genuinely checkable is the Chinese five-phase structure, which has
 * strict properties:
 *
 *   - the generating cycle is closed and steps one place
 *   - the controlling cycle is closed and steps two places
 *   - the two never coincide, and neither maps a phase to itself
 *
 * Confusing the generating and controlling cycles is the usual error in
 * five-phase reasoning, and these assertions would catch it.
 */

describe('graha colours', () => {
  it('covers all nine grahas', () => {
    expect(Object.keys(GRAHA_COLOURS)).toHaveLength(9);
    for (const graha of NAVARATNA_ORDER) {
      expect(GRAHA_COLOURS[graha]).toBeDefined();
    }
  });

  it('gives each colour a name and a well-formed hex value', () => {
    for (const graha of NAVARATNA_ORDER) {
      const colour = GRAHA_COLOURS[graha];
      expect(colour.name).toBeTruthy();
      expect(colour.hex).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it('lists every graha in Navaratna order', () => {
    expect(allGrahaColours().map((entry) => entry.graha)).toEqual([...NAVARATNA_ORDER]);
  });
});

describe('the five phases', () => {
  it('has exactly five', () => {
    expect(FIVE_PHASES).toHaveLength(5);
    expect(Object.keys(PHASE_COLOURS)).toHaveLength(5);
  });

  it('gives each phase a colour', () => {
    for (const phase of FIVE_PHASES) {
      expect(PHASE_COLOURS[phase]).toBeDefined();
      expect(PHASE_COLOURS[phase].hex).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it('uses the traditional phase colours', () => {
    // Fixed in Chinese tradition and identical in Feng Shui and BaZi.
    expect(PHASE_COLOURS.Wood.name).toBe('Green');
    expect(PHASE_COLOURS.Fire.name).toBe('Red');
    expect(PHASE_COLOURS.Earth.name).toBe('Yellow');
    expect(PHASE_COLOURS.Metal.name).toBe('White');
    expect(PHASE_COLOURS.Water.name).toBe('Black');
  });
});

describe('the generating cycle', () => {
  it('follows the traditional sequence', () => {
    // Wood feeds Fire, Fire makes ash, ash bears Metal, Metal carries Water,
    // Water nourishes Wood.
    expect(generates('Wood')).toBe('Fire');
    expect(generates('Fire')).toBe('Earth');
    expect(generates('Earth')).toBe('Metal');
    expect(generates('Metal')).toBe('Water');
    expect(generates('Water')).toBe('Wood');
  });

  it('closes after five steps', () => {
    for (const phase of FIVE_PHASES) {
      let current: Phase = phase;
      for (let step = 0; step < 5; step += 1) {
        current = generates(current);
      }
      expect(current).toBe(phase);
    }
  });

  it('visits every phase from any starting point', () => {
    const seen = new Set<Phase>();
    let current: Phase = 'Earth';
    for (let step = 0; step < 5; step += 1) {
      seen.add(current);
      current = generates(current);
    }
    expect(seen.size).toBe(5);
  });
});

describe('the controlling cycle', () => {
  it('follows the traditional sequence', () => {
    // Wood parts Earth, Earth dams Water, Water quenches Fire, Fire melts
    // Metal, Metal cuts Wood.
    expect(controls('Wood')).toBe('Earth');
    expect(controls('Earth')).toBe('Water');
    expect(controls('Water')).toBe('Fire');
    expect(controls('Fire')).toBe('Metal');
    expect(controls('Metal')).toBe('Wood');
  });

  it('closes after five steps', () => {
    for (const phase of FIVE_PHASES) {
      let current: Phase = phase;
      for (let step = 0; step < 5; step += 1) {
        current = controls(current);
      }
      expect(current).toBe(phase);
    }
  });
});

describe('the two cycles together', () => {
  it('never coincide', () => {
    // Confusing generating with controlling is the usual five-phase error.
    for (const phase of FIVE_PHASES) {
      expect(generates(phase)).not.toBe(controls(phase));
    }
  });

  it('never map a phase to itself', () => {
    for (const phase of FIVE_PHASES) {
      expect(generates(phase)).not.toBe(phase);
      expect(controls(phase)).not.toBe(phase);
    }
  });
});

describe('recommendColours', () => {
  it('returns the ascendant and Moon-sign rulers', () => {
    const result = recommendColours({ ascendantSignIndex: 1, moonSignIndex: 4 });

    expect(result).toHaveLength(2);
    expect(result[0]?.basis).toBe('ascendant-ruler');
    expect(result[0]?.source).toBe('Mars'); // Mesha
    expect(result[1]?.basis).toBe('moon-sign-ruler');
    expect(result[1]?.source).toBe('Moon'); // Karka
  });

  it('adds the day master phase when one is supplied', () => {
    const result = recommendColours({
      ascendantSignIndex: 1,
      moonSignIndex: 4,
      dayMasterElement: 'Water',
    });

    expect(result).toHaveLength(3);
    expect(result[2]?.basis).toBe('day-master-phase');
    expect(result[2]?.colour.name).toBe('Black');
  });

  it('keeps the two traditions separate rather than blending them', () => {
    // The Vedic and Chinese schemes disagree, so each recommendation carries
    // its own basis and neither is merged into the other.
    const result = recommendColours({
      ascendantSignIndex: 5,
      moonSignIndex: 5,
      dayMasterElement: 'Fire',
    });
    const bases = result.map((entry) => entry.basis);
    expect(new Set(bases).size).toBe(bases.length);
  });

  it('omits an unrecognised element rather than guessing', () => {
    const result = recommendColours({
      ascendantSignIndex: 1,
      moonSignIndex: 4,
      dayMasterElement: 'Aether',
    });
    expect(result).toHaveLength(2);
  });

  it('names its source so a reading can explain itself', () => {
    for (const entry of recommendColours({ ascendantSignIndex: 9, moonSignIndex: 2 })) {
      expect(entry.source).toBeTruthy();
    }
  });

  it('works for every combination of ascendant and Moon sign', () => {
    for (let ascendant = 1; ascendant <= 12; ascendant += 1) {
      for (let moon = 1; moon <= 12; moon += 1) {
        const result = recommendColours({ ascendantSignIndex: ascendant, moonSignIndex: moon });
        expect(result).toHaveLength(2);
        for (const entry of result) {
          expect(entry.colour.hex).toMatch(/^#[0-9A-F]{6}$/);
        }
      }
    }
  });
});
