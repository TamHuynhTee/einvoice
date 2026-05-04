import { ResponseDTO } from '@common/interfaces/lib/gateway/response.interface';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
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
  async getInvoice() {
    return this.invoiceClient
      .send<string, number>(
        { cmd: 'get_invoice' },
        {
          data: 1,
          processId: '12321',
        },
      )
      .pipe(map((res) => new ResponseDTO<string>(res)));
  }
}
