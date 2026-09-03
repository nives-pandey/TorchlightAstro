/**
 * Torchlight — ephemeris reference fixture generator
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * Generates ephemeris test fixtures from NASA JPL Horizons.
 *
 * Run deliberately (`npx tsx scripts/generate-ephemeris-fixtures.ts`), not in
 * CI. The output is committed, so the test suite verifies against a fixed
 * reference offline and a JPL outage can never turn the build red. Regenerate
 * only when adding cases, and review the diff — a change in these numbers means
 * either a new case or something that deserves an explanation.
 *
 * Ground truth is Horizons rather than another astrology library, because
 * comparing two astrology libraries only proves they share assumptions. JPL is
 * the ephemeris that observatories point telescopes with.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** Horizons body ids. Geocentric apparent positions, so these are the targets. */
const BODIES: Record<string, string> = {
  Sun: '10',
  Moon: '301',
  Mercury: '199',
  Venus: '299',
  Mars: '499',
  Jupiter: '599',
  Saturn: '699',
  Uranus: '799',
  Neptune: '899',
  Pluto: '999',
};

/**
 * Cases chosen to exercise the parts of the code most likely to be wrong,
 * not to be representative births:
 *
 *  - dates spanning 1900–2024, so ΔT is materially different across them
 *  - a leap day, and both January and December, which stress the month-shift
 *    in the Julian Day conversion
 *  - midnight and noon, where a sign error in the day fraction shows up
 *  - a retrograde Mercury window and a near-station Mars date, where a small
 *    time error produces a large longitude error
 */
const CASES: Array<{ label: string; utc: string }> = [
  { label: 'J2000 epoch', utc: '2000-01-01 12:00' },
  { label: 'midnight UTC', utc: '2000-01-01 00:00' },
  { label: 'early 20th century', utc: '1901-06-15 08:30' },
  { label: 'pre-WWII', utc: '1936-11-03 23:45' },
  { label: 'mid-century', utc: '1962-03-15 06:15' },
  { label: 'leap day', utc: '1976-02-29 12:00' },
  { label: 'summer 1985', utc: '1985-07-22 14:20' },
  { label: 'year boundary', utc: '1999-12-31 23:59' },
  { label: 'Mercury retrograde', utc: '2001-11-08 09:00' },
  { label: 'post-2000', utc: '2010-05-20 18:45' },
  { label: 'recent', utc: '2024-09-14 03:30' },
  { label: 'southern-hemisphere date', utc: '1993-08-07 21:10' },
];

interface FixtureEntry {
  label: string;
  utc: string;
  /** Apparent geocentric ecliptic longitude of date, degrees. */
  longitudes: Record<string, number>;
  /** Apparent geocentric ecliptic latitude of date, degrees. */
  latitudes: Record<string, number>;
}

async function fetchBody(bodyId: string, utc: string): Promise<{ lon: number; lat: number }> {
  const start = utc;
  // Horizons needs a range, so ask for one one-minute step and take the first
  // row. Two traps here, both hit while writing this: a bare date with no time
  // returns an empty block, and naive string arithmetic on the minute produces
  // "23:60" for a 23:59 case, which Horizons rejects outright. Let Date roll
  // the hour, day, month and year over instead.
  const stopDate = new Date(`${utc.replace(' ', 'T')}:00Z`);
  stopDate.setUTCMinutes(stopDate.getUTCMinutes() + 1);
  const stop = `${stopDate.toISOString().slice(0, 16).replace('T', ' ')}`;

  const params = new URLSearchParams({
    format: 'text',
    COMMAND: `'${bodyId}'`,
    OBJ_DATA: "'NO'",
    MAKE_EPHEM: "'YES'",
    EPHEM_TYPE: "'OBSERVER'",
    CENTER: "'500@399'",
    START_TIME: `'${start}'`,
    STOP_TIME: `'${stop}'`,
    STEP_SIZE: "'1m'",
    QUANTITIES: "'31'",
  });

  const response = await fetch(`https://ssd.jpl.nasa.gov/api/horizons.api?${params}`);
  if (!response.ok) {
    throw new Error(`Horizons returned ${response.status} for body ${bodyId} at ${utc}`);
  }

  const text = await response.text();
  const block = text.split('$$SOE')[1]?.split('$$EOE')[0];
  if (!block) {
    throw new Error(
      `No ephemeris block for body ${bodyId} at ${utc}. Response:\n${text.slice(0, 400)}`,
    );
  }

  const firstRow = block.trim().split('\n')[0];
  if (!firstRow) throw new Error(`Empty ephemeris row for body ${bodyId} at ${utc}`);

  // " 2000-Jan-01 00:00     279.8592049   0.0002403"
  const columns = firstRow.trim().split(/\s+/);
  const lon = Number(columns[columns.length - 2]);
  const lat = Number(columns[columns.length - 1]);

  if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
    throw new Error(`Could not parse row for body ${bodyId} at ${utc}: "${firstRow}"`);
  }

  return { lon, lat };
}

async function main(): Promise<void> {
  const fixtures: FixtureEntry[] = [];

  for (const testCase of CASES) {
    process.stdout.write(`${testCase.utc}  ${testCase.label}\n`);
    const longitudes: Record<string, number> = {};
    const latitudes: Record<string, number> = {};

    for (const [name, id] of Object.entries(BODIES)) {
      const { lon, lat } = await fetchBody(id, testCase.utc);
      longitudes[name] = lon;
      latitudes[name] = lat;
      process.stdout.write(`   ${name.padEnd(9)} ${lon.toFixed(7)}\n`);
      // Deliberately unhurried: this is a rare, manual run against a free
      // public service, and there is no reason to hammer it.
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    fixtures.push({ label: testCase.label, utc: testCase.utc, longitudes, latitudes });
  }

  const output = {
    source: 'NASA JPL Horizons — apparent geocentric ecliptic coordinates of date',
    endpoint: 'https://ssd.jpl.nasa.gov/api/horizons.api',
    generatedAt: new Date().toISOString(),
    note: 'Regenerate with scripts/generate-ephemeris-fixtures.ts. Review any diff.',
    fixtures,
  };

  const target = join(__dirname, '..', 'src', 'astrology', '__fixtures__', 'jpl-horizons.json');
  writeFileSync(target, `${JSON.stringify(output, null, 2)}\n`);
  process.stdout.write(`\nWrote ${fixtures.length} cases to ${target}\n`);
}

main().catch((error: unknown) => {
  console.error('Fixture generation failed:', error);
  process.exit(1);
});
