import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION } from '../configuration';
import { MailModule } from './modules/mail/mail.module';
import { MailTemplateModule } from './modules/mail-template/mail-template.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    MailModule,
    MailTemplateModule,
  ],
  exports: [],
})
export class AppModule {
  static CONFIGURATION = CONFIGURATION;
}
