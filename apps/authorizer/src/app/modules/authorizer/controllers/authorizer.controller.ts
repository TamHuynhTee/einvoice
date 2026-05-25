import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/lib/request-param.decorator';
import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { LoginTCPRequest, LoginTCPResponse } from '@common/interfaces/lib/tcp/authorizer';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthorizerService } from '../services/authorizer.service';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class AuthorizerController {
  constructor(private readonly authorizerService: AuthorizerService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN)
  async login(@RequestParams() data: LoginTCPRequest): Promise<Response<LoginTCPResponse>> {
    const result = await this.authorizerService.login(data);
    return Response.success<LoginTCPResponse>(result);
  }
}
