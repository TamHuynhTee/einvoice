import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/lib/request-param.decorator';
import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import { CreateUserTCPRequest, UserTCPResponse } from '@common/interfaces/lib/tcp/user';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { HTTP_MESSAGE } from '@common/constants/lib/enum/http-message.enum';
import { ProcessId } from '@common/decorators/lib/processId.decorator';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: TCP_REQUEST_MESSAGE.USER.CREATE })
  async create(
    @RequestParams() data: CreateUserTCPRequest,
    @ProcessId() processId: string,
  ): Promise<Response<UserTCPResponse>> {
    await this.userService.create(data, processId);
    return Response.success<UserTCPResponse>(HTTP_MESSAGE.CREATED);
  }
}
