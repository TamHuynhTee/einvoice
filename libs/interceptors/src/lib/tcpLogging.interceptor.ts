import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class TCPLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const handler = context.getHandler();
    const handlerName = handler.name;

    const args = context.getArgs();

    const param = args[0];

    const processID = param.processId;

    Logger.log(
      `TCP >> Start process '${processID}' >> method '${handlerName}' at ${now} >> input: ${JSON.stringify(param)}`,
    );

    return next.handle().pipe(
      tap(() => {
        Logger.log(`TCP >> End process '${processID}' >> method '${handlerName}' after ${Date.now() - now}ms`);
      }),
      catchError((err) => {
        Logger.error(`TCP >> Error in process '${processID}' >> method '${handlerName}'`, err.stack);
        throw err;
      }),
    );

    // return next.handle().pipe(
    //   map((data: ResponseDTO<unknown>) => {
    //     const durationMs = Date.now() - startTime;
    //     data.processID = processID;
    //     data.duration = `${durationMs} ms`;
    //     return data;
    //   }),
    //   catchError((err) => {
    //     this.logger.error(err);

    //     const durationMs = Date.now() - startTime;

    //     const message = err?.response?.message || err?.message || err || HTTP_MESSAGE.INTERNAL_SERVER_ERROR;
    //     const statusCode =
    //       err?.code || err?.statusCode || err?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    //     const errorResponse = {
    //       message,
    //       statusCode,
    //       data: null,
    //       processID,
    //       duration: `${durationMs} ms`,
    //     };
    //     throw new HttpException(new ResponseDTO(errorResponse), statusCode);
    //   }),
    // );
  }
}
