import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION } from '../configuration';
import { KeycloakModule } from './modules/keycloak/keycloak.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    KeycloakModule,
  ],
})
export class AppModule {
  static CONFIGURATION = CONFIGURATION;
}
