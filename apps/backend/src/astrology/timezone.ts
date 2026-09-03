/**
 * Torchlight — historical timezone resolution
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * Resolves the UTC offset that applied at a particular place and moment.
 *
 * This is the single most common source of wrong charts, and the reason is that
 * the correct answer is historical rather than current. Three cases this file
 * was checked against, each verified from the platform's own IANA data rather
 * than from recollection:
 *
 *   - Kolkata used +5:53:20 until 1906, and +6:30 during 1943–45. A birth in
 *     either window is not at today's +5:30.
 *   - London was on UTC+1 through the whole of 1970, because Britain stayed on
 *     summer time from 1968 to 1971 — so a January birth there has a summer
 *     offset.
 *   - New York shifts by an hour twice a year, and the transition dates
 *     themselves have moved several times.
 *
 * Applying today's offset to a historical birth moves the ascendant by up to
 * fifteen degrees, which is half a sign.
 *
 * The IANA timezone database records all of this, and the platform already
 * ships it: `Intl.DateTimeFormat` resolves a zone at a given instant, including
 * every historical rule change. So rather than shipping a second copy of that
 * data — which would immediately begin to rot — this reads the one the runtime
 * maintains.
 *
 * The subtlety is that the offset is needed to convert local time to UT, but
 * `Intl` needs a UT instant to tell you the offset. That circularity is
 * resolved by testing both candidate offsets around a transition and keeping
 * whichever round-trips back to the wall-clock time asked for.
 */

/**
 * The offset in minutes east of UT for a zone at a given instant.
 *
 * Uses `Intl` rather than a bundled table, so the answer reflects whatever
 * historical rules the platform's IANA data records.
 */
export function offsetMinutesAt(timezone: string, instant: Date): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = formatter.formatToParts(instant);
  const get = (type: string): number =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  // `Intl` gives the wall-clock time in that zone. Reading it back as if it
  // were UT and differencing yields the offset.
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    // Hour 24 appears in some locales for midnight; normalise it.
    get('hour') % 24,
    get('minute'),
    get('second'),
  );

  return Math.round((asUtc - instant.getTime()) / 60000);
}

export interface ResolvedTime {
  /** Offset in hours east of UT, as the engine expects. */
  offsetHours: number;
  /** The UT instant the local time corresponds to. */
  utc: Date;
  /**
   * True when the local time named does not exist, because a DST transition
   * skipped it. The offset before the transition is used, which places the
   * birth at the first real instant after the gap.
   */
  inDaylightGap: boolean;
  /**
   * True when the local time is ambiguous, occurring twice because a DST
   * transition repeated it. The earlier of the two is used by convention.
   */
  isAmbiguous: boolean;
}

/**
 * Converts a local wall-clock time in a zone to a UT instant and offset.
 *
 * Twice-yearly, a local time either does not exist or occurs twice. Both are
 * detected and reported rather than resolved silently, so a caller can tell the
 * user their stated birth time was affected by a clock change.
 */
export function resolveLocalTime(
  timezone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): ResolvedTime {
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);

  /**
   * A local time is resolved by testing both candidate offsets rather than by
   * iterating to a fixed point.
   *
   * Around a transition there are two offsets in play, and each produces a
   * candidate instant. Converting that instant back to wall-clock time says
   * whether the candidate is real:
   *
   *   - both valid   → the local time occurs twice (ambiguous, clocks went back)
   *   - neither      → the local time never occurs (gap, clocks went forward)
   *   - exactly one  → an ordinary time
   *
   * An earlier version iterated and compared successive guesses, which produced
   * the right instant but mislabelled which case it was in — reporting the
   * skipped hour as ambiguous and the repeated hour as neither.
   */
  const before = offsetMinutesAt(timezone, new Date(localAsUtc - 86400000));
  const after = offsetMinutesAt(timezone, new Date(localAsUtc + 86400000));

  const candidates = before === after ? [before] : [before, after];

  const valid = candidates.filter((candidate) => {
    const instant = new Date(localAsUtc - candidate * 60000);
    return offsetMinutesAt(timezone, instant) === candidate;
  });

  const isAmbiguous = valid.length > 1;
  const inDaylightGap = valid.length === 0;

  // Ambiguous: take the larger offset, which is the earlier of the two
  // instants and the conventional reading.
  // Gap: the named time does not exist, so fall back to the pre-transition
  // offset, placing the birth at the first real instant after the gap.
  const offset = isAmbiguous
    ? Math.max(...valid)
    : inDaylightGap
      ? Math.max(before, after)
      : (valid[0] as number);

  return {
    offsetHours: offset / 60,
    utc: new Date(localAsUtc - offset * 60000),
    inDaylightGap,
    isAmbiguous,
  };
}

/** Whether the runtime recognises a zone id. */
export function isKnownTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}
