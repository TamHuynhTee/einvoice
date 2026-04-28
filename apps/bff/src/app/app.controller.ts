import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDTO } from '@common/interfaces/lib/gateway/response.interface';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDTO({ data: result });
  }
}
