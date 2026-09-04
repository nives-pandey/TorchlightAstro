/**
 * Torchlight — the reading service
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import Anthropic from '@anthropic-ai/sdk';
import { Injectable, Logger } from '@nestjs/common';

import type { Chart } from '../astrology/chart';
import { buildBrief, renderBrief } from './brief';
import type { Reading, ReadingBrief } from './reading.types';

/**
 * Turns a verified chart into prose a person can read.
 *
 * A chart states facts in the vocabulary of the traditions that produced them —
 * "Jupiter mahadasha", "Uttara Phalguni pada 1", "Yang Metal day master". Every
 * one of those is precise and almost none of them mean anything to someone
 * meeting them for the first time. Knowing which period you are in is not the
 * same as knowing what that tells you, and the gap between those two is where
 * this service sits.
 *
 * What it is *not* is a source of astrological claims. The model receives the
 * brief and nothing else: no longitudes, no degrees, no raw placements it could
 * compute a new assertion from. It rephrases what the engine already verified.
 * Every sentence it writes traces to a line of the brief, and a reader can be
 * shown which line.
 */

export const READING_MODEL = 'claude-opus-5';

/**
 * The instruction that constrains the model to translation.
 *
 * Stable across requests so it caches: the brief varies per person, this does
 * not, and putting it first means the cached prefix covers it.
 */
const SYSTEM_PROMPT = `You write short, plain-language readings for Torchlight, an astrology app that computes charts across ten traditions.

You will be given a brief containing facts that have already been calculated and verified. Your only job is to express those facts in language someone unfamiliar with astrology can understand.

Rules, in order of importance:

1. Every statement you make must come from the brief. Do not add placements, predictions, dates, or interpretations that are not there. If the brief does not say it, you do not know it.

2. Translate the jargon. "Jupiter mahadasha" means little to most readers; "a sixteen-year Jupiter period" means more. Name the traditional term once where it helps someone look it up, then use plain words.

3. Do not tell people what will happen to them. These traditions describe tendencies and periods, not events. Write "this period is traditionally associated with expansion and study" rather than "you will succeed". Never predict health, death, wealth, or relationships.

4. Where traditions disagree, say so plainly and treat it as interesting rather than as a problem to resolve. That disagreement is the most distinctive thing this app can show someone.

5. Be brief. Two to three sentences per section. No preamble, no summary, no questions back to the reader.

6. Address the person as "you". Do not use their name — they know it.

Write in a warm, grounded register. Avoid mystical padding, exclamation marks, and second-person imperatives ("embrace your...", "lean into...").`;

interface ReadingSections {
  now: string;
  standsOut: string;
  character: string;
}

@Injectable()
export class ReadingService {
  private readonly logger = new Logger(ReadingService.name);
  private readonly client: Anthropic | null;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    // The app must work without a key. Charts are the product; readings are a
    // layer on top, and an unset key disables that layer rather than breaking
    // every request.
    this.client = apiKey ? new Anthropic({ apiKey }) : null;

    if (!this.client) {
      this.logger.warn('ANTHROPIC_API_KEY is unset — readings are disabled.');
    }
  }

  /** Whether readings can be generated at all. */
  get available(): boolean {
    return this.client !== null;
  }

  /**
   * Writes a reading for a chart.
   *
   * Returns null rather than throwing when the layer is unavailable or the
   * model fails: a chart without a reading is still a complete product, and a
   * failed reading should not take the chart screen down with it.
   */
  async generate(chart: Chart, displayName: string, at: Date = new Date()): Promise<Reading | null> {
    if (!this.client) return null;

    const brief = buildBrief(chart, displayName, at);

    try {
      const response = await this.client.messages.create({
        model: READING_MODEL,
        max_tokens: 16000,
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        output_config: {
          effort: 'low',
          format: {
            type: 'json_schema',
            schema: {
              type: 'object',
              properties: {
                now: { type: 'string' },
                standsOut: { type: 'string' },
                character: { type: 'string' },
              },
              required: ['now', 'standsOut', 'character'],
              additionalProperties: false,
            },
          },
        },
        messages: [{ role: 'user', content: renderBrief(brief) }],
      });

      const sections = this.parse(response);
      if (!sections) return null;

      return {
        ...sections,
        model: READING_MODEL,
        generatedAt: at.toISOString(),
      };
    } catch (error) {
      // Logged rather than rethrown, for the reason given on the method.
      this.logger.error(
        `Reading generation failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  /** Exposed so a reading can be shown the exact brief it was written from. */
  briefFor(chart: Chart, displayName: string, at: Date = new Date()): ReadingBrief {
    return buildBrief(chart, displayName, at);
  }

  private parse(response: Anthropic.Message): ReadingSections | null {
    // A refusal is a successful HTTP response with no usable content, so it has
    // to be checked before reading the body.
    if (response.stop_reason === 'refusal') {
      this.logger.error('Model declined to write the reading.');
      return null;
    }

    const text = response.content.find((block) => block.type === 'text');
    if (!text || text.type !== 'text') return null;

    try {
      const parsed: unknown = JSON.parse(text.text);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'now' in parsed &&
        'standsOut' in parsed &&
        'character' in parsed
      ) {
        const { now, standsOut, character } = parsed as Record<string, unknown>;
        if (
          typeof now === 'string' &&
          typeof standsOut === 'string' &&
          typeof character === 'string'
        ) {
          return { now, standsOut, character };
        }
      }
      return null;
    } catch {
      return null;
    }
  }
}
