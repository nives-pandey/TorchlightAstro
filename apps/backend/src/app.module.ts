import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { validateEnv } from './config/env';
import { DbModule } from './db/db.module';
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
  ],
})
export class AppModule {}
