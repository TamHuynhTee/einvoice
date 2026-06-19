import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { MailService } from '../services/mail.service';

@Controller()
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(private readonly mailService: MailService) {}

  @EventPattern('invoice.sent')
  async handleInvoiceSentEvent(
    @Payload() payload: { invoiceId: string; clientEmail: string },
    @Ctx() pattern: KafkaContext,
  ) {
    this.mailService.sendMail({
      subject: 'Mail invoice',
      to: payload.clientEmail,
      text: `Invoice: ${payload.invoiceId}`,
    });
  }
}
