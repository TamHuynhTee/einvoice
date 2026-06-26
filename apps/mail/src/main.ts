/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { DEFAULT_HTTP_SERVICE_PORT } from '@common/constants/common.constants';
import { QUEUE_GROUPS } from '@common/constants/enum/queue.enum';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [AppModule.CONFIGURATION.KAFKA_CONFIG.URL],
      },
      consumer: {
        groupId: QUEUE_GROUPS.MAIL,
        allowAutoTopicCreation: true,
      },
    },
  });

  const globalPrefix = AppModule.CONFIGURATION.GLOBAL_PREFIX;
  app.setGlobalPrefix(globalPrefix);
  const port = AppModule.CONFIGURATION.APP_CONFIG.PORT || DEFAULT_HTTP_SERVICE_PORT.MAIL;

  await app.listen(port);
  await app.startAllMicroservices();

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
