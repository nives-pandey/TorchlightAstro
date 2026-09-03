import {
  boolean,
  index,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

/**
 * Torchlight's data is relational — a user owns birth profiles, a profile owns
 * charts, a chart owns readings — so foreign keys and cascade rules do the work
 * rather than application code remembering to clean up.
 *
 * Every table that holds user data carries a path back to `users.id`, because
 * account deletion has to be provably complete: Google Play requires it, and
 * `onDelete: 'cascade'` makes it one statement instead of a checklist.
 */

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 254 }).notNull(),
    /** Null for Google-only accounts, which have no password to verify. */
    passwordHash: text('password_hash'),
    displayName: varchar('display_name', { length: 80 }).notNull(),
    /** Set once onboarding completes; the profile this account is "about". */
    primaryBirthProfileId: uuid('primary_birth_profile_id'),
    googleSub: varchar('google_sub', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('users_email_unique').on(table.email),
    uniqueIndex('users_google_sub_unique').on(table.googleSub),
  ],
);

/**
 * Birth date/time are stored as text beside an IANA zone rather than as a
 * timestamp. A birth is a local wall-clock event; the UTC offset that applied
 * on that date in that place is a lookup, and historical zone rules change.
 * Storing an instant would freeze whatever offset the device believed at entry.
 *
 * `birthTime` is nullable because many people do not know theirs — a first-class
 * state that suppresses houses and ascendant rather than inviting a guess.
 */
export const birthProfiles = pgTable(
  'birth_profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    displayName: varchar('display_name', { length: 80 }).notNull(),
    birthDate: varchar('birth_date', { length: 10 }).notNull(),
    birthTime: varchar('birth_time', { length: 5 }),
    placeName: varchar('place_name', { length: 200 }).notNull(),
    countryCode: varchar('country_code', { length: 2 }).notNull(),
    timezone: varchar('timezone', { length: 64 }).notNull(),
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull(),
    isSelf: boolean('is_self').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('birth_profiles_user_idx').on(table.userId)],
);

/**
 * A computed chart, cached per (profile, system). Recomputing is deterministic
 * and cheap, but readings generated from a chart are not, so charts are stored
 * to keep those stable.
 *
 * `engineVersion` is what makes a correction shippable: fixing the ephemeris
 * means bumping it and letting stale rows regenerate, rather than hunting for
 * which cached charts are now wrong.
 */
export const charts = pgTable(
  'charts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    birthProfileId: uuid('birth_profile_id')
      .notNull()
      .references(() => birthProfiles.id, { onDelete: 'cascade' }),
    system: varchar('system', { length: 32 }).notNull(),
    data: jsonb('data').notNull(),
    provenance: jsonb('provenance').notNull(),
    engineVersion: varchar('engine_version', { length: 32 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('charts_profile_system_unique').on(table.birthProfileId, table.system),
    index('charts_profile_idx').on(table.birthProfileId),
  ],
);

/** Long-lived refresh tokens, stored hashed so a database leak cannot mint sessions. */
export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: varchar('token_hash', { length: 64 }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('refresh_tokens_hash_unique').on(table.tokenHash),
    index('refresh_tokens_user_idx').on(table.userId),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type BirthProfileRow = typeof birthProfiles.$inferSelect;
export type NewBirthProfileRow = typeof birthProfiles.$inferInsert;
export type ChartRow = typeof charts.$inferSelect;
export type RefreshTokenRow = typeof refreshTokens.$inferSelect;
