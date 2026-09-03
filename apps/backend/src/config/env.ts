import { z } from 'zod';

/**
 * Environment is validated once at boot and the process refuses to start if
 * anything required is missing or malformed.
 *
 * This is deliberate: on serverless, a missing variable otherwise surfaces as a
 * 500 on some unrelated request minutes later, and the stack trace points at
 * the symptom rather than the cause. Failing at boot names the actual problem.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  /** Neon Postgres pooled connection string. */
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .refine((v) => v.startsWith('postgres://') || v.startsWith('postgresql://'), {
      message: 'DATABASE_URL must be a postgres:// connection string',
    }),

  /**
   * Signing secret for access tokens. Long enough that a leaked token cannot be
   * brute-forced back to the key; there is no reason to ever use a short one.
   */
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),

  /** Shared secret for the scheduled-work endpoint, sent by GitHub Actions. */
  CRON_SECRET: z.string().min(16, 'CRON_SECRET must be at least 16 characters'),

  /** Anthropic, for generating readings. Optional until the AI layer lands. */
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-sonnet-5'),
  ANTHROPIC_FAST_MODEL: z.string().default('claude-haiku-4-5'),

  /** Google Sign-In audience. Optional until Google auth is wired. */
  GOOGLE_CLIENT_ID: z.string().optional(),

  PORT: z.coerce.number().int().positive().default(3000),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parses and returns the environment, throwing a readable aggregate error
 * listing every problem at once rather than the first one found.
 */
export function validateEnv(source: Record<string, unknown> = process.env): Env {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${problems}`);
  }

  return result.data;
}

/** True when running as a Vercel function rather than a long-lived process. */
export function isServerless(): boolean {
  return Boolean(process.env.VERCEL);
}
