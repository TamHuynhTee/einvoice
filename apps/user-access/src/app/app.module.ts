import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION } from '../configuration';
import { RoleModule } from './modules/role/role.module';
import { MongoProvider } from '@common/configuration/lib/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    MongoProvider,
    RoleModule,
  ],
})
export class AppModule {
  static CONFIGURATION = CONFIGURATION;
}
