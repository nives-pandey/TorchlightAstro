/**
 * Torchlight — request validation
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod';

/**
 * Validates a request body against a Zod schema from `@torchlight/shared-types`,
 * so the app and the API enforce literally the same rules rather than two
 * copies that drift.
 *
 * A ZodError thrown here is caught by `GlobalExceptionFilter` and rendered with
 * its per-field detail intact.
 *
 * Note this returns the *parsed* value, not the input: unknown keys are
 * stripped, so a client cannot smuggle extra fields through into a handler.
 */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown, metadata: ArgumentMetadata): T {
    // A missing body reaches here as undefined, and Zod then reports every
    // field as required — which reads as though the client sent an empty
    // object rather than nothing at all. The usual cause is a request without
    // a JSON content-type, so Express never parsed it, and saying so directly
    // is far more useful than a list of fields the caller did send.
    if (value === undefined && metadata.type === 'body') {
      throw new BadRequestException('Request body is missing or was not sent as application/json');
    }

    return this.schema.parse(value);
  }
}
