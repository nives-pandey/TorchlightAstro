/**
 * Torchlight — place lookup
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Env } from '../config/env';
import { isKnownTimezone } from '../astrology/timezone';
import { FALLBACK_CITIES } from './fallback-cities';

/**
 * Turns a place a person types into coordinates and an IANA timezone.
 *
 * What this has to get right is narrower than it first appears, and the
 * difference was measured rather than assumed:
 *
 *   - Two points 2.8km apart — the distance between a village and its nearest
 *     town — move the ascendant by **1.7 arcminutes**. Invisible in a reading.
 *   - The same point with the timezone wrong by half an hour moves it by
 *     **6.47 degrees**, which is 230 times larger and can change the rising
 *     sign outright.
 *
 * So the timezone is the thing that must be exact; the coordinates only need to
 * be roughly right. That shapes the whole design: a user who cannot find their
 * village but picks the nearest town gets a correct chart, and telling them so
 * is more useful than demanding precision that does not matter.
 *
 * Three search strategies run in order, because one is not enough:
 *
 *   1. **Prefix match** — resolves cities and most towns precisely.
 *   2. **Fuzzy match** — catches spelling drift.
 *   3. **Nearby search** — the one that actually works for Indian villages,
 *      where transliteration has no canonical form. Testing found a village the
 *      user named as "Lodhwariya" stored as "Lodhauria"; neither exact nor
 *      fuzzy search found it, and searching within 20km of the parent tehsil
 *      did. Given the Vedic focus, that case is not an edge case.
 */

export interface Place {
  /** GeoNames identifier, stable across queries. */
  id: number;
  name: string;
  /** State or province. */
  region: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  /** IANA zone id. The field that actually matters. */
  timezone: string;
  population: number;
}

interface GeoNamesPlace {
  geonameId: number;
  name: string;
  adminName1?: string;
  adminName2?: string;
  countryName?: string;
  countryCode?: string;
  lat: string;
  lng: string;
  population?: number;
  timezone?: { timeZoneId?: string };
  distance?: string;
}

interface GeoNamesResponse {
  geonames?: GeoNamesPlace[];
  status?: { message: string; value: number };
}

/**
 * The TLS endpoint, not `api.geonames.org`.
 *
 * Two reasons. The username travels in the query string, so plain HTTP would
 * put it in cleartext across every hop. And a serverless runtime may refuse
 * outbound plain HTTP entirely — which is how this surfaced: place search
 * worked locally and silently returned only bundled cities in production,
 * because every live request failed and fell through to the fallback. That
 * looks like a working endpoint returning thin results rather than an error.
 */
const GEONAMES_BASE = 'https://secure.geonames.org';

/**
 * How long a search result stays cached.
 *
 * Place names and their timezones effectively never change, so this is bounded
 * only by memory. An hour keeps the working set small while making repeated
 * searches — which dominate, since users search the same cities — free.
 */
const CACHE_TTL_MS = 60 * 60 * 1000;

