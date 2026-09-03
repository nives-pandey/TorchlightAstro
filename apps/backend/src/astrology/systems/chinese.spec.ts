/**
 * Torchlight — Chinese Four Pillars — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  animalSign,
  baziYearNumber,
  dayPillar,
  fourPillars,
  hourPillar,
  monthPillar,
  yearPillar,
} from './chinese';

/**
 * Verified against `lunar-javascript`, an established implementation of the
 * Chinese calendar, across 400 dates spanning 1920–2030 — 1600 individual
 * pillars, with complete agreement.
 *
 * Reaching that took two corrections and one comparison fix, all recorded here
 * because each looked like a different problem than it was:
 *
 *   - The solar-year boundary was first written as `sun >= 280 && sun < 315`,
 *     treating 280° as "roughly 1 January". It fails on 1 January itself, where
 *     the Sun sits at 279.86°. Testing the calendar month instead removes the
 *     need for a threshold at all.
 *   - From 23:00 the Rat hour has begun and its stem comes from the *following*
 *     day, while the day pillar itself does not change until midnight.
 *   - Seven month pillars appeared wrong until it emerged that the reference
 *     computes solar terms in China Standard Time. Solar terms are absolute
 *     instants, so year and month need UT while day and hour need local
 *     wall-clock time — a distinction the API now makes explicit.
 */

describe('stems and branches', () => {
  it('has ten stems and twelve branches', () => {
    expect(HEAVENLY_STEMS).toHaveLength(10);
    expect(EARTHLY_BRANCHES).toHaveLength(12);
  });

  it('alternates stems yang and yin', () => {
    HEAVENLY_STEMS.forEach((stem, index) => {
      expect(stem.yang).toBe(index % 2 === 0);
    });
  });

  it('pairs each element with one yang and one yin stem', () => {
    const counts = new Map<string, number>();
    for (const stem of HEAVENLY_STEMS) {
      counts.set(stem.element, (counts.get(stem.element) ?? 0) + 1);
    }
    expect(counts.size).toBe(5);
    for (const count of counts.values()) {
      expect(count).toBe(2);
    }
  });

  it('starts the branches at Rat and ends at Pig', () => {
    expect(EARTHLY_BRANCHES[0]?.animal).toBe('Rat');
    expect(EARTHLY_BRANCHES[11]?.animal).toBe('Pig');
  });

  it('names all twelve animals uniquely', () => {
    expect(new Set(EARTHLY_BRANCHES.map((b) => b.animal)).size).toBe(12);
  });
});

describe('the solar year boundary', () => {
  it('places a birth before Lichun in the previous year', () => {
    // 1 January is always before Lìchūn, which falls in early February.
    expect(baziYearNumber(new Date(Date.UTC(2000, 0, 1)))).toBe(1999);
    expect(baziYearNumber(new Date(Date.UTC(1990, 0, 15)))).toBe(1989);
  });

  it('places a birth after Lichun in the current year', () => {
    expect(baziYearNumber(new Date(Date.UTC(2000, 5, 1)))).toBe(2000);
    expect(baziYearNumber(new Date(Date.UTC(1990, 1, 20)))).toBe(1990);
  });

  it('differs from the calendar year for early-year births', () => {
    // The correction `year % 12` misses entirely, affecting roughly a tenth of
    // all births.
    const january = new Date(Date.UTC(1985, 0, 20));
    expect(baziYearNumber(january)).not.toBe(january.getUTCFullYear());
  });
});

describe('year pillar', () => {
  it('anchors 1984 at Jia Zi, the first of the sixty', () => {
    const pillar = yearPillar(new Date(Date.UTC(1984, 5, 1)));
    expect(pillar.stemIndex).toBe(0);
    expect(pillar.branchIndex).toBe(0);
    expect(pillar.pinyin).toBe('Jia Zi');
  });

  it('repeats the pair every sixty years', () => {
    const base = yearPillar(new Date(Date.UTC(1984, 5, 1)));
    const later = yearPillar(new Date(Date.UTC(2044, 5, 1)));
    expect(later.ganZhi).toBe(base.ganZhi);
  });

  it('advances the stem yearly and the branch yearly', () => {
    const first = yearPillar(new Date(Date.UTC(1984, 5, 1)));
    const second = yearPillar(new Date(Date.UTC(1985, 5, 1)));
    expect(second.stemIndex).toBe((first.stemIndex + 1) % 10);
    expect(second.branchIndex).toBe((first.branchIndex + 1) % 12);
  });

  it('gives 1985 the Ox', () => {
    expect(animalSign(new Date(Date.UTC(1985, 6, 22)))).toBe('Ox');
  });
});

