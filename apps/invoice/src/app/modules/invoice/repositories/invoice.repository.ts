import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { Invoice, InvoiceModel, InvoiceModelName } from '@common/schemas/invoice.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InvoiceRepository {
  constructor(@InjectModel(InvoiceModelName) private readonly invoiceModel: InvoiceModel) {}

  create(data: Partial<Invoice>) {
    const payload = { ...data, status: INVOICE_STATUS.CREATED };
    return this.invoiceModel.create(payload);
  }

  getById(id: string) {
    return this.invoiceModel.findById(id);
  }

  updateById(id: string, data: Partial<Invoice>) {
    return this.invoiceModel.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  }

  deleteById(id: string) {
    return this.invoiceModel.findByIdAndDelete(id);
  }
}
