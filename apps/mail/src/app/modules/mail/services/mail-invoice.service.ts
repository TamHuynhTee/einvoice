import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { InvoiceSentPayload } from '@common/interfaces/lib/queue/invoice';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import { InvoiceTCPResponse } from '@common/interfaces/lib/tcp/invoice';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { MailTemplateService } from '../../mail-template/services/mail-template.service';
import { MailService } from './mail.service';

@Injectable()
export class MailInvoiceService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient,
    private readonly mailTemplateService: MailTemplateService,
    private readonly mailService: MailService,
  ) {}

  async sendInvoice(payload: InvoiceSentPayload, processId: string) {
    const invoice = await this.getInvoiceById(payload.id, processId);
    if (!invoice) {
      throw new BadRequestException('Invoice not available');
    }

    const html = await this.mailTemplateService.render('invoice', {
      clientName: invoice.client.name,
      senderName: this.configService.get<string>('MAIL_CONFIG.SENDER_NAME') || 'HUYNH TAM - EINVOICE',
      invoiceCode: `#${invoice.id}`,
      paymentLink: payload.paymentLink,
    });

    this.mailService.sendMail({
      html,
      subject: 'Send Invoice',
      to: invoice.client.email,
      attachments: [{ filename: `invoice-${invoice.id}.pdf`, path: invoice.fileUrl }],
    });
  }

  private getInvoiceById(id: string, processId: string) {
    return firstValueFrom(
      this.invoiceClient
        .send<InvoiceTCPResponse, string>(TCP_REQUEST_MESSAGE.INVOICE.GET_BY_ID, { data: id, processId })
        .pipe(map((data) => data.data)),
    );
  }
}
