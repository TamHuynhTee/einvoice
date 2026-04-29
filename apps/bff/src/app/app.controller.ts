import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDTO } from '@common/interfaces/lib/gateway/response.interface';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: ClientProxy,
  ) {}

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDTO({ data: result });
  }

  @Get('invoice')
  async getInvoice() {
    const result = await firstValueFrom(this.invoiceClient.send<string, number>({ cmd: 'get_invoice' }, 1));
    return new ResponseDTO<string>({ data: result });
  }
}
