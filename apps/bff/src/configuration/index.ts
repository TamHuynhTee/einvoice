import { AppConfiguration } from '@common/configuration/app.config';
import { BaseConfiguration } from '@common/configuration/base.config';
import { GrpcConfiguration } from '@common/configuration/grpc.config';
import { RedisConfiguration } from '@common/configuration/redis.config';
import { StripeConfiguration } from '@common/configuration/stripe.config';
import { TcpConfiguration } from '@common/configuration/tcp.config';
import { LokiConfiguration } from '@common/configuration/loki.config';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

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

  @ValidateNested()
  @Type(() => StripeConfiguration)
  STRIPE_CONFIG = new StripeConfiguration();

  @ValidateNested()
  @Type(() => LokiConfiguration)
  LOKI_CONFIG = new LokiConfiguration();
}

export const CONFIGURATION = new Configuration();

CONFIGURATION.validate();
