import { AppConfiguration } from '@common/configuration/lib/app.config';
import { BaseConfiguration } from '@common/configuration/lib/base.config';
import { TcpConfiguration } from '@common/configuration/lib/tcp.config';
import { CloudinaryConfiguration } from '@common/configuration/lib/cloudinary.config';
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
  @Type(() => CloudinaryConfiguration)
  CLOUDINARY_CONFIG = new CloudinaryConfiguration();
}

export const CONFIGURATION = new Configuration();

CONFIGURATION.validate();
