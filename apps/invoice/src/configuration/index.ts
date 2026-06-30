import { BaseConfiguration } from '@common/configuration/base.config';
import { HttpPortConfiguration } from '@common/configuration/http.config';
import { LokiConfiguration } from '@common/configuration/loki.config';
import { MongoConfiguration } from '@common/configuration/mongo.config';
import { StripeConfiguration } from '@common/configuration/stripe.config';
import { TcpConfiguration } from '@common/configuration/tcp.config';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => HttpPortConfiguration)
  HTTP_SERV = new HttpPortConfiguration();

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_SERV = new TcpConfiguration();

  @ValidateNested()
  @Type(() => MongoConfiguration)
  MONGO_CONFIG = new MongoConfiguration({
    DB_NAME: 'einvoice-invoice',
  });

  @ValidateNested()
  @Type(() => StripeConfiguration)
  STRIPE_CONFIG = new StripeConfiguration();

  @ValidateNested()
  @Type(() => LokiConfiguration)
  LOKI_CONFIG = new LokiConfiguration();
}

export const CONFIGURATION = new Configuration();

CONFIGURATION.validate();
