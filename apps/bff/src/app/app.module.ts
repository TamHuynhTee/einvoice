import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/lib/grpc.config';
import { RedisProvider } from '@common/configuration/lib/redis.config';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/lib/tcp.config';
import { ThrottlerProvider } from '@common/configuration/lib/throttler.config';
import { PermissionsGuard } from '@common/guards/lib/permission.guard';
import { UserGuard } from '@common/guards/lib/user.guard';
import { ExceptionsInterceptor } from '@common/interceptors/lib/exceptions.interceptor';
import { LoggerMiddleware } from '@common/middlewares/lib/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CONFIGURATION } from '../configuration';
import { AuthorizerModule } from './modules/authorizer/authorizer.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    InvoiceModule,
    ProductModule,
    UserModule,
    AuthorizerModule,
    WebhookModule,
    HealthModule,
    ClientsModule.registerAsync([
      TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE),
      GrpcProvider(GRPC_SERVICES.AUTHORIZER_SERVICE),
    ]),
    RedisProvider,
    ThrottlerProvider,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ExceptionsInterceptor },
    { provide: APP_GUARD, useClass: UserGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  static CONFIGURATION = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
