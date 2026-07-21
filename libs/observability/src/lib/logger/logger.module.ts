import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { TransportTargetOptions } from 'pino';

@Module({})
export class LoggerModule {
  static forRoot(appName: string) {
    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory(configService: ConfigService) {
            const targets: TransportTargetOptions[] = [];

            // 1. Pretty print for non-production
            if (configService.get('NODE_ENV') !== 'production') {
              targets.push({
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  translateTime: 'SYS:standard',
                },
              });
            }

            // 2. Loki push (Enable via env var)
            if (configService.get('LOKI_CONFIG.ENABLE_LOKI_PUSH')) {
              targets.push({
                target: 'pino-loki',
                options: {
                  batching: true,
                  interval: 5,
                  host: configService.get('LOKI_CONFIG.LOKI_HOST') || 'http://localhost:3100',
                  labels: { application: appName },
                },
              });
            }

            return {
              pinoHttp: {
                transport: targets.length > 0 ? { targets } : undefined,
                autoLogging: false,
                serializers: {
                  req: () => undefined,
                  res: () => undefined,
                },
              },
            };
          },
        }),
      ],
      exports: [],
    };
  }
}
