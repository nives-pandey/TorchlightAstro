import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Wraps every successful handler return in `{ ok: true, data }`.
 *
 * Handlers therefore return plain domain objects and never build an envelope
 * themselves — which is what keeps the contract from drifting one endpoint at a
 * time. `GlobalExceptionFilter` covers the failure half.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, { ok: true; data: T }> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<{ ok: true; data: T }> {
    return next.handle().pipe(map((data) => ({ ok: true as const, data })));
  }
}
