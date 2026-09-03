/**
 * Torchlight — historical timezone resolution — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { isKnownTimezone, offsetMinutesAt, resolveLocalTime } from './timezone';

/**
 * Timezone handling is the most common source of wrong charts, because the
 * correct offset is historical rather than current. Applying today's offset to
 * a 1940 birth can move the ascendant half a sign.
 *
 * Every expected value below was read from the platform's own IANA data rather
 * than recalled — a distinction that mattered: a comment in the implementation
 * claimed India switched to +5:30 in 1942, when IANA records 1906. The code was
 * right and the comment was wrong.
 */

describe('offsetMinutesAt', () => {
  it('reads the modern offset', () => {
    expect(offsetMinutesAt('Asia/Kolkata', new Date('1985-07-22T00:00:00Z'))).toBe(330);
    expect(offsetMinutesAt('UTC', new Date('2000-01-01T00:00:00Z'))).toBe(0);
  });

  it('reads historical offsets that differ from today', () => {
    // Kolkata was on +5:21 in 1900, not today's +5:30.
    expect(offsetMinutesAt('Asia/Kolkata', new Date('1900-06-15T00:00:00Z'))).toBe(321);
    // And on +6:30 during the war years.
    expect(offsetMinutesAt('Asia/Kolkata', new Date('1943-06-15T00:00:00Z'))).toBe(390);
  });

  it('tracks daylight saving within a year', () => {
    expect(offsetMinutesAt('America/New_York', new Date('1985-01-22T15:00:00Z'))).toBe(-300);
    expect(offsetMinutesAt('America/New_York', new Date('1985-07-22T14:00:00Z'))).toBe(-240);
  });
});

describe('resolveLocalTime', () => {
  it('converts a local time to the correct instant', () => {
    const result = resolveLocalTime('Asia/Kolkata', 1985, 7, 22, 14, 20);
    expect(result.offsetHours).toBe(5.5);
    expect(result.utc.toISOString()).toBe('1985-07-22T08:50:00.000Z');
  });

  it('handles the year Britain stayed on summer time', () => {
    // Britain did not return to GMT between 1968 and 1971, so a June 1970
    // birth is at +1 — and so is a January one.
    expect(resolveLocalTime('Europe/London', 1970, 6, 15, 12, 0).offsetHours).toBe(1);
    expect(resolveLocalTime('Europe/London', 1970, 1, 15, 12, 0).offsetHours).toBe(1);
    // By 1985 the ordinary pattern had resumed.
    expect(resolveLocalTime('Europe/London', 1985, 1, 15, 12, 0).offsetHours).toBe(0);
    expect(resolveLocalTime('Europe/London', 1985, 7, 15, 12, 0).offsetHours).toBe(1);
  });

  it('handles offsets that are not whole hours', () => {
    expect(resolveLocalTime('Asia/Kolkata', 2000, 6, 15, 12, 0).offsetHours).toBe(5.5);
    expect(resolveLocalTime('Asia/Kolkata', 1900, 6, 15, 12, 0).offsetHours).toBeCloseTo(5.35, 6);
  });

  it('handles the southern hemisphere, where summer is in January', () => {
    expect(resolveLocalTime('Australia/Sydney', 1985, 1, 15, 12, 0).offsetHours).toBe(11);
    expect(resolveLocalTime('Australia/Sydney', 1985, 7, 15, 12, 0).offsetHours).toBe(10);
  });

  it('handles negative offsets', () => {
    const result = resolveLocalTime('America/New_York', 1985, 7, 22, 10, 0);
    expect(result.offsetHours).toBe(-4);
    expect(result.utc.toISOString()).toBe('1985-07-22T14:00:00.000Z');
  });
});

describe('daylight saving transitions', () => {
  /**
   * Twice a year a local time either does not exist or occurs twice. Both must
   * be detected and labelled correctly — an earlier implementation produced the
   * right instant but reported the skipped hour as ambiguous and the repeated
   * hour as neither.
   */
  it('detects a local time that never happened', () => {
    // US clocks went 02:00 → 03:00 on 12 March 2023, so 02:30 does not exist.
    const result = resolveLocalTime('America/New_York', 2023, 3, 12, 2, 30);
    expect(result.inDaylightGap).toBe(true);
    expect(result.isAmbiguous).toBe(false);
    expect(Number.isFinite(result.utc.getTime())).toBe(true);
  });

  it('detects a local time that happened twice', () => {
    // Clocks went 02:00 → 01:00 on 5 November 2023, so 01:30 occurred twice.
    const result = resolveLocalTime('America/New_York', 2023, 11, 5, 1, 30);
    expect(result.isAmbiguous).toBe(true);
    expect(result.inDaylightGap).toBe(false);
  });

  it('takes the earlier instant for an ambiguous time', () => {
    // The conventional reading. The larger offset gives the earlier instant.
    const result = resolveLocalTime('America/New_York', 2023, 11, 5, 1, 30);
    expect(result.offsetHours).toBe(-4);
  });

  it('flags neither for an ordinary time', () => {
    // False positives here would put a warning on most charts.
    for (const timezone of [
      'America/New_York',
      'Europe/London',
      'Asia/Kolkata',
      'Australia/Sydney',
      'Asia/Shanghai',
    ]) {
      for (let month = 1; month <= 12; month += 1) {
        for (const day of [5, 15, 25]) {
          const result = resolveLocalTime(timezone, 2023, month, day, 12, 0);
          expect(result.inDaylightGap).toBe(false);
          expect(result.isAmbiguous).toBe(false);
        }
      }
    }
  });

  it('always produces a usable instant, even in a gap', () => {
    // A birth certificate can name a time that never existed. The chart must
    // still be computable rather than the request failing.
    const result = resolveLocalTime('Europe/London', 2023, 3, 26, 1, 30);
    expect(Number.isNaN(result.utc.getTime())).toBe(false);
  });
});

describe('isKnownTimezone', () => {
  it('accepts real zone identifiers', () => {
    expect(isKnownTimezone('Asia/Kolkata')).toBe(true);
    expect(isKnownTimezone('America/New_York')).toBe(true);
    expect(isKnownTimezone('UTC')).toBe(true);
  });

  it('rejects anything the runtime does not recognise', () => {
    expect(isKnownTimezone('Mars/Olympus_Mons')).toBe(false);
    expect(isKnownTimezone('not a zone')).toBe(false);
    expect(isKnownTimezone('')).toBe(false);
  });
});
