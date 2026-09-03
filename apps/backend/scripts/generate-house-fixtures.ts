/**
 * Generates house/angle fixtures from Swiss Ephemeris.
 *
 * Run deliberately, never in CI. `swisseph-v2` is a native module that must
 * compile and is not a runtime dependency — it exists only to produce this
 * reference data, which is then committed so the suite runs offline.
 *
 * Why Swiss Ephemeris for houses but NASA JPL for planets: JPL publishes body
 * positions, not house cusps. Houses are a convention layered on top of
 * astronomy, and Swiss is the implementation professional astrology software
 * agrees with. Where Swiss and physics disagree — its post-2022 ΔT is a linear
 * extrapolation that contradicts the leap-second record — physics wins, which
 * is why the cases below stop at 2020.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const sweph = require('swisseph-v2') as {
  swe_julday: (y: number, m: number, d: number, h: number, cal: number) => number;
  swe_houses: (
    jd: number,
    lat: number,
    lon: number,
    hsys: string,
  ) => { house: number[]; ascendant: number; mc: number };
  SE_GREG_CAL: number;
};

interface HouseFixture {
  label: string;
  utc: string;
  latitude: number;
  longitude: number;
  system: 'placidus' | 'whole-sign';
  ascendant: number;
  midheaven: number;
  cusps: number[];
}

/**
 * Cases span both hemispheres, both sides of the prime meridian, every LST
 * quadrant, and latitudes from the equator to just inside the Placidus limit.
 *
 * This breadth is not thoroughness for its own sake. Three separate sign errors
 * in this file's implementation each passed a single Greenwich test: the
 * midheaven was 180° wrong everywhere except the first and fourth LST
 * quadrants, and the ascendant convention agreed with its own inverse at that
 * one location. One test location cannot validate spherical trigonometry.
 */
const CASES: Array<{
  label: string;
  utc: string;
  lat: number;
  lon: number;
}> = [
  { label: 'Greenwich noon', utc: '2000-01-01 12:00', lat: 51.4779, lon: 0 },
  { label: 'Greenwich midnight', utc: '2000-01-01 00:00', lat: 51.4779, lon: 0 },
  { label: 'Delhi', utc: '1985-07-22 08:50', lat: 28.6139, lon: 77.209 },
  { label: 'Mumbai', utc: '1976-02-29 06:30', lat: 19.076, lon: 72.8777 },
  { label: 'Sydney southern', utc: '1962-03-14 20:15', lat: -33.8688, lon: 151.2093 },
  { label: 'Sao Paulo southern', utc: '1993-08-07 21:10', lat: -23.5505, lon: -46.6333 },
  { label: 'New York western', utc: '2010-05-20 22:45', lat: 40.7128, lon: -74.006 },
  { label: 'Los Angeles western', utc: '1999-12-31 23:59', lat: 34.0522, lon: -118.2437 },
  { label: 'Stockholm high north', utc: '2010-09-14 03:30', lat: 59.3293, lon: 18.0686 },
  { label: 'Reykjavik near limit', utc: '1990-05-15 12:00', lat: 64.1466, lon: -21.9426 },
  { label: 'Nairobi equatorial', utc: '1985-11-08 09:00', lat: -1.2921, lon: 36.8219 },
  { label: 'Quito equator', utc: '2001-06-21 12:00', lat: -0.1807, lon: -78.4678 },
  { label: 'Tokyo dateline side', utc: '1970-04-10 15:20', lat: 35.6762, lon: 139.6503 },
  { label: 'Auckland far south-east', utc: '1988-01-05 02:40', lat: -36.8485, lon: 174.7633 },
  { label: 'Anchorage sub-polar', utc: '2005-07-04 18:00', lat: 61.2181, lon: -149.9003 },
  { label: 'Cape Town', utc: '1968-09-30 05:45', lat: -33.9249, lon: 18.4241 },
];

function toParts(utc: string): { y: number; m: number; d: number; hour: number } {
  const [date, time] = utc.split(' ');
  const [y, m, d] = (date as string).split('-').map(Number);
  const [hh, mm] = (time as string).split(':').map(Number);
  return {
    y: y as number,
    m: m as number,
    d: d as number,
    hour: (hh as number) + (mm as number) / 60,
  };
}

function main(): void {
  const fixtures: HouseFixture[] = [];

  for (const testCase of CASES) {
    const { y, m, d, hour } = toParts(testCase.utc);
    const jd = sweph.swe_julday(y, m, d, hour, sweph.SE_GREG_CAL);

    for (const [system, code] of [
      ['placidus', 'P'],
      ['whole-sign', 'W'],
    ] as const) {
      const result = sweph.swe_houses(jd, testCase.lat, testCase.lon, code);
      fixtures.push({
        label: testCase.label,
        utc: testCase.utc,
        latitude: testCase.lat,
        longitude: testCase.lon,
        system,
        ascendant: result.ascendant,
        midheaven: result.mc,
        cusps: result.house.slice(0, 12),
      });
    }

    process.stdout.write(`${testCase.utc}  ${testCase.label}\n`);
  }

  const output = {
    source: 'Swiss Ephemeris (swisseph-v2), swe_houses',
    generatedAt: new Date().toISOString(),
    note: 'Regenerate with scripts/generate-house-fixtures.ts. Review any diff.',
    caveat:
      'Cases stop at 2020: Swiss extrapolates ΔT linearly after ~2022, which contradicts the leap-second record.',
    fixtures,
  };

  const target = join(__dirname, '..', 'src', 'astrology', '__fixtures__', 'swiss-houses.json');
  writeFileSync(target, `${JSON.stringify(output, null, 2)}\n`);
  process.stdout.write(`\nWrote ${fixtures.length} fixtures to ${target}\n`);
}

main();
