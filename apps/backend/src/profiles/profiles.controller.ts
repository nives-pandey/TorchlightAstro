/**
 * Torchlight — birth profile endpoints
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { createProfileSchema, type CreateProfileRequest } from '@torchlight/shared-types';

import { AuthGuard, CurrentUser } from '../auth/auth.guard';
import type { AccessTokenPayload } from '../auth/token.service';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { ProfilesService, type StoredChart } from './profiles.service';
import type { BirthProfileRow } from '../db/schema';

/**
 * Every route here is guarded, and every one passes the authenticated user's id
 * to the service as the first argument. There is no route that reads a profile
 * without knowing who is asking.
 */
@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly profiles: ProfilesService) {}

  /** Saves a birth profile. */
  @Post()
  @HttpCode(201)
  @Throttle({ default: { limit: 20, ttl: 3_600_000 } })
  create(
    @CurrentUser() user: AccessTokenPayload,
    // The pipe is attached to the body rather than the method. A method-level
    // @UsePipes runs against *every* parameter, so it would also try to
    // validate the authenticated user payload against this schema — which
    // fails with every field reported as missing, since the user object has
    // none of them.
    @Body(new ZodValidationPipe(createProfileSchema)) input: CreateProfileRequest,
  ): Promise<BirthProfileRow> {
    return this.profiles.create(user.sub, input);
  }

  /** Every profile this user owns. */
  @Get()
  list(@CurrentUser() user: AccessTokenPayload): Promise<BirthProfileRow[]> {
    return this.profiles.list(user.sub);
  }

  /** One profile. 404 if it belongs to someone else, which is also the truth. */
  @Get(':id')
  findOne(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BirthProfileRow> {
    return this.profiles.findOne(user.sub, id);
  }

  /**
   * The chart for a profile.
   *
   * Computed on first request and stored; returned from storage after that,
   * unless the engine version or house system has changed.
   */
  @Get(':id/chart')
  getChart(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Query('houseSystem') houseSystem?: string,
  ): Promise<StoredChart> {
    const system = houseSystem === 'whole-sign' ? 'whole-sign' : 'placidus';
    return this.profiles.getChart(user.sub, id, system);
  }

  /** Deletes a profile and its stored chart. */
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.profiles.remove(user.sub, id);
  }
}
