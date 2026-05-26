import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { MetadataKeys } from '@common/constants/lib/common.constants';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { type ExtendedRequest } from '@common/interfaces/lib/common';
import { AuthorizeResponse } from '@common/interfaces/lib/tcp/authorizer';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import { getAccessToken, setUserData } from '@common/utils/lib/request.util';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);

  constructor(
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient,
    private readonly reflect: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authOptions = this.reflect.getAllAndOverride<{ secured: boolean }>(MetadataKeys.SECURED, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest<ExtendedRequest>();

    if (!authOptions?.secured) {
      return true;
    }

    return this.verifyToken(req);
  }

  private async verifyToken(request: ExtendedRequest): Promise<boolean> {
    try {
      const token = getAccessToken(request);

      if (!token) {
        throw new UnauthorizedException('Access token is missing');
      }
      const processId = request[MetadataKeys.PROCESS_ID];

      if (!processId) {
        throw new UnauthorizedException('Process ID is missing');
      }

      const result = await this.verifyUserToken(token, processId);

      if (!result || !result.valid) {
        throw new UnauthorizedException('Invalid or missing access token');
      }

      setUserData(request, result);

      return true;
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Invalid or missing access token');
    }
  }

  private async verifyUserToken(token: string, processId: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<AuthorizeResponse, string>(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_USER_TOKEN, { data: token, processId })
        .pipe(map((response) => response.data)),
    );
  }
}
