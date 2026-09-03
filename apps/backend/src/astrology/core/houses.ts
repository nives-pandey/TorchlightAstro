import { equationOfEquinoxes, trueObliquity } from './nutation';
import { DEG_TO_RAD, RAD_TO_DEG, greenwichMeanSiderealTime, normalizeDegrees } from './time';

/**
 * Houses, ascendant and midheaven.
 *
 * This is where birth *time* and *place* enter a chart. Planetary longitudes
 * barely move in a minute; the ascendant moves roughly a degree every four
 * minutes, so an error here is far more visible than anywhere else in the
 * engine — and it is the part most often got wrong, because it needs sidereal
 * time in UT while the planets need TT.
 *
 * Two systems are implemented:
 *
 *   Placidus    the Western default. Divides the *time* it takes a degree to
 *               rise, which is why it fails near the poles: above the Arctic
 *               circle some degrees never rise at all.
 *   Whole Sign  the Vedic and Hellenistic default. The ascendant's whole sign
 *               is house 1, and each subsequent sign is the next house. It has
 *               no polar failure mode, which is why it is the fallback.
 */

export type HouseSystem = 'placidus' | 'whole-sign';

export interface Houses {
  system: HouseSystem;
  /** Cusp longitudes, 12 entries, index 0 is house 1. */
  cusps: number[];
  ascendant: number;
  midheaven: number;
  /** True when Placidus was requested but the latitude made it undefined. */
  fellBackToWholeSign: boolean;
}

/**
 * Obliquity used for all house and angle work.
 *
 * This is the **true** obliquity — mean plus nutation. Using the mean value
 * leaves a systematic offset of up to ~9 arcseconds that appears identically at
 * every latitude, which is exactly what testing against Swiss Ephemeris
 * revealed before nutation was added.
 */
export function meanObliquity(julianCenturiesTT: number): number {
  return trueObliquity(julianCenturiesTT);
}

/**
 * Local Sidereal Time in degrees.
 *
 * East longitude is positive. Takes a **UT** Julian Day: sidereal time measures
 * Earth's actual rotation, which is the quantity ΔT exists to correct away for
 * planetary theory. Passing TT walks the ascendant by roughly ΔT × 15/3600
 * degrees — about 17 arcseconds today, and far more for a 19th-century birth.
 */
export function localSiderealTime(
  jdUT: number,
  longitudeEast: number,
  julianCenturiesTT: number,
): number {
  // Apparent, not mean: the ascendant is measured against the true equinox of
  // date, so the equation of the equinoxes (Δψ·cos ε) belongs here. Omitting it
  // left the RAMC 0.0033° out against Swiss Ephemeris — small, but systematic.
  return normalizeDegrees(
    greenwichMeanSiderealTime(jdUT) + equationOfEquinoxes(julianCenturiesTT) + longitudeEast,
  );
}

/**
 * The ascendant — the ecliptic degree rising on the eastern horizon.
 *
 * Standard spherical formula (Meeus chapter 13). `atan2` is used rather than
 * `atan` so the result lands in the correct quadrant without a hand-written
 * sign table, which is a classic source of charts that are exactly 180° wrong.
 */
export function ascendant(lst: number, latitude: number, obliquity: number): number {
  const lstRad = lst * DEG_TO_RAD;
  const latRad = latitude * DEG_TO_RAD;
  const oblRad = obliquity * DEG_TO_RAD;

  // Meeus 13.x, arranged so atan2 resolves the quadrant. The sign convention
  // here is worth more scrutiny than the trigonometry: get it wrong and the
  // function returns the descendant, a chart exactly 180° out that still looks
  // entirely plausible.
  //
  // This was got wrong once already. A single test at Greenwich passed with the
  // signs inverted, because that case sits where both conventions happen to
  // agree — which is why the suite below checks several latitudes, both
  // hemispheres, and both sides of the prime meridian.
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);

  return normalizeDegrees(Math.atan2(y, x) * RAD_TO_DEG + 180);
}