/** Requests are abandoned rather than left to hang a chart request. */
const REQUEST_TIMEOUT_MS = 5000;

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);
  private readonly cache = new Map<string, { places: Place[]; expires: number }>();

  constructor(private readonly config: ConfigService<Env, true>) {}

  private get username(): string | undefined {
    return this.config.get('GEONAMES_USERNAME', { infer: true });
  }

  /**
   * Searches for a place.
   *
   * Falls back through three strategies, then to a bundled city list if
   * GeoNames is unreachable — so the birth form still works during an outage
   * rather than blocking sign-up entirely.
   */
  async search(query: string, countryCode?: string): Promise<Place[]> {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    const cacheKey = `${trimmed.toLowerCase()}|${countryCode ?? ''}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.places;
    }

    if (!this.username) {
      // Not configured. The fallback list is small but real, so a chart is
      // still possible for a major city.
      return this.searchFallback(trimmed, countryCode);
    }

    let places: Place[] = [];

    try {
      // Prefix first: precise, and correct for the great majority of searches.
      places = await this.queryGeoNames('name_startsWith', trimmed, countryCode);

      // Fuzzy only when prefix found nothing, since it trades precision for
      // reach and would otherwise bury exact matches.
      if (places.length === 0) {
        places = await this.queryGeoNames('q', trimmed, countryCode, { fuzzy: '0.7' });
      }
    } catch (error) {
      this.logger.warn(
        `GeoNames unavailable, using bundled cities: ${error instanceof Error ? error.message : String(error)}`,
      );
      return this.searchFallback(trimmed, countryCode);
    }

    this.cache.set(cacheKey, { places, expires: Date.now() + CACHE_TTL_MS });
    return places;
  }

  /**
   * Places within a radius of a point.
   *
   * The strategy that finds villages. A user types the town they know, picks
   * it, and then narrows to the settlement they were actually born in — which
   * is how someone describes their birthplace anyway.
   */
  async nearby(latitude: number, longitude: number, radiusKm = 20): Promise<Place[]> {
    if (!this.username) return [];

    const cacheKey = `nearby|${latitude.toFixed(3)}|${longitude.toFixed(3)}|${radiusKm}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.places;
    }

    const params = new URLSearchParams({
      lat: String(latitude),
      lng: String(longitude),
      radius: String(radiusKm),
      maxRows: '50',
      style: 'FULL',
      username: this.username,
    });

    try {
      const response = await this.fetchGeoNames(`findNearbyPlaceNameJSON?${params}`);
      const places = (response.geonames ?? [])
        .map((entry) => this.toPlace(entry))
        .filter((place): place is Place => place !== null);

      this.cache.set(cacheKey, { places, expires: Date.now() + CACHE_TTL_MS });
      return places;
    } catch (error) {
      this.logger.warn(
        `Nearby search failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      return [];
    }
  }

  private async queryGeoNames(
    field: 'name_startsWith' | 'q',
    query: string,
    countryCode?: string,
    extra: Record<string, string> = {},
  ): Promise<Place[]> {
    const params = new URLSearchParams({
      [field]: query,
      maxRows: '10',
      // Populated places only. Without this, searches return rivers, mountains
      // and administrative regions, none of which anyone was born in.
      featureClass: 'P',
      style: 'FULL',
      username: this.username as string,
      ...extra,
    });

    if (countryCode) params.set('country', countryCode);

    const response = await this.fetchGeoNames(`searchJSON?${params}`);

    return (response.geonames ?? [])
      .map((entry) => this.toPlace(entry))
      .filter((place): place is Place => place !== null)
      .sort((a, b) => b.population - a.population);
  }

  private async fetchGeoNames(path: string): Promise<GeoNamesResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${GEONAMES_BASE}/${path}`, { signal: controller.signal });
      if (!response.ok) {
        throw new ServiceUnavailableException(`GeoNames returned ${response.status}`);
      }

      const body = (await response.json()) as GeoNamesResponse;

      // GeoNames reports rate limits and auth failures as 200 with a status
      // object, so a successful HTTP response is not a successful query.
      if (body.status) {
        throw new ServiceUnavailableException(`GeoNames: ${body.status.message}`);
      }

      return body;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Converts a GeoNames row, discarding anything without a usable timezone.
   *
   * A place with no IANA zone cannot produce a correct chart, and the timezone
   * is the one field that genuinely must be right — so such a row is dropped
   * rather than offered with a guess attached.
   */
  private toPlace(entry: GeoNamesPlace): Place | null {
    const timezone = entry.timezone?.timeZoneId;
    if (!timezone || !isKnownTimezone(timezone)) return null;

    const latitude = Number(entry.lat);
    const longitude = Number(entry.lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

    return {
      id: entry.geonameId,
      name: entry.name,
      // adminName2 is the district, which is what distinguishes two villages of
      // the same name; adminName1 is the state.
      region: entry.adminName2 || entry.adminName1 || '',
      country: entry.countryName ?? '',
      countryCode: entry.countryCode ?? '',
      latitude,
      longitude,
      timezone,
      population: entry.population ?? 0,
    };
  }

  /** Searches the bundled list, used when GeoNames cannot be reached. */
  private searchFallback(query: string, countryCode?: string): Place[] {
    const needle = query.toLowerCase();

    return FALLBACK_CITIES.filter(
      (city) =>
        city.name.toLowerCase().startsWith(needle) &&
        (!countryCode || city.countryCode === countryCode),
    )
      .slice(0, 10)
      .map((city) => ({ ...city, id: -1 }));
  }
}
