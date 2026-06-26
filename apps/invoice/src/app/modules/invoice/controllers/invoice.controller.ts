import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { TCPLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import {
  CreateInvoiceTCPRequest,
  InvoiceTCPResponse,
  SendInvoiceTCPRequest,
  SendInvoiceTCPResponse,
} from '@common/interfaces/tcp/invoice';
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
    await this.invoiceService.sendById(data, processId);
    return Response.success<string>(HTTP_MESSAGE.OK);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.UPDATE_INVOICE_PAID)
  async updateInvoicePaid(
    @RequestParams() invoiceId: string,
    @ProcessId() processId: string,
  ): Promise<Response<SendInvoiceTCPResponse>> {
    await this.invoiceService.updateInvoicePaid(invoiceId, processId);

    return Response.success<string>(HTTP_MESSAGE.UPDATED);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.GET_BY_ID)
  async getInvoiceById(@RequestParams() invoiceId: string) {
    const invoice = await this.invoiceService.getById(invoiceId);
    return Response.success<InvoiceTCPResponse>(invoice);
  }
}
