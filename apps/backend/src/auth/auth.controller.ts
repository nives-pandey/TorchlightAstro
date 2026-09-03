/**
 * Torchlight — authentication endpoints
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { Body, Controller, Get, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  refreshInputSchema,
  signInInputSchema,
  signUpInputSchema,
  type AuthSession,
  type AuthUser,
  type RefreshInput,
  type SignInInput,
  type SignUpInput,
} from '@torchlight/shared-types';

import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { AuthGuard, CurrentUser } from './auth.guard';
import { AuthService } from './auth.service';
import type { AccessTokenPayload } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /**
   * Creates an account.
   *
   * Rate limited hard. Sign-up is the endpoint an attacker uses to enumerate
   * addresses or fill the table with junk, and a legitimate person does it once.
   */
  @Post('sign-up')
  @HttpCode(201)
  @Throttle({ default: { limit: 5, ttl: 3_600_000 } })
  @UsePipes(new ZodValidationPipe(signUpInputSchema))
  signUp(@Body() input: SignUpInput): Promise<AuthSession> {
    return this.auth.signUp(input.email, input.password, input.displayName);
  }

  /**
   * Signs in.
   *
   * Limited to ten attempts an hour per address. Tight enough to make guessing
   * futile, loose enough that someone genuinely mistyping is not locked out.
   */
  @Post('sign-in')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 3_600_000 } })
  @UsePipes(new ZodValidationPipe(signInInputSchema))
  signIn(@Body() input: SignInInput): Promise<AuthSession> {
    return this.auth.signIn(input.email, input.password);
  }

  /**
   * Exchanges a refresh token for a new session.
   *
   * The supplied token is revoked in the process, so a client must replace its
   * stored copy with the one returned. More permissive than sign-in: a legitimate
   * app refreshes on a schedule, and a rejected refresh already costs a sign-in.
   */
  @Post('refresh')
  @HttpCode(200)
  @Throttle({ default: { limit: 60, ttl: 3_600_000 } })
  @UsePipes(new ZodValidationPipe(refreshInputSchema))
  refresh(@Body() input: RefreshInput): Promise<AuthSession> {
    return this.auth.refresh(input.refreshToken);
  }

  /**
   * Signs out this device.
   *
   * Deliberately unauthenticated. A client with an expired access token still
   * needs to be able to invalidate its refresh token, and the token itself is
   * the only credential required to revoke it.
   */
  @Post('sign-out')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(refreshInputSchema))
  async signOut(@Body() input: RefreshInput): Promise<void> {
    await this.auth.signOut(input.refreshToken);
  }

  /** Signs out everywhere. Requires a live session, since it affects all devices. */
  @Post('sign-out-everywhere')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async signOutEverywhere(@CurrentUser() user: AccessTokenPayload): Promise<void> {
    await this.auth.signOutEverywhere(user.sub);
  }

  /** The current user. Used by the app on launch to decide what to show. */
  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: AccessTokenPayload): Promise<AuthUser> {
    return this.auth.findById(user.sub);
  }
}
