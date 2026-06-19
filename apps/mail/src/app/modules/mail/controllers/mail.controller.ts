import { InvoiceSentPayload } from '@common/interfaces/lib/queue/invoice';
import { KAFKA_TOPIC } from '@common/constants/lib/enum/kafka-topic.enum';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailInvoiceService } from '../services/mail-invoice.service';
import { RequestParams } from '@common/decorators/lib/request-param.decorator';
import { ProcessId } from '@common/decorators/lib/processId.decorator';

@Controller()
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(private readonly mailInvoiceService: MailInvoiceService) {}

  @EventPattern(KAFKA_TOPIC.INVOICE.SENT)
  async invoiceSentEvent(@RequestParams() payload: InvoiceSentPayload, @ProcessId() processId: string) {
    await this.mailInvoiceService.sendInvoice(payload, processId);
  }
}
