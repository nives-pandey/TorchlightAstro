import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

import type { Env } from '../config/env';
import * as schema from './schema';

export const DB = Symbol('DB');
export type Database = NeonDatabase<typeof schema>;

/**
 * Neon's driver speaks WebSockets, which Node does not provide natively.
 * Set once at module load rather than per-connection.
 */
neonConfig.webSocketConstructor = ws;

/**
 * A single pool per warm function instance.
 *
 * Connection count is the thing to protect here: every cold start that opens
 * its own pool consumes Neon connections, and under concurrency that exhausts
 * the limit long before CPU or memory become interesting. Holding the pool at
 * module scope means warm invocations reuse it, and `max: 1` keeps a single
 * instance from opening a fan of connections it will never use concurrently —
 * serverless handles one request at a time.
 */
let pool: Pool | undefined;

function getPool(connectionString: string): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return pool;
}

@Global()
@Module({
  providers: [
    {
      provide: DB,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>): Database => {
        const url = config.get('DATABASE_URL', { infer: true });
        return drizzle(getPool(url), { schema });
      },
    },
  ],
  exports: [DB],
})
export class DbModule {}
