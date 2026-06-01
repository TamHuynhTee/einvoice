import { CreateInvoiceRequestDto } from '../../gateway/invoice';

export type CreateInvoiceTCPRequest = CreateInvoiceRequestDto;

export type SendInvoiceTCPRequest = {
  invoiceId: string;
  userId: string;
};
