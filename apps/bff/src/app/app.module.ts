import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION } from '../configuration';
import { LoggerMiddleware } from '@common/middlewares/lib/logger.middleware';
import { ExceptionsInterceptor } from '@common/interceptors/lib/exceptions.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/lib/tcp.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.INVOICE_SERVICE)]),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_INTERCEPTOR, useClass: ExceptionsInterceptor }],
})
export class AppModule implements NestModule {
  static CONFIGURATION = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
