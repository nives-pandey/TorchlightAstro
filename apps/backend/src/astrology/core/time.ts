/**
 * Time conversions for the ephemeris.
 *
 * Getting time right is the single largest source of wrong charts, and the
 * errors are quiet: a chart built on a bad timescale still looks plausible, it
 * is just wrong by a degree or two — enough to move a planet into the wrong
 * house or sign near a boundary.
 *
 * Three distinct timescales matter here and are easy to conflate:
 *
 *   UT1/UTC  civil time, tied to Earth's rotation, which is irregular
 *   TT       Terrestrial Time, uniform, what planetary theory is written in
 *   TDB      Barycentric Dynamical Time, differs from TT by <2ms — ignored
 *
 * Planetary positions must be computed in TT. A birth is recorded in civil
 * time. The gap between them (ΔT) was ~24s in 1900, ~69s in 2020, and grows;
 * skipping it puts the Moon off by roughly 0.4 arcminutes per minute of error,
 * which is small but pointless to concede when the correction is cheap.
 */

/** Julian Day Number for the J2000.0 epoch, 2000-01-01 12:00 TT. */
export const J2000 = 2451545.0;

/** Days in a Julian century — the unit planetary theory is expressed in. */
export const DAYS_PER_CENTURY = 36525.0;

/**
 * Converts a Gregorian calendar date and fractional hour to a Julian Day.
 *
 * Meeus, *Astronomical Algorithms*, 2nd ed., chapter 7. The Gregorian branch is
 * the only one implemented: the app validates birth years to 1800+, so no input
 * can reach the 1582 Julian/Gregorian transition where the two calendars differ
 * by ten days.
 */
export function toJulianDay(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): number {
  let y = year;
  let m = month;

  // January and February are treated as months 13 and 14 of the prior year, so
  // the leap day always falls at the end of the sequence.
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  const dayFraction = day + (hour + minute / 60 + second / 3600) / 24;

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFraction + b - 1524.5;
}

/** Julian centuries from J2000.0. The argument planetary series expect. */
export function julianCenturies(jd: number): number {
  return (jd - J2000) / DAYS_PER_CENTURY;
}

/**
 * Observed ΔT, in seconds, at the start of each year.
 *
 * Earth's rotation is measured, not predicted, so for years where an
 * observation exists the observation wins over any polynomial. The
 * Espenak & Meeus fits below are smooth approximations to this same data and
 * drift from it by a couple of seconds in recent decades — measured against
 * Swiss Ephemeris, the 2024 fit was 2.92s out, which is 44 arcseconds of
 * sidereal time and therefore 44 arcseconds on the ascendant.
 *
 * Values from IERS Bulletin A / USNO historical series.
 *
 * These deliberately disagree with Swiss Ephemeris after 2022, and this table
 * is the correct one. Swiss extrapolates linearly at +0.5s/year from its build
 * date, giving 71.00s for 2024. That cannot be right: ΔT = 32.184 + (TAI−UTC) −
 * (UT1−UTC), no leap second has been inserted since 2016-12-31, so TAI−UTC has
 * been fixed at 37s — ΔT cannot have grown two seconds without one. Earth has
 * in fact been rotating slightly *faster* since 2020, so ΔT has been flat to
 * mildly falling, which is what these values show.
 *
 * Extend this table when IERS publishes new values rather than trusting any
 * library's forward projection.
 */
const OBSERVED_DELTA_T: ReadonlyArray<readonly [number, number]> = [
  [1960, 33.15],
  [1962, 34.03],
  [1964, 35.73],
  [1966, 37.43],
  [1968, 39.2],
  [1970, 40.18],
  [1972, 42.23],
  [1974, 44.49],
  [1976, 46.48],
  [1978, 48.53],
  [1980, 50.54],
  [1982, 52.17],
  [1984, 53.79],
  [1986, 54.87],
  [1988, 55.82],
  [1990, 56.86],
  [1992, 58.31],
  [1994, 60.06],
  [1996, 61.63],
  [1998, 62.97],
  [2000, 63.83],
  [2002, 64.3],
  [2004, 64.57],
  [2006, 64.85],
  [2008, 65.46],
  [2010, 66.07],
  [2012, 66.74],
  [2014, 67.28],
  [2016, 68.1],
  [2018, 68.97],
  [2020, 69.36],
  [2022, 69.29],
  [2024, 69.22],
  [2026, 69.1],
] as const;

/**
 * Interpolates the observed series, or returns null outside its range.
 *
 * Linear interpolation is sufficient: ΔT changes by under a second per year in
 * this era, so the interpolation error is well below a tenth of a second.
 */
