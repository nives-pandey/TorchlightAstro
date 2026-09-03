/**
 * Torchlight — local development entry point
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

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
