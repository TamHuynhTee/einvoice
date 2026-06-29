/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { initTracing } from '@common/observability/tracing/tracing';

initTracing('BFF');

import { DEFAULT_HTTP_SERVICE_PORT } from '@common/constants/common.constants';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { Logger as PinoLogger } from '@common/observability/logger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      rawBody: true,
      bufferLogs: true,
    });
    const globalPrefix = AppModule.CONFIGURATION.GLOBAL_PREFIX;

    app.useLogger(app.get(PinoLogger));
    app.enableCors({ origin: '*' });
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // Swagger Documentation
    const config = new DocumentBuilder()
      .setTitle('E-bff API')
      .setDescription('The E-bff API description')
      .setVersion('1.0.0')
      .addBearerAuth({
        description: 'Default JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
      })
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory);

    const port = AppModule.CONFIGURATION.APP_CONFIG.PORT || DEFAULT_HTTP_SERVICE_PORT.BFF;
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    Logger.log(`🚀 Documentation is running on: http://localhost:${port}/${globalPrefix}/docs`);
  } catch (error) {
    Logger.error('Application failed to start: ', error, '', 'Bootstrap', false);
  }
}

bootstrap();
