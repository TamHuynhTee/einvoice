import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, GrpcOptions, Transport } from '@nestjs/microservices';
import { IsNotEmpty, IsObject } from 'class-validator';
import { join } from 'path';

export enum GRPC_SERVICES {
  USER_ACCESS_SERVICE = 'GRPC_USER_ACCESS_SERVICE',
  AUTHORIZER_SERVICE = 'GRPC_AUTHORIZER_SERVICE',
}

export class GrpcConfiguration {
  @IsNotEmpty()
  @IsObject()
  GRPC_USER_ACCESS_SERVICE: GrpcOptions & { name: string };

  @IsNotEmpty()
  @IsObject()
  GRPC_AUTHORIZER_SERVICE: GrpcOptions & { name: string };

  constructor() {
    this.GRPC_AUTHORIZER_SERVICE = GrpcConfiguration.setValue({
      key: GRPC_SERVICES.AUTHORIZER_SERVICE,
      protoPath: ['./proto/authorizer.proto'],
      host: process.env['AUTHORIZER_SERVICE_HOST'] || 'localhost',
      port: Number(process.env['AUTHORIZER_SERVICE_PORT']) || 5100,
    });

    this.GRPC_USER_ACCESS_SERVICE = GrpcConfiguration.setValue({
      key: GRPC_SERVICES.USER_ACCESS_SERVICE,
      protoPath: ['./proto/user-access.proto'],
      host: process.env['USER_ACCESS_SERVICE_HOST'] || 'localhost',
      port: Number(process.env['USER_ACCESS_SERVICE_PORT']) || 5101,
    });
  }

  private static setValue({
    key,
    protoPath,
    port = 5100,
    host = '127.0.0.1',
  }: {
    key: GRPC_SERVICES;
    protoPath: string | string[];
    port?: number;
    host?: string;
  }): GrpcOptions & { name: string } {
    return {
      name: key,
      transport: Transport.GRPC,
      options: {
        package: key,
        protoPath: Array.isArray(protoPath) ? protoPath.map((p) => join(__dirname, p)) : join(__dirname, protoPath),
        url: `${host}:${port}`,
      },
    };
  }
}

export function GrpcProvider(serviceName: keyof GrpcConfiguration): ClientsProviderAsyncOptions {
  return {
    name: serviceName,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return configService.get(`GRPC_SERV.${serviceName}`) as GrpcOptions & { name: string };
    },
  };
}
