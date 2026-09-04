/**
 * Torchlight — reading contracts
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * What the language model is allowed to see, and what it must return.
 *
 * The brief is the whole contract. It carries verified conclusions in plain
 * words — "Jupiter period, ends 2033", "all five traditions agree" — and never
 * a longitude, a degree, or anything the model could arithmetic its way into a
 * new claim from. The model's only job is to say the same things in language a
 * person understands. It decides nothing about what is true.
 *
 * That constraint is what makes the output auditable: every sentence it writes
 * has to correspond to a line of the brief, and a reader can be shown which.
 */

/** One verified fact, stated plainly, with where it came from. */
export interface BriefFact {
  /** e.g. "Current period", "Where traditions agree". */
  label: string;
  /** The fact in plain words, already free of jargon where possible. */
  statement: string;
  /** The placements this was derived from. Never interpreted, only cited. */
  basis: string[];
}

export interface ReadingBrief {
  /** What the person is called, so the reading can address them. */
  displayName: string;
  /** Whether houses and the ascendant are available. */
  hasBirthTime: boolean;
  /** The time-bound periods, if the chart has them. */
  now: BriefFact[];
  /** What is unusual about this chart. Empty when nothing is. */
  notable: BriefFact[];
  /** Where the traditions agree and disagree about character. */
  character: BriefFact[];
}

/**
 * The generated reading.
 *
 * Deliberately short. A person opening an app wants to understand their chart,
 * not read an essay, and every extra paragraph is more surface for the model to
 * drift away from the brief.
 */
export interface Reading {
  /** Two or three sentences on the period they are living through now. */
  now: string;
  /** Two or three sentences on what stands out in the chart. */
  standsOut: string;
  /** Two or three sentences on what the traditions say about character. */
  character: string;
  /** Which model wrote it, so a reading can be regenerated deliberately. */
  model: string;
  generatedAt: string;
}
