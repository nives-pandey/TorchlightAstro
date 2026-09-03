import 'reflect-metadata';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Express } from 'express';

// Import the COMPILED app, not the TypeScript source.
//
// `nest build` runs first and emits dist/ with the decorator and
// emitDecoratorMetadata settings Nest's dependency injection depends on.
// Pointing at dist/ means Vercel bundles that verified output rather than
// recompiling under @vercel/node's own TS config, where a metadata mismatch
// surfaces as runtime DI failures that are painful to trace.
//
// This is also why the build must run before typecheck in CI: dist/ is
// gitignored, so on a fresh checkout this import cannot resolve until it exists.
// eslint-disable-next-line @typescript-eslint/no-require-imports
import { createApp } from '../dist/create-app.js';

/**
 * Vercel owns the HTTP server, so the app is initialised but never told to
 * listen — `init()` wires up routes without binding a port.
 *
 * The bootstrap *promise* is cached at module scope, not the resolved app.
 * Caching the resolved value would let two concurrent cold requests each start
 * their own bootstrap and open their own database pool; caching the promise
 * means the second await joins the first. Warm invocations then reuse the
 * already-resolved instance.
 */
let cachedServer: Promise<Express> | undefined;

async function bootstrapServer(): Promise<Express> {
  const app = await createApp();
  await app.init();
  return app.getHttpAdapter().getInstance() as Express;
}

function getServer(): Promise<Express> {
  if (!cachedServer) {
    cachedServer = bootstrapServer().catch((error: unknown) => {
      // Clear the cache so a failed boot does not poison every later request
      // on this instance with the same rejected promise.
      cachedServer = undefined;
      throw error;
    });
  }
  return cachedServer;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const server = await getServer();
  server(req as never, res as never);
}
