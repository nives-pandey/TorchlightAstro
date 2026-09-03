import { NAKSHATRAS, NAKSHATRA_SPAN, PADA_SPAN, nakshatraOf, rashiOf, RASHIS } from './nakshatra';

/**
 * Nakshatras are the input to the Vimshottari Dasha, so an error here does not
 * stay local — it moves every planetary period of a person's life by years.
 *
 * Boundary behaviour matters more than typical cases: a birth a fraction of a
 * degree either side of 13°20′ belongs to a different nakshatra with a
 * different ruler.
 */

describe('nakshatra table', () => {
  it('has all 27', () => {
    expect(NAKSHATRAS).toHaveLength(27);
  });

  it('spans 13°20′ each', () => {
    expect(NAKSHATRA_SPAN).toBeCloseTo(13 + 20 / 60, 10);
    expect(NAKSHATRA_SPAN * 27).toBeCloseTo(360, 10);
  });

  it('divides into four padas of 3°20′', () => {
    expect(PADA_SPAN).toBeCloseTo(3 + 20 / 60, 10);
    expect(PADA_SPAN * 4).toBeCloseTo(NAKSHATRA_SPAN, 10);
  });

  it('repeats the nine rulers exactly three times in fixed order', () => {
    // The Vimshottari Dasha depends on this cycle; a reordering would silently
    // produce the wrong life periods.
    const expected = [
      'Ketu',
      'Venus',
      'Sun',
      'Moon',
      'Mars',
      'Rahu',
      'Jupiter',
      'Saturn',
      'Mercury',
    ];
    for (let i = 0; i < 27; i += 1) {
      expect((NAKSHATRAS[i] as { ruler: string }).ruler).toBe(expected[i % 9]);
    }
  });

  it('uses unique names', () => {
    expect(new Set(NAKSHATRAS.map((n) => n.name)).size).toBe(27);
  });
});

describe('nakshatraOf', () => {
  it('places 0° sidereal at the start of Ashwini', () => {
    const result = nakshatraOf(0);
    expect(result.index).toBe(1);
    expect(result.name).toBe('Ashwini');
    expect(result.ruler).toBe('Ketu');
    expect(result.pada).toBe(1);
    expect(result.fraction).toBe(0);
  });

  it('places the last degree of the zodiac in Revati', () => {
    const result = nakshatraOf(359.99);
    expect(result.index).toBe(27);
    expect(result.name).toBe('Revati');
    expect(result.pada).toBe(4);
  });

  it('switches nakshatra exactly at the boundary', () => {
    // 13°20′ is the first degree of Bharani, not the last of Ashwini.
    expect(nakshatraOf(NAKSHATRA_SPAN - 0.0001).name).toBe('Ashwini');
    expect(nakshatraOf(NAKSHATRA_SPAN).name).toBe('Bharani');
  });

  it('advances the pada at each quarter', () => {
    for (let pada = 1; pada <= 4; pada += 1) {
      const middle = (pada - 1) * PADA_SPAN + PADA_SPAN / 2;
      expect(nakshatraOf(middle).pada).toBe(pada);
    }
  });

  it('reports the fraction travelled, which seeds the dasha balance', () => {
    expect(nakshatraOf(NAKSHATRA_SPAN / 2).fraction).toBeCloseTo(0.5, 10);
    expect(nakshatraOf(NAKSHATRA_SPAN * 0.25).fraction).toBeCloseTo(0.25, 10);
  });

  it('normalises longitudes outside 0-360', () => {
    expect(nakshatraOf(360).name).toBe('Ashwini');
    expect(nakshatraOf(-1).name).toBe('Revati');
  });

  it('covers the whole circle without gaps or overlaps', () => {
    // Walk in small steps and confirm the index only ever advances by one.
    let previous = nakshatraOf(0).index;
    for (let longitude = 0.1; longitude < 360; longitude += 0.1) {
      const current = nakshatraOf(longitude).index;
      const step = current - previous;
      expect(step === 0 || step === 1).toBe(true);
      previous = current;
    }
    expect(previous).toBe(27);
  });
});

describe('rashiOf', () => {
  it('has twelve signs', () => {
    expect(RASHIS).toHaveLength(12);
  });

  it('places 0° in Mesha and 359° in Meena', () => {
    expect(rashiOf(0).name).toBe('Mesha');
    expect(rashiOf(359).name).toBe('Meena');
  });

  it('switches sign exactly at each 30° boundary', () => {
    expect(rashiOf(29.9999).index).toBe(1);
    expect(rashiOf(30).index).toBe(2);
  });

  it('reports degrees into the sign', () => {
    expect(rashiOf(45).degreesInto).toBeCloseTo(15, 10);
    expect(rashiOf(30).degreesInto).toBeCloseTo(0, 10);
  });
});
