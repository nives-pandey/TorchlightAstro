/**
 * Torchlight — Vaastu and Feng Shui — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  BAGUA,
  BRAHMASTHAN,
  DIRECTIONS,
  VAASTU_ZONES,
  directionOf,
  elementsAgree,
  readAllDirections,
  readDirection,
  type Direction,
} from './space';
import { FIVE_PHASES } from './colour';

/**
 * These are the two systems that read a place rather than a birth, so the
 * checkable content is the compass geometry and the structure of each
 * tradition's table.
 *
 * The geometry has one trap worth asserting directly: north spans 337.5° to
 * 22.5°, so it straddles zero. A naive `floor(bearing / 45)` puts true north on
 * a sector boundary instead of at the centre of its own sector, which shifts
 * every subsequent direction by half a sector.
 */

describe('compass directions', () => {
  it('has eight, clockwise from north', () => {
    expect(DIRECTIONS).toHaveLength(8);
    expect(DIRECTIONS[0]).toBe('North');
    expect(DIRECTIONS[2]).toBe('East');
    expect(DIRECTIONS[4]).toBe('South');
    expect(DIRECTIONS[6]).toBe('West');
  });

  it('centres north on zero degrees rather than starting it there', () => {
    expect(directionOf(0)).toBe('North');
    expect(directionOf(359)).toBe('North');
    expect(directionOf(22)).toBe('North');
    expect(directionOf(23)).toBe('Northeast');
    expect(directionOf(338)).toBe('North');
    expect(directionOf(337)).toBe('Northwest');
  });

  it('places each cardinal point at its own bearing', () => {
    expect(directionOf(90)).toBe('East');
    expect(directionOf(180)).toBe('South');
    expect(directionOf(270)).toBe('West');
  });

  it('gives every direction exactly forty-five degrees', () => {
    const counts = new Map<Direction, number>();
    // Tenth-of-a-degree steps, so each sector should collect 450.
    for (let tenths = 0; tenths < 3600; tenths += 1) {
      const direction = directionOf(tenths / 10);
      counts.set(direction, (counts.get(direction) ?? 0) + 1);
    }
    expect(counts.size).toBe(8);
    for (const count of counts.values()) {
      expect(count).toBe(450);
    }
  });

  it('normalises bearings outside the circle', () => {
    expect(directionOf(360)).toBe(directionOf(0));
    expect(directionOf(-90)).toBe(directionOf(270));
    expect(directionOf(450)).toBe(directionOf(90));
  });
});

describe('Vaastu zones', () => {
  it('covers all eight directions', () => {
    for (const direction of DIRECTIONS) {
      expect(VAASTU_ZONES[direction]).toBeDefined();
      expect(VAASTU_ZONES[direction].direction).toBe(direction);
    }
  });

  it('gives each zone a deity, an element and favourable rooms', () => {
    for (const direction of DIRECTIONS) {
      const zone = VAASTU_ZONES[direction];
      expect(zone.deity).toBeTruthy();
      expect(zone.element).toBeTruthy();
      expect(zone.governs).toBeTruthy();
      expect(zone.favourable.length).toBeGreaterThan(0);
    }
  });

  it('names a distinct deity for each direction', () => {
    const deities = DIRECTIONS.map((direction) => VAASTU_ZONES[direction].deity);
    expect(new Set(deities).size).toBe(8);
  });

  it('places Agni in the southeast and puts the kitchen there', () => {
    // The fire deity governs the southeast, which is why the kitchen belongs
    // there — one of the most firmly fixed rules in Vaastu.
    expect(VAASTU_ZONES.Southeast.deity).toBe('Agni');
    expect(VAASTU_ZONES.Southeast.element).toBe('Fire');
    expect(VAASTU_ZONES.Southeast.favourable).toContain('Kitchen');
  });

  it('uses only the five Indian elements', () => {
    const allowed = new Set(['Earth', 'Water', 'Fire', 'Air', 'Space']);
    for (const direction of DIRECTIONS) {
      expect(allowed.has(VAASTU_ZONES[direction].element)).toBe(true);
    }
  });

  it('keeps the Brahmasthan out of the directional table', () => {
    // The centre takes no bearing and has no favourable rooms — it is meant to
    // be left open — so it is not a ninth direction.
    expect(BRAHMASTHAN.element).toBe('Space');
    expect(DIRECTIONS).not.toContain('Brahmasthan' as unknown as Direction);
  });
});

