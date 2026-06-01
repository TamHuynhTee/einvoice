import { CallHandler, ExecutionContext, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { HTTP_MESSAGE } from '@common/constants/lib/enum/http-message.enum';

@Injectable()
export class GRPCLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GRPCLoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> | Promise<Observable<unknown>> {
    const now = Date.now();
    const handler = context.getHandler();
    const handlerName = handler.name;

    const args = context.getArgs();

    const param = args[0];

    const processID = param.processId;

    this.logger.log(
      `GRPC >> Start process '${processID}' >> method '${handlerName}' at ${now} >> input: ${JSON.stringify(param)}`,
    );

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`GRPC >> End process '${processID}' >> method '${handlerName}' after ${Date.now() - now}ms`);
      }),
      catchError((err) => {
        this.logger.error(
          `GRPC >> Error in process '${processID}': ${err.message} >> data: '${JSON.stringify(param)}', after ${Date.now() - now}ms`,
        );
        throw new RpcException({
          code: err?.status || err?.code || err?.code?.code || HttpStatus.INTERNAL_SERVER_ERROR,
          message: err?.response?.message || err?.message || HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
        });
      }),
    );
  }
}
