import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { KeycloakHttpService } from '../services/keycloak-http.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import { RequestParams } from '@common/decorators/lib/request-param.decorator';
import { CreateKeyCloakUserRequest } from '@common/interfaces/lib/common/keycloak.interface';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class KeycloakController {
  constructor(private readonly keycloakHttpService: KeycloakHttpService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER)
  async createUser(@RequestParams() data: CreateKeyCloakUserRequest): Promise<Response<string>> {
    return Response.success<string>(await this.keycloakHttpService.createUser(data));
  }
}
