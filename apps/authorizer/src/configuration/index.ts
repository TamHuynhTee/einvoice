import { BaseConfiguration } from '@common/configuration/base.config';
import { GrpcConfiguration } from '@common/configuration/grpc.config';
import { HttpPortConfiguration } from '@common/configuration/http.config';
import { KeycloakConfiguration } from '@common/configuration/keycloak.config';
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
  @Type(() => KeycloakConfiguration)
  KEYCLOAK_CONFIG = new KeycloakConfiguration();

  @ValidateNested()
  @Type(() => GrpcConfiguration)
  GRPC_SERV = new GrpcConfiguration();
}

export const CONFIGURATION = new Configuration();

CONFIGURATION.validate();
