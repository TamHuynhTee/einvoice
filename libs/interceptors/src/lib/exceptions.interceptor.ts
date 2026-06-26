import { CallHandler, ExecutionContext, HttpException, HttpStatus, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { type ExtendedRequest } from '@common/interfaces/lib/common';
import { MetadataKeys } from '@common/constants/lib/common.constants';
import { ResponseDTO } from '@common/interfaces/lib/gateway/response.interface';
import { HTTP_MESSAGE } from '@common/constants/lib/enum/http-message.enum';

export class ExceptionsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionsInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> | Promise<Observable<unknown>> {
    const ctx = context.switchToHttp();
    const request: ExtendedRequest = ctx.getRequest();

    const processID = request[MetadataKeys.PROCESS_ID];
    const startTime = request[MetadataKeys.START_TIME];

    return next.handle().pipe(
      map((data: ResponseDTO<unknown>) => {
        const durationMs = Date.now() - startTime;
        data.processID = processID;
        data.duration = `${durationMs} ms`;
        return data;
      }),
      catchError((err) => {
        this.logger.error(err);

        const durationMs = Date.now() - startTime;

        const message = err?.response?.message || err?.message || err || HTTP_MESSAGE.INTERNAL_SERVER_ERROR;
        const statusCode =
          err?.code || err?.statusCode || err?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

        const response = err.getResponse ? err.getResponse() : err.response;
        const data = response ? { ...response } : null;

        if (data && typeof data === 'object') {
          delete data.message;
          delete data.statusCode;
        }

        const errorResponse = {
          message,
          statusCode,
          data,
          processID,
          duration: `${durationMs} ms`,
        };
        throw new HttpException(new ResponseDTO(errorResponse), statusCode);
      }),
    );
  }
}
