import { BaseConfiguration } from '@common/configuration/base.config';
import { AppConfiguration } from '@common/configuration/app.config';
import { TcpConfiguration } from '@common/configuration/tcp.config';
import { TypeORMConfiguration } from '@common/configuration/typeorm.config';
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
  @Type(() => TypeORMConfiguration)
  TYPEORM_CONFIG = new TypeORMConfiguration();
}

export const CONFIGURATION = new Configuration();

CONFIGURATION.validate();
