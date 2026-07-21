import { BaseConfiguration } from '@common/configuration/base.config';
import { HttpPortConfiguration } from '@common/configuration/http.config';
import { TcpConfiguration } from '@common/configuration/tcp.config';
import { TypeORMConfiguration } from '@common/configuration/typeorm.config';
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
  @Type(() => TypeORMConfiguration)
  TYPEORM_CONFIG = new TypeORMConfiguration();
}

export const CONFIGURATION = new Configuration();

CONFIGURATION.validate();
