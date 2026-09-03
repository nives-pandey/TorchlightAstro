/**
 * Torchlight — environment configuration — verification suite
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { validateEnv } from './env';

const valid = {
  DATABASE_URL: 'postgresql://user:pass@ep-x-pooler.aws.neon.tech/db?sslmode=require',
  JWT_SECRET: 'a'.repeat(32),
  CRON_SECRET: 'b'.repeat(16),
};

describe('validateEnv', () => {
  it('accepts a minimal valid environment and applies defaults', () => {
    const env = validateEnv(valid);

    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3000);
    expect(env.JWT_ACCESS_TTL).toBe('15m');
  });

  it('rejects a DATABASE_URL that is not a postgres connection string', () => {
    expect(() => validateEnv({ ...valid, DATABASE_URL: 'mysql://localhost/db' })).toThrow(
      /must be a postgres:\/\/ connection string/,
    );
  });

  it('rejects a JWT_SECRET short enough to be brute-forced', () => {
    expect(() => validateEnv({ ...valid, JWT_SECRET: 'too-short' })).toThrow(
      /at least 32 characters/,
    );
  });

  it('reports every problem at once rather than only the first', () => {
    let message = '';
    try {
      validateEnv({ DATABASE_URL: 'nope', JWT_SECRET: 'short', CRON_SECRET: 'short' });
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toContain('DATABASE_URL');
    expect(message).toContain('JWT_SECRET');
    expect(message).toContain('CRON_SECRET');
  });

  it('coerces PORT from the string the environment actually provides', () => {
    expect(validateEnv({ ...valid, PORT: '8080' }).PORT).toBe(8080);
  });
});
