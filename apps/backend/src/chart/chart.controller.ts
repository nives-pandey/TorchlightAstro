/**
 * Torchlight — chart endpoints
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { chartRequestSchema, type ChartRequest } from '@torchlight/shared-types';

import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { ChartService, type ChartResult } from './chart.service';

@Controller('chart')
export class ChartController {
  constructor(private readonly charts: ChartService) {}

  /**
   * Builds a complete chart from birth data.
   *
   * POST rather than GET because a birth date, time and place together identify
   * a person, and putting that in a URL would write it into every access log
   * and browser history along the way.
   *
   * 200 rather than 201: this computes a representation, it does not create a
   * stored resource. Nothing is persisted yet.
   *
   * Rate limited more tightly than the global default. A chart is roughly 30ms
   * of arithmetic across twenty modules, which is cheap individually and worth
   * bounding in aggregate.
   */
  @Post()
  @HttpCode(200)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @UsePipes(new ZodValidationPipe(chartRequestSchema))
  build(@Body() request: ChartRequest): ChartResult {
    return this.charts.build(request);
  }
}
