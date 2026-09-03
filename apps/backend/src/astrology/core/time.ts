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
 * ΔT = TT − UT, in seconds.
 *
 * Espenak & Meeus polynomial fits, as published by NASA for the canonical
 * eclipse catalogue. Earth's rotation is not predictable from theory — it is
 * measured — so any expression is an empirical fit to observation, and values
 * past the present are extrapolation rather than fact.
 *
 * Only the ranges reachable from a valid birth year are implemented, plus a
 * conservative tail for future dates used in transits.
 */
export function deltaT(year: number, month = 6): number {
  // Decimal year, taking mid-month as the reference point.
  const y = year + (month - 0.5) / 12;

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
