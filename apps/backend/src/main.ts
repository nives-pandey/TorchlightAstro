import 'reflect-metadata';
import { Logger } from '@nestjs/common';

import { createApp } from './create-app';

/**
 * Local development entry point only. Production runs as a Vercel function
 * through `api/index.ts`, which never calls `listen()`.
 */
async function bootstrap(): Promise<void> {
  const app = await createApp();
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
  Logger.log(`Listening on http://localhost:${port}/api`, 'Bootstrap');
}

void bootstrap();
