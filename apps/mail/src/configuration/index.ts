import { BaseConfiguration } from '@common/configuration/base.config';
import { HttpPortConfiguration } from '@common/configuration/http.config';
import { KafkaConfiguration } from '@common/configuration/kafka.config';
import { MailConfiguration } from '@common/configuration/mail.config';
import { TcpConfiguration } from '@common/configuration/tcp.config';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => HttpPortConfiguration)
  HTTP_SERV = new HttpPortConfiguration();

  @ValidateNested()
  @Type(() => KafkaConfiguration)
  KAFKA_CONFIG = new KafkaConfiguration();

  @ValidateNested()
  @Type(() => MailConfiguration)
  MAIL_CONFIG = new MailConfiguration();

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_SERV = new TcpConfiguration();
}

export const CONFIGURATION = new Configuration();

CONFIGURATION.validate();
