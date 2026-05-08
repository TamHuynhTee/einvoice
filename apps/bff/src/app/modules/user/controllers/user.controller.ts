import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/lib/processId.decorator';
import { CreateUserRequestDto } from '@common/interfaces/lib/gateway/user';
import { ResponseDTO } from '@common/interfaces/lib/gateway/response.interface';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import { CreateUserTCPRequest, UserTCPResponse } from '@common/interfaces/lib/tcp/user';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(@Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessService: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDTO<string> })
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() data: CreateUserRequestDto, @ProcessId() processId: string) {
    return this.userAccessService
      .send<UserTCPResponse, CreateUserTCPRequest>(
        { cmd: TCP_REQUEST_MESSAGE.USER.CREATE },
        {
          processId,
          data,
        },
      )
      .pipe(map((data) => new ResponseDTO(data)));
  }
}
