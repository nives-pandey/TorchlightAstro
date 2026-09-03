import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

/**
 * Migrations are generated files checked into the repo, not `push`.
 *
 * `drizzle-kit push` diffs against the live database and applies whatever it
 * decides — fine for a scratch database, wrong for one holding real users:
 * there is no review step, no record of what ran, and no way back. Generated
 * SQL can be read in a pull request and replayed in order on any environment.
 */
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  strict: true,
  verbose: true,
});
