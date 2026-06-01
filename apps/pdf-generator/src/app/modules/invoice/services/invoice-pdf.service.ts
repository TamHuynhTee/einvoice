import { GeneratePdfTCPRequest } from '@common/interfaces/lib/tcp/pdf-generator';
import { Injectable } from '@nestjs/common';
import { PdfService } from '../../pdf/services/pdf.service';
import path from 'path';

@Injectable()
export class InvoicePdfService {
  constructor(private readonly pdfService: PdfService) {
    return;
  }

  generateInvoicePdf(invoice: GeneratePdfTCPRequest): Promise<Uint8Array<ArrayBufferLike>> {
    const templatePath = path.join(__dirname, 'templates', 'invoice.template.ejs');

    const subTotal = invoice.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);

    const data = {
      client: invoice.client,
      status: invoice.status,
      items: invoice.items,
      vatAmount: invoice.vatAmount,
      totalAmount: subTotal,
      subTotal,
    };

    return this.pdfService.generatePdfFromEjs(templatePath, data);
  }
}
