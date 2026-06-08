import { AppConfiguration } from '@common/configuration/lib/app.config';
import { BaseConfiguration } from '@common/configuration/lib/base.config';
import { GrpcConfiguration } from '@common/configuration/lib/grpc.config';
import { RedisConfiguration } from '@common/configuration/lib/redis.config';
import { StripeConfiguration } from '@common/configuration/lib/stripe.config';
import { TcpConfiguration } from '@common/configuration/lib/tcp.config';
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
}

export const CONFIGURATION = new Configuration();

CONFIGURATION.validate();