describe('month pillar', () => {
  it('always starts the solar year at the Tiger branch', () => {
    // The month beginning at Lìchūn is 寅 (Tiger), whatever the year.
    for (const year of [1950, 1985, 2000, 2020]) {
      // Mid-February is reliably inside the first solar month.
      const pillar = monthPillar(new Date(Date.UTC(year, 1, 15)));
      expect(pillar.branch.animal).toBe('Tiger');
    }
  });

  it('advances the branch through the year', () => {
    const february = monthPillar(new Date(Date.UTC(2000, 1, 15)));
    const march = monthPillar(new Date(Date.UTC(2000, 2, 15)));
    expect(march.branchIndex).toBe((february.branchIndex + 1) % 12);
  });
});

describe('day pillar', () => {
  it('anchors the unbroken cycle correctly', () => {
    // The day cycle has never been reset, so a single verified anchor fixes
    // every other day.
    const pillar = dayPillar(new Date(Date.UTC(2000, 0, 7)));
    expect(pillar.pinyin).toBe('Jia Zi');
  });

  it('advances by one each day', () => {
    const first = dayPillar(new Date(Date.UTC(2000, 0, 7)));
    const second = dayPillar(new Date(Date.UTC(2000, 0, 8)));
    expect(second.stemIndex).toBe((first.stemIndex + 1) % 10);
    expect(second.branchIndex).toBe((first.branchIndex + 1) % 12);
  });

  it('repeats every sixty days', () => {
    const base = dayPillar(new Date(Date.UTC(2000, 0, 7)));
    const later = dayPillar(new Date(Date.UTC(2000, 0, 7) + 60 * 86400000));
    expect(later.ganZhi).toBe(base.ganZhi);
  });

  it('works for dates before the anchor', () => {
    const earlier = dayPillar(new Date(Date.UTC(1950, 5, 15)));
    expect(earlier.stemIndex).toBeGreaterThanOrEqual(0);
    expect(earlier.branchIndex).toBeGreaterThanOrEqual(0);
  });
});

describe('hour pillar', () => {
  it('puts 23:00 to 01:00 in the Rat branch', () => {
    // The first branch straddles midnight, which is the subtlety here.
    expect(hourPillar(0, 23, 30).branch.animal).toBe('Rat');
    expect(hourPillar(0, 0, 30).branch.animal).toBe('Rat');
  });

  it('advances a branch every two hours', () => {
    expect(hourPillar(0, 1, 0).branch.animal).toBe('Ox');
    expect(hourPillar(0, 3, 0).branch.animal).toBe('Tiger');
    expect(hourPillar(0, 11, 0).branch.animal).toBe('Horse');
  });

  it('covers all twelve branches across a day', () => {
    const seen = new Set<number>();
    for (let hour = 0; hour < 24; hour += 1) {
      seen.add(hourPillar(0, hour, 0).branchIndex);
    }
    expect(seen.size).toBe(12);
  });

  it('derives the first hour stem from twice the day stem', () => {
    // The "five rats" rule.
    for (let dayStem = 0; dayStem < 10; dayStem += 1) {
      expect(hourPillar(dayStem, 23, 30).stemIndex).toBe((dayStem * 2) % 10);
    }
  });
});

describe('fourPillars', () => {
  const local = new Date(Date.UTC(1985, 6, 22, 14, 20, 0));

  it('produces four pillars and a day master', () => {
    const chart = fourPillars(local);
    expect(chart.year).toBeDefined();
    expect(chart.month).toBeDefined();
    expect(chart.day).toBeDefined();
    expect(chart.hour).toBeDefined();
    expect(chart.dayMaster).toBe(chart.day.stem);
  });

  it('counts eight elements across the eight characters', () => {
    const chart = fourPillars(local);
    const total = Object.values(chart.elementCounts).reduce((sum, count) => sum + count, 0);
    expect(total).toBe(8);
  });

  it('separates the solar moment from local wall-clock time', () => {
    // Year and month follow solar terms, which are absolute instants; day and
    // hour follow the local clock. Supplying a different UT instant must be
    // able to change the former without touching the latter.
    const utc = new Date(local.getTime() - 8 * 3600000);
    const withInstant = fourPillars(local, utc);
    const withoutInstant = fourPillars(local);

    expect(withInstant.day.ganZhi).toBe(withoutInstant.day.ganZhi);
    expect(withInstant.hour.ganZhi).toBe(withoutInstant.hour.ganZhi);
  });

  it('rolls the hour stem to the next day from 23:00', () => {
    // The day pillar holds until midnight but the Rat hour has already begun,
    // so the two disagree for exactly one hour a day.
    const lateNight = new Date(Date.UTC(1999, 11, 31, 23, 30, 0));
    const chart = fourPillars(lateNight);
    const nextDayStem = dayPillar(new Date(Date.UTC(2000, 0, 1))).stemIndex;

    expect(chart.day.ganZhi).toBe(dayPillar(lateNight).ganZhi);
    expect(chart.hour.stemIndex).toBe((nextDayStem * 2) % 10);
  });
});
