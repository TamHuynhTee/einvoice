import { CallHandler, HttpException, HttpStatus, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { type Request } from 'express';
import { MetadataKeys } from '@common/constants/lib/common.constants';
import { ResponseDTO } from '@common/interfaces/lib/gateway/response.interface';
import { HTTP_MESSAGE } from '@common/constants/lib/enum/http-message.enum';

export class ExceptionsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionsInterceptor.name);

  intercept(context: any, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request: Request & { [MetadataKeys.PROCESS_ID]: string; [MetadataKeys.START_TIME]: number } =
      ctx.getRequest();

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

        const errorResponse = {
          message,
          statusCode,
          data: null,
          processID,
          duration: `${durationMs} ms`,
        };
        throw new HttpException(new ResponseDTO(errorResponse), statusCode);
      }),
    );
  }
}
