import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import { ProcessId } from '@common/decorators/lib/processId.decorator';
import { RequestParams } from '@common/decorators/lib/request-param.decorator';
import { Controller, Get, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

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
