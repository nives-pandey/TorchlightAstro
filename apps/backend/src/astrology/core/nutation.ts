import { DEG_TO_RAD, normalizeDegrees } from './time';

/**
 * Nutation — the small wobble of Earth's axis caused mainly by the Moon.
 *
 * This is not a refinement that can be skipped. Nutation shifts the obliquity
 * by up to ~9.2 arcseconds and the equinox by up to ~17 arcseconds, and both
 * feed directly into the ascendant and the house cusps. Omitting it leaves a
 * systematic error that no amount of care elsewhere removes: measured against
 * Swiss Ephemeris, using mean rather than true obliquity left every Placidus
 * cusp about 0.0035° out, uniformly, at every latitude.
 *
 * IAU 1980 theory. The full series has 106 terms; the largest 20 are kept here,
 * which is accurate to about 0.1 arcseconds — three orders of magnitude finer
 * than the one-arcminute bar the engine is held to, and well past the point
 * where more terms change any user-visible result.
 *
 * Meeus, *Astronomical Algorithms*, 2nd ed., chapter 22.
 */

/**
 * Each row is [D, M, M', F, Ω, Δψ·1e-4″ coefficient, Δψ·t term,
 * Δε·1e-4″ coefficient, Δε·t term].
 *
 * The arguments are multiples of the five fundamental lunisolar angles; the
 * coefficients are in units of 0.0001 arcseconds.
 */
const NUTATION_TERMS: ReadonlyArray<
  readonly [number, number, number, number, number, number, number, number, number]
> = [
  [0, 0, 0, 0, 1, -171996, -174.2, 92025, 8.9],
  [-2, 0, 0, 2, 2, -13187, -1.6, 5736, -3.1],
  [0, 0, 0, 2, 2, -2274, -0.2, 977, -0.5],
  [0, 0, 0, 0, 2, 2062, 0.2, -895, 0.5],
  [0, 1, 0, 0, 0, 1426, -3.4, 54, -0.1],
  [0, 0, 1, 0, 0, 712, 0.1, -7, 0],
  [-2, 1, 0, 2, 2, -517, 1.2, 224, -0.6],
  [0, 0, 0, 2, 1, -386, -0.4, 200, 0],
  [0, 0, 1, 2, 2, -301, 0, 129, -0.1],
  [-2, -1, 0, 2, 2, 217, -0.5, -95, 0.3],
  [-2, 0, 1, 0, 0, -158, 0, 0, 0],
  [-2, 0, 0, 2, 1, 129, 0.1, -70, 0],
  [0, 0, -1, 2, 2, 123, 0, -53, 0],
  [2, 0, 0, 0, 0, 63, 0, 0, 0],
  [0, 0, 1, 0, 1, 63, 0.1, -33, 0],
  [2, 0, -1, 2, 2, -59, 0, 26, 0],
  [0, 0, -1, 0, 1, -58, -0.1, 32, 0],
  [0, 0, 1, 2, 1, -51, 0, 27, 0],
  [-2, 0, 2, 0, 0, 48, 0, 0, 0],
  [0, 0, -2, 2, 1, 46, 0, -24, 0],
] as const;

export interface Nutation {
  /** Nutation in longitude (Δψ), degrees. */
  longitude: number;
  /** Nutation in obliquity (Δε), degrees. */
  obliquity: number;
}

/**
 * Computes nutation in longitude and obliquity at a given time.
 *
 * `t` is Julian centuries of Terrestrial Time from J2000.0.
 */
export function nutation(t: number): Nutation {
  // Mean elongation of the Moon from the Sun.
  const d =
    normalizeDegrees(297.85036 + 445267.11148 * t - 0.0019142 * t * t + (t * t * t) / 189474) *
    DEG_TO_RAD;

  // Mean anomaly of the Sun.
  const m =
    normalizeDegrees(357.52772 + 35999.05034 * t - 0.0001603 * t * t - (t * t * t) / 300000) *
    DEG_TO_RAD;

  // Mean anomaly of the Moon.
  const mPrime =
    normalizeDegrees(134.96298 + 477198.867398 * t + 0.0086972 * t * t + (t * t * t) / 56250) *
    DEG_TO_RAD;

  // Moon's argument of latitude.
  const f =
    normalizeDegrees(93.27191 + 483202.017538 * t - 0.0036825 * t * t + (t * t * t) / 327270) *
    DEG_TO_RAD;

  // Longitude of the ascending node of the Moon's mean orbit.
  const omega =
    normalizeDegrees(125.04452 - 1934.136261 * t + 0.0020708 * t * t + (t * t * t) / 450000) *
    DEG_TO_RAD;

  let deltaPsi = 0;
  let deltaEpsilon = 0;

  for (const [cd, cm, cmp, cf, comega, psi, psiT, eps, epsT] of NUTATION_TERMS) {
    const argument = cd * d + cm * m + cmp * mPrime + cf * f + comega * omega;
    deltaPsi += (psi + psiT * t) * Math.sin(argument);
    deltaEpsilon += (eps + epsT * t) * Math.cos(argument);
  }

  // Coefficients are in 0.0001 arcseconds; convert to degrees.
  return {
    longitude: (deltaPsi * 0.0001) / 3600,
    obliquity: (deltaEpsilon * 0.0001) / 3600,
  };
}

/**
 * Mean obliquity of the ecliptic, degrees — IAU 2006.
 *
 * Capitaine, Wallace & Chapront (2003), adopted by the IAU in 2006 and the
 * current international standard. Expressed in arcseconds and converted once.
 *
 * Two earlier attempts were measured and rejected, and the reasoning is worth
 * keeping because both looked reasonable:
 *
 *   - Meeus 22.2, the three-term form, drifts: 0.020″ out in 1901 growing to
 *     0.047″ by 2024.
 *   - Meeus 22.3, Laskar's ten-term series, is a 1986 model. It differs from
 *     IAU 2006 by exactly the residual that was showing up in testing —
 *     -0.042″ at J2000, -0.069″ a century out — confirming the gap was a
 *     model difference and not an arithmetic slip.
 *
 * A systematic offset like that is worse than random noise: it biases every
 * chart in the same direction rather than averaging out.
 */
export function meanObliquityOfEcliptic(t: number): number {
  const arcseconds =
    84381.406 -
    46.836769 * t -
    0.0001831 * t * t +
    0.0020034 * t * t * t -
    5.76e-7 * t ** 4 -
    4.34e-8 * t ** 5;

  return arcseconds / 3600;
}

/**
 * True obliquity — mean plus nutation.
 *
 * This is the value house and ascendant calculations must use. Using the mean
 * value instead is a systematic error of up to ~9 arcseconds that shows up
 * identically at every latitude.
 */
export function trueObliquity(t: number): number {
  return meanObliquityOfEcliptic(t) + nutation(t).obliquity;
}

/**
 * Equation of the equinoxes, in degrees.
 *
 * The difference between apparent and mean sidereal time: Δψ·cos(ε). Sidereal
 * time used for the ascendant must be *apparent*, since the ascendant is
 * measured against the true equinox of date.
 */
export function equationOfEquinoxes(t: number): number {
  const { longitude } = nutation(t);
  return longitude * Math.cos(trueObliquity(t) * DEG_TO_RAD);
}