/**
 * The midheaven — where the local meridian crosses the ecliptic.
 *
 * Written as `atan2(tan(LST), cos(ε))` this is wrong half the time, and that is
 * not hyperbole: `tan` has period 180°, so feeding it to `atan2` throws away
 * the very quadrant information `atan2` exists to recover. The result is
 * correct when LST falls in the first or fourth quadrant and exactly 180° out
 * otherwise — which is why a single Greenwich test passed while Delhi, Sydney
 * and New York were all inverted.
 *
 * Passing sin and cos separately keeps the quadrant intact.
 */
export function midheaven(lst: number, obliquity: number): number {
  const lstRad = lst * DEG_TO_RAD;
  const oblRad = obliquity * DEG_TO_RAD;

  return normalizeDegrees(
    Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(oblRad)) * RAD_TO_DEG,
  );
}

/**
 * Highest latitude at which Placidus stays defined.
 *
 * Beyond the polar circle (90° − obliquity ≈ 66.5°) some ecliptic degrees never
 * rise, so the semi-arc the method divides does not exist and the standard
 * iteration diverges. The bound is set slightly inside that, because the
 * iteration becomes numerically unstable before it becomes undefined.
 */
const PLACIDUS_LATITUDE_LIMIT = 66.0;

/**
 * Intermediate Placidus cusp, found by iteration.
 *
 * Placidus has no closed form: each cusp is the ecliptic point whose semi-arc
 * is divided in a given ratio, and that is solved numerically. The loop
 * converges in a handful of passes at temperate latitudes.
 */
function placidusCusp(
  ramc: number,
  latitude: number,
  obliquity: number,
  houseNumber: 11 | 12 | 2 | 3,
): number | null {
  const latRad = latitude * DEG_TO_RAD;
  const oblRad = obliquity * DEG_TO_RAD;

  /**
   * Each cusp sits a fixed offset from the RAMC, adjusted by a fraction of the
   * ascensional difference at its own position:
   *
   *   house 11  RAMC + 30°,  one third of AD
   *   house 12  RAMC + 60°,  two thirds of AD
   *   house 2   RAMC + 120°, two thirds of AD
   *   house 3   RAMC + 150°, one third of AD
   *
   * Since AD depends on the position being solved for, this is a fixed-point
   * problem: RA = RAMC + offset + f·AD(RA).
   */
  const config = {
    11: { offset: 30, f: 1 / 3 },
    12: { offset: 60, f: 2 / 3 },
    2: { offset: 120, f: 2 / 3 },
    3: { offset: 150, f: 1 / 3 },
  }[houseNumber];

  let ra = normalizeDegrees(ramc + config.offset);
  let converged = false;

  for (let iteration = 0; iteration < 200; iteration += 1) {
    // Ecliptic longitude of the point currently at this right ascension.
    const raRad = ra * DEG_TO_RAD;
    const longitude = Math.atan2(Math.sin(raRad) / Math.cos(oblRad), Math.cos(raRad));

    /**
     * Declination from *ecliptic longitude*, not from right ascension.
     *
     * This one substitution was the whole bug. `sin δ = sin ε · sin λ` holds
     * for the ecliptic longitude λ; feeding it α instead is a different point
     * on the sphere. The two agree at the equinoxes and solstices and diverge
     * in between, so the error was invisible in some tests and grew to 2.9° at
     * high latitude in others — the worst kind of wrong, because it looked
     * nearly right nearly everywhere.
     */
    const declination = Math.asin(Math.sin(oblRad) * Math.sin(longitude));

    const tanProduct = Math.tan(latRad) * Math.tan(declination);
    // Circumpolar: the semi-arc does not exist, so the cusp is undefined.
    if (Math.abs(tanProduct) > 1) return null;

    const ad = Math.asin(tanProduct) * RAD_TO_DEG;
    const target = normalizeDegrees(ramc + config.offset + config.f * ad);

    let delta = target - ra;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    ra = normalizeDegrees(ra + delta);

    if (Math.abs(delta) < 1e-12) {
      converged = true;
      break;
    }
  }

  if (!converged) return null;

  // Right ascension back to ecliptic longitude, quadrant preserved by passing
  // sin and cos separately rather than their ratio.
  const raRad = ra * DEG_TO_RAD;
  return normalizeDegrees(
    Math.atan2(Math.sin(raRad) / Math.cos(oblRad), Math.cos(raRad)) * RAD_TO_DEG,
  );
}

