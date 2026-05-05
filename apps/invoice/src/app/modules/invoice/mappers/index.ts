import { CreateInvoiceTCPRequest } from '@common/interfaces/lib/tcp/invoice';
import { Invoice } from '@common/schemas/lib/invoice.schema';

export const invoiceRequestMapping = (data: CreateInvoiceTCPRequest): Partial<Invoice> => {
  return {
    ...data,
    totalAmount: data.items.reduce((total, item) => total + item.total, 0),
    vatAmount: data.items.reduce((total, item) => total + item.vatRate * item.quantity * (item.unitPrice / 100), 0),
  };
};
