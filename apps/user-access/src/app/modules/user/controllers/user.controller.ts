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
import { User } from '@common/schemas/lib/user.schema';

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

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.GET_BY_USER_ID)
  async getByUserId(@RequestParams() userId: string) {
    const user = (await this.userService.getUserByUserId(userId)) as User;
    return Response.success<User>(user);
  }
}
