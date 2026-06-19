import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class MailController {
  private readonly logger = new Logger(MailController.name);

  @EventPattern('invoice.sent')
  async handleInvoiceSentEvent(@Payload() payload: any, @Ctx() pattern: KafkaContext) {
    this.logger.log(`Received event ${pattern} with payload:`, payload);
  }
}
