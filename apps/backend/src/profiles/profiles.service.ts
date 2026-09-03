/**
 * Torchlight — birth profiles and stored charts
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';

import type { Chart } from '../astrology/chart';
import { ENGINE_VERSION } from '../astrology/chart';
import { ChartService } from '../chart/chart.service';
import { DB, type Database } from '../db/db.module';
import { birthProfiles, charts, users, type BirthProfileRow } from '../db/schema';

/**
 * Stored birth profiles, and the charts computed from them.
 *
 * Every method here takes a `userId` as its first argument, and every query
 * filters on it. That is not a convention to be remembered — it is the only
 * thing standing between one person's birth data and another's, and the
 * previous build's absence of it is why this rebuild exists.
 *
 * The pattern is deliberate: a profile is never fetched by id alone and then
 * checked for ownership afterwards. Ownership is part of the WHERE clause, so
 * a profile belonging to someone else is not "found and rejected" — it is
 * simply not found, which is also the correct thing to tell the caller.
 */

export interface CreateProfileInput {
  displayName: string;
  /** `YYYY-MM-DD`. */
  birthDate: string;
  /** `HH:MM`, omitted when unknown. */
  birthTime?: string | undefined;
  placeName: string;
  /** ISO 3166-1 alpha-2. */
  countryCode: string;
  timezone: string;
  latitude: number;
  longitude: number;
  isSelf?: boolean | undefined;
}

export interface StoredChart {
  chart: Chart;
  /** True when this came from storage rather than being computed just now. */
  cached: boolean;
  computedAt: string;
}

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly chartService: ChartService,
  ) {}

  /**
   * Creates a birth profile.
   *
   * When marked as the user's own, it also becomes their primary profile — the
   * one the app opens to. Both writes happen in a transaction, because a
   * profile created without its pointer being set would leave the account in a
   * state the app reads as "onboarding incomplete".
   */
  async create(userId: string, input: CreateProfileInput): Promise<BirthProfileRow> {
    return this.db.transaction(async (tx) => {
      const [created] = await tx
        .insert(birthProfiles)
        .values({
          userId,
          displayName: input.displayName,
          birthDate: input.birthDate,
          birthTime: input.birthTime ?? null,
          placeName: input.placeName,
          countryCode: input.countryCode,
          timezone: input.timezone,
          latitude: input.latitude,
          longitude: input.longitude,
          isSelf: input.isSelf ?? false,
        })
        .returning();

      if (!created) {
        throw new Error('Profile creation returned no row');
      }

      if (input.isSelf) {
        await tx
          .update(users)
          .set({ primaryBirthProfileId: created.id, updatedAt: new Date() })
          .where(eq(users.id, userId));
      }

      return created;
    });
  }

  /** Every profile this user owns, newest first. */
  async list(userId: string): Promise<BirthProfileRow[]> {
    return this.db
      .select()
      .from(birthProfiles)
      .where(eq(birthProfiles.userId, userId))
      .orderBy(desc(birthProfiles.createdAt));
  }

  /**
   * One profile, if this user owns it.
   *
   * Ownership is in the WHERE clause rather than checked after fetching, so
   * another user's profile is genuinely not found rather than found and
   * refused — which also avoids confirming that the id exists at all.
   */
  async findOne(userId: string, profileId: string): Promise<BirthProfileRow> {
    const [profile] = await this.db
      .select()
      .from(birthProfiles)
      .where(and(eq(birthProfiles.id, profileId), eq(birthProfiles.userId, userId)))
      .limit(1);

    if (!profile) {
      throw new NotFoundException('Birth profile not found');
    }

    return profile;
  }

  /**
   * Deletes a profile and everything derived from it.
   *
   * The stored chart goes with it by cascade. If this was the user's primary
   * profile, the pointer is cleared in the same transaction rather than left
   * dangling at a row that no longer exists.
   */
  async remove(userId: string, profileId: string): Promise<void> {
    const profile = await this.findOne(userId, profileId);

    await this.db.transaction(async (tx) => {
      await tx.delete(birthProfiles).where(eq(birthProfiles.id, profile.id));

      await tx
        .update(users)
        .set({ primaryBirthProfileId: null, updatedAt: new Date() })
        .where(and(eq(users.id, userId), eq(users.primaryBirthProfileId, profile.id)));
    });
  }

  /**
   * The chart for a profile, computed if needed and stored.
   *
   * Computing takes about thirty milliseconds, so this cache is not about the
   * arithmetic. It is about everything downstream: an AI reading generated from
   * a chart has to stay attached to exactly the chart it described, and a
   * recomputed chart is only identical while the engine is unchanged.
   *
   * A stored chart from a different engine version, or a different house
   * system, is discarded and recomputed — the two reasons the same profile can
   * legitimately produce different output.
   */
  async getChart(
    userId: string,
    profileId: string,
    houseSystem: 'placidus' | 'whole-sign' = 'placidus',
  ): Promise<StoredChart> {
    const profile = await this.findOne(userId, profileId);

    const [stored] = await this.db
      .select()
      .from(charts)
      .where(eq(charts.birthProfileId, profile.id))
      .limit(1);

    if (stored && stored.engineVersion === ENGINE_VERSION && stored.houseSystem === houseSystem) {
      return {
        chart: stored.data as Chart,
        cached: true,
        computedAt: stored.createdAt.toISOString(),
      };
    }

    const { chart } = this.chartService.build({
      name: profile.displayName,
      birthDate: profile.birthDate,
      birthTime: profile.birthTime ?? undefined,
      timezone: profile.timezone,
      latitude: profile.latitude,
      longitude: profile.longitude,
      houseSystem,
    });

    const computedAt = new Date();

    // One row per profile, so a recompute replaces rather than accumulates.
    await this.db
      .insert(charts)
      .values({
        birthProfileId: profile.id,
        data: chart,
        houseSystem,
        engineVersion: ENGINE_VERSION,
        createdAt: computedAt,
      })
      .onConflictDoUpdate({
        target: charts.birthProfileId,
        set: {
          data: chart,
          houseSystem,
          engineVersion: ENGINE_VERSION,
          createdAt: computedAt,
        },
      });

    return { chart, cached: false, computedAt: computedAt.toISOString() };
  }
}
