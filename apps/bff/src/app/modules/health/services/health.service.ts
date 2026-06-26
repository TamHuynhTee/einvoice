import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisOptions, TcpClientOptions, Transport } from '@nestjs/microservices';
import { HealthCheckService, MemoryHealthIndicator, MicroserviceHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly memoryHealth: MemoryHealthIndicator,
    private readonly microservices: MicroserviceHealthIndicator,
    private readonly configServices: ConfigService,
  ) {}

  checkMemoryHeap() {
    return this.healthCheckService.check([() => this.memoryHealth.checkHeap('memory_heap', 150 * 1024 ** 2)]);
  }

  checkReadiness() {
    const tcpServices = [
      { key: TCP_SERVICES.INVOICE_SERVICE, configKey: 'TCP_SERV.TCP_INVOICE_SERVICE' },
      { key: TCP_SERVICES.PRODUCT_SERVICE, configKey: 'TCP_SERV.TCP_PRODUCT_SERVICE' },
      { key: TCP_SERVICES.AUTHORIZER_SERVICE, configKey: 'TCP_SERV.TCP_AUTHORIZER_SERVICE' },
      { key: TCP_SERVICES.MEDIA_SERVICE, configKey: 'TCP_SERV.TCP_MEDIA_SERVICE' },
      { key: TCP_SERVICES.USER_ACCESS_SERVICE, configKey: 'TCP_SERV.TCP_USER_ACCESS_SERVICE' },
      { key: TCP_SERVICES.PDF_GENERATOR_SERVICE, configKey: 'TCP_SERV.TCP_PDF_GENERATOR_SERVICE' },
    ];
    const grpcServices = [
      { key: GRPC_SERVICES.AUTHORIZER_SERVICE, configKey: 'GRPC_SERV.GRPC_AUTHORIZER_SERVICE' },
      { key: GRPC_SERVICES.USER_ACCESS_SERVICE, configKey: 'GRPC_SERV.GRPC_USER_ACCESS_SERVICE' },
    ];

    const tcpChecks = tcpServices.map((tcp) => () => this.checkTCPServices(tcp.key, tcp.configKey));
    const grpcChecks = grpcServices.map((grpc) => () => this.checkGRPCServices(grpc.key, grpc.configKey));

    return this.healthCheckService.check([...tcpChecks, ...grpcChecks, () => this.checkRedisServer()]);
  }

  private checkTCPServices(key: string, configKey: string) {
    return this.microservices.pingCheck<TcpClientOptions>(key, {
      transport: Transport.TCP,
      options: {
        host: this.configServices.get<string>(`${configKey}.options.host`),
        port: this.configServices.get<number>(`${configKey}.options.port`),
      },
    });
  }

  private checkGRPCServices(key: string, configKey: string) {
    const url = this.configServices.get<string>(`${configKey}.options.url`);
    if (!url) throw Error('');
    const [host, port] = url.split(':');
    return this.microservices.pingCheck<TcpClientOptions>(key, {
      transport: Transport.TCP, // Check GRPC must use TCP transport, maybe because GRPC connection needs .proto files
      options: {
        host,
        port: Number(port),
      },
    });
  }

  private checkRedisServer() {
    return this.microservices.pingCheck<RedisOptions>('redis', {
      transport: Transport.REDIS,
      options: {
        host: this.configServices.get<string>(`REDIS_CONFIG.HOST`),
        port: this.configServices.get<number>(`REDIS_CONFIG.PORT`),
      },
    });
  }

  checkStartup() {
    return {
      status: HTTP_MESSAGE.OK,
    };
  }
}
