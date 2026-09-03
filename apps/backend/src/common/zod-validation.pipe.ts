import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
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

  transform(value: unknown, _metadata: ArgumentMetadata): T {
    return this.schema.parse(value);
  }
}
