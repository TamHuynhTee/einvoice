import axios, { AxiosRequestConfig } from 'axios';
import { getAccessToken } from '../support/auth.helper';
import { CreateInvoiceRequestDto, CreateInvoiceResponseDto } from '@common/interfaces/lib/gateway/invoice';

describe('Invoice e2e (HTTP)', () => {
  const defaultAxiosHeader: AxiosRequestConfig['headers'] = {};

  beforeAll(async () => {
    const authData = await getAccessToken();
    defaultAxiosHeader.Authorization = 'Bearer ' + authData.accessToken;
  });

  it('should create an invoice and send it', async () => {
    const createPayload: CreateInvoiceRequestDto = {
      client: {
        name: 'Client A',
        email: 'fejibeg893@ocuser.com',
        address: '123 $$$',
      },
      items: [
        {
          productId: 'prod_1',
          name: 'Product 1',
          quantity: 2,
          unitPrice: 100,
          vatRate: 0.1,
          total: 220,
        },
      ],
    };
    try {
      const createRes = await axios.post<{ data: CreateInvoiceResponseDto }>('/invoice', createPayload, {
        headers: { ...defaultAxiosHeader },
      });

      expect(createRes.status).toBe(201);
      const invoice = createRes.data.data;
      expect(invoice).toBeDefined();

      const sendRes = await axios.post(`/invoice/${invoice.id}/send`, {}, { headers: { ...defaultAxiosHeader } });
      expect(sendRes.status).toBe(201);
    } catch (e) {
      console.error(e);
    }
  }, 10000);
});
