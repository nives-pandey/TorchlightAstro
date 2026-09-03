import { z } from 'zod';

/**
 * Every endpoint answers in one of exactly two shapes. The backend enforces
 * this with a response interceptor and an exception filter, so no handler
 * builds an envelope by hand and no error escapes in a third shape.
 *
 * The client can therefore branch on `ok` alone and never has to guess whether
 * a 200 body is data or a wrapped error.
 */
export const apiErrorSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
  statusCode: z.number().int(),
  /** Field-level failures, keyed by path, when a request fails validation. */
  details: z.record(z.string(), z.array(z.string())).optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

/** Wraps a payload schema in the success envelope. */
export function apiSuccess<T extends z.ZodTypeAny>(data: T) {
  return z.object({ ok: z.literal(true), data });
}

/**
 * Full response schema for an endpoint — success or failure.
 * Use this to parse anything coming back from the API.
 */
export function apiResponse<T extends z.ZodTypeAny>(data: T) {
  return z.union([apiSuccess(data), apiErrorSchema]);
}

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
