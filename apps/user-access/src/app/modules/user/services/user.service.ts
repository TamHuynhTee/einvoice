import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserTCPRequest } from '@common/interfaces/lib/tcp/user';
import { ERROR_CODE } from '@common/constants/lib/enum/error-code.enum';
import { createUserRequestMapping } from '../mappers';
import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { CreateKeycloakUserTCPRequest } from '@common/interfaces/lib/tcp/authorizer';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient,
  ) {}

  async create(params: CreateUserTCPRequest, processId: string) {
    const isExists = await this.userRepository.exists(params.email);

    if (isExists) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const userId = await this.createKeycloakUser(
      {
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        password: params.password,
      },
      processId,
    );

    const input = createUserRequestMapping(params, userId || '');

    return this.userRepository.create(input);
  }

  createKeycloakUser(payload: CreateKeycloakUserTCPRequest, processId: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<string>(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER, {
          data: payload,
          processId,
        })
        .pipe(map((response) => response.data)),
    );
  }
}
