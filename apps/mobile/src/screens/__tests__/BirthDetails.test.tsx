/**
 * Torchlight — birth details tests
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

/**
 * The server requires a birth time as HH:MM and rejects "9:30", which is a
 * natural thing to type — and the screen's own readiness check accepted it, so
 * the button enabled and the save then failed with "Some of the details
 * provided are not valid". The mismatch between what the form allows and what
 * the API accepts is the bug; padding the hour is the fix.
 */
describe('birth time normalisation', () => {
  /** Mirrors the helper in BirthDetailsScreen. */
  const normalise = (raw: string): string => {
    const [hours, minutes] = raw.trim().split(':');
    if (hours === undefined || minutes === undefined) return raw.trim();
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  /** The server's rule, copied from birthTimeSchema. */
  const accepted = (value: string): boolean => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

  it.each([
    ['9:30', '09:30'],
    ['09:30', '09:30'],
    ['0:05', '00:05'],
    ['14:30', '14:30'],
    ['23:59', '23:59'],
  ])('turns %s into a time the server accepts', (input, expected) => {
    expect(normalise(input)).toBe(expected);
    expect(accepted(normalise(input))).toBe(true);
  });

  it('is what the server would have rejected before', () => {
    expect(accepted('9:30')).toBe(false);
    expect(accepted(normalise('9:30'))).toBe(true);
  });

  it('leaves genuinely malformed input alone for the server to refuse', () => {
    // Padding must not invent a valid time out of nonsense.
    expect(accepted(normalise('99:99'))).toBe(false);
    expect(accepted(normalise('not a time'))).toBe(false);
  });
});
