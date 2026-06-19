import { CreateCheckoutSessionRequest } from '@common/interfaces/lib/common';
import { CreateInvoiceTCPRequest } from '@common/interfaces/lib/tcp/invoice';
import { Invoice } from '@common/schemas/lib/invoice.schema';

export const invoiceRequestMapping = (data: CreateInvoiceTCPRequest): Partial<Invoice> => {
  return {
    ...data,
    totalAmount: data.items.reduce((total, item) => total + item.total, 0),
    vatAmount: data.items.reduce((total, item) => total + item.vatRate * item.quantity * (item.unitPrice / 100), 0),
  };
};

export const createCheckoutSessionMapping = (invoice: Invoice): CreateCheckoutSessionRequest => {
  return {
    invoiceId: invoice.id,
    clientEmail: invoice.client.email,
    lineItems: invoice.items.map((item) => ({
      name: item.name,
      price: item.unitPrice,
      quantity: item.quantity,
    })),
  };
};
