/**
 * Torchlight — place lookup endpoints
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { AuthGuard } from '../auth/auth.guard';
import { GeocodingService, type Place } from './geocoding.service';

/**
 * Guarded, because these calls consume a shared third-party quota. An open
 * endpoint would let anyone exhaust the daily GeoNames allowance and break
 * place lookup for every real user.
 */
@Controller('places')
@UseGuards(AuthGuard)
export class GeocodingController {
  constructor(private readonly geocoding: GeocodingService) {}

  /**
   * Searches for a place by name.
   *
   * Typed into a search box, so the limit is generous enough for
   * as-you-type use while still bounding a runaway client.
   */
  @Get('search')
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  search(@Query('q') query?: string, @Query('country') country?: string): Promise<Place[]> {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException('Search needs at least two characters');
    }

    return this.geocoding.search(query, country?.toUpperCase());
  }

  /**
   * Places near a point.
   *
   * How a village is found. Indian village names have no canonical
   * transliteration — testing found one stored as "Lodhauria" that a user would
   * name "Lodhwariya", which neither exact nor fuzzy search located — so the
   * reliable path is to pick the nearest known town and narrow from there.
   */
  @Get('nearby')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  nearby(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radius') radius?: string,
  ): Promise<Place[]> {
    const latitude = Number(lat);
    const longitude = Number(lng);

    if (!Number.isFinite(latitude) || Math.abs(latitude) > 90) {
      throw new BadRequestException('A valid latitude is required');
    }
    if (!Number.isFinite(longitude) || Math.abs(longitude) > 180) {
      throw new BadRequestException('A valid longitude is required');
    }

    // Capped: GeoNames returns at most 50 rows, and a wide radius spends the
    // quota to return places nobody was born in.
    const radiusKm = Math.min(Math.max(Number(radius) || 20, 1), 50);

    return this.geocoding.nearby(latitude, longitude, radiusKm);
  }
}
