import { Module } from '@nestjs/common';
import { MailController } from './controllers/media.controller';
import { MailService } from './services/media.service';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
