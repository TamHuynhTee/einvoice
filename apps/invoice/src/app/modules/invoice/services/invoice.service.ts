import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { CreateInvoiceTCPRequest } from '@common/interfaces/lib/tcp/invoice';
import { invoiceRequestMapping } from '../mappers';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  create(params: CreateInvoiceTCPRequest) {
    const input = invoiceRequestMapping(params);
    return this.invoiceRepository.create(input);
  }
}
