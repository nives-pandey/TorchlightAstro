/**
 * Torchlight — Vaastu and Feng Shui
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { FIVE_PHASES, type Phase } from './colour';

/**
 * Vaastu Shastra and Feng Shui — the two systems that read a *place*.
 *
 * Every other system in this engine takes a birth. These take a building: its
 * orientation, and which direction each room faces. That makes them structurally
 * different rather than merely different in content, and the difference is
 * worth stating plainly — a reading cannot produce Vaastu guidance from a birth
 * date alone, and an interface that implies otherwise is lying to the user.
 *
 * The two systems are kept apart for the same reason the colour tables are.
 * Both divide a building by direction, but they assign different meanings, use
 * different element schemes, and disagree about which direction is auspicious
 * for what. Blending them yields a scheme belonging to neither tradition.
 *
 *   - **Vaastu** works from eight directions plus the centre (Brahmasthan),
 *     each governed by a deity and one of the five Indian elements.
 *   - **Feng Shui** works from the Bagua, eight trigrams around a centre, each
 *     carrying a life area and one of the five Chinese phases.
 *
 * The one place they genuinely align is the compass itself, which is why
 * direction is modelled once and shared.
 */

/** The eight compass directions, clockwise from north. */
export const DIRECTIONS = [
  'North',
  'Northeast',
  'East',
  'Southeast',
  'South',
  'Southwest',
  'West',
  'Northwest',
] as const;

export type Direction = (typeof DIRECTIONS)[number];

/** Degrees per direction sector. */
const SECTOR_SPAN = 360 / 8;

/**
 * The direction a bearing falls in.
 *
 * North spans 337.5° to 22.5°, so the sectors are offset by half a span. A
 * naive `floor(bearing / 45)` would put true north on a boundary rather than at
 * the centre of its own sector.
 */
export function directionOf(bearingDegrees: number): Direction {
  const normalised = ((bearingDegrees % 360) + 360) % 360;
  const index = Math.floor((normalised + SECTOR_SPAN / 2) / SECTOR_SPAN) % 8;
  return DIRECTIONS[index] as Direction;
}

/** The five elements of Indian tradition, which differ from the Chinese five. */
export const VAASTU_ELEMENTS = ['Earth', 'Water', 'Fire', 'Air', 'Space'] as const;

export type VaastuElement = (typeof VAASTU_ELEMENTS)[number];

export interface VaastuZone {
  direction: Direction;
  /** The presiding deity, as named in Vaastu Shastra. */
  deity: string;
  element: VaastuElement;
  /** What the zone traditionally governs. */
  governs: string;
  /** Rooms traditionally placed here. */
  favourable: string[];
}

/**
 * The eight directional zones of Vaastu.
 *
 * A documented traditional scheme. Recorded as data so it can be checked
 * against a published source rather than being buried in logic.
 */
export const VAASTU_ZONES: Readonly<Record<Direction, VaastuZone>> = {
  North: {
    direction: 'North',
    deity: 'Kubera',
    element: 'Water',
    governs: 'Wealth and opportunity',
    favourable: ['Treasury', 'Living room', 'Entrance'],
  },
  Northeast: {
    direction: 'Northeast',
    deity: 'Ishanya',
    element: 'Water',
    governs: 'Clarity and spiritual practice',
    favourable: ['Prayer room', 'Water source', 'Study'],
  },
  East: {
    direction: 'East',
    deity: 'Indra',
    element: 'Air',
    governs: 'Health and social standing',
    favourable: ['Entrance', 'Bathroom', 'Living room'],
  },
  Southeast: {
    direction: 'Southeast',
    deity: 'Agni',
    element: 'Fire',
    governs: 'Energy and digestion',
    favourable: ['Kitchen', 'Electrical equipment'],
  },
  South: {
    direction: 'South',
    deity: 'Yama',
    element: 'Earth',
    governs: 'Rest and endurance',
    favourable: ['Bedroom', 'Storage'],
  },
  Southwest: {
    direction: 'Southwest',
    deity: 'Nairrutya',
    element: 'Earth',
    governs: 'Stability and relationships',
    favourable: ['Master bedroom', 'Heavy storage'],
  },
  West: {
    direction: 'West',
    deity: 'Varuna',
    element: 'Water',
    governs: 'Gains and children',
    favourable: ['Dining room', 'Study', "Children's room"],
  },
  Northwest: {
    direction: 'Northwest',
    deity: 'Vayu',
    element: 'Air',
    governs: 'Movement and support',
    favourable: ['Guest room', 'Storage', 'Garage'],
  },
};

