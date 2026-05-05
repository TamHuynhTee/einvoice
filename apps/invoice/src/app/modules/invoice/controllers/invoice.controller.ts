import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/lib/request-param.decorator';
import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import { CreateInvoiceTCPRequest, InvoiceTCPResponse } from '@common/interfaces/lib/tcp/invoice';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InvoiceService } from '../services/invoice.service';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern({ cmd: TCP_REQUEST_MESSAGE.INVOICE.CREATE })
  async create(@RequestParams() data: CreateInvoiceTCPRequest): Promise<Response<InvoiceTCPResponse>> {
    const result = await this.invoiceService.create(data);
    return Response.success<InvoiceTCPResponse>(result);
  }
}
