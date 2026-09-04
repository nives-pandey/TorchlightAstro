/**
 * Torchlight — database schema
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

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
 * A computed chart, cached per birth profile.
 *
 * One row per profile, not per system. The engine assembles all ten systems and
 * the cross-system synthesis in a single pass, and they share the same
 * astronomical basis — storing them separately would mean a profile could hold
 * a Vedic section computed under one engine version beside a Western section
 * computed under another.
 *
 * Recomputing is deterministic and takes about thirty milliseconds, so caching
 * is not about the arithmetic. It is about everything downstream: an AI reading
 * generated from a chart must stay attached to exactly the chart it described.
 *
 * `engineVersion` is what makes a correction shippable. Fixing the ephemeris
 * means bumping it and letting stale rows regenerate, rather than hunting for
 * which cached charts are now wrong.
 */
export const charts = pgTable(
  'charts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    birthProfileId: uuid('birth_profile_id')
      .notNull()
      .references(() => birthProfiles.id, { onDelete: 'cascade' })
      .unique(),
    /** The complete Chart object the engine produced. */
    data: jsonb('data').notNull(),
    /** Which house system this was computed with, since it changes the result. */
    houseSystem: varchar('house_system', { length: 16 }).notNull(),
    engineVersion: varchar('engine_version', { length: 32 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('charts_profile_idx').on(table.birthProfileId)],
);

/**
 * Generated readings, one per chart.
 *
 * Stored rather than generated per request for three reasons: a reading costs
 * money to produce, takes seconds rather than milliseconds, and is deterministic
 * in its inputs — the same chart yields the same brief forever, so regenerating
 * it on every open would buy nothing.
 *
 * Cascading from `charts` rather than from `birth_profiles` is deliberate. A
 * chart is recomputed when the engine version or house system changes, and a
 * reading written against the old placements is then wrong. Hanging it off the
 * chart means that staleness is impossible to forget about.
 */
export const readings = pgTable(
  'readings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    chartId: uuid('chart_id')
      .notNull()
      .references(() => charts.id, { onDelete: 'cascade' })
      .unique(),
    /** The three prose sections, as the model returned them. */
    data: jsonb('data').notNull(),
    /** Which model wrote it, so a reading can be regenerated deliberately. */
    model: varchar('model', { length: 64 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('readings_chart_idx').on(table.chartId)],
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
export type ReadingRow = typeof readings.$inferSelect;
export type RefreshTokenRow = typeof refreshTokens.$inferSelect;
