/**
 * Torchlight — API error envelope
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ZodIssue } from 'zod';

/**
 * Recognises a Zod validation error structurally rather than by `instanceof`.
 *
 * The backend and `@torchlight/shared-types` each resolve their own copy of
 * zod, so a schema defined in the shared package throws a ZodError whose
 * prototype chain belongs to a different module instance. `instanceof` is
 * therefore always false across that boundary, and every validation failure was
 * falling through to a flat 500 — losing both the 400 status and the per-field
 * detail that makes a validation error useful.
 *
 * Checking the shape works regardless of how many copies are installed.
 */
function isZodError(error: unknown): error is { issues: ZodIssue[] } {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { name?: unknown }).name === 'ZodError' &&
    Array.isArray((error as { issues?: unknown }).issues)
  );
}

/**
 * Turns every thrown error into the `{ ok: false, error, statusCode }` shape.
 *
 * Two rules this enforces that matter beyond tidiness:
 *
 * 1. An unexpected error never reaches the client as its own message. A driver
 *    or ORM error can carry a connection string or a row's contents, and the
 *    user can do nothing with it either way. Those become a flat 500 and the
 *    detail goes to the server log instead.
 *
 * 2. Validation failures keep their per-field detail, because that is exactly
 *    what the client needs to point at the wrong input.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong. Please try again.';
    let details: Record<string, string[]> | undefined;

    if (isZodError(exception)) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Some of the details provided are not valid.';
      details = {};
      for (const issue of exception.issues) {
        const key = issue.path.join('.') || '_';
        (details[key] ??= []).push(issue.message);
      }
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (body && typeof body === 'object' && 'message' in body) {
        const raw = (body as { message: unknown }).message;
        message = Array.isArray(raw) ? raw.join('; ') : String(raw);
      } else {
        message = exception.message;
      }
    }

    // Log the real error server-side regardless of what the client is told.
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} -> ${statusCode}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} -> ${statusCode}: ${message}`);
    }

    response.status(statusCode).json({
      ok: false,
      error: message,
      statusCode,
      ...(details ? { details } : {}),
    });
  }
}
