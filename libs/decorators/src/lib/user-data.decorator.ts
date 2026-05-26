import { MetadataKeys } from '@common/constants/lib/common.constants';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ExtendedRequest } from '@common/interfaces/lib/common';

export const UserData = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request: ExtendedRequest = ctx.switchToHttp().getRequest();

  const userData = request[MetadataKeys.USER];

  if (!userData) {
    throw new UnauthorizedException('User data not found');
  }

  return userData?.metadata;
});
