import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { TCPLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { AuthorizeResponse, LoginTCPRequest, LoginTCPResponse } from '@common/interfaces/tcp/authorizer';
import { Response } from '@common/interfaces/tcp/common/response.interface';
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

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_USER_TOKEN)
  async verifyUserToken(
    @RequestParams() data: string,
    @ProcessId() processId: string,
  ): Promise<Response<AuthorizeResponse>> {
    const result = await this.authorizerService.verifyUserToken(data, processId);
    return Response.success<AuthorizeResponse>(result);
  }
}
