import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { ERROR_CODE } from '@common/constants/lib/enum/error-code.enum';
import { INVOICE_STATUS } from '@common/constants/lib/enum/invoice.enum';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import { CreateInvoiceTCPRequest, SendInvoiceTCPRequest } from '@common/interfaces/lib/tcp/invoice';
import { UploadFileTCPRequest, UploadFileTCPResponse } from '@common/interfaces/lib/tcp/media';
import { GeneratePdfTCPRequest, GeneratePdfTCPResponse } from '@common/interfaces/lib/tcp/pdf-generator';
import { KafkaService } from '@common/kafka/lib/kafka.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { firstValueFrom, map } from 'rxjs';
import { PaymentService } from '../../payment/services/payment.service';
import { createCheckoutSessionMapping, invoiceRequestMapping } from '../mappers';
import { InvoiceRepository } from '../repositories/invoice.repository';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly paymentService: PaymentService,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorTcpService: TcpClient,
    @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaTcpService: TcpClient,
    private readonly kafkaClient: KafkaService,
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

    if (invoice.status !== INVOICE_STATUS.CREATED) {
      throw new BadRequestException(ERROR_CODE.INVOICE_CANNOT_BE_SENT);
    }

    const pdfBase64 = await this.generateInvoicePdf(invoice, processId);

    if (!pdfBase64) {
      throw new InternalServerErrorException('Failed to generate invoice PDF');
    }

    const fileUrl = await this.uploadFile(
      {
        fileBase64: pdfBase64,
        fileName: `invoice-${invoiceId}`,
      },
      processId,
    );

    if (!fileUrl) {
      throw new InternalServerErrorException('Failed to upload invoice PDF');
    }

    const checkoutData = await this.paymentService.createCheckoutSession(createCheckoutSessionMapping(invoice));

    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: new ObjectId(userId),
      fileUrl,
    });

    this.kafkaClient.emit('invoice.sent', {
      invoiceId,
      clientEmail: invoice.client.email,
    });

    return checkoutData.url;
  }

  private generateInvoicePdf(data: GeneratePdfTCPRequest, processId: string) {
    return firstValueFrom(
      this.pdfGeneratorTcpService
        .send<GeneratePdfTCPResponse, GeneratePdfTCPRequest>(TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF, {
          data,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }

  private uploadFile(data: UploadFileTCPRequest, processId: string) {
    return firstValueFrom(
      this.mediaTcpService
        .send<UploadFileTCPResponse, UploadFileTCPRequest>(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE, { data, processId })
        .pipe(map((data) => data.data)),
    );
  }

  async updateInvoicePaid(invoiceId: string, processId: string) {
    return this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.PAID,
    });
  }
}
