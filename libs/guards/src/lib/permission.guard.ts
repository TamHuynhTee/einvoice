import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from '@common/decorators/lib/permission.decorator';
import { ExtendedRequest } from '@common/interfaces/lib/common';
import { MetadataKeys } from '@common/constants/lib/common.constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get(Permissions, context.getHandler());

    if (!requiredPermissions) {
      return true;
    }

    const request: ExtendedRequest = context.switchToHttp().getRequest();
    const userData = request[MetadataKeys.USER];
    const userPermissions = userData?.metadata.permissions || [];

    const isValid = requiredPermissions.every((permission) => userPermissions.includes(permission));

    if (!isValid) {
      throw new ForbiddenException('Permission denied');
    }

    return true;
  }
}
