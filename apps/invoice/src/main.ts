/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { TcpConfiguration } from '@common/configuration/lib/tcp.config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import {
  DEFAULT_HTTP_SERVICE_PORT,
  DEFAULT_TCP_HOST,
  DEFAULT_TCP_SERVICE_PORT,
} from '@common/constants/lib/common.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const tcpInvoiceServicePort =
    AppModule.CONFIGURATION.TCP_SERV.TCP_INVOICE_SERVICE.options?.port || DEFAULT_TCP_SERVICE_PORT.INVOICE;
  const tcpInvoiceServiceHost = AppModule.CONFIGURATION.TCP_SERV.TCP_INVOICE_SERVICE.options?.host || DEFAULT_TCP_HOST;

  app.connectMicroservice<MicroserviceOptions>(
    TcpConfiguration.setValue(tcpInvoiceServicePort, tcpInvoiceServiceHost) as MicroserviceOptions,
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = AppModule.CONFIGURATION.APP_CONFIG.PORT || DEFAULT_HTTP_SERVICE_PORT.INVOICE;

  await app.listen(port);
  await app.startAllMicroservices();

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
