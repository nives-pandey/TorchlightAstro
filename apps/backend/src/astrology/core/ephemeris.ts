import * as Astronomy from 'astronomy-engine';

import { normalizeDegrees } from './time';

/**
 * Planetary positions.
 *
 * These come from `astronomy-engine`, which implements VSOP87 for the planets
 * and ELP2000 for the Moon and is validated against JPL ephemerides by its
 * author. Our own suite re-checks it against NASA JPL Horizons fixtures; the
 * worst disagreement across the committed cases is 17.2 arcseconds (Neptune,
 * 2010), against the one-arcminute bar this engine is held to. The Sun and Moon
 * — the two bodies a reading leans on hardest — agree to within 2 arcseconds.
 *
 * The alternative — hand-truncating VSOP87 series in this file — was rejected
 * deliberately. A truncated series is easy to write and very hard to know you
 * have written correctly: the error appears only for particular bodies at
 * particular dates, which is exactly the failure the old build shipped.
 *
 * Everything returned here is **apparent geocentric ecliptic of date**, which
 * is what tropical Western astrology uses. Sidereal systems subtract an
 * ayanamsa from these values; they must not be read as sidereal directly.
 */

export const PLANETS = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
] as const;

export type PlanetName = (typeof PLANETS)[number];

export interface PlanetPosition {
  name: PlanetName;
  /** Ecliptic longitude, degrees in [0, 360). */
  longitude: number;
  /** Ecliptic latitude, degrees. */
  latitude: number;
  /** Distance from Earth in AU. Used to detect stations and retrogrades. */
  distance: number;
  /** Degrees per day; negative means retrograde. */
  speed: number;
  /** True when apparent motion is westward against the stars. */
  retrograde: boolean;
}

const BODY_MAP: Record<PlanetName, Astronomy.Body> = {
  Sun: Astronomy.Body.Sun,
  Moon: Astronomy.Body.Moon,
  Mercury: Astronomy.Body.Mercury,
  Venus: Astronomy.Body.Venus,
  Mars: Astronomy.Body.Mars,
  Jupiter: Astronomy.Body.Jupiter,
  Saturn: Astronomy.Body.Saturn,
  Uranus: Astronomy.Body.Uranus,
  Neptune: Astronomy.Body.Neptune,
  Pluto: Astronomy.Body.Pluto,
};

/** How far apart the two samples used to derive daily motion are. */
const SPEED_SAMPLE_DAYS = 0.5;

function eclipticOf(body: Astronomy.Body, date: Date): { lon: number; lat: number; dist: number } {
  // `true` requests aberration correction — the apparent shift from Earth's own
  // motion. Astrology works in apparent positions, the sky as seen, so this is
  // not optional dressing.
  const vector = Astronomy.GeoVector(body, date, true);
  const ecliptic = Astronomy.Ecliptic(vector);
  return { lon: ecliptic.elon, lat: ecliptic.elat, dist: vector.Length() };
}

/**
 * Computes one body's apparent position at an instant.
 *
 * Speed is a symmetric difference across half a day either side rather than a
 * forward difference, which keeps the estimate centred on the requested moment.
 * That matters near a station, where a one-sided estimate reports motion the
 * planet is not making and can flip the retrograde flag on the wrong date.
 */
export function planetPosition(name: PlanetName, date: Date): PlanetPosition {
  const body = BODY_MAP[name];

  const current = eclipticOf(body, date);

  const before = new Date(date.getTime() - SPEED_SAMPLE_DAYS * 86400000);
  const after = new Date(date.getTime() + SPEED_SAMPLE_DAYS * 86400000);
  const lonBefore = eclipticOf(body, before).lon;
  const lonAfter = eclipticOf(body, after).lon;

  // Unwrap across the 0/360 seam before differencing, or a body near Aries
  // point reports a ~360°/day jump.
  let delta = lonAfter - lonBefore;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  const speed = delta / (2 * SPEED_SAMPLE_DAYS);

  return {
    name,
    longitude: normalizeDegrees(current.lon),
    latitude: current.lat,
    distance: current.dist,
    speed,
    retrograde: speed < 0,
  };
}

/** Computes every supported body at one instant. */
export function allPlanetPositions(date: Date): PlanetPosition[] {
  return PLANETS.map((name) => planetPosition(name, date));
}

/**
 * Mean lunar node — the northern intersection of the Moon's orbit with the
 * ecliptic, known as Rahu in Vedic astrology, with Ketu opposite it.
 *
 * The mean node is used rather than the true node because both Vedic tradition
 * and most Western practice work with the mean value, and because the true node
 * oscillates enough to change a nakshatra near a boundary. Meeus chapter 47.
 */
export function lunarNodes(date: Date): { north: number; south: number } {
  const astroTime = Astronomy.MakeTime(date);
  const t = astroTime.tt / 36525;

  const omega =
    125.0445479 - 1934.1362891 * t + 0.0020754 * t * t + (t * t * t) / 467441 - t ** 4 / 60616000;

  const north = normalizeDegrees(omega);
  return { north, south: normalizeDegrees(north + 180) };
}
