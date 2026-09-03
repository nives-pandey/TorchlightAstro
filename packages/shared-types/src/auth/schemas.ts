import { z } from 'zod';

/**
 * Auth contract shared by app and API.
 *
 * Access tokens are short-lived and sent as a bearer header; refresh tokens are
 * long-lived and stored in the device keychain, never in AsyncStorage. The app
 * treats both as opaque.
 */

export const emailSchema = z.string().email().max(254).toLowerCase().trim();

/**
 * Minimum length is the control that matters; composition rules (a digit, a
 * symbol) push people toward predictable substitutions without adding real
 * entropy. The upper bound exists because bcrypt silently truncates past 72
 * bytes — a longer password would create a false sense of strength.
 */
export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(72, 'Password must be 72 characters or fewer');

export const signUpInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().min(1).max(80).trim(),
});

export const signInInputSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/** Exchange a Google ID token for a Torchlight session. */
export const googleSignInInputSchema = z.object({
  idToken: z.string().min(1),
});

export const refreshInputSchema = z.object({
  refreshToken: z.string().min(1),
});

export const authUserSchema = z.object({
  id: z.string().uuid(),
  email: emailSchema,
  displayName: z.string(),
  /** Null until the user completes onboarding with their birth details. */
  primaryBirthProfileId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
});

export const authSessionSchema = z.object({
  user: authUserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  /** Seconds until the access token expires. */
  expiresIn: z.number().int().positive(),
});

export type SignUpInput = z.infer<typeof signUpInputSchema>;
export type SignInInput = z.infer<typeof signInInputSchema>;
export type GoogleSignInInput = z.infer<typeof googleSignInInputSchema>;
export type RefreshInput = z.infer<typeof refreshInputSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
