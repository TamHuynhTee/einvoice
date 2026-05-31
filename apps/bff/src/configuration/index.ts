import { BaseConfiguration } from '@common/configuration/lib/base.config';
import { AppConfiguration } from '@common/configuration/lib/app.config';
import { TcpConfiguration } from '@common/configuration/lib/tcp.config';
import { RedisConfiguration } from '@common/configuration/lib/redis.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GrpcConfiguration } from '@common/configuration/lib/grpc.config';

class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_SERV = new TcpConfiguration();

  @ValidateNested()
  @Type(() => RedisConfiguration)
  REDIS_CONFIG = new RedisConfiguration();

  @ValidateNested()
  @Type(() => GrpcConfiguration)
  GRPC_SERV = new GrpcConfiguration();
}

export const CONFIGURATION = new Configuration();

CONFIGURATION.validate();