describe('the Bagua', () => {
  it('covers all eight directions', () => {
    for (const direction of DIRECTIONS) {
      expect(BAGUA[direction]).toBeDefined();
      expect(BAGUA[direction].direction).toBe(direction);
    }
  });

  it('names eight distinct trigrams', () => {
    const trigrams = DIRECTIONS.map((direction) => BAGUA[direction].trigram);
    expect(new Set(trigrams).size).toBe(8);
  });

  it('assigns eight distinct life areas', () => {
    const areas = DIRECTIONS.map((direction) => BAGUA[direction].lifeArea);
    expect(new Set(areas).size).toBe(8);
  });

  it('uses only the five Chinese phases', () => {
    for (const direction of DIRECTIONS) {
      expect(FIVE_PHASES).toContain(BAGUA[direction].phase);
    }
  });

  it('distributes the phases as the Later Heaven arrangement does', () => {
    // Eight sectors across five phases: Water and Fire take one each, while
    // Earth, Wood and Metal take two. A different distribution would mean a
    // different arrangement, most likely Earlier Heaven.
    const counts = new Map<string, number>();
    for (const direction of DIRECTIONS) {
      const phase = BAGUA[direction].phase;
      counts.set(phase, (counts.get(phase) ?? 0) + 1);
    }
    expect(counts.get('Water')).toBe(1);
    expect(counts.get('Fire')).toBe(1);
    expect(counts.get('Earth')).toBe(2);
    expect(counts.get('Wood')).toBe(2);
    expect(counts.get('Metal')).toBe(2);
  });

  it('places Kan in the north and Li in the south', () => {
    // The water and fire trigrams sit opposite each other on the north-south
    // axis, which fixes the orientation of the whole arrangement.
    expect(BAGUA.North.trigram).toBe('Kan');
    expect(BAGUA.North.phase).toBe('Water');
    expect(BAGUA.South.trigram).toBe('Li');
    expect(BAGUA.South.phase).toBe('Fire');
  });
});

describe('reading a direction', () => {
  it('returns both traditions side by side', () => {
    const reading = readDirection(135);
    expect(reading.direction).toBe('Southeast');
    expect(reading.vaastu.deity).toBe('Agni');
    expect(reading.bagua.trigram).toBe('Xun');
  });

  it('normalises the bearing it reports', () => {
    expect(readDirection(-45).bearing).toBe(315);
    expect(readDirection(400).bearing).toBe(40);
  });

  it('covers every direction exactly once', () => {
    const readings = readAllDirections();
    expect(readings).toHaveLength(8);
    expect(new Set(readings.map((r) => r.direction)).size).toBe(8);
  });
});

describe('elementsAgree', () => {
  it('reports agreement only where the element sets overlap', () => {
    // Air and Space have no Chinese counterpart; Metal and Wood have no Indian
    // one. Only Earth, Water and Fire are comparable at all.
    expect(elementsAgree('North')).toBe(true); // Water in both
    expect(elementsAgree('Southwest')).toBe(true); // Earth in both
    expect(elementsAgree('South')).toBe(false); // Earth against Fire
  });

  it('returns null rather than guessing where no counterpart exists', () => {
    expect(elementsAgree('East')).toBeNull(); // Air against Wood
    expect(elementsAgree('West')).toBeNull(); // Water against Metal
    expect(elementsAgree('Northwest')).toBeNull(); // Air against Metal
  });

  it('never claims agreement between incomparable elements', () => {
    for (const direction of DIRECTIONS) {
      const result = elementsAgree(direction);
      if (result !== null) {
        const vaastu = VAASTU_ZONES[direction].element;
        const bagua = BAGUA[direction].phase as string;
        expect(['Earth', 'Water', 'Fire']).toContain(vaastu);
        expect(['Earth', 'Water', 'Fire']).toContain(bagua);
      }
    }
  });
});
