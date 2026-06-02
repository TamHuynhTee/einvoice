import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/lib/processId.decorator';
import { RequestParams } from '@common/decorators/lib/request-param.decorator';
import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import {
  CreateInvoiceTCPRequest,
  InvoiceTCPResponse,
  SendInvoiceTCPRequest,
  SendInvoiceTCPResponse,
} from '@common/interfaces/lib/tcp/invoice';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InvoiceService } from '../services/invoice.service';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.CREATE)
  async create(@RequestParams() data: CreateInvoiceTCPRequest): Promise<Response<InvoiceTCPResponse>> {
    const result = await this.invoiceService.create(data);
    return Response.success<InvoiceTCPResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.SEND)
  async send(
    @RequestParams() data: SendInvoiceTCPRequest,
    @ProcessId() processId: string,
  ): Promise<Response<SendInvoiceTCPResponse>> {
    const res = await this.invoiceService.sendById(data, processId);

    if (!res) {
      return Response.error('Failed to send invoice');
    }

    return Response.success<SendInvoiceTCPResponse>(res);
  }
}
