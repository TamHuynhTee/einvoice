import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
import { LoginRequestDto, LoginResponseDto } from '@common/interfaces/gateway/authorizer';
import { ResponseDTO } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { LoginTCPRequest, LoginTCPResponse } from '@common/interfaces/tcp/authorizer';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';

@ApiTags('Authorizer')
@Controller('authorizer')
export class AuthorizerController {
  constructor(@Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerService: TcpClient) {}

  @Post('login')
  @ApiOkResponse({ type: ResponseDTO<LoginResponseDto> })
  @ApiOperation({ summary: 'Login with username and password' })
  login(@Body() data: LoginRequestDto, @ProcessId() processId: string) {
    return this.authorizerService
      .send<LoginTCPResponse, LoginTCPRequest>(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN, {
        processId,
        data,
      })
      .pipe(map((data) => new ResponseDTO(data)));
  }
}
