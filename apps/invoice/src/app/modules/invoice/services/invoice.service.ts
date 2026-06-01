import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { CreateInvoiceTCPRequest, SendInvoiceTCPRequest } from '@common/interfaces/lib/tcp/invoice';
import { invoiceRequestMapping } from '../mappers';
import { INVOICE_STATUS } from '@common/constants/lib/enum/invoice.enum';
import { ERROR_CODE } from '@common/constants/lib/enum/error-code.enum';
import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { firstValueFrom, map } from 'rxjs';
import { Invoice } from '@common/schemas/lib/invoice.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorTcpService: TcpClient,
  ) {}

  create(params: CreateInvoiceTCPRequest) {
    const input = invoiceRequestMapping(params);
    return this.invoiceRepository.create(input);
  }

  async sendById(params: SendInvoiceTCPRequest, processId: string) {
    const { invoiceId, userId } = params;
    const invoice = await this.invoiceRepository.getById(invoiceId);

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    const pdfBase64 = await this.generateInvoicePdf(invoice, processId);

    // TODO: Upload to Cloudinary

    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: new ObjectId(userId),
    });

    return pdfBase64;
  }

  generateInvoicePdf(data: Invoice, processId: string) {
    return firstValueFrom(
      this.pdfGeneratorTcpService
        .send<string, Invoice>(TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF, {
          data,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }
}
