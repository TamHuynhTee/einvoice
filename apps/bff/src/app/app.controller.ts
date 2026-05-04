import { ResponseDTO } from '@common/interfaces/lib/gateway/response.interface';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import { ProcessId } from '@common/decorators/lib/processId.decorator';
import { Controller, Get, Inject } from '@nestjs/common';
import { map } from 'rxjs';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: TcpClient,
  ) {}

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDTO({ data: result });
  }

  @Get('invoice')
  async getInvoice(@ProcessId() processId: string) {
    return this.invoiceClient
      .send<string, { invoiceId: number; invoiceName: string }>(
        { cmd: 'get_invoice' },
        {
          data: {
            invoiceId: 1,
            invoiceName: 'Hoa don 1',
          },
          processId,
        },
      )
      .pipe(map((res) => new ResponseDTO<string>(res)));
  }
}
