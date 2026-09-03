/**
 * Torchlight — token issuing and verification
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { createHash, randomBytes } from 'node:crypto';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { and, eq, gt, isNull } from 'drizzle-orm';

import type { Env } from '../config/env';
import { DB, type Database } from '../db/db.module';
import { refreshTokens } from '../db/schema';

/**
 * Issues and verifies the two kinds of token the app carries.
 *
 * The split is deliberate and the reasoning matters:
 *
 *   **Access tokens are JWTs, short-lived, and never stored.** They are checked
 *   by signature alone, so verifying one costs no database round trip. The
 *   price is that they cannot be revoked before they expire, which is why they
 *   last fifteen minutes rather than a month.
 *
 *   **Refresh tokens are opaque random strings, long-lived, and stored hashed.**
 *   Being stored means they *can* be revoked — on sign-out, on password change,
 *   or when a device is lost. Being hashed means a database leak does not hand
 *   an attacker a set of working sessions, the same reasoning that applies to
 *   passwords.
 *
 * Refresh tokens also rotate: using one immediately revokes it and issues a
 * replacement. That turns theft into something detectable, because a stolen
 * token stops working the moment the legitimate device refreshes.
 */

/** What a verified access token carries. */
export interface AccessTokenPayload {
  /** User id. Named `sub` by JWT convention. */
  sub: string;
  email: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService<Env, true>,
    @Inject(DB) private readonly db: Database,
  ) {}

  /**
   * Issues a signed access token.
   *
   * Deliberately carries only an id and an email. Anything else — a display
   * name, a plan, a role — would be a copy of state that can change while the
   * token still says otherwise, and a stale copy inside a bearer token is worse
   * than a lookup.
   */
  async issueAccessToken(userId: string, email: string): Promise<string> {
    return this.jwt.signAsync(
      { sub: userId, email },
      {
        secret: this.config.get('JWT_SECRET', { infer: true }),
        expiresIn: this.config.get('JWT_ACCESS_TTL', { infer: true }),
      },
    );
  }

  /** Verifies an access token, or throws. */
  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      return await this.jwt.verifyAsync<AccessTokenPayload>(token, {
        secret: this.config.get('JWT_SECRET', { infer: true }),
      });
    } catch {
      // The underlying error distinguishes expiry from tampering, but the
      // client can do nothing different with that, and saying which is which
      // tells an attacker whether a forged token was well-formed.
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Issues a refresh token and stores its hash.
   *
   * The raw token is returned to the caller and never written down. What is
   * stored is a SHA-256 of it — the same one-way relationship a password has to
   * its hash, so a database leak yields nothing usable.
   *
   * SHA-256 rather than bcrypt here: a refresh token is 256 bits of randomness
   * from a CSPRNG, so there is no low-entropy guess to slow down. Bcrypt's work
   * factor protects human-chosen secrets, and applying it to a random token
   * costs latency on every refresh for no gain.
   */
  async issueRefreshToken(userId: string): Promise<string> {
    const raw = randomBytes(32).toString('base64url');
    const ttlDays = this.parseDays(this.config.get('JWT_REFRESH_TTL', { infer: true }));

    await this.db.insert(refreshTokens).values({
      userId,
      tokenHash: this.hash(raw),
      expiresAt: new Date(Date.now() + ttlDays * 86400000),
    });

    return raw;
  }

  /**
   * Consumes a refresh token and issues a replacement.
   *
   * Rotation on every use is what makes theft detectable: once the legitimate
   * device refreshes, a stolen copy is already revoked and stops working.
   *
   * The lookup and the revocation are one statement — an UPDATE guarded by the
   * token still being unrevoked and unexpired. Reading first and then writing
   * would let two simultaneous requests both pass the check, which is exactly
   * the race a stolen token would exploit.
   */
  async rotateRefreshToken(rawToken: string): Promise<{ userId: string; refreshToken: string }> {
    const now = new Date();

    const [claimed] = await this.db
      .update(refreshTokens)
      .set({ revokedAt: now })
      .where(
        and(
          eq(refreshTokens.tokenHash, this.hash(rawToken)),
          isNull(refreshTokens.revokedAt),
          gt(refreshTokens.expiresAt, now),
        ),
      )
      .returning({ userId: refreshTokens.userId });

    if (!claimed) {
      // Unknown, already used, or expired — all reported identically. Telling
      // them apart would let an attacker probe which tokens once existed.
      throw new UnauthorizedException('Invalid or expired token');
    }

    return {
      userId: claimed.userId,
      refreshToken: await this.issueRefreshToken(claimed.userId),
    };
  }

  /**
   * Revokes every refresh token a user holds.
   *
   * Used on sign-out from all devices, and on any credential change. Access
   * tokens already issued stay valid until they expire, which is the cost of
   * not checking them against the database on every request.
   */
  async revokeAllForUser(userId: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));
  }

  /** Revokes one token, for a single-device sign-out. */
  async revoke(rawToken: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(
        and(eq(refreshTokens.tokenHash, this.hash(rawToken)), isNull(refreshTokens.revokedAt)),
      );
  }

  /** Seconds until an access token expires, for the client to schedule a refresh. */
  accessTokenLifetimeSeconds(): number {
    return this.parseSeconds(this.config.get('JWT_ACCESS_TTL', { infer: true }));
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  /** Parses `15m`, `2h`, `30d` into seconds. */
  private parseSeconds(ttl: string): number {
    const match = /^(\d+)([smhd])$/.exec(ttl);
    if (!match) throw new Error(`Malformed token lifetime: ${ttl}`);

    const value = Number(match[1]);
    const unit = match[2] as 's' | 'm' | 'h' | 'd';
    const multiplier = { s: 1, m: 60, h: 3600, d: 86400 }[unit];

    return value * multiplier;
  }

  private parseDays(ttl: string): number {
    return this.parseSeconds(ttl) / 86400;
  }
}
