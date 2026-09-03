/**
 * Torchlight — authentication guard
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import type { Request } from 'express';

import { TokenService, type AccessTokenPayload } from './token.service';

/** A request that has passed the guard carries its authenticated user. */
export interface AuthenticatedRequest extends Request {
  user: AccessTokenPayload;
}

/**
 * Requires a valid access token.
 *
 * Applied per-controller rather than globally. A global guard with an opt-out
 * decorator inverts the safe default: forgetting the decorator on a public
 * route is a visible 401, but forgetting to *apply* a guard on a private route
 * is a silent data leak. Explicit application means an unguarded controller is
 * obvious in review.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokens: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication required');
    }

    request.user = await this.tokens.verifyAccessToken(header.slice('Bearer '.length));
    return true;
  }
}

/**
 * Injects the authenticated user into a handler.
 *
 * Only meaningful on a route the guard protects; without it there is nothing on
 * the request to read, which is why it throws rather than returning undefined.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AccessTokenPayload => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user) {
      throw new UnauthorizedException('Authentication required');
    }
    return request.user;
  },
);
