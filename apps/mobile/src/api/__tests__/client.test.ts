/**
 * Torchlight — API client tests
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

import { ApiError, api, configureClient, request } from '../client';

/** Builds a fetch response carrying the server's success envelope. */
function ok(data: unknown, status = 200): Response {
  return {
    status,
    json: async () => ({ ok: true, data }),
  } as Response;
}

/** Builds a fetch response carrying the server's error envelope. */
function fail(statusCode: number, error = 'Nope', details?: Record<string, string[]>): Response {
  return {
    status: statusCode,
    json: async () => ({ ok: false, error, statusCode, ...(details ? { details } : {}) }),
  } as Response;
}

describe('the API client', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    configureClient(
      async () => 'access-token',
      async () => null,
    );
  });

  it('unwraps the envelope so callers get the data', async () => {
    fetchMock.mockResolvedValueOnce(ok({ id: 'abc' }));

    await expect(api.get('/thing')).resolves.toEqual({ id: 'abc' });
  });

  it('throws an ApiError carrying the status and field details', async () => {
    fetchMock.mockResolvedValueOnce(fail(422, 'Invalid', { email: ['Already taken'] }));

    const caught = await api.post('/auth/sign-up', {}, true).catch((error: unknown) => error);

    expect(caught).toBeInstanceOf(ApiError);
    expect((caught as ApiError).statusCode).toBe(422);
    expect((caught as ApiError).fieldError('email')).toBe('Already taken');
  });

  it('sends the access token, and the refreshed one on retry', async () => {
    fetchMock.mockResolvedValueOnce(fail(401)).mockResolvedValueOnce(ok('done'));
    configureClient(
      async () => 'stale-token',
      async () => 'fresh-token',
    );

    await expect(api.get('/thing')).resolves.toBe('done');

    const headerOf = (call: number): Record<string, string> =>
      (fetchMock.mock.calls[call]?.[1] as { headers: Record<string, string> }).headers;

    expect(headerOf(0).authorization).toBe('Bearer stale-token');
    expect(headerOf(1).authorization).toBe('Bearer fresh-token');
  });

  it('gives up after one retry rather than looping', async () => {
    fetchMock.mockResolvedValue(fail(401));
    configureClient(
      async () => 'stale-token',
      async () => 'fresh-token',
    );

    await expect(api.get('/thing')).rejects.toBeInstanceOf(ApiError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry when there is no session to refresh', async () => {
    fetchMock.mockResolvedValueOnce(fail(401));

    await expect(api.get('/thing')).rejects.toBeInstanceOf(ApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  /**
   * Refresh tokens rotate on use, so a second concurrent refresh would present
   * a token the first had already consumed and fail. Every waiter must share
   * one refresh.
   */
  it('shares a single refresh between concurrent requests', async () => {
    fetchMock.mockImplementation(async (url: string) =>
      fetchMock.mock.calls.filter((call) => call[0] === url).length === 1 ? fail(401) : ok('done'),
    );

    const refresher = jest.fn(async () => 'fresh-token');
    configureClient(async () => 'stale-token', refresher);

    await Promise.all([api.get('/a'), api.get('/b'), api.get('/c')]);

    expect(refresher).toHaveBeenCalledTimes(1);
  });

  it('treats 204 as an empty success rather than parsing a body', async () => {
    fetchMock.mockResolvedValueOnce({
      status: 204,
      json: async () => {
        throw new Error('204 has no body to parse');
      },
    } as unknown as Response);

    await expect(api.delete('/profiles/abc')).resolves.toBeUndefined();
  });

  it('omits the Authorization header on anonymous requests', async () => {
    fetchMock.mockResolvedValueOnce(ok('session'));

    await request('/auth/sign-in', { method: 'POST', body: {}, anonymous: true });

    const { headers } = fetchMock.mock.calls[0]?.[1] as { headers: Record<string, string> };
    expect(headers.authorization).toBeUndefined();
  });
});
