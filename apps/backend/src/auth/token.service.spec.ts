/**
 * Torchlight — token service — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

import { TokenService } from './token.service';

/**
 * Covers the parts of token handling that are pure — signing, verification, and
 * lifetime parsing. Refresh-token rotation touches the database and is verified
 * against a live one in the auth flow check rather than mocked here, since the
 * property that matters is the atomicity of the claiming UPDATE, and a mock
 * would assert only that the code calls what it calls.
 */

const SECRET = 'x'.repeat(48);

function makeService(overrides: Record<string, string> = {}): TokenService {
  const values: Record<string, string> = {
    JWT_SECRET: SECRET,
    JWT_ACCESS_TTL: '15m',
    JWT_REFRESH_TTL: '30d',
    ...overrides,
  };

  // ConfigService is generically typed against the real Env shape; a stub only
  // needs to answer the three keys this service reads. The database is reached
  // only by the refresh-token methods, which this suite does not exercise.
  const config = { get: (key: string) => values[key] } as never;
  const db = {} as never;

  return new TokenService(new JwtService(), config, db);
}

describe('access tokens', () => {
  const tokens = makeService();

  it('round-trips the user id and email', async () => {
    const token = await tokens.issueAccessToken('user-123', 'someone@example.com');
    const payload = await tokens.verifyAccessToken(token);

    expect(payload.sub).toBe('user-123');
    expect(payload.email).toBe('someone@example.com');
  });

  it('carries nothing beyond the id, email and standard claims', async () => {
    // A display name or role inside a bearer token is a copy of mutable state
    // that keeps asserting itself after the real value changes.
    const token = await tokens.issueAccessToken('user-123', 'someone@example.com');
    const payload = await tokens.verifyAccessToken(token);

    expect(Object.keys(payload).sort()).toEqual(['email', 'exp', 'iat', 'sub']);
  });

  it('rejects a token signed with a different secret', async () => {
    const other = makeService({ JWT_SECRET: 'y'.repeat(48) });
    const foreign = await other.issueAccessToken('user-123', 'someone@example.com');

    await expect(tokens.verifyAccessToken(foreign)).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a tampered token', async () => {
    const token = await tokens.issueAccessToken('user-123', 'someone@example.com');
    const tampered = `${token.slice(0, -4)}AAAA`;

    await expect(tokens.verifyAccessToken(tampered)).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a malformed token', async () => {
    await expect(tokens.verifyAccessToken('not.a.token')).rejects.toThrow(UnauthorizedException);
    await expect(tokens.verifyAccessToken('')).rejects.toThrow(UnauthorizedException);
  });

  it('gives the same message whatever the reason', async () => {
    // Distinguishing expiry from forgery tells an attacker whether a guessed
    // token was structurally valid.
    const other = makeService({ JWT_SECRET: 'y'.repeat(48) });
    const foreign = await other.issueAccessToken('user-123', 'a@b.com');

    const messages: string[] = [];
    for (const candidate of [foreign, 'not.a.token', '']) {
      await tokens.verifyAccessToken(candidate).catch((error: Error) => {
        messages.push(error.message);
      });
    }

    expect(new Set(messages).size).toBe(1);
  });

  it('expires', async () => {
    const shortLived = makeService({ JWT_ACCESS_TTL: '1s' });
    const token = await shortLived.issueAccessToken('user-123', 'a@b.com');

    // Valid immediately.
    await expect(shortLived.verifyAccessToken(token)).resolves.toBeDefined();

    // The jwt library compares against whole seconds, so a token issued now is
    // still inside its window until the clock ticks past it.
    jest.useFakeTimers().setSystemTime(Date.now() + 5000);
    await expect(shortLived.verifyAccessToken(token)).rejects.toThrow(UnauthorizedException);
    jest.useRealTimers();
  });
});

describe('lifetime parsing', () => {
  it('reads each supported unit', () => {
    expect(makeService({ JWT_ACCESS_TTL: '30s' }).accessTokenLifetimeSeconds()).toBe(30);
    expect(makeService({ JWT_ACCESS_TTL: '15m' }).accessTokenLifetimeSeconds()).toBe(900);
    expect(makeService({ JWT_ACCESS_TTL: '2h' }).accessTokenLifetimeSeconds()).toBe(7200);
    expect(makeService({ JWT_ACCESS_TTL: '1d' }).accessTokenLifetimeSeconds()).toBe(86400);
  });

  it('throws on a malformed lifetime rather than defaulting', () => {
    // A silently defaulted lifetime would mean tokens living far longer or
    // shorter than configured, with nothing to indicate it.
    expect(() => makeService({ JWT_ACCESS_TTL: 'forever' }).accessTokenLifetimeSeconds()).toThrow();
    expect(() => makeService({ JWT_ACCESS_TTL: '15' }).accessTokenLifetimeSeconds()).toThrow();
    expect(() => makeService({ JWT_ACCESS_TTL: 'm15' }).accessTokenLifetimeSeconds()).toThrow();
  });
});
