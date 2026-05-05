import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import { ProcessId } from '@common/decorators/lib/processId.decorator';
import { RequestParams } from '@common/decorators/lib/request-param.decorator';
import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InvoiceService } from '../services/invoice.service';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern({ cmd: 'get_invoice' })
  getInvoice(
    @ProcessId() processId: string,
    @RequestParams() params: { invoiceId: string; invoiceName: string },
    @RequestParams('invoiceId') invoiceId: string,
  ): Response<string> {
    Logger.debug(`processId: ${processId}`);
    Logger.debug(`invoiceId: ${invoiceId}`);
    Logger.debug(`invoiceName: ${params.invoiceName}`);

    return Response.success(`Invoice #${invoiceId} - ${params.invoiceName} - Process ID: ${processId}`);
  }
}
