/**
 * Torchlight — reading module
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { Module } from '@nestjs/common';

import { ReadingService } from './reading.service';

@Module({
  providers: [ReadingService],
  exports: [ReadingService],
})
export class ReadingModule {}
