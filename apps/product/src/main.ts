/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { initTracing } from '@common/observability/tracing/tracing';

initTracing('PRODUCT');

import { TcpConfiguration } from '@common/configuration/tcp.config';
import {
  DEFAULT_HTTP_SERVICE_PORT,
  DEFAULT_TCP_HOST,
  DEFAULT_TCP_SERVICE_PORT,
} from '@common/constants/common.constants';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const tcpProductServicePort =
    AppModule.CONFIGURATION.TCP_SERV.TCP_PRODUCT_SERVICE.options?.port || DEFAULT_TCP_SERVICE_PORT.PRODUCT;
  const tcpProductServiceHost = AppModule.CONFIGURATION.TCP_SERV.TCP_PRODUCT_SERVICE.options?.host || DEFAULT_TCP_HOST;

  app.connectMicroservice<MicroserviceOptions>(
    TcpConfiguration.setValue(tcpProductServicePort, tcpProductServiceHost) as MicroserviceOptions,
  );

  const globalPrefix = AppModule.CONFIGURATION.GLOBAL_PREFIX;
  app.setGlobalPrefix(globalPrefix);
  const port = AppModule.CONFIGURATION.APP_CONFIG.PORT || DEFAULT_HTTP_SERVICE_PORT.PRODUCT;

  await app.listen(port);
  await app.startAllMicroservices();

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
