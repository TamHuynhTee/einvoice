import { MetadataKeys } from '@common/constants/common.constants';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ExtendedRequest } from '@common/interfaces/common';

export const UserData = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request: ExtendedRequest = ctx.switchToHttp().getRequest();

  const userData = request[MetadataKeys.USER];

  if (!userData) {
    throw new UnauthorizedException('User data not found');
  }

  return userData?.metadata;
});
