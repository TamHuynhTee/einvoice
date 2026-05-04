import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const RequestParams = createParamDecorator((param: string, ctx: ExecutionContext) => {
  const request = ctx.switchToRpc().getData();
  Logger.debug('RequestParams request', request);

  return param ? request.data[param] : request.data;
});
