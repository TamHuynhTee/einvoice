import { BaseConfiguration } from '@common/configuration/lib/base.config';
import { AppConfiguration } from '@common/configuration/lib/app.config';
import { TcpConfiguration } from '@common/configuration/lib/tcp.config';
import { MongoConfiguration } from '@common/configuration/lib/mongo.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_SERV = new TcpConfiguration();

  @ValidateNested()
  @Type(() => MongoConfiguration)
  MONGO_CONFIG = new MongoConfiguration();
}

export const CONFIGURATION = new Configuration();

CONFIGURATION.validate();
