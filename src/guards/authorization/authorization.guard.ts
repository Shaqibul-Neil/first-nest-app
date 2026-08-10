import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './authorization.decorator';
import { TRole } from './authorization.enum';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<TRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    //if no roles needed for some route
    if (!requiredRoles) return true;

    //headers parameter
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string> }>();

    const userRole = request.headers['x-user-role'] as TRole;

    return requiredRoles.includes(userRole);
  }
}
