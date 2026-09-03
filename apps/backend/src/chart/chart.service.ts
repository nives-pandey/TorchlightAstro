/**
 * Torchlight — chart service
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { BadRequestException, Injectable } from '@nestjs/common';

import { buildChart, type BirthInput, type Chart } from '../astrology/chart';
import { isKnownTimezone, resolveLocalTime } from '../astrology/timezone';

/**
 * Turns a validated request into a chart.
 *
 * The engine takes a UTC offset; a request carries an IANA zone id. Resolving
 * one into the other is this service's whole job, and it is deliberately the
 * only place that happens — a second conversion site would be a second place
 * for a timezone bug to live.
 */

export interface ChartResult {
  chart: Chart;
  /**
   * Set when the stated birth time was affected by a clock change, so the
   * interface can tell the user rather than silently choosing for them.
   */
  timeWarning?: 'daylight-gap' | 'ambiguous';
}

/**
 * Optional fields accept an explicit `undefined` as well as omission.
 *
 * Zod's inferred output types a `.optional()` field as `T | undefined`, and
 * under `exactOptionalPropertyTypes` that is not assignable to `T?`. Widening
 * here rather than narrowing at the call site keeps the parsed request usable
 * directly, which is the point of validating with the shared schema.
 */
export interface ChartServiceRequest {
  name?: string | undefined;
  /** `YYYY-MM-DD`. */
  birthDate: string;
  /** `HH:MM`, omitted when unknown. */
  birthTime?: string | undefined;
  timezone: string;
  latitude: number;
  longitude: number;
  houseSystem?: 'placidus' | 'whole-sign' | undefined;
}

@Injectable()
export class ChartService {
  build(request: ChartServiceRequest): ChartResult {
    // The schema guarantees the shape; this guards the one thing it cannot,
    // which is whether the runtime's IANA data recognises the zone.
    if (!isKnownTimezone(request.timezone)) {
      throw new BadRequestException(`Unknown timezone: ${request.timezone}`);
    }

    const [year, month, day] = request.birthDate.split('-').map(Number) as [number, number, number];

    let hour: number | undefined;
    let minute: number | undefined;
    if (request.birthTime) {
      [hour, minute] = request.birthTime.split(':').map(Number) as [number, number];
    }

    /**
     * Without a birth time the offset still has to come from somewhere. Noon is
     * used purely to pick the right side of a DST boundary — it never reaches
     * the chart, because `buildChart` omits every time-dependent section when
     * no hour was supplied.
     */
    const resolved = resolveLocalTime(request.timezone, year, month, day, hour ?? 12, minute ?? 0);

    const input: BirthInput = {
      year,
      month,
      day,
      utcOffsetHours: resolved.offsetHours,
      latitude: request.latitude,
      longitude: request.longitude,
      ...(request.name ? { name: request.name } : {}),
      ...(hour !== undefined ? { hour, minute: minute ?? 0 } : {}),
      ...(request.houseSystem ? { houseSystem: request.houseSystem } : {}),
    };

    const chart = buildChart(input);

    // Only warn when a birth time was actually given — a clock change is
    // irrelevant to a chart that has no time in it.
    if (hour !== undefined && resolved.inDaylightGap) {
      return { chart, timeWarning: 'daylight-gap' };
    }
    if (hour !== undefined && resolved.isAmbiguous) {
      return { chart, timeWarning: 'ambiguous' };
    }

    return { chart };
  }
}
