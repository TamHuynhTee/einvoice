import { GRPCLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { TcpServerTracingInterceptor } from '@common/interceptors/tracing-server.interceptor';
import { Response } from '@common/interfaces/grpc/common/response.interface';
import { GetUserByIdRequest, GetUserByIdResponse } from '@common/interfaces/grpc/user-access';
import { User } from '@common/schemas/user.schema';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '../services/user.service';

@Controller()
@UseInterceptors(GRPCLoggingInterceptor, TcpServerTracingInterceptor)
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserAccessService', 'getUserById')
  async getUserById(params: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const user = (await this.userService.getUserByUserId(params.userId)) as User;
    return Response.success<User>(user);
  }
}