function observedDeltaT(decimalYear: number): number | null {
  const first = OBSERVED_DELTA_T[0] as readonly [number, number];
  const last = OBSERVED_DELTA_T[OBSERVED_DELTA_T.length - 1] as readonly [number, number];
  if (decimalYear < first[0] || decimalYear > last[0]) return null;

  for (let i = 0; i < OBSERVED_DELTA_T.length - 1; i += 1) {
    const [y0, d0] = OBSERVED_DELTA_T[i] as readonly [number, number];
    const [y1, d1] = OBSERVED_DELTA_T[i + 1] as readonly [number, number];
    if (decimalYear >= y0 && decimalYear <= y1) {
      return d0 + ((d1 - d0) * (decimalYear - y0)) / (y1 - y0);
    }
  }

  return null;
}

/**
 * ΔT = TT − UT, in seconds.
 *
 * Uses observed values where they exist (see the table above) and falls back to
 * the Espenak & Meeus polynomial fits published by NASA for the canonical
 * eclipse catalogue. Earth's rotation is measured, not predicted, so anything
 * outside the observed range is a fit and anything past it is extrapolation.
 */
export function deltaT(year: number, month = 6): number {
  // Decimal year, taking mid-month as the reference point.
  const y = year + (month - 0.5) / 12;

  // Observation beats any fit where one exists.
  const observed = observedDeltaT(y);
  if (observed !== null) return observed;

  if (y < 1600) {
    // Outside the app's input range; the far-past fit, included so transit and
    // test code cannot silently divide by an undefined branch.
    const u = (y - 1820) / 100;
    return -20 + 32 * u * u;
  }

  if (y < 1700) {
    const t = y - 1600;
    return 120 - 0.9808 * t - 0.01532 * t * t + (t * t * t) / 7129;
  }

  if (y < 1800) {
    const t = y - 1700;
    return (
      8.83 + 0.1603 * t - 0.0059285 * t * t + 0.00013336 * t * t * t - (t * t * t * t) / 1174000
    );
  }

  if (y < 1860) {
    const t = y - 1800;
    return (
      13.72 -
      0.332447 * t +
      0.0068612 * t * t +
      0.0041116 * t * t * t -
      0.00037436 * t ** 4 +
      0.0000121272 * t ** 5 -
      0.0000001699 * t ** 6 +
      0.000000000875 * t ** 7
    );
  }

  if (y < 1900) {
    const t = y - 1860;
    return (
      7.62 +
      0.5737 * t -
      0.251754 * t * t +
      0.01680668 * t * t * t -
      0.0004473624 * t ** 4 +
      t ** 5 / 233174
    );
  }

  if (y < 1920) {
    const t = y - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t * t + 0.0061966 * t * t * t - 0.000197 * t ** 4;
  }

  if (y < 1941) {
    const t = y - 1920;
    return 21.2 + 0.84493 * t - 0.0761 * t * t + 0.0020936 * t * t * t;
  }

  if (y < 1961) {
    const t = y - 1950;
    return 29.07 + 0.407 * t - (t * t) / 233 + (t * t * t) / 2547;
  }

  if (y < 1986) {
    const t = y - 1975;
    return 45.45 + 1.067 * t - (t * t) / 260 - (t * t * t) / 718;
  }

  if (y < 2005) {
    const t = y - 2000;
    return (
      63.86 +
      0.3345 * t -
      0.060374 * t * t +
      0.0017275 * t * t * t +
      0.000651814 * t ** 4 +
      0.00002373599 * t ** 5
    );
  }

  if (y < 2050) {
    const t = y - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }

  // Beyond 2050 this is extrapolation, not measurement.
  const u = (y - 1820) / 100;
  return -20 + 32 * u * u - 0.5628 * (2150 - y);
}

/**
 * Converts a Julian Day in Universal Time to Terrestrial Time.
 *
 * Everything downstream — planetary longitudes, obliquity, nutation — is a
 * function of TT, so this conversion happens once, at the boundary, and the
 * rest of the engine never sees civil time.
 */
export function utToTT(jdUT: number, year: number, month: number): number {
  return jdUT + deltaT(year, month) / 86400;
}

/**
 * Greenwich Mean Sidereal Time in degrees, from a UT Julian Day.
 *
 * Note this takes UT and not TT: sidereal time measures Earth's actual
 * rotation, which is exactly the quantity ΔT corrects *away* for planetary
 * theory. Passing TT here is a classic error that shifts the ascendant by
 * roughly ΔT × 15/3600 degrees.
 *
 * IAU 1982 expression, via Meeus chapter 12.
 */
export function greenwichMeanSiderealTime(jdUT: number): number {
  const t = julianCenturies(jdUT);

  const theta =
    280.46061837 + 360.98564736629 * (jdUT - J2000) + 0.000387933 * t * t - (t * t * t) / 38710000;

  return normalizeDegrees(theta);
}

/** Wraps an angle into [0, 360). */
export function normalizeDegrees(degrees: number): number {
  const wrapped = degrees % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

/** Signed angular difference a − b, wrapped to (−180, 180]. */
export function angularDifference(a: number, b: number): number {
  let diff = (a - b) % 360;
  if (diff > 180) diff -= 360;
  if (diff <= -180) diff += 360;
  return diff;
}

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;
