import { Response } from '@common/interfaces/lib/grpc/common/response.interface';
import { VerifyUserTokenRequest, VerifyUserTokenResponse } from '@common/interfaces/lib/grpc/authorizer';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthorizerService } from '../services/authorizer.service';
import { GRPCLoggingInterceptor } from '@common/interceptors/lib/grpcLogging.interceptor';

@Controller()
@UseInterceptors(GRPCLoggingInterceptor)
export class AuthorizerGrpcController {
  constructor(private readonly authorizerService: AuthorizerService) {}

  @GrpcMethod('AuthorizerService', 'verifyUserToken')
  async verifyUserToken(params: VerifyUserTokenRequest): Promise<VerifyUserTokenResponse> {
    const result = await this.authorizerService.verifyUserToken(params.token, params.processId);
    return Response.success(result);
  }
}
