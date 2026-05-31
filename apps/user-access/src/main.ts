/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { TcpConfiguration } from '@common/configuration/lib/tcp.config';
import {
  DEFAULT_HTTP_SERVICE_PORT,
  DEFAULT_TCP_HOST,
  DEFAULT_TCP_SERVICE_PORT,
} from '@common/constants/lib/common.constants';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const tcpUserAccessServicePort =
    AppModule.CONFIGURATION.TCP_SERV.TCP_USER_ACCESS_SERVICE.options?.port || DEFAULT_TCP_SERVICE_PORT.USER_ACCESS;
  const tcpUserAccessServiceHost =
    AppModule.CONFIGURATION.TCP_SERV.TCP_USER_ACCESS_SERVICE.options?.host || DEFAULT_TCP_HOST;

  app.connectMicroservice<MicroserviceOptions>(
    TcpConfiguration.setValue(tcpUserAccessServicePort, tcpUserAccessServiceHost) as MicroserviceOptions,
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: AppModule.CONFIGURATION.GRPC_SERV.GRPC_USER_ACCESS_SERVICE.options?.package,
      protoPath: AppModule.CONFIGURATION.GRPC_SERV.GRPC_USER_ACCESS_SERVICE.options?.protoPath,
      url: AppModule.CONFIGURATION.GRPC_SERV.GRPC_USER_ACCESS_SERVICE.options?.url,
    },
  });

  const globalPrefix = AppModule.CONFIGURATION.GLOBAL_PREFIX;
  app.setGlobalPrefix(globalPrefix);
  const port = AppModule.CONFIGURATION.APP_CONFIG.PORT || DEFAULT_HTTP_SERVICE_PORT.USER_ACCESS;

  await app.listen(port);
  await app.startAllMicroservices();

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
