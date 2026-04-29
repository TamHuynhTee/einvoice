/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { TcpConfiguration } from '@common/configuration/lib/tcp.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const tcpInvoiceServicePort = AppModule.CONFIGURATION.TCP_SERV.TCP_INVOICE_SERVICE.options?.port || 3201;
  const tcpInvoiceServiceHost = AppModule.CONFIGURATION.TCP_SERV.TCP_INVOICE_SERVICE.options?.host || 'localhost';

  app.connectMicroservice<MicroserviceOptions>(
    TcpConfiguration.setValue(tcpInvoiceServicePort, tcpInvoiceServiceHost) as MicroserviceOptions,
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3301;

  await app.listen(port);
  await app.startAllMicroservices();

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
