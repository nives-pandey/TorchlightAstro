import { config } from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import ws from 'ws';

config({ path: '.env' });

neonConfig.webSocketConstructor = ws;

/**
 * Applies pending migrations from ./drizzle in order.
 *
 * Run deliberately — from a terminal or a deploy step — never automatically at
 * application boot. On serverless every cold start would race to run the same
 * migration, and a schema change would go out with no one watching it.
 */
async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required to run migrations');
  }

  const pool = new Pool({ connectionString: url, max: 1 });
  const db = drizzle(pool);

  console.log('Applying migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations applied.');

  await pool.end();
}

main().catch((error: unknown) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
