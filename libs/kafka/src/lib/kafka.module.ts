import { QUEUE_SERVICES } from '@common/constants/enum/queue.enum';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { hostname } from 'os';

@Module({})
export class KafkaModule {
  static register(serviceName: QUEUE_SERVICES): DynamicModule {
    return {
      global: true,
      module: KafkaModule,
      providers: [
        {
          provide: KafkaService,
          useFactory: (client: ClientKafka) => new KafkaService(client),
          inject: [serviceName],
        },
      ],
      imports: [
        ConfigModule,
        ClientsModule.registerAsync([
          {
            name: serviceName,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory(configService: ConfigService) {
              return {
                transport: Transport.KAFKA,
                options: {
                  client: {
                    clientId: `${serviceName}-${hostname()}`,
                    brokers: [configService.get<string>(`KAFKA_CONFIG.URL`) || 'localhost:9092'],
                  },
                },
              };
            },
          },
        ]),
      ],
      exports: [KafkaService],
    };
  }
}
