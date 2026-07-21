import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { MetadataKeys } from '@common/constants/common.constants';
import { type ExtendedRequest } from '@common/interfaces/common';
import { getProcessId } from '@common/utils/string.util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: ExtendedRequest, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, body } = req;

    const processId = getProcessId();
    const now = Date.now();
    const requestBody = JSON.stringify(body);

    req[MetadataKeys.PROCESS_ID] = processId;
    req[MetadataKeys.START_TIME] = startTime;

    Logger.log(
      `HTTP >> Start process '${processId}' >> path: '${originalUrl}' >> method: ${method} at ${now} >> input: ${requestBody}`,
    );

    const resOrigin = res.send.bind(res);
    res.send = (body) => {
      const duration = Date.now() - startTime;
      Logger.log(
        `HTTP >> End process '${processId}' >> path: '${originalUrl}' >> method: ${method} at ${now} >> duration: ${duration} ms`,
      );

      return resOrigin(body);
    };
    next();
  }
}
