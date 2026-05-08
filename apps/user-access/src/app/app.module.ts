import { MongoProvider } from '@common/configuration/lib/mongo.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION } from '../configuration';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    MongoProvider,
    RoleModule,
    UserModule,
  ],
})
export class AppModule {
  static CONFIGURATION = CONFIGURATION;
}
