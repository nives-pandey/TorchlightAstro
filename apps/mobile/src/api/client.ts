/**
 * Torchlight — API client
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * The single place the app talks to the server.
 *
 * Two things it owns that would otherwise be repeated at every call site and
 * eventually forgotten at one of them:
 *
 *   **Unwrapping the envelope.** Every response is `{ ok: true, data }` or
 *   `{ ok: false, error }`. Callers get the data or an exception, never a
 *   discriminated union to remember to check.
 *
 *   **Refreshing an expired token.** Access tokens last fifteen minutes, so a
 *   401 mid-session is normal rather than exceptional. This retries once behind
 *   a refresh, and concurrent requests share that single refresh rather than
 *   each starting their own — which would have all but the first fail, since
 *   refresh tokens rotate on use.
 */

/**
 * Where the API lives.
 *
 * A physical device on wifi cannot reach the laptop's localhost, so pointing at
 * the deployed API is what makes device testing work without extra setup. When
 * a local backend is genuinely wanted, `adb reverse tcp:3000 tcp:3000` maps the
 * device's localhost to the host's.
 */
export const API_BASE = 'https://torchlight-api.vercel.app/api';

export interface ApiErrorShape {
  error: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

/** Thrown for any non-success response, carrying what the server said. */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly details: Record<string, string[]> | undefined;

  constructor(shape: ApiErrorShape) {
    super(shape.error);
    this.name = 'ApiError';
    this.statusCode = shape.statusCode;
    this.details = shape.details;
  }

  /** The message for a specific field, when the server reported one. */
  fieldError(field: string): string | undefined {
    return this.details?.[field]?.[0];
  }
}

type TokenSource = () => Promise<string | null>;
type TokenRefresher = () => Promise<string | null>;

let getAccessToken: TokenSource = async () => null;
let refreshSession: TokenRefresher = async () => null;

/**
 * Wires the client to the session store.
 *
 * Injected rather than imported so this file has no dependency on where tokens
 * are kept, which keeps it testable and stops a circular import between the
 * client and the auth layer that uses it.
 */
export function configureClient(source: TokenSource, refresher: TokenRefresher): void {
  getAccessToken = source;
  refreshSession = refresher;
}

/** The in-flight refresh, shared so concurrent 401s do not each start one. */
let refreshInFlight: Promise<string | null> | null = null;

async function refreshOnce(): Promise<string | null> {
  refreshInFlight ??= refreshSession().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  /** Skips the Authorization header. Used by sign-in and sign-up. */
  anonymous?: boolean;
}

async function send<T>(path: string, options: RequestOptions, token: string | null): Promise<T> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (token) headers.authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? 'GET',
    headers,
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
  });

  // 204 carries no body, so parsing it would throw.
  if (response.status === 204) return undefined as T;

  const payload = (await response.json()) as { ok: boolean; data?: T } & Partial<ApiErrorShape>;

  if (!payload.ok) {
    throw new ApiError({
      error: payload.error ?? 'Something went wrong',
      statusCode: payload.statusCode ?? response.status,
      ...(payload.details ? { details: payload.details } : {}),
    });
  }

  return payload.data as T;
}

/**
 * Makes a request, refreshing the session once if the token has expired.
 *
 * Only a 401 triggers a retry, and only one. A second 401 after a fresh token
 * means the session is genuinely gone, and retrying further would loop.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = options.anonymous ? null : await getAccessToken();

  try {
    return await send<T>(path, options, token);
  } catch (error) {
    if (!(error instanceof ApiError) || error.statusCode !== 401 || options.anonymous) {
      throw error;
    }

    const refreshed = await refreshOnce();
    if (!refreshed) throw error;

    return send<T>(path, options, refreshed);
  }
}

export const api = {
  get: <T>(path: string): Promise<T> => request<T>(path),
  post: <T>(path: string, body?: unknown, anonymous = false): Promise<T> =>
    request<T>(path, { method: 'POST', ...(body === undefined ? {} : { body }), anonymous }),
  delete: <T>(path: string): Promise<T> => request<T>(path, { method: 'DELETE' }),
};
