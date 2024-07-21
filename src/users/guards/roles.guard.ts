import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector:Reflector){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.session?.user

    const canActivate = requiredRoles.some((role) => user?.roles?.includes(role));
    if(!canActivate){throw new ForbiddenException({ "statusCode": 403,
      "message": "You do not have permission to access this resource (Admins only)",
      "error": "Forbidden"})}

    return canActivate
  }
}
