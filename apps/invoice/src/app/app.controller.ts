import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Request } from '@common/interfaces/lib/tcp/common/request.interface';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern({ cmd: 'get_invoice' })
  getInvoice(invoiceId: Request<number>): Response<string> {
    return Response.success(`Invoice #${invoiceId.data}`);
  }
}
