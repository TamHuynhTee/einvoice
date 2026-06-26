import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from '@common/decorators/permission.decorator';
import { ExtendedRequest } from '@common/interfaces/common';
import { MetadataKeys } from '@common/constants/common.constants';

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
