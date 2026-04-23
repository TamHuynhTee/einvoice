import { BaseConfiguration } from '@common/configuration/lib/base.config';
import { AppConfiguration } from '@common/configuration/lib/app.config';

class Configuration extends BaseConfiguration {
  APP_CONFIG = new AppConfiguration();
}

export const CONFIGURATION = new Configuration();
