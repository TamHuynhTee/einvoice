import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { TCPLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { GeneratePdfTCPRequest, GeneratePdfTCPResponse } from '@common/interfaces/tcp/pdf-generator';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InvoicePdfService } from '../services/invoice-pdf.service';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class InvoicePdfController {
  constructor(private readonly invoicePdfService: InvoicePdfService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF)
  async createInvoicePdf(@RequestParams() data: GeneratePdfTCPRequest): Promise<Response<GeneratePdfTCPResponse>> {
    const result = await this.invoicePdfService.generateInvoicePdf(data);
    return Response.success<GeneratePdfTCPResponse>(Buffer.from(result).toString('base64'));
  }
}
