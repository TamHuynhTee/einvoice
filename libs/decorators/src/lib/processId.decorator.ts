import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { MetadataKeys } from '@common/constants/lib/common.constants';
import { getProcessId } from '@common/utils/lib/string.util';

export const ProcessId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request[MetadataKeys.PROCESS_ID] || getProcessId();
});
