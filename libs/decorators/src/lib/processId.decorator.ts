import { MetadataKeys } from '@common/constants/lib/common.constants';
import { getProcessId } from '@common/utils/lib/string.util';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ProcessId = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request[MetadataKeys.PROCESS_ID] || getProcessId();
});
