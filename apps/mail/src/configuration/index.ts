import { AppConfiguration } from '@common/configuration/lib/app.config';
import { BaseConfiguration } from '@common/configuration/lib/base.config';
import { KafkaConfiguration } from '@common/configuration/lib/kafka.config';
import { MailConfiguration } from '@common/configuration/lib/mail.config';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => KafkaConfiguration)
  KAFKA_CONFIG = new KafkaConfiguration();

  @ValidateNested()
  @Type(() => MailConfiguration)
  MAIL_CONFIG = new MailConfiguration();
}

export const CONFIGURATION = new Configuration();

CONFIGURATION.validate();