/**
 * Computes the twelve house cusps.
 *
 * Placidus falls back to Whole Sign above the polar limit rather than returning
 * nonsense, and says so in `fellBackToWholeSign` so the interface can explain
 * itself instead of quietly showing different maths than the user asked for.
 */
export function computeHouses(
  jdUT: number,
  julianCenturiesTT: number,
  latitude: number,
  longitudeEast: number,
  system: HouseSystem = 'placidus',
): Houses {
  const obliquity = meanObliquity(julianCenturiesTT);
  const lst = localSiderealTime(jdUT, longitudeEast, julianCenturiesTT);
  const asc = ascendant(lst, latitude, obliquity);
  const mc = midheaven(lst, obliquity);

  if (system === 'whole-sign' || Math.abs(latitude) > PLACIDUS_LATITUDE_LIMIT) {
    // House 1 begins at 0° of the ascendant's sign; the rest follow in order.
    const signStart = Math.floor(asc / 30) * 30;
    const cusps = Array.from({ length: 12 }, (_, i) => normalizeDegrees(signStart + i * 30));

    return {
      system: 'whole-sign',
      cusps,
      ascendant: asc,
      midheaven: mc,
      fellBackToWholeSign: system === 'placidus',
    };
  }

  const cusps = new Array<number>(12);

  // The four angles are known exactly and anchor everything else. Index i holds
  // house i+1, so house 1 is the ascendant and house 10 is the midheaven.
  cusps[0] = asc;
  cusps[3] = normalizeDegrees(mc + 180);
  cusps[6] = normalizeDegrees(asc + 180);
  cusps[9] = mc;

  const ramc = lst;

  // Only houses 11, 12, 2 and 3 are solved by iteration; their opposites follow
  // by symmetry. Getting this mapping wrong produced duplicate cusps — houses 2
  // and 3 identical to 5 and 6 — which is how the original version was caught.
  const intermediate: Array<{ index: number; house: 11 | 12 | 2 | 3 }> = [
    { index: 10, house: 11 },
    { index: 11, house: 12 },
    { index: 1, house: 2 },
    { index: 2, house: 3 },
  ];

  for (const { index, house } of intermediate) {
    const cusp = placidusCusp(ramc, latitude, obliquity, house);
    if (cusp === null) {
      // Iteration failed despite passing the latitude gate; fall back wholesale
      // rather than return a chart with four good cusps and eight guesses.
      return computeHouses(jdUT, julianCenturiesTT, latitude, longitudeEast, 'whole-sign');
    }
    cusps[index] = cusp;
  }

  // Opposite cusps are exactly 180° apart by construction.
  cusps[4] = normalizeDegrees((cusps[10] as number) + 180); // 5 opposite 11
  cusps[5] = normalizeDegrees((cusps[11] as number) + 180); // 6 opposite 12
  cusps[7] = normalizeDegrees((cusps[1] as number) + 180); // 8 opposite 2
  cusps[8] = normalizeDegrees((cusps[2] as number) + 180); // 9 opposite 3

  return {
    system: 'placidus',
    cusps,
    ascendant: asc,
    midheaven: mc,
    fellBackToWholeSign: false,
  };
}

/**
 * Which house a longitude falls in, 1–12.
 *
 * Walks the cusps rather than dividing, because houses are unequal in Placidus
 * and the wrap across 0° has to be handled per-house.
 */
export function houseOf(longitude: number, cusps: number[]): number {
  const target = normalizeDegrees(longitude);

  for (let i = 0; i < 12; i += 1) {
    const start = cusps[i] as number;
    const end = cusps[(i + 1) % 12] as number;

    const spansZero = end < start;
    const inside = spansZero ? target >= start || target < end : target >= start && target < end;

    if (inside) return i + 1;
  }

  // Unreachable for well-formed cusps; house 1 is the safe answer if it happens.
  return 1;
}
