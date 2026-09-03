/**
 * Torchlight — application bootstrap
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exception.filter';
import { ResponseInterceptor } from './common/response.interceptor';

/**
 * Builds the Nest application without starting a server.
 *
 * Kept separate from `main.ts` because the two entry points need different
 * things: local development calls `listen()`, while the Vercel function hands
 * the underlying Express instance to the platform and never binds a port.
 * Both must configure middleware identically, so that happens here, once.
 */
export async function createApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.use(helmet());

  /**
   * The API is consumed by a native app, not a browser, so there is no origin
   * to allow and no cookie to protect — tokens travel in an Authorization
   * header. CORS stays off until something actually needs it.
   */
  app.setGlobalPrefix('api');

  /**
   * No global ValidationPipe: validation runs through `ZodValidationPipe` with
   * the schemas in `@torchlight/shared-types`, so the app and API enforce the
   * same rules from one definition. Nest's own pipe would mean a second set of
   * rules in class-validator decorators, free to drift from the first.
   */
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Vercel terminates TLS upstream; without this, request IPs all read as the
  // proxy's and rate limiting would bucket every user together.
  app.set('trust proxy', 1);

  Logger.log('Application configured', 'Bootstrap');
  return app;
}
