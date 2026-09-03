/**
 * Torchlight — health and readiness endpoints
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { Controller, Get, Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';

import { DB, type Database } from '../db/db.module';

@Controller('health')
export class HealthController {
  constructor(@Inject(DB) private readonly db: Database) {}

  /**
   * Liveness only — answers if the process is up. Deliberately does not touch
   * the database, so a database incident does not also make the app look down
   * to whatever is polling this.
   */
  @Get()
  check(): { status: 'ok'; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  /**
   * Readiness — confirms the database answers. Separate from the above so the
   * two failure modes stay distinguishable.
   */
  @Get('ready')
  async ready(): Promise<{ status: 'ok'; database: 'connected' }> {
    await this.db.execute(sql`select 1`);
    return { status: 'ok', database: 'connected' };
  }
}