/**
 * The centre of a building in Vaastu.
 *
 * The Brahmasthan is traditionally left open and unbuilt, which is why it is a
 * separate constant rather than a ninth entry in the directional table — it
 * takes no bearing and has no favourable rooms.
 */
export const BRAHMASTHAN = {
  name: 'Brahmasthan',
  element: 'Space' as VaastuElement,
  guidance: 'Traditionally kept open and unobstructed',
};

export interface BaguaSector {
  direction: Direction;
  /** The trigram, in pinyin. */
  trigram: string;
  /** The life area this sector governs. */
  lifeArea: string;
  phase: Phase;
}

/**
 * The Bagua, in its Later Heaven arrangement.
 *
 * This is the arrangement used for building analysis; the Earlier Heaven
 * arrangement exists but is used for other purposes, and mixing the two is a
 * common error.
 */
export const BAGUA: Readonly<Record<Direction, BaguaSector>> = {
  North: { direction: 'North', trigram: 'Kan', lifeArea: 'Career', phase: 'Water' },
  Northeast: {
    direction: 'Northeast',
    trigram: 'Gen',
    lifeArea: 'Knowledge and self-cultivation',
    phase: 'Earth',
  },
  East: { direction: 'East', trigram: 'Zhen', lifeArea: 'Family and health', phase: 'Wood' },
  Southeast: { direction: 'Southeast', trigram: 'Xun', lifeArea: 'Wealth', phase: 'Wood' },
  South: { direction: 'South', trigram: 'Li', lifeArea: 'Recognition', phase: 'Fire' },
  Southwest: {
    direction: 'Southwest',
    trigram: 'Kun',
    lifeArea: 'Relationships',
    phase: 'Earth',
  },
  West: { direction: 'West', trigram: 'Dui', lifeArea: 'Creativity and children', phase: 'Metal' },
  Northwest: {
    direction: 'Northwest',
    trigram: 'Qian',
    lifeArea: 'Helpful people and travel',
    phase: 'Metal',
  },
};

export interface SpaceReading {
  /** The bearing supplied, normalised. */
  bearing: number;
  direction: Direction;
  vaastu: VaastuZone;
  bagua: BaguaSector;
}

/**
 * Reads a single direction through both systems.
 *
 * Returns each tradition's view side by side rather than a merged verdict,
 * which is the whole point: where they agree a reading can say so, and where
 * they differ that difference is itself informative.
 */
export function readDirection(bearingDegrees: number): SpaceReading {
  const direction = directionOf(bearingDegrees);

  return {
    bearing: ((bearingDegrees % 360) + 360) % 360,
    direction,
    vaastu: VAASTU_ZONES[direction],
    bagua: BAGUA[direction],
  };
}

/** Every direction, read through both systems. */
export function readAllDirections(): SpaceReading[] {
  return DIRECTIONS.map((_, index) => readDirection(index * SECTOR_SPAN));
}

/**
 * Whether the two traditions assign the same element family to a direction.
 *
 * The Indian and Chinese element sets are not the same — Air and Space have no
 * Chinese counterpart, and Metal and Wood have no Indian one — so this reports
 * only the three that genuinely overlap: Earth, Water and Fire.
 */
export function elementsAgree(direction: Direction): boolean | null {
  const vaastu = VAASTU_ZONES[direction].element;
  const bagua = BAGUA[direction].phase;

  const shared: readonly string[] = ['Earth', 'Water', 'Fire'];
  if (!shared.includes(vaastu) || !shared.includes(bagua)) return null;

  return vaastu === (bagua as string);
}

/** Re-exported for callers reasoning about Bagua phases. */
export { FIVE_PHASES };
