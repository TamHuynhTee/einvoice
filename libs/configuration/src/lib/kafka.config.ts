import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, TcpClientOptions } from '@nestjs/microservices';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class KafkaConfiguration {
  @IsNotEmpty()
  @IsString()
  HOST: string;

  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  URL: string;

  constructor(data?: Partial<KafkaConfiguration>) {
    this.HOST = data?.HOST || process.env['KAFKA_HOST'] || 'localhost';
    this.PORT = data?.PORT || Number(process.env['KAFKA_PORT']) || 9092;
    this.URL = data?.URL || process.env['KAFKA_URL'] || `${this.HOST}:${this.PORT}`;
  }
}

export function KafkaProvider(serviceName: keyof KafkaConfiguration): ClientsProviderAsyncOptions {
  return {
    name: serviceName,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return configService.get(`KAFKA_CONFIG.${serviceName}`) as TcpClientOptions;
    },
  };
}
