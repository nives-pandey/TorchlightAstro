/**
 * Torchlight — authentication
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { AuthSession, AuthUser } from '@torchlight/shared-types';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

import { DB, type Database } from '../db/db.module';
import { users, type User } from '../db/schema';
import { TokenService } from './token.service';

/**
 * Account creation and sign-in.
 *
 * The previous build had no working authentication at all: every visitor shared
 * a hardcoded `demo-user`, so one person's birth data was every person's. This
 * exists to make a user a real, isolated thing.
 *
 * Two properties are enforced throughout:
 *
 *   **Failures are indistinguishable.** A wrong password and an unknown email
 *   produce the same message, and both take the same time. Distinguishing them
 *   turns the sign-in endpoint into a way to discover who has an account.
 *
 *   **A password hash never leaves this file.** The row type includes it; the
 *   shape returned to a caller does not, and the mapping between them is a
 *   single function so it cannot be forgotten at one call site.
 */

/**
 * Bcrypt work factor.
 *
 * Twelve rounds is roughly 250ms on current hardware — slow enough to make
 * offline cracking expensive, fast enough that sign-in does not feel broken.
 * Raise it as hardware improves; existing hashes carry their own cost factor
 * and keep verifying correctly.
 */
const BCRYPT_ROUNDS = 12;

/**
 * A bcrypt hash of a throwaway value, used to spend the same time on an unknown
 * email as on a real one.
 *
 * Without this, an unknown address returns immediately while a known one waits
 * for bcrypt — a difference of hundreds of milliseconds that is trivially
 * measurable and reveals which addresses are registered.
 */
const TIMING_DECOY = bcrypt.hashSync('timing-decoy', BCRYPT_ROUNDS);

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly tokens: TokenService,
  ) {}

  /** Strips everything a caller must never see. */
  private toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      primaryBirthProfileId: user.primaryBirthProfileId,
      createdAt: user.createdAt.toISOString(),
    };
  }

  private async issueSession(user: User): Promise<AuthSession> {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokens.issueAccessToken(user.id, user.email),
      this.tokens.issueRefreshToken(user.id),
    ]);

    return {
      user: this.toAuthUser(user),
      accessToken,
      refreshToken,
      expiresIn: this.tokens.accessTokenLifetimeSeconds(),
    };
  }

  /**
   * Creates an account.
   *
   * A duplicate email is reported plainly rather than hidden. That does leak
   * whether an address is registered, but sign-up cannot avoid it — the user
   * has to be told why their account was not created — and every alternative
   * (silent success, a generic error) leaves them stuck.
   */
  async signUp(email: string, password: string, displayName: string): Promise<AuthSession> {
    const [existing] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const [created] = await this.db
      .insert(users)
      .values({ email, passwordHash, displayName })
      .returning();

    if (!created) {
      throw new Error('Account creation returned no row');
    }

    return this.issueSession(created);
  }

  /**
   * Signs in with an email and password.
   *
   * Always performs a bcrypt comparison, even when no account exists, so the
   * response time carries no information about whether the email is registered.
   */
  async signIn(email: string, password: string): Promise<AuthSession> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);

    // Compare against the decoy when there is no user, or when the account has
    // no password because it was created through Google.
    const hash = user?.passwordHash ?? TIMING_DECOY;
    const matches = await bcrypt.compare(password, hash);

    if (!user || !user.passwordHash || !matches) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return this.issueSession(user);
  }

  /**
   * Exchanges a refresh token for a new session.
   *
   * The token rotates on use, so the one supplied is dead by the time this
   * returns and the caller must store the replacement.
   */
  async refresh(refreshToken: string): Promise<AuthSession> {
    const rotated = await this.tokens.rotateRefreshToken(refreshToken);

    const [user] = await this.db.select().from(users).where(eq(users.id, rotated.userId)).limit(1);

    if (!user) {
      // The token was valid but its user is gone — a deleted account with a
      // live session. Nothing to refresh into.
      throw new UnauthorizedException('Invalid or expired token');
    }

    return {
      user: this.toAuthUser(user),
      accessToken: await this.tokens.issueAccessToken(user.id, user.email),
      refreshToken: rotated.refreshToken,
      expiresIn: this.tokens.accessTokenLifetimeSeconds(),
    };
  }

  /** Signs out one device by revoking its refresh token. */
  async signOut(refreshToken: string): Promise<void> {
    await this.tokens.revoke(refreshToken);
  }

  /** Signs out everywhere. */
  async signOutEverywhere(userId: string): Promise<void> {
    await this.tokens.revokeAllForUser(userId);
  }

  /** The current user, for the session endpoint. */
  async findById(userId: string): Promise<AuthUser> {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      throw new UnauthorizedException('Account no longer exists');
    }
    return this.toAuthUser(user);
  }
}
