/**
 * Torchlight — application module graph
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { validateEnv } from './config/env';
import { AuthModule } from './auth/auth.module';
import { ChartModule } from './chart/chart.module';
import { DbModule } from './db/db.module';
import { ProfilesModule } from './profiles/profiles.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      cache: true,
    }),
    /**
     * A baseline limit on every route. Endpoints that call a model or send mail
     * tighten this further with their own decorator — those are the ones where
     * abuse costs real money rather than just CPU.
     */
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    DbModule,
    HealthModule,
    AuthModule,
    ChartModule,
    ProfilesModule,
  ],
})
export class AppModule {}
