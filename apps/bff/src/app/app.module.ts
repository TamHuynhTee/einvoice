import { ExceptionsInterceptor } from '@common/interceptors/lib/exceptions.interceptor';
import { LoggerMiddleware } from '@common/middlewares/lib/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CONFIGURATION } from '../configuration';
import { InvoiceModule } from './modules/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    InvoiceModule,
  ],
  controllers: [],
  providers: [{ provide: APP_INTERCEPTOR, useClass: ExceptionsInterceptor }],
})
export class AppModule implements NestModule {
  static CONFIGURATION = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
